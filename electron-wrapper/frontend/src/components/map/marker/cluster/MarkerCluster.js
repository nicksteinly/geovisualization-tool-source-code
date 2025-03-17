class MarkerCluster {
  constructor(
    sourceId,
    mapInstance,
    data,
    color,
    size,
    setSelectedLocation,
    selectIcon,
    popupType,
    clusterOptions = {}
  ) {
    this.mapInstance = mapInstance;
    this.data = data;
    this.color = color;
    this.clusterOptions = clusterOptions;
    // this.sourceId = 'point-source';
    this.layerIdClusters = this.generateUniqueId("clusters");
    this.layerIdClusterCount = this.generateUniqueId("cluster-count");
    this.layerIdIndividualMarkers = this.generateUniqueId("individual-markers");
    this.sourceId = sourceId;
    this.size = size;
    this.setSelectedLocation = setSelectedLocation;
    this.selectIcon = selectIcon;
    this.popupType = popupType;
  }

  // Generate a unique ID for each cluster or layer
  generateUniqueId(prefix = "id") {
    const uniqueId = `${this.sourceId}-${prefix}-${Date.now()}-${Math.random()
      .toString(36)
      .substring(2, 9)}`;
    return uniqueId;
  }

  initializeCluster() {
    const geoJson = {
      type: "FeatureCollection",
      features: this.data.map((point) => ({
        type: "Feature",
        geometry: {
          type: "Point",
          coordinates: point.geometry.coordinates,
        },
        properties: point.properties,
      })),
    };
    // Add GeoJSON source with clustering
    this.mapInstance.addSource(this.sourceId, {
      type: "geojson",
      data: geoJson,
      cluster: true,
    });

    this.mapInstance.addLayer({
      id: this.layerIdClusters,
      type: "circle",
      source: this.sourceId,
      filter: ["has", "point_count"],
      paint: {
        "circle-color": this.color, // Single color for all clusters
        "circle-radius": [
          "max",
          this.size,
          [
            "min",
            ["+", this.size, ["*", ["log10", ["get", "point_count"]], 5]],
            this.size * 5,
          ],
        ],
        "circle-stroke-width": 1,
        "circle-stroke-color": "white",
        "circle-stroke-opacity": 1,
      },
    });

    // Add cluster count layer
    this.mapInstance.addLayer({
      id: this.layerIdClusterCount,
      type: "symbol",
      source: this.sourceId,
      filter: ["has", "point_count"],
      layout: {
        "text-field": "{point_count_abbreviated}",
        "text-size": 12,
      },
      paint: {
        "text-color": "white",
      },
    });

    // Add individual marker layer for unclustered points
    this.mapInstance.addLayer({
      id: this.layerIdIndividualMarkers,
      type: "circle",
      source: this.sourceId,
      filter: ["!", ["has", "point_count"]],
      paint: {
        "circle-color": this.color,
        "circle-radius": this.size,
        "circle-stroke-width": 1,
        "circle-stroke-color": "white",
      },
    });

    // Event listener to zoom in on cluster click
    this.mapInstance.on("click", this.layerIdClusters, (e) => {
      const features = this.mapInstance.queryRenderedFeatures(e.point, {
        layers: [this.layerIdClusters],
      });
      const clusterId = features[0].properties.cluster_id;
      this.mapInstance
        .getSource(this.sourceId)
        .getClusterExpansionZoom(clusterId, (err, zoom) => {
          if (err) return;
          this.mapInstance.easeTo({
            center: features[0].geometry.coordinates,
            zoom: zoom + 0.5,
          });
        });
    });

    // Cursor style change on hover over clusters
    this.mapInstance.on("mouseenter", this.layerIdClusters, () => {
      this.mapInstance.getCanvas().style.cursor = "pointer";
    });
    this.mapInstance.on("mouseleave", this.layerIdClusters, () => {
      this.mapInstance.getCanvas().style.cursor = "";
    });

    // Event listener to zoom in on cluster click
    this.mapInstance.on("click", this.layerIdIndividualMarkers, (e) => {
      const features = this.mapInstance.queryRenderedFeatures(e.point, {
        layers: [this.layerIdIndividualMarkers],
      });

      if (features.length > 0) {
        const feature = features[0]; // Get the first clicked feature
        this.selectIcon(feature);
        this.setSelectedLocation(feature.geometry.coordinates);

        const customerPopup = new this.popupType(feature);

        customerPopup.popup.addTo(this.mapInstance);
      }
    });

    this.mapInstance.on("mouseenter", this.layerIdIndividualMarkers, () => {
      this.mapInstance.getCanvas().style.cursor = "pointer";
    });
    this.mapInstance.on("mouseleave", this.layerIdIndividualMarkers, () => {
      this.mapInstance.getCanvas().style.cursor = "";
    });
  }

  updateClusterData(newData) {
    this.data = newData;
    const geoJson = {
      type: "FeatureCollection",
      features: this.data.map((point) => ({
        type: "Feature",
        geometry: {
          type: "Point",
          coordinates: point.geometry.coordinates,
        },
        properties: point.properties,
      })),
    };

    this.mapInstance.getSource(this.sourceId).setData(geoJson);
  }

  removeCluster() {
    if (this.mapInstance.getSource(this.sourceId)) {
      this.mapInstance.removeLayer(this.layerIdClusters);
      this.mapInstance.removeLayer(this.layerIdClusterCount);
      this.mapInstance.removeSource(this.sourceId);
    }
  }

  setSize(size) {
    this.size = size;

    // Update the circle-radius paint property dynamically
    if (this.mapInstance.getLayer(this.layerIdClusters)) {
      this.mapInstance.setPaintProperty(this.layerIdClusters, "circle-radius", [
        "max",
        this.size,
        [
          "min",
          ["+", this.size, ["*", ["log10", ["get", "point_count"]], 5]],
          this.size * 5,
        ],
      ]);
    }
    if (this.mapInstance.getLayer(this.layerIdClusterCount)) {
      this.mapInstance.setLayoutProperty(
        this.layerIdClusterCount,
        "text-size",
        this.size
      );
    }
    if (this.mapInstance.getLayer(this.layerIdIndividualMarkers)) {
      this.mapInstance.setPaintProperty(
        this.layerIdIndividualMarkers,
        "circle-radius",
        this.size
      );
    }
  }

  setColor(color) {
    this.color = color;

    // Update the circle-color paint property dynamically
    if (this.mapInstance.getLayer(this.layerIdClusters)) {
      this.mapInstance.setPaintProperty(
        this.layerIdClusters,
        "circle-color",
        this.color
      );
    }

    if (this.mapInstance.getLayer(this.layerIdIndividualMarkers)) {
      this.mapInstance.setPaintProperty(
        this.layerIdIndividualMarkers,
        "circle-color",
        this.color
      );
    }
  }

  toggleClusterAndCountVisibility(visibility) {
    this.toggleLayerVisibility(this.layerIdClusters, visibility);
    this.toggleLayerVisibility(this.layerIdClusterCount, visibility);
    this.toggleLayerVisibility(this.layerIdIndividualMarkers, visibility);
  }

  toggleLayerVisibility(layerId, visibility) {
    this.mapInstance.setLayoutProperty(
      layerId,
      "visibility",
      visibility ? "visible" : "none"
    );
  }
}

export default MarkerCluster;

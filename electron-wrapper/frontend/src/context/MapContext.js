import React, {
  createContext,
  useContext,
  useRef,
  useState,
  useEffect,
} from "react";
import {
  initializeMap,
  fetchAPIKey,
  fetchGeojsonData,
  fetchColors,
  setColors,
  initializeClusters,
  updateMarkerProperties,
  updateClusterProperties,
  toggleClusterAndCountVisibility,
} from "./MapContextService";
import { useIconContext } from "../context/SelectedIconContext";
import { NearestTechnicianListOverlay } from "../components/map/overlay/NearestTechnicianOverlay";
import { NearestTechniciansAPI } from "../api/NearestTechniciansAPI";
import { MapUploadAPI } from "../api/MapUploadAPI";
import { GeofenceAPI } from "../api/GeofenceAPI";
import { GeofenceDataOverlay } from "../components/map/overlay/GeofenceDataOverlay";
import { DrivingIsochroneAPI } from "../api/DrivingIsochroneAPI";

const MapContext = createContext();

export const useMapContext = () => useContext(MapContext);

export const MapProvider = ({ children }) => {
  const mapElement = useRef(null);
  const [mapInstance, setMapInstance] = useState();
  const [apiKey, setAPIKey] = useState(null);
  const [customers, setCustomers] = useState([]);
  const [technicians, setTechnicians] = useState([]);
  const [coordinates, setCoordinates] = useState([]);
  const geofencingEnabledRef = useRef(false);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [timeBudget, setTimeBudget] = useState(60); // Default time budget in minutes
  const [maxMiles, setMaxMiles] = useState(60);
  const [bottleneck, setBottleneck] = useState("time");
  const [customerColor, setCustomerColor] = useState();
  const [technicianColor, setTechnicianColor] = useState();
  const [markerSize, setMarkerSize] = useState(10);
  const [customerClusterInstance, setCustomerClusterInstance] = useState(null);
  const [technicianClusterInstance, setTechnicianClusterInstance] =
    useState(null);
  const { selectIcon } = useIconContext();

  const mapUploadAPI = new MapUploadAPI();
  const techniciansAPI = new NearestTechniciansAPI();
  const geofenceAPI = new GeofenceAPI();
  const drivingIsochroneAPI = new DrivingIsochroneAPI();

  const init = async () => {
    const key = await fetchAPIKey();
    setAPIKey(key);

    if (key) {
      const mapInstance = initializeMap(key, mapElement.current);
      setMapInstance(mapInstance);
      const { customers, technicians } = await fetchGeojsonData();
      setCustomers(customers);
      setTechnicians(technicians);
      console.log(customers);

      const colors = await fetchColors();
      setCustomerColor(colors.customerIconColor);
      setTechnicianColor(colors.technicianIconColor);

      const { customerCluster, technicianCluster } = initializeClusters(
        mapInstance,
        customers,
        technicians,
        colors.customerIconColor,
        colors.technicianIconColor,
        markerSize,
        setSelectedLocation,
        selectIcon
      );
      setCustomerClusterInstance(customerCluster);
      setTechnicianClusterInstance(technicianCluster);

      const geofenceClickListener = (event) => {
        const { lng, lat } = event.lngLat;
        updateGeofenceCoordinates(lng, lat);
      };

      mapInstance.on("click", geofenceClickListener);
    }
  };

  useEffect(() => {
    if (customerClusterInstance) {
      updateClusterProperties(
        customerClusterInstance,
        customerColor,
        markerSize
      );
    }
  }, [customerColor, markerSize]);

  useEffect(() => {
    if (technicianClusterInstance) {
      updateClusterProperties(
        technicianClusterInstance,
        technicianColor,
        markerSize
      );
    }
  }, [technicianColor, markerSize]);

  // Add and clear isochrones
  const clearIsochrone = () => {
    if (mapInstance?.getSource("isochroneSource")) {
      mapInstance.removeLayer("isochroneLayer");
      mapInstance.removeSource("isochroneSource");
    }
  };

  const addIsochrone = (boundary) => {
    if (!mapInstance) return;

    const geojsonCoordinates = boundary.map((point) => [
      point.longitude,
      point.latitude,
    ]);

    const geojsonPolygon = {
      type: "Feature",
      geometry: {
        type: "Polygon",
        coordinates: [geojsonCoordinates],
      },
    };

    mapInstance.addSource("isochroneSource", {
      type: "geojson",
      data: geojsonPolygon,
    });

    mapInstance.addLayer({
      id: "isochroneLayer",
      type: "fill",
      source: "isochroneSource",
      layout: {},
      paint: {
        "fill-color": "#FF0000",
        "fill-opacity": 0.5,
      },
    });
  };

  const getReachableTechnicians = async () => {
    if (!selectedLocation) {
      alert("Please select a marker first.");
      return;
    }

    const [lng, lat] = selectedLocation;

    const data = await drivingIsochroneAPI.fetchReachableRange({
      latitude: lat,
      longitude: lng,
      timeBudget: timeBudget * 60, // Convert time budget to seconds
      maxMiles: maxMiles,
      bottleneck: bottleneck,
    });

    if (data?.reachableRange?.boundary) {
      clearIsochrone();
      addIsochrone(data.reachableRange.boundary);
    } else {
      alert("No isochrone data received.");
    }

    const nearestTechnicianData = await techniciansAPI.getNearestTechnicians({
      customerLocation: { lat: lat, lng: lng },
      timeBudget: timeBudget * 60,
      maxMiles: maxMiles,
      bottleneck: bottleneck,
    });
    console.log(nearestTechnicianData);
    const overlay = new NearestTechnicianListOverlay({
      map: mapInstance,
      position: { lat: lat, lng: lng },
      techniciansData: nearestTechnicianData,
      onClick: (position, data) => {
        console.log("Overlay clicked at:", position, data);
      },
      onClose: () => {
        console.log("Overlay closed");
      },
    });

    overlay.addToMap();
  };

  const updateGeofenceCoordinates = (lng, lat) => {
    if (geofencingEnabledRef.current) {
      // effectively use pointer to geofencingEnable variable so that react closure does not use stale value when variable toggles
      setCoordinates((prev) => [...prev, [lng, lat]]);
    }
  };

  const toggleGeofencing = () => {
    geofencingEnabledRef.current = !geofencingEnabledRef.current;
    console.log("Geofencing Enabled:", geofencingEnabledRef.current);
  };

  const handleGeofenceClick = () => {
    if (!mapInstance) return;

    if (coordinates.length > 1) {
      const existingLayer = mapInstance.getLayer("geofence-layer");
      if (existingLayer) {
        mapInstance.removeLayer("geofence-layer");
        mapInstance.removeSource("geofence-source");
      }

      mapInstance.addSource("geofence-source", {
        type: "geojson",
        data: {
          type: "Feature",
          geometry: {
            type: "Polygon",
            coordinates: [[...coordinates, coordinates[0]]],
          },
        },
      });

      mapInstance.addLayer({
        id: "geofence-layer",
        type: "fill",
        source: "geofence-source",
        paint: {
          "fill-color": "#FF0000",
          "fill-opacity": 0.5,
        },
      });
    }
  };

  useEffect(() => {
    handleGeofenceClick();
  }, [coordinates]);

  const removeGeofence = () => {
    if (!mapInstance) return;

    // Remove the geofence layer and source if they exist
    const existingGeofenceLayer = mapInstance.getLayer("geofence-layer");
    const existingGeofenceSource = mapInstance.getSource("geofence-source");

    if (existingGeofenceLayer) {
      mapInstance.removeLayer("geofence-layer");
    }

    if (existingGeofenceSource) {
      mapInstance.removeSource("geofence-source");
    }

    // Clear coordinates and reset the index
    setCoordinates([]);
  };

  const displayGeofenceData = async () => {
    const geofenceStats = await geofenceAPI.getGeofenceData({
      coordinates: coordinates,
    });
    console.log(geofenceStats);
    const overlay = new GeofenceDataOverlay({
      map: mapInstance,
      geofenceData: geofenceStats,
      onClick: (position, data) => {
        console.log("Overlay clicked at:", position, data);
      },
      onClose: () => {
        console.log("Overlay closed");
      },
    });

    overlay.addToMap();
  };

  const removeCoordinate = (index) => {
    if (index >= 0 && index < coordinates.length) {
      const newCoordinates = coordinates.filter((_, i) => i !== index);
      setCoordinates(newCoordinates);
    }
  };

  // Set the center of the map
  const setMapCenter = (lat, long) => {
    if (mapInstance) {
      mapInstance.setCenter({ lat, lng: long });
    } else {
      console.error("mapInstance is not defined.");
    }
  };

  // Set the zoom level of the map
  const setMapZoom = (zoom) => {
    if (mapInstance) {
      mapInstance.setZoom(zoom);
    } else {
      console.error("mapInstance is not defined.");
    }
  };

  const changeCustomerColor = (color) => {
    setCustomerColor(color);
    setColors({ customerColor: color, technicianColor: technicianColor });
  };

  const changeTechnicianColor = (color) => {
    setTechnicianColor(color);
    setColors({ customerColor: customerColor, technicianColor: color });
  };

  const resizeMap = () => {
    // ¯\_(ツ)_/¯
    // window.dispatchEvent(new Event('resize'));
  };

  const changeCustomerLayerVisibility = (visibility) => {
    toggleClusterAndCountVisibility(customerClusterInstance, visibility);
  };

  const changeTechnicianLayerVisibility = (visibility) => {
    toggleClusterAndCountVisibility(technicianClusterInstance, visibility);
  };

  return (
    <MapContext.Provider
      value={{
        mapElement,
        coordinates,
        customerColor,
        technicianColor,
        changeCustomerColor,
        changeTechnicianColor,
        changeCustomerLayerVisibility,
        changeTechnicianLayerVisibility,
        markerSize,
        setMarkerSize,
        init,
        selectedLocation,
        timeBudget,
        setTimeBudget,
        maxMiles,
        setMaxMiles,
        bottleneck,
        setBottleneck,
        getReachableTechnicians,
        removeCoordinate,
        toggleGeofencing,
        removeGeofence,
        displayGeofenceData,
        setMapCenter,
        setMapZoom,
        resizeMap,
        customerClusterInstance,
        customers,
        technicians,
      }}
    >
      {children}
    </MapContext.Provider>
  );
};

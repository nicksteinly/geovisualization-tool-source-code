import React, { useEffect, useState, useRef } from "react";
import tt from "@tomtom-international/web-sdk-maps";
import "@tomtom-international/web-sdk-maps/dist/maps.css";
import { ConfigAPI } from "../../api/ConfigAPI";
import { MapUploadAPI } from "../../api/MapUploadAPI";
import "../../css/tom-tom-map.css";

/**
 * `HeatMap` component renders a heatmap visualization of customer and technician locations
 * using the TomTom Maps SDK.
 *
 * @component
 */
const HeatMap = () => {
  // Reference to store the map container
  const mapRef = useRef(null);

  // State variables for API key and data
  const [apiKey, setAPIKey] = useState("");
  const [customersData, setCustomersData] = useState(null);
  const [techniciansData, setTechniciansData] = useState(null);

  // Instances of API classes
  const configAPI = new ConfigAPI();
  const mapUploadAPI = new MapUploadAPI();

  // Reference to store the map instance
  const mapInstance = useRef(null);

  /**
   * Fetch API key and GeoJSON data for customers and technicians.
   * Runs once when the component mounts.
   */
  useEffect(() => {
    const fetchAPIKeyAndData = async () => {
      try {
        const key = await configAPI.getTomTomApiKey();
        setAPIKey(key);

        const customersResponse = await mapUploadAPI.getCustomersGeojson();
        const techniciansResponse = await mapUploadAPI.getTechniciansGeojson();

        if (customersResponse && techniciansResponse) {
          setCustomersData(customersResponse);
          setTechniciansData(techniciansResponse);
        }
      } catch (error) {
        console.error("Error fetching API key or GeoJSON data:", error);
      }
    };

    fetchAPIKeyAndData();
  }, []);

  /**
   * Initializes the TomTom map and adds heatmap layers once all required data is available.
   * Runs whenever `apiKey`, `customersData`, or `techniciansData` changes.
   */
  useEffect(() => {
    if (!apiKey || !customersData || !techniciansData) return;

    // Create a new TomTom map instance
    const map = tt.map({
      key: apiKey,
      container: "tom-tom-map-container",
      center: [-98.5795, 39.8283], // Default center: USA
      zoom: 2,
    });

    // Store the map instance
    mapInstance.current = map;

    map.on("load", () => {
      try {
        // Add customer heatmap layer
        map.addSource("customers-source", {
          type: "geojson",
          data: customersData,
        });

        map.addLayer({
          id: "customers-heatmap",
          type: "heatmap",
          source: "customers-source",
          paint: {
            "heatmap-intensity": 2,
            "heatmap-radius": 10,
            "heatmap-color": [
              "interpolate",
              ["linear"],
              ["heatmap-density"],
              0, "rgba(0, 0, 255, 0)",    // Low density (transparent blue)
              0.3, "rgba(0, 0, 255, 0.5)", // Medium-low density
              0.6, "rgba(0, 255, 255, 0.8)", // Medium-high density
              1, "rgba(0, 255, 255, 1)",   // High density (bright cyan)
            ],
            "heatmap-opacity": 0.9,
          },
        });

        // Add technician heatmap layer
        map.addSource("technicians-source", {
          type: "geojson",
          data: techniciansData,
        });

        map.addLayer({
          id: "technicians-heatmap",
          type: "heatmap",
          source: "technicians-source",
          paint: {
            "heatmap-intensity": 2,
            "heatmap-radius": 10,
            "heatmap-color": [
              "interpolate",
              ["linear"],
              ["heatmap-density"],
              0, "rgba(255, 0, 0, 0)",    // Low density (transparent red)
              0.3, "rgba(255, 165, 0, 0.5)", // Medium-low density
              0.6, "rgba(255, 69, 0, 0.8)",  // Medium-high density
              1, "rgba(255, 0, 0, 1)",   // High density (bright red)
            ],
            "heatmap-opacity": 0.9,
          },
        });
      } catch (error) {
        console.error("Error adding heatmaps or map layers:", error);
      }
    });

    // Cleanup function to remove map instance on component unmount
    return () => {
      if (mapInstance.current) {
        mapInstance.current.remove();
      }
    };
  }, [apiKey, customersData, techniciansData]);

  return (
    <div style={{ position: "relative" }}>
      {/* Map container */}
      <div id="tom-tom-map-container" ref={mapRef} />

      {/* Legend for the heatmap */}
      <div
        style={{
          position: "absolute",
          top: "10px",
          left: "10px",
          backgroundColor: "rgba(255, 255, 255, 0.9)",
          padding: "10px",
          borderRadius: "5px",
          boxShadow: "0 2px 6px rgba(0, 0, 0, 0.3)",
        }}
      >
        <h4 style={{ margin: "0 0 10px 0", fontSize: "14px" }}>Legend</h4>
        <div style={{ display: "flex", alignItems: "center", marginBottom: "5px" }}>
          <div
            style={{
              width: "20px",
              height: "10px",
              background: "linear-gradient(to right, rgba(0, 0, 255, 0), rgba(0, 255, 255, 1))",
              marginRight: "10px",
            }}
          />
          <span style={{ fontSize: "12px" }}>Customer Density</span>
        </div>
        <div style={{ display: "flex", alignItems: "center" }}>
          <div
            style={{
              width: "20px",
              height: "10px",
              background: "linear-gradient(to right, rgba(255, 0, 0, 0), rgba(255, 0, 0, 1))",
              marginRight: "10px",
            }}
          />
          <span style={{ fontSize: "12px" }}>Technician Density</span>
        </div>
      </div>
    </div>
  );
};

export default HeatMap;

import tt from "@tomtom-international/web-sdk-maps";
import { MapUploadAPI } from "../api/MapUploadAPI";
import { ConfigAPI } from "../api/ConfigAPI";
import CustomerMarkerCluster from "../components/map/marker/cluster/CustomerMarkerCluster";
import TechnicianMarkerCluster from "../components/map/marker/cluster/TechnicianMarkerCluster";

const mapAPI = new MapUploadAPI();
const configAPI = new ConfigAPI();

// Initialize the map
export const initializeMap = (apiKey, mapElement) => {
  if (apiKey && mapElement && mapElement instanceof HTMLElement) {
    const mapInstance = tt.map({
      key: apiKey,
      container: mapElement,
      center: [-98.5795, 39.8283],
      zoom: 2,
    });

    return mapInstance;
  } else {
    console.error("Map container is not valid.");
    return null;
  }
};

// Fetch API Key from Config API
export const fetchAPIKey = async () => {
  try {
    const key = await configAPI.getTomTomApiKey();
    return key;
  } catch (error) {
    console.error("Error fetching API key:", error);
    return null;
  }
};

// Fetch customer and technician GeoJSON data
export const fetchGeojsonData = async () => {
  try {
    const customersResponse = await mapAPI.getCustomersGeojson();
    const techniciansResponse = await mapAPI.getTechniciansGeojson();
    return {
      customers: customersResponse.features,
      technicians: techniciansResponse.features,
    };
  } catch (error) {
    console.error("Error fetching GeoJSON data:", error);
    return { customers: [], technicians: [] };
  }
};

// Fetch the color configuration
export const fetchColors = async () => {
  try {
    const colors = await configAPI.getMapLegendColors(); // Fetch color configuration
    return colors;
  } catch (error) {
    console.error("Error fetching colors:", error);
    return { customerIconColor: null, technicianIconColor: null };
  }
};

// Set colors of the customers and technicians icons on the maps
export const setColors = async ({ customerColor, technicianColor }) => {
  try {
    const colors = await configAPI.updateColors(customerColor, technicianColor); // Fetch color configuration
    return colors;
  } catch (error) {
    console.error("Error fetching colors:", error);
    return { customerIconColor: null, technicianIconColor: null };
  }
};

// Initialize clusters
export const initializeClusters = (
  mapInstance,
  customersResponse,
  techniciansResponse,
  customerColor,
  technicianColor,
  markerSize,
  setSelectedLocation,
  selectIcon
) => {
  const customerCluster = new CustomerMarkerCluster(
    "customer-source",
    mapInstance,
    customersResponse,
    customerColor,
    markerSize,
    setSelectedLocation,
    selectIcon
  );
  customerCluster.initializeCluster();

  const technicianCluster = new TechnicianMarkerCluster(
    "technician-source",
    mapInstance,
    techniciansResponse,
    technicianColor,
    markerSize,
    setSelectedLocation,
    selectIcon
  );
  technicianCluster.initializeCluster();

  return { customerCluster, technicianCluster };
};

// Handle marker updates
export const updateMarkerProperties = (markers, color, size) => {
  markers.forEach((marker) => marker?.setColor(color));
  markers.forEach((marker) => marker?.setSize(size));
};

// Handle cluster updates
export const updateClusterProperties = (clusterInstance, color, size) => {
  clusterInstance?.setColor(color);
  clusterInstance?.setSize(size);
};

export const toggleClusterAndCountVisibility = (
  clusterInstance,
  visibility
) => {
  clusterInstance?.toggleClusterAndCountVisibility(visibility);
};

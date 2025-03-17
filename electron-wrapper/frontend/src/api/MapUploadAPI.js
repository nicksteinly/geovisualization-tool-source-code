import { ConfigAPI } from "./ConfigAPI";

export class MapUploadAPI {
  /**
   * Fetches GeoJSON data for customers from the backend.
   *
   * Sends a GET request to the server to retrieve the customers' GeoJSON data.
   * The server responds with a GeoJSON object representing customer locations.
   *
   * @returns {Promise<Object>} - A promise that resolves with the customers' GeoJSON data.
   * @throws {Error} - Throws an error if the fetch operation fails or if there is an issue with the server response.
   */
  async getCustomersGeojson() {
    try {
      const apiUrl = `${ConfigAPI.BASE_URL}/map/get-customers-geojson`;
      const response = await fetch(apiUrl);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (err) {
      console.error("Failed to fetch customers GeoJSON:", err);
    }
  }

  /**
   * Fetches GeoJSON data for technicians from the backend.
   *
   * Sends a GET request to the server to retrieve the technicians' GeoJSON data.
   * The server responds with a GeoJSON object representing technician locations.
   *
   * @returns {Promise<Object>} - A promise that resolves with the technicians' GeoJSON data.
   * @throws {Error} - Throws an error if the fetch operation fails or if there is an issue with the server response.
   */
  async getTechniciansGeojson() {
    try {
      const apiUrl = `${ConfigAPI.BASE_URL}/map/get-technicians-geojson`;
      const response = await fetch(apiUrl);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (err) {
      console.error("Failed to fetch technicians GeoJSON:", err);
    }
  }

  /**
   * Retrieves the column headers from a CSV file.
   *
   * Sends a POST request to the backend to fetch the column headers of the provided CSV file.
   * The server responds with the CSV column headers.
   *
   * @param {File} csvFile - The CSV file to extract column headers from.
   * @returns {Promise<Object>} - A promise that resolves with the CSV column headers.
   * @throws {Error} - Throws an error if the fetch operation fails or if there is an issue with the server response.
   */
  async getCSVColumnHeaders(csvFile) {
    try {
      const apiUrl = `${ConfigAPI.BASE_URL}/map/get-csv-column-headers`;

      const formData = new FormData();
      formData.append("csvFile", csvFile);

      const response = await fetch(apiUrl, {
        method: "POST",
        body: formData, // sending FormData (not JSON)
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (err) {
      console.error("Failed to import and overwrite csv data:", err);
    }
  }

  /**
   * Imports customers' data from a CSV file into the system.
   *
   * Sends a POST request with the CSV file and corresponding header mappings to import customer data.
   * The server processes the file and stores the data accordingly.
   *
   * @param {Object} params - The parameters to send in the request.
   * @param {File} params.csvFile - The CSV file containing the customer data.
   * @param {Object} params.headerMappings - An object representing the header mappings for the CSV columns.
   * @returns {Promise<Object>} - A promise that resolves with the server's response after processing the CSV data.
   * @throws {Error} - Throws an error if the fetch operation fails or if there is an issue with the server response.
   */
  async replaceCustomersCSVData({ csvFile, headerMappings }) {
    try {
      const apiUrl = `${ConfigAPI.BASE_URL}/map/replace-customers-csv-data`;

      const formData = new FormData();
      formData.append("csvFile", csvFile);

      // Append headerMappings as a JSON string
      formData.append("headerMappings", JSON.stringify(headerMappings));

      const response = await fetch(apiUrl, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (err) {
      console.error("Failed to import and overwrite csv data:", err);
    }
  }

  /**
   * Imports technicians' data from a CSV file into the system.
   *
   * Sends a POST request with the CSV file to import technician data.
   * The server processes the file and stores the data accordingly.
   *
   * @param {File} csvFile - The CSV file containing the technician data.
   * @returns {Promise<Object>} - A promise that resolves with the server's response after processing the CSV data.
   * @throws {Error} - Throws an error if the fetch operation fails or if there is an issue with the server response.
   */
  async replaceTechniciansCSVData({ csvFile, headerMappings }) {
    try {
      const apiUrl = `${ConfigAPI.BASE_URL}/map/replace-technicians-csv-data`;

      const formData = new FormData();
      formData.append("csvFile", csvFile);

      // Append headerMappings as a JSON string
      formData.append("headerMappings", JSON.stringify(headerMappings));

      const response = await fetch(apiUrl, {
        method: "POST",
        body: formData, // sending FormData (not JSON)
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (err) {
      console.error("Failed to import and overwrite csv data:", err);
    }
  }

  async appendCustomersCSVData({ csvFile, headerMappings }) {
    try {
      const apiUrl = `${ConfigAPI.BASE_URL}/map/append-customers-csv-data`;

      const formData = new FormData();
      formData.append("csvFile", csvFile);

      // Append headerMappings as a JSON string
      formData.append("headerMappings", JSON.stringify(headerMappings));

      const response = await fetch(apiUrl, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (err) {
      console.error("Failed to import and overwrite csv data:", err);
    }
  }

  async appendTechniciansCSVData({ csvFile, headerMappings }) {
    try {
      const apiUrl = `${ConfigAPI.BASE_URL}/map/append-technicians-csv-data`;

      const formData = new FormData();
      formData.append("csvFile", csvFile);

      // Append headerMappings as a JSON string
      formData.append("headerMappings", JSON.stringify(headerMappings));

      const response = await fetch(apiUrl, {
        method: "POST",
        body: formData, // sending FormData (not JSON)
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (err) {
      console.error("Failed to import and overwrite csv data:", err);
    }
  }
}

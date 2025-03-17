import { ConfigAPI } from "./ConfigAPI";

export class GeofenceAPI {

  /**
   * Fetches geofence data for the given coordinates.
   * 
   * This method sends a POST request to the server to retrieve geofence data based on the provided coordinates.
   * The server processes the request and returns the geofence data as a response.
   * 
   * @param {Object} params - The parameters to send in the request.
   * @param {Array} params.coordinates - An array of coordinates (latitude, longitude) to define the location for geofence data.
   * @returns {Promise<Object>} - A promise that resolves with the response data from the API containing geofence information.
   * @throws {Error} - Throws an error if the fetch operation fails or if there is an issue with the server response.
   */
  async getGeofenceData({coordinates}) {
    try {
      // Send a POST request to the API with the provided coordinates
      const response = await fetch(`${ConfigAPI.BASE_URL}/geofence/get-geofence-data`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          coordinates: coordinates
        }),
      });
      
      // Parse the JSON response
      const data = await response.json();
      
      // Return the geofence data
      return data;
    } catch (error) {
      // Log and handle any errors during the fetch process
      console.error('Error fetching the geofence data:', error);
      throw error;
    }
  }
}

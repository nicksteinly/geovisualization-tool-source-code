import { ConfigAPI } from "./ConfigAPI";

export class NearestTechniciansAPI {

  /**
   * Fetches the nearest technicians based on the given parameters.
   * 
   * @param {Object} params - The parameters to send in the request.
   * @param {Object} params.customerLocation - The customer's location as a coordinate object (latitude, longitude).
   * @param {number} params.timeBudget - The time budget in minutes to calculate the reachable technicians.
   * @param {number} params.maxMiles - The maximum distance in miles to consider for technician availability.
   * @param {string} params.bottleneck - The bottleneck type, either "time" or "distance".
   * @returns {Promise<Object>} - A promise that resolves with the response data from the API.
   * @throws {Error} - Throws an error if the fetch operation or response is unsuccessful.
   */
  async getNearestTechnicians({ customerLocation, timeBudget, maxMiles, bottleneck}) {
    try {
      // Define the API endpoint and request body for the API call
      const apiUrl = `${ConfigAPI.BASE_URL}/technicians/nearest-technicians`;
      const requestBody = {
        customer_location: customerLocation, 
        time_budget: timeBudget,
        max_miles: maxMiles,
        bottleneck: bottleneck
      };
  
      console.log(requestBody); // Logging the request body for debugging
  
      // Send a POST request to the API
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });
  
      // Check if the response is successful
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
  
      // Parse and return the response data
      const data = await response.json();
      return data;
    } catch (err) {
      // Log and rethrow the error if the request fails
      console.error('Failed to fetch nearest technicians:', err);
      throw err;
    }
  }
}

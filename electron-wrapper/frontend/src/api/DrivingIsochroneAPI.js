import { ConfigAPI } from "./ConfigAPI";

export class DrivingIsochroneAPI {
  /**
   * Fetches the reachable range isochrone for a given customer location, time budget, and/or maximum distance.
   *
   * Sends a POST request to calculate the reachable range based on the provided latitude, longitude, time budget,
   * maximum miles, and bottleneck (either time or distance).
   *
   * @param {Object} params - The parameters to send in the request.
   * @param {number} params.latitude - The latitude of the customer location.
   * @param {number} params.longitude - The longitude of the customer location.
   * @param {number} params.timeBudget - The available time budget (in minutes) for calculating the reachable range.
   * @param {number} params.maxMiles - The maximum distance (in miles) for the reachable range.
   * @param {string} params.bottleneck - The bottleneck type for the calculation ("time" or "distance").
   * @returns {Promise<Object>} - A promise that resolves with the reachable range data from the API.
   * @throws {Error} - Throws an error if the fetch operation fails or if there is an issue with the server response.
   */
  async fetchReachableRange({
    latitude,
    longitude,
    timeBudget,
    maxMiles,
    bottleneck,
  }) {
    try {
      const response = await fetch(
        `${ConfigAPI.BASE_URL}/driving-isochrone/reachable-range`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            latitude: latitude,
            longitude: longitude,
            time_budget: timeBudget,
            max_miles: maxMiles,
            bottleneck: bottleneck,
          }),
        }
      );

      if (!response.ok) {
        const errorResponse = await response.json();
        console.error("Error from server:", errorResponse);
        throw new Error(errorResponse.error || "Unknown error");
      }

      const data = await response.json();
      console.log("API Response:", data);
      return data;
    } catch (error) {
      console.error("Unexpected error:", error);
    }
  }
}

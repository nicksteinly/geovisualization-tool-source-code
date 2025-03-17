/**
 * ConfigAPI class handles API requests related to Map configuration settings.
 */
export class ConfigAPI {
  /** Base URL for API requests */
  static BASE_URL = 'http://127.0.0.1:5000';

  /**
   * Fetches the TomTom API key from backend.
   * @returns {Promise<string | void>} The API key if available, otherwise logs an error.
   */
  async getTomTomApiKey() {
      try {
          const response = await fetch(`${ConfigAPI.BASE_URL}/config/get-tomtom-api-key`);
          const data = await response.json();
          if (data.api_key) {
              return data.api_key;
          } else {
              console.error('API key not found');
          }
      } catch (error) {
          console.error('Error fetching the API key:', error);
      }
  }

  /**
   * Updates the colors for the customer and technician icons on the map legend.
   * @param {string} customerColor - The new color for the customer icon.
   * @param {string} technicianColor - The new color for the technician icon.
   * @returns {Promise<void>} Logs success or error messages.
   */
  async updateColors(customerColor, technicianColor) {
      try {
          const response = await fetch(`${ConfigAPI.BASE_URL}/config/update-map-legend-colors`, {
              method: 'POST',
              headers: {
                  'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                  customerIconColor: customerColor,
                  technicianIconColor: technicianColor,
              }),
          });

          const data = await response.json();
          if (data.success) {
              console.log('Colors updated successfully');
          } else {
              console.error('Error updating colors:', data);
          }
      } catch (error) {
          console.error('Error sending the color update:', error);
      }
  }

  /**
   * Retrieves the current map legend colors for customer and technician icons.
   * @returns {Promise<{ customerIconColor: string, technicianIconColor: string } | void>} 
   * An object containing color values, or logs an error if unavailable.
   */
  async getMapLegendColors() {
      try {
          const response = await fetch(`${ConfigAPI.BASE_URL}/config/get-map-legend-colors`);
          const data = await response.json();
          if (data.customerIconColor && data.technicianIconColor) {
              return {
                  customerIconColor: data.customerIconColor,
                  technicianIconColor: data.technicianIconColor
              };
          } else {
              console.error('Color configuration not found');
          }
      } catch (error) {
          console.error('Error fetching the color configuration:', error);
      }
  }
}

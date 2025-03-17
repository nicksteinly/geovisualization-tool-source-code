import { MapOverlay } from "./MapOverlay";
import "../../../css/nearest-technician-overlay.css";

/**
 * NearestTechnicianListOverlay class extends the MapOverlay class.
 * This class is used to create and manage custom overlays for displaying a list
 * of reachable technicians on the map.
 * It overrides the `overlayClassName` and `getOverlayHTML` methods to provide
 * specific styling and content for the technician data.
 *
 * @class NearestTechnicianListOverlay
 * @extends MapOverlay
 */
export class NearestTechnicianListOverlay extends MapOverlay {
  /**
   * Creates an instance of NearestTechnicianListOverlay.
   *
   * @param {Object} options - Configuration options for the technicians overlay.
   * @param {Object} options.map - The map object to which the overlay will be added.
   * @param {Object} options.position - The position (coordinates) for the overlay on the map.
   * @param {Object} options.techniciansData - The list of technicians with their details.
   * @param {Function} options.onClick - Callback function to be executed when the overlay is clicked.
   * @param {Function} options.onClose - Callback function to be executed when the overlay is closed.
   */
  constructor({ map, position, techniciansData, onClick, onClose }) {
    // Call the parent constructor with the provided technician data
    super({ map, position, data: techniciansData, onClick, onClose });
  }

  /**
   * Returns the CSS class name for the technicians overlay.
   * Overrides the base class method to provide a specific class for technicians overlays.
   *
   * @returns {string} The class name for the technicians overlay.
   */
  overlayClassName() {
    return "technicians-overlay"; // Specific class name for technicians overlays
  }

  /**
   * Returns the HTML content for the technicians overlay.
   * This method customizes the HTML content displayed in the overlay based on the technicians' data.
   *
   * @returns {string} The HTML content for the technicians overlay.
   */
  getOverlayHTML() {
    // Loop through the list of technicians and create a list item for each technician
    return `
      <button class="close-overlay">X</button>
      <h3>Reachable Technicians</h3>
      <ul>
        ${this.data?.technicians
          ?.map(
            (tech, index) => `
            <li>
              <p><strong>Name:</strong> ${tech.name}</p>
              <p><strong>Location:</strong> (${tech.location[1]}, ${
              tech.location[0]
            })</p>
              <p><strong>Driving Distance:</strong> ${tech.driving_distance}</p>
              <p><strong>Live Traffic Travel Time:</strong> ${
                tech.live_traffic_incidents_travel_time
              }</p>
              <p><strong>Historic Traffic Travel Time:</strong> ${
                tech.historic_traffic_travel_time
              }</p>
              <p><strong>No Traffic Travel Time:</strong> ${
                tech.no_traffic_travel_time
              }</p>
               <p>${index + 1} of ${this.data.technicians.length}</p>
            </li>
          `
          )
          .join("")}
      </ul>
    `;
  }
}

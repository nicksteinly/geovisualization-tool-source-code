import { MapOverlay } from "./MapOverlay";
import "../../../css/geofence-overlay.css";

/**
 * GeofenceDataOverlay class extends the MapOverlay class.
 * This class is used to create and manage custom geofence-related overlays on the map.
 * It overrides the `overlayClassName` and `getOverlayHTML` methods to provide
 * specific styling and content for geofence data.
 * 
 * @class GeofenceDataOverlay
 * @extends MapOverlay
 */
export class GeofenceDataOverlay extends MapOverlay {
  /**
   * Creates an instance of GeofenceDataOverlay.
   * 
   * @param {Object} options - Configuration options for the geofence overlay.
   * @param {Object} options.map - The map object to which the overlay will be added.
   * @param {Object} options.position - The position (coordinates) for the overlay on the map.
   * @param {Object} options.geofenceData - The data associated with the geofence.
   * @param {Function} options.onClick - Callback function to be executed when the overlay is clicked.
   * @param {Function} options.onClose - Callback function to be executed when the overlay is closed.
   */
  constructor({ map, position, geofenceData, onClick, onClose }) {
    // Call the parent constructor with the provided geofence data
    super({ map, position, data: geofenceData, onClick, onClose });
  }

  /**
   * Returns the CSS class name for the geofence overlay.
   * Overrides the base class method to provide a specific class for geofence overlays.
   * 
   * @returns {string} The class name for the geofence overlay.
   */
  overlayClassName() {
    return "geofence-overlay"; // Specific class name for geofence overlays
  }

  /**
   * Returns the HTML content for the geofence overlay.
   * This method customizes the HTML content displayed in the overlay based on the geofence data.
   * 
   * @returns {string} The HTML content for the geofence overlay.
   */
  getOverlayHTML() {
    const data = this.data || {}; // Extract geofence data, defaulting to an empty object if not provided

    // Return the custom HTML content for the geofence overlay
    return `
      <button class="close-overlay">X</button>
      <h3>Geofence Data</h3>
      <ul>
        <li>
          <strong>Customer Count:</strong> ${data.customer_count ?? "N/A"}
        </li>
        <li>
          <strong>Technician Count:</strong> ${data.technician_count ?? "N/A"}
        </li>

      </ul>
    `;
  }
}

{/* <li>
<strong>Customer Density (per 100 mi²):</strong> ${
  data.customer_density_per_10_mile2?.toFixed(2) ?? "N/A"
}
</li>
<li>
<strong>Technician Density (per 100 mi²):</strong> ${
  data.technician_density_per_10_mile2?.toFixed(2) ?? "N/A"
}
</li> */}
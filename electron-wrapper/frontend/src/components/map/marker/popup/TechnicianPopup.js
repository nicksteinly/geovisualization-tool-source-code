import tt from "@tomtom-international/web-sdk-maps";
import "@tomtom-international/web-sdk-maps/dist/maps.css";

import MarkerPopup from "./MarkerPopup"

/**
 * TechnicianPopup is a subclass of MarkerPopup that creates a custom popup 
 * for displaying technician information when attached to a map marker.
 * It implements the `createPopup` method to customize the popup content.
 */
export class TechnicianPopup extends MarkerPopup {
  /**
   * Creates the popup content for the technician marker.
   * The content includes the technician's name, role, and location details.
   * 
   * @returns {tt.Popup} The popup instance with technician-specific content.
   */
  createPopup() {
    const feature = this.feature;  // Get the feature associated with the popup
    
    // Define the HTML content for the popup, showing technician details
    const popupContent = `
      <div>
        <strong>${feature.properties?.name || "Unknown Technician"}</strong><br>
        Role: ${feature.properties?.role || "Technician"}<br>
        ${feature.properties?.city || ""}, ${feature.properties?.state || ""}<br>
      </div>
    `;
    
    // Create and return a new popup with the content and location of the feature
    return new tt.Popup({ offset: 30 })
      .setLngLat(feature.geometry.coordinates)  // Set the popup's location based on the feature's coordinates
      .setHTML(popupContent);  // Set the popup content as HTML
  }
}

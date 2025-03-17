import tt from "@tomtom-international/web-sdk-maps";
import "@tomtom-international/web-sdk-maps/dist/maps.css";

import MarkerPopup from "./MarkerPopup"

/**
 * CustomerPopup is a subclass of MarkerPopup that creates a custom popup
 * for displaying customer information when attached to a map marker.
 * It implements the `createPopup` method to customize the popup content.
 */
export class CustomerPopup extends MarkerPopup {
  /**
   * Creates the popup content for the customer marker.
   * The content includes the customer's organization name, address details, 
   * and geographic coordinates.
   * 
   * @returns {tt.Popup} The popup instance with customer-specific content.
   */
  createPopup() {
    const feature = this.feature;  // Get the feature associated with the popup
    
    // Define the HTML content for the popup, showing customer details
    const popupContent = `
      <div>
        <strong>${feature?.properties?.name || "Unknown Customer"}</strong><br>
        ${feature?.properties?.address_one || ""}<br>
        ${feature?.properties?.address_two || ""}<br>
        ${feature?.properties?.city || ""}, ${feature?.properties?.state || ""} ${feature?.properties?.zipcode || ""}<br>
        ${feature?.properties?.country || ""}<br>
        Coordinates: (${feature?.geometry?.coordinates?.[1].toFixed(4)}, ${feature?.geometry?.coordinates?.[0].toFixed(4)})
      </div>
    `;
    
    // Create and return a new popup with the content and location of the feature
    return new tt.Popup({ offset: 30 })
      .setLngLat(feature.geometry.coordinates)  // Set the popup's location based on the feature's coordinates
      .setHTML(popupContent);  // Set the popup content as HTML
  }
}

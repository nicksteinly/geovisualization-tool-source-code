import tt from "@tomtom-international/web-sdk-maps";
import "@tomtom-international/web-sdk-maps/dist/maps.css";

/**
 * MarkerPopup class provides a base structure for creating custom popups
 * attached to map markers. This class can be extended to create specific
 * popups for different marker types by implementing the `createPopup` method.
 */
class MarkerPopup {
  /**
   * Constructor to initialize the popup with a specific feature.
   * 
   * @param {Object} feature - The feature associated with the marker, typically containing data for the popup.
   */
  constructor(feature) {
    this.feature = feature;  // Store the feature for later use
    this.popup = this.createPopup();  // Call the abstract createPopup method to create the popup
  }

  /**
   * Abstract method for creating a popup. Subclasses must implement this 
   * method to define how the popup will be created based on the feature data.
   * 
   * @throws {Error} Throws an error if not implemented by the subclass.
   */
  createPopup() {
    throw new Error("Subclasses must implement the createPopup method");
  }

  /**
   * Attaches the created popup to a given marker on the map.
   * 
   * @param {Object} marker - The map marker to which the popup will be attached.
   */
  attachToMarker(marker) {
    marker.setPopup(this.popup);  // Attach the created popup to the marker
  }
}

export default MarkerPopup;

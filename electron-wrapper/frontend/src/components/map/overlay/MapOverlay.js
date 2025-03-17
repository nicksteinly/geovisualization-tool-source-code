/**
 * MapOverlay class to create and manage custom overlays on a map.
 * This class allows adding and removing overlays, setting click handlers,
 * and customizing overlay content and appearance.
 * 
 * @class MapOverlay
 */
export class MapOverlay {
  /**
   * Creates an instance of MapOverlay.
   *
   * @param {Object} options - Configuration options for the overlay.
   * @param {Object} options.map - The map object to which the overlay will be added.
   * @param {Object} options.position - The position (coordinates) for the overlay on the map.
   * @param {Object} options.data - Additional data associated with the overlay.
   * @param {Function} options.onClick - Callback function to be executed when the overlay is clicked.
   * @param {Function} options.onClose - Callback function to be executed when the overlay is closed.
   */
  constructor({ map, position, data, onClick, onClose }) {
    this.map = map;           // The map instance to add the overlay to
    this.position = position; // The position for the overlay on the map
    this.data = data;         // Additional data for the overlay
    this.div = null;          // Holds the DOM element of the overlay
    this.onClick = onClick;   // Callback for click events on the overlay
    this.onClose = onClose;   // Callback for close events
  }

  /**
   * Adds the overlay to the map.
   * Creates a new div element, assigns it a class, sets inner HTML, 
   * and attaches event listeners for close and click actions.
   */
  addToMap() {
    // Create the overlay div element
    const overlayDiv = document.createElement("div");
    
    // Assign the appropriate class name to the overlay
    overlayDiv.className = this.overlayClassName();
    
    // Set the HTML content of the overlay (can be customized)
    overlayDiv.innerHTML = this.getOverlayHTML();

    // Find and attach event listener to the close button within the overlay
    const closeButton = overlayDiv.querySelector(".close-overlay");
    closeButton?.addEventListener("click", (e) => {
      e.stopPropagation();  // Prevent event bubbling
      this.removeFromMap(); // Remove the overlay from the map
      if (this.onClose) {
        this.onClose();      // Trigger onClose callback if provided
      }
    });

    // Attach click event listener to the overlay div itself
    overlayDiv.addEventListener("click", (e) => {
      e.stopPropagation();  // Prevent event bubbling
      if (this.onClick) {
        this.onClick(this.position, this.data); // Trigger onClick callback with position and data
      }
    });

    // Store the overlay div reference and append it to the map container
    this.div = overlayDiv;
    this.map.getContainer().appendChild(overlayDiv);
  }

  /**
   * Removes the overlay from the map.
   * If the overlay exists, it is removed from the DOM and the reference is cleared.
   */
  removeFromMap() {
    if (this.div) {
      this.div.parentNode.removeChild(this.div); // Remove the overlay from the DOM
      this.div = null; // Clear the reference
    }
  }

  /**
   * Returns the class name for the overlay.
   * Can be overridden to customize the overlay's CSS class.
   * 
   * @returns {string} The class name for the overlay.
   */
  overlayClassName() {
    return "generic-overlay"; // Default class name for the overlay
  }

  /**
   * Returns the HTML content for the overlay.
   * Can be overridden to provide custom HTML content for the overlay.
   * 
   * @returns {string} The HTML content for the overlay.
   */
  getOverlayHTML() {
    return ""; // Default, empty HTML content
  }
}

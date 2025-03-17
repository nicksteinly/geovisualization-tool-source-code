import React from "react";
import { useState } from "react";
import { useMapContext } from "../../../context/MapContext";
import IconToggle from "./IconToggle";
import "../../../css/marker-settings.css"; // Import the CSS for styling marker settings

/**
 * IconMapLegend component allows users to change the color and size of customer and technician markers.
 * It integrates with the MapContext to update the marker settings in the context.
 */
const IconMapLegend = () => {
  // Destructure the necessary values and functions from the MapContext
  const {
    customerColor, // Current color of customer markers
    technicianColor, // Current color of technician markers
    changeCustomerColor, // Function to change customer marker color
    changeTechnicianColor, // Function to change technician marker color
    changeCustomerLayerVisibility: toggleCustomerLayerVisibility,
    changeTechnicianLayerVisibility: toggleTechnicianLayerVisibility,
    markerSize, // Current size of the markers
    setMarkerSize, // Function to update marker size
  } = useMapContext();

  const [customerLayerVisibility, setCustomerLayerVisibility] = useState(true);
  const [technicianLayerVisibility, setTechnicianLayerVisibility] =
    useState(true);

  /**
   * Handles the change of the customer marker color.
   * @param {Event} e - The event triggered by the color picker.
   */
  const handleCustomerChangeColor = (e) => {
    changeCustomerColor(e.target.value); // Update the customer color
  };

  /**
   * Handles the change of the technician marker color.
   * @param {Event} e - The event triggered by the color picker.
   */
  const handleTechnicianChangeColor = (e) => {
    changeTechnicianColor(e.target.value); // Update the technician color
  };

  /**
   * Handles changes in the marker size.
   * @param {Event} e - The event triggered by the size range input.
   */
  const handleMarkerSizeChange = (e) => {
    const newSize = Number(e.target.value); // Convert the value to a number
    setMarkerSize(newSize); // Update the marker size
  };

  const handleCustomerLayerVisibilityChange = () => {
    toggleCustomerLayerVisibility(!customerLayerVisibility);
    setCustomerLayerVisibility(!customerLayerVisibility);
  };

  const handleTechnicianLayerVisibilityChange = () => {
    toggleTechnicianLayerVisibility(!technicianLayerVisibility);
    setTechnicianLayerVisibility(!technicianLayerVisibility);
  };

  return (
    <>
      {/* Title of the legend */}
      <h4 style={{ margin: "0 0 10px 0", fontSize: "14px" }}>Legend</h4>
      {/* Container for the marker settings */}
      <div className="marker-settings-container-container">
        {/* Customer color picker */}
        <div className="marker-settings-container">
          <input
            type="color"
            className="marker-picker"
            value={customerColor} // Set current customer marker color
            onChange={handleCustomerChangeColor} // Handle color change
          />
          <label onClick={() => handleCustomerLayerVisibilityChange()}>
            Customers
          </label>{" "}
          {/* Label for the customer marker color */}
          <IconToggle
            onClickFunction={() => handleCustomerLayerVisibilityChange()}
          />
        </div>

        {/* Technician color picker */}
        <div className="marker-settings-container">
          <input
            type="color"
            className="marker-picker"
            value={technicianColor} // Set current technician marker color
            onChange={handleTechnicianChangeColor} // Handle color change
          />
          <label onClick={() => handleTechnicianLayerVisibilityChange()}>
            Technicians
          </label>{" "}
          {/* Label for the technician marker color */}
          <IconToggle
            onClickFunction={() => handleTechnicianLayerVisibilityChange()}
          />
        </div>

        {/* Marker size range input */}
        <div className="marker-settings-container">
          <input
            type="range"
            min="1"
            max="20"
            value={markerSize} // Set current marker size
            onChange={handleMarkerSizeChange} // Handle size change
            style={{ flexGrow: 1 }} // Style the input to grow with container
          />
        </div>
      </div>
    </>
  );
};

export default IconMapLegend;

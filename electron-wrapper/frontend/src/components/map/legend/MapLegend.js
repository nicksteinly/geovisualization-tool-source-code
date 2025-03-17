import React from "react";
import PropTypes from "prop-types";
import "../../../css/map-legend.css"; // Import the CSS file for styling

/**
 * MapLegend component renders a legend for the map.
 * It displays a list of items, each with a label and a corresponding color.
 *
 * @param {Array} legendItems - An array of objects containing `label` and `color`.
 * Each object should have:
 *   - label (string): The name or description of the item in the legend.
 *   - color (string): The color associated with the item.
 */
const MapLegend = ({ legendItems }) => {
  return (
    <div className="map-legend">
      {/* Title of the legend */}
      <h4 className="map-legend-title">Legend</h4>
      {/* Iterate over the legendItems to display each item */}
      {legendItems.map(({ label, color }, index) => (
        <div key={index} className="map-legend-item">
          {/* Display the color square */}
          <div className="map-legend-color" style={{ background: color }} />
          {/* Display the label next to the color square */}
          <span className="map-legend-label">{label}</span>
        </div>
      ))}
    </div>
  );
};

// Prop validation for MapLegend
MapLegend.propTypes = {
  // legendItems should be an array of objects with `label` and `color` properties
  legendItems: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired, // label must be a string
      color: PropTypes.string.isRequired, // color must be a string
    })
  ).isRequired, // legendItems is a required prop
};

export default MapLegend;

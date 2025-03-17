import React, { useState } from "react";
import { useMapContext } from "../../context/MapContext";
import "../../css/geofence-coordinate-list.css";

const GeofenceCoordinatesList = () => {
  const {
    coordinates, // Array of geofence coordinates
    removeCoordinate, // Function to remove a coordinate by index
    displayGeofenceData, // Function to display geofence statistics
    removeGeofence, // Function to remove all geofences
  } = useMapContext();
  const [isExpanded, setIsExpanded] = useState(true);

  // Toggle the expansion state of the list
  const handleToggle = (e) => {
    e.stopPropagation(); // Prevent click propagation
    setIsExpanded(!isExpanded);
  };

  // Reset geofence by clearing all coordinates
  const resetGeofence = () => {
    removeGeofence();
  };

  return (
    <div className="geofence-coordinate-list">
      {/* Header containing toggle and button for geofence stats */}
      <div className="header" onClick={handleToggle}>
        <p className="title">Geofence Points</p>
        <span className={`arrow ${isExpanded ? "expanded" : ""}`} />
      </div>

      {/* Expandable section */}
      {isExpanded && (
        <div className="content">
          {/* Scrollable list of coordinates */}
          <ul>
            {coordinates.map((coord, index) => (
              <li key={index} className="coordinate-item">
                {`(${coord[1].toFixed(6)}, ${coord[0].toFixed(6)})`}
                <button
                  className="remove-btn"
                  onClick={() => removeCoordinate(index)}
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
          {/* Reset button */}
          <button
            className="stats-btn"
            onClick={(e) => {
              e.stopPropagation(); // Prevent propagation to avoid closing the list
              displayGeofenceData();
            }}
          >
            Display Geofence Statistics
          </button>
          <button className="reset-btn" onClick={resetGeofence}>
            Reset
          </button>
        </div>
      )}
    </div>
  );
};

export default GeofenceCoordinatesList;

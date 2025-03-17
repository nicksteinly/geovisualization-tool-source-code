import React, { useState } from "react";
import Button from "@mui/material/Button";
import PlaceIcon from "@mui/icons-material/Place";
import { useMapContext } from "../../../context/MapContext";
import { useIconContext } from "../../../context/SelectedIconContext";

/**
 * FeatureView is a React component that displays details about a feature (e.g., customer or technician)
 * and allows the user to expand the details or pan to the feature on the map.
 *
 * @param {Object} feature - The feature data (e.g., customer or technician) to display.
 * @param {Object} mapInstance - The map instance to control map zoom and center (not used in this component directly).
 * @param {string} type - A string to determine if the feature is a "customer" or "technician".
 * @param {Function} renderDetails - A function that renders detailed information about the feature.
 *
 * @returns {JSX.Element} The component rendering the feature information and a button to pan the map.
 */
const FeatureView = ({ feature, mapInstance, type, renderDetails }) => {
  // Local state to track whether the feature details are expanded or collapsed
  const [expanded, setExpanded] = useState(false);

  // Context to manage map state (zoom and center)
  const { setMapZoom, setMapCenter } = useMapContext();

  // Context to handle selecting the icon for the feature
  const { selectIcon } = useIconContext();

  /**
   * Toggles the expanded state to show or hide feature details when clicked.
   */
  const handleClick = () => {
    setExpanded((prevExpanded) => !prevExpanded);
  };

  /**
   * Centers the map on the feature's coordinates and sets the zoom level.
   * Also selects the feature's icon for display.
   */
  const showFeatureMarker = () => {
    if (!feature || !feature.geometry) return;

    const { coordinates } = feature.geometry;
    const lat = coordinates[1];
    const lng = coordinates[0];

    // Set the map center and zoom level
    setMapCenter(lat, lng);
    setMapZoom(18);

    // Select the feature's icon for display
    selectIcon(feature);
  };

  return (
    feature?.properties && (
      <div
        key={feature?.properties?.id || feature?.properties?.cnum}
        onClick={handleClick}
      >
        <p>{feature?.properties?.name}</p>

        {/* Show expanded feature details if the state is set to true */}
        {expanded && (
          <div>
            {renderDetails(feature)}
            <p>
              {feature?.properties?.address_one}{" "}
              {feature?.properties?.address_two}
            </p>
            <p>
              {feature?.properties?.city}, {feature?.properties?.state}{" "}
              {feature?.properties?.zipcode}
            </p>
            <p>{feature?.properties?.country}</p>
            <p>
              ({feature?.geometry?.coordinates[1].toFixed(4)},{" "}
              {feature?.geometry?.coordinates[0].toFixed(4)})
            </p>
          </div>
        )}

        {/* Button to pan the map to the feature's location */}
        <Button
          onClick={(e) => {
            e.stopPropagation(); // Prevent the click from triggering the parent div's onClick
            showFeatureMarker(); // Pan to the feature on the map
          }}
          startIcon={<PlaceIcon />}
        >
          Pan to on Map
        </Button>
      </div>
    )
  );
};

export default FeatureView;

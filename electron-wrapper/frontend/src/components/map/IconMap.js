import React, { useEffect } from 'react';
import { useMapContext } from '../../context/MapContext'; // Assuming you have MapContext in a separate file
import IconMapLegend from './legend/IconMapLegend'; // Import MarkerSettings component
import "../../css/home-screen.css";

/**
 * `IconMap` component displays an interactive map with markers for customers and technicians.
 * It initializes the map on mount and retrieves data from the context.
 *
 * @component
 */
const IconMap = () => {
  // Extract map context values
  const { mapElement, customerColor, technicianColor, markerSize, init } = useMapContext();

  /**
   * useEffect hook to initialize the map when the component mounts.
   */
  useEffect(() => {
    init();
    console.log(markerSize);
  }, []);

  return (
    <div id='icon-map-container'>
      {/* Map container */}
      <div ref={mapElement} id='icon-map'></div>

      {/* Marker Settings */}
      <div id='marker-settings'>
        <IconMapLegend />
      </div>
    </div>
  );
};

export default IconMap;

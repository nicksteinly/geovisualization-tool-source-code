import React from "react";
import FeatureView from "./FeatureView";

/**
 * TechniciansView is a React component that displays the details of a technician.
 * It leverages the FeatureView component to display technician-specific information.
 *
 * @param {Object} feature - The technician feature data to display.
 * @param {Object} mapInstance - The map instance to control map zoom and center (not used in this component directly).
 *
 * @returns {JSX.Element} The component rendering the technician details view.
 */
const TechniciansView = ({ feature, mapInstance }) => {
  /**
   * Renders the detailed information specific to a technician.
   *
   * @param {Object} feature - The technician feature data to display.
   *
   * @returns {JSX.Element} A JSX fragment containing technician's role and location.
   */
  const renderTechnicianDetails = (feature) => (
    <>
      <p>{feature?.properties?.id}</p>
    </>
  );

  return (
    // Render FeatureView with technician-specific details
    <FeatureView
      feature={feature}
      mapInstance={mapInstance}
      type="technician"
      renderDetails={renderTechnicianDetails}
    />
  );
};

export default TechniciansView;

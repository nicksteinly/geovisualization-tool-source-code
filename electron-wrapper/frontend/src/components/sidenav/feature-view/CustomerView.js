import React from "react";
import FeatureView from "./FeatureView";

/**
 * CustomerView is a React component that displays the details of a customer.
 * It leverages the FeatureView component to display customer-specific information.
 *
 * @param {Object} feature - The customer feature data to display.
 * @param {Object} mapInstance - The map instance to control map zoom and center (not used in this component directly).
 *
 * @returns {JSX.Element} The component rendering the customer details view.
 */
const CustomerView = ({ feature, mapInstance }) => {
  /**
   * Renders the detailed information specific to a customer.
   *
   * @param {Object} feature - The customer feature data to display.
   *
   * @returns {JSX.Element} A JSX fragment containing customer address, city, state, country, and other details.
   */
  const renderCustomerDetails = (feature) => (
    <>
      <p>{feature?.properties?.cnum}</p>
    </>
  );

  return (
    // Render FeatureView with customer-specific details
    <FeatureView
      feature={feature}
      mapInstance={mapInstance}
      type="customer"
      renderDetails={renderCustomerDetails}
    />
  );
};

export default CustomerView;

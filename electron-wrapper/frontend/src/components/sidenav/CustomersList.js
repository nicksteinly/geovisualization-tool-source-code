import React from "react";
import GeoJSONList from "./GeoJSONList";
import CustomerView from "./feature-view/CustomerView";
import { useMapContext } from "../../context/MapContext";

/**
 * The `CustomersList` component is responsible for fetching and displaying a list of customer data.
 * It utilizes the `GeoJSONList` component to display the customer data fetched from the API and allows
 * for searching and filtering by the customer's organization. It also provides additional data about
 * technicians for each customer item in the list.
 *
 * @component
 * @example
 * <CustomersList />
 *
 * @returns {JSX.Element} The JSX for the `CustomersList` component, which renders a list of customers
 *                        along with the ability to filter and display technician information.
 */
const CustomersList = () => {
  const { customers } = useMapContext();
  console.log(customers);
  return (
    <GeoJSONList
      geojsonData={customers}
      filterProperty="name" // Property to filter customers by (organization name)
      placeholderText="Search customers..." // Placeholder text for the search input
      ListItemComponent={CustomerView} // Component used to display each customer in the list
    />
  );
};

export default CustomersList;

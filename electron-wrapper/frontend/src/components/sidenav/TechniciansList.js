import React from "react";
import GeoJSONList from "./GeoJSONList";
import TechniciansView from "./feature-view/TechnicianView";
import { useMapContext } from "../../context/MapContext";

/**
 * The `TechniciansList` component fetches and displays a list of technicians in the application.
 * It uses the `GeoJSONList` component to fetch the data and render a list of technician features.
 * The data is retrieved using the `getTechniciansGeojson` method from the `MapUploadAPI`.
 *
 * @component
 * @example
 * <TechniciansList />
 *
 * @returns {JSX.Element} The JSX for the `TechniciansList` component, which renders a list of technicians.
 */
const TechniciansList = () => {
  const { technicians } = useMapContext();
  return (
    <GeoJSONList
      geojsonData={technicians}
      filterProperty="name" // The property to filter technicians by (name)
      placeholderText="Search technicians..." // Placeholder text for the search bar
      ListItemComponent={TechniciansView} // Component used to display each technician's details
    />
  );
};

export default TechniciansList;

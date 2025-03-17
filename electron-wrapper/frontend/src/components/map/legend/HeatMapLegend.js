import React from "react";
import MapLegend from "./MapLegend";

/**
 * HeatMapLegend component displays a legend with the color gradient information 
 * for customer and technician density.
 */
const HeatMapLegend = () => {
  // Define the items for the heatmap legend
  const legendItems = [
    {
      // Customer density with a gradient from transparent blue to solid cyan
      label: "Customer Density",
      color: "linear-gradient(to right, rgba(0, 0, 255, 0), rgba(0, 255, 255, 1))",
    },
    {
      // Technician density with a gradient from transparent red to solid red
      label: "Technician Density",
      color: "linear-gradient(to right, rgba(255, 0, 0, 0), rgba(255, 0, 0, 1))",
    },
  ];

  // Render the MapLegend component with the predefined legend items
  return <MapLegend legendItems={legendItems} />;
};

export default HeatMapLegend;

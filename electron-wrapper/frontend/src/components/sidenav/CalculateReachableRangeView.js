import React from "react";
import { useMapContext } from "../../context/MapContext";
import "../../css/calculate-reachable-range-view.css";

/**
 * The `CalculateReachableRangeView` component provides a UI for users to input and select criteria
 * for calculating the reachable range based on either time or distance. The component allows users
 * to set the time budget or distance limit and display reachable technicians accordingly.
 *
 * @component
 * @example
 * <CalculateReachableRangeView />
 *
 * @returns {JSX.Element} The JSX for the `CalculateReachableRangeView` component, rendering a form for selecting
 *                        the bottleneck criteria (time or distance) and displaying reachable technicians.
 */
const CalculateReachableRangeView = () => {
  // Context hooks for managing the map-related data and states
  const {
    timeBudget, // The time budget for reachable range calculation (in minutes)
    setTimeBudget, // Function to set the time budget
    maxMiles, // The maximum distance for reachable range calculation (in miles)
    setMaxMiles, // Function to set the maximum distance
    bottleneck, // The current bottleneck (either "time" or "distance")
    setBottleneck, // Function to set the bottleneck
    getReachableTechnicians, // Function to make an API request to get reachable technicians
  } = useMapContext(); // Accessing context for map-related state management

  return (
    <div className="calculate-range-view">
      <div className="form-row">
        {/* Dropdown to select the bottleneck (either time or distance) */}
        <div className="bottleneck-selector">
          <select
            value={bottleneck}
            onChange={(e) => setBottleneck(e.target.value)} // Set the selected bottleneck
          >
            <option value="time">Range (minutes)</option>
            <option value="distance">Range (miles)</option>
          </select>
        </div>

        {/* If the bottleneck is time, display an input field for time budget */}
        {bottleneck === "time" && (
          <div>
            <input
              type="number"
              value={timeBudget} // The current time budget value
              onChange={(e) => setTimeBudget(Number(e.target.value))} // Set the new time budget
            />
          </div>
        )}

        {/* If the bottleneck is distance, display an input field for maximum miles */}
        {bottleneck === "distance" && (
          <div>
            <input
              type="number"
              value={maxMiles} // The current max miles value
              onChange={(e) => setMaxMiles(Number(e.target.value))} // Set the new max miles value
            />
          </div>
        )}
      </div>

      {/* Button to trigger the API request for calculating reachable technicians */}
      <button onClick={getReachableTechnicians}>
        Display Reachable Technicians
      </button>
    </div>
  );
};

export default CalculateReachableRangeView;

import React, { useState, useEffect } from "react";
import SelectedCustomerView from "./selected-icon/SelectedCustomerView";
import SelectedTechnicianView from "./selected-icon/SelectedTechnicianView";
import GeofenceCoordinatesList from "./GeofenceCoordinatesList";
import { useIconContext } from "../../context/SelectedIconContext";
import { useMapContext } from "../../context/MapContext";
import "../../css/side-nav-top-container.css";

const SideNavTopContainer = () => {
  const [viewTop, setViewTop] = useState("icon-view"); // Manage initial view
  const { toggleGeofencing } = useMapContext(); // Geofencing toggle
  const { selectedIcon } = useIconContext(); // Selected icon from context

  // Handle view toggling
  const toggleViewTop = (viewType) => {
    setViewTop(viewType);
  };

  // Effect to log when the selectedIcon changes
  useEffect(() => {
    console.log("selected icon changed:", selectedIcon);
  }, [selectedIcon]);

  // Function to render the selected icon based on context
  const renderSelectedIcon = () => {
    if (!selectedIcon) return <p></p>;

    if (selectedIcon?.source === "customer-source") {
      return <SelectedCustomerView feature={selectedIcon} />;
    } else if (selectedIcon?.source === "technician-source") {
      return <SelectedTechnicianView feature={selectedIcon} />;
    }
    return null; // Fallback in case there is no match
  };

  return (
    <div className={"side-nav-top-conatiner"}>
      {/* Top toggle to switch between views */}
      <div className="view-toggle-buttons">
        <button
          className={viewTop === "icon-view" ? "active" : ""}
          onClick={() => {
            toggleViewTop("icon-view");
            toggleGeofencing();
          }}
        >
          Icon Selection
        </button>
        <button
          className={viewTop === "geofencing-view" ? "active" : ""}
          onClick={() => {
            toggleViewTop("geofencing-view");
            toggleGeofencing();
          }}
        >
          Geofencing
        </button>
      </div>

      {/* Conditionally render views */}
      {viewTop === "icon-view" && (
        <div className="icon-container selected">{renderSelectedIcon()}</div>
      )}
      {viewTop === "geofencing-view" && (
        <div className="geofencing-container">
          {/* Render geofencing related content here */}
        </div>
      )}
      {viewTop === "geofencing-view" && <GeofenceCoordinatesList />}
    </div>
  );
};

export default SideNavTopContainer;

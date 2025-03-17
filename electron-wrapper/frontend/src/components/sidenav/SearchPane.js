import React, { useState } from "react";
import { useIconContext } from "../../context/SelectedIconContext";
import TechniciansList from "./TechniciansList";
import CustomersList from "./CustomersList";
import "../../css/search-pane.css";

const SearchPane = () => {
  const [viewBottom, setViewBottom] = useState("technician-list");

  const toggleViewBottom = (viewType) => {
    setViewBottom(viewType);
  };

  return (
    <div className="search-pane">
      {/* Dynamically load lists */}
      <div className="view-content">
        {/* View toggles */}
        <div className="view-toggle-buttons">
          <button
            className={viewBottom === "technician-list" ? "active" : ""}
            onClick={() => toggleViewBottom("technician-list")}
          >
            Technicians
          </button>
          <button
            className={viewBottom === "customer-list" ? "active" : ""}
            onClick={() => toggleViewBottom("customer-list")}
          >
            Customers
          </button>
        </div>

        {viewBottom === "technician-list" && (
          <div className="list-view">
            <TechniciansList />
          </div>
        )}
        {viewBottom === "customer-list" && (
          <div className="list-view">
            <CustomersList />
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchPane;

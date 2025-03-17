import React, { useState, useEffect } from "react";
import "../../css/geojson-list.css";

const GeoJSONList = ({
  geojsonData,
  filterProperty,
  placeholderText,
  ListItemComponent,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const filteredData = searchQuery
    ? geojsonData.filter((feature) => {
        const propertyValue =
          feature.properties?.[filterProperty]?.toLowerCase() || "";
        return propertyValue.includes(searchQuery.toLowerCase());
      })
    : geojsonData;

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  return (
    <div className="geojson-list-container">
      <div className="search-bar-container">
        <input
          type="text"
          placeholder={placeholderText}
          value={searchQuery}
          onChange={handleSearchChange}
          className="search-bar"
        />
      </div>

      <ul className="geojson-list">
        {filteredData?.length > 0 ? (
          filteredData.map((feature, index) => (
            <li key={index}>
              <ListItemComponent feature={feature} />
            </li>
          ))
        ) : (
          <li>No results found.</li>
        )}
      </ul>
    </div>
  );
};

export default GeoJSONList;

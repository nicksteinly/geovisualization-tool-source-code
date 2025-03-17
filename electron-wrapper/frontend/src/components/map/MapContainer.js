import React, { useState } from "react";
import IconMap from "./IconMap";
import HeatMap from "./HeatMap";
import { MapUploadAPI } from "../../api/MapUploadAPI";
import SlideshowPopup from "../popup/SlideshowPopup";
import LoadingPopup from "../popup/LoadingPopup";
import "../../css/home-screen.css";

/**
 * Customer-related questions for CSV column selection.
 * @type {Array<{ question: string, keyword: string }>}
 */
const customerQuestions = [
  { question: "Select the column header that corresponds to the cnum.", keyword: "cnum" },
  { question: "Select the column header that corresponds to the name.", keyword: "name" },
  { question: "Select the column header that corresponds to the address one field (or N/A if there is not one).", keyword: "address_one" },
  { question: "Select the column header that corresponds to the address two field (or N/A if there is not one).", keyword: "address_two" },
  { question: "Select the column header that corresponds to the city field (or N/A if there is not one).", keyword: "city" },
  { question: "Select the column header that corresponds to the state field (or N/A if there is not one).", keyword: "state" },
  { question: "Select the column header that corresponds to the zipcode field (or N/A if there is not one).", keyword: "zipcode" },
  { question: "Select the column header that corresponds to the country field (or N/A if there is not one).", keyword: "country" },
];

/**
 * Technician-related questions for CSV column selection.
 * @type {Array<{ question: string, keyword: string }>}
 */
const technicianQuestions = [
  { question: "Select the column header that corresponds to the id.", keyword: "id" },
  { question: "Select the column header that corresponds to the name.", keyword: "name" },
  { question: "Select the column header that corresponds to the address one field (or N/A if there is not one).", keyword: "address_one" },
  { question: "Select the column header that corresponds to the address two field (or N/A if there is not one).", keyword: "address_two" },
  { question: "Select the column header that corresponds to the city field (or N/A if there is not one).", keyword: "city" },
  { question: "Select the column header that corresponds to the state field (or N/A if there is not one).", keyword: "state" },
  { question: "Select the column header that corresponds to the zipcode field (or N/A if there is not one).", keyword: "zipcode" },
  { question: "Select the column header that corresponds to the country field (or N/A if there is not one).", keyword: "country" },
];

/**
 * The `MapContainer` component handles the map display, file uploads, and CSV processing.
 * Users can switch between Icon Map and Heat Map, upload CSV files, and select column mappings.
 *
 * @component
 */
const MapContainer = () => {
  const [mapType, setMapType] = useState("icon-map");
  const [file, setFile] = useState(null);
  const [isCustomer, setIsCustomer] = useState(true);
  const [isReplaceData, setIsReplaceData] = useState(true);
  const [slideshowPopup, setSlideshowPopup] = useState(false);
  const [columnHeaders, setColumnHeaders] = useState([]);
  const [questionChoices, setQuestionChoices] = useState(customerQuestions);
  const [uploadingState, setUploadingState] = useState(false);
  const mapUploadAPI = new MapUploadAPI();

  /**
   * Toggles between "icon-map" and "heat-map" views.
   * @param {string} type - The selected map type.
   */
  const handleMapToggle = (type) => {
    setMapType(type);
  };

  /**
   * Handles file selection from the input.
   * @param {Event} event - The file selection event.
   */
  const handleFileSelect = (event) => {
    const selectedFile = event.target.files[0];
    setFile(selectedFile);
  };

  /**
   * Handles the closing of the slideshow popup and uploads the selected CSV data.
   * @param {{ selectedColumns: Object, cancel: boolean }} param - Object containing selected columns and cancel status.
   */
  const handleClosePopup = async ({ selectedColumns, cancel }) => {
    setUploadingState(true);
    setSlideshowPopup(false);
    if (!cancel) {
      let data;
      if (isReplaceData) {
        if (isCustomer) {
          data = await mapUploadAPI.replaceCustomersCSVData({
            csvFile: file,
            headerMappings: selectedColumns,
          });
        } else {
          data = await mapUploadAPI.replaceTechniciansCSVData({
            csvFile: file,
            headerMappings: selectedColumns,
          });
        }
      } else {
        if (isCustomer) {
          data = await mapUploadAPI.appendCustomersCSVData({
            csvFile: file,
            headerMappings: selectedColumns,
          });
        } else {
          data = await mapUploadAPI.appendTechniciansCSVData({
            csvFile: file,
            headerMappings: selectedColumns,
          });
        }
      }
      if (data) {
        console.log("Data uploaded successfully");
        window.location.reload();
      } else {
        alert("Failed to upload data");
      }
    }
    setUploadingState(false);
  };

  /**
   * Handles CSV file upload and retrieves column headers of uploaded file.
   */
  const handleFileUpload = async () => {
    if (file) {
      const data = await mapUploadAPI.getCSVColumnHeaders(file);
      setColumnHeaders(data.columns);
      setQuestionChoices(isCustomer ? customerQuestions : technicianQuestions);
      setSlideshowPopup(true);
    } else {
      alert("Please select a file to upload");
    }
  };

  /**
   * Cancels the file selection and resets state.
   */
  const handleCancelFile = () => {
    setFile(null);
  };

  return (
    <>
      {uploadingState && <LoadingPopup message={"Uploading CSV"} />}
      {slideshowPopup && (
        <SlideshowPopup
          initialQuestions={questionChoices}
          answerChoices={columnHeaders}
          onClose={handleClosePopup}
        />
      )}
      <div className="map-container">
        <div className="map">
          {mapType === "icon-map" ? <IconMap /> : <HeatMap />}
        </div>

        {/* Map Type Toggle Buttons */}
        <div className="button-container">
          <button
            onClick={() => handleMapToggle("icon-map")}
            className={`toggle-button ${mapType === "icon-map" ? "active" : ""}`}
          >
            Icon Map
          </button>
          <button
            onClick={() => handleMapToggle("heat-map")}
            className={`toggle-button ${mapType === "heat-map" ? "active" : ""}`}
          >
            Heat Map
          </button>
        </div>

        {/* File Upload Section */}
        <div className={"horizontal-stack"}>
          <div className="input-container">
            <div className="file-upload-container">
              <div className="toggle-container">
                <label htmlFor="data-toggle" className="toggle-label">Upload for:</label>
                <select
                  id="data-toggle"
                  onChange={(e) => setIsCustomer(e.target.value === "customer")}
                  value={isCustomer ? "customer" : "technician"}
                  className="data-toggle"
                >
                  <option value="customer">Customers</option>
                  <option value="technician">Technicians</option>
                </select>
              </div>
              <div className="toggle-container">
                {/* <label htmlFor="data-toggle" className="toggle-label">Upload for:</label> */}
                <select
                  id="data-toggle"
                  onChange={(e) => setIsReplaceData(e.target.value === "replace")}
                  value={isReplaceData ? "replace" : "append"}
                  className="data-toggle"
                >
                  <option value="replace">Replace Data</option>
                  <option value="append">Append Data</option>
                </select>
              </div>
              <input
                type="file"
                accept=".csv"
                id="csv-upload"
                onChange={handleFileSelect}
                className="csv-upload-input"
                style={{ display: "none" }}
              />
              
              <span className="file-name">{file ? file.name : "No UTF-8 CSV file selected"}</span>

              <div className="upload-buttons">
                <button
                  onClick={() => document.getElementById("csv-upload").click()}
                  className="browse-button"
                >
                  Browse
                </button>
                <button onClick={handleFileUpload} className="upload-button" disabled={!file}>
                  Upload
                </button>
                <button onClick={handleCancelFile} className="cancel-button">
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default MapContainer;

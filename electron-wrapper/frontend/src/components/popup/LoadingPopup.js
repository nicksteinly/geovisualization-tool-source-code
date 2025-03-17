import React from "react";
import '../../css/loading-popup.css';

const LoadingPopup = ({ message = "Loading..." }) => {
  return (
    <div className="loading-container">
      <div className="loading-spinner"></div>
      <span className="loading-message">{message}</span>
    </div>
  );
};

export default LoadingPopup;

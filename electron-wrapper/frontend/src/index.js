import React from "react";
import { createRoot } from "react-dom/client"; 
import "./css/index.css"; // Import global CSS styles
import App from "./App"; // Import the main application component

// Get the root container element from the HTML document
const container = document.getElementById("root");

// Create a React root using the container element
const root = createRoot(container); 

// Render the App component inside React's StrictMode for additional checks and warnings in development mode
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

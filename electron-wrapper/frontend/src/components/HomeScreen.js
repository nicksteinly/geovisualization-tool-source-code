import React from "react";
import SideNav from "./sidenav/SideNav";
import { Grid2 } from "@mui/material";
import MapContainer from "./map/MapContainer";
import "../css/home-screen.css";

/**
 * The `PageLayout` component is the main layout for the home screen of the application.
 * It contains the map and the side navigation components arranged in a grid layout.
 * 
 * @component
 * @example
 * <PageLayout />
 * 
 * @returns {JSX.Element} The JSX for the `PageLayout` component, which renders the map and side navigation in a grid layout.
 */
const PageLayout = () => {
  return (
    // Grid2 component from Material UI is used to create a responsive layout.
    <Grid2 id="grid-container" container>
      {/* Render the MapContainer component that displays the map */}
      <MapContainer />
      
      {/* Render the SideNav component for navigation */}
      <SideNav />
    </Grid2>
  );
};

export default PageLayout;

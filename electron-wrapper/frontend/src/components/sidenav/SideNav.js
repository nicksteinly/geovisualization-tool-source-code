import React, { useState } from "react";
import SearchPane from "./SearchPane";
import KeyboardDoubleArrowRightIcon from "@mui/icons-material/KeyboardDoubleArrowRight";
import KeyboardDoubleArrowLeftIcon from "@mui/icons-material/KeyboardDoubleArrowLeft";
import SideNavTopContainer from "./SideNavTopContainer";
import "../../css/home-screen.css";

/**
 * The `SideNav` component represents a collapsible sidebar that contains a search pane.
 * The sidebar can be collapsed or expanded by clicking the toggle button, which adjusts
 * the sidebar width using CSS variables.
 *
 * @component
 * @example
 * <SideNav />
 *
 * @returns {JSX.Element} The JSX for the `SideNav` component, which includes a toggleable sidebar
 *                        with a search pane inside.
 */
const SideNav = () => {
  // State to track if the sidebar is collapsed or expanded
  const [isCollapsed, setIsCollapsed] = useState(true);

  /**
   * Toggles the collapse/expand state of the sidebar.
   * When collapsed, the sidebar width is set to 2%, and when expanded, it is set to 30%.
   * It also updates the `isCollapsed` state to trigger re-rendering.
   */
  const toggleCollapse = () => {
    const root = document.documentElement;

    // Adjust the sidebar width using a CSS variable based on the collapse state
    if (isCollapsed) {
      root.style.setProperty("--sidenav-column-width", "30%"); // Set expanded width
    } else {
      root.style.setProperty("--sidenav-column-width", "2%"); // Set collapsed width
    }

    // Toggle the collapsed state
    setIsCollapsed(!isCollapsed);
  };

  return (
    <div className={`sidenav ${isCollapsed ? "collapsed" : ""}`}>
      {/* Button to toggle the sidebar's collapse/expand state */}
      <button className="menuBtn" onClick={toggleCollapse}>
        {isCollapsed ? (
          // Show right arrow icon when sidebar is collapsed
          <KeyboardDoubleArrowRightIcon />
        ) : (
          // Show left arrow icon when sidebar is expanded
          <KeyboardDoubleArrowLeftIcon />
        )}
      </button>
      <div className={`sidenav-content ${isCollapsed ? "hidden" : ""}`}>
        <SideNavTopContainer />
        {/* SearchPane visibility is controlled by the collapse state */}
        <SearchPane /> {/* Display the search pane when sidebar is expanded */}
      </div>
    </div>
  );
};

export default SideNav;

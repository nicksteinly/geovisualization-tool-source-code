import React from "react";
import SelectedIconView from "./SelectedIconView";
import "../../../css/selected-icon.css"; // Ensures the correct path to the CSS file

/**
 * The `SelectedTechnician` component displays detailed information about a selected technician.
 * It extends the `SelectedIcon` class to inherit common feature details rendering, such as coordinates.
 * The component allows toggling the visibility of technician details.
 *
 * @class SelectedTechnician
 * @extends SelectedIconView
 */
class SelectedTechnicianView extends SelectedIconView {
  constructor(props) {
    super(props);
    this.state = {
      isExpanded: true, // State to track whether technician details are expanded or collapsed
    };
  }

  /**
   * Toggles the visibility of technician details (expand/collapse).
   * Updates the component's state to reflect the new expanded/collapsed state.
   */
  toggleDetails = () => {
    this.setState((prevState) => ({
      isExpanded: !prevState.isExpanded,
    }));
  };

  /**
   * Renders the technician details, including name, role, and location.
   * It also renders the inherited `renderCommonDetails` method for additional feature details.
   * If no feature is provided, the component does not render.
   *
   * @returns {JSX.Element|null} The JSX for rendering the technician details or null if no feature is provided.
   */
  render() {
    const { feature } = this.props;
    const { isExpanded } = this.state;

    // If no feature is provided, return null
    if (!feature) return null;

    return (
      <div className="selected-icon" key={feature?.properties?.name}>
        {/* Header section with technician's name and toggle arrow */}
        <div className="header" onClick={this.toggleDetails}>
          <p>{feature?.properties?.name || "N/A"}</p>
          <div className={`arrow ${isExpanded ? "expanded" : ""}`} />
        </div>

        {/* Details section for technician information, conditionally rendered based on `isExpanded` state */}
        {isExpanded && (
          <div className={`details ${isExpanded ? "expanded" : "collapsed"}`}>
            {/* Render common details (coordinates) from the parent class */}
            {this.renderCommonDetails()}
          </div>
        )}
      </div>
    );
  }
}

export default SelectedTechnicianView;

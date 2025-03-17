import React, { useState } from "react";
import SelectedIconView from "./SelectedIconView";
import CalculateReachableRangeView from "../CalculateReachableRangeView";
import "../../../css/selected-icon.css";

/**
 * The `SelectedCustomer` component displays detailed information about a selected customer.
 * It extends the `SelectedIcon` class to inherit common feature details rendering, such as coordinates.
 * The component allows toggling the visibility of customer details and calculates reachable range.
 *
 * @class SelectedCustomer
 * @extends SelectedIconView
 */
class SelectedCustomerView extends SelectedIconView {
  constructor(props) {
    super(props);
    this.state = {
      isExpanded: true, // State to track whether customer details are expanded or collapsed
    };
  }

  /**
   * Toggles the visibility of customer details (expand/collapse).
   * Updates the component's state to reflect the new expanded/collapsed state.
   */
  toggleCollapse = () => {
    this.setState((prevState) => ({
      isExpanded: !prevState.isExpanded,
    }));
  };

  /**
   * Renders the customer details, including name, address, city, state, country, and coordinates.
   * Additionally, it renders the `CalculateReachableRangeView` component.
   * If the customer feature does not have a `cnum` property, it returns null and does not render the details.
   *
   * @returns {JSX.Element|null} The JSX for rendering the customer details or null if the customer is not valid.
   */
  render() {
    const { feature } = this.props;
    const { isExpanded } = this.state;

    // If no valid `cnum` is available, return null
    if (!feature?.properties?.cnum) return null;

    return (
      <div className="selected-icon" key={feature?.properties?.cnum}>
        <div className="header" onClick={this.toggleCollapse}>
          <p>{feature?.properties?.name}</p>
          <span className={`arrow ${isExpanded ? "expanded" : ""}`} />
        </div>
        {isExpanded && (
          <div className={`details ${isExpanded ? "expanded" : "collapsed"}`}>
            {/* Render common details (coordinates) from the parent class */}
            {this.renderCommonDetails()}

            {/* Calculate and display reachable range for the customer */}
            <CalculateReachableRangeView />
          </div>
        )}
      </div>
    );
  }
}

export default SelectedCustomerView;

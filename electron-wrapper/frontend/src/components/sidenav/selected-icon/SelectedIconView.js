import React from "react";
import "../../../css/selected-icon.css";
/**
 * The `SelectedIcon` component displays the details of a selected map icon.
 * It is designed to show common details related to the selected feature, such as its coordinates.
 *
 * @class SelectedIcon
 * @extends React.Component
 */
class SelectedIconView extends React.Component {
  constructor(props) {
    super(props);
  }

  /**
   * Renders common details for the selected feature, such as its coordinates.
   * If the feature is not available, it returns null.
   *
   * @returns {JSX.Element|null} The JSX for displaying the coordinates, or null if the feature is unavailable.
   */
  renderCommonDetails() {
    const { feature } = this.props;

    // If feature is not provided, return null
    if (!feature) return null;

    // Return the JSX to render the coordinates of the selected feature
    return (
      <div>
        {/* Render customer address details */}
        <p>
          <strong>Address:</strong> {feature?.properties?.address_one}{" "}
          {feature?.properties?.address_two}
        </p>
        <p>
          <strong>City:</strong> {feature?.properties?.city},{" "}
          {feature?.properties?.state} {feature?.properties?.zipcode}
        </p>
        <p>
          <strong>Country:</strong> {feature?.properties?.country}
        </p>
        <p>
          <strong>Coordinates:</strong> {"("}
          {feature?.geometry?.coordinates[1].toFixed(4)},{" "}
          {feature?.geometry?.coordinates[0].toFixed(4)}
          {")"}
        </p>
      </div>
    );
  }
}

export default SelectedIconView;

import React, { createContext, useContext, useState, useEffect } from "react";
import { ConfigAPI } from "../api/ConfigAPI"; // Import ConfigAPI

// Create a Context for the icon state
const IconContext = createContext();

/**
 * The `IconProvider` component provides a context that manages the state for icons
 * and their properties, such as selected icon, color settings, and active states
 * for customers and technicians.
 *
 * @component
 * @example
 * return (
 *   <IconProvider>
 *     <YourComponent />
 *   </IconProvider>
 * )
 */
export const IconProvider = ({ children }) => {
  const [selectedIcon, setSelectedIcon] = useState(null); // Stores the selected icon
  const [customerIconColor, setCustomerIconColor] = useState(null); // Stores the color for the customer icon
  const [technicianIconColor, setTechnicianIconColor] = useState(null); // Stores the color for the technician icon
  const [isCustomerActive, setIsCustomerActive] = useState(true); // Active state for customers
  const [isTechnicianActive, setIsTechnicianActive] = useState(true); // Active state for technicians
  const configAPI = new ConfigAPI(); // Initialize ConfigAPI instance

  // Fetch color settings from the ConfigAPI when the component mounts
  useEffect(() => {
    const fetchColors = async () => {
      const colors = await configAPI.getMapLegendColors(); // Fetch color configuration from API
      if (colors) {
        setCustomerIconColor(colors.customerIconColor);
        setTechnicianIconColor(colors.technicianIconColor);
      }
    };

    fetchColors();
  }, []); // This effect runs only once when the component mounts

  /**
   * Function to change the customer icon color.
   *
   * @param {string} color - The new color to set for the customer icon.
   */
  const changeCustomerIconColor = (color) => {
    setCustomerIconColor(color);
    console.log("Customer icon color changed to:", color);
  };

  /**
   * Function to change the technician icon color.
   *
   * @param {string} color - The new color to set for the technician icon.
   */
  const changeTechnicianIconColor = (color) => {
    setTechnicianIconColor(color);
    console.log("Technician icon color changed to:", color);
  };

  /**
   * Function to toggle the active/inactive state for customers.
   */
  const toggleCustomerActive = () => {
    setIsCustomerActive((prev) => !prev);
  };

  /**
   * Function to toggle the active/inactive state for technicians.
   */
  const toggleTechnicianActive = () => {
    setIsTechnicianActive((prev) => !prev);
    console.log("Technician active state:", !isTechnicianActive);
  };

  /**
   * Function to select an icon.
   *
   * @param {Object} iconData - The data representing the selected icon.
   */
  const selectIcon = (iconData) => {
    setSelectedIcon(iconData);
    console.log("Icon selected:", iconData);
  };

  // Show loading state if colors are not fetched yet
  if (customerIconColor === null || technicianIconColor === null) {
    return <div>Loading...</div>; // Display a loading message until colors are fetched
  }

  return (
    <IconContext.Provider
      value={{
        selectIcon,
        selectedIcon,
        customerIconColor,
        technicianIconColor,
        changeCustomerIconColor,
        changeTechnicianIconColor,
        isCustomerActive,
        isTechnicianActive,
        toggleCustomerActive,
        toggleTechnicianActive,
      }}
    >
      {children}
    </IconContext.Provider>
  );
};

/**
 * Custom hook to use the `IconContext` in functional components.
 *
 * @returns {Object} - Returns the context value containing the icon management functions and states.
 * @throws {Error} - Throws an error if this hook is used outside of an `IconProvider`.
 *
 * @example
 * const { selectIcon, customerIconColor, changeCustomerIconColor } = useIconContext();
 */
export const useIconContext = () => {
  const context = useContext(IconContext);
  if (!context) {
    throw new Error("useIconContext must be used within an IconProvider");
  }
  return context;
};

import React from "react";
import { IconProvider } from "./SelectedIconContext";
import { MapProvider } from "./MapContext";
import { useAppContext } from "./AppContext";

/**
 * `ContextWrapper` is a wrapper component that provides multiple context providers 
 * to its children components, ensuring they can access the shared state of 
 * `IconProvider`, `MapProvider`, and `useAppContext`.
 *
 * @component
 * @example
 * <ContextWrapper>
 *   <YourComponent />
 * </ContextWrapper>
 */
const ContextWrapper = ({ children }) => {
  // Destructure the `appChildren` from AppContext to be rendered alongside children
  const { appChildren } = useAppContext();

  return (
    <IconProvider>
      <MapProvider>
        {children}
        {appChildren}
      </MapProvider>
    </IconProvider>
  );
};

export default ContextWrapper;

import React, { createContext, useState, useContext } from 'react';

// Create a Context for the application state
const AppContext = createContext();

/**
 * `AppProvider` component provides the context to its children.
 * It manages the `appChildren` state and provides a function to update it.
 *
 * @component
 * @example
 * <AppProvider>
 *   <YourComponent />
 * </AppProvider>
 */
export const AppProvider = ({ children }) => {
  // State to store the app children (can be any type of data)
  const [appChildren, setAppChildren] = useState();

  return (
    <AppContext.Provider value={{ appChildren, setAppChildren }}>
      {children}
    </AppContext.Provider>
  );
};

/**
 * Custom hook to access the app context. Throws an error if used outside of the `AppProvider`.
 *
 * @returns {object} The context value containing `appChildren` state and the `setAppChildren` updater function.
 * @throws {Error} If the hook is called outside the context provider.
 * @example
 * const { appChildren, setAppChildren } = useAppContext();
 */
export const useAppContext = () => {
  const context = useContext(AppContext);

  // Ensure that the context is used within a provider
  if (!context) {
    throw new Error('useAppContext must be used within an AppContextProvider');
  }

  return context;
};

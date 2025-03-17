import React from "react";
import HomeScreen from "./components/HomeScreen";
import { AppProvider } from "./context/AppContext";
import ContextWrapper from "./context/ContextWrapper";

/**
 * The `App` component is the root component of the application.
 * It wraps the entire application with necessary context providers to ensure state management and context functionality throughout the app.
 * 
 * - `AppProvider` manages global application state and provides access to the context for app-wide functionality.
 * - `ContextWrapper` is used to wrap any additional contexts or providers that may be needed for specific features of the app.
 * 
 * @component
 * @example
 * <App />
 * 
 * @returns {JSX.Element} The JSX for the `App` component, which renders the `HomeScreen` inside the context providers.
 */
function App() {
  return (
    // Wrapping the app in context providers to ensure context is available throughout the component tree.
    <AppProvider>
      <ContextWrapper>
        {/* HomeScreen component is rendered here, which is the main entry point for the application */}
        <HomeScreen />
      </ContextWrapper>
    </AppProvider>
  );
}

export default App;

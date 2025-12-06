import React, { useEffect } from "react";
import { Platform } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import * as NavigationBar from "expo-navigation-bar";

import AppNavigator from "./src/navigation/AppNavigator";
import { useAppThemeLogic } from "./src/hooks/useAppThemeLogic";
import { ThemeProvider } from "./src/theme/ThemeContext";

const App: React.FC = () => {
  const { themeContextValue, navigationTheme } = useAppThemeLogic();

  return (
    <SafeAreaProvider>
      <ThemeProvider value={themeContextValue}>
        <AppNavigator navigationTheme={navigationTheme} />
      </ThemeProvider>
    </SafeAreaProvider>
  );
};

export default App;

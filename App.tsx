import React, { useEffect } from "react";
import { Platform } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import * as NavigationBar from "expo-navigation-bar";
import * as Notifications from "expo-notifications";

import AppNavigator from "./src/navigation/AppNavigator";
import { useAppThemeLogic } from "./src/hooks/useAppThemeLogic";
import { ThemeProvider } from "./src/theme/ThemeContext";

const App: React.FC = () => {
  const { themeContextValue, navigationTheme } = useAppThemeLogic();

  useEffect(() => {
    Notifications.setNotificationHandler({
      handleNotification: async () => ({
        shouldShowBanner: true,
        shouldShowList: true,
        shouldPlaySound: false,
        shouldSetBadge: false,
      }),
    });
  }, []);

  return (
    <SafeAreaProvider>
      <ThemeProvider value={themeContextValue}>
        <AppNavigator navigationTheme={navigationTheme} />
      </ThemeProvider>
    </SafeAreaProvider>
  );
};

export default App;

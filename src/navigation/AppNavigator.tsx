import React, { useEffect, useState } from "react";
import { ActivityIndicator, View } from "react-native";
import { NavigationContainer, Theme } from "@react-navigation/native";
import AuthNavigator from "./AuthNavigator";
import MainTabNavigator from "./MainTabNavigator";
import { clearSession, getSavedToken } from "../services/authStorage";

type AppNavigatorProps = {
  navigationTheme: Theme;
};

const AppNavigator: React.FC<AppNavigatorProps> = ({ navigationTheme }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [checkingAuth, setCheckingAuth] = useState<boolean>(true);

  useEffect(() => {
    const loadToken = async () => {
      try {
        const token = await getSavedToken();
        setIsAuthenticated(!!token);
      } catch (e) {
        console.warn("Nie udało się odczytać tokenu auth", e);
        setIsAuthenticated(false);
      } finally {
        setCheckingAuth(false);
      }
    };

    void loadToken();
  }, []);

  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = async () => {
    await clearSession();
    setIsAuthenticated(false);
  };

  if (checkingAuth) {
    return (
      <NavigationContainer theme={navigationTheme}>
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
          <ActivityIndicator size="large" />
        </View>
      </NavigationContainer>
    );
  }

  return (
    <NavigationContainer theme={navigationTheme}>
      {isAuthenticated ? (
        <MainTabNavigator onLogout={handleLogout} />
      ) : (
        <AuthNavigator onLoginSuccess={handleLoginSuccess} />
      )}
    </NavigationContainer>
  );
};

export default AppNavigator;

import {
    DarkTheme,
    DefaultTheme,
    NavigationContainer,
} from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React, { useMemo, useState } from "react";
import { useColorScheme } from "react-native";
import { ThemeProvider } from "./theme/ThemeContext";

import LoginScreen from "./screens/LoginScreen";
import RegisterScreen from "./screens/RegisterScreen";
import ScreenTemplate from "./screens/ScreenTemplate";
import SettingsScreen from "./screens/SettingsScreen";
import StartScreen from "./screens/StartScreen";
import HomeScreen from "./screens/HomeScreen";
import TicketScreen from "./screens/TicketScreen";
import TransactionScreen from "./screens/TransactionScreen";
import WalletScreen from "./screens/WalletScreen";
import CarScreen from "./screens/CarScreen";

const GREEN = "#8BC34A";

// Typy tras dla stosu nawigacji
export type RootStackParamList = {
  Start: undefined;
  Login: undefined;
  Register: undefined;
  Ticket: undefined;
  Transaction: undefined;
  Wallet: undefined;
  Settings: undefined;
  Home: undefined;
  Car: undefined;
  Ekran1: { title: string };
  Ekran2: { title: string };
  Ekran3: { title: string };
  Ekran4: { title: string };
  Ekran5: { title: string };
  Ekran6: { title: string };
  Ekran7: { title: string };
  Ekran8: { title: string };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const LightNavTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: "#f2f2f2",
    card: "#ffffff",
    text: "#111111",
    primary: GREEN,
    border: "rgba(0,0,0,0.06)",
  },
};

const DarkNavTheme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    background: "#101010",
    card: "#1b1b1b",
    text: "#ffffff",
    primary: GREEN,
    border: "rgba(255,255,255,0.08)",
  },
};

const App: React.FC = () => {
  const systemScheme = useColorScheme();
  const [forceDark, setForceDark] = useState<boolean>(false);
  const [biometricsEnabled, setBiometricsEnabled] = useState<boolean>(false);

  const isDark = forceDark || systemScheme === "dark";

  const themeContextValue = useMemo(
    () => ({
      isDark,
      forceDark,
      setForceDark,
      biometricsEnabled,
      setBiometricsEnabled,
      colors: isDark
        ? {
            background: "#101010",
            card: "#1b1b1b",
            text: "#ffffff",
            subtitle: "#bbbbbb",
            border: "rgba(255,255,255,0.06)",
            primary: GREEN,
          }
        : {
            background: "#f2f2f2",
            card: "#ffffff",
            text: "#111111",
            subtitle: "#555555",
            border: "rgba(0,0,0,0.06)",
            primary: GREEN,
          },
    }),
    [isDark, forceDark, biometricsEnabled]
  );

  const navigationTheme = isDark ? DarkNavTheme : LightNavTheme;

  return (
    <ThemeProvider value={themeContextValue}>
      <NavigationContainer theme={navigationTheme}>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Start" component={StartScreen} />
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Register" component={RegisterScreen} />
          <Stack.Screen name="Ticket" component={TicketScreen} />
          <Stack.Screen name="Transaction" component={TransactionScreen} />
          <Stack.Screen name="Wallet" component={WalletScreen} />
          <Stack.Screen name="Settings" component={SettingsScreen} />
          <Stack.Screen name="Car" component={CarScreen} />
          {/* Nowe ekrany testowe */}
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen
            name="Ekran1"
            component={ScreenTemplate}
            initialParams={{ title: "Ekran 1" }}
          />
          <Stack.Screen
            name="Ekran2"
            component={ScreenTemplate}
            initialParams={{ title: "Ekran 2" }}
          />
          <Stack.Screen
            name="Ekran3"
            component={ScreenTemplate}
            initialParams={{ title: "Ekran 3" }}
          />
          <Stack.Screen
            name="Ekran4"
            component={ScreenTemplate}
            initialParams={{ title: "Ekran 4" }}
          />
          <Stack.Screen
            name="Ekran5"
            component={ScreenTemplate}
            initialParams={{ title: "Ekran 5" }}
          />
          <Stack.Screen
            name="Ekran6"
            component={ScreenTemplate}
            initialParams={{ title: "Ekran 6" }}
          />
          <Stack.Screen
            name="Ekran7"
            component={ScreenTemplate}
            initialParams={{ title: "Ekran 7" }}
          />
          <Stack.Screen
            name="Ekran8"
            component={ScreenTemplate}
            initialParams={{ title: "Ekran 8" }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </ThemeProvider>
  );
};

export default App;

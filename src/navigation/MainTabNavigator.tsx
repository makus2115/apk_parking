import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Ionicons from "@expo/vector-icons/Ionicons";

import HomeScreen from "../screens/HomeScreen";
import TicketScreen from "../screens/TicketScreen";
import TransactionScreen from "../screens/TransactionScreen";
import WalletScreen from "../screens/WalletScreen";
import CarScreen from "../screens/CarScreen";
import MapScreen from "../screens/MapScreen";
import SettingsScreen from "../screens/SettingsScreen";
import UserProfileScreen from "../screens/UserProfileScreen";
import ScreenTemplate from "../screens/ScreenTemplate";
import { MainTabParamList } from "./types";

const Tab = createBottomTabNavigator<MainTabParamList>();

function getIconName(route: keyof MainTabParamList, focused: boolean): string {
  switch (route) {
    case "Home":
      return focused ? "home" : "home-outline";
    case "Ticket":
      return focused ? "ticket" : "ticket-outline";
    case "Transaction":
      return focused ? "receipt" : "receipt-outline";
    case "Wallet":
      return focused ? "wallet" : "wallet-outline";
    case "Car":
      return focused ? "car" : "car-outline";
    case "Map":
      return focused ? "map" : "map-outline";
    case "UserProfile":
      return focused ? "person" : "person-outline";
    case "Settings":
      return focused ? "settings" : "settings-outline";
    default:
      return "ellipse-outline";
  }
}

const MainTabNavigator: React.FC = () => (
  <Tab.Navigator
    screenOptions={({ route }) => ({
      tabBarActiveTintColor: "#8BC34A",
      tabBarInactiveTintColor: "#aaa",
      tabBarStyle: { backgroundColor: "#111", display: "none" },
      tabBarShowLabel: false,
      tabBarHideOnKeyboard: true,
      headerShown: false,
      tabBarIcon: ({ color, size, focused }) => (
        <Ionicons name={getIconName(route.name as keyof MainTabParamList, focused)} size={size} color={color} />
      ),
      // Brak fizycznych przycisków – nawigacja odbywa się przyciskiem w UI
      tabBarButton: () => null,
    })}
  >
    <Tab.Screen name="Home" component={HomeScreen} options={{ title: "Start" }} />
    <Tab.Screen name="Ticket" component={TicketScreen} options={{ title: "Bilet" }} />
    <Tab.Screen name="Transaction" component={TransactionScreen} options={{ title: "Transakcje" }} />
    <Tab.Screen name="Wallet" component={WalletScreen} options={{ title: "Portfel" }} />
    <Tab.Screen name="Car" component={CarScreen} options={{ title: "Samochody" }} />
    <Tab.Screen name="Map" component={MapScreen} options={{ title: "Mapa" }} />
    <Tab.Screen name="UserProfile" component={UserProfileScreen} options={{ title: "Profil" }} />
    <Tab.Screen name="Settings" component={SettingsScreen} options={{ title: "Ustawienia" }} />

    {/* Ukryte ekrany szablonowe – dostępne przez navigation.navigate */}
    <Tab.Screen
      name="Ekran1"
      component={ScreenTemplate}
      initialParams={{ title: "Ekran 1" }}
      options={{ tabBarButton: () => null }}
    />
    <Tab.Screen
      name="Ekran2"
      component={ScreenTemplate}
      initialParams={{ title: "Ekran 2" }}
      options={{ tabBarButton: () => null }}
    />
    <Tab.Screen
      name="Ekran3"
      component={ScreenTemplate}
      initialParams={{ title: "Ekran 3" }}
      options={{ tabBarButton: () => null }}
    />
    <Tab.Screen
      name="Ekran4"
      component={ScreenTemplate}
      initialParams={{ title: "Ekran 4" }}
      options={{ tabBarButton: () => null }}
    />
    <Tab.Screen
      name="Ekran5"
      component={ScreenTemplate}
      initialParams={{ title: "Ekran 5" }}
      options={{ tabBarButton: () => null }}
    />
    <Tab.Screen
      name="Ekran6"
      component={ScreenTemplate}
      initialParams={{ title: "Ekran 6" }}
      options={{ tabBarButton: () => null }}
    />
    <Tab.Screen
      name="Ekran7"
      component={ScreenTemplate}
      initialParams={{ title: "Ekran 7" }}
      options={{ tabBarButton: () => null }}
    />
    <Tab.Screen
      name="Ekran8"
      component={ScreenTemplate}
      initialParams={{ title: "Ekran 8" }}
      options={{ tabBarButton: () => null }}
    />
  </Tab.Navigator>
);

export default MainTabNavigator;

import React, { ComponentType } from "react";
import { NavigationContainer, Theme } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import LoginScreen from "../screens/LoginScreen";
import RegisterScreen from "../screens/RegisterScreen";
import ScreenTemplate from "../screens/ScreenTemplate";
import SettingsScreen from "../screens/SettingsScreen";
import StartScreen from "../screens/StartScreen";
import HomeScreen from "../screens/HomeScreen";
import TicketScreen from "../screens/TicketScreen";
import UserProfileScreen from "../screens/UserProfileScreen";
import TransactionScreen from "../screens/TransactionScreen";
import WalletScreen from "../screens/WalletScreen";
import CarScreen from "../screens/CarScreen";
import MapScreen from "../screens/MapScreen";
import { RootStackParamList } from "./types";
import { ScreenWrapper } from "../components";

const Stack = createNativeStackNavigator<RootStackParamList>();

const withScreenWrapper =
  <P extends object>(Component: ComponentType<P>) =>
  (props: P) =>
    (
      <ScreenWrapper>
        <Component {...props} />
      </ScreenWrapper>
    );

const StartWrapped = withScreenWrapper(StartScreen);
const RegisterWrapped = withScreenWrapper(RegisterScreen);
const SettingsWrapped = withScreenWrapper(SettingsScreen);
const UserProfileWrapped = withScreenWrapper(UserProfileScreen);
const TransactionWrapped = withScreenWrapper(TransactionScreen);
const WalletWrapped = withScreenWrapper(WalletScreen);
const CarWrapped = withScreenWrapper(CarScreen);
const MapWrapped = withScreenWrapper(MapScreen);
const ScreenTemplateWrapped = withScreenWrapper(ScreenTemplate);

type AppNavigatorProps = {
  navigationTheme: Theme;
};

const AppNavigator: React.FC<AppNavigatorProps> = ({ navigationTheme }) => (
  <NavigationContainer theme={navigationTheme}>
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Start" component={StartWrapped} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterWrapped} />
      <Stack.Screen name="Ticket" component={TicketScreen} />
      <Stack.Screen name="Transaction" component={TransactionWrapped} />
      <Stack.Screen name="Wallet" component={WalletWrapped} />
      <Stack.Screen name="Settings" component={SettingsWrapped} />
      <Stack.Screen name="Car" component={CarWrapped} />
      <Stack.Screen name="Map" component={MapWrapped} />
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="UserProfile" component={UserProfileWrapped} />
      <Stack.Screen
        name="Ekran1"
        component={ScreenTemplateWrapped}
        initialParams={{ title: "Ekran 1" }}
      />
      <Stack.Screen
        name="Ekran2"
        component={ScreenTemplateWrapped}
        initialParams={{ title: "Ekran 2" }}
      />
      <Stack.Screen
        name="Ekran3"
        component={ScreenTemplateWrapped}
        initialParams={{ title: "Ekran 3" }}
      />
      <Stack.Screen
        name="Ekran4"
        component={ScreenTemplateWrapped}
        initialParams={{ title: "Ekran 4" }}
      />
      <Stack.Screen
        name="Ekran5"
        component={ScreenTemplateWrapped}
        initialParams={{ title: "Ekran 5" }}
      />
      <Stack.Screen
        name="Ekran6"
        component={ScreenTemplateWrapped}
        initialParams={{ title: "Ekran 6" }}
      />
      <Stack.Screen
        name="Ekran7"
        component={ScreenTemplateWrapped}
        initialParams={{ title: "Ekran 7" }}
      />
      <Stack.Screen
        name="Ekran8"
        component={ScreenTemplateWrapped}
        initialParams={{ title: "Ekran 8" }}
      />
    </Stack.Navigator>
  </NavigationContainer>
);

export default AppNavigator;

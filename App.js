// App.js
import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import StartScreen from "./screens/StartScreen";
import LoginScreen from "./screens/LoginScreen";
import RegisterScreen from "./screens/RegisterScreen";
import TestScreen from "./screens/TestScreen";
import ScreenTemplate from "./screens/ScreenTemplate";
import TicketScreen from "./screens/TicketScreen";
import TransaktionScreen from "./screens/TransaktionScreen";
import PayScreen from "./screens/PayScreen";


const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Start" component={StartScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Register" component={RegisterScreen} />
        <Stack.Screen name="Ticket" component={TicketScreen} />
        <Stack.Screen name="Transaktion" component={TransaktionScreen} />
        <Stack.Screen name="Pay" component={PayScreen} />
        {/* Nowe ekrany testowe */}
        <Stack.Screen name="Test" component={TestScreen} />
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
  );
}

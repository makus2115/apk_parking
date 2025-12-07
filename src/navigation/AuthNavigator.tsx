import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import StartScreen from "../screens/StartScreen";
import LoginScreen from "../screens/LoginScreen";
import RegisterScreen from "../screens/RegisterScreen";
import { AuthStackParamList } from "./types";

type AuthNavigatorProps = {
  onLoginSuccess?: () => void;
};

const Stack = createNativeStackNavigator<AuthStackParamList>();

const AuthNavigator: React.FC<AuthNavigatorProps> = ({ onLoginSuccess }) => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="Start" component={StartScreen} />
    <Stack.Screen name="Login">
      {(props) => <LoginScreen {...props} onLoginSuccess={onLoginSuccess} />}
    </Stack.Screen>
    <Stack.Screen name="Register" component={RegisterScreen} />
  </Stack.Navigator>
);

export default AuthNavigator;

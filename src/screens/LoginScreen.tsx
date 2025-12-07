import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { StackNavigationProp } from "@react-navigation/stack";
import * as LocalAuthentication from "expo-local-authentication";
import React, { useContext, useEffect, useState } from "react";
import {
  Alert,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { ScreenWrapper } from "../components";
import { AuthStackParamList } from "../navigation/types";
import { login } from "../services/authApi";
import { saveSession } from "../services/authStorage";
import { ThemeContext } from "../theme/ThemeContext";

const GREEN = "#8BC34A";

type LoginScreenNavigationProp = StackNavigationProp<AuthStackParamList, "Login">;

interface LoginScreenProps {
  navigation: LoginScreenNavigationProp;
  onLoginSuccess?: () => void;
}

interface ThemeContextValue {
  biometricsEnabled: boolean;
}

const LoginScreen: React.FC<LoginScreenProps> = ({
  navigation,
  onLoginSuccess,
}) => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const { biometricsEnabled } = useContext(ThemeContext) as ThemeContextValue;
  const [canUseBiometrics, setCanUseBiometrics] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const checkBiometrics = async () => {
      if (!biometricsEnabled) {
        setCanUseBiometrics(false);
        return;
      }
      try {
        const hasHardware = await LocalAuthentication.hasHardwareAsync();
        const isEnrolled = await LocalAuthentication.isEnrolledAsync();
        setCanUseBiometrics(hasHardware && isEnrolled);
      } catch {
        setCanUseBiometrics(false);
      }
    };

    void checkBiometrics();
  }, [biometricsEnabled]);

  const handleBiometricLogin = async (): Promise<void> => {
    try {
      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: "Zaloguj się biometrycznie",
        cancelLabel: "Anuluj",
      });

      if (result.success) {
        onLoginSuccess?.();
      } else {
        Alert.alert("Niepowodzenie", "Nie udało się potwierdzić tożsamości.");
      }
    } catch {
      Alert.alert("Błąd", "Logowanie biometryczne jest niedostępne.");
    }
  };

  const handleLogin = async (): Promise<void> => {
    const emailValue = email.trim();
    if (!emailValue || !password) {
      Alert.alert("Błąd", "Proszę wprowadzić e-mail i hasło.");
      return;
    }

    setLoading(true);
    try {
      const response = await login(emailValue, password);

      await saveSession(response.token, response.user);

      Alert.alert("Logowanie", `Zalogowano jako ${response.user.email}`);
      onLoginSuccess?.();
    } catch (e) {
      const message = e instanceof Error ? e.message : "Spróbuj ponownie.";
      Alert.alert("Błąd logowania", message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScreenWrapper>
      <View style={styles.root}>
        <View style={styles.container}>
          <Text style={styles.title}>Zaloguj się</Text>

          <TextInput
            style={styles.input}
            placeholder="E-mail"
            placeholderTextColor="#aaa"
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={setEmail}
          />

          <TextInput
            style={styles.input}
            placeholder="Hasło"
            placeholderTextColor="#aaa"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />

          <Pressable
            style={({ pressed }) => [styles.button, pressed && styles.pressed]}
            onPress={handleLogin}
            disabled={loading}
          >
            <Text style={styles.buttonText}>
              {loading ? "Logowanie..." : "Zaloguj"}
            </Text>
          </Pressable>

          {canUseBiometrics && (
            <Pressable
              style={({ pressed }) => [
                styles.biometricButton,
                pressed && styles.pressed,
              ]}
              onPress={handleBiometricLogin}
            >
              <MaterialCommunityIcons
                name="fingerprint"
                size={24}
                color={GREEN}
                style={styles.biometricIcon}
              />
              <Text style={styles.biometricButtonText}>
                Zaloguj odciskiem palca / Face ID
              </Text>
            </Pressable>
          )}

          <Pressable
            onPress={() => navigation.navigate("Register")}
            style={({ pressed }) => [styles.linkBtn, pressed && styles.pressed]}
          >
            <Text style={styles.link}>Nie masz konta? Zarejestruj się</Text>
          </Pressable>
        </View>
      </View>
    </ScreenWrapper>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#000" },
  container: {
    flex: 1,
    backgroundColor: "#101010",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  title: {
    color: "#fff",
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 30,
  },
  input: {
    width: "100%",
    backgroundColor: "#1e1e1e",
    color: "#fff",
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    fontSize: 16,
  },
  button: {
    width: "100%",
    backgroundColor: GREEN,
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
  linkBtn: {
    marginTop: 10,
  },
  link: {
    color: "#aaa",
    marginTop: 20,
    fontSize: 14,
  },
  biometricButton: {
    width: "100%",
    marginTop: 10,
    padding: 15,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: GREEN,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    backgroundColor: "transparent",
  },
  biometricIcon: {
    marginRight: 10,
  },
  biometricButtonText: {
    color: GREEN,
    fontSize: 16,
    fontWeight: "600",
  },
  pressed: {
    opacity: 0.85,
  },
});

import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { StackNavigationProp } from "@react-navigation/stack";
import * as LocalAuthentication from "expo-local-authentication";
import { StatusBar } from "expo-status-bar";
import React, { useContext, useEffect, useState } from "react";
import {
  Alert,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { ThemeContext } from "../theme/ThemeContext";

const GREEN = "#8BC34A";

type RootStackParamList = {
  Start: undefined;
  Register: undefined;
  Login: undefined;
};

type LoginScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  "Login"
>;

interface LoginScreenProps {
  navigation: LoginScreenNavigationProp;
}

interface ThemeContextValue {
  biometricsEnabled: boolean;
}

const LoginScreen: React.FC<LoginScreenProps> = ({ navigation }) => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const { biometricsEnabled } = useContext(ThemeContext) as ThemeContextValue;
  const [canUseBiometrics, setCanUseBiometrics] = useState<boolean>(false);

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
      } catch (e) {
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
        navigation.replace("Start");
      } else {
        Alert.alert("Niepowodzenie", "Nie udało się potwierdzić tożsamości.");
      }
    } catch (e) {
      Alert.alert("Błąd", "Logowanie biometryczne jest niedostępne.");
    }
  };

  const handleLogin = (): void => {
    if (!email || !password) {
      Alert.alert("Błąd", "Proszę wprowadzić e-mail i hasło.");
      return;
    }
    // TODO: API
    Alert.alert("Logowanie", `Zalogowano jako ${email}`);
  };

  const handleGoogleLogin = (): void => {
    // TODO: API Google
    Alert.alert("Logowanie", "Zalogowano przez Google");
  };

  return (
    <SafeAreaView style={styles.root}>
      <StatusBar style="light" />
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

        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>Zaloguj</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.googleButton]}
          onPress={handleGoogleLogin}
        >
          <MaterialCommunityIcons
            name="google"
            size={24}
            color="white"
            style={styles.googleIcon}
          />
          <Text style={styles.buttonText}>Zaloguj przez Google</Text>
        </TouchableOpacity>

        {canUseBiometrics && (
          <TouchableOpacity
            style={styles.biometricButton}
            onPress={handleBiometricLogin}
            activeOpacity={0.85}
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
          </TouchableOpacity>
        )}

        <TouchableOpacity
          onPress={() => navigation.navigate("Register")}
          style={styles.linkBtn}
        >
          <Text style={styles.link}>Nie masz konta? Zarejestruj się</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
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
  googleButton: {
    flexDirection: "row",
    justifyContent: "center",
    backgroundColor: "#615f5fff",
  },
  googleIcon: {
    marginRight: 10,
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
});

import React, { useMemo, useState } from "react";
import { StatusBar } from "expo-status-bar";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  SafeAreaView,
} from "react-native";

export default function RegisterScreen({ navigation }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [accepted, setAccepted] = useState(false);
  const [loading, setLoading] = useState(false);

  const passwordStrength = useMemo(() => {
    // siła hasla
    let score = 0;
    if (password.length >= 8) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;
    const labels = [
      "Bardzo słabe",
      "Słabe",
      "Średnie",
      "Dobre",
      "Bardzo dobre",
    ];
    return { score, label: labels[score] || labels[0] };
  }, [password]);

  const validate = () => {
    const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    if (!name.trim()) return "Podaj imię i nazwisko (lub nick).";
    if (!emailOk) return "Podaj poprawny adres e-mail.";
    if (password.length < 8) return "Hasło musi mieć co najmniej 8 znaków.";
    if (password !== confirm) return "Hasła nie są takie same.";
    if (!accepted) return "Musisz zaakceptować regulamin.";
    return null;
  };

  const handleRegister = async () => {
    const err = validate();
    if (err) {
      Alert.alert("Błąd", err);
      return;
    }
    try {
      setLoading(true);
      //API rejestracji
      await new Promise((r) => setTimeout(r, 800)); //symulacja
      Alert.alert("Sukces", "Konto utworzone! Możesz się zalogować.", [
        {
          text: "OK",
          onPress: () => {
            if (navigation?.navigate) navigation.navigate("Login");
          },
        },
      ]);
    } catch (e) {
      Alert.alert("Błąd", "Coś poszło nie tak. Spróbuj ponownie.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.root}>
      <StatusBar style="light" />
      <View style={styles.container}>
        <Text style={styles.title}>Utwórz konto</Text>

        <TextInput
          style={styles.input}
          placeholder="Imię i nazwisko / Nick"
          placeholderTextColor="#aaa"
          value={name}
          onChangeText={setName}
        />

        <TextInput
          style={styles.input}
          placeholder="E-mail"
          placeholderTextColor="#aaa"
          autoCapitalize="none"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
        />

        <View style={styles.passwordRow}>
          <TextInput
            style={[styles.input, styles.passwordInput]}
            placeholder="Hasło"
            placeholderTextColor="#aaa"
            secureTextEntry={!showPass}
            value={password}
            onChangeText={setPassword}
          />
          <TouchableOpacity
            onPress={() => setShowPass((s) => !s)}
            style={styles.eyeBtn}
            accessibilityLabel={showPass ? "Ukryj hasło" : "Pokaż hasło"}
          >
            <Text style={styles.eyeText}>{showPass ? "Ukryj" : "Pokaż"}</Text>
          </TouchableOpacity>
        </View>

        <TextInput
          style={styles.input}
          placeholder="Powtórz hasło"
          placeholderTextColor="#aaa"
          secureTextEntry={!showPass}
          value={confirm}
          onChangeText={setConfirm}
        />

        <View style={styles.strengthWrap}>
          <View style={styles.strengthBarBg}>
            <View
              style={[
                styles.strengthBarFill,
                { width: `${(passwordStrength.score / 4) * 100}%` },
              ]}
            />
          </View>
          <Text style={styles.strengthText}>
            Siła hasła: {passwordStrength.label}
          </Text>
        </View>

        <TouchableOpacity
          onPress={() => setAccepted((v) => !v)}
          style={styles.checkboxRow}
        >
          <View style={[styles.checkbox, accepted && styles.checkboxChecked]}>
            {accepted ? <Text style={styles.checkboxMark}>✓</Text> : null}
          </View>
          <Text style={styles.checkboxLabel}>
            Akceptuję regulamin i politykę prywatności
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, loading && styles.buttonDisabled]}
          onPress={handleRegister}
          disabled={loading}
        >
          <Text style={styles.buttonText}>
            {loading ? "Tworzenie konta..." : "Zarejestruj się"}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => navigation?.navigate?.("Login")}
          style={styles.linkBtn}
        >
          <Text style={styles.link}>Masz już konto? Zaloguj się</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const GREEN = "#8BC34A";

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
    marginBottom: 24,
  },
  input: {
    width: "100%",
    backgroundColor: "#1e1e1e",
    color: "#fff",
    padding: 15,
    borderRadius: 10,
    marginBottom: 12,
    fontSize: 16,
    borderWidth: 1,
    borderColor: "#2a2a2a",
  },
  passwordRow: {
    width: "100%",
    position: "relative",
  },
  passwordInput: {
    paddingRight: 80,
  },
  eyeBtn: {
    position: "absolute",
    right: 10,
    top: 10,
    height: 36,
    paddingHorizontal: 10,
    justifyContent: "center",
    borderRadius: 8,
    backgroundColor: "#2a2a2a",
  },
  eyeText: { color: "#fff", fontSize: 12 },
  strengthWrap: {
    width: "100%",
    marginBottom: 10,
  },
  strengthBarBg: {
    width: "100%",
    height: 8,
    backgroundColor: "#2a2a2a",
    borderRadius: 999,
    overflow: "hidden",
  },
  strengthBarFill: {
    height: 8,
    backgroundColor: "#00C853",
  },
  strengthText: {
    color: "#aaa",
    fontSize: 12,
    marginTop: 6,
  },
  checkboxRow: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 8,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#3a3a3a",
    marginRight: 10,
    backgroundColor: "#1e1e1e",
    justifyContent: "center",
    alignItems: "center",
  },
  checkboxChecked: {
    backgroundColor: GREEN,
    borderColor: GREEN,
  },
  checkboxMark: { color: "#fff", fontSize: 14, lineHeight: 14 },
  checkboxLabel: { color: "#ddd", flex: 1, fontSize: 14 },
  button: {
    width: "100%",
    backgroundColor: GREEN,
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 12,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonText: {
    color: "#black",
    fontSize: 18,
    fontWeight: "600",
  },
  linkBtn: { marginTop: 18 },
  link: { color: "#aaa", fontSize: 14 },
});

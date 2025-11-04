import React from "react";
import { StatusBar } from "expo-status-bar";
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
} from "react-native";
import AntDesign from "@expo/vector-icons/AntDesign";

export default function StartScreen({ navigation }) {
  return (
    <SafeAreaView style={styles.root}>
      <StatusBar style="light" />

      <ImageBackground
        source={require("../assets/parking.png")}
        style={styles.bg}
        resizeMode="cover"
      >
        {/* BANER Z LOGO */}
        <View style={styles.header}>
          <AntDesign name="car" size={50} color="#303130ff" />
          <Text style={styles.logoText}>
            <Text style={styles.logoAccent}>Aplikacja </Text>Parkingowa
          </Text>
        </View>

        {/* PANEL TEKSTOWY NA ŚRODKU */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Parkowanie staje się łatwiejsze</Text>
          <View style={styles.hr} />
          <Text style={styles.cardBody}>
            Nasza aplikacja to prosty sposób na płatności i parkowanie. Kupisz
            bilety, zaparkujesz w strefach płatnych, zarządzasz czasem postoju,
            saldem konta i historią parkowania. Dodatkowo lokalizacja miejsca
            postoju i rozpoznawanie tablic rejestracyjnych.
            {"\n\n"}Zarejestruj się, aby odkryć wszystkie funkcje, lub zaloguj
            się, jeśli masz już konto.
          </Text>
        </View>

        {/* Przycisk tymczasowy */}
        <View style={styles.centerButtonContainer}>
<TouchableOpacity
  style={styles.testButton}
  onPress={() => navigation.navigate("Test")}
  activeOpacity={0.8}
>
  <Text style={styles.testButtonText}>Test ekranów</Text>
</TouchableOpacity>
        </View>

        {/* STOPKA Z PRZYCISKAMI */}
        <View style={styles.footer}>
          <TouchableOpacity
            style={[styles.cta, styles.ctaSecondary]}
            onPress={() => navigation.navigate("Register")}
            activeOpacity={0.85}
          >
            <Text style={[styles.ctaText, styles.ctaTextSecondary]}>
              ZAŁÓŻ KONTO
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.cta, styles.ctaPrimary]}
            onPress={() => navigation.navigate("Login")}
            activeOpacity={0.85}
          >
            <Text style={[styles.ctaText, styles.ctaTextPrimary]}>
              ZALOGUJ SIĘ
            </Text>
          </TouchableOpacity>
        </View>
      </ImageBackground>
    </SafeAreaView>
  );
}

const GREEN = "#8BC34A";
const OVERLAY = "rgba(0,0,0,0.55)";

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#000" },
  bg: { flex: 1 },
  header: {
    height: 150,
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 10,
    paddingBottom: 5,
  },
  logoText: {
    color: "#fff",
    fontSize: 28,
    fontWeight: "700",
    letterSpacing: 0.5,
    textShadowRadius: 5,
    textShadowColor: "black",
  },
  logoAccent: {
    color: "#b0f8acff",
    fontWeight: "800",
    textShadowRadius: 5,
    textShadowColor: "black",
  },
  card: {
    marginHorizontal: 16,
    marginTop: 24,
    backgroundColor: OVERLAY,
    borderRadius: 10,
    paddingHorizontal: 18,
    paddingVertical: 16,
  },
  cardTitle: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 8,
  },
  hr: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: "rgba(255,255,255,0.35)",
    marginBottom: 10,
  },
  cardBody: {
    color: "#fff",
    fontSize: 16,
    lineHeight: 22,
  },
  centerButtonContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  testButton: {
    backgroundColor: GREEN,
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 8,
    elevation: 3,
  },
  testButtonText: {
    fontSize: 18,
    fontWeight: "700",
    color: "#0B2B13",
  },
  footer: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: 14,
    paddingTop: 12,
    paddingBottom: 16,
    flexDirection: "row",
    gap: 12,
  },
  cta: {
    flex: 1,
    height: 52,
    borderRadius: 6,
    alignItems: "center",
    justifyContent: "center",
  },
  ctaSecondary: {
    backgroundColor: "#E3F2FD",
    borderWidth: 1,
    borderColor: GREEN,
  },
  ctaPrimary: {
    backgroundColor: GREEN,
  },
  ctaText: { fontSize: 16, fontWeight: "700" },
  ctaTextSecondary: { color: GREEN },
  ctaTextPrimary: { color: "#0B2B13" },
});

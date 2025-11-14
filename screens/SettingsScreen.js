import React, { useContext, useMemo } from "react";
import { StatusBar } from "expo-status-bar";
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  Switch,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { ThemeContext } from "../theme/ThemeContext";

const GREEN = "#8BC34A";

export default function SettingsScreen({ navigation }) {
  const {
    isDark,
    forceDark,
    setForceDark,
    biometricsEnabled,
    setBiometricsEnabled,
    colors,
  } = useContext(ThemeContext);

  const styles = useMemo(() => createStyles(colors), [colors]);

  const handleDarkModeToggle = (value) => {
    setForceDark(value);
  };

  const handleBiometricsToggle = (value) => {
    setBiometricsEnabled(value);
  };

  return (
    <SafeAreaView style={styles.root}>
      <StatusBar style={isDark ? "light" : "dark"} />
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Ustawienia</Text>
        <Text style={styles.headerSubtitle}>
          Dostosuj działanie aplikacji do swoich potrzeb
        </Text>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
      >
        {}
        <Text style={styles.sectionTitle}>Ogólne</Text>

        <View style={styles.row}>
          <View style={styles.rowText}>
            <Text style={styles.rowTitle}>Tryb ciemny</Text>
            <Text style={styles.rowSubtitle}>
              Włącz, aby wymusić ciemny motyw. Gdy wyłączone, używany jest
              motyw systemowy.
            </Text>
          </View>
          <Switch
            value={forceDark}
            onValueChange={handleDarkModeToggle}
            thumbColor={forceDark ? GREEN : "#f4f3f4"}
          />
        </View>

        {/* Sekcja: Bezpieczeństwo */}
        <Text style={styles.sectionTitle}>Bezpieczeństwo</Text>

        <View style={styles.row}>
          <View style={styles.rowText}>
            <Text style={styles.rowTitle}>Logowanie biometryczne</Text>
            <Text style={styles.rowSubtitle}>
              Używaj odcisku palca lub Face ID (jeśli dostępne), aby szybciej
              się logować.
            </Text>
          </View>
          <Switch
            value={biometricsEnabled}
            onValueChange={handleBiometricsToggle}
            thumbColor={biometricsEnabled ? GREEN : "#f4f3f4"}
          />
        </View>
      </ScrollView>

      {/* Przyciski na dole */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.btn, styles.btnOutline]}
          activeOpacity={0.85}
          onPress={() => navigation.goBack()}
        >
          <Text style={[styles.btnText, styles.btnTextOutline]}>Anuluj</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.btn}
          activeOpacity={0.85}
          onPress={() => navigation.navigate("Start")}
        >
          <Text style={styles.btnText}>Zapisz i wróć</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const createStyles = (colors) =>
  StyleSheet.create({
    root: {
      flex: 1,
      backgroundColor: colors.background,
    },
    header: {
      paddingHorizontal: 16,
      paddingTop: 16,
      paddingBottom: 8,
    },
    headerTitle: {
      color: colors.text,
      fontSize: 24,
      fontWeight: "800",
      marginBottom: 4,
    },
    headerSubtitle: {
      color: colors.subtitle,
      fontSize: 13,
    },
    scroll: {
      flex: 1,
    },
    scrollContent: {
      paddingHorizontal: 16,
      paddingBottom: 24,
    },
    sectionTitle: {
      color: colors.subtitle,
      fontSize: 13,
      fontWeight: "700",
      marginTop: 20,
      marginBottom: 8,
      textTransform: "uppercase",
    },
    row: {
      backgroundColor: colors.card,
      borderRadius: 12,
      paddingVertical: 12,
      paddingHorizontal: 14,
      marginBottom: 10,
      borderWidth: 1,
      borderColor: colors.border,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
    },
    rowText: {
      flex: 1,
      paddingRight: 12,
    },
    rowTitle: {
      color: colors.text,
      fontSize: 15,
      fontWeight: "700",
      marginBottom: 2,
    },
    rowSubtitle: {
      color: colors.subtitle,
      fontSize: 12,
    },
    footer: {
      flexDirection: "row",
      padding: 16,
      gap: 12,
    },
    btn: {
      flex: 1,
      backgroundColor: GREEN,
      paddingVertical: 12,
      borderRadius: 10,
      alignItems: "center",
      justifyContent: "center",
    },
    btnOutline: {
      backgroundColor: "transparent",
      borderWidth: 1,
      borderColor: GREEN,
    },
    btnText: {
      color: "#0B2B13",
      fontSize: 14,
      fontWeight: "800",
    },
    btnTextOutline: {
      color: GREEN,
    },
  });

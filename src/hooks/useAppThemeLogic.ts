import AsyncStorage from "@react-native-async-storage/async-storage";
import { DarkTheme, DefaultTheme, Theme } from "@react-navigation/native";
import { useCallback, useEffect, useMemo, useState } from "react";
import { ThemeContextValue } from "../theme/ThemeContext";

const GREEN = "#8BC34A";
const FORCE_DARK_STORAGE_KEY = "@settings_force_dark";
const BIOMETRICS_STORAGE_KEY = "@settings_biometrics_enabled";

const LightNavTheme: Theme = {
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

const DarkNavTheme: Theme = {
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

export const useAppThemeLogic = () => {
  const [forceDark, setForceDarkState] = useState<boolean>(false);
  const [biometricsEnabled, setBiometricsEnabledState] =
    useState<boolean>(true);
  const [notificationsEnabled, setNotificationsEnabled] =
    useState<boolean>(false);

  useEffect(() => {
    const loadForceDarkPreference = async () => {
      try {
        const storedValue = await AsyncStorage.getItem(FORCE_DARK_STORAGE_KEY);
        if (storedValue === null) return;

        setForceDarkState(storedValue === "true");
      } catch (e) {
        console.warn("Nie udaˆo si© wczyta† ustawienia motywu", e);
      }
    };

    void loadForceDarkPreference();
  }, []);

  useEffect(() => {
    const loadBiometricsPreference = async () => {
      try {
        const storedValue = await AsyncStorage.getItem(BIOMETRICS_STORAGE_KEY);

        if (storedValue === null) {
          setBiometricsEnabledState(true);
          return;
        }

        setBiometricsEnabledState(storedValue === "true");
      } catch (e) {
        console.warn("Nie udało się wczytać ustawienia biometrii", e);
        setBiometricsEnabledState(true);
      }
    };

    void loadBiometricsPreference();
  }, []);

  const setForceDark = useCallback(async (value: boolean) => {
    setForceDarkState(value);

    try {
      await AsyncStorage.setItem(FORCE_DARK_STORAGE_KEY, JSON.stringify(value));
    } catch (e) {
      console.warn("Nie udaˆo si© zapisa† ustawienia motywu", e);
    }
  }, []);

  const setBiometricsEnabled = useCallback(async (value: boolean) => {
    setBiometricsEnabledState(value);

    try {
      await AsyncStorage.setItem(BIOMETRICS_STORAGE_KEY, JSON.stringify(value));
    } catch (e) {
      console.warn("Nie udało się zapisać ustawienia biometrii", e);
    }
  }, []);

  const isDark = forceDark;

  const themeContextValue = useMemo<ThemeContextValue>(
    () => ({
      isDark,
      forceDark,
      setForceDark,
      biometricsEnabled,
      setBiometricsEnabled,
      notificationsEnabled,
      setNotificationsEnabled,
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
    [
      isDark,
      forceDark,
      biometricsEnabled,
      notificationsEnabled,
      setForceDark,
      setBiometricsEnabled,
    ]
  );

  const navigationTheme = isDark ? DarkNavTheme : LightNavTheme;

  return { themeContextValue, navigationTheme };
};

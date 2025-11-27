import { DarkTheme, DefaultTheme, Theme } from "@react-navigation/native";
import { useMemo, useState } from "react";
import { useColorScheme } from "react-native";
import { ThemeContextValue } from "../theme/ThemeContext";

const GREEN = "#8BC34A";

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
  const systemScheme = useColorScheme();
  const [forceDark, setForceDark] = useState<boolean>(false);
  const [biometricsEnabled, setBiometricsEnabled] = useState<boolean>(false);

  const isDark = forceDark || systemScheme === "dark";

  const themeContextValue = useMemo<ThemeContextValue>(
    () => ({
      isDark,
      forceDark,
      setForceDark,
      biometricsEnabled,
      setBiometricsEnabled,
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
    [isDark, forceDark, biometricsEnabled]
  );

  const navigationTheme = isDark ? DarkNavTheme : LightNavTheme;

  return { themeContextValue, navigationTheme };
};

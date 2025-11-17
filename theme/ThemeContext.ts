import React from "react";

const GREEN = "#8BC34A";

export type ThemeColors = {
  background: string;
  card: string;
  text: string;
  subtitle: string;
  border: string;
  primary: string;
};

export type ThemeContextValue = {
  isDark: boolean;
  forceDark: boolean;

  setForceDark: (value: boolean) => void;

  biometricsEnabled: boolean;
  setBiometricsEnabled: (value: boolean) => void;

  colors: ThemeColors;
};

export const ThemeContext = React.createContext<ThemeContextValue>({
  isDark: true,
  forceDark: false,

  setForceDark: () => {},

  biometricsEnabled: false,
  setBiometricsEnabled: () => {},

  colors: {
    background: "#101010",
    card: "#1b1b1b",
    text: "#ffffff",
    subtitle: "#bbbbbb",
    border: "rgba(255,255,255,0.06)",
    primary: GREEN,
  },
});

export const ThemeProvider = ThemeContext.Provider;

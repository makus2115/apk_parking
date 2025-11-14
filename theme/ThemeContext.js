import React from "react";

const GREEN = "#8BC34A";

export const ThemeContext = React.createContext({
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

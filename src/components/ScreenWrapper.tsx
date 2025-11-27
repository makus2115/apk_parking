import { StatusBar } from "expo-status-bar";
import React, { ReactNode, useContext } from "react";
import { StyleSheet, View } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { ThemeContext } from "../theme/ThemeContext";

type ScreenWrapperProps = {
  children: ReactNode;
  footer?: ReactNode;
};

const ScreenWrapper: React.FC<ScreenWrapperProps> = ({ children, footer }) => {
  const { colors, isDark } = useContext(ThemeContext);

  return (
    <SafeAreaProvider>
      <SafeAreaView
        edges={["top", "right", "bottom", "left"]}
        style={[styles.safe, { backgroundColor: colors.background }]}
      >
        <StatusBar style={isDark ? "light" : "dark"} />
        <View style={styles.content}>{children}</View>
        {footer ? <View style={styles.footer}>{footer}</View> : null}
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({
  safe: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
  footer: {
    paddingHorizontal: 1,
    paddingTop: 1,
    paddingBottom: 1,
  },
});

export default ScreenWrapper;

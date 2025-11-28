import React, { useContext } from "react";
import {
  Pressable,
  PressableProps,
  StyleProp,
  StyleSheet,
  Text,
  TextStyle,
  ViewStyle,
} from "react-native";
import { ThemeContext } from "../theme/ThemeContext";

type AppButtonProps = PressableProps & {
  title: string;
  variant?: "primary" | "outline";
  textStyle?: StyleProp<TextStyle>;
  style?: StyleProp<ViewStyle>;
};

const AppButton: React.FC<AppButtonProps> = ({
  title,
  variant = "primary",
  style,
  textStyle,
  ...pressableProps
}) => {
  const { colors } = useContext(ThemeContext);
  const isOutline = variant === "outline";

  return (
    <Pressable
      android_ripple={{ color: "rgba(0,0,0,0.05)", foreground: true }}
      {...pressableProps}
      style={({ pressed }) => [
        styles.base,
        {
          backgroundColor: isOutline ? "transparent" : colors.primary,
          borderColor: colors.primary,
          borderWidth: isOutline ? 1 : 0,
        },
        style as ViewStyle,
        pressed && styles.pressed,
      ]}
    >
      <Text
        style={[
          styles.text,
          { color: isOutline ? colors.primary : "#0B2B13" },
          textStyle,
        ]}
      >
        {title}
      </Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  base: {
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    fontSize: 16,
    fontWeight: "700",
  },
  pressed: {
    opacity: 0.85,
  },
});

export default AppButton;

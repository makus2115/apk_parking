import React, { useContext } from "react";
import {
  StyleProp,
  StyleSheet,
  Text,
  TextStyle,
  TouchableOpacity,
  TouchableOpacityProps,
  ViewStyle,
} from "react-native";
import { ThemeContext } from "../theme/ThemeContext";

type AppButtonProps = TouchableOpacityProps & {
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
  ...touchableProps
}) => {
  const { colors } = useContext(ThemeContext);
  const isOutline = variant === "outline";

  return (
    <TouchableOpacity
      activeOpacity={0.85}
      {...touchableProps}
      style={[
        styles.base,
        {
          backgroundColor: isOutline ? "transparent" : colors.primary,
          borderColor: colors.primary,
          borderWidth: isOutline ? 1 : 0,
        },
        style,
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
    </TouchableOpacity>
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
});

export default AppButton;

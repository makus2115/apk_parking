import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { ScreenWrapper } from "../components";

type ScreenTemplateProps = {
  route: {
    params?: {
      title?: string;
    };
  };
};

const ScreenTemplate: React.FC<ScreenTemplateProps> = ({ route }) => {
  const title = route.params?.title ?? "Ekran";

  return (
    <ScreenWrapper>
      <View style={styles.root}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.subtitle}>Tutaj pojawi się treść ekranu.</Text>
      </View>
    </ScreenWrapper>
  );
};

export default ScreenTemplate;

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "#101010",
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
  },
  title: { fontSize: 28, fontWeight: "800", color: "#fff" },
  subtitle: { marginTop: 8, fontSize: 14, color: "#aaa", textAlign: "center" },
});

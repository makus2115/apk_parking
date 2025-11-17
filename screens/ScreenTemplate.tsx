import React from "react";
import {
    SafeAreaView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

const GREEN = "#8BC34A";

type ScreenTemplateProps = {
  route?: {
    params?: {
      title?: string;
    };
  };
  navigation: any;
};

const ScreenTemplate: React.FC<ScreenTemplateProps> = ({ route, navigation }) => {
  const title = route?.params?.title ?? "Ekran";

  return (
    <SafeAreaView style={styles.root}>
      <View style={styles.container}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.subtitle}>To jest prosty ekran podglądowy.</Text>

        <View style={styles.actions}>
          {/* Przycisk wracający bezpośrednio na StartScreen */}
          <TouchableOpacity
            style={styles.btn}
            onPress={() => navigation.navigate("Start")}
            activeOpacity={0.85}
          >
            <Text style={styles.btnText}>Wróć</Text>
          </TouchableOpacity>

          {/* Przycisk powrotu do TestScreen */}
          <TouchableOpacity
            style={[styles.btn, styles.btnOutline]}
            onPress={() => navigation.navigate("Test")}
            activeOpacity={0.85}
          >
            <Text style={[styles.btnText, styles.btnTextOutline]}>
              Powrót do testu
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default ScreenTemplate;

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#101010" },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  title: { color: "#fff", fontSize: 26, fontWeight: "800", marginBottom: 8 },
  subtitle: { color: "#ccc", fontSize: 14, marginBottom: 24 },
  actions: { flexDirection: "row", gap: 12 },
  btn: {
    backgroundColor: GREEN,
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: 8,
  },
  btnText: { color: "#0B2B13", fontSize: 14, fontWeight: "800" },
  btnOutline: {
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: GREEN,
  },
  btnTextOutline: { color: GREEN },
});

import React from "react";
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
} from "react-native";

const items = [
  { key: "1", title: "Login", route: "Login" },
  { key: "2", title: "Register", route: "Register" },
  { key: "3", title: "TicketScreen", route: "Ticket" },
  { key: "4", title: "Transaction", route: "Transaction" },
  { key: "5", title: "Wallet", route: "Wallet" },
  { key: "6", title: "Ekran 6", route: "Ekran6" },
  { key: "7", title: "Ekran 7", route: "Ekran7" },
  { key: "8", title: "Settings", route: "Settings" },
];

export default function TestScreen({ navigation }) {
  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.tile}
      activeOpacity={0.85}
      onPress={() => navigation.navigate(item.route)}
    >
      <Text style={styles.tileTitle}>{item.title}</Text>
      <Text style={styles.tileDesc}>Przejdź do {item.title}</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.root}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Test ekranów</Text>
      </View>

      <FlatList
        data={items}
        renderItem={renderItem}
        keyExtractor={(it) => it.key}
        numColumns={2}
        columnWrapperStyle={styles.row}
        contentContainerStyle={styles.listContent}
      />
    </SafeAreaView>
  );
}

const GREEN = "#8BC34A";

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#101010" },
  header: { padding: 16, alignItems: "center" },
  headerText: { color: "#fff", fontSize: 22, fontWeight: "700" },
  listContent: { padding: 12, paddingBottom: 24 },
  row: { gap: 12, marginBottom: 12 },
  tile: {
    flex: 1,
    backgroundColor: "#1b1b1b",
    paddingVertical: 22,
    paddingHorizontal: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
    elevation: 2,
    justifyContent: "center",
  },
  tileTitle: { color: GREEN, fontSize: 18, fontWeight: "800", marginBottom: 6 },
  tileDesc: { color: "#ddd", fontSize: 13 },
});

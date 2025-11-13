import React from "react";
import { View, Text, FlatList, StyleSheet, SafeAreaView } from "react-native";

const transactions = [
  { id: "1", data: "2025-11-12 14:30", miejsce: "Centrum, ul. Parkowa", kwota: "10.00 PLN", czasPostoju: 60 },
  { id: "2", data: "2025-11-11 09:15", miejsce: "Nowe Miasto, ul. Główna", kwota: "8.50 PLN", czasPostoju: 45 },
  { id: "3", data: "2025-11-10 17:45", miejsce: "Stare Miasto, ul. Rynkowa", kwota: "12.00 PLN", czasPostoju: 90 },
  { id: "4", data: "2025-11-09 08:00", miejsce: "Dworzec, ul. Kolejowa", kwota: "7.00 PLN", czasPostoju: 120 },
  { id: "5", data: "2025-11-08 13:20", miejsce: "Park, ul. Leśna", kwota: "6.50 PLN", czasPostoju: 30 },
  { id: "6", data: "2025-11-08 13:20", miejsce: "Park, ul. Leśna", kwota: "6.50 PLN", czasPostoju: 30 },
  { id: "7", data: "2025-11-08 13:20", miejsce: "Park, ul. Leśna", kwota: "6.50 PLN", czasPostoju: 30 },
  { id: "8", data: "2025-11-08 13:20", miejsce: "Park, ul. Leśna", kwota: "6.50 PLN", czasPostoju: 30 },
];

const formatCzasPostoju = (czasPostoju) => {
  const godziny = Math.floor(czasPostoju / 60);
  const minuty = czasPostoju % 60;
  let wynik = "";

  if (godziny > 0) {
    wynik += `${godziny} godz. `;
  }
  if (minuty > 0) {
    wynik += `${minuty} min.`;
  }

  return wynik.trim();
};

export default function ParkingTransactionsScreen() {
  const renderItem = ({ item }) => (
    <View style={styles.transactionContainer}>
      <Text style={styles.transactionText}>Data: {item.data}</Text>
      <Text style={styles.transactionText}>Miejsce: {item.miejsce}</Text>
      <Text style={styles.transactionText}>Kwota: {item.kwota}</Text>
      <Text style={styles.transactionText}>Czas postoju: {formatCzasPostoju(item.czasPostoju)}</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Historia transakcji</Text>
      
      <FlatList
        data={transactions}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#101010",
    padding: 20,
  },
  title: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    marginTop: 20,
    textAlign: "center",
  },
  listContainer: {
    paddingBottom: 20,
  },
  transactionContainer: {
    backgroundColor: "#1e1e1e",
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  transactionText: {
    color: "#fff",
    fontSize: 16,
    marginBottom: 5,
  },
});

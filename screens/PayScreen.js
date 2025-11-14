import React, { useState, useCallback } from "react";
import { StatusBar } from "expo-status-bar";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  FlatList,
  Alert,
  ActivityIndicator,
} from "react-native";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";

const BALANCE_KEY = "@parking_balance";
const HISTORY_KEY = "@parking_topup_history";

export default function PayScreen() {
  const [balance, setBalance] = useState(0);
  const [amount, setAmount] = useState("10"); //bazowo 10zl
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  //wczytywanie danych przy każdym wejściu na ekran
  useFocusEffect(
    useCallback(() => {
      let isActive = true;

      const loadData = async () => {
        try {
          const storedBalance = await AsyncStorage.getItem(BALANCE_KEY);
          const storedHistory = await AsyncStorage.getItem(HISTORY_KEY);

          if (isActive) {
            if (storedBalance !== null) {
              setBalance(parseFloat(storedBalance));
            } else {
              setBalance(0);
            }

            if (storedHistory !== null) {
              setHistory(JSON.parse(storedHistory));
            } else {
              setHistory([]);
            }
          }
        } catch (e) {
          console.warn("Błąd wczytywania danych płatności:", e);
        } finally {
          if (isActive) {
            setLoading(false);
          }
        }
      };

      setLoading(true);
      loadData();

      return () => {
        isActive = false;
      };
    }, [])
  );

  const saveBalance = async (newBalance) => {
    try {
      await AsyncStorage.setItem(BALANCE_KEY, String(newBalance));
    } catch (e) {
      console.warn("Błąd zapisu salda:", e);
    }
  };

  const saveHistory = async (newHistory) => {
    try {
      await AsyncStorage.setItem(HISTORY_KEY, JSON.stringify(newHistory));
    } catch (e) {
      console.warn("Błąd zapisu historii:", e);
    }
  };

  const handleTopUp = async () => {
    const normalized = amount.replace(",", ".");
    const value = parseFloat(normalized);

    if (isNaN(value) || value <= 0) {
      Alert.alert("Błąd", "Wpisz prawidłową kwotę doładowania.");
      return;
    }

    const newBalance = balance + value;
    setBalance(newBalance);

    const now = new Date();
    const newEntry = {
      id: Date.now().toString(),
      amount: value,
      date: now.toLocaleString("pl-PL"),
    };

    const newHistory = [newEntry, ...history];
    setHistory(newHistory);

    //zapis do pamięci
    await saveBalance(newBalance);
    await saveHistory(newHistory);
  };

  const renderItem = ({ item }) => (
    <View style={styles.historyItem}>
      <Text style={styles.historyAmount}>{item.amount.toFixed(2)} zł</Text>
      <Text style={styles.historyDate}>{item.date}</Text>
    </View>
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.root}>
        <StatusBar style="light" />
        <View
          style={[
            styles.container,
            { justifyContent: "center", alignItems: "center" },
          ]}
        >
          <ActivityIndicator size="large" color="#8BC34A" />
          <Text style={{ color: "#fff", marginTop: 10 }}>
            Wczytywanie danych...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.root}>
      <View style={styles.container}>
        {/* SALDO */}
        <View style={styles.balanceContainer}>
          <View style={styles.balanceRow}>
            <MaterialCommunityIcons
              name="wallet"
              size={28}
              color="#8BC34A"
              style={{ marginRight: 10 }}
            />
            <Text style={styles.balanceLabel}>Dostępne saldo</Text>
          </View>
          <Text style={styles.balanceValue}>{balance.toFixed(2)} zł</Text>
        </View>

        {/* DOŁADOWANIE */}
        <View style={styles.topUpContainer}>
          <Text style={styles.sectionTitle}>Doładuj konto</Text>

          <View style={styles.amountRow}>
            <TextInput
              style={styles.amountInput}
              keyboardType="numeric"
              placeholder="Kwota"
              placeholderTextColor="#777"
              value={amount}
              onChangeText={setAmount}
            />
            <Text style={styles.amountCurrency}>zł</Text>
          </View>

          <TouchableOpacity style={styles.topUpButton} onPress={handleTopUp}>
            <Text style={styles.topUpButtonText}>Doładuj</Text>
          </TouchableOpacity>
        </View>

        {/* HISTORIA DOŁADOWAŃ */}
        <View style={styles.historyContainer}>
          <Text style={styles.sectionTitle}>Historia doładowań</Text>

          <FlatList
            data={history}
            keyExtractor={(item) => item.id}
            renderItem={renderItem}
            contentContainerStyle={{ paddingBottom: 20 }}
            ListEmptyComponent={
              <Text style={styles.emptyHistory}>
                Brak zarejestrowanych doładowań.
              </Text>
            }
          />
        </View>
      </View>
    </SafeAreaView>
  );
}

const GREEN = "#8BC34A";

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#000" },
  container: {
    flex: 1,
    backgroundColor: "#101010",
    padding: 20,
  },
  balanceContainer: {
    backgroundColor: "#1e1e1e",
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    marginTop: 20,
  },
  balanceRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  balanceLabel: {
    color: "#aaa",
    fontSize: 16,
  },
  balanceValue: {
    color: "#fff",
    fontSize: 28,
    fontWeight: "bold",
  },
  topUpContainer: {
    backgroundColor: "#1e1e1e",
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  sectionTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 12,
  },
  amountRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  amountInput: {
    flex: 1,
    backgroundColor: "#2a2a2a",
    color: "#fff",
    padding: 12,
    borderRadius: 8,
    fontSize: 16,
  },
  amountCurrency: {
    color: "#fff",
    fontSize: 16,
    marginLeft: 8,
  },
  topUpButton: {
    backgroundColor: GREEN,
    padding: 14,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 4,
  },
  topUpButtonText: {
    color: "#000",
    fontSize: 16,
    fontWeight: "600",
  },
  historyContainer: {
    flex: 1,
  },
  historyItem: {
    backgroundColor: "#1e1e1e",
    borderRadius: 10,
    padding: 12,
    marginBottom: 8,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  historyAmount: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "500",
  },
  historyDate: {
    color: "#aaa",
    fontSize: 13,
  },
  emptyHistory: {
    color: "#777",
    fontSize: 14,
    marginTop: 8,
  },
});

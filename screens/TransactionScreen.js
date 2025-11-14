// screens/ParkingTransactionsScreen.js
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const TICKETS_STORAGE_KEY = "@parking_tickets";

const ZONES = {
  A: { name: "Strefa A (centrum)", ratePerHour: 6.0 },
  B: { name: "Strefa B", ratePerHour: 4.0 },
  C: { name: "Strefa C", ratePerHour: 3.0 },
};

function formatPLN(v) {
  try {
    return new Intl.NumberFormat("pl-PL", {
      style: "currency",
      currency: "PLN",
      minimumFractionDigits: 2,
    }).format(v);
  } catch {
    const n = typeof v === "number" ? v.toFixed(2) : v;
    return `${n} PLN`;
  }
}

function formatCzasPostoju(czasPostoju) {
  const mins = Math.max(0, czasPostoju || 0);
  const godziny = Math.floor(mins / 60);
  const minuty = mins % 60;
  let wynik = "";
  if (godziny > 0) wynik += `${godziny} godz. `;
  if (minuty > 0) wynik += `${minuty} min.`;
  return wynik.trim() || "0 min.";
}

function formatDateTime(d) {
  try {
    return d.toLocaleString("pl-PL", {
      hour: "2-digit",
      minute: "2-digit",
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  } catch {
    return d.toString();
  }
}

function addMinutes(date, minutes) {
  const d = new Date(date);
  d.setMinutes(d.getMinutes() + minutes);
  return d;
}

function ceilToQuarterMinutes(mins) {
  const block = 15;
  return Math.ceil(mins / block) * block;
}

function computePricePLN(durationMinutes, ratePerHour) {
  const billable = ceilToQuarterMinutes(Math.max(0, durationMinutes));
  const price = (billable / 60) * ratePerHour;
  return { billable, price: +price.toFixed(2) };
}

function isTicketActive(ticket) {
  const now = new Date();
  const start = new Date(ticket.startISO);
  const end = new Date(ticket.endISO);
  return now >= start && now < end;
}

function isTicketFuture(ticket) {
  const now = new Date();
  const start = new Date(ticket.startISO);
  return now < start;
}

function getRemainingMinutes(ticket) {
  const now = new Date();
  const end = new Date(ticket.endISO);
  const diffMs = end.getTime() - now.getTime();
  const diffMin = Math.floor(diffMs / (60 * 1000));
  return diffMin > 0 ? diffMin : 0;
}

export default function ParkingTransactionsScreen() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState(null);

  useEffect(() => {
    loadTickets();
  }, []);

  async function loadTickets() {
    try {
      setLoading(true);
      const stored = await AsyncStorage.getItem(TICKETS_STORAGE_KEY);
      const parsed = stored ? JSON.parse(stored) : [];
      const sorted = parsed.sort(
        (a, b) => new Date(b.startISO) - new Date(a.startISO)
      );
      setTickets(sorted);
    } catch (e) {
      console.warn("Nie udało się wczytać historii biletów", e);
      setTickets([]);
    } finally {
      setLoading(false);
    }
  }

  function toggleMoreInfo(id) {
    setExpandedId((prev) => (prev === id ? null : id));
  }

  async function handleExtend(id) {
    const EXTENSION_MINUTES = 15;
    setTickets((prev) => {
      const updated = prev.map((t) => {
        if (t.id !== id) return t;

        const end = new Date(t.endISO);
        const newEnd = addMinutes(end, EXTENSION_MINUTES);
        const newDuration = (t.durationMin || 0) + EXTENSION_MINUTES;
        const zoneCfg = ZONES[t.zone] || { ratePerHour: 0 };
        const { price } = computePricePLN(newDuration, zoneCfg.ratePerHour);

        return {
          ...t,
          endISO: newEnd.toISOString(),
          durationMin: newDuration,
          amount: price,
        };
      });

      AsyncStorage.setItem(TICKETS_STORAGE_KEY, JSON.stringify(updated)).catch(
        (e) => console.warn("Nie udało się zaktualizować biletu", e)
      );

      return updated;
    });
  }

  const renderItem = ({ item }) => {
    const active = isTicketActive(item);
    const future = isTicketFuture(item);
    const remaining = active ? getRemainingMinutes(item) : 0;
    const expanded = expandedId === item.id;

    const start = new Date(item.startISO);
    const end = new Date(item.endISO);

    let statusLabel = "Zakończony";
    let statusStyle = styles.statusEnded;
    if (future) {
      statusLabel = "Zaplanowany";
      statusStyle = styles.statusFuture;
    } else if (active) {
      statusLabel = "Aktywny";
      statusStyle = styles.statusActive;
    }

    return (
      <View style={styles.transactionContainer}>
        <Text style={styles.transactionText}>
          Data: {formatDateTime(start)}
        </Text>
        <Text style={styles.transactionText}>
          Pojazd: <Text style={styles.bold}>{item.plate}</Text>
        </Text>
        <Text style={styles.transactionText}>
          Strefa: {item.zone} • {item.zoneName || ZONES[item.zone]?.name}
        </Text>
        <Text style={styles.transactionText}>
          Kwota: {formatPLN(item.amount)}
        </Text>
        <Text style={styles.transactionText}>
          Czas postoju: {formatCzasPostoju(item.durationMin)}
        </Text>

        <View style={styles.statusRow}>
          <Text style={[styles.statusText, statusStyle]}>
            Status: {statusLabel}
          </Text>
          {active && (
            <Text style={styles.remainingText}>
              Pozostały czas: {remaining} min
            </Text>
          )}
        </View>

        <View style={styles.buttonsRow}>
          <TouchableOpacity
            onPress={() => toggleMoreInfo(item.id)}
            style={styles.button}
          >
            <Text style={styles.buttonText}>
              {expanded ? "Mniej informacji" : "Więcej informacji"}
            </Text>
          </TouchableOpacity>

          {active && (
            <TouchableOpacity
              onPress={() => handleExtend(item.id)}
              style={[styles.button, styles.extendButton]}
            >
              <Text style={styles.buttonText}>Przedłuż postój</Text>
            </TouchableOpacity>
          )}
        </View>

        {expanded && (
          <View style={styles.moreInfoContainer}>
            <Text style={styles.moreInfoText}>ID biletu: {item.id}</Text>
            <Text style={styles.moreInfoText}>
              Okres: {formatDateTime(start)} – {formatDateTime(end)}
            </Text>
            <Text style={styles.moreInfoText}>
              Łączny czas: {formatCzasPostoju(item.durationMin)}
            </Text>
            <Text style={styles.moreInfoText}>
              Powiadomienie przed końcem: {item.notifyBeforeEnd ? "tak" : "nie"}
            </Text>
          </View>
        )}
      </View>
    );
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.title}>Historia biletów</Text>
        <View style={styles.center}>
          <ActivityIndicator size="large" />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Historia biletów</Text>

      {tickets.length === 0 ? (
        <View style={styles.center}>
          <Text style={styles.emptyText}>Brak zapisanych biletów.</Text>
        </View>
      ) : (
        <FlatList
          data={tickets}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContainer}
        />
      )}
    </SafeAreaView>
  );
}

const GREEN = "#8BC34A";

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
  bold: {
    fontWeight: "700",
  },
  statusRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 5,
    marginBottom: 10,
  },
  statusText: {
    fontSize: 14,
    fontWeight: "bold",
  },
  statusActive: {
    color: "#4CAF50",
  },
  statusEnded: {
    color: "#FF5252",
  },
  statusFuture: {
    color: "#FFCA28",
  },
  remainingText: {
    color: "#ccc",
    fontSize: 14,
  },
  buttonsRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 10,
  },
  button: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: "#333",
  },
  extendButton: {
    backgroundColor: GREEN,
  },
  buttonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
  moreInfoContainer: {
    marginTop: 10,
    borderTopWidth: 1,
    borderTopColor: "#333",
    paddingTop: 10,
  },
  moreInfoText: {
    color: "#ccc",
    fontSize: 14,
    marginBottom: 3,
  },
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  emptyText: {
    color: "#999",
    fontSize: 16,
  },
});

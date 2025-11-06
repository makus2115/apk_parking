// screens/ParkingTicketScreen.js
import React, { useMemo, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  Switch,
} from "react-native";

/** Konfiguracja stawek/stref (PLN za godzinę) */
const ZONES = {
  A: { name: "Strefa A (centrum)", ratePerHour: 6.0 },
  B: { name: "Strefa B", ratePerHour: 4.0 },
  C: { name: "Strefa C", ratePerHour: 3.0 },
};

/** Przykładowe tablice pojazdów użytkownika */
// TODO Dodać wczytywanie z globalnej
const DEFAULT_PLATES = ["WX 12345", "KR 7J202", "PO 9ABC1"];

/** Pomoc: formatowanie waluty */
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

/** Pomoc: zaokrąglenie w górę do 15-min bloków */
function ceilToQuarterMinutes(mins) {
  const block = 15;
  return Math.ceil(mins / block) * block;
}

/** Pomoc: dodawanie minut do daty */
function addMinutes(date, minutes) {
  const d = new Date(date);
  d.setMinutes(d.getMinutes() + minutes);
  return d;
}

function formatDateTime(d) {
  try {
    return d.toLocaleString("pl-PL", {
      weekday: "short",
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

/** Obliczenie ceny: stawka liniowa, rozliczenie co 15 minut */
function computePricePLN(durationMinutes, ratePerHour) {
  const billable = ceilToQuarterMinutes(Math.max(0, durationMinutes));
  const price = (billable / 60) * ratePerHour;
  return { billable, price: +price.toFixed(2) };
}

/** Prosty chip */
const Chip = ({ selected, onPress, children }) => (
  <TouchableOpacity
    onPress={onPress}
    style={[styles.chip, selected && styles.chipSelected]}
  >
    <Text style={[styles.chipText, selected && styles.chipTextSelected]}>
      {children}
    </Text>
  </TouchableOpacity>
);

/** Karta sekcyjna */
const Card = ({ children }) => <View style={styles.card}>{children}</View>;

/** Wiersz podsumowania */
const Row = ({ label, value, big }) => (
  <View style={styles.row}>
    <Text style={[styles.rowLabel, big && styles.rowBig]}>{label}</Text>
    <Text style={[styles.rowValue, big && styles.rowBig]}>{value}</Text>
  </View>
);

export default function ParkingTicketScreen({ navigation }) {
  const [plates, setPlates] = useState(DEFAULT_PLATES);
  const [selectedPlate, setSelectedPlate] = useState(plates[0]);
  const [addingPlate, setAddingPlate] = useState(false);
  const [newPlate, setNewPlate] = useState("");

  const [zone, setZone] = useState("A");
  const [startNow, setStartNow] = useState(true);
  const [startOffsetMin, setStartOffsetMin] = useState(0); // jeśli nie "teraz"
  const [durationMin, setDurationMin] = useState(60); // 15..480
  const [notifyBeforeEnd, setNotifyBeforeEnd] = useState(true);
  const [loading, setLoading] = useState(false);

  const now = new Date();
  const startTime = startNow
    ? now
    : addMinutes(
        now,
        Math.max(0, Math.min(720, parseInt(startOffsetMin || 0, 10)))
      );
  const endTime = addMinutes(startTime, Math.max(15, durationMin));

  const rate = ZONES[zone].ratePerHour;
  const { billable, price } = useMemo(
    () => computePricePLN(durationMin, rate),
    [durationMin, rate]
  );

  const canShorten = durationMin > 15;
  const canExtend = durationMin < 8 * 60; // 8h limit na transakcję

  function addPlate() {
    const p = newPlate.trim().toUpperCase();
    if (!p) {
      Alert.alert("Tablica", "Wpisz numer rejestracyjny.");
      return;
    }
    if (plates.includes(p)) {
      Alert.alert("Tablica", "Taki numer jest już na liście.");
      return;
    }
    setPlates((prev) => [p, ...prev]);
    setSelectedPlate(p);
    setNewPlate("");
    setAddingPlate(false);
  }

  async function handleBuy() {
    if (!selectedPlate) {
      Alert.alert("Błąd", "Wybierz pojazd.");
      return;
    }
    setLoading(true);
    try {
      await new Promise((r) => setTimeout(r, 800)); // symulacja

      const payload = {
        plate: selectedPlate,
        zone,
        zoneName: ZONES[zone].name,
        startISO: startTime.toISOString(),
        endISO: endTime.toISOString(),
        durationMin: ceilToQuarterMinutes(durationMin),
        amount: price,
        notifyBeforeEnd,
      };

      Alert.alert(
        "Bilet aktywny",
        `Pojazd: ${payload.plate}\n${payload.zoneName}\nOd: ${formatDateTime(
          startTime
        )}\nDo: ${formatDateTime(endTime)}\nKwota: ${formatPLN(price)}`
      );

      // TODO dodać aktywne bilety do homescreen(opcjonalnie)
      if (navigation?.navigate) {
        //navigation.navigate("HomeScreen", { ticket: payload });
      }
    } catch (e) {
      Alert.alert("Błąd", "Nie udało się kupić biletu. Spróbuj ponownie.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.container}>
      <Text style={styles.heading}>Kup bilet parkingowy</Text>

      {/* Pojazd */}
      <Card>
        <Text style={styles.label}>Pojazd</Text>
        <View style={styles.rowWrap}>
          {plates.map((p) => (
            <Chip
              key={p}
              selected={p === selectedPlate}
              onPress={() => setSelectedPlate(p)}
            >
              {p}
            </Chip>
          ))}
          {!addingPlate ? (
            <TouchableOpacity
              style={[styles.chip, styles.chipAdd]}
              onPress={() => setAddingPlate(true)}
            >
              <Text style={[styles.chipText, { fontWeight: "700" }]}>
                + Dodaj
              </Text>
            </TouchableOpacity>
          ) : null}
        </View>

        {addingPlate ? (
          <View style={styles.addPlateRow}>
            <TextInput
              style={[styles.input, { flex: 1 }]}
              placeholder="Np. WX 12345"
              placeholderTextColor="#aaa"
              autoCapitalize="characters"
              value={newPlate}
              onChangeText={setNewPlate}
            />
            <TouchableOpacity
              style={styles.btnGhost}
              onPress={() => setAddingPlate(false)}
            >
              <Text style={styles.btnGhostText}>Anuluj</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.btn} onPress={addPlate}>
              <Text style={styles.btnText}>Dodaj</Text>
            </TouchableOpacity>
          </View>
        ) : null}
      </Card>

      {/* Strefa */}
      <Card>
        <Text style={styles.label}>Strefa parkowania</Text>
        <View style={styles.rowWrap}>
          {Object.entries(ZONES).map(([k, v]) => (
            <Chip key={k} selected={zone === k} onPress={() => setZone(k)}>
              {k} • {v.name.replace(/^Strefa [A-Z] ?/, "")} •{" "}
              {formatPLN(v.ratePerHour)}/h
            </Chip>
          ))}
        </View>
        <Text style={styles.hint}>
          Rozliczenie co 15 minut. Maks. 8 godzin w jednej transakcji.
        </Text>
      </Card>

      {/* Start i czas trwania */}
      <Card>
        <Text style={styles.label}>Rozpoczęcie</Text>
        <View style={styles.toggleRow}>
          <TouchableOpacity
            onPress={() => setStartNow(true)}
            style={[styles.toggleBtn, startNow && styles.toggleSelected]}
          >
            <Text style={[styles.toggleText, startNow && styles.toggleTextSel]}>
              Teraz
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setStartNow(false)}
            style={[styles.toggleBtn, !startNow && styles.toggleSelected]}
          >
            <Text
              style={[styles.toggleText, !startNow && styles.toggleTextSel]}
            >
              Zaplanuj
            </Text>
          </TouchableOpacity>
        </View>

        {!startNow ? (
          <View style={styles.inlineRow}>
            <Text style={styles.inlineLabel}>Start za</Text>
            <TextInput
              keyboardType="number-pad"
              style={[styles.input, styles.inputSmall]}
              placeholder="min"
              placeholderTextColor="#aaa"
              value={String(startOffsetMin)}
              onChangeText={(t) => setStartOffsetMin(t.replace(/[^\d]/g, ""))}
            />
            <Text style={styles.inlineSuffix}>min</Text>
          </View>
        ) : null}

        <View style={styles.divider} />

        <Text style={styles.label}>Czas trwania</Text>
        <View style={styles.durationRow}>
          <TouchableOpacity
            onPress={() => setDurationMin((m) => Math.max(15, m - 15))}
            style={[styles.qtyBtn, !canShorten && styles.btnDisabled]}
            disabled={!canShorten}
          >
            <Text style={styles.qtyText}>−15</Text>
          </TouchableOpacity>
          <Text style={styles.durationText}>
            {Math.floor(durationMin / 60)} h {durationMin % 60} min
          </Text>
          <TouchableOpacity
            onPress={() => setDurationMin((m) => Math.min(8 * 60, m + 15))}
            style={[styles.qtyBtn, !canExtend && styles.btnDisabled]}
            disabled={!canExtend}
          >
            <Text style={styles.qtyText}>+15</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.hint}>
          Start: {formatDateTime(startTime)}
          {"\n"}
          Koniec: {formatDateTime(endTime)}
        </Text>
      </Card>

      {/* Przypomnienie */}
      <Card>
        <View style={styles.reminderRow}>
          <View style={{ flex: 1 }}>
            <Text style={styles.reminderTitle}>
              Przypomnij 5 min przed końcem
            </Text>
            <Text style={styles.hint}>
              Powiadomienie push/SMS (zależnie od ustawień)
            </Text>
          </View>
          <Switch
            value={notifyBeforeEnd}
            onValueChange={setNotifyBeforeEnd}
            thumbColor={notifyBeforeEnd ? "#e6f5ff" : "#777"}
            trackColor={{ true: GREEN, false: "#333" }}
          />
        </View>
      </Card>

      {/* Podsumowanie */}
      <Card>
        <Text style={styles.label}>Podsumowanie</Text>
        <Row label="Tablice" value={selectedPlate} />
        <Row label="Strefa" value={`${zone} • ${ZONES[zone].name}`} />
        <Row label="Stawka" value={`${formatPLN(rate)}/h`} />
        <Row label="Czas rozliczeniowy" value={`${billable} min`} />
        <Row label="Kwota do zapłaty" value={formatPLN(price)} big />
      </Card>

      <TouchableOpacity
        style={[styles.payBtn, loading && { opacity: 0.7 }]}
        onPress={handleBuy}
        disabled={loading}
      >
        <Text style={styles.payText}>
          {loading ? "Przetwarzanie..." : `Kup bilet – ${formatPLN(price)}`}
        </Text>
      </TouchableOpacity>

      <View style={{ height: 28 }} />
    </ScrollView>
  );
}

const GREEN = "#8BC34A";
const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#101010" },
  container: { padding: 16, paddingBottom: 40 },
  heading: {
    color: "#fff",
    fontSize: 28,
    fontWeight: "800",
    marginBottom: 16,
  },
  card: {
    backgroundColor: "#161616",
    borderRadius: 14,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#242424",
  },
  label: {
    color: "#bbb",
    fontSize: 13,
    marginBottom: 8,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  rowWrap: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  chip: {
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 999,
    backgroundColor: "#1e1e1e",
    borderWidth: 1,
    borderColor: "#2a2a2a",
    marginRight: 8,
    marginBottom: 8,
  },
  chipSelected: {
    backgroundColor: GREEN,
    borderColor: GREEN,
  },
  chipText: { color: "#ddd", fontSize: 14 },
  chipTextSelected: { color: "#fff", fontWeight: "700" },
  chipAdd: { borderStyle: "dashed" },

  addPlateRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginTop: 10,
  },
  input: {
    backgroundColor: "#1e1e1e",
    color: "#fff",
    padding: 14,
    borderRadius: 10,
    fontSize: 16,
    borderWidth: 1,
    borderColor: "#2a2a2a",
  },
  inputSmall: {
    width: 92,
    textAlign: "center",
    paddingHorizontal: 10,
  },

  btn: {
    backgroundColor: GREEN,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: GREEN,
  },
  btnText: { color: "#fff", fontWeight: "700" },

  btnGhost: {
    backgroundColor: "transparent",
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#2a2a2a",
  },
  btnGhostText: { color: "#ddd", fontWeight: "600" },

  toggleRow: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 8,
  },
  toggleBtn: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#2a2a2a",
    backgroundColor: "#1e1e1e",
  },
  toggleSelected: {
    backgroundColor: "#0a0f1a",
    borderColor: GREEN,
  },
  toggleText: { color: "#bbb", fontWeight: "600" },
  toggleTextSel: { color: "#e6f5ff" },

  inlineRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginTop: 8,
  },
  inlineLabel: { color: "#ddd" },
  inlineSuffix: { color: "#aaa" },

  divider: {
    height: 1,
    backgroundColor: "#242424",
    marginVertical: 12,
  },

  durationRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
    marginTop: 4,
  },
  qtyBtn: {
    width: 76,
    height: 44,
    borderRadius: 10,
    backgroundColor: "#1e1e1e",
    borderWidth: 1,
    borderColor: "#2a2a2a",
    alignItems: "center",
    justifyContent: "center",
  },
  qtyText: { color: "#fff", fontSize: 18, fontWeight: "700" },
  btnDisabled: { opacity: 0.4 },
  durationText: { color: "#fff", fontSize: 18, fontWeight: "700" },

  hint: { color: "#8a8a8a", fontSize: 12, marginTop: 6 },

  reminderRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  reminderTitle: { color: "#fff", fontSize: 16, fontWeight: "700" },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 8,
  },
  rowLabel: { color: "#bbb" },
  rowValue: { color: "#fff", fontWeight: "600" },
  rowBig: { fontSize: 18 },

  payBtn: {
    backgroundColor: "#00C853",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#1b5e20",
    marginTop: 4,
  },
  payText: { color: "#071b0a", fontSize: 18, fontWeight: "800" },
});

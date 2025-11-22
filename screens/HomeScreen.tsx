import React, { useEffect, useRef, useState, useCallback } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  FlatList,
  ListRenderItem,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  StatusBar,
  Platform,
  Animated,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";

const GREEN = "#8BC34A";
const DRAWER_WIDTH = 260;

const BALANCE_KEY = "@parking_balance" as const;
const TICKETS_STORAGE_KEY = "@parking_tickets" as const;

const ZONES = {
  A: { name: "Strefa A (centrum)", ratePerHour: 6.0 },
  B: { name: "Strefa B", ratePerHour: 4.0 },
  C: { name: "Strefa C", ratePerHour: 3.0 },
} as const;

type ZoneKey = keyof typeof ZONES;

type ParkingTicket = {
  id: string;
  status: "ACTIVE" | "EXPIRED" | "CANCELLED";
  createdAtISO: string;
  plate: string;
  zone: ZoneKey;
  zoneName?: string;
  startISO: string;
  endISO: string;
  durationMin: number;
  amount: number;
  notifyBeforeEnd: boolean;
};

type HomeItem = {
  key: string;
  title: string;
  route: string;
};

const items: HomeItem[] = [
  { key: "3", title: "TicketScreen", route: "Ticket" },
  { key: "4", title: "Transaction", route: "Transaction" },
  { key: "5", title: "Wallet", route: "Wallet" },
  { key: "6", title: "Car", route: "Car" },
  { key: "7", title: "Map", route: "Map" },
  { key: "8", title: "UserProfile", route: "UserProfile" },
];

type HomeScreenProps = {
  navigation: any;
};

function addMinutes(date: Date, minutes: number): Date {
  const d = new Date(date);
  d.setMinutes(d.getMinutes() + minutes);
  return d;
}

function ceilToQuarterMinutes(mins: number): number {
  const block = 15;
  return Math.ceil(mins / block) * block;
}

function computePricePLN(
  durationMinutes: number,
  ratePerHour: number
): { billable: number; price: number } {
  const billable = ceilToQuarterMinutes(Math.max(0, durationMinutes));
  const price = (billable / 60) * ratePerHour;
  return { billable, price: +price.toFixed(2) };
}

function pickTicketToDisplay(tickets: ParkingTicket[]): ParkingTicket | null {
  if (!tickets.length) return null;

  const now = new Date();

  // 1) wszystkie AKTYWNE (start <= now < end)
  const activeTickets = tickets.filter((t) => {
    const start = new Date(t.startISO);
    const end = new Date(t.endISO);
    return now >= start && now < end;
  });

  if (activeTickets.length > 0) {
    // np. najpóźniej kończący się bilet
    activeTickets.sort(
      (a, b) =>
        new Date(b.endISO).getTime() - new Date(a.endISO).getTime()
    );
    return activeTickets[0];
  }

  // 2) wszystkie ZAPLANOWANE (start > now)
  const plannedTickets = tickets.filter((t) => {
    const start = new Date(t.startISO);
    return start > now;
  });

  if (plannedTickets.length > 0) {
    // najbliższy w przyszłości
    plannedTickets.sort(
      (a, b) =>
        new Date(a.startISO).getTime() - new Date(b.startISO).getTime()
    );
    return plannedTickets[0];
  }

  // 3) brak aktywnych i zaplanowanych – weź „ostatni” (jak dotychczas)
  const sortedByStartDesc = [...tickets].sort(
    (a, b) =>
      new Date(b.startISO).getTime() - new Date(a.startISO).getTime()
  );
  return sortedByStartDesc[0] ?? null;
}

const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
  const insets = useSafeAreaInsets();

  const [ticketActive, setTicketActive] = useState<boolean>(false);
  const [secondsLeft, setSecondsLeft] = useState<number>(0);
  const [ticketLabel, setTicketLabel] = useState<string>("Brak");

  const [balance, setBalance] = useState<number>(0);
  const [lastTicket, setLastTicket] = useState<ParkingTicket | null>(null);

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const slideAnim = useRef(new Animated.Value(-DRAWER_WIDTH)).current;

  const openDrawer = () => {
    setIsDrawerOpen(true);
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 250,
      useNativeDriver: true,
    }).start();
  };

  const closeDrawer = () => {
    Animated.timing(slideAnim, {
      toValue: -DRAWER_WIDTH,
      duration: 250,
      useNativeDriver: true,
    }).start(({ finished }) => {
      if (finished) {
        setIsDrawerOpen(false);
      }
    });
  };

  const toggleDrawer = () => {
    if (isDrawerOpen) {
      closeDrawer();
    } else {
      openDrawer();
    }
  };

  // wczytanie salda i ostatniego biletu przy wejściu na ekran
  useFocusEffect(
    useCallback(() => {
      let isActive = true;

      const loadData = async () => {
        try {
          const storedBalance = await AsyncStorage.getItem(BALANCE_KEY);
          const storedTickets = await AsyncStorage.getItem(TICKETS_STORAGE_KEY);

          if (!isActive) return;

          if (storedBalance !== null) {
            setBalance(parseFloat(storedBalance));
          } else {
            setBalance(0);
          }

          if (storedTickets) {
            const parsed: ParkingTicket[] = JSON.parse(storedTickets);
            if (parsed.length > 0) {
              const ticketToShow = pickTicketToDisplay(parsed);
              setLastTicket(ticketToShow);
            } else {
              setLastTicket(null);
            }
          } else {
            setLastTicket(null);
          }
        } catch (e) {
          console.warn("Błąd wczytywania salda/biletu startowego:", e);
          setLastTicket(null);
        }
      };

      void loadData();

      return () => {
        isActive = false;
      };
    }, [])
  );

  // odliczanie czasu i status biletu
  useEffect(() => {
    if (!lastTicket) {
      setTicketActive(false);
      setTicketLabel("Brak");
      setSecondsLeft(0);
      return;
    }

    const updateStateFromTicket = () => {
      const now = new Date();
      const start = new Date(lastTicket.startISO);
      const end = new Date(lastTicket.endISO);

      if (now < start) {
        // ZAPLANOWANY – liczymy ile czasu zostało DO STARTU
        setTicketActive(false);
        setTicketLabel("Zaplanowany");
        const diffMs = start.getTime() - now.getTime();
        setSecondsLeft(Math.max(0, Math.floor(diffMs / 1000)));
      } else if (now >= start && now < end) {
        // AKTYWNY – jak wcześniej, czas do końca
        setTicketActive(true);
        setTicketLabel("Aktywny");
        const diffMs = end.getTime() - now.getTime();
        setSecondsLeft(Math.max(0, Math.floor(diffMs / 1000)));
      } else {
        // ZAKOŃCZONY
        setTicketActive(false);
        setTicketLabel("Zakończony");
        setSecondsLeft(0);
      }
    };

    updateStateFromTicket();
    const interval = setInterval(updateStateFromTicket, 1000);
    return () => clearInterval(interval);
  }, [lastTicket]);

  const formatTime = (totalSeconds: number) => {
    const h = Math.floor(totalSeconds / 3600);
    const m = Math.floor((totalSeconds % 3600) / 60);
    const s = totalSeconds % 60;
    const pad = (v: number) => String(v).padStart(2, "0");
    return `${pad(h)}:${pad(m)}:${pad(s)}`;
  };

  // przedłużenie biletu o 15 minut
  const handleExtend = async () => {
    if (!lastTicket) return;

    const EXTENSION_MINUTES = 15;

    try {
      const storedTickets = await AsyncStorage.getItem(TICKETS_STORAGE_KEY);
      const parsed: ParkingTicket[] = storedTickets
        ? JSON.parse(storedTickets)
        : [];

      const updated = parsed.map((t) => {
        if (t.id !== lastTicket.id) return t;

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

      await AsyncStorage.setItem(TICKETS_STORAGE_KEY, JSON.stringify(updated));

      const updatedTicket = updated.find((t) => t.id === lastTicket.id) || null;
      setLastTicket(updatedTicket);
    } catch (e) {
      console.warn("Nie udało się przedłużyć biletu:", e);
    }
  };

  const renderItem: ListRenderItem<HomeItem> = ({ item }) => {
    const isTicket = item.route === "Ticket";
    const isWallet = item.route === "Wallet";
    const isTransaction = item.route === "Transaction";
    const isCar = item.route === "Car";
    const isMap = item.route === "Map";
    const isUserProfile = item.route === "UserProfile";

    return (
      <TouchableOpacity
        style={[styles.tile, styles.StyleTile]}
        activeOpacity={0.85}
        onPress={() => navigation.navigate(item.route)}
      >
        {isTicket ? (
          <>
            <Icon name="ticket-outline" size={46} color={GREEN} />
            <Text style={[styles.tileDesc, styles.StyleText]}>Kup bilet</Text>
          </>
        ) : isWallet ? (
          <>
            <Icon name="wallet-outline" size={46} color={GREEN} />
            <Text style={[styles.tileDesc, styles.StyleText]}>Portfel</Text>
          </>
        ) : isTransaction ? (
          <>
            <Icon name="receipt-outline" size={46} color={GREEN} />
            <Text style={[styles.tileDesc, styles.StyleText]}>
              Historia transakcji
            </Text>
          </>
        ) : isCar ? (
          <>
            <Icon name="car-outline" size={46} color={GREEN} />
            <Text style={[styles.tileDesc, styles.StyleText]}>
              Dane pojazdów
            </Text>
          </>
        ) : isMap ? (
          <>
            <Icon name="map-outline" size={46} color={GREEN} />
            <Text style={[styles.tileDesc, styles.StyleText]}>Lokalizacja</Text>
          </>
        ) : isUserProfile ? (
          <>
            <Icon name="person-circle-outline" size={46} color={GREEN} />
            <Text style={[styles.tileDesc, styles.StyleText]}>Twój Profil</Text>
          </>
        ) : (
          <>
            <Text style={styles.StyleTitle}>{item.title}</Text>
            <Text style={styles.tileDesc}>Przejdź do {item.title}</Text>
          </>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.root}>
      <StatusBar
        barStyle="light-content"
        backgroundColor="#101010"
        translucent={false}
      />

      {/* BANER NA GÓRZE */}
      <View style={styles.banner}>
        {/* GÓRNY RZĄD: przycisk + saldo */}
        <View style={styles.bannerTopRow}>
          <TouchableOpacity
            style={styles.menuButton}
            activeOpacity={0.8}
            onPress={toggleDrawer}
          >
            <Icon name="information-circle-outline" size={22} color="#fff" />
          </TouchableOpacity>

          <View>
            <Text style={styles.bannerLabel}>Saldo</Text>
            <Text style={styles.bannerValue}>{balance.toFixed(2)} zł</Text>
          </View>
        </View>

        {/* DOLNY RZĄD: status biletu + licznik + przycisk przedłużenia */}
        <View style={styles.bannerBottomRow}>
          <View style={styles.bannerStatusRow}>
            <Text style={styles.bannerTicketStatus}>
              Bilet:{" "}
              <Text style={{ color: ticketActive ? GREEN : "#ff5252" }}>
                {ticketLabel}
              </Text>
            </Text>

            {secondsLeft > 0 && (ticketActive || ticketLabel === "Zaplanowany") && (
              <Text style={styles.bannerTime}>
                {ticketLabel === "Zaplanowany" ? "Do startu: " : "Do końca: "}
                {formatTime(secondsLeft)}
              </Text>
            )}
          </View>

          {ticketActive && (
            <TouchableOpacity
              style={styles.extendButton}
              onPress={handleExtend}
              activeOpacity={0.85}
            >
              <Text style={styles.extendButtonText}>Przedłuż</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>


      {/* LISTA KAFELKÓW */}
      <View style={styles.content}>
        <FlatList
          data={items}
          renderItem={renderItem}
          keyExtractor={(it) => it.key}
          numColumns={2}
          columnWrapperStyle={styles.row}
          contentContainerStyle={styles.listContent}
        />
      </View>

      {/* STOPKA NA DOLE */}
      <View
        style={[
          styles.footer,
          { paddingBottom: Math.max(12, insets.bottom), paddingTop: 10 },
        ]}
      >
        <View style={styles.footerItem}>
          <Icon name="home" size={26} color={GREEN} />
          <Text style={[styles.footerLabel, { color: GREEN }]}>Home</Text>
        </View>

        <TouchableOpacity
          style={styles.footerItem}
          activeOpacity={0.8}
          onPress={() => navigation.navigate("Settings")}
        >
          <Icon name="settings-outline" size={24} color="#aaa" />
          <Text style={styles.footerLabel}>Ustawienia</Text>
        </TouchableOpacity>
      </View>

      {/* BOCZNA NAWIGACJA ROZWIJANA */}
      {isDrawerOpen && (
        <View style={styles.drawerOverlay}>
          <TouchableOpacity
            style={StyleSheet.absoluteFill}
            activeOpacity={1}
            onPress={closeDrawer}
          />

          <Animated.View
            style={[
              styles.drawer,
              {
                transform: [{ translateX: slideAnim }],
                paddingTop: insets.top + 16,
                paddingBottom: Math.max(16, insets.bottom + 8),
              },
            ]}
          >
            <Text style={styles.drawerTitle}>Informacje</Text>
            <Text style={styles.drawerText}>
              Dodatkowe informacje o swoim koncie i aplikacji. Panel zamykasz
              klikając poza nim.
            </Text>
          </Animated.View>
        </View>
      )}
    </SafeAreaView>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "#101010",
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight ?? 0 : 0,
  },
  banner: {
    paddingHorizontal: 26,
    paddingVertical: 20,
    backgroundColor: "#1b1b1b",
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.08)",
  },
  bannerLeft: {
    flex: 1,
    justifyContent: "center",
  },
  bannerLeftRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  menuButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.25)",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 20,
    backgroundColor: "#242424",
  },
  bannerRight: {
    marginTop: 8,
    alignItems: "flex-end",
  },
  bannerLabel: {
    color: "#aaa",
    fontSize: 13,
    marginBottom: 4,
  },
  bannerValue: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "700",
  },

  bannerStatusRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  bannerTicketStatus: {
    color: "#fff",
    fontSize: 18,
  },
  bannerTime: {
    color: "#ddd",
    fontSize: 14,
    marginLeft: 12,
  },
  bannerTopRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
  },

  bannerBottomRow: {
    marginTop: 10,
    alignItems: "flex-end", // wyrównanie biletu do prawej
  },
  extendButton: {
    marginTop: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: GREEN,
  },
  extendButtonText: {
    color: GREEN,
    fontSize: 13,
    fontWeight: "600",
  },

  content: {
    flex: 1,
  },

  listContent: {
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 40,
  },
  row: {
    justifyContent: "space-between",
    marginBottom: 16,
  },

  tile: {
    width: "48%",
    aspectRatio: 1,
    backgroundColor: "#1b1b1b",
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
    elevation: 2,
    justifyContent: "center",
  },
  StyleTile: {
    alignItems: "center",
    justifyContent: "center",
  },
  StyleText: {
    marginTop: 8,
    textAlign: "center",
  },
  StyleTitle: {
    color: GREEN,
    fontSize: 18,
    fontWeight: "800",
    marginBottom: 6,
  },
  tileDesc: {
    color: "#ddd",
    fontSize: 15,
  },

  footer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    paddingHorizontal: 32,
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: "rgba(255,255,255,0.12)",
    backgroundColor: "#161616",
  },
  footerItem: {
    alignItems: "center",
    justifyContent: "center",
  },
  footerLabel: {
    marginTop: 2,
    fontSize: 11,
    color: "#aaa",
  },

  drawerOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.4)",
  },
  drawer: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    width: DRAWER_WIDTH,
    backgroundColor: "#1b1b1b",
    paddingHorizontal: 16,
    borderRightWidth: 1,
    borderRightColor: "rgba(255,255,255,0.12)",
  },
  drawerTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 12,
  },
  drawerText: {
    color: "#ddd",
    fontSize: 14,
    lineHeight: 20,
  },
});

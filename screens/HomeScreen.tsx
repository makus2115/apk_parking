import React, { useEffect, useRef, useState } from "react";
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

const GREEN = "#8BC34A";
const DRAWER_WIDTH = 260;

type TestItem = {
  key: string;
  title: string;
  route: string;
};

const items: TestItem[] = [
  { key: "3", title: "TicketScreen", route: "Ticket" },
  { key: "4", title: "Transaction", route: "Transaction" },
  { key: "5", title: "Wallet", route: "Wallet" },
  { key: "6", title: "Car", route: "Car" },
];

type TestScreenProps = {
  navigation: any;
};

const TestScreen: React.FC<TestScreenProps> = ({ navigation }) => {
  const insets = useSafeAreaInsets();

  const [ticketActive, setTicketActive] = useState<boolean>(true);
  const [secondsLeft, setSecondsLeft] = useState<number>(3600); // 1h

  // stan i animacja bocznej nawigacji
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

  useEffect(() => {
    if (!ticketActive) return;

    const interval = setInterval(() => {
      setSecondsLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(interval);
  }, [ticketActive]);

  useEffect(() => {
    if (secondsLeft === 0 && ticketActive) {
      setTicketActive(false);
    }
  }, [secondsLeft, ticketActive]);

  const formatTime = (totalSeconds: number) => {
    const h = Math.floor(totalSeconds / 3600);
    const m = Math.floor((totalSeconds % 3600) / 60);
    const s = totalSeconds % 60;
    const pad = (v: number) => String(v).padStart(2, "0");
    return `${pad(h)}:${pad(m)}:${pad(s)}`;
  };

  const handleExtend = () => {
    setTicketActive(true);
    setSecondsLeft(6);
  };

  const renderItem: ListRenderItem<TestItem> = ({ item }) => {
    const isTicket = item.route === "Ticket";
    const isWallet = item.route === "Wallet";
    const isTransaction = item.route === "Transaction";
    const isCar = item.route === "Car";

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
        <View style={styles.bannerLeft}>
          <View style={styles.bannerLeftRow}>
            {/* PRZYCISK OTWARCIA NAWIGACJI BOCZNEJ */}
            <TouchableOpacity
              style={styles.menuButton}
              activeOpacity={0.8}
              onPress={toggleDrawer}
            >
              <Icon name="information-circle-outline" size={22} color="#fff" />
            </TouchableOpacity>

            <View>
              <Text style={styles.bannerLabel}>Saldo</Text>
              <Text style={styles.bannerValue}>20 zł</Text>
            </View>
          </View>
        </View>

        <View style={styles.bannerRight}>
          <View style={styles.bannerStatusRow}>
            <Text style={styles.bannerTicketStatus}>
              Bilet:{" "}
              <Text style={{ color: ticketActive ? GREEN : "#ff5252" }}>
                {ticketActive ? "Aktywny" : "Brak"}
              </Text>
            </Text>

            {ticketActive && (
              <Text style={styles.bannerTime}>
                Czas: {formatTime(secondsLeft)}
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
          {/* tło reagujące na kliknięcie poza panelem */}
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
              Dodatkowe informacje o swoim koncie i 
              aplikacji. Panel zamykasz klikając poza nim.
            </Text>
          </Animated.View>
        </View>
      )}
    </SafeAreaView>
  );
};

export default TestScreen;

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "#101010",
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight ?? 0 : 0,
  },
  banner: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 26,
    paddingVertical: 24,
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
    flex: 2,
    justifyContent: "center",
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

  // BOCZNA NAWIGACJA
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

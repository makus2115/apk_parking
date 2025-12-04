import React, { useContext, useEffect, useMemo, useState } from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import MapView, { Marker, Region } from "react-native-maps";
import * as Location from "expo-location";
import { ScreenWrapper } from "../components";
import { ThemeColors, ThemeContext } from "../theme/ThemeContext";

type MapScreenProps = {
  navigation: any;
};

const MapScreen: React.FC<MapScreenProps> = () => {
  const { colors } = useContext(ThemeContext);
  const styles = useMemo(() => createStyles(colors), [colors]);
  const [region, setRegion] = useState<Region | null>(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    const initLocation = async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();

        if (status !== "granted") {
          setErrorMsg("Brak zgody na dostęp do lokalizacji.");
          setLoading(false);
          return;
        }

        const pos = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.High,
        });

        const { latitude, longitude } = pos.coords;

        const initialRegion: Region = {
          latitude,
          longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        };

        setRegion(initialRegion);
        setLoading(false);
      } catch (e) {
        console.warn(e);
        setErrorMsg("Nie udało się pobrać lokalizacji.");
        setLoading(false);
      }
    };

    void initLocation();
  }, []);

  return (
    <ScreenWrapper>
      <View style={styles.root}>
        {loading && (
          <View style={styles.centerOverlay}>
            <ActivityIndicator size="large" color={colors.primary} />
            <Text style={styles.infoText}>Pobieranie lokalizacji...</Text>
          </View>
        )}

        {!loading && errorMsg && (
          <View style={styles.centerOverlay}>
            <Text style={styles.errorText}>{errorMsg}</Text>
          </View>
        )}

        {!loading && !errorMsg && region && (
          <MapView
            style={StyleSheet.absoluteFill}
            initialRegion={region}
            showsUserLocation
            showsMyLocationButton
          >
            <Marker coordinate={region} title="Twoja pozycja" />
          </MapView>
        )}
      </View>
    </ScreenWrapper>
  );
};

export default MapScreen;

const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    root: {
      flex: 1,
      backgroundColor: colors.background,
    },
    centerOverlay: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
      paddingHorizontal: 24,
      backgroundColor: colors.background,
    },
    infoText: {
      marginTop: 12,
      color: colors.subtitle,
      fontSize: 14,
      textAlign: "center",
    },
    errorText: {
      marginTop: 12,
      color: "#ff5252",
      fontSize: 14,
      textAlign: "center",
    },
  });

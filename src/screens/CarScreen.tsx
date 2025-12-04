import React, { useContext, useMemo, useState } from "react";
import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { ScreenWrapper } from "../components";
import { ThemeColors, ThemeContext } from "../theme/ThemeContext";

type Car = {
  id: string;
  plate: string;
  image?: any;
};

const initialCars: Car[] = [
  {
    id: "1",
    plate: "WX 12345",
    image: require("../../assets/cars/car1.png"),
  },
  {
    id: "2",
    plate: "PO 9ABC1",
    image: require("../../assets/cars/car2.png"),
  },
  {
    id: "3",
    plate: "KR 7J202",
    image: require("../../assets/cars/car3.png"),
  },
];

type CarsScreenProps = {
  navigation: any;
};

const CarsScreen: React.FC<CarsScreenProps> = () => {
  const [cars, setCars] = useState<Car[]>(initialCars);
  const [selectedId, setSelectedId] = useState<string>(initialCars[0]?.id ?? "");
  const [isAdding, setIsAdding] = useState(false);
  const [newPlate, setNewPlate] = useState("");
  const { colors, isDark } = useContext(ThemeContext);
  const styles = useMemo(() => createStyles(colors, isDark), [colors, isDark]);

  const selectedCar = cars.find((c) => c.id === selectedId);

  const handleAddPlate = () => {
    const plate = newPlate.trim();
    if (!plate) return;

    const newCar: Car = {
      id: Date.now().toString(),
      plate,
    };

    setCars((prev) => [...prev, newCar]);
    setSelectedId(newCar.id);
    setNewPlate("");
    setIsAdding(false);
  };

  const handleEdit = () => {};

  return (
    <ScreenWrapper>
      <View style={styles.root}>
        <View style={styles.banner}>
          <Text style={styles.bannerTitle}>Twoje samochody</Text>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.platesScrollContent}
          >
            {cars.map((car) => {
              const isActive = car.id === selectedId;
              return (
                <Pressable
                  key={car.id}
                  style={({ pressed }) => [
                    styles.plateButton,
                    isActive && styles.plateButtonActive,
                    pressed && styles.pressed,
                  ]}
                  onPress={() => setSelectedId(car.id)}
                >
                  <Text
                    style={[styles.plateText, isActive && styles.plateTextActive]}
                  >
                    {car.plate}
                  </Text>
                </Pressable>
              );
            })}

            <Pressable
              style={({ pressed }) => [
                styles.addPlateButton,
                pressed && styles.pressed,
              ]}
              onPress={() => setIsAdding((prev) => !prev)}
            >
              <Text style={styles.addPlateText}>+</Text>
            </Pressable>
          </ScrollView>

          {isAdding && (
            <View style={styles.addPlateForm}>
              <TextInput
                style={styles.addPlateInput}
                value={newPlate}
                onChangeText={setNewPlate}
                placeholder="Nowy numer rejestracyjny"
                placeholderTextColor={colors.subtitle}
                autoCapitalize="characters"
              />
              <Pressable
                style={({ pressed }) => [
                  styles.addPlateConfirm,
                  pressed && styles.pressed,
                ]}
                onPress={handleAddPlate}
              >
                <Text style={styles.addPlateConfirmText}>Dodaj</Text>
              </Pressable>
            </View>
          )}
        </View>

        <View style={styles.content}>
          {selectedCar ? (
            <>
              <View style={styles.carImageWrapper}>
                <View style={styles.carImageFrame}>
                  {selectedCar.image ? (
                    <Image
                      source={selectedCar.image}
                      style={styles.carImage}
                      resizeMode="cover"
                    />
                  ) : (
                    <Pressable
                      style={({ pressed }) => [
                        styles.addPhotoButton,
                        pressed && styles.pressed,
                      ]}
                      onPress={() => {}}
                    >
                      <Text style={styles.addPhotoText}>Dodaj zdjęcie</Text>
                    </Pressable>
                  )}
                </View>
              </View>

              <View style={styles.editWrapper}>
                <Pressable
                  style={({ pressed }) => [
                    styles.editButton,
                    pressed && styles.pressed,
                  ]}
                  onPress={handleEdit}
                >
                  <Text style={styles.editButtonText}>Edytuj</Text>
                </Pressable>
              </View>
            </>
          ) : (
            <Text style={styles.noCarText}>
              Wybierz samochód z listy tablic rejestracyjnych powyżej.
            </Text>
          )}
        </View>
      </View>
    </ScreenWrapper>
  );
};

export default CarsScreen;

const createStyles = (colors: ThemeColors, isDark: boolean) =>
  StyleSheet.create({
    root: {
      flex: 1,
      backgroundColor: colors.background,
    },

    banner: {
      backgroundColor: colors.card,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
      paddingHorizontal: 16,
      paddingTop: 12,
      paddingBottom: 10,
    },
    bannerTitle: {
      color: colors.text,
      fontSize: 18,
      fontWeight: "700",
      marginBottom: 8,
      marginTop: 8,
    },
    platesScrollContent: {
      paddingVertical: 4,
      paddingRight: 4,
      alignItems: "center",
    },
    plateButton: {
      paddingHorizontal: 16,
      paddingVertical: 10,
      borderRadius: 18,
      borderWidth: 1,
      borderColor: colors.border,
      marginRight: 8,
      backgroundColor: isDark ? "#252525" : "#f2f2f2",
    },
    plateButtonActive: {
      backgroundColor: colors.primary,
      borderColor: colors.primary,
    },
    plateText: {
      color: colors.subtitle,
      fontSize: 16,
      fontWeight: "600",
    },
    plateTextActive: {
      color: colors.background,
    },

    addPlateButton: {
      width: 40,
      height: 40,
      borderRadius: 20,
      marginLeft: 4,
      marginRight: 4,
      borderWidth: 2,
      borderColor: colors.primary,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: isDark ? "#252525" : "#f2f2f2",
    },
    addPlateText: {
      color: colors.primary,
      fontSize: 24,
      fontWeight: "700",
      lineHeight: 26,
    },

    addPlateForm: {
      flexDirection: "row",
      alignItems: "center",
      marginTop: 12,
    },
    addPlateInput: {
      flex: 1,
      height: 40,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: colors.border,
      paddingHorizontal: 10,
      color: colors.text,
      backgroundColor: isDark ? "#202020" : "#f7f7f7",
      marginRight: 8,
    },
    addPlateConfirm: {
      paddingHorizontal: 14,
      paddingVertical: 8,
      borderRadius: 8,
      backgroundColor: colors.primary,
    },
    addPlateConfirmText: {
      color: "#101010",
      fontWeight: "700",
      fontSize: 14,
    },

    content: {
      flex: 1,
      padding: 20,
    },

    carImageWrapper: {
      alignItems: "center",
    },

    carImageFrame: {
      width: "100%",
      aspectRatio: 1,
      borderRadius: 16,
      borderWidth: 3,
      borderColor: colors.primary,
      overflow: "hidden",
      backgroundColor: colors.background,
      alignItems: "center",
      justifyContent: "center",
    },
    carImage: {
      width: "100%",
      height: "100%",
    },

    addPhotoButton: {
      paddingHorizontal: 16,
      paddingVertical: 10,
      borderRadius: 20,
      borderWidth: 1,
      borderColor: colors.primary,
    },
    addPhotoText: {
      color: colors.primary,
      fontSize: 16,
      fontWeight: "600",
    },

    editWrapper: {
      marginTop: 16,
      alignItems: "center",
    },
    editButton: {
      paddingHorizontal: 20,
      paddingVertical: 10,
      borderRadius: 20,
      borderWidth: 1,
      borderColor: colors.primary,
      backgroundColor: isDark ? "#252525" : "#f2f2f2",
    },
    editButtonText: {
      color: colors.primary,
      fontSize: 15,
      fontWeight: "600",
    },

    noCarText: {
      color: colors.subtitle,
      fontSize: 14,
      marginTop: 24,
    },
    pressed: {
      opacity: 0.85,
    },
  });

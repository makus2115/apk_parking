import React, { useState } from "react";
import {
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  StatusBar,
  Platform,
  ScrollView,
  Image,
  TextInput,
} from "react-native";

const GREEN = "#8BC34A";

type Car = {
  id: string;
  plate: string;
  image?: any;
};

const initialCars: Car[] = [
  {
    id: "1",
    plate: "WX 12345",
    image: require("../assets/cars/car1.png"),
  },
  {
    id: "2",
    plate: "PO 9ABC1",
    image: require("../assets/cars/car2.png"),
  },
  {
    id: "3",
    plate: "KR 7J202",
    image: require("../assets/cars/car3.png"),
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

  const selectedCar = cars.find((c) => c.id === selectedId);

  const handleAddPlate = () => {
    const plate = newPlate.trim();
    if (!plate) return;

    const newCar: Car = {
      id: Date.now().toString(),
      plate,
      // brak image -> pokaże się przycisk "Dodaj zdjęcie"
    };

    setCars((prev) => [...prev, newCar]);
    setSelectedId(newCar.id);
    setNewPlate("");
    setIsAdding(false);
  };

  const handleEdit = () => {
    // tutaj w przyszłości edycja numeru / zdjęcia
  };

  return (
    <SafeAreaView style={styles.root}>
      <StatusBar
        barStyle="light-content"
        backgroundColor="#101010"
        translucent={false}
      />

      {/* BANER Z TABLICAMI */}
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
              <TouchableOpacity
                key={car.id}
                style={[
                  styles.plateButton,
                  isActive && styles.plateButtonActive,
                ]}
                onPress={() => setSelectedId(car.id)}
                activeOpacity={0.8}
              >
                <Text
                  style={[
                    styles.plateText,
                    isActive && styles.plateTextActive,
                  ]}
                >
                  {car.plate}
                </Text>
              </TouchableOpacity>
            );
          })}

          {/* OKRĄGŁY PRZYCISK DODANIA NOWEJ TABLICY */}
          <TouchableOpacity
            style={styles.addPlateButton}
            activeOpacity={0.8}
            onPress={() => setIsAdding((prev) => !prev)}
          >
            <Text style={styles.addPlateText}>+</Text>
          </TouchableOpacity>
        </ScrollView>

        {/* FORMULARZ DODANIA NOWEJ TABLICY */}
        {isAdding && (
          <View style={styles.addPlateForm}>
            <TextInput
              style={styles.addPlateInput}
              value={newPlate}
              onChangeText={setNewPlate}
              placeholder="Nowy numer rejestracyjny"
              placeholderTextColor="#888"
              autoCapitalize="characters"
            />
            <TouchableOpacity
              style={styles.addPlateConfirm}
              activeOpacity={0.85}
              onPress={handleAddPlate}
            >
              <Text style={styles.addPlateConfirmText}>Dodaj</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      {/* ZDJĘCIE W RAMCE / PRZYCISK DODAJ ZDJĘCIE */}
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
                  <TouchableOpacity
                    style={styles.addPhotoButton}
                    activeOpacity={0.85}
                    onPress={() => {
                      // tu w przyszłości logika wyboru zdjęcia
                    }}
                  >
                    <Text style={styles.addPhotoText}>Dodaj zdjęcie</Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>

            {/* PRZYCISK EDYTUJ POD ZDJĘCIEM */}
            <View style={styles.editWrapper}>
              <TouchableOpacity
                style={styles.editButton}
                activeOpacity={0.85}
                onPress={handleEdit}
              >
                <Text style={styles.editButtonText}>Edytuj</Text>
              </TouchableOpacity>
            </View>
          </>
        ) : (
          <Text style={styles.noCarText}>
            Wybierz samochód z listy tablic rejestracyjnych powyżej.
          </Text>
        )}
      </View>
    </SafeAreaView>
  );
};

export default CarsScreen;

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "#101010",
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight ?? 0 : 0,
  },

  /* BANER */
  banner: {
    backgroundColor: "#1b1b1b",
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.08)",
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 10,
  },
  bannerTitle: {
    color: "#fff",
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
    borderColor: "rgba(255,255,255,0.2)",
    marginRight: 8,
    backgroundColor: "#252525",
  },
  plateButtonActive: {
    backgroundColor: GREEN,
    borderColor: GREEN,
  },
  plateText: {
    color: "#ccc",
    fontSize: 16,
    fontWeight: "600",
  },
  plateTextActive: {
    color: "#101010",
  },

  // Okrągły przycisk z +
  addPlateButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginLeft: 4,
    marginRight: 4,
    borderWidth: 2,
    borderColor: GREEN,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#252525",
  },
  addPlateText: {
    color: GREEN,
    fontSize: 24,
    fontWeight: "700",
    lineHeight: 26,
  },

  // Formularz dodawania nowej tablicy
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
    borderColor: "rgba(255,255,255,0.2)",
    paddingHorizontal: 10,
    color: "#fff",
    backgroundColor: "#202020",
    marginRight: 8,
  },
  addPlateConfirm: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: GREEN,
  },
  addPlateConfirmText: {
    color: "#101010",
    fontWeight: "700",
    fontSize: 14,
  },

  /* TREŚĆ */
  content: {
    flex: 1,
    padding: 20,
  },

  carImageWrapper: {
    alignItems: "center",
  },

  // KWADRATOWA RAMKA
  carImageFrame: {
    width: "100%",
    aspectRatio: 1,
    borderRadius: 16,
    borderWidth: 3,
    borderColor: GREEN,
    overflow: "hidden",
    backgroundColor: "#000",
    alignItems: "center",
    justifyContent: "center",
  },
  carImage: {
    width: "100%",
    height: "100%",
  },

  // przycisk "Dodaj zdjęcie" wewnątrz ramki
  addPhotoButton: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: GREEN,
  },
  addPhotoText: {
    color: GREEN,
    fontSize: 16,
    fontWeight: "600",
  },

  // wrapper i styl przycisku "Edytuj"
  editWrapper: {
    marginTop: 16,
    alignItems: "center",
  },
  editButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: GREEN,
    backgroundColor: "#252525",
  },
  editButtonText: {
    color: GREEN,
    fontSize: 15,
    fontWeight: "600",
  },

  noCarText: {
    color: "#ccc",
    fontSize: 14,
    marginTop: 24,
  },
});

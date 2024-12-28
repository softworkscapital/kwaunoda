import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  TextInput,
  Alert,
  Text,
  Modal,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { WebView } from "react-native-webview"; 
import Geocoder from "react-native-geocoding";
import { useNavigation } from "@react-navigation/native";

// Replace with your actual API key from an environment variable
const API_KEY = "AIzaSyA4ZQWDwYRHmhu66Cb1F8DgXbJJrArHYyE";
Geocoder.init(API_KEY);

const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

const MapViewComponent = () => {
  const navigation = useNavigation();
  const [startingLocation, setStartingLocation] = useState("");
  const [destinationLocation, setDestinationLocation] = useState("");
  const [startCoords, setStartCoords] = useState(null);
  const [destCoords, setDestCoords] = useState(null);
  const [modalVisibleStart, setModalVisibleStart] = useState(false);
  const [modalVisibleDest, setModalVisibleDest] = useState(false);
  const [modalLocation, setModalLocation] = useState("");
  const [locationSuggestions, setLocationSuggestions] = useState([]);
  const [distance, setDistance] = useState("");
  const [duration, setDuration] = useState("");
  const [loading, setLoading] = useState(false);

  const debouncedLocation = useDebounce(modalLocation, 300);

  useEffect(() => {
    if (debouncedLocation.length >= 3) {
      fetchLocationSuggestions(debouncedLocation);
    } else {
      setLocationSuggestions([]);
    }
  }, [debouncedLocation]);

  const fetchCoordinates = async (address) => {
    setLoading(true);
    const url = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodeURIComponent(address)}&key=${API_KEY}`;

    try {
      const response = await fetch(url);
      const data = await response.json();

      if (data.status === "OK" && data.results.length > 0) {
        const { lat, lng } = data.results[0].geometry.location;
        return { latitude: lat, longitude: lng };
      } else {
        throw new Error("No results found.");
      }
    } catch (error) {
      console.error("Error fetching coordinates:", error);
      Alert.alert("Error", error.message || "Unable to fetch coordinates.");
    } finally {
      setLoading(false);
    }
  };

  const handleGetDirections = async () => {
    const startCoords = await fetchCoordinates(startingLocation);
    const destCoords = await fetchCoordinates(destinationLocation);

    if (startCoords && destCoords) {
      setStartCoords(startCoords);
      setDestCoords(destCoords);
      fetchTripDetails(startCoords, destCoords);
    }
  };

  const fetchTripDetails = async (startCoords, destCoords) => {
    setLoading(true);
    const url = `https://maps.googleapis.com/maps/api/directions/json?origin=${startCoords.latitude},${startCoords.longitude}&destination=${destCoords.latitude},${destCoords.longitude}&key=${API_KEY}`;

    try {
      const response = await fetch(url);
      const data = await response.json();

      if (data.routes.length > 0) {
        const leg = data.routes[0].legs[0];
        setDistance(leg.distance.text);
        setDuration(leg.duration.text);
        await saveDeliveryToAsyncStorage(startingLocation, destinationLocation, leg.distance.text, leg.duration.text);
      } else {
        Alert.alert("Error", "No route found.");
      }
    } catch (error) {
      console.error("Error fetching trip details:", error);
      Alert.alert("Error", "Unable to fetch trip details.");
    } finally {
      setLoading(false);
    }
  };



  const saveDeliveryToAsyncStorage = async (startCoords, start, destination, destCoords, distance, duration) => {
    const deliveryData = {
      origin: startCoords,
      startingLocation: start,
      destinationLocation: destination,
      dest: destCoords,
      distance,
      duration,
    };
    
    console.log("Derivery", deliveryData);

    try {
      const existingDeliveries = await AsyncStorage.getItem("deliveries");
      const deliveries = existingDeliveries ? JSON.parse(existingDeliveries) : [];
      deliveries.push(deliveryData);
      await AsyncStorage.setItem("deliveries", JSON.stringify(deliveries));
      navigation.navigate("CustomerNewDelivery");
    } catch (error) {
      console.error("Error saving delivery:", error);
      Alert.alert("Error", "Unable to save delivery.");
    }
  };

  const fetchLocationSuggestions = async (query) => {
    const url = `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${encodeURIComponent(query)}&key=${API_KEY}`;

    try {
      const response = await fetch(url);
      const data = await response.json();

      if (data.status === "OK") {
        setLocationSuggestions(data.predictions);
      }
    } catch (error) {
      console.error("Error fetching suggestions:", error);
    }
  };

  const selectLocation = async (place, isStarting) => {
    const { description } = place;
    if (isStarting) {
      setStartingLocation(description);
      const coords = await fetchCoordinates(description);
      setStartCoords(coords);
      setModalVisibleStart(false);
    } else {
      setDestinationLocation(description);
      const coords = await fetchCoordinates(description);
      setDestCoords(coords);
      setModalVisibleDest(false);
    }
    setLocationSuggestions([]);
  };

  const webViewUrl = startCoords && destCoords 
    ? `http://192.168.94.223:3000/map?lat1=${startCoords.latitude}&lng1=${startCoords.longitude}&lat2=${destCoords.latitude}&lng2=${destCoords.longitude}`
    : null;

  return (
    <View style={styles.container}>
      {loading && <ActivityIndicator size="large" color="#0000ff" />}
      {webViewUrl && <WebView source={{ uri: webViewUrl }} style={styles.webview} />}
      
      <View style={styles.inputContainer}>
        <TouchableOpacity onPress={() => setModalVisibleStart(true)}>
          <TextInput
            style={styles.input}
            placeholder="Enter Starting Location"
            value={startingLocation}
            editable={false}
            accessibilityLabel="Starting Location"
          />
        </TouchableOpacity>

        <TouchableOpacity onPress={() => setModalVisibleDest(true)}>
          <TextInput
            style={styles.input}
            placeholder="Enter Destination Location"
            value={destinationLocation}
            editable={false}
            accessibilityLabel="Destination Location"
          />
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={handleGetDirections}>
          <Text style={styles.buttonText}>Get Directions</Text>
        </TouchableOpacity>
      </View>

      {/* Modal for Starting Location */}
      <Modal visible={modalVisibleStart} transparent={true} animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Select Starting Location</Text>
          </View>
          <TextInput
            style={styles.modalInput}
            placeholder="Search Location"
            value={modalLocation}
            onChangeText={setModalLocation}
            accessibilityLabel="Search Starting Location"
          />
          <FlatList
            data={locationSuggestions}
            keyExtractor={(item) => item.place_id}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.suggestionItem}
                onPress={() => selectLocation(item, true)}
                accessibilityLabel={`Select ${item.description}`}
              >
                <Text>{item.description}</Text>
              </TouchableOpacity>
            )}
          />
        </View>
      </Modal>

      {/* Modal for Destination Location */}
      <Modal visible={modalVisibleDest} transparent={true} animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Select Destination Location</Text>
          </View>
          <TextInput
            style={styles.modalInput}
            placeholder="Search Location"
            value={modalLocation}
            onChangeText={setModalLocation}
            accessibilityLabel="Search Destination Location"
          />
          <FlatList
            data={locationSuggestions}
            keyExtractor={(item) => item.place_id}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.suggestionItem}
                onPress={() => selectLocation(item, false)}
                accessibilityLabel={`Select ${item.description}`}
              >
                <Text>{item.description}</Text>
              </TouchableOpacity>
            )}
          />
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  webview: {
    flex: 1,
  },
  inputContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "white",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  input: {
    height: 50,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 12,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.8)",
    padding: 20,
    justifyContent: "center",
  },
  modalHeader: {
    backgroundColor: "#FFC000",
    padding: 10,
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "black",
  },
  modalInput: {
    height: 50,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 12,
    marginTop: 20,
    paddingHorizontal: 10,
    borderRadius: 5,
    backgroundColor: "white",
  },
  suggestionItem: {
    padding: 10,
    backgroundColor: "white",
    borderBottomColor: "gray",
    borderBottomWidth: 1,
  },
  button: {
    backgroundColor: "#FFC000",
    padding: 15,
    borderRadius: 5,
    alignItems: "center",
    marginBottom: 10,
  },
  buttonText: {
    color: "black",
    fontWeight: "bold",
    fontSize: 16,
  },
});

export default MapViewComponent;
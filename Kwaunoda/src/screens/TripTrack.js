import React, { useState } from "react";
import {
  StyleSheet,
  View,
  TextInput,
  Alert,
  Text,
  Modal,
  FlatList,
  TouchableOpacity,
} from "react-native";
import Geocoder from "react-native-geocoding";
import { useNavigation } from "@react-navigation/native";
import { WebView } from "react-native-webview";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";

Geocoder.init("AIzaSyA4ZQWDwYRHmhu66Cb1F8DgXbJJrArHYyE"); // Replace with your Google Maps API key

const TripTrack = () => {
  const navigation = useNavigation();
  const url = "https://kwaunoda.softworkscapital.com"; // Your website URL

  // Location states
  const [startingLocation, setStartingLocation] = useState("");
  const [destinationLocation, setDestinationLocation] = useState("");
  const [modalVisibleStart, setModalVisibleStart] = useState(false);
  const [modalVisibleDest, setModalVisibleDest] = useState(false);
  const [modalLocation, setModalLocation] = useState("");
  const [locationSuggestions, setLocationSuggestions] = useState([]);

  const redirectHome = () => {
    navigation.navigate("Home"); // Change this to your desired screen
  };

  const fetchCoordinates = async (address) => {
    const apiKey = "AIzaSyA4ZQWDwYRHmhu66Cb1F8DgXbJJrArHYyE";
    const url = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodeURIComponent(address)}&key=${apiKey}`;

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
    }
  };

  const handleLocationInput = (location) => {
    setModalLocation(location);
    fetchLocationSuggestions(location);
  };

  const fetchLocationSuggestions = async (query) => {
    if (query.length < 3) {
      setLocationSuggestions([]);
      return;
    }

    const apiKey = "AIzaSyA4ZQWDwYRHmhu66Cb1F8DgXbJJrArHYyE";
    const url = `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${encodeURIComponent(query)}&key=${apiKey}`;

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
      setModalVisibleStart(false); // Close the starting location modal
    } else {
      setDestinationLocation(description);
      setModalVisibleDest(false); // Close the destination location modal
    }
    setLocationSuggestions([]);
  };

  return (
    <View style={styles.container}>
      <View style={[styles.topBar, styles.goldenYellow]}>
        <TouchableOpacity style={styles.backArrow} onPress={redirectHome}>
          <MaterialIcons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
      </View>

      <WebView
        source={{ uri: url }}
        style={styles.webView} // Make WebView occupy less space
        onHttpError={(syntheticEvent) => {
          const { nativeEvent } = syntheticEvent;
          console.log("HTTP Error:", nativeEvent);
          alert("Unable to load the page.");
        }}
        onMessage={(event) => {
          const data = event.nativeEvent.data;
          console.log("Message from WebView:", data);
          // Handle messages from WebView here if needed
        }}
      />

      <View style={styles.inputContainer}>
        <TouchableOpacity onPress={() => setModalVisibleStart(true)}>
          <TextInput
            style={styles.input}
            placeholder="Enter Starting Location"
            value={startingLocation}
            editable={false}
          />
        </TouchableOpacity>

        <TouchableOpacity onPress={() => setModalVisibleDest(true)}>
          <TextInput
            style={styles.input}
            placeholder="Enter Destination Location"
            value={destinationLocation}
            editable={false}
          />
        </TouchableOpacity>

        <TouchableOpacity style={styles.button}>
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
            onChangeText={handleLocationInput}
          />
          <FlatList
            data={locationSuggestions}
            keyExtractor={(item) => item.place_id}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.suggestionItem}
                onPress={() => selectLocation(item, true)}
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
            onChangeText={handleLocationInput}
          />
          <FlatList
            data={locationSuggestions}
            keyExtractor={(item) => item.place_id}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.suggestionItem}
                onPress={() => selectLocation(item, false)}
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
  webView: {
    flex: 1,
    marginBottom: 150, // Adjust margin to prevent overlap with input container
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
    backgroundColor: "rgba(0, 0, 0, 0.8)", // Transparent black background
    padding: 20,
    justifyContent: "center",
  },
  modalHeader: {
    backgroundColor: "green",
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
    backgroundColor: "green",
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
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "green",
  },
  backArrow: {
    padding: 16,
  },
  goldenYellow: {
    backgroundColor: "green", // Adjust the color as needed
  },
});

export default TripTrack;
import React, { useState, useEffect, useRef } from "react";
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
import AsyncStorage from "@react-native-async-storage/async-storage"; // Import AsyncStorage
import MapView, { Marker, Polyline } from "react-native-maps";
import Geocoder from "react-native-geocoding";
import { useNavigation } from "@react-navigation/native";

Geocoder.init("AIzaSyA4ZQWDwYRHmhu66Cb1F8DgXbJJrArHYyE"); // Replace with your Google Maps API key

const MapViewComponent = () => {
  const navigation = useNavigation(); // Initialize useNavigation
  const [startingLocation, setStartingLocation] = useState("");
  const [destinationLocation, setDestinationLocation] = useState("");
  const [startCoords, setStartCoords] = useState(null);
  const [destCoords, setDestCoords] = useState(null);
  const [route, setRoute] = useState([]);
  const [distance, setDistance] = useState("");
  const [duration, setDuration] = useState("");
  const mapRef = useRef(null);

  const [modalVisibleStart, setModalVisibleStart] = useState(false);
  const [modalVisibleDest, setModalVisibleDest] = useState(false);
  const [modalLocation, setModalLocation] = useState("");
  const [locationSuggestions, setLocationSuggestions] = useState([]);

  const fetchCoordinates = async (address) => {
    const apiKey = "AIzaSyA4ZQWDwYRHmhu66Cb1F8DgXbJJrArHYyE";
    const url = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodeURIComponent(
      address
    )}&key=${apiKey}`;

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

  const saveDeliveryToAsyncStorage = async () => {
    const deliveryData = {
      startingLocation,
      destinationLocation,
      distance,
      duration,
      startCoords,
      destCoords,
    };

    try {
      const existingDeliveries = await AsyncStorage.getItem("deliveries");
      const deliveries = existingDeliveries
        ? JSON.parse(existingDeliveries)
        : [];
      deliveries.push(deliveryData);
      await AsyncStorage.setItem("deliveries", JSON.stringify(deliveries));
      Alert.alert("Success", "Delivery saved!");
    } catch (error) {
      console.error("Error saving delivery:", error);
      Alert.alert("Error", "Unable to save delivery.");
    }
  };

  const handleGetDirections = async () => {
    let startCoords = await fetchCoordinates(startingLocation);
    let destCoords = await fetchCoordinates(destinationLocation);

    if (startCoords) {
      setStartCoords(startCoords);
    }
    if (destCoords) {
      setDestCoords(destCoords);
    }
  };

  useEffect(() => {
    if (startCoords && destCoords) {
      const getRoute = async () => {
        const response = await fetch(
          `https://maps.googleapis.com/maps/api/directions/json?origin=${startCoords.latitude},${startCoords.longitude}&destination=${destCoords.latitude},${destCoords.longitude}&key=AIzaSyA4ZQWDwYRHmhu66Cb1F8DgXbJJrArHYyE`
        );
        const data = await response.json();

        if (data.routes.length > 0) {
          const points = decodePolyline(
            data.routes[0].overview_polyline.points
          );
          setRoute(points);

          const leg = data.routes[0].legs[0];
          setDistance(leg.distance.text);
          setDuration(leg.duration.text);

          mapRef.current.fitToCoordinates([startCoords, destCoords], {
            edgePadding: { top: 50, right: 50, bottom: 50, left: 50 },
            animated: true,
          });
        } else {
          Alert.alert("Error", "No route found.");
        }
      };
      getRoute();
    }
  }, [startCoords, destCoords]);

  const decodePolyline = (t) => {
    let points = [];
    let index = 0,
      len = t.length;
    let lat = 0,
      lng = 0;

    while (index < len) {
      let b,
        shift = 0,
        result = 0;
      do {
        b = t.charCodeAt(index++) - 63;
        result |= (b & 0x1f) << shift;
        shift += 5;
      } while (b >= 0x20);
      let dlat = (result >> 1) ^ -(result & 1);
      lat += dlat;

      shift = 0;
      result = 0;
      do {
        b = t.charCodeAt(index++) - 63;
        result |= (b & 0x1f) << shift;
        shift += 5;
      } while (b >= 0x20);
      let dlng = (result >> 1) ^ -(result & 1);
      lng += dlng;

      points.push({
        latitude: lat / 1e5,
        longitude: lng / 1e5,
      });
    }
    return points;
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
    const url = `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${encodeURIComponent(
      query
    )}&key=${apiKey}`;

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
      setModalVisibleStart(false); // Close the starting location modal
    } else {
      setDestinationLocation(description);
      const coords = await fetchCoordinates(description);
      setDestCoords(coords);
      setModalVisibleDest(false); // Close the destination location modal
    }
    setLocationSuggestions([]);
  };

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        style={styles.map}
        provider={PROVIDER_GOOGLE} // Add this line
        initialRegion={{
          latitude: -17.8292,
          longitude: 31.0522,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        }}
      >
        {startCoords && (
          <Marker coordinate={startCoords} title="Starting Point" />
        )}
        {destCoords && <Marker coordinate={destCoords} title="Destination" />}
        {route.length > 0 && <Polyline coordinates={route} strokeWidth={4} />}
      </MapView>
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

        <View style={styles.infoContainer}>
          {distance && duration && (
            <>
              <Text style={styles.infoText}>Distance: {distance}</Text>
              <Text style={styles.infoText}>Duration: {duration}</Text>
            </>
          )}
        </View>

        <TouchableOpacity style={styles.button} onPress={handleGetDirections}>
          <Text style={styles.buttonText}>Continue</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.button}
          onPress={async () => {
            await saveDeliveryToAsyncStorage(); // Save delivery data to AsyncStorage
            navigation.navigate("NewDelivery"); // Navigate to NewDelivery page
          }}
        >
          <Text style={styles.buttonText}>Add Delivery</Text>
        </TouchableOpacity>
      </View>

      {/* Modal for Starting Location */}
      <Modal
        visible={modalVisibleStart}
        transparent={true}
        animationType="slide"
      >
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
      <Modal
        visible={modalVisibleDest}
        transparent={true}
        animationType="slide"
      >
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
  map: {
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
  infoContainer: {
    marginTop: 12,
    marginBottom: 12,
  },
  infoText: {
    fontSize: 16,
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
});

export default MapViewComponent;

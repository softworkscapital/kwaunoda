import React, { useEffect, useRef, useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  Alert,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import MapView, { Marker, Polyline } from "react-native-maps";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_URL } from "./config";
import TopView from "../components/TopView";

const InTransitTrip = ({ navigation }) => {
  const mapRef = useRef(null);

  const [route, setRoute] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pickUpLocation, setPickUpLocation] = useState(null);
  const [destinationLocation, setDestinationLocation] = useState(null);
  const [driverId, setDriverId] = useState(null);
  const [currentTrip, setCurrentTrip] = useState(null);
  const [tripId, setTripId] = useState(null);
  const [name, setName] = useState();
  const [type, setType] = useState();
  const [pic, setPic] = useState();

  const APILINK = API_URL;

  useEffect(() => {
    const fetchData = async () => {
      const storedIds = await AsyncStorage.getItem("theIds");
      const parsedIds = JSON.parse(storedIds);
      setDriverId(parsedIds.driver_id);
      setLoading(false);
    };
    fetchData();
  }, []);

  useEffect(() => {
    const fetchTripData = async (driverId) => {
      try {
        const response = await fetch(`${API_URL}/trip`);
        const trips = await response.json();
        const inTransitTrips = trips.filter(
          (trip) => trip.driver_id === driverId && trip.status === "InTransit"
        );

        if (inTransitTrips.length > 0) {
          const trip = inTransitTrips[0];
          setCurrentTrip(trip);
          setTripId(trip.trip_id);

          const startCoords = {
            latitude: parseFloat(trip.origin_location_lat),
            longitude: parseFloat(trip.origin_location_long),
          };
          const destCoords = {
            latitude: parseFloat(trip.destination_lat),
            longitude: parseFloat(trip.destination_long),
          };

          setPickUpLocation(startCoords);
          setDestinationLocation(destCoords);
          await getDirections(startCoords, destCoords);
        } else {
          Alert.alert("Error", "No in-transit trips found.");
        }
      } catch (error) {
        Alert.alert("Error", error.message || "Unable to fetch trip data.");
      } finally {
        setLoading(false);
      }
    };

    if (driverId) {
      fetchTripData(driverId);
    }
  }, [driverId]);

  const getDirections = async (origin, destination) => {
    // Fetch directions logic...
  };

  return (
    <View style={styles.container}>
      <TopView
        profileImage={pic}
        customerType={type}
        notificationCount={0}
        name={name}
      />

      <MapView
        ref={mapRef}
        style={styles.map}
        showsUserLocation={true}
        provider={MapView.PROVIDER_GOOGLE}
      >
        {pickUpLocation && (
          <Marker
            coordinate={pickUpLocation}
            title="Pick-Up Location"
            pinColor="red"
          />
        )}
        {destinationLocation && (
          <Marker
            coordinate={destinationLocation}
            title="Destination"
            pinColor="green"
          />
        )}
        {route.length > 0 && <Polyline coordinates={route} strokeWidth={4} />}
      </MapView>

      {loading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      )}

      {currentTrip && (
        <View style={styles.fixedCurrentTripContainer}>
          <View style={styles.tripCard}>
            <Text style={styles.statusText}>Status: {currentTrip.status}</Text>
            <Text style={styles.currentTripText}>
              Current Trip: {currentTrip.trip_id}
            </Text>
            <Text style={styles.tripDetailsText}>
              Driver ID: {currentTrip.driver_id}
            </Text>
            <Text style={styles.tripDetailsText}>
              Start Time: {currentTrip.request_start_datetime}
            </Text>
            <Text style={styles.tripDetailsText}>
              To: {currentTrip.origin_location}
            </Text>
            <Text style={styles.tripDetailsText}>
              From: {currentTrip.dest_location || "N/A"}
            </Text>

            <View style={styles.buttonContainer}>
             
              <TouchableOpacity
                style={styles.endTripButton}
                onPress={() => navigation.navigate("DriverEndTrip", { tripId })}
              >
                <Text style={styles.endTripText}>End Trip</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.chatButton}
                onPress={() => navigation.navigate("DriverChat")}
              >
                <Text style={styles.chatText}>Chat</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFCC00",
  },
  map: {
    flex: 1,
  },
  loadingContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.8)",
  },
  fixedCurrentTripContainer: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    height: 400,
    backgroundColor: "green",
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    elevation: 5,
    paddingBottom: 20,
  },
  tripCard: {
    marginVertical: 5,
    padding: 10,
    borderRadius: 5,
    backgroundColor: "rgba(255, 255, 255, 0.8)", // Transparent background for trip details
    width: "100%",
    maxHeight: 300,
    paddingBottom: 10,
    marginBottom: 10,
  },
  statusText: {
    fontWeight: "bold",
    fontSize: 16,
    color: "red",
    backgroundColor: "rgba(255, 255, 255, 0.5)", // Semi-transparent background for status
    padding: 10,
    borderRadius: 10,
    marginBottom: 10,
  },
  currentTripText: {
    fontWeight: "bold",
    fontSize: 16,
  },
  buttonContainer: {
    flexDirection: "row",
    marginTop: 10,
  },
  endTripButton: {
    backgroundColor: "#FFA500", // Orange color for End Trip
    borderRadius: 20,
    paddingVertical: 6, // Reduced size
    paddingHorizontal: 18, // Reduced size
    marginRight: 10, // Space between buttons
  },
  endTripText: {
    fontWeight: "bold",
    color: "#FFFFFF", // White text for contrast
    fontSize: 14, // Reduced font size
  },
  chatButton: {
    backgroundColor: "#007BFF", // Blue color for Chat
    borderRadius: 20,
    paddingVertical: 10, // Consistent padding
    paddingHorizontal: 20, // Reduced size
    elevation: 5, // Add shadow effect
  },
  chatText: {
    fontWeight: "bold",
    color: "#FFFFFF", // White text for contrast
    fontSize: 16,
  },
  tripDetailsText: {
    fontSize: 14,
    color: "#595959",
  },
});

export default InTransitTrip;
import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  Alert,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import { WebView } from "react-native-webview";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_URL } from "./config";
import TopView from "../components/TopView";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import LocationSender from "./LocationTracker";

const InTransitTrip = () => {
  const navigation = useNavigation();
  const [driverLocation, setDriverLocation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [pickUpLocation, setPickUpLocation] = useState(null);
  const [destinationLocation, setDestinationLocation] = useState(null);
  const [currentTrip, setCurrentTrip] = useState(null);
  const [tripId, setTripId] = useState(null);
  const [driverId, setDriverId] = useState(null);
  const APILINK = API_URL;
  const driver2 = 'driver';

  // Use focus effect to reset data when navigating to this screen
  useFocusEffect(
    React.useCallback(() => {
      const resetData = async () => {
        // Clear stored user details
        await AsyncStorage.removeItem("userDetails");

        // Reset state variables
        setLoading(true);
        setPickUpLocation(null);
        setDestinationLocation(null);
        setCurrentTrip(null);
        setTripId(null);
        setDriverId(null);

        // Fetch new data
        fetchData();
      };

      resetData();
    }, [])
  );

  const fetchData = async () => {
    const storedIds = await AsyncStorage.getItem("theIds");
    const parsedIds = JSON.parse(storedIds);
    if (parsedIds && parsedIds.driver_id) {
      setDriverId(parsedIds.driver_id);
      fetchTripData(parsedIds.driver_id);
    } else {
      Alert.alert("Error", "Driver ID not found in storage.");
      setLoading(false);
    }
  };

  const fetchTripData = async (driverId) => {
    try {
      const response = await fetch(`${API_URL}/trip`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

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

        if (!isNaN(startCoords.latitude) && !isNaN(startCoords.longitude)) {
          setPickUpLocation(startCoords);
        } else {
          Alert.alert("Error", "Invalid pick-up location coordinates.");
        }
        if (!isNaN(destCoords.latitude) && !isNaN(destCoords.longitude)) {
          setDestinationLocation(destCoords);
        } else {
          Alert.alert("Error", "Invalid destination coordinates.");
        }
      } else {
        navigation.navigate("CustomerLogin");
        Alert.alert("Error", "No in-transit trips found.");
      }
    } catch (error) {
      Alert.alert("Error", error.message || "Unable to fetch trip data.");
    } finally {
      setLoading(false);
    }
  };

  const fetchDriverLocation = async (driverId) => {
    try {
      const response = await fetch(`${APILINK}/driver/${driverId}`);
      const driverArray = await response.json();

      if (Array.isArray(driverArray) && driverArray.length > 0) {
        const driver = driverArray[0];
        if (driver.lat_cordinates !== undefined && driver.long_cordinates !== undefined) {
          setDriverLocation({
            latitude: driver.lat_cordinates,
            longitude: driver.long_cordinates,
          });
        }
      } else {
        console.error("No driver data found or unexpected format");
      }
    } catch (error) {
      console.error("Error fetching driver location:", error);
    }
  };

  // Fetch driver's location at regular intervals
  useEffect(() => {
    if (driverId) {
      fetchDriverLocation(driverId);
      const intervalId = setInterval(() => {
        fetchDriverLocation(driverId);
      }, 60000); // Update every minute

      return () => clearInterval(intervalId);
    }
  }, [driverId]);

  const webViewUrl =
    driverLocation && pickUpLocation && destinationLocation
      ? `https://kwaunoda.softworkscapital.com/mapWithDriver?latDriver=${driverLocation.latitude}&lngDriver=${driverLocation.longitude}&lat1=${pickUpLocation.latitude}&lng1=${pickUpLocation.longitude}&lat2=${destinationLocation.latitude}&lng2=${destinationLocation.longitude}`
      : null;

  return (
    <View style={styles.container}>
      <TopView id={driverId} />
      <LocationSender user Id={driverId} userType={driver2} interval={60000} />

      {loading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      )}

      {webViewUrl && (
        <WebView source={{ uri: webViewUrl }} style={styles.webview} />
      )}

      <View style={styles.infoContainer}>
        <Text style={styles.infoText}>Route</Text>

        <TouchableOpacity
          style={styles.chatButton}
          onPress={() => navigation.navigate("DriverChat")}
        >
          <Text style={styles.chatButtonText}>Chat</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.chatButton}
          onPress={() => navigation.navigate("DriverEndTrip", { tripId })}
        >
          <Text style={styles.chatButtonText}>End Trip</Text>
        </TouchableOpacity>

        {currentTrip && (
          <View style={styles.fixedCurrentTripContainer}>
            <View style={styles.tripCard}>
              <Text style={styles.statusText}>
                Status: {currentTrip.status}
              </Text>
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
                  onPress={() =>
                    navigation.navigate("DriverEndTrip", { tripId })
                  }
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
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFCC00",
  },
  webview: {
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
    height: 270,
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
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    width: "100%",
    maxHeight: 300,
    paddingBottom: 10,
    marginBottom: 10,
  },
  statusText: {
    fontWeight: "bold",
    fontSize: 16,
    color: "red",
    backgroundColor: "rgba(255, 255, 255, 0.5)",
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
    backgroundColor: "#FFA500",
    borderRadius: 20,
    paddingVertical: 6,
    paddingHorizontal: 18,
    marginRight: 10,
  },
  endTripText: {
    fontWeight: "bold",
    color: "#FFFFFF",
    fontSize: 14,
  },
  chatButton: {
    backgroundColor: "#007BFF",
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
    elevation: 5,
  },
  chatText: {
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  tripDetailsText: {
    fontSize: 14,
    color: "#595959",
  },
});

export default InTransitTrip;
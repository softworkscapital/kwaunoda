import React, { useEffect, useRef, useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  Alert,
  ActivityIndicator,
  TouchableOpacity,
  Animated,
} from "react-native";
import MapView, { Marker, Polyline } from "react-native-maps";
import NetInfo from "@react-native-community/netinfo";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_URL } from "./config";
import { FontAwesome5 } from "@expo/vector-icons";
import TopView from "../components/TopView";
import { useNavigation, useRoute } from "@react-navigation/native";

const InTransitTrip = ({ navigation }) => {
  const mapRef = useRef(null);

  const [route, setRoute] = useState([]);
  const [loading, setLoading] = useState(true);
  const [driverLocation, setDriverLocation] = useState(null);
  const [pickUpLocation, setPickUpLocation] = useState(null);
  const [destinationLocation, setDestinationLocation] = useState(null);
  const [notificationCount, setNotificationCount] = useState(0);
  const [driverId, setDriverId] = useState(null);
  const [currentTrip, setCurrentTrip] = useState(null);
  const [tripId, setTripId] = useState(null);
  const [name, setName] = useState();
  const [type, setType] = useState();
  const [pic, setPic] = useState();

  const APILINK = API_URL;

  useEffect(() => {
    // const fetchDriverId = async () => {
    //   const storedDriverId = await AsyncStorage.getItem("driver");
    //   if (storedDriverId) {
    //     setDriverId("AAA-100002");
    //   } else {
    //     Alert.alert("Error", "Driver ID not found in storage.");
    //   }
    // };
    const fetchData = async () => {
      const storedIds = await AsyncStorage.getItem("theIds");
      console.log("hipiiiiiiii", storedIds);
      const parsedIds = JSON.parse(storedIds);
      console.log(parsedIds.driver_id);
      setDriverId(parsedIds.driver_id);
      console.log("driver", driverId);

      setLoading(false);
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (driverId) {
    }
  }, [driverId]);

  useEffect(() => {
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
    const fetchDriverDetails = async (driverId) => {
      try {
        const response = await fetch(`${APILINK}/driver/${driverId}`);
        const result = await response.json();

        // Ensure you are checking if result is not empty or undefined
        if (result && result.length > 0) {
          await AsyncStorage.setItem("userDetails", JSON.stringify(result[0]));
          setPic(`${APILINK}${result[0].profilePic}`);
          console.log(`${APILINK}${result[0].profilePic}`);
          console.log("user", result);
          setType(result[0].account_type); // Set the driver type (role)
          setName(result[0].username);
        } else {
          Alert.alert("Error", "Driver details not found.");
          setLoading(false);
        }
      } catch (error) {
        console.error("Error fetching driver details:", error);
        Alert.alert(
          "Error",
          "Failed to fetch driver details. Please try again."
        );
        setLoading(false);
      }
    };

    if (driverId) {
      fetchTripData(driverId);
      fetchDriverDetails(driverId);
    }
  }, [driverId]);

  const getDirections = async (origin, destination) => {
    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/directions/json?origin=${origin.latitude},${origin.longitude}&destination=${destination.latitude},${destination.longitude}&key=AIzaSyA4ZQWDwYRHmhu66Cb1F8DgXbJJrArHYyE`
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      if (data.routes && data.routes.length > 0) {
        const points = decodePolyline(data.routes[0].overview_polyline.points);
        setRoute(points);

        if (mapRef.current) {
          mapRef.current.animateToRegion(
            {
              latitude: points[0].latitude,
              longitude: points[0].longitude,
              latitudeDelta: 0.05,
              longitudeDelta: 0.05,
            },
            1000
          );
        }
      } else {
        Alert.alert("Error", "No route found. Please check the locations.");
      }
    } catch (error) {
      Alert.alert(
        "Error",
        error.message || "Unable to fetch directions. Please try again."
      );
    }
  };

  const decodePolyline = (t) => {
    const points = [];
    let index = 0;
    let lat = 0;
    let lng = 0;

    while (index < t.length) {
      let b,
        shift = 0,
        result = 0;
      do {
        b = t.charCodeAt(index++) - 63;
        result |= (b & 0x1f) << shift;
        shift += 5;
      } while (b >= 0x20);
      const dlat = (result >> 1) ^ -(result & 1);
      lat += dlat;

      shift = 0;
      result = 0;
      do {
        b = t.charCodeAt(index++) - 63;
        result |= (b & 0x1f) << shift;
        shift += 5;
      } while (b >= 0x20);
      const dlng = (result >> 1) ^ -(result & 1);
      lng += dlng;

      points.push({
        latitude: lat / 1e5,
        longitude: lng / 1e5,
      });
    }
    return points;
  };

  return (
    <View style={styles.container}>
      <TopView
        profileImage={pic}
        customerType={type} // Pass the type to TopView
        notificationCount={notificationCount} // Ensure this is set correctly
        name={name}
      />

      <MapView
        ref={mapRef}
        style={styles.map}
        showsUserLocation={true}
        provider={MapView.PROVIDER_GOOGLE}
      >
        {driverLocation && (
          <Marker
            coordinate={driverLocation}
            title="Driver's Location"
            pinColor="blue"
          />
        )}
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

      <View style={styles.infoContainer}>
        <Text style={styles.infoText}>Route</Text>

        <TouchableOpacity
          style={styles.chatButton}
          onPress={() => navigation.navigate("DriverChat")}
        >
          <Text style={[styles.chatButtonText]}>Chat</Text>
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

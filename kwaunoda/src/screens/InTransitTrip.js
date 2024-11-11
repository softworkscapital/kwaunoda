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

const InTransitTrip = ({ navigation }) => {
  const mapRef = useRef(null);
  const [route, setRoute] = useState([]);
  const [loading, setLoading] = useState(true);
  const [driverLocation, setDriverLocation] = useState(null);
  const [pickUpLocation, setPickUpLocation] = useState(null);
  const [destinationLocation, setDestinationLocation] = useState(null);
  const [driverId, setDriverId] = useState(null);
  const [currentTrip, setCurrentTrip] = useState(null);

  useEffect(() => {
    const fetchDriverId = async () => {
      const storedDriverId = await AsyncStorage.getItem("driver");
      if (storedDriverId) {
        setDriverId("AAA-100002");
      } else {
        Alert.alert("Error", "Driver ID not found in storage.");
      }
    };

    fetchDriverId();
  }, []);

  useEffect(() => {
    // const fetchDriverLocation = async () => {
    //   try {
    //     const netInfo = await NetInfo.fetch();
    //     if (!netInfo.isConnected) {
    //       throw new Error("No internet connection. Please check your network.");
    //     }

    //     const response = await fetch(`${API_URL}/driver/${driverId}`);
    //     if (!response.ok) {
    //       throw new Error(`HTTP error! status: ${response.status}`);
    //     }

    //     const result = await response.json();
    //     if (result.length > 0) {
    //       const driverCoords = {
    //         latitude: parseFloat(result[0].lat_cordinates),
    //         longitude: parseFloat(result[0].long_cordinates),
    //       };
    //       if (!isNaN(driverCoords.latitude) && !isNaN(driverCoords.longitude)) {
    //         setDriverLocation(driverCoords);
    //         await AsyncStorage.setItem("driverLocation", JSON.stringify(driverCoords));
    //       } else {
    //         Alert.alert("Error", "Invalid driver location coordinates.");
    //       }
    //     } else {
    //       Alert.alert("No Driver Found", "Driver details are not available.");
    //     }
    //   } catch (error) {
    //     Alert.alert("Error", error.message || "Failed to fetch driver location. Please try again.");
    //   }
    // };

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
        const inTransitTrips = trips.filter(trip => trip.driver_id === driverId && trip.status === "InTransit");

        if (inTransitTrips.length > 0) {
          const trip = inTransitTrips[0];
          setCurrentTrip(trip);

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

    if (driverId) {
      fetchTripData(driverId);
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
      Alert.alert("Error", error.message || "Unable to fetch directions. Please try again.");
    }
  };

  const decodePolyline = (t) => {
    const points = [];
    let index = 0;
    let lat = 0;
    let lng = 0;

    while (index < t.length) {
      let b, shift = 0, result = 0;
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
        profileImage="https://example.com/profile.jpg"
        customerType="Customer"
        notificationCount={5}
      />

      <MapView
        ref={mapRef}
        style={styles.map}
        showsUserLocation={true}
        provider={MapView.PROVIDER_GOOGLE}
      >
        {driverLocation && (
          <Marker coordinate={driverLocation} title="Driver's Location" pinColor="blue" />
        )}
        {pickUpLocation && (
          <Marker coordinate={pickUpLocation} title="Pick-Up Location" pinColor="red" />
        )}
        {destinationLocation && (
          <Marker coordinate={destinationLocation} title="Destination" pinColor="green" />
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
              onPress={() => navigation.navigate("CustomerEndTrip")}
            >
              <Text style={styles.chatButtonText}>End Trip</Text>
            </TouchableOpacity>
        {currentTrip && (
          <View style={styles.fixedCurrentTripContainer}>
            
            <Text style={styles.currentTripText}>
              Current Trip: {currentTrip.trip_id}
            </Text>
            <Text style={styles.tripDetailsText}>
              Driver ID: {currentTrip.driver_id}
            </Text>
            <Text style={styles.tripDetailsText}>
              Status: {currentTrip.status}
            </Text>
            <Text style={styles.tripDetailsText}>
              Start Time: {currentTrip.request_start_datetime}
            </Text>
            <Text style={styles.tripDetailsText}>
              Delivery: {currentTrip.delivery_details}
            </Text>
            <Text style={styles.tripDetailsText}>
              Notes: {currentTrip.delivery_notes || "N/A"}
            </Text>
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
  infoContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "green",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    elevation: 5,
  },
  infoText: {
    fontSize: 16,
    color: "#333",
  },
  fixedCurrentTripContainer: {
    marginTop: 10,
    backgroundColor: "lightgreen",

  },
  chatButton: {
    padding: 10,
    backgroundColor: "lightgreen",
    borderRadius: 5,
    alignItems: "center",
    marginBottom:10
  },
  chatButtonText: {
    fontWeight: "bold",
    color: "#000",
  },
  currentTripText: {
    fontWeight: "bold",
    fontSize: 18,
  },
  tripDetailsText: {
    fontSize: 14,
    color: "#595959",
  },
});

export default InTransitTrip;
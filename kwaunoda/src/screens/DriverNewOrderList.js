import React, { useState, useEffect, useRef } from "react";
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Text,
  ActivityIndicator,
  ScrollView,
  Alert,
  RefreshControl,
} from "react-native";
import MapView, { Marker, Polyline } from "react-native-maps";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_URL } from "./config";
import axios from "axios";
import { useNavigation, useRoute } from "@react-navigation/native";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";

const DriverNewOrderList = () => {
  const [marker, setMarker] = useState({ latitude: 51.505, longitude: -0.09 });
  const navigation = useNavigation();
  const route = useRoute();
  const { driverId } = route.params || {};
  const [locations, setLocations] = useState([]);
  const [filteredTrips, setFilteredTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [routePoints, setRoute] = useState(null);
  const [selectedTrip, setSelectedTrip] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const mapRef = useRef(null);
  const APILINK = API_URL;
  const GOOGLE_MAPS_API_KEY = "AIzaSyA4ZQWDwYRHmhu66Cb1F8DgXbJJrArHYyE";

  // Error logging function
  const logErrorToFile = async (error) => {
    try {
      await axios.post(`http://softworkscapital.com/kwaunoda/LOGS`, {
        error: error.message,
        stack: error.stack,
        timestamp: new Date().toISOString(),
      });
    } catch (err) {
      console.error("Failed to log error:", err);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      const storedIds = await AsyncStorage.getItem("theIds");

      if (storedIds) {
        const parsedIds = JSON.parse(storedIds);
        await fetchDriverDetails(parsedIds.driver_id);
      } else {
        Alert.alert("Driver ID not found", "Please log in again.");
        setLoading(false);
      }
    };

    fetchData();

    const intervalId = setInterval(() => {
      fetchData();
    }, 30000);

    return () => clearInterval(intervalId);
  }, []);

  const fetchDriverDetails = async (driverId) => {
    try {
      const response = await fetch(`${APILINK}/driver/${driverId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const result = await response.json();
      await AsyncStorage.setItem("userDetails", JSON.stringify(result[0]));
      await fetchTrips(driverId);
    } catch (error) {
      console.error("Error fetching driver details:", error);
      await logErrorToFile(error); // Log the error
      Alert.alert("Error", "Failed to fetch driver details. Please try again.");
      setLoading(false);
    }
  };

  const fetchTrips = async (driverId) => {
    setRefreshing(true);
    try {
      const response = await fetch(`${APILINK}/trip/driver/notify/`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();

      if (data.length === 0) {
        Alert.alert(
          "No trips available",
          "There are currently no trips to show."
        );
        setLoading(false);
        return;
      }

      const trips = data.map((trip) => ({
        trip_id: trip.trip_id,
        origin_lat: parseFloat(trip.origin_location_lat),
        origin_long: parseFloat(trip.origin_location_long),
        destination_lat: parseFloat(trip.destination_lat),
        destination_long: parseFloat(trip.destination_long),
        weight: trip.weight,
        detail: trip.deliveray_details,
        contact: trip.delivery_contact_details,
        cost: trip.delivery_cost_proposed,
      }));

      setLocations(trips);
      filterTripsWithinRadius(trips, 1000, 5);
    } catch (error) {
      console.error("Error fetching trips:", error);
      await logErrorToFile(error); // Log the error
      Alert.alert("Error", "Failed to fetch trips. Please try again.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const filterTripsWithinRadius = (trips, initialRadius, targetCount) => {
    let radius = initialRadius;
    let foundTrips = [];

    while (foundTrips.length < targetCount && radius <= 10000) {
      foundTrips = trips.filter((trip) => {
        // Implement actual filtering logic based on distance
        return true; // Placeholder for filtering logic
      });
      radius += 1000;
    }

    setFilteredTrips(foundTrips);
  };

  const handlePress = (location) => {
    const origin = {
      latitude: parseFloat(location.origin_lat),
      longitude: parseFloat(location.origin_long),
    };
    const destination = {
      latitude: parseFloat(location.destination_lat),
      longitude: parseFloat(location.destination_long),
    };

    setMarker(destination);
    getDirections(origin, destination);
    fitMapToCoordinates([origin, destination]);
    setSelectedTrip(location);

    if (mapRef.current) {
      mapRef.current.animateToRegion(
        {
          latitude: (origin.latitude + destination.latitude) / 2,
          longitude: (origin.longitude + destination.longitude) / 2,
          latitudeDelta:
            Math.abs(origin.latitude - destination.latitude) + 0.01,
          longitudeDelta:
            Math.abs(origin.longitude - destination.longitude) + 0.01,
        },
        1000
      );
    }
  };

  const handleBackToList = () => {
    setSelectedTrip(null);
    setRoute(null);
  };

  const fitMapToCoordinates = (coordinates) => {
    if (mapRef.current) {
      mapRef.current.fitToCoordinates(coordinates, {
        edgePadding: {
          right: 50,
          left: 50,
          top: 50,
          bottom: 50,
        },
        animated: true,
      });
    }
  };

  const getDirections = async (origin, destination) => {
    try {
      const response = await axios.get(
        `https://maps.googleapis.com/maps/api/directions/json`,
        {
          params: {
            origin: `${origin.latitude},${origin.longitude}`,
            destination: `${destination.latitude},${destination.longitude}`,
            key: GOOGLE_MAPS_API_KEY,
            mode: "driving",
          },
        }
      );

      if (response.data.routes.length > 0) {
        const points = decode(response.data.routes[0].overview_polyline.points);
        setRoute(points);
      } else {
        console.log("No routes found");
      }
    } catch (error) {
      console.error("Error fetching directions:", error);
      await logErrorToFile(error); // Log the error
    }
  };

  const decode = (t, n = 5) => {
    const coordinates = [];
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

      coordinates.push({
        latitude: lat / 1e5,
        longitude: lng / 1e5,
      });
    }

    return coordinates;
  };

  const handleAcceptTrip = async () => {
    if (!driverId) {
      Alert.alert("Error", "Driver ID is not available.");
      return;
    }

    await AsyncStorage.setItem("driver", JSON.stringify(driverId));
    try {
      const response = await fetch(
        `${APILINK}/trip/updateStatusAndDriver/${selectedTrip.trip_id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            driver_id: driverId,
            status: "InTransit",
          }),
        }
      );

      const text = await response.text();
      console.log("Raw response:", text);

      let result;
      try {
        result = JSON.parse(text);
      } catch (err) {
        console.error("Failed to parse JSON:", err);
        await logErrorToFile(err); // Log the error
        Alert.alert(
          "Error",
          "Received an unexpected response from the server."
        );
        return;
      }

      if (response.ok) {
        Alert.alert("Success", result.message || "Trip accepted successfully.");
        fetchTrips(driverId);
        navigation.navigate("InTransitTrip");
      } else {
        Alert.alert("Error", result.message || "Failed to accept trip.");
      }
    } catch (error) {
      console.error("Error accepting trip:", error);
      await logErrorToFile(error); // Log the error
      Alert.alert("Error", "An error occurred while accepting the trip.");
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.viewTop}>
        <View style={styles.iconContainer}>
          <TouchableOpacity style={[styles.menuIcon, { marginRight: 10 }]}>
            <FontAwesome5 name="bell" size={20} color="#595959" />
            <View
              style={[
                styles.notificationView,
                {
                  backgroundColor: "red",
                  position: "absolute",
                  top: -4,
                  right: -6,
                },
              ]}
            >
              <Text
                style={{ color: "white", fontSize: 12, fontWeight: "bold" }}
              >
                5
              </Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuIcon}>
            <FontAwesome5 name="bars" size={20} color="#595959" />
          </TouchableOpacity>
        </View>

        <View style={styles.nameContainer}>
          <Text style={styles.firstName}>KING</Text>
          <Text style={styles.surname}>Driver</Text>
        </View>
      </View>
      <MapView
        ref={mapRef}
        style={styles.map}
        initialRegion={{
          latitude: 51.505,
          longitude: -0.09,
          latitudeDelta: 0.1,
          longitudeDelta: 0.1,
        }}
      >
        {selectedTrip && (
          <>
            <Marker
              coordinate={{
                latitude: selectedTrip.origin_lat,
                longitude: selectedTrip.origin_long,
              }}
              title={`Trip ID: ${selectedTrip.trip_id} - Origin`}
            />
            <Marker coordinate={marker} title="Destination" />
          </>
        )}

        {routePoints && routePoints.length > 0 && (
          <Polyline
            coordinates={routePoints}
            strokeColor="blue"
            strokeWidth={5}
          />
        )}
      </MapView>
      <View style={styles.card}>
        {selectedTrip ? (
          <>
            <Text style={styles.title}>Trip Details</Text>
            <Text>{selectedTrip.detail}</Text>
            <Text>{selectedTrip.weight} KG</Text>
            <Text>${selectedTrip.cost}</Text>
            <Text>Contact: {selectedTrip.contact}</Text>
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                onPress={handleBackToList}
                style={styles.button} // Default button style
              >
                <Text style={styles.buttonText}>Back to Trip List</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleAcceptTrip}
                style={styles.acceptButton} // Specific style for Accept Trip button
              >
                <Text style={styles.acceptButtonText}>Accept Trip</Text>
              </TouchableOpacity>
            </View>
          </>
        ) : (
          <>
            <View style={styles.selectTripContainer}>
              <Text style={styles.selectTripTitle}>Select Trip</Text>
            </View>
            <ScrollView
              style={styles.scrollView}
              refreshControl={
                <RefreshControl
                  refreshing={refreshing}
                  onRefresh={() => fetchTrips(driverId)}
                />
              }
            >
              {filteredTrips.map((location) => (
                <TouchableOpacity
                  key={location.trip_id}
                  onPress={() => handlePress(location)}
                  style={styles.listItem}
                >
                  <View style={styles.listItemContent}>
                    <Text style={styles.listItemDetail}>{location.detail}</Text>
                    <Text style={styles.listItemCost}>${location.cost}</Text>
                  </View>
                  <Text style={styles.listItemWeight}>
                    {location.weight} KG
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  // Your existing styles...
});

export default DriverNewOrderList;

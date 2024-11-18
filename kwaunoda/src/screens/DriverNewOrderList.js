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
import TopView from "../components/TopView";

const DriverNewOrderList = () => {
  const [marker, setMarker] = useState({ latitude: 51.505, longitude: -0.09 });
  const navigation = useNavigation();
  const route = useRoute();
  const { driverId } = route.params || {};
  const [driver, setDriver] = useState(null);
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [routePoints, setRoute] = useState(null);
  const [selectedTrip, setSelectedTrip] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const mapRef = useRef(null);
  const APILINK = API_URL;
  const GOOGLE_MAPS_API_KEY = "AIzaSyA4ZQWDwYRHmhu66Cb1F8DgXbJJrArHYyE"; // Replace with your actual API key

  const [name, setName] = useState();
  const [type, setType] = useState();
  const [pic, setPic] = useState();
  const [notificationCount, setNotificationCount] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      const storedIds = await AsyncStorage.getItem("theIds");
      if (storedIds) {
        const parsedIds = JSON.parse(storedIds);
        await fetchDriverDetails(parsedIds.driver_id);
        setDriver(parsedIds.driver_id);
      } else {
        Alert.alert("Driver ID not found", "Please log in again.");
        setLoading(false);
      }
    };

    fetchData();

    const intervalId = setInterval(() => {
      fetchTrips(driverId);
    }, 30000);

    return () => clearInterval(intervalId);
  }, [driverId]); // Ensure driverId is included in dependencies

  const fetchDriverDetails = async (driverId) => {
    try {
      const response = await fetch(`${APILINK}/driver/${driverId}`);
      const result = await response.json();

      if (result && result.length > 0) {
        await AsyncStorage.setItem("userDetails", JSON.stringify(result[0]));
        setPic(`${APILINK}${result[0].profilePic}`);
        setType(result[0].account_type);
        setName(result[0].username);
        await fetchTrips(driverId);
      } else {
        Alert.alert("Error", "Driver details not found.");
        setLoading(false);
      }
    } catch (error) {
      console.error("Error fetching driver details:", error);
      Alert.alert("Error", "Failed to fetch driver details. Please try again.");
      setLoading(false);
    }
  };

  const fetchTrips = async (driverId) => {
    setRefreshing(true);
    try {
      const response = await fetch(`${APILINK}/trip/driver/notify/`);
      const data = await response.json();

      if (Array.isArray(data) && data.length > 0) {
        const trips = data.map((trip) => ({
          trip_id: trip.trip_id,
          customer: trip.cust_id,
          origin_lat: parseFloat(trip.origin_location_lat),
          origin_long: parseFloat(trip.origin_location_long),
          destination_lat: parseFloat(trip.destination_lat),
          destination_long: parseFloat(trip.destination_long),
          detail: trip.deliveray_details,
          cost: trip.delivery_cost_proposed,
          destination: trip.dest_location,
        }));
        setLocations(trips);
      } else {
        console.log("No trips available");
      }
    } catch (error) {
      console.error("Error fetching trips:", error);
      Alert.alert("Error", "Failed to fetch trips. Please try again.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
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
    setSelectedTrip(location);
    fitMapToCoordinates([origin, destination]);

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
    }
  };

  const decode = (t) => {
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
    console.log(selectedTrip);
    if (
      !driver ||
      !selectedTrip.cost ||
      !selectedTrip.trip_id ||
      !selectedTrip.customer ||
      !selectedTrip.destination
    ) {
      Alert.alert("Error", "Some values are missing.");
      return;
    }

    try {
      // Step 1: Credit the customer
      const topUpResponse = await fetch(`${APILINK}/topUp/topupcr/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          cr: selectedTrip.cost,
          trip_id: selectedTrip.trip_id,
          client_profile_id: selectedTrip.customer,
          desc: selectedTrip.destination,
          trxn_code: "NTR",
        }),
      });

      const topUpResult = await topUpResponse.json();

      if (!topUpResponse.ok) {
        throw new Error(topUpResult.message || "Failed to deduct amount.");
      }
      Alert.alert("Success", topUpResult.message || "Amount deducted");

      // Step 2: Debit the driver
      const debitResponse = await fetch(`${APILINK}/topUp/topupdr/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          dr: selectedTrip.cost,
          trip_id: selectedTrip.trip_id,
          client_profile_id: driver,
          desc: selectedTrip.destination,
          trxn_code: "CTR",
        }),
      });

      const debitResult = await debitResponse.json();

      if (!debitResponse.ok) {
        throw new Error(debitResult.message || "Failed to send amount.");
      }
      Alert.alert("Success", debitResult.message || "Amount sent");

      // Step 3: Update trip status
      const statusResponse = await fetch(
        `${APILINK}/trip/updateStatusAndDriver/${selectedTrip.trip_id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            driver_id: driver,
            status: "InTransit",
          }),
        }
      );

      const statusResult = await statusResponse.json();

      if (!statusResponse.ok) {
        throw new Error(statusResult.message || "Failed to accept trip.");
      }
      Alert.alert(
        "Success",
        statusResult.message || "Trip accepted successfully."
      );

      // Fetch trips and navigate after successful status update
      fetchTrips(driver);
      navigation.navigate("InTransitTrip");
    } catch (error) {
      console.error("Error accepting trip:", error);
      Alert.alert(
        "Error",
        error.message || "An error occurred while accepting the trip."
      );
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
      <TopView
        profileImage={pic}
        customerType={type}
        notificationCount={notificationCount}
        name={name}
      />
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
            <Text style={{ paddingVertical: 10 }}>{selectedTrip.detail}</Text>
            <Text style={{ fontSize: 20, fontWeight: "700", color: "green" }}>
              ${selectedTrip.cost}
            </Text>
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                onPress={() => setSelectedTrip(null)}
                style={styles.button}
              >
                <Text style={styles.buttonText}>Back to List</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleAcceptTrip} // Correctly reference the function
                style={styles.acceptButton}
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
              {locations.length > 0 ? (
                locations.map((location) => (
                  <TouchableOpacity
                    key={location.trip_id}
                    onPress={() => handlePress(location)}
                    style={styles.listItem}
                  >
                    <View style={styles.listItemContent}>
                      <Text style={styles.listItemDetail}>
                        {location.detail}
                      </Text>
                    </View>
                    <Text style={styles.listItemWeight}>${location.cost}</Text>
                  </TouchableOpacity>
                ))
              ) : (
                <Text style={styles.noTripsText}>No trips available</Text>
              )}
            </ScrollView>
          </>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  card: {
    padding: 20,
    backgroundColor: "#fff",
    borderRadius: 8,
    margin: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 3,
    minHeight: 200,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  button: {
    backgroundColor: "green",
    borderRadius: 50,
    padding: 14,
    width: "50%",
    alignItems: "center",
  },
  buttonText: {
    fontSize: 16,
    color: "#333",
  },
  acceptButton: {
    backgroundColor: "green",
    borderRadius: 50,
    padding: 14,
    width: "50%",
    alignItems: "center",
    marginLeft: 5,
  },
  acceptButtonText: {
    fontSize: 16,
    color: "black",
  },
  selectTripContainer: {
    alignItems: "center",
    marginBottom: 10,
  },
  selectTripTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  scrollView: {
    maxHeight: 200,
  },
  listItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  listItemContent: {
    flex: 1,
  },
  listItemDetail: {
    fontSize: 16,
  },
  listItemWeight: {
    alignSelf: "center",
  },
  noTripsText: {
    textAlign: "center",
    padding: 10,
    color: "#888",
  },
});

export default DriverNewOrderList;

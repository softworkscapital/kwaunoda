"AIzaSyA4ZQWDwYRHmhu66Cb1F8DgXbJJrArHYyE"
"proxy": "https://maps.googleapis.com/maps/",
import React, { useState, useEffect } from 'react';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';
import { API_URL } from './config';

const MapView = () => {
  const [markers, setMarkers] = useState([]);
  const [driversData, setDriversData] = useState([]);
  const APILINK = API_URL;

  const getDrivers = async () => {
    try {
      const response = await fetch(`${APILINK}/driver/`);
      const data = await response.json();
      console.log(data);

// Function to determine the icon based on driver data
//   const getIcon = (accountType) => {
//     switch (accountType) {
//       case 'driver':
//         return fetch('https://www.randomcolor.com/json'); // Replace with your blue marker image URL
//        // Replace with your red marker image URL
//       default:
//         return fetch('https://www.randomcolor.com/json'); // Replace with your default marker image URL
//     }
//   };
      // Extract coordinates from the data
      const newMarkers = data.map((driver) => ({
        lat: parseFloat(driver.lat_cordinates),
        lng: parseFloat(driver.long_cordinates),
        // icon: getIcon(driver.account_type),
      }));
      setMarkers(newMarkers);
      setDriversData(data); // Update drivers data state as well
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getDrivers();
    const interval = setInterval(() => {
        getDrivers();
    }, 1000); // Refresh every 1 second
    return () => clearInterval(interval);
  }, []);

  return (
    <LoadScript googleMapsApiKey="AIzaSyA4ZQWDwYRHmhu66Cb1F8DgXbJJrArHYyE">
      <div style={{ width: '120%', height: '75vh' }}>
        <GoogleMap
          mapContainerStyle={{ width: '180%', height: '130%' }}
          center={{ lat: -17.8252, lng: 31.0335 }} // Centered on Harare, Zimbabwe
          zoom={12} // Increase the zoom level for a closer view
        >
          {markers.map((marker, index) => (
            <Marker key={index} position={marker} />
          ))}
        </GoogleMap>
      </div>
    </LoadScript>
  );
};

export default MapView;

import React, { useState, useEffect, useRef } from "react";
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Text,
  ActivityIndicator,
  ScrollView,
  Alert,
} from "react-native";
import MapView, { Marker, Polyline } from "react-native-maps";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_URL } from "./config";
import axios from "axios";

const DriverNewOrderList = () => {
  const [marker, setMarker] = useState({
    latitude: 51.505,
    longitude: -0.09,
  });
  const [locations, setLocations] = useState([]);
  const [filteredTrips, setFilteredTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [route, setRoute] = useState(null);
  const [selectedTrip, setSelectedTrip] = useState(null);
  const mapRef = useRef(null);
  const APILINK = API_URL;
  const GOOGLE_MAPS_API_KEY = "YOUR_GOOGLE_MAPS_API_KEY"; // Replace with your key

  useEffect(() => {
    const instant = async () => {
      const storedIds = await AsyncStorage.getItem("theIds");

      if (storedIds) {
        const parsedIds = JSON.parse(storedIds);
        await fetchDriverDetails(parsedIds.driver_id);
      } else {
        Alert.alert("Driver ID not found", "Please log in again.");
        setLoading(false);
      }
    };

    instant();
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
      Alert.alert("Error", "Failed to fetch driver details. Please try again.");
      setLoading(false);
    }
  };

  const fetchTrips = async (driverId) => {
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
      Alert.alert("Error", "Failed to fetch trips. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const filterTripsWithinRadius = (trips, initialRadius, targetCount) => {
    let radius = initialRadius;
    let foundTrips = [];

    while (foundTrips.length < targetCount && radius <= 10000) {
      foundTrips = trips.filter((trip) => {
        // Adjust this logic as needed to filter trips
        return true;
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
    const userDetails = await AsyncStorage.getItem("userDetails");
    const user = JSON.parse(userDetails);

    const acceptData = {
      driver_id: user.id,
      status: "InTransit",
    };

    try {
      const response = await fetch(
        `${APILINK}/trip/updateStatusAndDriver/${selectedTrip.trip_id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            driver_id: "2",
            status: "InTransit",
          }),
        }
      );

      const text = await response.text(); // Get raw text response
      console.log("Raw response:", text); // Log the raw response

      // Check if the response is JSON
      let result;
      try {
        result = JSON.parse(text);
      } catch (err) {
        console.error("Failed to parse JSON:", err);
        Alert.alert(
          "Error",
          "Received an unexpected response from the server."
        );
        return;
      }

      if (response.ok) {
        Alert.alert("Success", result.message || "Trip accepted successfully.");
        handleBackToList();
        fetchTrips();
      } else {
        Alert.alert("Error", result.message || "Failed to accept trip.");
      }
    } catch (error) {
      console.error("Error accepting trip:", error);
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
      <MapView
        ref={mapRef}
        style={styles.map}
        initialRegion={{
          latitude: 51.505,
          longitude: -0.09,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
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

        {route && route.length > 0 && (
          <Polyline coordinates={route} strokeColor="blue" strokeWidth={5} />
        )}
      </MapView>
      <View style={styles.card}>
        {selectedTrip ? (
          <>
            <Text style={styles.title}>Trip Details</Text>
            <Text>
              {selectedTrip.detail} - {selectedTrip.weight} KG - $
              {selectedTrip.cost}
            </Text>
            <Text>Contact: {selectedTrip.contact}</Text>
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                onPress={handleBackToList}
                style={styles.button}
              >
                <Text style={styles.buttonText}>Back to Trip List</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleAcceptTrip} // Updated to call accept trip function
                style={styles.button}
              >
                <Text style={styles.buttonText}>Accept Trip</Text>
              </TouchableOpacity>
            </View>
          </>
        ) : (
          <>
            <Text style={styles.title}>Select Trip</Text>
            <ScrollView style={styles.scrollView}>
              {filteredTrips.map((location) => (
                <TouchableOpacity
                  key={location.trip_id}
                  onPress={() => handlePress(location)}
                  style={styles.listItem}
                >
                  <Text>
                    {location.detail} - {location.weight} KG - ${location.cost}
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
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  map: {
    flex: 1,
  },
  card: {
    padding: 16,
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "white",
    elevation: 5,
    maxHeight: 250,
  },
  scrollView: {
    maxHeight: 150,
  },
  title: {
    fontSize: 18,
    marginBottom: 8,
  },
  listItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  button: {
    flex: 1,
    margin: 5,
    padding: 10,
    backgroundColor: "#007BFF",
    borderRadius: 5,
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
  },
});

export default DriverNewOrderList;

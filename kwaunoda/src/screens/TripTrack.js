import React, { useEffect, useRef, useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  Alert,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native"; // Add TouchableOpacity here
import MapView, { Marker, Polyline } from "react-nativme-maps";
import NetInfo from "@react-native-community/netinfo";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_URL } from "./config";
import { FontAwesome5 } from "@expo/vector-icons"; // Ensure you import FontAwesome5 if not already
const InTransitTrip = () => {
  const mapRef = useRef(null);
  const [route, setRoute] = useState([]);
  const [loading, setLoading] = useState(true);
  const [driverLocation, setDriverLocation] = useState(null);
  const [pickUpLocation, setPickUpLocation] = useState(null);
  const [destinationLocation, setDestinationLocation] = useState(null);
  const [customerId, setcustomerId] = useState(null);

  useEffect(() => {
    const fetchcustomerId = async () => {
      const storedcustomerId = await AsyncStorage.getItem("driver");
      console.log("Stored Driver ID:", storedcustomerId);
      if (storedcustomerId) {
        setcustomerId(storedcustomerId);
      } else {
        Alert.alert("Error", "Driver ID not found in storage.");
      }
    };

    fetchcustomerId();
  }, []);

  useEffect(() => {
    const fetchDriverLocation = async () => {
      try {
        const netInfo = await NetInfo.fetch();
        console.log("Network Info:", netInfo);
        if (!netInfo.isConnected) {
          throw new Error("No internet connection. Please check your network.");
        }

        const response = await fetch(`${API_URL}/driver/${customerId}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        console.log("Driver Location Response:", response);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        if (result.length > 0) {
          const driverCoords = {
            latitude: parseFloat(result[0].lat_cordinates),
            longitude: parseFloat(result[0].long_cordinates),
          };
          if (!isNaN(driverCoords.latitude) && !isNaN(driverCoords.longitude)) {
            setDriverLocation(driverCoords);
            await AsyncStorage.setItem(
              "driverLocation",
              JSON.stringify(driverCoords)
            );
          } else {
            Alert.alert("Error", "Invalid driver location coordinates.");
          }
        } else {
          Alert.alert("No Driver Found", "Driver details are not available.");
        }
      } catch (error) {
        console.error("Error fetching driver location:", error);
        Alert.alert(
          "Error",
          error.message || "Failed to fetch driver location. Please try again."
        );
      }
    };

    if (customerId) {
      fetchDriverLocation();
    }
  }, [customerId]);

  const fetchTripData = async () => {
    try {
      const response = await fetch(
        `${API_URL}/trip/byStatus/driver_id/status?driver_Id=${customerId}&status=InTransit`
      );

      console.log("Trip Data Response:", response);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const tripData = await response.json();
      console.log("Trip Data:", tripData);

      if (tripData.length > 0) {
        const trip = tripData[0];
        const startCoords = {
          latitude: parseFloat(trip.origin_location_lat),
          longitude: parseFloat(trip.origin_location_long),
        };
        const destCoords = {
          latitude: parseFloat(trip.destination_lat),
          longitude: parseFloat(trip.destination_long),
        };

        console.log("Parsed Start Coordinates:", startCoords);
        console.log("Parsed Destination Coordinates:", destCoords);

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
        Alert.alert("Error", "No trip data found.");
      }
    } catch (error) {
      console.error("Error fetching trip data:", error);
      Alert.alert("Error", error.message || "Unable to fetch route details.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (customerId) {
      fetchTripData();
    }
  }, [customerId]);

  const getDirections = async (origin, destination) => {
    console.log("Fetching directions from:", origin, "to:", destination);
    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/directions/json?origin=${origin.latitude},${origin.longitude}&destination=${destination.latitude},${destination.longitude}&key=AIzaSyA4ZQWDwYRHmhu66Cb1F8DgXbJJrArHYyE`
      );

      console.log("Directions Response:", response);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log("API Response:", data);

      if (data.routes && data.routes.length > 0) {
        const points = decodePolyline(data.routes[0].overview_polyline.points);
        console.log("Decoded Points:", points);
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
      console.error("Error fetching directions:", error);
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
    console.log("Decoded Polyline Points:", points);
    return points;
  };

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
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFCC00", // Background color set to #FFCC00
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
    backgroundColor: "rgba(255, 255, 255, 0.8)", // Semi-transparent background
  },
  infoContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#FFCC00", // Background color set to #FFCC00
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    elevation: 5,
  },
  infoText: {
    fontSize: 16,
    color: "#333", // Dark text for contrast
  },
  viewTop: {
    flexDirection: "row",
    justifyContent: "space-between", // Distributes space between items
    alignItems: "center",
    padding: 10, // Add some padding if needed
  },
  iconContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  nameContainer: {
    alignItems: "flex-end", // Align text to the right
    flex: 1, // Allow it to take up remaining space
    marginLeft: 10, // Optional: Add space between icons and name
  },
  firstName: {
    fontSize: 18,
    fontWeight: "bold",
  },
  surname: {
    fontSize: 14,
    color: "#595959", // Adjust color as needed
  },
  menuIcon: {
    padding: 10, // Add padding around icons
  },
  notificationView: {
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    height: 20,
    width: 20,
  },
});

export default InTransitTrip;

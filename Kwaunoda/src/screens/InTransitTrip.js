import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  Alert,
  ActivityIndicator,
  TouchableOpacity,
  Image,
} from "react-native";
import { WebView } from "react-native-webview";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_URL, API_URL_UPLOADS } from "./config";
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
  const [customer, setCustomer] = useState();
  const [profilePic, setPicture] = useState();

  const APILINK = API_URL;
  const driver2 = "driver";

  // Use focus effect to reset data when navigating to this screen
  useFocusEffect(
    React.useCallback(() => {
      const resetData = async () => {
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
    console.log("maId", parsedIds);
    if (parsedIds && parsedIds.driver_id) {
      setDriverId(parsedIds.driver_id);
      fetchTripData(parsedIds.driver_id);
    } else {
      Alert.alert("Error", "Driver ID not found in storage.");
      setLoading(false);
    }
  };

  const fetchCustomer = async (customerId) => {
    if (!customerId) {
      Alert.alert("Error", "No customer ID provided.");
      return; // Exit the function if no customerId
    }

    console.log("Fetching customer ID:", customerId);

    try {
      const resp = await fetch(`${APILINK}/customerdetails/${customerId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!resp.ok) {
        // Handle HTTP errors
        const errorResponse = await resp.json();
        console.error("Error fetching customer:", errorResponse);
        Alert.alert("Error", "Failed to fetch customer details.");
        return;
      }

      const customerData = await resp.json(); // Await the JSON parsing
      console.log("Customer Info:", customerData[0]);
      setCustomer(customerData[0]);
      setPicture(
        `${API_URL_UPLOADS}/${customerData[0].profilePic.replace(/\\/g, "/")}`
      );

      // Do something with customerData, e.g., update state or UI
    } catch (error) {
      console.error("Error fetching customer:", error);
      Alert.alert("Error", "An error occurred while fetching customer data.");
    }
  };

  const fetchTripData = async (driverId) => {
    console.log("driver id intransit", driverId);
    try {
      const response = await fetch(`${API_URL}/trip`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const trips = await response.json();
      const inTransitTrips = trips.filter(
        (trip) => trip.driver_id === driverId && trip.status === "InTransit"
      );
      console.log("in trans...");

      if (inTransitTrips.length > 0) {
        const trip = inTransitTrips[0];
        setCurrentTrip(trip);
        setTripId(trip.trip_id);
        fetchCustomer(trip.cust_id);
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
        if (
          driver.lat_cordinates !== undefined &&
          driver.long_cordinates !== undefined
        ) {
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
    console.log("Kubva muUseEffect:", driverId);
    if (driverId) {
      fetchDriverLocation(driverId);
      const intervalId = setInterval(() => {
        fetchDriverLocation(driverId);
      }, 60000); // Update every minute

      return () => clearInterval(intervalId);
    }
  }, [driverId]);

  const renderStars = (rating) => {
    const stars = [];
    for (let i = 0; i < 5; i++) {
      stars.push(
        <Text key={i} style={styles.star}>
          {i < rating ? "★" : "☆"}
        </Text>
      );
    }
    return <View style={styles.starContainer}>{stars}</View>;
  };

  const webViewUrl =
    driverLocation && pickUpLocation && destinationLocation
      ? `https://kwaunoda.softworkscapital.com/mapWithDriver?latDriver=${driverLocation.latitude}&lngDriver=${driverLocation.longitude}&lat1=${pickUpLocation.latitude}&lng1=${pickUpLocation.longitude}&lat2=${destinationLocation.latitude}&lng2=${destinationLocation.longitude}`
      : null;

  return (
    <View style={styles.container}>
      <TopView id={driverId} />

      {driverId && (
        <LocationSender userId={driverId} userType={driver2} interval={60000} />
      )}

      {loading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      )}

      {webViewUrl && (
        <WebView source={{ uri: webViewUrl }} style={styles.webview} />
      )}

     
        {currentTrip && (
          <View style={styles.fixedCurrentTripContainer}>
            <View style={styles.tripCard}>
              <Text style={styles.statusText}>
                Status: {currentTrip.status}
              </Text>
              <Text style={styles.currentTripText}>
                Current Trip: {currentTrip.trip_id}
              </Text>
              <View style={styles.profileContainer}>
                <Image
                  source={{ uri: profilePic }}
                  style={[styles.profileImage, { marginTop: 5 }]}
                />
                <View style={styles.nameContainer}>
                  {customer && renderStars(customer.rating)}
                  <Text style={styles.tripDetailsText}>
                    {customer ? customer.name : "Loading customer..."}{" "}
                    {customer ? customer.surname : "Loading customer..."}
                  </Text>
                </View>
              </View>

              <Text style={styles.tripDetailsText}>
                {currentTrip.distance < 1
                  ? (currentTrip.distance * 1000).toFixed(0) + " m"
                  : currentTrip.distance + " Km"}
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


              <View style={styles.horizontalRule} />
              <View style={styles.paymentContainer}>
                <Text style={styles.currentTripText}>
                {currentTrip.currency_symbol}{currentTrip.accepted_cost || "N/A"} {currentTrip.currency_code} {" "}
                </Text>
                <Text style={styles.tripDetailsText}>
                 {currentTrip.payment_type || "N/A"}  {currentTrip.paying_when || "N/A"}
              </Text>
              </View>

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
  nameContainer: {
    flexDirection: "column", // Stack stars and name vertically
    justifyContent: "center", // Center items vertically
    marginLeft: 5,
    marginBottom: 20, // Space between image and text
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
  starContainer: {
    flexDirection: "row",
    marginTop: 5,
  },
  star: {
    fontSize: 18, // Adjust size as needed
    color: "gold", // Star color
  },
  fixedCurrentTripContainer: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    height: 430,
    padding: 30,
    // backgroundColor: "#FFC000",
    marginRight: 100,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    elevation: 5,
    paddingBottom: 45,
    marginBottom: 70,
  },
  tripCard: {
    marginVertical: 10,
    padding: 15,
    borderRadius: 5,
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    width: "100%",
    maxHeight: 425,
    paddingBottom: 10,
    marginBottom: 1,
  },
  profileContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  profileName: {
    fontSize: 12,
    fontWeight: "bold",
  },
  profileImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginLeft: 3,
    marginRight: 5,
    marginBottom: 8,
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
    borderRadius: 15, // Smaller border radius
    paddingVertical: 9, // Reduced padding
    paddingHorizontal: 12, // Reduced padding
    marginRight: 5, 
  },
  endTripText: {
    fontWeight: "bold",
    color: "#FFFFFF",
    fontSize: 14,
  },
  chatButton: {
    backgroundColor: "#007BFF",
    borderRadius: 15, // Smaller border radius
    paddingVertical: 9, // Reduced padding
    paddingHorizontal: 12, // Reduced padding
    marginRight: 5, 
  },
  chatText: {
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  tripDetailsText: {
    fontSize: 14,
    color: "#595959",
  },
  horizontalRule: {
    height: 1,
    backgroundColor: '#ccc', // Color for the horizontal rule
    marginVertical: 10, // Space above and below the rule
    width: '100%', // Full width
  },
  paymentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start', // Space items evenly
  },
  divider: {
    width: 1,
    height: 5, // Height of the divider line
    backgroundColor: '#ccc', // Color for the divider
    marginHorizontal: 10, // Space on the sides of the divider
  },
});


export default InTransitTrip;

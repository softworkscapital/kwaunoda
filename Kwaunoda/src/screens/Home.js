import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  View,
  SafeAreaView,
  ImageBackground,
  Text,
  TouchableOpacity,
  Animated,
  Dimensions,
  ScrollView,
} from "react-native";
import FontAwesome from "react-native-vector-icons/FontAwesome5";
import { API_URL } from "./config"; // Ensure this imports the correct API_URL
import TopView from "../components/TopView"; // Import TopView
import AsyncStorage from "@react-native-async-storage/async-storage"; // Import AsyncStorage
import LocationSender from "./LocationTracker";
const { height } = Dimensions.get("window");

const Home = ({ navigation }) => {
  const [trips, setTrips] = useState([]); // State to hold all trips
  const [userId, setUserId] = useState(null); // Initialize userId as null
  const [carAnimation] = useState(new Animated.Value(0)); // Animation for car

  useEffect(() => {
    const fetchUserData = async () => {
      const storedIds = await AsyncStorage.getItem("theIds");
      const parsedIds = JSON.parse(storedIds);
      setUserId(parsedIds.customerId);
      const intervalId = setInterval(() => {
        fetchUserTrips(parsedIds.customerId);
      }, 1000);

      Animated.loop(
        Animated.sequence([
          Animated.timing(carAnimation, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: false,
          }),
          Animated.timing(carAnimation, {
            toValue: 0,
            duration: 1000,
            useNativeDriver: false,
          }),
        ])
      ).start();
    };

    fetchUserData();
  }, []);

  const fetchUserTrips = async (userId) => {
    try {
      const response = await fetch(`${API_URL}/trip/customer/notify/${userId}`);
      const userTrips = await response.json();

      if (userTrips.length > 0) {
        setTrips(userTrips);
      } else {
        console.log("No trips found for user ID");
      }
    } catch (error) {
      console.error("Error fetching trips:", error);
    }
  };

  const redirectNewDelivery = () => {
    navigation.navigate("MapViewComponent"); // Navigate to MapViewComponent
  };

  const redirectCustomerNewDelivery = () => {
    navigation.navigate("DeliveryMap"); // Navigate to MapViewComponent
  };
  const redirectOnlineStore = () => {
    navigation.navigate("OnlineStore"); // Navigate to MapViewComponent
  };

  const redirectToChat = (tripId) => {
    navigation.navigate("CustomerChat", { tripId }); // Pass tripId to CustomerChat
  };

  const cancelTrip = (tripId) => {
    console.log(`Cancelling trip with ID: ${tripId}`);
  };

  const endTrip = (tripId) => {
    console.log(`Ending trip with ID: ${tripId}`);
    // Implement end trip logic here
  };

  const carTranslateY = carAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -10], // Car moves up and down
  });

  return (
    <ImageBackground
      source={require("../../assets/map.png")}
      style={styles.backgroundImage}
      resizeMode="cover"
    >
      <View style={styles.overlay} />
      <SafeAreaView style={styles.container}>
        <TopView id={userId} />
  
        <View style={styles.fixedCurrentTripContainer}>
          <View style={{ display: "flex", flexDirection: "row" }}>
            <TouchableOpacity
              style={styles.requestTripButton}
              onPress={redirectNewDelivery} // Updated to navigate to MapViewComponent
            >
              <Text style={styles.requestTripText}>Request Trip</Text>
            </TouchableOpacity>
            {/* or for a customer */}
            <LocationSender
              userId={userId}
              userType="customer"
              interval={60000}
            />
            <TouchableOpacity
              style={styles.requestTripButton}
              onPress={redirectCustomerNewDelivery} // Updated to navigate to MapViewComponent
            >
              <Text style={styles.requestTripText}>Request Delivery</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.requestTripButton}
              onPress={redirectOnlineStore}
            >
              <Text style={styles.requestTripText}>Online Store</Text>
            </TouchableOpacity>
          </View>
  
          {/* Scrollable Card Showing All Trips */}
          <ScrollView
            style={styles.tripCard}
            showsVerticalScrollIndicator={false} // Hide vertical scroll indicator
          >
            <Text style={styles.tripHeaderText}>Trips</Text>
            {trips.length > 0 ? (
              trips.map((trip) => (
                <TouchableOpacity
                  key={trip.trip_id}
                  style={[
                    styles.tripDetailsView,
                    { backgroundColor: "white" },
                  ]}
                  onPress={() => navigation.navigate("TripTrack", { trip })} // Navigate to MapScreen
                >
                  <Text style={[styles.tripDetailsText, styles.statusText]}>
                    {trip.status}
                  </Text>
                  <Text style={styles.tripDetailsText}>
                    Trip ID: {trip.trip_id}
                  </Text>
                  <Text style={styles.tripDetailsText}>
                    Driver ID: {trip.driver_id}
                  </Text>
                  <Text style={styles.tripDetailsText}>
                    Start Time: {trip.request_start_datetime}
                  </Text>
                  <Text style={styles.tripDetailsText}>
                    To: {trip.dest_location}
                  </Text>
                  <Text style={styles.tripDetailsText}>
                    From: {trip.origin_location || "N/A"}
                  </Text>
  
                  {/* Conditional Button Rendering based on Trip Status */}
                  <View style={styles.buttonContainer}>
                    {trip.status === "New Order" ? (
                      <TouchableOpacity
                        style={styles.cancelTripButton}
                        onPress={() => cancelTrip(trip.trip_id)}
                      >
                        <Text style={styles.cancelTripText}>Cancel Trip</Text>
                      </TouchableOpacity>
                    ) : (
                      <TouchableOpacity
                        style={styles.endTripButton}
                        onPress={() =>
                          navigation.navigate("CustomerEndTrip", { trip })
                        }
                      >
                        <Text style={styles.endTripText}>End Trip</Text>
                      </TouchableOpacity>
                    )}
                    <TouchableOpacity
                      style={styles.chatButton}
                      onPress={() => redirectToChat(trip.trip_id)}
                    >
                      <Text style={styles.chatText}>Chat</Text>
                    </TouchableOpacity>
                  </View>
                </TouchableOpacity>
              ))
            ) : (
              <Text style={styles.noTripText}>
                You have no trips in transit or new orders.
              </Text>
            )}
          </ScrollView>
        </View>
      </SafeAreaView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    width: "100%",
    justifyContent: "center",
  },
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-start",
    width: "100%",
  },
  fixedCurrentTripContainer: {
    position: "absolute", 
    bottom: 0,
    width: "100%",
    height: 400, 
    backgroundColor: "#FFC000", 
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
    backgroundColor: "yellow", // Slightly more opaque
    width: "100%",
    maxHeight: 300,
    paddingBottom: 10, // Added padding at the bottom
    marginBottom: 10, // Added margin at the bottom
  },
  tripDetailsView: {
    borderRadius: 10,
    marginTop: 10,
    paddingBottom: 10,
    padding: 10,
  },
  tripHeaderText: {
    fontWeight: "bold",
    fontSize: 18,
    marginBottom: 5,
  },
  tripDetailsText: {
    fontSize: 14,
    color: "#595959",
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
  noTripText: {
    fontSize: 16,
    color: "#FFFFFF", 
    textAlign: "center", 
  },
  carIconContainer: {
    position: "absolute",
    bottom: 270,
    left: "50%",
    transform: [{ translateX: -15 }],
  },
  requestTripButton: {
    backgroundColor: "#FFC000",
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginBottom: 10,
    alignSelf: "center",
    borderWidth: 1, // Add a border
    borderColor: "black", // Set the border color to black
    marginLeft: 5,
  },
  requestTripText: {
    fontWeight: "bold",
    color: "#000", 
    fontSize: 16,
  },
  buttonContainer: {
    flexDirection: "row",
    marginTop: 10,
  },
  cancelTripButton: {
    backgroundColor: "#FF5733",
    borderRadius: 20,
    paddingVertical: 6, 
    paddingHorizontal: 18, 
    marginRight: 10, 
  },
  cancelTripText: {
    fontWeight: "bold",
    color: "#FFFFFF",
    fontSize: 14, 
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
    fontSize: 16,
  },
});

export default Home;

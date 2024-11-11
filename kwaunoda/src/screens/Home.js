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
} from "react-native";
import FontAwesome from "react-native-vector-icons/FontAwesome5";
import { API_URL } from "./config"; // Ensure this imports the correct API_URL
import TopView from "../components/TopView"; // Import TopView
import AsyncStorage from '@react-native-async-storage/async-storage'; // Import AsyncStorage

const { height } = Dimensions.get("window");

const Home = ({ navigation }) => {
  const [trips, setTrips] = useState([]); // State to hold all trips
  const [userId, setUserId] = useState(null); // Initialize userId as null
  const [carAnimation] = useState(new Animated.Value(0)); // Animation for car

  useEffect(() => {
    const fetchUserData = async () => {
      // Retrieve customer_id from AsyncStorage
      const customerId = await AsyncStorage.getItem('customer_id');
      setUserId(customerId);
      console.log("Fetched Customer ID:", customerId); // Log the customer ID

      fetchUserTrips(customerId); // Pass customer ID to fetch trips

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
      const response = await fetch(`${API_URL}/trip`);
      const trips = await response.json();

      // Filter trips based on user ID and statuses
      const userTrips = trips.filter(
        (trip) => trip.user_id === userId && (trip.status === "In Transit" || trip.status === "New Order")
      );

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
        <TopView
          profileImage="https://example.com/profile.jpg"
          customerType="Customer"
          notificationCount={5}
          style={styles.topView} // Ensure TopView spans full width
        />

        {/* Fixed Bottom Card for Current Trip Details */}
        <View style={styles.fixedCurrentTripContainer}>
          {/* Animated Car */}
          <Animated.View
            style={[
              styles.carIconContainer,
              { transform: [{ translateY: carTranslateY }] },
            ]}
          >
            <FontAwesome name="car" size={30} color="#000" />
          </Animated.View>
          <TouchableOpacity
            style={styles.requestTripButton}
            onPress={redirectNewDelivery} // Updated to navigate to MapViewComponent
          >
            <Text style={styles.requestTripText}>Request Trip</Text>
          </TouchableOpacity>

          {/* Render trips grouped by status */}
          {trips.length > 0 ? (
            <>
              {["In Transit", "New Order"].map((status) => (
                <View key={status} style={styles.tripDetailsView}>
                  <Text style={styles.tripHeaderText}>{status}</Text>
                  {trips
                    .filter((trip) => trip.status === status)
                    .map((trip) => (
                      <View key={trip.trip_id} style={styles.tripCard}>
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
                          Details: {trip.deliveray_details}
                        </Text>
                        <Text style={styles.tripDetailsText}>
                          Notes: {trip.delivery_notes || "N/A"}
                        </Text>
                      </View>
                    ))}
                </View>
              ))}
            </>
          ) : (
            <Text style={styles.noTripText}>
              You have no trips in transit or new orders.
            </Text>
          )}
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
  topView: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    width: "100%", // Ensure full width
    padding: 10, // Optional padding
    backgroundColor: "rgba(255, 255, 255, 0.8)", // Optional background for visibility
  },
  fixedCurrentTripContainer: {
    position: "absolute", // Fix position to bottom
    bottom: 0,
    width: "100%",
    height: 300, // Increased height for multiple trips
    backgroundColor: "green", // Changed to green
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    elevation: 5,
  },
  tripDetailsView: {
    alignItems: "flex-start", // Align details to start
    padding: 10,
    borderRadius: 10,
    marginTop: 10,
    backgroundColor: "rgba(255, 255, 255, 0.5)", // Transparent background for trip details
  },
  tripHeaderText: {
    fontWeight: "bold",
    fontSize: 18,
    marginBottom: 5,
  },
  tripCard: {
    marginVertical: 5,
    padding: 10,
    borderRadius: 5,
    backgroundColor: "rgba(255, 255, 255, 0.8)", // Slightly more opaque
    width: "100%",
  },
  tripDetailsText: {
    fontSize: 14,
    color: "#595959",
  },
  noTripText: {
    fontSize: 16,
    color: "#FFFFFF", // White text for better visibility
    textAlign: "center", // Center align the text
  },
  carIconContainer: {
    position: "absolute",
    bottom: 270, // Adjust position above the current trip view
    left: "50%",
    transform: [{ translateX: -15 }],
  },
  requestTripButton: {
    backgroundColor: "#4CAF50", // A shade of green
    borderRadius: 20,
    paddingVertical: 12,
    paddingHorizontal: 24,
    marginBottom: 10, // Space between button and trip details
    alignSelf: "center",
    elevation: 5, // Add shadow effect
  },
  requestTripText: {
    fontWeight: "bold",
    color: "#FFFFFF", // White text for contrast
    fontSize: 16,
  },
});

export default Home;
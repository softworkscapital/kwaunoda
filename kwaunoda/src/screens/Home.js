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

const { height } = Dimensions.get("window");

const Home = ({ navigation }) => {
  const [trips, setTrips] = useState([]); // State to hold all trips
  const [userId, setUserId] = useState(null); // Initialize userId as null
  const [carAnimation] = useState(new Animated.Value(0)); // Animation for car

  useEffect(() => {
    const fetchUserData = async () => {
      // Retrieve customer_id from AsyncStorage
      const storedIds = await AsyncStorage.getItem("theIds");
      const parsedIds = JSON.parse(storedIds);
      setUserId(parsedIds.customerId);
      const intervalId = setInterval(() => {
        fetchUserTrips(parsedIds.customerId);
      }, 1000);
      // Pass customer ID to fetch trips
      intervalId();
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

  const redirectToChat = () => {
    navigation.navigate("CustomerChat"); // Navigate to CustomerChat
  };

  const cancelTrip = (tripId) => {
    console.log(`Cancelling trip with ID: ${tripId}`);
    // Implement cancellation logic here
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

          {/* Scrollable Card Showing All Trips */}
          <ScrollView
            style={styles.tripCard}
            showsVerticalScrollIndicator={false} // Hide vertical scroll indicator
          >
            <Text style={styles.tripHeaderText}>Trips</Text>
            {trips.length > 0 ? (
              trips.map((trip) => (
                <View
                  key={trip.trip_id}
                  style={[
                    styles.tripDetailsView,
                    { backgroundColor: "rgba(255, 255, 255, 0.3)" }, // Transparent background
                  ]}
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
                      onPress={redirectToChat}
                    >
                      <Text style={styles.chatText}>Chat</Text>
                    </TouchableOpacity>
                  </View>
                </View>
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
    height: 400, // Increased height for more space
    backgroundColor: "green", // Changed to green
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
    backgroundColor: "rgba(255, 255, 255, 0.8)", // Slightly more opaque
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
    fontSize: 16, // Increased size for status
    color: "red", // Change color to red
    backgroundColor: "rgba(255, 255, 255, 0.5)", // Add a semi-transparent background to make it a card
    padding: 10, // Add padding for better appearance
    borderRadius: 10, // Rounded corners for the card effect
    marginBottom: 10, // Space below the status card
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
    paddingVertical: 10, // Reduced padding
    paddingHorizontal: 20, // Reduced padding
    marginBottom: 10, // Space between button and trip details
    alignSelf: "center",
    elevation: 5, // Add shadow effect
  },
  requestTripText: {
    fontWeight: "bold",
    color: "#FFFFFF", // White text for contrast
    fontSize: 16,
  },
  buttonContainer: {
    flexDirection: "row",
    marginTop: 10,
  },
  cancelTripButton: {
    backgroundColor: "#FF5733", // Red color for Cancel Trip
    borderRadius: 20,
    paddingVertical: 6, // Reduced size
    paddingHorizontal: 18, // Reduced size
    marginRight: 10, // Space between buttons
  },
  cancelTripText: {
    fontWeight: "bold",
    color: "#FFFFFF", // White text for contrast
    fontSize: 14, // Reduced font size
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
});

export default Home;

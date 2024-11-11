import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  View,
  SafeAreaView,
  ImageBackground,
  Text,
  TouchableOpacity,
  Modal,
  FlatList,
  ScrollView,
  Dimensions,
  Image,
  Animated,
} from "react-native";
import FontAwesome from "react-native-vector-icons/FontAwesome5";
import { useNavigation } from '@react-navigation/native'; // Import useNavigation
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_URL } from "./config"; // Ensure this imports the correct API_URL
import defaultprofpic from "../../assets/defaultprofpic.webp";

const { height } = Dimensions.get("window");

const Home = () => {
  const navigation = useNavigation(); // Access navigation here
  const [modalVisible, setModalVisible] = useState(false);
  const [userDetails, setUserDetails] = useState({
    name: "",
    surname: "",
    usertype: "",
    accountCategory: "",
  });
  const [currentTrip, setCurrentTrip] = useState(null);
  const [userId, setUserId] = useState(null); // State to store user ID
  const [carAnimation] = useState(new Animated.Value(0)); // Animation for car

  const menuOptions = [
    {
      id: "1",
      title: `Account Category: ${userDetails.accountCategory || "N/A"}`,
    },
    {
      id: "2",
      title: "Profile Info",
      onPress: () => handleMenuPress("ProfileInformation"),
    },
    { id: "3", title: "Wallet", onPress: () => handleMenuPress("Wallet") },
    { id: "4", title: "History", onPress: () => handleMenuPress("History") },
    { id: "5", title: "Settings", onPress: () => handleMenuPress("Settings") },
    { id: "6", title: "FAQ", onPress: () => handleMenuPress("FAQ") },
    { id: "7", title: "Safety", onPress: () => handleMenuPress("Safety") },
    { id: "8", title: "Feedback", onPress: () => handleMenuPress("Feedback") },
    { id: "9", title: "About Us", onPress: () => handleMenuPress("AboutUs") },
    {
      id: "10",
      title: "Complaint",
      onPress: () => handleMenuPress("Complaint"),
    },
  ];

  const handleMenuPress = (screen) => {
    setModalVisible(false);
    // Navigation logic would go here
  };

  const fetchUserTrips = async (customerId) => {
    try {
      const response = await fetch(`${API_URL}/trip`);
      const trips = await response.json();

      const inTransitTrips = trips.filter(
        (trip) => trip.cust_id === customerId && trip.status === "InTransit"
      );

      if (inTransitTrips.length > 0) {
        const trip = inTransitTrips[0];
        setCurrentTrip(trip);
        setUserDetails({
          name: trip.username || "",
          surname: trip.surname || "",
          usertype: trip.role || "",
          accountCategory: trip.account_category || "Standard",
        });
      }
    } catch (error) {
      console.error("Error fetching trips:", error);
    }
  };

  useEffect(() => {
    const fetchUserData = async () => {
      // Simulated API response to fetch user data
      const responseData = [
        {
          userid: "AAA-100004",
          username: "owen",
          email: "owen@gmail.com",
          role: "customer",
          status: "Active",
        },
      ];

      // Extract userid
      const extractedUserId = responseData[0].userid;
      setUserId(extractedUserId);
      console.log("Fetched User ID:", extractedUserId); // Log the user ID

      // Fetch user trips using the fetched user ID
      fetchUserTrips(extractedUserId);

      // Start car animation
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

  const redirectNewDelivery = () => {
    // Logic for requesting a new trip would go here
    console.log("Requesting a new trip...");
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
        <View style={styles.fixedTopView}>
          <View style={styles.profileContainer}>
            <Image source={defaultprofpic} style={styles.profileImage} />
            <View>
              <Text style={{ fontWeight: "800" }}>
                {userDetails.name} {userDetails.surname}
              </Text>
              <Text style={styles.customerType}>{userDetails.usertype}</Text>
            </View>
          </View>
          <TouchableOpacity
            onPress={() => setModalVisible(true)}
            style={styles.menuButton}
          >
            <FontAwesome name="bars" size={24} color="black" />
          </TouchableOpacity>
        </View>

        <Modal
          transparent={true}
          animationType="slide"
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalBackground}>
            <View style={styles.modalContainer}>
              <ScrollView style={styles.scrollView}>
                <FlatList
                  data={menuOptions}
                  keyExtractor={(item) => item.id}
                  renderItem={({ item }) => (
                    <TouchableOpacity
                      style={styles.menuItem}
                      onPress={item.onPress}
                    >
                      <Text style={styles.menuText}>{item.title}</Text>
                    </TouchableOpacity>
                  )}
                />
              </ScrollView>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.closeText}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </SafeAreaView>

      {/* Animated Car */}
      <Animated.View
        style={[
          styles.carIconContainer,
          { transform: [{ translateY: carTranslateY }] },
        ]}
      >
        <FontAwesome name="car" size={30} color="#000" />
      </Animated.View>

      {/* Fixed Bottom Card for Current Trip Details */}
      {currentTrip && (
        <View style={styles.fixedCurrentTripContainer}>
          <TouchableOpacity
            style={styles.requestTripButton}
            onPress={redirectNewDelivery}
          >
            <Text style={styles.requestTripText}>Request Trip</Text>
          </TouchableOpacity>
          <View style={styles.tripDetailsView}>
            <View style={styles.tripHeader}>
              <Text style={styles.currentTripText}>
                Current Trip: {currentTrip.trip_id}
              </Text>
              <TouchableOpacity
                style={styles.chatButton}
                onPress={() => navigation.navigate('CustomerChat')} // Navigate to CustomerChat.js
              >
                <FontAwesome name="comment" size={20} color="#000" />
              </TouchableOpacity>
            </View>
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
              Delivery: {currentTrip.deliveray_details}
            </Text>
            <Text style={styles.tripDetailsText}>
              Notes: {currentTrip.delivery_notes || "N/A"}
            </Text>
          </View>
        </View>
      )}
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
  fixedTopView: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1,
    backgroundColor: "#FFC000", // Golden yellow background
    paddingVertical: 20, // Increased vertical padding
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  profileContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  customerType: {
    fontSize: 16,
    fontWeight: "bold",
  },
  menuButton: {
    marginLeft: 15,
  },
  fixedCurrentTripContainer: {
    bottom: 0,
    width: "100%",
    height: 250, // Fixed height for the current trip details card
    backgroundColor: "#FFC000", // Golden yellow background
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
  tripHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
  },
  currentTripText: {
    fontWeight: "bold",
    fontSize: 18,
  },
  tripDetailsText: {
    fontSize: 14,
    color: "#595959",
  },
  carIconContainer: {
    position: "absolute",
    bottom: 270, // Adjust position above the current trip view
    left: "50%",
    transform: [{ translateX: -15 }],
  },
  requestTripButton: {
    backgroundColor: "#FFC000",
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginBottom: 10, // Space between button and trip details
    alignSelf: "center",
  },
  requestTripText: {
    fontWeight: "bold",
    color: "#000",
  },
  chatButton: {
    backgroundColor: "#FFC000", // Golden yellow background for chat button
    borderRadius: 5,
    padding: 5,
  },
  modalBackground: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContainer: {
    width: "90%",
    height: "80%",
    backgroundColor: "white",
    borderRadius: 10,
    padding: 20,
    elevation: 5,
  },
  scrollView: {
    width: "100%",
  },
  menuItem: {
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  menuText: {
    fontSize: 16,
  },
  closeButton: {
    alignItems: "center",
    padding: 10,
    backgroundColor: "#FFC000",
    borderRadius: 5,
    marginTop: 10,
  },
  closeText: {
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default Home;
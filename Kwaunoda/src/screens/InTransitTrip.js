import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  Alert,
  Modal,
  ActivityIndicator,
  TouchableOpacity,
  Animated,
  Image,
} from "react-native";
import { WebView } from "react-native-webview";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_URL, API_URL_UPLOADS } from "./config";
import TopView from "../components/TopView";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import LocationSender from "./LocationTracker";
import Icon from "react-native-vector-icons/FontAwesome";
import { FontAwesome } from "@expo/vector-icons";

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
  const animatedValue = new Animated.Value(1);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalContent, setModalContent] = useState(null);

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
      if (customerData[0].profilePic) {
        setPicture(
          `${API_URL_UPLOADS}/${customerData[0].profilePic.replace(/\\/g, "/")}`
        );
      } else {
        setPicture(null);
      }

      // Do something with customerData, e.g., update state or UI
    } catch (error) {
      console.error("Error fetching customer:", error);
      Alert.alert("Error", "An error occurred while fetching customer data.");
    }
  };

  // Flashing effect
  const startFlashing = () => {
    animatedValue.setValue(1);
    Animated.loop(
      Animated.sequence([
        Animated.timing(animatedValue, {
          toValue: 0.5,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(animatedValue, {
          toValue: 1,
          duration: 5000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  };

  // Start flashing when the component mounts
  React.useEffect(() => {
    startFlashing();
  }, []);

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
                <TouchableOpacity
                  style={styles.tripDetailsContainer}
                  onPress={() => {
                    setModalContent("tripDetails");
                    setModalVisible(true);
                  }}
                >
                  <View style={styles.tripStatusContainer}>
                    <Text style={styles.currentTripText}>
                      Current Trip: {currentTrip.trip_id}
                    </Text>
                    <Animated.Text
                      style={[styles.statusText, { opacity: animatedValue }]}
                    >
                      {currentTrip.status}
                    </Animated.Text>
                  </View>
    
                  <View style={styles.locationContainer}>
                    <Icon name="map-marker" size={15} color="red" />
                    <Text style={styles.tripDetailsText}>
                      {currentTrip.origin_location || "N/A"}
                    </Text>
                  </View>
                  <View style={styles.locationContainer}>
                    <Icon name="map-marker" size={15} color="green" />
                    <Text style={styles.tripDetailsText}>
                      {currentTrip.dest_location}
                    </Text>
                  </View>
    
                  <View style={styles.priceContainer}>
                    <Text
                      style={{ fontSize: 20, fontWeight: "700", color: "green" }}
                    >
                      {currentTrip.currency_symbol} {currentTrip.accepted_cost} {currentTrip.currency_code}
                    </Text>
                  </View>
                </TouchableOpacity>
    
                <View style={styles.horizontalRule} />
    
                <View style={styles.paymentContainer}>
                  <View style={styles.iconRow}>
                    <View style={styles.iconContainerProfile}>
                      <TouchableOpacity
                        onPress={() => {
                          setModalContent("profile");
                          setModalVisible(true);
                        }}
                      >
                        {profilePic ? (
                          <Image
                            source={{ uri: profilePic }}
                            style={styles.profileImageIntrans}
                          />
                        ) : (
                          <FontAwesome
                            name="user"
                            size={80}
                            color="gray"
                            style={styles.profileImageIntrans}
                          />
                        )}
                      </TouchableOpacity>
                    </View>
                    <View style={styles.iconContainer}>
                      <TouchableOpacity
                        onPress={() => {
                          setModalContent("package");
                          setModalVisible(true);
                        }}
                      >
                        <Icon name="cube" size={50} color="#ffc000" />
                      </TouchableOpacity>
                    </View>
                    <View style={styles.iconContainer}>
                      <TouchableOpacity
                        onPress={() => {
                          setModalContent("payment");
                          setModalVisible(true);
                        }}
                      >
                        <Icon name="money" size={50} color="green" />
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
    
                <View style={styles.buttonContainer}>
                  <TouchableOpacity
                    style={styles.endTripButton}
                    onPress={() => navigation.navigate("DriverEndTrip", { tripId })}
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
    
              <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
              >
                <View style={styles.modalContainer}>
                  <View style={styles.modalContent}>
                    {modalContent === "tripDetails" && (
                      <>
                        <Text style={styles.modalTitle}>Trip Details</Text>
                        <Text style={styles.tripDetailsText}>
                          Trip ID: {currentTrip.trip_id}
                        </Text>
                        <Text style={styles.tripDetailsText}>
                          Origin: {currentTrip.origin_location || "N/A"}
                        </Text>
                        <Text style={styles.tripDetailsText}>
                          Destination: {currentTrip.dest_location}
                        </Text>
                        <Text style={styles.tripDetailsText}>
                          Distance: {currentTrip.distance < 1
                            ? (currentTrip.distance * 1000).toFixed(0) + " m"
                            : currentTrip.distance + " Km"}
                        </Text>
                        <Text style={styles.tripDetailsText}>
                          Start Time: {currentTrip.request_start_datetime}
                        </Text>
                        <Text style={styles.tripDetailsText}>
                          Cost: {currentTrip.currency_symbol}
                          {currentTrip.accepted_cost} {currentTrip.currency_code}
                        </Text>
                      </>
                    )}
    
                    {modalContent === "profile" && (
                      <>
                        <Text style={styles.modalTitle}>Customer Details</Text>
                        <View style={styles.profileContainer}>
                          <Image
                            source={{ uri: profilePic }}
                            style={[styles.profileImage, { marginTop: 1 }]}
                          />
                          <View style={styles.nameContainer}>
                            {customer && renderStars(customer.rating)}
                            <Text style={styles.tripDetailsText}>
                              {customer
                                ? `${customer.name} ${customer.surname}`
                                : "Loading customer..."}
                            </Text>
                            <Text style={styles.tripDetailsText}>
                              {customer
                                ? `${customer.phone} / ${customer.email}`
                                : "Loading customer..."}
                            </Text>
                          </View>
                        </View>
                      </>
                    )}
    
                    {modalContent === "package" && (
                      <>
                        <Text style={styles.modalTitle}>Package Details</Text>
                        <View style={styles.locationContainer}>
                          <Icon name="cube" size={30} color="#ffc000" />
                          <Text style={styles.tripDetailsText}>
                            {currentTrip.deliveray_details || "N/A"}
                          </Text>
                        </View>
                        <View style={styles.locationContainer}>
                          <Icon name="map-marker" size={30} color="red" />
                          <Text style={styles.tripDetailsText}>
                            {currentTrip.origin_location || "N/A"}
                          </Text>
                        </View>
                        <View style={styles.locationContainer}>
                          <Icon name="map-marker" size={30} color="green" />
                          <Text style={styles.tripDetailsText}>
                            {currentTrip.dest_location || "N/A"}
                          </Text>
                        </View>
                      </>
                    )}
    
                    {modalContent === "payment" && (
                      <>
                        <Text style={styles.modalTitle}>Payment Details</Text>
                        <View style={styles.locationContainer}>
                          <Icon name="money" size={30} color="green" />
                          <Text style={styles.tripDetailsText}>
                            {currentTrip.currency_symbol}
                            {currentTrip.accepted_cost} {currentTrip.currency_code} {currentTrip.payment_type}
                          </Text>
                        </View>
                        <View style={styles.locationContainer}>
                          <Icon name="money" size={30} color="green" />
                          <Text style={styles.tripDetailsText}>
                            {currentTrip.paying_when}
                          </Text>
                        </View>
                      </>
                    )}
    
                    <TouchableOpacity
                      style={styles.closeButton}
                      onPress={() => setModalVisible(false)}
                    >
                      <Text style={styles.closeButtonText}>Close</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </Modal>
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
  tripStatusContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    // marginBottom: 3,
  },
  priceContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    textAlign: "right", // Aligns content to the right
    marginTop: 1, // Optional: Add some margin for spacing
  },
  nameContainer: {
    flexDirection: "column",
    justifyContent: "center",
    marginLeft: 5,
    marginBottom: 10,
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
    fontSize: 18,
    color: "gold",
  },
  fixedCurrentTripContainer: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    height: 408,
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    elevation: 5,
    paddingBottom: 5,
    marginBottom: 60,
  },
  tripCard: {
    marginVertical: 5,
    padding: 20,
    paddingHorizontal: 30,
    borderRadius: 5,
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    width: "110%",
    maxHeight: 425,
    paddingBottom: 20,
    marginBottom: 1,
    marginLeft: -30, // Adjust this value as needed
    marginRight: -40, // Adjust this value as needed
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
    width: 70,
    height: 70,
    borderRadius: 35,
    marginLeft: 3,
    marginRight: 5,
    marginBottom: 8,
  },
  profileImageIntrans: {
    width: 130,
    height: 123,
    borderRadius: 15,
    paddingLeft: 30,
    paddingTop: 10,
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
    borderRadius: 15,
    paddingVertical: 9,
    paddingHorizontal: 12,
    marginRight: 5,
  },
  endTripText: {
    fontWeight: "bold",
    color: "#FFFFFF",
    fontSize: 14,
  },
  chatButton: {
    backgroundColor: "#007BFF",
    borderRadius: 15,
    paddingVertical: 9,
    paddingHorizontal: 12,
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
    backgroundColor: "#ccc",
    marginVertical: 10,
    width: "100%",
  },
  paymentContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-evenly",
  },
  divider: {
    width: 1,
    height: 5,
    backgroundColor: "#ccc",
    marginHorizontal: 10,
  },
  iconRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-evenly", // Space items evenly
    marginVertical: 1, // Add some vertical spacing
  },
  iconContainer: {
    borderColor: "#D3D3D3", // Light grey background
    padding: 40,
    borderRadius: 10,
    borderWidth: 1,
    alignItems: "center",
    margin: 15, // Center the icon
  },
  iconContainerProfile: {
    borderColor: "#D3D3D3", // Light grey background
    padding: 5,
    borderRadius: 10,
    borderWidth: 1,
    alignItems: "center",
    margin: 15, // Center the icon
  },
  icon: {
    width: 30,
    height: 30,
  },
  locationContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 1, // Add some vertical spacing
  },

  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: "80%",
    padding: 20,
    backgroundColor: "white",
    borderRadius: 10,
    alignItems: "left",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  modalText: {
    fontSize: 16,
    marginVertical: 5,
  },
  closeButton: {
    marginTop: 20,
    padding: 10,
    backgroundColor: "#007BFF",
    borderRadius: 5,
    alignItems: "center",
  },
  closeButtonText: {
    color: "white",
    fontWeight: "bold",
  },
  buttonContainer: {
    flexDirection: "row",
    marginTop: 10,
  },
});

export default InTransitTrip;

import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Text,
  ActivityIndicator,
  ScrollView,
  Alert,
  RefreshControl,
  Modal,
  TextInput,
  BackHandler,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_URL } from "./config";
import axios from "axios";
import { useNavigation, useRoute } from "@react-navigation/native";
import TopView from "../components/TopView";
import Toast from "react-native-toast-message";
import { WebView } from "react-native-webview";
import { useFocusEffect } from "@react-navigation/native";

const DriverNewOrderList = () => {
  const url = "https://xgolifedash.softworkscapital.com/route?";
  const navigation = useNavigation();
  const route = useRoute();
  const { driverId } = route.params || {};
  const APILINK = API_URL;
  const [driver, setDriver] = useState(null);
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTrip, setSelectedTrip] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [counterOffer, setCounterOffer] = useState(null);
  const [showCounterOfferModal, setShowCounterOfferModal] = useState(false);
  const [selectedCurrency, setSelectedCurrency] = useState("USD");
  const webviewRef = useRef(null);
  const [webViewUrl, setWebViewUrl] = useState(
    "https://xgolifedash.softworkscapital.com/route?lat1=0&lng1=0&lat2=0&lng2=0"
  );
  const [balance, setBalance] = useState();

  useEffect(() => {
    const fetchData = async () => {
      const storedIds = await AsyncStorage.getItem("theIds");
      if (storedIds) {
        const parsedIds = JSON.parse(storedIds);
        setDriver(parsedIds.driver_id); // Set driver_id
        // console.log("honaiwo iffect iri", parsedIds.driver_id)
        // Fetch driver details and top-up history immediately
        await fetchDriverDetails(parsedIds.driver_id);
        await fetchTopUpHistory(parsedIds.driver_id); // Fetch top-up history immediately after setting driver
      } else {
        Alert.alert("Driver ID not found", "Please log in again.");
        setLoading(false);
      }
    };

    fetchData();

    const intervalId = setInterval(() => {
      fetchData();
      if (driver) {
        fetchTrips();
      }
    }, 3000);

    return () => clearInterval(intervalId);
  }, []); // Run only on mount

  useEffect(() => {
    const backAction = () => {
      Alert.alert(
        "Hold on!",
        "You can click the back button on the App Or Logout",
        [
          {
            text: "Cancel",
            onPress: () => null,
            style: "cancel",
          },
          { text: "OK", onPress: () => null },
        ]
      );
      return true; // Prevent default back action
    };

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );

    return () => backHandler.remove(); // Cleanup on unmount
  }, [driverId]); // Fetch top-up history when driverId is set

  useFocusEffect(
    useCallback(() => {
      const fetchUserIdAndCallLastActivity = async () => {
        const storedIds = await AsyncStorage.getItem("theIds");
        const parsedIds = JSON.parse(storedIds);
        if (parsedIds && parsedIds.customerId !== "0") {
          lastActivity(parsedIds.customerId);
        } else {
          lastActivity(parsedIds.driver_id);
        }
      };

      fetchUserIdAndCallLastActivity();
    }, [])
  );

  const lastActivity = async (id) => {
    console.log("user last acty newOrder logged", id);
    try {
      const response = await fetch(
        `${API_URL}/users/update_last_activity_date_time/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        const errorResponse = await response.json();
        console.error("Error Response:", errorResponse);
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log("last loggy:", result);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchDriverDetails = async (driverId) => {
    // console.log("fetch details ID", driverId);
    try {
      const response = await fetch(`${API_URL}/driver/${driverId}`);
      const result = await response.json();
      if (result && result.length > 0) {
        setDriver(result[0].driver_id);
        await fetchTrips();
      } else {
        Alert.alert("Error", "Driver details not found.");
        setLoading(false);
      }
    } catch (error) {
      Alert.alert("Error", "Failed to fetch driver details. Please try again.");
      setLoading(false);
    }
  };

  const fetchTopUpHistory = async (driverID) => {
    // console.log("Honai driver id yeduuuuuu:", driverID);

    // if (!driverID) {
    //   Alert.alert("Error", "Failed to fetch Top Up History.");
    //   return; // Early return if driverId is not set
    // }

    try {
      const resp = await fetch(`${APILINK}/topUp/userBalance/${driverID}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      // console.log("maziBalance eduuuu:", resp);
      const result = await resp.json();
      // console.log("Top Up History:", result);

      // Check if the response was successful and contains the balance
      if (result && result.success && result.data && result.data.length > 0) {
        const userWalletBalance = result.data[0].user_wallet_balance;
        // console.log("User Wallet Balance:", userWalletBalance);

        // Assuming you have a function or state to set the balance
        setBalance(userWalletBalance); // Call setBalance with the fetched balance
      } else {
        Alert.alert("Error", "Failed to fetch Top Up History.");
      }
    } catch (error) {
      console.log("Error fetching History:", error);
      Alert.alert("Error", "An error occurred while fetching History.");
    }
  };

  const handleAcceptTrip = async () => {
    // Check if driver and selectedTrip are defined
    if (!driver || !selectedTrip) {
      Alert.alert("Error", "Some values are missing.");
      return;
    }

    // Ensure selectedTrip.accepted_cost is valid before proceeding
    if (!selectedTrip.accepted_cost) {
      Alert.alert("Error", "Trip cost is not defined.");
      return;
    }

    // Calculate fee based on accepted cost
    const fee = 0.15 * selectedTrip.accepted_cost;
    // console.log("ziBalance iri", balance);

    // Check if balance is sufficient
    if (balance < fee || balance <= 0) {
      Alert.alert(
        "Error",
        `Your floating balance is too low. You need to top up to at least ${fee}`
      );
      return;
    }

    // Update balance after fee deduction
    const newBalance = balance - fee;

    // Prepare data for the API request
    const data = {
      commission: fee,
      description: `Trip ID: ${selectedTrip.trip_id} Commission\n${selectedTrip.detail}\nFrom: ${selectedTrip.origin_location}\nTo: ${selectedTrip.dest_location}`,
    };

    // console.log("Zvikuenda izvo", data);

    try {
      // Make the API call to process the trip commission
      const resp = await fetch(
        `${APILINK}/topUp/trip_commission_settlement/${1}/${driver}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        }
      );

      // Check if the response is OK
      if (!resp.ok) {
        const errorText = await resp.text(); // Get the text response for debugging
        Alert.alert("Error", "Failed to process top-up");
        return;
      }

      // Parse the JSON response
      const result = await resp.json();
      if (result) {
        setBalance(newBalance); // Update balance state
        await updateTripStatus(); // Call a function to update trip status
      } else {
        Alert.alert("Error", "Failed to process top-up.");
      }
    } catch (error) {
      console.error("Error processing top-up:", error);
      Alert.alert("Error", "An error occurred while processing top-up.");
    }
  };

  const updateTripStatus = async () => {
    const currentdate = new Date().toISOString();
    try {
      const response = await fetch(
        `${API_URL}/trip/updateStatusAndDriver/${selectedTrip.trip_id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            customerid: selectedTrip.customer,
            driver_id: driver,
            trip_id: selectedTrip.trip_id,
            date_time: currentdate,
            offer_value: selectedTrip.accepted_cost,
            counter_offer_value: counterOffer,
            currency: selectedCurrency,
            status: "InTransit",
          }),
        }
      );
      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.message || "Failed to accept trip.");
      }
      Toast.show({
        type: "success",
        text1: "Trip accepted successfully",
        text2: "Settlement Occurred",
        position: "middle",
        visibilityTime: 5000,
      });
      setSelectedTrip(null);
      fetchTrips();
      navigation.navigate("InTransitTrip", { OntripData: selectedTrip });
    } catch (error) {
      Alert.alert(
        "Error",
        error.message || "An error occurred while accepting the trip."
      );
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

    setWebViewUrl(
      `https://xgolifedash.softworkscapital.com/route?latA=${origin.latitude}&lngA=${origin.longitude}&latB=${destination.latitude}&lngB=${destination.longitude}`
    );
    setSelectedTrip(location);
  };

  const handleCounterOffer = async () => {
    const currentdate = new Date().toISOString();
    console.log("tavamukaunda");

    try {
      const response = await fetch(`${API_URL}/counter_offer/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          customerid: selectedTrip.customer,
          driver_id: driver,
          trip_id: selectedTrip.trip_id,
          date_time: currentdate,
          offer_value: selectedTrip.cost,
          counter_offer_value: counterOffer,
          currency: selectedCurrency,
          status: "Unseen",
        }),
      });

      const result = await response.json();

      console.log("counda offer", result);

      if (!response.ok) {
        throw new Error(result.message || "Failed to send counter offer.");
      }
      Alert.alert(
        "Success",
        result.message || "Counter offer sent successfully."
      );
      setShowCounterOfferModal(false);
      fetchTrips();
    } catch (error) {
      Alert.alert("Error", error.message || "An error occurred.");
    }
  };

  const fetchTrips = async () => {
    setRefreshing(true);

    try {
      // console.log("takutanga manje")
      const response = await fetch(
        `${API_URL}/trip/drivers/${driver}`
      );
      const data = await response.json();
      if (Array.isArray(data) && data.length > 0) {
        setLocations(
          data.map((trip) => ({
            trip_id: trip.trip_id,
            customer: trip.cust_id,
            origin_lat: parseFloat(trip.origin_location_lat),
            origin_long: parseFloat(trip.origin_location_long),
            destination_lat: parseFloat(trip.destination_lat),
            destination_long: parseFloat(trip.destination_long),
            detail: trip.deliveray_details,
            cost: trip.delivery_cost_proposed,
            accepted_cost: trip.accepted_cost,
            origin_location: trip.origin_location,
            dest_location: trip.dest_location,
            paying_when: trip.paying_when,
            payment_type: trip.payment_type,
            currency_code: trip.currency_code,
            currency_symbol: trip.currency_symbol,
          }))
        );
      }
    } catch (error) {
      // Alert.alert("Error", "Failed to fetch trips. Please try again.");
      console.log("E", driver);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  return (
    <View style={styles.container}>
      <TopView />
      <WebView
        ref={webviewRef}
        source={{ uri: webViewUrl }}
        style={styles.map}
        onHttpError={(syntheticEvent) => {
          const { nativeEvent } = syntheticEvent;
          alert("Unable to load the page.");
        }}
      />
      {/* <View> */}
      {selectedTrip ? (
        <>
          <View style={styles.transparentCard}>
            <View style={styles.transparentCardContent}>
              <Text style={styles.modernTitle}>Trip Details</Text>
              <Text style={styles.modernDetailText}>{selectedTrip.detail}</Text>
              <View style={styles.modernLocations}>
                <View style={styles.modernLocationLine}>
                  <View style={styles.modernLocationDot} />
                  <View style={styles.modernLocationConnector} />
                  <View
                    style={[
                      styles.modernLocationDot,
                      styles.modernDestinationDot,
                    ]}
                  />
                </View>

                <View style={styles.modernLocationDetails}>
                  <View style={styles.modernLocationItem}>
                    <Text style={styles.modernLocationLabel}>Origin</Text>
                    <Text style={styles.modernLocationValue}>
                      {selectedTrip.origin_location || "N/A"}
                    </Text>
                  </View>
                  <View style={styles.modernLocationItem}>
                    <Text style={styles.modernLocationLabel}>Destination</Text>
                    <Text style={styles.modernLocationValue}>
                      {selectedTrip.dest_location || "N/A"}
                    </Text>
                  </View>
                </View>
              </View>

              <Text style={styles.modernPaymentDetails}></Text>
              <Text style={styles.modernCostText}>
                {selectedTrip.currency_symbol} {selectedTrip.cost}{" "}
                {selectedTrip.currency_code} {selectedTrip.payment_type}
              </Text>
              <View style={styles.modernButtonContainer}>
                <TouchableOpacity
                  onPress={() => setShowCounterOfferModal(true)}
                  style={styles.modernCounterOfferButton}
                >
                  <Text style={styles.modernButtonText}>Counter Offer</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => setSelectedTrip(null)}
                  style={styles.modernCancelButton}
                >
                  <Text style={styles.modernButtonText}>Back</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={handleAcceptTrip}
                  style={styles.modernAcceptButton}
                >
                  <Text style={styles.modernButtonText}>Accept</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </>
      ) : (
        <>
          <View style={styles.card}>
            <View style={styles.selectTripContainer}>
              <Text style={styles.selectTripTitle}>Select Trip</Text>
            </View>
            <ScrollView
              style={styles.scrollView}
              refreshControl={
                <RefreshControl
                  refreshing={refreshing}
                  onRefresh={() => fetchTrips()}
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
                      <Text
                        style={[styles.listItemDetail, { fontWeight: "bold" }]}
                      >
                        Trip ID: {location.trip_id}
                      </Text>
                      {location.detail ? (
                        <Text style={styles.listItemDetail}>
                          {location.detail}
                        </Text>
                      ) : null}
                      <View style={styles.tripLocations}>
                        <View style={styles.locationLine}>
                          <View style={styles.locationDot} />
                          <View style={styles.locationConnector} />
                          <View
                            style={[styles.locationDot, styles.destinationDot]}
                          />
                        </View>

                        <View style={styles.locationDetails}>
                          <View style={styles.locationItem}>
                            <Text style={styles.locationLabel}>Origin</Text>
                            <Text style={styles.locationValue}>
                              {location.origin_location || "N/A"}
                            </Text>
                          </View>

                          <View style={styles.locationItem}>
                            <Text style={styles.locationLabel}>
                              Destination
                            </Text>
                            <Text style={styles.locationValue}>
                              {location.dest_location || "N/A"}
                            </Text>
                          </View>
                        </View>
                      </View>
                    </View>
                    <Text
                      style={[styles.listItemWeight, { fontWeight: "bold" }]}
                    >
                      ${location.cost}
                    </Text>
                  </TouchableOpacity>
                ))
              ) : (
                <Text style={styles.noTripsText}>No trips available</Text>
              )}
            </ScrollView>
          </View>
        </>
      )}
      {/* </View> */}

      {showCounterOfferModal && (
        <Modal
          transparent={true}
          animationType="slide"
          visible={showCounterOfferModal}
          onRequestClose={() => setShowCounterOfferModal(false)}
        >
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Offer Price</Text>
            <View style={styles.counterOfferContainer}>
              <TextInput
                style={styles.modalInput}
                placeholder="Enter amount"
                keyboardType="numeric"
                value={counterOffer}
                onChangeText={setCounterOffer}
              />
              <Picker
                selectedValue={selectedCurrency}
                style={styles.currencyPicker}
                onValueChange={(itemValue) => setSelectedCurrency(itemValue)}
              >
                <Picker.Item label="USD" value="USD" />
                <Picker.Item label="EUR" value="EUR" />
                <Picker.Item label="GBP" value="GBP" />
                <Picker.Item label="AUD" value="AUD" />
                {/* Add more currencies as needed */}
              </Picker>
            </View>
            <TouchableOpacity
              onPress={() => handleCounterOffer(selectedTrip)}
              style={styles.modalButton}
            >
              <Text style={styles.modalButtonText}>Send Counter Offer</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setShowCounterOfferModal(false)}
              style={styles.modalCloseButton}
            >
              <Text style={styles.modalCloseButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </Modal>
      )}
      {/* <Toast /> */}
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
  cardback: {
    backgroundColor: "#ffc000",
  },
  cardAccept: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    height: 298,
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    elevation: 5,
    marginBottom: 120,
    paddingBottom: 60,
  },
  tripCard: {
    marginVertical: 5,
    padding: 30,
    borderRadius: 5,
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    width: "110%",
    maxHeight: 425,
    paddingBottom: 20,
    marginBottom: 1,
    marginLeft: -30, // Adjust this value as needed
    marginRight: -40, // Adjust this value as needed
  },

  card: {
    padding: 20,
    backgroundColor: "#ffc000",
    borderRadius: 8,
    margin: 10,
    paddingBottom: 30,
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
    justifyContent: "flex-start", // Adjusted to space-between for better button arrangement
    marginTop: 10,
    marginBottom: 5,
  },
  cancelTripButton: {
    backgroundColor: "#FF5733",
    borderRadius: 15, // Smaller border radius
    paddingVertical: 6, // Reduced padding
    paddingHorizontal: 12, // Reduced padding
    marginRight: 5, // Slight margin for spacing
  },
  endTripButton: {
    backgroundColor: "#FFA500",
    borderRadius: 15, // Smaller border radius
    paddingVertical: 6, // Reduced padding
    paddingHorizontal: 12, // Reduced padding
    marginRight: 5, // Slight margin for spacing
  },
  chatButton: {
    backgroundColor: "#007BFF",
    borderRadius: 15, // Smaller border radius
    paddingVertical: 6, // Reduced padding
    paddingHorizontal: 12, // Reduced padding
    elevation: 2,
  },
  requestButtonRow: {
    flexDirection: "row",
    justifyContent: "center", // Center the buttons
    // marginBottom: 1,
  },

  buttonText: {
    fontSize: 14,
    color: "black",
  },

  acceptButtonText: {
    fontSize: 14,
    color: "black",
  },

  counterOfferButtonText: {
    fontSize: 14,
    fontweight: "500",
    color: "black",
  },
  selectTripContainer: {
    alignItems: "center",
    marginBottom: 10,
    backgroundColor: "rgba(255, 255, 255, 0.8)", // Background color
    padding: 2, // Padding for spacing
    borderRadius: 10, // Rounded corners
    shadowColor: "#000", // Shadow effect
    shadowOffset: {
      width: 0,
      height: 2,
    },

    // For Android shadow effect
  },
  selectTripTitle: {
    fontSize: 19, // Font size
    fontWeight: "bold",
    color: "black",
    marginTop: "-5px", // Title color
  },
  scrollView: {
    maxHeight: 200,
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    borderRadius: 10,
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
    fontSize: 14,
  },
  listItemWeight: {
    alignSelf: "center",
    fontSize: 16,
  },
  noTripsText: {
    textAlign: "center",
    padding: 10,
    color: "#888",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalInput: {
    flex: 1,
    padding: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    marginRight: 10,
    backgroundColor: "#fff",
  },
  currencyPicker: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    backgroundColor: "#fff",
    marginLeft: 10,
  },
  counterOfferContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: "80%",
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    marginBottom: 20,
    color: "#fff",
  },
  modalButton: {
    backgroundColor: "green",
    borderRadius: 5,
    padding: 10,
    width: "80%",
    alignItems: "center",
  },
  modalButtonText: {
    color: "white",
  },
  modalCloseButton: {
    marginTop: 10,
  },
  modalCloseButtonText: {
    color: "red",
  },
  //linedotelocation
  tripLocations: {
    flexDirection: "row",
    marginBottom: 5,
  },
  locationLine: {
    width: 20,
    alignItems: "center",
    marginRight: 10,
  },
  locationDot: {
    width: 16,
    height: 16,
    borderRadius: 10,
    backgroundColor: "#4CAF50",
  },
  destinationDot: {
    backgroundColor: "#F44336",
  },
  locationConnector: {
    width: 2,
    height: 40,
    backgroundColor: "#ddd",
    marginVertical: 5,
  },
  locationDetails: {
    flex: 1,
  },
  locationItem: {
    marginBottom: 20,
  },
  locationLabel: {
    fontSize: 12,
    color: "#888",
    marginBottom: 3,
  },
  locationValue: {
    fontSize: 14,
    color: "#333",
    fontWeight: "500",
  },
  transparentCard: {
    backgroundColor: "rgba(255, 255, 255, 0.8)", // Semi-transparent background
    borderRadius: 12,
    borderWidth: 15, // Set the border width
    borderColor: "#ffc000", // Border color
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
    margin: 10,
    marginRight: 20,
    position: "absolute",
    bottom: 0,
    width: "100%",
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    marginLeft: -0.5,
    marginRight: -40, // Adjust this value as needed
    overflow: "hidden", // Ensures the inner card's corners are hidden
  },
  transparentCardContent: {
    padding: 10,
  },
  modernTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  modernDetailText: {
    fontSize: 14,
    color: "#555",
    marginVertical: 5,
  },
  modernLocations: {
    flexDirection: "row",
    marginBottom: 5,
  },
  modernLocationLine: {
    width: 20,
    alignItems: "center",
    marginRight: 10,
  },
  modernLocationDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#4CAF50",
  },
  modernDestinationDot: {
    backgroundColor: "#F44336",
  },
  modernLocationConnector: {
    width: 2,
    height: 20,
    backgroundColor: "#ddd",
    marginVertical: 5,
  },
  modernLocationDetails: {
    flex: 1,
  },
  modernLocationItem: {
    marginBottom: 5,
  },
  modernLocationLabel: {
    fontSize: 12,
    color: "#888",
  },
  modernLocationValue: {
    fontSize: 14,
    color: "#333",
    fontWeight: "500",
  },
  modernPaymentDetails: {
    fontSize: 12,
    color: "#666",
    marginVertical: 5,
  },
  modernCostText: {
    fontSize: 18,
    fontWeight: "700",
    color: "green",
    marginVertical: 5,
  },
  modernButtonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  modernCounterOfferButton: {
    backgroundColor: "#FFA500",
    borderRadius: 10,
    paddingVertical: 8,
    paddingHorizontal: 10,
  },
  modernCancelButton: {
    backgroundColor: "#FF5733",
    borderRadius: 10,
    paddingVertical: 8,
    paddingHorizontal: 10,
  },
  modernAcceptButton: {
    backgroundColor: "#007BFF",
    borderRadius: 10,
    paddingVertical: 8,
    paddingHorizontal: 10,
  },
  modernButtonText: {
    color: "#fff",
    fontSize: 14,
    textAlign: "center",
  },
});

export default DriverNewOrderList;

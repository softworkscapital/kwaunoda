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
  Modal,
  TextInput,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_URL } from "./config";
import axios from "axios";
import { useNavigation, useRoute } from "@react-navigation/native";
import TopView from "../components/TopView";
import Toast from "react-native-toast-message";
import { WebView } from "react-native-webview";

const DriverNewOrderList = () => {
  const url = "https://kwaunoda.softworkscapital.com/map?";
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
    "https://kwaunoda.softworkscapital.com/map?lat1=0&lng1=0&lat2=0&lng2=0"
  );
  const [balance, setBalance] = useState();

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
      if (driverId) {
        fetchTrips(driverId);
      }
    }, 30000);

    return () => clearInterval(intervalId);
  }, [driverId]);

  const fetchDriverDetails = async (driverId) => {
    try {
      const response = await fetch(`${API_URL}/driver/${driverId}`);
      const result = await response.json();
      if (result && result.length > 0) {
        setDriver(result[0].driver_id);
        await fetchTopUpHistory(); // Fetch top-up history here
        await fetchTrips(driverId);
      } else {
        Alert.alert("Error", "Driver details not found.");
        setLoading(false);
      }
    } catch (error) {
      Alert.alert("Error", "Failed to fetch driver details. Please try again.");
      setLoading(false);
    }
  };

  const fetchTopUpHistory = async () => {
    if (!driverId) return; // Early return if driverId is not set

    try {
      const resp = await fetch(`${APILINK}/topUp/topup/${driverId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const result = await resp.json();
      console.log("Top Up History:", result);
      if (result && result.length > 0) {
        setBalance(result[0]?.balance || 0); // Ensure balance is set
      } else {
        Alert.alert("Error", "Failed to fetch Top Up History.");
      }
    } catch (error) {
      console.error("Error fetching History:", error);
      Alert.alert("Error", "An error occurred while fetching History.");
    }
  };

  const handleAcceptTrip = async () => {
    if (!driver || !selectedTrip) {
      Alert.alert("Error", "Some values are missing.");
      return;
    }

    // Ensure selectedTrip.accepted_cost is valid before proceeding
    if (!selectedTrip.accepted_cost) {
      Alert.alert("Error", "Trip cost is not defined.");
      return;
    }

    const currentDate = new Date();
    const formattedDate = `${currentDate.getFullYear()}-${String(
      currentDate.getMonth() + 1
    ).padStart(2, "0")}-${String(currentDate.getDate()).padStart(
      2,
      "0"
    )} ${String(currentDate.getHours()).padStart(2, "0")}:${String(
      currentDate.getMinutes()
    ).padStart(2, "0")}:${String(currentDate.getSeconds()).padStart(2, "0")}`;

    const fee = 0.15 * selectedTrip.accepted_cost; // Calculate fee based on accepted cost
    const newBalance = balance - fee; // Update balance after fee deduction

    const data = {
      currency: "USD",
      exchange_rate: 1.0,
      date: formattedDate,
      debit: fee,
      credit: 0,
      balance: newBalance,
      description: `${"Trip ID: "} ${
        selectedTrip.trip_id
      } ${" Commission "} ${"\n"} ${selectedTrip.detail} ${"\nFrom: "} ${
        selectedTrip.origin_location
      } ${"\nTo: "} ${selectedTrip.dest_location}`,
      client_profile_id: driver,
    };

    console.log("Zvikuenda izvo", data);

    try {
      const resp = await fetch(`${APILINK}/topUp/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

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
        position: "top",
        visibilityTime: 5000,
      });
      setSelectedTrip(null);
      fetchTrips(driver);
      navigation.navigate("InTransitTrip");
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
      `https://kwaunoda.softworkscapital.com/map?lat1=${origin.latitude}&lng1=${origin.longitude}&lat2=${destination.latitude}&lng2=${destination.longitude}`
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
      fetchTrips(driver);
    } catch (error) {
      Alert.alert("Error", error.message || "An error occurred.");
    }
  };

  const fetchTrips = async (driverId) => {
    setRefreshing(true);
    try {
      const response = await fetch(`${API_URL}/trip/driver/notify/`);
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
            currency: trip.currency_id,
          }))
        );
      }
    } catch (error) {
      Alert.alert("Error", "Failed to fetch trips. Please try again.");
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
      <View style={styles.card}>
        {selectedTrip ? (
          <>
            <Text style={styles.title}>Trip Details</Text>
            <Text style={{ paddingVertical: 7 }}>{selectedTrip.detail}</Text>
            <Text style={{ paddingVertical: 5 }}>
              From: {selectedTrip.origin_location}
            </Text>
            <Text style={{ paddingVertical: 5 }}>
              To: {selectedTrip.dest_location}
            </Text>
            <Text style={{ paddingVertical: 5 }}>
              {selectedTrip.paying_when}
            </Text>
            <Text style={{ paddingVertical: 5 }}>
              {selectedTrip.payment_type}
            </Text>
            <Text style={{ fontSize: 20, fontWeight: "700", color: "green" }}>
              ${selectedTrip.cost} {selectedTrip.currency}
            </Text>
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                onPress={() => setShowCounterOfferModal(true)}
                style={styles.endTripButton}
              >
                <Text style={styles.counterOfferButtonText}>Counter Offer</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setSelectedTrip(null)}
                style={styles.cancelTripButton}
              >
                <Text style={styles.buttonText}>Back</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleAcceptTrip}
                style={styles.chatButton}
              >
                <Text style={styles.acceptButtonText}>Accept</Text>
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
                      <Text style={styles.listItemDetail}>
                        To: {location.dest_location}
                      </Text>
                      <Text style={styles.listItemDetail}>
                        From: {location.origin_location}
                      </Text>
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
          </>
        )}
      </View>

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
});

export default DriverNewOrderList;

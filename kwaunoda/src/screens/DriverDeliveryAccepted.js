import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  Alert,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";
import BottomFooter2 from "./BottomFooter2";
import { API_URL } from "./config";
import AsyncStorage from "@react-native-async-storage/async-storage";

const DriverDeliveryAccepted = () => {
  const [tripDetails, setTripDetails] = useState();
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();
  const route = useRoute();
  const tripId = route.params?.trip_id;
  const name = route.params?.name; // Get trip ID from params
  console.log(tripId);

  useEffect(() => {
    const fetchTripDetails = async () => {
      if (!tripId) {
        console.error("No trip ID provided.");
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`${API_URL}/trip/${tripId}`);
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        setTripDetails(data[0]);
        console.log(data);
        console.log(tripDetails);
      } catch (error) {
        console.error("Error fetching trip details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTripDetails();
  }, [tripId]);

  const redirectHome = () => {
    navigation.goBack();
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  if (!tripDetails) {
    return (
      <View style={styles.container}>
        <Text>No trip details available.</Text>
      </View>
    );
  }

  // Destructure tripDetails
  const {
    status,
    delivery_notes: notes,
    deliveray_details, // Corrected spelling
    dest_location: destination,
    origin_location: origin,
    delivery_contact_details: contactDetails,
    weight,
    distance,
    delivery_cost_proposed: proposedCost,
    accepted_cost: acceptedCost,
    driver_comment,
    customer_comment,
    driver_stars,
    customer_stars,
    driver_id, // Added driver_id for use
  } = tripDetails;

  const handleFeedback = async () => {
    const User = await AsyncStorage.getItem("userDetails");
    const user = JSON.parse(User);
    const FeedbackData = {
      driver_id: user.id, // Adjust this as necessary
      status: "Arrived At Destination",
    };

    try {
      const response = await fetch(`${API_URL}/trip/driverComment/${tripId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(FeedbackData),
      });

      const result = await response.json();

      if (response.ok) {
        Alert.alert("Success", result.message);
        redirectHome();
      } else {
        Alert.alert("Error", result.message || "Failed to submit feedback.");
      }
    } catch (error) {
      console.error("Error posting feedback:", error);
      Alert.alert("Error", "An error occurred while submitting your feedback.");
    }
  };

  return (
    <View style={styles.container}>
      <View
        style={[
          styles.topBar,
          {
            paddingTop: 35,
            backgroundColor: "#FFC000",
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          },
        ]}
      >
        <TouchableOpacity style={styles.backArrow} onPress={redirectHome}>
          <MaterialIcons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <View style={styles.topBarContent}>
          <Text style={[styles.title, { color: "#000" }]}>{status}</Text>
        </View>
      </View>

      <ScrollView
        style={{
          backgroundColor: "white",
          paddingHorizontal: 15,
          paddingBottom: 10,
        }}
      >
        <View style={[styles.Scontainer, styles.bgWhite]}>
          <View style={styles.profileContainer}>
            <Image
              style={[
                styles.profilePicture,
                { alignSelf: "flex-start", marginRight: 10 },
              ]}
              source={require("../../assets/profile.jpeg")}
            />
            <View>
              <Text style={{ fontSize: 18, fontWeight: "bold" }}>
                {name} {/* Display driver ID */}
              </Text>
              {/* Fetch driver details using driver_id if needed */}
            </View>
          </View>

          <Text style={styles.statusText}>{status}</Text>
          <Text style={styles.detailTitle}>Delivery details</Text>
          <Text style={{ marginBottom: 2 }}>{deliveray_details}</Text>
          <Text style={styles.notesTitle}>Notes</Text>
          <Text style={{ marginBottom: 10 }}>{notes || "No notes"}</Text>
          <Text style={styles.destinationTitle}>Destination:</Text>
          <Text style={{ paddingBottom: 10 }}>{destination}</Text>

          <TouchableOpacity
            style={[
              styles.submitButton,
              styles.textWhite,
              { backgroundColor: "#FFC000", marginTop: 40, marginBottom: 10 },
            ]}
            onPress={handleFeedback} // Pass the function reference
          >
            <Text style={styles.submitButtonText}>Arrived at Destination</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <BottomFooter2 />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  Scontainer: {
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 30,
  },
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  backArrow: {
    padding: 8,
  },
  topBarContent: {
    flex: 1,
    alignItems: "center",
  },
  bgWhite: {
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 20,
    marginBottom: 20,
  },
  profileContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  profilePicture: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginRight: 16,
  },
  statusText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "green",
    marginBottom: 5,
  },
  detailTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 7,
  },
  notesTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 11,
    marginBottom: 7,
  },
  destinationTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  submitButton: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 4,
  },
  textWhite: {
    color: "#fff",
  },
  submitButtonText: {
    fontSize: 16,
    textAlign: "center",
  },
});

export default DriverDeliveryAccepted;

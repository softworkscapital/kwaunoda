import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import BottomFooter from "./BottomFooter2";
import { Picker } from "@react-native-picker/picker";
import Toast from "react-native-toast-message";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_URL } from "./config";

const Complaint = () => {
  const [complaint, setComplaint] = useState("");
  const [trip_id, setTrip_id] = useState();
  const [trips, setTrips] = useState([]);
  const [deliveryDetails, setDeliveryDetails] = useState("");
  const [loading, setLoading] = useState(false);
  const APILINK = API_URL;

  const navigation = useNavigation();

  const redirectHome = () => {
    navigation.navigate("HomeDriver");
  };

  useEffect(() => {
    const fetchTrips = async () => {
      const User = await AsyncStorage.getItem("userDetails");
      const user = JSON.parse(User);
      const customer_id = user.customerid;
      const driver_id = user.driver_id;

      try {
        const resp = await fetch(
          `${APILINK}/trip/MylastTwentyTripsById/${customer_id}/${driver_id}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        const result = await resp.json();
        if (result) {
          setTrips(result); // Store the trips
        } else {
          Alert.alert("Error", "Failed to fetch trips.");
        }
      } catch (error) {
        console.error("Error fetching trips:", error);
        Alert.alert("Error", "An error occurred while fetching trips.");
      }
    };

    fetchTrips();
  }, []);

  const handleTripSelect = async (tripId) => {
    setTrip_id(tripId);
    console.log("DeliveryDetails taiwana", tripId);
    try {
      const resp = await fetch(`${APILINK}/trip/${tripId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const result = await resp.json();
      if (result) {
        setDeliveryDetails(result[0].deliveray_details); // Store the delivery details
      } else {
        console.error("Error fetching delivery details");
      }
    } catch (error) {
      console.error("Error fetching delivery details:", error);
      Alert.alert("Error", "An error occurred while fetching delivery details.");
    }
  };

  const validateInput = () => {
    if (!trip_id || !deliveryDetails || !complaint.trim()) {
      Toast.show({
        text1: "Validation Error",
        text2: "Please fill all fields.",
        type: "error",
        position: "center",
        visibilityTime: 3000,
        autoHide: true,
      });
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!validateInput()) return; // Validate input before proceeding

    setLoading(true);
    const User = await AsyncStorage.getItem("userDetails");
    const user = JSON.parse(User);

    const complaintData = {
      complaint_id: "",
      customer_id: user.customerid,
      driver_id: user.driver_id,
      trip_id: trip_id,
      complaint: complaint,
      time_issued_complaint: new Date().toISOString(),
    };

    try {
      const response = await fetch(`${APILINK}/complaint/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(complaintData),
      });

      const result = await response.json();
      if (response.ok) {
        Alert.alert("Success", result.message);
        navigation.goBack();
      } else {
        Alert.alert("Error", result.message || "Failed to submit complaint.");
      }
    } catch (error) {
      console.error("Error posting complaint:", error);
      Alert.alert("Error", "An error occurred while submitting the complaint.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: "white" }}>
      <View style={[styles.topBar, styles.goldenYellow, { paddingTop: 35 }]}>
        <TouchableOpacity style={styles.backArrow} onPress={redirectHome}>
          <MaterialIcons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>

        <View style={styles.topBarContent}>
          <Text style={[styles.title, { color: "#000" }]}>File a Complaint</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={[styles.container, { marginVertical: 60 }]}>
        <View style={[styles.pickerContainer, { marginHorizontal: 20 }]}>
          <Picker
            style={[styles.picker, { fontSize: 14, color: "#666", height: 39 }]}
            onValueChange={(tripId) => handleTripSelect(tripId)}
          >
            <Picker.Item label="Pick Order" value="" />
            {trips.map((trip) => (
              <Picker.Item key={trip.trip_id} label={`Order no. ${trip.trip_id}`} value={trip.trip_id} />
            ))}
          </Picker>
        </View>

        <View style={[styles.container, styles.bgWhite]}>
          <View style={styles.formGroup}>
            <Text style={styles.label}>Delivery Details:</Text>
            <TextInput
              style={[styles.input, styles.textarea]}
              value={deliveryDetails}
              editable={false} // Make it read-only
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Complaint:</Text>
            <TextInput
              style={[styles.input, styles.textarea]}
              value={complaint}
              onChangeText={setComplaint}
              multiline
              numberOfLines={4}
              placeholder="Describe your complaint"
            />
          </View>
          <TouchableOpacity
            style={[styles.submitButton, styles.goldenYellow, styles.textWhite]}
            onPress={handleSubmit}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator size="small" color="black" />
            ) : (
              <Text style={styles.submitButtonText}>Submit Complaint</Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
      <Toast ref={(ref) => Toast.setRef(ref)} />
      <BottomFooter />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
  },
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  goldenYellow: {
    backgroundColor: "#FFC000",
  },
  backArrow: {
    padding: 8,
  },
  topBarContent: {
    flex: 1,
    alignItems: "center",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
  },
  bgWhite: {
    backgroundColor: "#fff",
  },
  formGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 4,
    padding: 10,
  },
  textarea: {
    textAlignVertical: "top",
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
    fontWeight: "bold",
    textAlign: "center",
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    marginBottom: 15,
    fontSize: 10,
  },
});

export default Complaint;
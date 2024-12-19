import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import BottomFooter2 from "./BottomFooter2";
import { Picker } from "@react-native-picker/picker";
import Toast from "react-native-toast-message";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_URL } from "./config";

const CustomerComplaint = () => {
  const [orderNumber, setOrderNumber] = useState("");
  const [complaint, setComplaint] = useState("");
  const [driver_id, setDriver_id] = useState();
  const [customer_id, setCustomer_id] = useState();
  const [deliveryDetails, setDeliveryDetails] = useState("");
  const [trip_id, setTrip_id] = useState();
  const [result, setResult] = useState();
  const [loading, setLoading] = useState(false);
  const APILINK = API_URL;
  const [tripId,setTripId] = useState();
  const [trips, setTrips] = useState([]);

  const navigation = useNavigation();

  const redirectHome = () => {
    navigation.navigate("Home");
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

  const handleTripSelect =  async(tripId) => {
    setTrip_id(tripId);
    console.log("DeliveryDetails taiwana",tripId);
    try {
     
      const resp = await fetch(
        `${APILINK}/trip/${tripId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const result = await resp.json();
      if (result) {

        setDeliveryDetails(result[0].deliveray_details); // Store the trips
        
      } else {console.error("Error fetching trips:", error);
        
      }
    } catch (error) {
      console.error("Error fetching trips:", error);
      Alert.alert("Error", "An error occurred while fetching trips.");
    

    }
  
  };

  const handleSubmit = async () => {
    if (!validateInput()) return;

    setLoading(true);
    console.log("hello");

    //###########################################

    const User = await AsyncStorage.getItem("userDetails");
    const user = JSON.parse(User);
    const APILINK = API_URL;

    const customer_id = user.customerid;
    const driver_id = user.driver_id;

    if (user.account_type == "customer") {
      const customer_id = user.customerid;
      const driver_id = "0";
      console.log("ndi customer");
    } else if (user.account_type == "driver") {
      const driver_id = user.driver_id;
      const customer_id = "0";
      console.log("ndi driver");
    }

    console.log("hello", customer_id, "fiuswefn", driver_id);
    console.log(user);

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
      console.log("Customer trips Complainable:", result);

      if (result.ok) {
        Alert.alert("Success", result.message);
        navigation.goBack();
      } else {
        Alert.alert(
          "Error",
          result.message || "Failed to submit complaintData."
        );
      }
    } catch (error) {
      console.error("Error postingcomplaintData:", error);
      Alert.alert("Error", "An error occurred while submitting complaintData.");
    }

    //##################### BEGIN NEW

    // const User = await AsyncStorage.getItem('userDetails');
    // const user = JSON.parse(User);

    console.log(user);
    const complaintData = {
      complaint_id: "",
      customer_id: user.customerid,
      driver_id: user.driver_id,
      trip_id: "3",
      complaint: complaint,
      time_issued_complaint: new Date().toISOString(),
    };
    //##########################################

    try {
      const response = await fetch(`${APILINK}/complaint/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(complaintData),
      });

      const result = await response.json();
      console.log("result", result);

      if (response.ok) {
        Alert.alert("Success", result.message);
        navigation.goBack();
      } else {
        Alert.alert(
          "Error",
          result.message || "Failed to submit complaintData."
        );
      }
    } catch (error) {
      console.error("Error postingcomplaintData:", error);
      Alert.alert("Error", "An error occurred while submitting complaintData.");
    }
  };

  //validation
  const validateInput = () => {
    if (!complaint) {
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


    if (complaint.trim() === "" || null) {
      Toast.show({
        text1: "Validation Error",
        text2: "Please State Your Complaint.",
        type: "error",
        position: "center",
        visibilityTime: 3000,
        autoHide: true,
      });
      return false;
    }

    return true;
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
          //  / selectedValue={tripId}
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
      <Toast />
      <BottomFooter2 />
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

export default CustomerComplaint;
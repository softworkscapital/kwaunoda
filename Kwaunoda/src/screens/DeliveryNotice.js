import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Image,
  Alert,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_URL } from "./config";

const DeliveryNotice = () => {
  const [tripDetails, setTripDetails] = useState(true);
  const [user, setUser] = useState({
    name: "King Godo",
    email: "king@gmail.com",
    phone: "123-456-7890",
    address: "Glenview 8",
    role: "Customer",
  });
  const navigation = useNavigation();

  const redirectHome = () => {
    navigation.navigate("HomeDriver");
  };

  const goBackHome = () => {
    navigation.goBack();
  };

  const APILINK = API_URL;
  const [from, setFrom] = useState();
  const [to, setTo] = useState();
  const [del, setDel] = useState();
  const [cost, setCost] = useState();
  const [results, setResults] = useState();
  const [status, setStatus] = useState();
  const [using, setUsing] = useState();
  const [symbol, setSymbol] = useState();
  const [notes, setNotes] = useState();

  const Accept = async () => {
    console.log(results);
    const data = await AsyncStorage.getItem("userDetails");
    const user = JSON.parse(data);
    const deliveryDataUpdate = {
      driver_id: user.driver_id, // Replace with actual driver ID
      cust_id: results.cust_id,
      request_start_datetime: results.request_start_datetime,
      order_start_datetime: new Date().toISOString(),
      order_end_datetime: "",
      status: "InTransit",
      deliveray_details: results.deliveray_details,
      delivery_notes: results.delivery_notes,
      weight: results.weight,
      delivery_contact_details: results.delivery_contact_details,
      dest_location: results.dest_location,
      origin_location: results.origin_location,
      origin_location_lat: results.origin_location_lat,
      origin_location_long: results.origin_location_long,
      destination_lat: results.destination_lat,
      destination_long: results.destination_long,
      distance: results.distance,
      delivery_cost_proposed: results.delivery_cost_proposed,
      accepted_cost: results.accepted_cost,
      payment_type: results.payment_type,
      currency_id: results.currency_id,
      currency_code: results.currency_code,
      customer_comment: results.customer_comment,
      driver_comment: results.driver_comment,
      driver_stars: results.driver_stars,
    };
    console.log(deliveryDataUpdate);

    try {
      const response = await fetch(`${APILINK}/trip/${results.trip_id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(deliveryDataUpdate),
      });

      const result = await response.json();
      console.log(result);

      if (response.ok) {
        Alert.alert("Success", result.message);
        navigation.goBack();
      } else {
        Alert.alert(
          "Error",
          result.message || "Failed to submit delivery details."
        );
      }
    } catch (error) {
      console.error("Error posting delivery data:", error);
      Alert.alert(
        "Error",
        "An error occurred while submitting your delivery details."
      );
    }
  };

  useEffect(() => {
    const fetchTripDetails = async () => {
      try {
        const tripData = await AsyncStorage.getItem("tripDetails");
        const parsedTripData = JSON.parse(tripData);
        if (parsedTripData === null) {
          setTripDetails(!tripDetails);
        }

        console.log(parsedTripData);
        setFrom(parsedTripData.origin_location);
        setTo(parsedTripData.dest_location);
        setDel(parsedTripData.deliveray_details);
        setCost(parsedTripData.delivery_cost_proposed);
        setStatus(parsedTripData.status);
        setUsing(parsedTripData.payment_type);
        setSymbol(parsedTripData.currency_id);
        setNotes(parsedTripData.delivery_notes);
        const id = parsedTripData.trip_id;
        console.log(id);

        const response = await fetch(`${APILINK}/trip/${id}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
        const result = await response.json();
        console.log(result);
        setResults(result[0]);
      } catch (error) {
        console.error("Error fetching trip details:", error);
      }
    };
    fetchTripDetails();
  }, []);

  if (!tripDetails) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View
        style={[styles.topBar, { backgroundColor: "#FFC000", paddingTop: 30 }]}
      >
        <TouchableOpacity style={styles.backArrow} onPress={redirectHome}>
          <MaterialIcons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <View style={styles.topBarContent}>
          <Text style={[styles.title, { color: "#000" }]}>{status}</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.profileContainer}>
          <Image
            style={[
              styles.profilePicture,
              { alignSelf: "flex-start", marginRight: 10 },
            ]}
            source={require("../../assets/profile.jpeg")}
          />
          <View style={{ marginLeft: 20 }}>
            <Text style={{ fontSize: 18, fontWeight: "bold" }}>Requesting</Text>
            <Text style={{ fontSize: 16, fontWeight: "800" }}>
              {symbol} {cost}{" "}
            </Text>
            <Text style={{ fontSize: 18, fontWeight: "faint" }}>
              Pay using {using}
            </Text>
          </View>
        </View>

        <View>
          <View style={{ marginTop: 15 }}>
            <Text style={{ fontSize: 18, fontWeight: "bold" }}>From: </Text>
            <Text style={styles.textArea1}>{from}</Text>
          </View>
          <View style={{ marginTop: 20 }}>
            <Text style={{ fontSize: 18, fontWeight: "bold" }}>To:</Text>
            <Text style={styles.textArea1}>{to}</Text>
          </View>

          <View style={{ marginTop: 15 }}>
            <Text style={{ fontSize: 18, fontWeight: "bold" }}>
              Delivery details
            </Text>
            <Text style={styles.textArea1}>{del}</Text>
          </View>

          <View style={{ marginTop: 18 }}>
            <Text style={{ fontSize: 18, fontWeight: "bold" }}>Notes</Text>
            <Text style={styles.textArea1}>{notes || "no notes"}</Text>
          </View>

          <Text style={styles.textArea}>{tripDetails.deliveryDetails}</Text>
        </View>

        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            marginTop: 30,
          }}
        >
          <TouchableOpacity style={[styles.btnSignUp, { marginTop: 5 }]}>
            <Text style={styles.txtSignUp} onPress={Accept}>
              Accept
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={goBackHome}
            style={[styles.btnSignUp, { marginTop: 5 }]}
          >
            <Text style={styles.txtSignUp}>Pass</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
      <View style={{ marginBottom: "4" }}></View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
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
  title: {
    fontSize: 18,
    fontWeight: "bold",
  },
  textArea: {
    width: "80%",
    height: 80,
    padding: 10,
    borderWidth: 0,
    borderColor: "#000",
    fontSize: 16,
    textAlignVertical: "top",
  },
  scrollContainer: {
    paddingHorizontal: 42,
    paddingVertical: 24,
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
  textArea1: {
    width: "80%",
    paddingTop: 10,
    borderWidth: 0,
    borderColor: "#000",
    fontSize: 16,
    fontWeight: "faint",
    textAlignVertical: "top",
    justifyContent: "space-around",
  },
  btnSignUp: {
    backgroundColor: "#FFC000",
    borderRadius: 50,
    padding: 14,
    width: "49%",
    alignItems: "center",
  },
});

export default DeliveryNotice;

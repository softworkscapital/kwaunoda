import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  ToastAndroid,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import { useNavigation } from "@react-navigation/native";
import { MaterialIcons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import {
  faLocationArrow,
  faUser,
  faPhone,
  faBagShopping,
  faScaleBalanced,
  faArrowCircleLeft,
  faArrowCircleRight,
} from "@fortawesome/free-solid-svg-icons";
import { API_URL } from "./config";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Toast from "react-native-toast-message";
import { Ionicons } from "@expo/vector-icons";

const NewDelivery = () => {
  const [name, setName] = useState("");
  const [surname, setSurname] = useState("");
  const [phone, setPhone] = useState("");
  const [deliverynotes, setDeliverynotes] = useState("");
  const [profilePic, setProfilePic] = useState(null);
  const [parcelDescription, setParcelDescription] = useState("");
  const [weight, setWeight] = useState("");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("Cash");
  const [price, setPrice] = useState("");
  const [balance, setBalance] = useState();
  const [contact, setContact] = useState("");
  const [code, setCode] = useState("");
  const [cid, setCid] = useState("");
  const [payingWhen, setPayingWhen] = useState("");
  const [duration, setDur] = useState("");
  const [distance, setDist] = useState("");
  const [startLocationLat, setStartLocationLat] = useState("");
  const [startLocationLong, setStartLocationLong] = useState("");
  const [endLocationLat, setEndLocationLat] = useState("");
  const [endLocationLong, setEndLocationLong] = useState("");
  const [lowerPriceLimit, setLowerPriceLimit] = useState(0);
  const [upperPriceLimit, setUpperPriceLimit] = useState(0);
  const [driversData, setDriversData] = useState([]);

  // New fields for preferences
  const [preferredGender, setPreferredGender] = useState("");
  const [preferredCarType, setPreferredCarType] = useState("");
  const [preferredAgeRange, setPreferredAgeRange] = useState("");
  const [numberOfPassengers, setNumberOfPassengers] = useState("");

  const navigation = useNavigation();

  const getDrivers = async () => {
    try {
      const response = await fetch(`${APILINK}/driver/`);
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
      const data = await response.json();
      const phoneNumbers = data.map((driver) => driver.phone);
      setDriversData(phoneNumbers);
    } catch (error) {
      console.log("Failed to fetch drivers:", error);
    }
  };

  const sendSmsBroadcast = async () => {
    if (driversData.length === 0) {
      console.log("No phone numbers available to send SMS.");
      return;
    }

    const message = `Hello XGO driver, a new delivery has been requested.\n
    Be the first to accept to accept this trip.\n
    Tell a Friend to download the XGO App at www.xgolife.com experience a life of convenience and begin to send packages seamlessly.`;

    try {
      const response = await fetch(
        "https://srv547457.hstgr.cloud:3003/smsendpoint",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            clientid: "1001",
            clientkey: "hdojFa502Uy6nG2",
            message,
            recipients: driversData,
            senderid: "REMS",
          }),
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Error sending SMS:", response.status, errorText);
        return false;
      }

      const result = await response.json();
      console.log("SMS sent successfully:", result);
      return true;
    } catch (error) {
      console.error("Network Error:", error);
      return false;
    }
  };

  const redirectHome = () => {
    navigation.goBack();
  };

  const fetchData = async () => {
    const storedIds = await AsyncStorage.getItem("theIds");
    const parsedIds = JSON.parse(storedIds);
    setCid(parsedIds.customerId);
    let me = parsedIds.customerId;
    try {
      const resp = await fetch(`${APILINK}/topUp/topup/${me}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const result = await resp.json();
      if (result) {
        setBalance(result[0].balance);
      } else {
        Alert.alert("Error", "Failed to fetch History.");
      }
    } catch (error) {
      Alert.alert("Error", "An error occurred while fetching History.");
    }
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setProfilePic(result.assets[0].uri);
    }
  };

  const APILINK = API_URL;

  useEffect(() => {
    const fetchDeliveries = async () => {
      try {
        const lastTripData = await AsyncStorage.getItem("deliveries");
        const deliveries = lastTripData ? JSON.parse(lastTripData) : [];

        if (deliveries.length > 0) {
          const lastDelivery = deliveries[deliveries.length - 1];
          setFrom(lastDelivery.startingLocation || "");
          setTo(lastDelivery.destinationLocation || "");
          setDur(lastDelivery.duration || "");
          setDist(lastDelivery.distance || "");
          setStartLocationLat(parseFloat(lastDelivery.origin.latitude || ""));
          setStartLocationLong(parseFloat(lastDelivery.origin.longitude || ""));
          setEndLocationLat(parseFloat(lastDelivery.dest.latitude || ""));
          setEndLocationLong(parseFloat(lastDelivery.dest.longitude || ""));
          fetchTarrif(lastDelivery.distance);
        } else {
          console.warn("No deliveries found");
        }
      } catch (error) {
        console.error("Error fetching deliveries:", error);
      }
    };

    fetchDeliveries();
    fetchData();
    getDrivers();
  }, []);

  const validateFields = () => {
    if (!from || !to || !contact || !price || !payingWhen || !code) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Please fill in all required fields.",
      });
      return false;
    }
    return true;
  };

  const fetchTarrif = async (distance) => {
    const catergory = "standard";

    try {
      const resp = await fetch(
        `${APILINK}/tarrifs/trip_tarrif_rate/${distance}/${catergory}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const result = await resp.json();
      if (result && result.lower_price_limit !== undefined) {
        setLowerPriceLimit(result.lower_price_limit);
        setUpperPriceLimit(result.upper_price_limit);
        setPrice(String(result.lower_price_limit));
      }
    } catch (error) {
      console.error("Error fetching Tarrifs:", error);
      Alert.alert("Error", "An error occurred while fetching Tarrifs.");
    }
  };

  const validatePrice = () => {
    const numericPrice = Number(price);
    if (numericPrice < lowerPriceLimit) {
      ToastAndroid.show("Price too low", ToastAndroid.SHORT);
      return false;
    } else if (numericPrice > upperPriceLimit) {
      ToastAndroid.show("Price too high", ToastAndroid.SHORT);
      return false;
    }
    return true;
  };

  const handlePriceChange = (newPrice) => {
    validatePrice();
    setPrice(newPrice);
  };

  const handleSignUp = async () => {
    if (!validatePrice()) return;
    if (!validateFields()) return;

    try {
      const deliveryData = {
        driver_id: "",
        cust_id: cid,
        request_start_datetime: new Date().toISOString(),
        order_start_datetime: new Date().toISOString(),
        order_end_datetime: "",
        status: "New Order",
        delivery_details: parcelDescription,
        delivery_notes: deliverynotes,
        weight: weight || "",
        delivery_contact_details: contact,
        dest_location: to,
        origin_location: from,
        origin_location_lat: parseFloat(startLocationLat),
        origin_location_long: parseFloat(startLocationLong),
        destination_lat: parseFloat(endLocationLat),
        destination_long: parseFloat(endLocationLong),
        distance: distance,
        delivery_cost_proposed: price,
        accepted_cost: price,
        paying_when: payingWhen,
        payment_type: paymentMethod,
        currency_id: code,
        // Include optional fields
        preferred_gender: preferredGender,
        preferred_car_type: preferredCarType,
        preferred_age_range: preferredAgeRange,
        number_of_passengers: numberOfPassengers,
      };

      const response = await fetch(`${APILINK}/trip/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(deliveryData),
      });

      const result = await response.json();

      if (response.ok) {
        const send = await sendSmsBroadcast();
        if (send) {
          Toast.show({
            type: "success",
            text1: "Trip Created Successfully",
            text2: result.message,
          });
          navigation.navigate("Home");
        }
      } else {
        Toast.show({
          type: "error",
          text1: "Error",
          text2: result.message || "Failed to submit delivery details.",
        });
      }
    } catch (error) {
      console.error("Error posting delivery data:", error);
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "An error occurred while submitting your delivery details.",
      });
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View
        style={[styles.topBar, { backgroundColor: "#FFC000", paddingTop: 30 }]}
      >
        <TouchableOpacity style={styles.backArrow} onPress={redirectHome}>
          <MaterialIcons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>

        <View style={styles.topBarContent}>
          <Text style={[styles.title, { color: "#000" }]}>New Ride</Text>
        </View>
      </View>

      <ScrollView>
        <View style={styles.formContainer}>
          <View
            style={[
              styles.inputContainer,
              { backgroundColor: "#ECECEC", borderColor: "transparent" },
            ]}
          >
            <FontAwesomeIcon
              icon={faArrowCircleLeft}
              size={12}
              style={styles.icon}
            />
            <TextInput
              style={[styles.input, { fontWeight: "600" }]}
              value={from}
              editable={false}
            />
          </View>

          <View
            style={[
              styles.inputContainer,
              { backgroundColor: "#ECECEC", borderColor: "transparent" },
            ]}
          >
            <FontAwesomeIcon
              icon={faArrowCircleRight}
              size={12}
              style={styles.icon}
            />
            <TextInput
              style={[styles.input, { fontWeight: "600" }]}
              value={to}
              editable={false}
            />
          </View>

          <View
            style={[
              styles.inputContainer,
              { backgroundColor: "#ECECEC", borderColor: "transparent" },
            ]}
          >
            <FontAwesomeIcon
              icon={faArrowCircleRight}
              size={12}
              style={styles.icon}
            />
            <TextInput
              style={[styles.input, { fontWeight: "600" }]}
              value={duration}
              editable={false}
            />
          </View>

          <View
            style={[
              styles.inputContainer,
              { backgroundColor: "#ECECEC", borderColor: "transparent" },
            ]}
          >
            <FontAwesomeIcon
              icon={faArrowCircleRight}
              size={12}
              style={styles.icon}
            />
            <TextInput
              style={[styles.input, { fontWeight: "600" }]}
              value={distance}
              editable={false}
            />
          </View>

          <View style={styles.inputContainer}>
            <FontAwesomeIcon icon={faPhone} size={12} style={styles.icon} />
            <TextInput
              style={styles.input}
              placeholder="Contact Person (263777000000)"
              value={contact}
              onChangeText={setContact}
              keyboardType="numeric"
            />
          </View>

          {/* <View style={styles.inputContainer}>
            <FontAwesomeIcon
              icon={faBagShopping}
              size={12}
              style={styles.icon}
            />
            <TextInput
              style={styles.input}
              placeholder="Parcel Description"
              value={parcelDescription}
              onChangeText={setParcelDescription}
            />
          </View> */}
{/* 
          <View style={styles.inputContainer}>
            <FontAwesomeIcon
              icon={faScaleBalanced}
              size={12}
              style={styles.icon}
            />
            <TextInput
              style={styles.input}
              placeholder="Weight (kg)"
              value={weight}
              onChangeText={setWeight}
              keyboardType="numeric"
            />
          </View> */}

          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={paymentMethod}
              style={[styles.picker, { fontSize: 10, color: "#666" }]}
              onValueChange={(itemValue) => setPaymentMethod(itemValue)}
            >
              <Picker.Item label="Paying With" value="" />
              <Picker.Item label="Paying With Cash" value="Cash" />
              <Picker.Item label="Paying With Bank" value="Bank" />
              <Picker.Item label="Paying With Zipit" value="Zipit" />
              <Picker.Item label="Paying With Ecocash" value="Ecocash" />
              <Picker.Item label="Paying With Innbuks" value="Innbuks" />
            </Picker>
          </View>

          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={payingWhen}
              style={[styles.picker, { fontSize: 10, color: "#666" }]}
              onValueChange={(itemValue) => setPayingWhen(itemValue)}
            >
              <Picker.Item label="Paying When" value="" />
              <Picker.Item label="Paying Before Trip" value="Paying Before Trip" />
              <Picker.Item label="Paying After Trip" value="Paying After Trip" />
            </Picker>
          </View>

          <View style={{ flexDirection: "row" }}>
            <View style={[styles.inputContainer, { width: "55%" }]}>
              <TextInput
                style={styles.input}
                placeholder="Proposed Price"
                value={price}
                onChangeText={handlePriceChange}
                keyboardType="numeric"
              />

              <TouchableOpacity
                onPress={() => setPrice((prev) => String(Number(prev) + 1))}
                disabled={Number(price) >= upperPriceLimit}
              >
                <Ionicons
                  name="add-circle"
                  size={30}
                  color={Number(price) >= upperPriceLimit ? "grey" : "green"}
                />
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => setPrice((prev) => String(Number(prev) - 1))}
                disabled={Number(price) <= lowerPriceLimit}
              >
                <Ionicons
                  name="remove-circle"
                  size={30}
                  color={Number(price) <= lowerPriceLimit ? "grey" : "red"}
                />
              </TouchableOpacity>
            </View>

            <View
              style={[styles.pickerContainer, { width: "45%", marginLeft: 2 }]}
            >
              <Picker
                selectedValue={code}
                style={[{ fontSize: 8, color: "#666" }]}
                onValueChange={(itemValue) => setCode(itemValue)}
              >
                <Picker.Item label="Currency" value="" />
                <Picker.Item label="USD" value="USD" />
                <Picker.Item label="ZIG" value="ZIG" />
                <Picker.Item label="RAND" value="ZAR" />
                <Picker.Item label="PULA" value="BWP" />
              </Picker>
            </View>
          </View>

          {/* New Trip Preferences Section */}
          <Text style={{ fontWeight: "bold", marginVertical: 10 }}>Trip Preferences (Optional)</Text>

          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={preferredGender}
              style={[styles.picker, { fontSize: 10, color: "#666" }]}
              onValueChange={(itemValue) => setPreferredGender(itemValue)}
            >
              <Picker.Item label="Preferred Gender" value="Any" />
              <Picker.Item label="Any" value="Any" />
              <Picker.Item label="Male" value="Male" />
              <Picker.Item label="Female" value="Female" />
              <Picker.Item label="Other" value="Other" />
            </Picker>
          </View>

          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={preferredCarType}
              style={[styles.picker, { fontSize: 10, color: "#666" }]}
              onValueChange={(itemValue) => setPreferredCarType(itemValue)}
            >
              <Picker.Item label="Preferred Car Type" value="Any" />
              <Picker.Item label="Any" value="Any" />
              <Picker.Item label="Sedan" value="Sedan" />
              <Picker.Item label="SUV" value="SUV" />
              <Picker.Item label="Truck" value="Truck" />
              <Picker.Item label="Van" value="Van" />
            </Picker>
          </View>

          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={preferredAgeRange}
              style={[styles.picker, { fontSize: 10, color: "#666" }]}
              onValueChange={(itemValue) => setPreferredAgeRange(itemValue)}
            >
              <Picker.Item label="Preferred Age Range" value="Any" />
              <Picker.Item label="Any" value="Any" />
              <Picker.Item label="18-25" value="18-25" />
              <Picker.Item label="26-35" value="26-35" />
              <Picker.Item label="36-45" value="36-45" />
              <Picker.Item label="46+" value="46+" />
            </Picker>
          </View>

          <View style={styles.inputContainer}>
            <FontAwesomeIcon icon={faUser} size={12} style={styles.icon} />
            <TextInput
              style={styles.input}
              placeholder="Number of Passengers"
              value={numberOfPassengers}
              onChangeText={setNumberOfPassengers}
              keyboardType="numeric"
            />
          </View>
          <TouchableOpacity
            style={styles.btnSignUp}
            onPress={handleSignUp}
          >
            <Text style={styles.txtSignUp}>OK</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
      <Toast />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    marginBottom: 20,
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
  formContainer: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    padding: 5,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    marginBottom: 15,
    backgroundColor: "rgba(255, 255, 255, 0.8)",
  },
  icon: {
    marginRight: 15,
    marginLeft: 10,
  },
  input: {
    flex: 1,
    color: "#000",
  },
  btnSignUp: {
    backgroundColor: "#FFC000",
    borderRadius: 50,
    padding: 14,
    width: "100%",
    alignItems: "center",
    marginTop: 20,
  },
  txtSignUp: {
    color: "black",
    fontSize: 13,
    fontWeight: "bold",
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    marginBottom: 15,
  },
});

export default NewDelivery;
import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  SafeAreaView,
  ScrollView,
  ToastAndroid,
  Modal,
  ActivityIndicator,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import { useNavigation } from "@react-navigation/native";
import * as ImagePicker from "expo-image-picker";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import Toast from "react-native-toast-message";
import {
  faLocationArrow,
  faUser,
  faPhone,
  faIdCard,
  faMapMarkerAlt,
  faBagShopping,
  faScaleBalanced,
  faArrowCircleLeft,
  faArrowCircleRight,
} from "@fortawesome/free-solid-svg-icons";
import { API_URL } from "./config";
import AsyncStorage from "@react-native-async-storage/async-storage";
//
import { MaterialIcons } from "@expo/vector-icons";
import { Ionicons } from "@expo/vector-icons";

const CustomerNewDelivery = () => {
  const [loading, setLoading] = useState(false);
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

  const navigation = useNavigation();
  const [driversData, setDriversData] = useState([]);

  const getDrivers = async () => {
    try {
      const response = await fetch(`${APILINK}/driver/`);
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
      const data = await response.json();
      console.log(data);

      // Extract the phone numbers into an array
      const phoneNumbers = data.map((driver) => driver.phone);
      console.log("Phone Numbers:", phoneNumbers);

      // Store the array of phone numbers in state
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
    Be the first to get this tender while it lasts.\n
    Tell a Friend to download the XGO App at www.xgolife.com to experience a life of convenience and begin to receive packages seamlessly.`;

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
            recipients: driversData, // Directly use the array
            senderid: "REMS",
          }),
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Error sending SMS:", response.status, errorText);
        // Toast.error("Failed to send SMS.");
        return false;
      }

      const result = await response.json(); // Log the result if needed
      console.log("SMS sent successfully:", result);
      // Toast.success("Message sent successfully!");
      return true;
    } catch (error) {
      console.error("Network Error:", error);
      // Toast.error("Could not send SMS to Drivers. Please check your connection.");
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
          // console.log("The deliiiii:", lastDelivery);
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
    if (
      !from ||
      !to ||
      !contact ||
      !price ||
      !payingWhen ||
      !code ||
      !weight ||
      !parcelDescription
    ) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Please fill in all required fields.",
      });
      return false;
    }
    return true;
  };

  const checkBalance = (price) => {
    const priceValue = parseFloat(price);
    if (priceValue > balance) {
      Toast.show({
        type: "error",
        text1: "Insufficient Balance",
        text2: `Your balance is insufficient. Available balance: $${balance}. Required: $${priceValue}.`,
      });
      return false; // Not enough balance
    }
    return true; // Sufficient balance
  };

  const fetchTarrif = async (distance) => {
    const catergory = "standard";
    // console.log("our Dist", distance);

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
      // console.log("Tarrif 2 iri", result);

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

  const sendSmsToClient = async (data) => {
    // console.log("sms", data);

    const message = `Hi ${contact}, a package is being delivered to you.\n
    It consists of ${data.deliveray_details}.\n
    Please give the delivery person the following code after confirming your package: ${data.delivery_received_confirmation_code}.\n
    Download the XGO App at www.xgolife.com to experience a life of convenience and begin to receive packages seamlessly.`;

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
            recipients: [`${contact}`],
            senderid: "REMS",
          }),
        }
      );

      return true; // Assuming the OTP was sent successfully
    } catch (error) {
      console.error("Network Error:", error);
      showToast("Error", "Could not send sms. Please check your connection.");
      return false;
    }
  };

  const generateRandomFiveDigitNumber = () => {
    return Math.floor(10000 + Math.random() * 90000);
  };

  const handleSignUp = async () => {
    setLoading(true);
    if (!validatePrice()) return;
    if (!validateFields()) return;

    // Check balance before proceeding
    if (!checkBalance(price)) return;

    try {
      // Usage
      const randomNumber = generateRandomFiveDigitNumber();
      console.log(randomNumber);

      const deliveryData = {
        driver_id: "",
        cust_id: cid,
        request_start_datetime: new Date().toISOString(),
        order_start_datetime: new Date().toISOString(),
        order_end_datetime: "",
        status: "New Order",
        deliveray_details:
          "Package : " +
          parcelDescription +
          " est. " +
          weight +
          " KGS" +
          " " +
          deliverynotes,
        delivery_notes: deliverynotes || null,
        weight: weight || null,
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
        currency_id: "1",
        currency_code: code,
        customer_comment: "",
        driver_comment: "",
        driver_stars: "0",
        customer_status: "Ended",
        delivery_received_confirmation_code: randomNumber,
      };

      console.log("derivary yedu iyi:", deliveryData);

      const response = await fetch(`${APILINK}/trip/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(deliveryData),
      });

      const result = await response.json();

      if (response.ok) {
        const send = await sendSmsToClient(deliveryData);
        const sendDrivers = await sendSmsBroadcast();

        if (!send || !sendDrivers) return;
        Toast.show({
          type: "success",
          text1: "Trip Created Successfully",
          text2: result.message,
          position: "center",
          visibilityTime: 5000,
        });
        setTimeout(() => {
          setLoading(false);
          navigation.navigate("Home"); // Redirect after the operation
        }, 2000);
      } else {
        Toast.show({
          type: "error",
          text1: "Error",
          text2: result.message || "Failed to submit delivery details.",
          position: "center",
          visibilityTime: 5000,
        });
      }
    } catch (error) {
      console.error("Error posting delivery data:", error);
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "An error occurred while submitting your delivery details.",
        position: "center",
        visibilityTime: 5000,
      });
    } finally {
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
          <Text style={[styles.title, { color: "#000" }]}>New Delivery</Text>
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
              placeholder="Delivery Contact (263123456789)"
              value={contact}
              onChangeText={setContact}
            />
          </View>

          <View style={styles.inputContainer}>
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
          </View>

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
          </View>

          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={payingWhen}
              style={[styles.picker, { fontSize: 10, color: "#666" }]}
              onValueChange={(itemValue) => setPayingWhen(itemValue)}
            >
              <Picker.Item label="Paying When" value="" />
              <Picker.Item
                label="Paying Before Delivery"
                value="Paying Before Delivery"
              />
              <Picker.Item
                label="Paying After Delivery"
                value="Paying After Delivery"
              />
            </Picker>
          </View>

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

          <View style={{ flexDirection: "row" }}>
            <View style={[styles.inputContainer, { width: "55%" }]}>
              <TextInput
                style={styles.input}
                placeholder="Proposed Price"
                value={price}
                onChangeText={handlePriceChange}
                keyboardType="numeric"
              />

              {/* Plus Icon */}
              <TouchableOpacity
                onPress={() => setPrice((prev) => String(Number(prev) + 1))}
                disabled={Number(price) >= upperPriceLimit} // Disable if price is greater than or equal to upperPriceLimit
              >
                <Ionicons
                  name="add-circle"
                  size={30}
                  color={Number(price) >= upperPriceLimit ? "grey" : "green"}
                />
              </TouchableOpacity>

              {/* Minus Icon */}
              <TouchableOpacity
                onPress={() => setPrice((prev) => String(Number(prev) - 1))}
                disabled={Number(price) <= lowerPriceLimit} // Disable if price is less than or equal to lowerPriceLimit
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
                style={[styles.picker, { fontSize: 10, color: "#666" }]}
                onValueChange={(itemValue) => setCode(itemValue)}
              >
                <Picker.Item label="CURRENCY" value="USD" />
                <Picker.Item label="USD" value="USD" />
                <Picker.Item label="ZIG" value="ZIG" />
                <Picker.Item label="RAND" value="ZAR" />
                <Picker.Item label="PULA" value="BWP" />
              </Picker>
            </View>
          </View>

          <TouchableOpacity
            style={[
              styles.btnSignUp,
              loading ? { backgroundColor: "grey" } : null,
            ]}
            onPress={handleSignUp}
            disabled={loading} // Disable the button when loading is true
          >
            <Text style={styles.txtSignUp}>
              {loading ? "Loading..." : "OK"}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Loading Modal */}
        <Modal transparent={true} animationType="fade" visible={loading}>
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <ActivityIndicator size="large" color="#0000ff" />
              <Text style={styles.modalText}>Loading...</Text>
            </View>
          </View>
        </Modal>
      </ScrollView>
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
  viewTop: {
    height: 60,
    backgroundColor: "#FFC000",
    flexDirection: "row",
    width: "100%",
    marginTop: 20,
    paddingHorizontal: 20,
    alignItems: "center",
    justifyContent: "space-between",
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 25,
    marginRight: 10,
  },
  nameContainer: {
    flexDirection: "column",
    flex: 1,
  },
  txtName: {
    fontSize: 11,
    color: "#595959",
    fontWeight: "bold",
  },
  menuIcon: {
    padding: 10,
  },
  appName: {
    fontSize: 20,
    fontWeight: "bold",
    color: "black",
    marginLeft: 10,
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
    color: "#cc",
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
    fontSize: 10,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: 200,
    padding: 20,
    backgroundColor: "white",
    borderRadius: 10,
    alignItems: "center",
  },
  modalText: {
    marginTop: 10,
    fontSize: 16,
  },
});

export default CustomerNewDelivery;

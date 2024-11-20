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
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import { useNavigation } from "@react-navigation/native";
import * as ImagePicker from "expo-image-picker";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
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
import Toast from "react-native-toast-message";

const CustomerNewDelivery = () => {
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

  const navigation = useNavigation();
  const hardCodedBalance = 100; // Example balance value

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
          setStartLocationLat(parseFloat(lastDelivery.startCoords.latitude || ""));
          setStartLocationLong(parseFloat(lastDelivery.startCoords.longitude || ""));
          setEndLocationLat(parseFloat(lastDelivery.destCoords.latitude || ""));
          setEndLocationLong(parseFloat(lastDelivery.destCoords.longitude || ""));
        } else {
          console.warn("No deliveries found");
        }
      } catch (error) {
        console.error("Error fetching deliveries:", error);
      }
    };

    fetchDeliveries();
    fetchData();
  }, []);

  const validateFields = () => {
    if (!from || !to || !contact || !price || !payingWhen || !code || !weight || !parcelDescription) {
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

  const handleSignUp = async () => {
    if (!validateFields()) return;

    // Check balance before proceeding
    if (!checkBalance(price)) return;

    try {
      const deliveryData = {
        driver_id: "",
        cust_id: cid,
        request_start_datetime: new Date().toISOString(),
        order_start_datetime: "",
        order_end_datetime: "",
        status: "New Order",
        delivery_details: parcelDescription || null,
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
        accepted_cost: "0",
        paying_when: payingWhen,
        payment_type: paymentMethod,
        currency_id: cid,
        currency_code: code,
        customer_comment: "",
        driver_comment: "",
        driver_stars: "0",
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
        Toast.show({
          type: "success",
          text1: "Trip Created Successfully",
          text2: result.message,
        });
        navigation.navigate("Home");
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
      <View style={styles.topBar}>
        <View style={styles.viewTop}>
          <Image
            style={styles.profileImage}
            source={require("../../assets/profile.jpeg")}
          />
          <View style={styles.nameContainer}>
            <Text style={styles.txtName}>King Godo</Text>
            <Text style={styles.txtName}>Customer</Text>
          </View>
          <TouchableOpacity style={styles.menuIcon}>
            <FontAwesome5 name="bars" size={20} color="#595959" />
          </TouchableOpacity>
        </View>
      </View>

      <View style={{ alignItems: "center", marginTop: 10, bottom: 0 }}>
        <FontAwesomeIcon icon={faMapMarkerAlt} size={25} color="red" />
        <Text style={styles.appName}>EasyGo</Text>
      </View>
      <ScrollView>
        <View style={styles.formContainer}>
          <View>
            <Text style={{ alignSelf: "center", fontSize: 14, marginBottom: 10 }}>
              New Delivery
            </Text>
          </View>

          <View style={styles.inputContainer}>
            <FontAwesomeIcon
              icon={faArrowCircleLeft}
              size={12}
              style={styles.icon}
            />
            <TextInput style={styles.input} value={from} editable={false} />
          </View>

          <View style={styles.inputContainer}>
            <FontAwesomeIcon
              icon={faArrowCircleRight}
              size={12}
              style={styles.icon}
            />
            <TextInput style={styles.input} value={to} editable={false} />
          </View>

          <View style={styles.inputContainer}>
            <FontAwesomeIcon
              icon={faArrowCircleRight}
              size={12}
              style={styles.icon}
            />
            <TextInput style={styles.input} value={duration} editable={false} />
          </View>

          <View style={styles.inputContainer}>
            <FontAwesomeIcon
              icon={faArrowCircleRight}
              size={12}
              style={styles.icon}
            />
            <TextInput style={styles.input} value={distance} editable={false} />
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
            <FontAwesomeIcon icon={faBagShopping} size={12} style={styles.icon} />
            <TextInput
              style={styles.input}
              placeholder="Parcel Description"
              value={parcelDescription}
              onChangeText={setParcelDescription}
            />
          </View>

          <View style={styles.inputContainer}>
            <FontAwesomeIcon icon={faScaleBalanced} size={12} style={styles.icon} />
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
              <Picker.Item label="Pay Before Delivery" value="Pay Before Delivery" />
              <Picker.Item label="Pay After Delivery" value="Pay After Delivery" />
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
                onChangeText={setPrice}
                keyboardType="numeric"
              />
            </View>

            <View style={[styles.pickerContainer, { width: "45%", marginLeft: 2 }]}>
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

          <TouchableOpacity style={styles.btnSignUp} onPress={handleSignUp}>
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
    height: "14%",
    backgroundColor: "green",
    justifyContent: "center",
    marginBottom: 40,
  },
  viewTop: {
    height: 60,
    backgroundColor: "green",
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
    backgroundColor: "green",
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
});

export default CustomerNewDelivery;
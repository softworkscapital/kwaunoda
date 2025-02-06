import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Linking,
  FlatList,
  Image,
  Modal,
  Alert,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { API_URL, API_URL_UPLOADS } from "./config";
import { Picker } from "@react-native-picker/picker"; // Import Picker
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRoute } from '@react-navigation/native';

const Wallet = () => {
    const route = useRoute();
    const { userId, Data } = route.params;
  const [topUpHistory, setTopUpHistory] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [client_profile_id, setClient_profile_id] = useState("");
  const [description, setDescription] = useState("");
  const [oldbalance, setBalance] = useState(0);
  const [debit, setDebit] = useState("");
  const [credit, setCredit] = useState(0);
  const [date, setDate] = useState();
  const [exchangeRate, setExchangeRate] = useState("");
  const [paymentMethodCode, setPaymentMethod] = useState("");
  const [currencyCode, setCurrencyCode] = useState("");
  const [driver, setDriver] = useState();
  const [name, setName] = useState();
  const [surname, setSurname] = useState();
  const [user_Id, setuser_Id] = useState();
  const [profileImage, setPic] = useState();

  const APILINK = API_URL;
  const navigation = useNavigation();

  const redirectHome = () => {
    navigation.goBack();
  };


  const setter = (data) => {
    const driverData = data;
  
    setDriver(driverData);
    setName(driverData.name);
    setSurname(driverData.surname);
    setuser_Id(driverData.driver_id);
    setPic(`${API_URL_UPLOADS}/${driverData.profilePic.replace(/\\/g, '/')}`);

  }
  useEffect(() => {
    const fetchDriver = async () => {
      try {
        // const response = await AsyncStorage.getItem("userDetails");
        // const driverData = JSON.parse(response);
        const driverData = Data;
    
        if (driverData) {
          setter(driverData);
          console.log("Driver email:", driverData); // Check if email is available
        } else {
          console.log("No driver data found.");
        }
      } catch (error) {
        console.error("Error fetching driver data:", error);
      }
    };

    fetchDriver();
  
    const interval = setInterval(() => {
      fetchDriver();
    }, 3000);

    return () => clearInterval(interval); 
  }, []);
  
  useEffect(() => {
    const fetchTopUpHistory = async () => {
      if (!userId) return; // Early return if user_Id is not set
  
      try {
        const resp = await fetch(`${APILINK}/topUp/topup/${userId}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
  
        const result = await resp.json();
        console.log("Top Up History:", result);
        if (result) {
          setTopUpHistory(result);
          setBalance(result[0]?.user_wallet_balance || 0);
          setDate(new Date().toISOString());
        } else {
          Alert.alert("Error", "Failed to fetch History.");
        }
      } catch (error) {
        console.error("Error fetching History:", error);
        Alert.alert("Error", "An error occurred while fetching History.");
      }
    };
  
    fetchTopUpHistory();
  
    const interval = setInterval(() => {
      fetchTopUpHistory();
    }, 7000);
  
    return () => clearInterval(interval); // Cleanup on unmount
  }, [user_Id]); // Depend on user_Id

  const initiatePayment = async (paymentDetails) => {
    console.log("zvikuenda izvi:", paymentDetails);
    try {
      const response = await fetch(`${API_URL}/initiate-payment`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(paymentDetails),
      });
  
      const data = await response.json();
      console.log("Kupese kwauya izvi.....", data);
  
      if (data.success && data.redirectUrl) {
        navigation.navigate("pesepay", { url: data.redirectUrl });
      } else {
        Alert.alert(
          "Payment Error",
          data.message || "Failed to initiate payment."
        );
      }
    } catch (error) {
      console.error("Payment initiation error:", error);
      Alert.alert("Error", "An error occurred while initiating payment.");
    }
  };

  const handleAddTopUp = async (e) => {
    e.preventDefault();

    let balance = oldbalance + parseFloat(debit); // Ensure debit is a number
    let client_profile_id = 1003;
    let exchange_rate = 1;
    let currency = currencyCode;
    let amount = parseFloat(debit); // Ensure amount is a number

    if (!driver) {
      console.error("Driver data is not available.");
      return; // Early return or handle as needed
    }

    const userObj = {
      currency,
      exchange_rate,
      date,
      credit,
      debit: amount,
      balance,
      description,
      client_profile_id,
    };
    let paymentReason = "TopUp";
    let customerEmail = driver.email || ""; // Fallback to an empty string
    let customerPhone = driver.phone || ""; // Fallback to an empty string
    let customerName = driver.name || ""; // Fallback to an empty string

    const topupDetails = {
      currencyCode,
      paymentMethodCode,
      customerEmail,
      customerPhone,
      customerName,
      amount,
      paymentReason,
    };

    console.log("Topup Details:", topupDetails);
    await AsyncStorage.setItem("Topup_Details", JSON.stringify(topupDetails));

    const response = await initiatePayment(topupDetails);
    if (response) {
      setModalVisible(false);
    } else {
      Alert.alert(response);
    }
  };

  const renderTopUpItem = ({ item }) => (
    <TouchableOpacity style={styles.deliveryItem}>
      <View style={styles.deliveryItemHeader}>
        <Text style={styles.orderNumber}>Ref: {item.top_up_id}</Text>
        <Text style={styles.bal}>
          ${Number(item.user_wallet_balance).toFixed(2)} {item.currency}
        </Text>
      </View>
      <Text style={styles.status}>{item.date}</Text>
      <Text style={styles.status}>{item.description}</Text>
      <Text style={styles.status}>
        Amount Affected:
         {item.user_wallet_debit ? (
          <Text style={{ color: "red", fontWeight: "bold" }}>
            {" "}
            - {item.user_wallet_debit} {item.currency}
          </Text>
        ) : item.user_wallet_credit ? (
          <Text style={{ color: "green", fontWeight: "bold" }}>
           {" "}{item.user_wallet_credit} {item.currency}
          </Text>
        ) : (
          " N/A"
        )}
      </Text>
      {/* <Text style={styles.status}>Trip Id: {item.trip_id || "N/A"}</Text> */}
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View
        style={[
          styles.topBar,
          styles.goldenYellow,
          { paddingTop: 30, alignItems: "center", marginBottom: 20 },
        ]}
      >
        <TouchableOpacity style={styles.backArrow} onPress={redirectHome}>
          <MaterialIcons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>

        <View style={[styles.topBarContent]}>
          <Text style={[styles.title, { color: "#000", fontWeight: "bold" }]}>
            Wallet
          </Text>
        </View>
      </View>

      {/* hoyooo */}
      <View
        style={{
          // borderWidth: 1, // Add border width
          borderColor: "goldenrod", // Set border color to gray
          borderRadius: 8, // Optional: round the corners
          backgroundColor: "white", // Set background color to white
          margin: 20,
          marginTop: 10,
        }}
      >
        <View style={styles.profileContainer}>
          <Image
            style={styles.profilePicture}
            source={{ uri: profileImage }}
          />
          <View>
            <Text style={styles.username}>
              {name} {surname}
            </Text>
            <Text style={styles.user_Id}>{user_Id}</Text>
          </View>
        </View>

        <View
          style={{
            borderWidth: 1, // Add border width
            borderColor: "goldenrod", // Set border color to gray
            borderRadius: 8, // Optional: round the corners
            backgroundColor: "white", // Set background color to white
            marginVertical: 5,
            marginHorizontal: 20,
          }}
        ></View>

        <View style={styles.detailsContainer}>
          <View style={[styles.detail, { alignSelf: "center" }]}>
            {/* <MaterialIcons name="wallet" size={70} color="#000" /> */}
            <Text style={[styles.text, { fontSize: 16 }]}>
              {" "}
              ${Number(oldbalance).toFixed(2)}
            </Text>
          </View>
          <Text
            style={[
              styles.text,
              {
                fontSize: 12,
                alignSelf: "center",
                paddingLeft: 10,
                color: "green",
              },
              { marginLeft: 10 },
            ]}
          >
            Balance
          </Text>
        </View>
      </View>

      {/* hoyooo */}
      <FlatList
        data={topUpHistory}
        keyExtractor={(item) => item.top_up_id.toString()} // Use a unique property
        renderItem={renderTopUpItem}
        contentContainerStyle={styles.deliveryList}
        showsVerticalScrollIndicator={false}
      />

      {/* button nyowani */}
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          marginBottom: 10,
          alignSelf: "center",
        }}
      >
        <TouchableOpacity
          onPress={() => setModalVisible(true)}
          style={[styles.btnSignUp, { marginTop: 5 }]}
        >
          <Text style={styles.txtSignUp}>Top Up</Text>
        </TouchableOpacity>
      </View>

      {/* Modal for adding top up */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <Text style={[styles.modalTitle, { alignSelf: "center" }]}>
            Top Up
          </Text>

          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={paymentMethodCode}
              onValueChange={(itemValue) => setPaymentMethod(itemValue)}
              style={styles.picker}
            >
              <Picker.Item label="Select Payment Method" value="" />
              <Picker.Item label="InnBucks" value="INNBUCKS" />
              <Picker.Item label="Ecocash" value="ECOCASH" />
              <Picker.Item label="Master card" value="CARD" />
              <Picker.Item label="Visa" value="Visa" />
              <Picker.Item label="Bank" value="BANK_TRANSFER" />
              <Picker.Item label="Telecash" value="Telecash" />
              <Picker.Item label="OneMoney" value="OneMoney" />
            </Picker>
          </View>

          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={currencyCode}
              onValueChange={(itemValue) => setCurrencyCode(itemValue)}
              style={styles.picker}
            >
              <Picker.Item label="Select Currency" value="" />
              <Picker.Item label="USD" value="USD" />
            </Picker>
          </View>

          {paymentMethodCode === "ECOCASH" ? (
            <TextInput
              placeholder="Phone"
              value={description}
              onChangeText={setDescription}
              style={styles.input}
            />
          ) : (
            <TextInput
              placeholder="Account Number"
              value={description}
              onChangeText={setDescription}
              style={styles.input}
            />
          )}

          <TextInput
            placeholder="Amount"
            value={debit}
            onChangeText={setDebit}
            style={styles.input}
          />

          <TouchableOpacity
            onPress={handleAddTopUp}
            style={[styles.btnSignUp, { alignSelf: "center" }]}
          >
            <Text style={styles.submitButtonText}>Pay</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setModalVisible(false)}
            style={styles.closeButton}
          >
            <Text style={styles.closeButtonText}>Close</Text>
          </TouchableOpacity>
        </View>
      </Modal>
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
    paddingHorizontal: 1,
    marginTop: 0,
    paddingTop: 20, 
    paddingVertical: 20,
  },
  btnSignUp: {
    backgroundColor: "#ffc000",
    borderRadius: 50,
    padding: 14,
    width: "80%",
    alignItems: "center",
  },
  goldenYellow: {
    backgroundColor: "#ffc000",
  },
  backArrow: {
    padding: 8,
    marginTop: 14,
  },
  topBarContent: {
    marginTop: 15,
    flex: 1,
    alignSelf: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 15,
    fontWeight: "bold",
  },
  deliveryList: {
    paddingHorizontal: 20,
    paddingBottom: 80, // Add padding to avoid content being hidden behind the bottom bar
  },
  deliveryItem: {
    backgroundColor: "#f5f5f5",
    padding: 15,
    borderRadius: 8,
    marginBottom: 15,
  },
  detail: {
    flexDirection: "row",
    alignItems: "left",
    marginBottom: 1,
    fontSize: 15,
  },
  text: {
    fontSize: 16,
  },
  detailsContainer: {
    marginVertical: 5,
    marginHorizontal: 60,
  },
  username: {
    fontSize: 15,
    fontWeight: "bold",
  },
  pickerContainer: {
    borderWidth: 1, // Border width for the Picker
    borderColor: "#ccc", // Border color
    borderRadius: 4, // Rounded corners
    marginBottom: 15, // Spacing below the Picker
  },
  picker: {
    height: 50, // Height for the Picker
    width: "100%", // Full width
  },
  user_Id: {
    fontSize: 12,
    fontWeight: "bold",
  },
  profilePicture: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 25,
    
  },
  profileContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 10,
    marginHorizontal: 30,
  },

  deliveryItemHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 5,
  },
  orderNumber: {
    fontSize: 12,
    fontWeight: "bold",
  },
  bal: {
    fontSize: 13,
    fontWeight: "bold",
    paddingVertical: 1,
    paddingHorizontal: 8,
    borderRadius: 4,
  },
  status: {
    fontSize: 12,
    fontWeight: "condensed",
    paddingVertical: 1,
    paddingHorizontal: 8,
    borderRadius: 4,
  },
  statusDelivered: {
    color: "#4CAF50",
    backgroundColor: "#E8F5E9",
  },
  statusCancelled: {
    color: "#F44336",
    backgroundColor: "#FFEBEE",
  },
  deliveredOn: {
    fontSize: 14,
    fontWeight: "300",
    color: "#666",
  },
  bottomBar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    paddingVertical: 12,
    backgroundColor: "#FFD700",
  },
  bottomBarItem: {
    alignItems: "center",
  },
  bottomBarText: {
    fontSize: 14,
    marginTop: 4,
  },

  //modal
  modalContainer: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 4,
    padding: 10,
    marginBottom: 15,
  },
  submitButton: {
    backgroundColor: "#FFD700",
    padding: 15,
    borderRadius: 4,
    alignItems: "center",
  },
  submitButtonText: {
    color: "#000",
    fontWeight: "bold",
  },
  closeButton: {
    marginTop: 10,
    alignItems: "center",
  },
  closeButtonText: {
    color: "red",
  },
});

export default Wallet;

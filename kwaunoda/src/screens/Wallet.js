import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, FlatList, Image, Modal } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from "@react-navigation/native";
import BottomFooter from './BottomFooter';
import { API_URL } from './config';
import { Picker } from '@react-native-picker/picker'; // Import Picker
import AsyncStorage from "@react-native-async-storage/async-storage";
import Swal from 'sweetalert2';


const Wallet = () => {
  const [topUpHistory, setTopUpHistory] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [client_profile_id, setClient_profile_id] = useState('');
  const [description, setDescription] = useState('');
  const [oldbalance, setBalance] = useState();
  const [debit, setDebit] = useState();
  const [credit, setCredit] = useState(0);
  const [date, setDate] = useState(); 
  const [exchangeRate, setExchangeRate] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('');
  const [currencyCode, setCurrencyCode] = useState('');
  const [driver, setDriver] = useState();
  
  const APILINK = API_URL;
  const navigation = useNavigation();

  const redirectHome = () => {
    navigation.goBack(); 
  };

  useEffect(() => {
    const fetchDriver = async () => {
      try {
          const response = await AsyncStorage.getItem("userDetails");
          const driverData = JSON.parse(response);
          if (driverData) {
              setDriver(driverData);
              console.log("Driver email:", driverData.email); // Check if email is available
          } else {
              console.log("No driver data found.");
          }
      } catch (error) {
          console.error("Error fetching driver data:", error);
      }
  };

    const fetchTopUpHistory = async () => {
      let me = 1003;
      try {
        const resp = await fetch(
          `${APILINK}/topUp/topup/${me}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        const result = await resp.json();
        console.log("kkkkkk", result);
        if (result) {
          setTopUpHistory(result);
          setBalance(result[0].balance);
          setDate(new Date().toISOString());
           // Store the trips
        } else {
          Alert.alert("Error", "Failed to fetch History.");
        }
      } catch (error) {
        console.error("Error fetching History:", error);
        Alert.alert("Error", "An error occurred while fetching History.");
      }
    };


    fetchTopUpHistory();
    fetchDriver();
   

    const interval = setInterval(() => {
      fetchTopUpHistory();
    }, 7000);

  }, []);





  const initiatePayment = async (paymentDetails) => {
    try {
        const response = await fetch(`${API_URL}/initiate-payment`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(paymentDetails),
        });

        const data = await response.json();
        if (data.referenceNumber) {
            // Redirect user to the payment URL (Pesepay will handle the redirect)
            // Set the result and return URLs in your Pesepay integration
            pesepay.resultUrl = 'https://localhost:3011/payment-result'; // URL for payment result processing
            pesepay.returnUrl = 'https://192.168.135.97:8081/Wallet'; // URL to redirect user after payment

            // Here, you would typically navigate to the payment URL provided by the response
            // For example, if you have a redirect URL in the response: 
            // navigation.navigate('PaymentScreen', { url: data.redirectUrl });
        } else {
            // Handle error (e.g., show an error message to the user)
            console.error('Error initiating payment:', data.message);
        }
    } catch (error) {
        console.error('Payment initiation error:', error);
    }
};



const handleAddTopUp = (e) => {
  e.preventDefault();

  let balance = oldbalance + debit;
  let client_profile_id = 1003;
  let exchange_rate = 1;
  let currency = currencyCode;
  let amount = debit;

  // Check if driver is defined before accessing properties
  if (!driver) {
      console.error("Driver data is not available.");
      return; // Early return or handle as needed
  }

  const userObj = { currency, exchange_rate, date, credit, debit, balance, description, client_profile_id };
  let paymentReason = "TopUp";
  let customerEmail = driver.email || ""; // Fallback to an empty string
  let customerPhone = driver.phone || ""; // Fallback to an empty string
  let customerName = driver.name || ""; // Fallback to an empty string

  const topupDetails = {
      currencyCode, paymentMethod, customerEmail, customerPhone, customerName, amount, paymentReason
  };
  console.log("Topup Details:", topupDetails);

  const peseCall = initiatePayment(topupDetails);

  if (peseCall) {
      fetch(`${API_URL}/TopUp`, {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify(userObj)
      }).then(res => {
          console.log(res);
          if (res.status === 200) {
              // Display success message
              Swal.fire({ text: "Saved successfully!", icon: "success" });
              navigation.navigate('/Wallet');
          }
      }).catch((err) => {
          console.log(err.message);
      });
  }

  setModalVisible(false);
};

  const renderTopUpItem = ({ item }) => (
    <TouchableOpacity style={styles.deliveryItem}>
      <View style={styles.deliveryItemHeader}>
        <Text style={styles.orderNumber}>Order #{item.top_up_id}</Text>
        <Text
          style={[
            styles.status,
            // item.status === 'Trip Ended' ? styles.statusDelivered : styles.statusCancelled,
          ]}
        >
          ${item.balance}
        </Text>
      </View>
      <Text style={styles.deliveredOn}>
        Delivered on {item.total_usage}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={[styles.topBar, styles.goldenYellow, { paddingTop: 30, alignItems: 'center', marginBottom: 20 }]}>
        <TouchableOpacity style={styles.backArrow} onPress={redirectHome}>
          <MaterialIcons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>

          <View style={[styles.topBarContent]}>
            <Text style={[styles.title, { color: '#000', fontWeight: 'bold'}]}>Wallet</Text>
          </View>
        </View>

      {/* hoyooo */}
        <View style={{
              borderWidth: 1,              // Add border width
              borderColor: "goldenrod",        // Set border color to gray
              borderRadius: 8,            // Optional: round the corners
              backgroundColor: "white",   // Set background color to white
              margin: 20,
              marginTop: 10
        }}>      
      <View style={styles.profileContainer}>
          <Image
            style={styles.profilePicture}
            source={require("../../assets/profile.jpeg")}
          />
          <View>
            <Text style={styles.username}>Munashe Mudoti (Driver)</Text>
            <Text style={styles.userid}>ACY 1988</Text>
          </View>
        </View>
        
      <View style={{
              borderWidth: 1,              // Add border width
              borderColor: "goldenrod",        // Set border color to gray
              borderRadius: 8,            // Optional: round the corners
              backgroundColor: "white",   // Set background color to white
              marginVertical: 5,
              marginHorizontal: 20,
        }}></View>


        <View style={styles.detailsContainer}>
          <View style={[styles.detail, {alignSelf: "center"}]}>
            {/* <MaterialIcons name="wallet" size={70} color="#000" /> */}
            <Text style={[styles.text, {fontSize: 16}]}> ${oldbalance}</Text>
          </View>
          <Text style={[styles.text, {fontSize: 12, alignSelf: "center", paddingLeft: 10, color: "green"},{ marginLeft: 10 }]}>Balance</Text>
        </View>
        </View>

        {/* hoyooo */}
        <FlatList
        data={topUpHistory}
        keyExtractor={(item) => item.id}
        renderItem={renderTopUpItem}
        contentContainerStyle={styles.deliveryList}
        showsVerticalScrollIndicator={false}
      />

{/* button nyowani */}
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          marginBottom: 90,
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
    <Text style={[styles.modalTitle, { alignSelf: "center" }]}>Top Up</Text>
    
    <View style={styles.pickerContainer}>
      <Picker
        selectedValue={paymentMethod}
        onValueChange={(itemValue) => setPaymentMethod(itemValue)}
        style={styles.picker}
      >
        <Picker.Item label="Select Payment Method" value="" />
        <Picker.Item label="InnBucks" value="InnBucks" />
        <Picker.Item label="Ecocash" value="Ecocash" />
        <Picker.Item label="Master card" value="Master Card" />
        <Picker.Item label="Visa" value="Visa" />
        <Picker.Item label="Bank" value="Bank" />
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

    {paymentMethod === 'Ecocash' ? (
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

          <BottomFooter/>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  btnSignUp: {
    backgroundColor: "green",
    borderRadius: 50,
    padding: 14,
    width: "80%",
    alignItems: "center",

  },
  goldenYellow: {
    backgroundColor: 'green',
  },
  backArrow: {
    padding: 8,
  },
  topBarContent: {
    flex: 1,
    alignSelf: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  deliveryList: {
    paddingHorizontal: 20,
    paddingBottom: 80, // Add padding to avoid content being hidden behind the bottom bar
  },
  deliveryItem: {
    backgroundColor: '#f5f5f5',
    padding: 15,
    borderRadius: 8,
    marginBottom: 15,
  },
  detail: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 1,
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
    borderWidth: 1,                // Border width for the Picker
    borderColor: "#ccc",          // Border color
    borderRadius: 4,              // Rounded corners
    marginBottom: 15,             // Spacing below the Picker
  },
  picker: {
    height: 50,                   // Height for the Picker
    width: '100%',                // Full width
  },
  userid: {
    fontSize: 12,
    fontWeight: "bold",
  },
  profilePicture: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  profileContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 10,
    marginHorizontal: 30,
  },

  deliveryItemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
  },
  orderNumber: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  status: {
    fontSize: 14,
    fontWeight: 'bold',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 4,
  },
  statusDelivered: {
    color: '#4CAF50',
    backgroundColor: '#E8F5E9',
  },
  statusCancelled: {
    color: '#F44336',
    backgroundColor: '#FFEBEE',
  },
  deliveredOn: {
    fontSize: 14,
    color: '#666',
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 12,
    backgroundColor: '#FFD700',
  },
  bottomBarItem: {
    alignItems: 'center',
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

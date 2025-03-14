import React, { useEffect, useState, useRef } from "react";
import { StyleSheet, View, Alert, TouchableOpacity } from "react-native";
import { WebView } from "react-native-webview";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_URL } from "./config";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";

const PesePaymentScreen = ({ route }) => {
  const { url, referenceNumber } = route.params; // URL for the payment page
  const navigation = useNavigation(); // Navigation hook
  const APILINK = API_URL; // API endpoint
 const ref = referenceNumber;
 const [id,setId] = useState();
 const [data,setData] = useState();



  console.log("Navigating to URL:", url); // Log the URL

  useEffect(() => {
      const checkSuccess = async (referenceNumber) => {
          try {
              console.log("referenceNumber:", referenceNumber);

              const res = await fetch(`${APILINK}/check_payment/${referenceNumber}`, {
                  method: "GET",
                  headers: { "Content-Type": "application/json" },
              });

              const payCheck = await res.json();
              console.log("response:", payCheck); // Log the actual payCheck response

              if (res.status === 200 && payCheck.response.paid) {
                  Alert.alert("Success", "Top up successful!");
                  clearInterval(intervalId); // Stop checking on success
                  clearTimeout(timeoutId);
                  // Uncomment to navigate on success
                  navigation.navigate("PaymentSuccessful");
              } else {
                  console.log("Payment check response:", payCheck);
              }
          } catch (error) {
              console.error("Error fetching payment status:", error);
          }
      };

      // Check payment status initially
      checkSuccess(referenceNumber);
      getData();

      // Set up interval to check payment status every 10 seconds
      const intervalId = setInterval(() => {
          checkSuccess(referenceNumber);
      }, 10000);

      const timeoutId = setTimeout(() => {
        clearInterval(intervalId);
        Alert.alert("Timeout", "Payment check timed out.");
        navigation.navigate("Wallet");
    }, 120000); // 2 minutes in milliseconds

    // Cleanup function to clear the interval and timeout on component unmount
    return () => {
        clearInterval(intervalId);
        clearTimeout(timeoutId);
    };
  }, [referenceNumber, APILINK]);



  
  

  // const topUplocal = async () => {

  //   const topup = await AsyncStorage.getItem("Topup_Details");
  //   const topupDetails = JSON.parse(topup);

  //   try {
  //     const res = await fetch(`${APILINK}/TopUp`, {
  //       method: "POST",
  //       headers: { "Content-Type": "application/json" },
  //       body: JSON.stringify(topupDetails),
  //     });

  //     console.log(res);
  //     if (res.status === 200) {
  //       Alert.alert("Success", "Top up successful!");
  //     }
  //   } catch (err) {
  //     console.log(err.message);
  //   }
  // };




  const redirectHome = async () => {
    navigation.navigate("Wallet", { userId: id, Data: data});
};

  const getData = async () => {
    const storedIds = await AsyncStorage.getItem("theIds");
    const parsedIds = JSON.parse(storedIds);
    const data =  await AsyncStorage.getItem("userDetails");
    const parsedData = JSON.parse(data);
   
    setData(parsedData);
    if (parsedIds) {
        if (parsedIds.customerId === "0") {
            setId(parsedIds.driver_id);
        } else {
            setId(parsedIds.customerId);
        }
    }
};

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
      </View>
      <WebView
        source={{ uri: url }}
        style={{ flex: 1 }}
        // onNavigationStateChange={handleNavigationStateChange}
        // // onHttpError={handleHttpError} // Handle HTTP errors
        // onMessage={onMessage} // Listen for messages from the WebView
        // injectedJavaScript={injectedJavaScript} // Inject JavaScript to handle messages
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backArrow: {
    padding: 8,
  },
  goldenYellow: {
    backgroundColor: "#FFC000", // Adjust the color as needed
  },
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
});

export default PesePaymentScreen;

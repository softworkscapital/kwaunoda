import React from "react";
import { StyleSheet, View, Alert, TouchableOpacity } from "react-native";
import { WebView } from "react-native-webview";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_URL } from "./config";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";

const PesePaymentScreen = ({ route }) => {
  const { url } = route.params; // URL for the payment page
  const navigation = useNavigation(); // Navigation hook
  const APILINK = API_URL; // API endpoint

  console.log("Navigating to URL:", url); // Log the URL

  const topUplocal = async () => {
    const topup = await AsyncStorage.getItem("Topup_Details");
    const topupDetails = JSON.parse(topup);

    try {
      const res = await fetch(`${APILINK}/TopUp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(topupDetails),
      });

      console.log(res);
      if (res.status === 200) {
        Alert.alert("Success", "Top up successful!");
      }
    } catch (err) {
      console.log(err.message);
    }
  };

  const onMessage = (event) => {
    const data = event.nativeEvent.data;
    console.log("Message from WebView:", data);

    try {
      const response = JSON.parse(data);
      console.log("Full Response from WebView:", response);

      // Handle the data received from the WebView
      if (response.status === "success") {
        Alert.alert("Payment Successful", "Your payment was completed successfully.", [
          { text: "OK", onPress: () => {
              topUplocal(); // Call topUplocal after success
              navigation.navigate("Wallet"); // Navigate to Wallet
            }},
        ]);
      } else if (response.status === "error") {
        Alert.alert("Payment Failed", "There was an error with your payment.", [
          { text: "OK", onPress: () => navigation.navigate("Wallet") }, // Navigate to Wallet
        ]);
      }
    } catch (error) {
      console.log("Error parsing message from WebView:", error);
      Alert.alert("Error", "An unexpected error occurred.", [
        { text: "OK", onPress: () => navigation.navigate("Wallet") }, // Navigate to Wallet
      ]);
    }
  };

  const handleHttpError = (syntheticEvent) => {
    const { nativeEvent } = syntheticEvent;
    console.log("HTTP Error:", nativeEvent);
    
    Alert.alert("Loading Error", `Unable to load the payment page.`, [
      { text: "OK", onPress: () => navigation.navigate("Wallet") }, // Navigate to Wallet
    ]);
  };

  const handleNavigationStateChange = (navState) => {
    console.log("Navigated to:", navState.url);
    
    // Check if the URL indicates a successful payment
    if (navState.url === 'http://localhost:8081/pesepay/return') {
      topUplocal();
      Alert.alert("Payment Successful", "Your payment was completed successfully.", [
        { text: "OK", onPress: () => navigation.navigate("Wallet") },
      ]);
    } else if (navState.url === 'http://localhost:8081/error') {
      Alert.alert("Payment Failed", "There was an error with your payment.", [
        { text: "OK", onPress: () => navigation.navigate("Wallet") },
      ]);
    } else if (navState.url === 'http://localhost:8081') {
      // Handle the case where the user returns to the base URL
      Alert.alert("Returning to Home", "Navigating back to Wallet.", [
        { text: "OK", onPress: () => navigation.navigate("Wallet") },
      ]);
    }
  };

  const injectedJavaScript = `
    (function() {
      // Example: Listen for a successful payment and log the response
      window.onpaymentstatus = function(status, responseData) {
        const message = JSON.stringify({ status: status, data: responseData });
        window.ReactNativeWebView.postMessage(message);
      };
    })();
  `;

  const redirectHome = () => {
    navigation.navigate("Wallet"); // Navigate to Wallet directly
  };

  return (
    <View style={styles.container}>
      <View style={[styles.topBar, styles.goldenYellow, { paddingTop: 30, alignItems: "center", marginBottom: 20 }]}>
        <TouchableOpacity style={styles.backArrow} onPress={redirectHome}>
          <MaterialIcons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
      </View>
      <WebView
        source={{ uri: url }}
        style={{ flex: 1 }}
        onNavigationStateChange={handleNavigationStateChange}
        onHttpError={handleHttpError} // Handle HTTP errors
        onMessage={onMessage} // Listen for messages from the WebView
        injectedJavaScript={injectedJavaScript} // Inject JavaScript to handle messages
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
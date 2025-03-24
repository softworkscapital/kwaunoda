import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Animated,
} from "react-native";
import { FontAwesome } from "@expo/vector-icons"; // Make sure to install @expo/vector-icons
import { API_URL } from "./config";
import AsyncStorage from "@react-native-async-storage/async-storage";

const PaymentSuccessful = ({ navigation }) => {
  const [id, setId] = useState();
  const [data, setData] = useState();
  const APILINK = API_URL;

  const scaleValue = new Animated.Value(1);

  // Function to animate the tick icon
  const startAnimation = () => {
    scaleValue.setValue(1);
    Animated.loop(
      Animated.sequence([
        Animated.timing(scaleValue, {
          toValue: 1.2,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(scaleValue, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
      ])
    ).start();
  };

  useEffect(() => {
    const getData = async () => {
      try {
        const storedIds = await AsyncStorage.getItem("theIds");
        const parsedIds = JSON.parse(storedIds) || {};
        const userDetails = await AsyncStorage.getItem("userDetails");
        const parsedData = JSON.parse(userDetails) || {};

        setData(parsedData);
        // Set the ID based on customerId
        setId(
          parsedIds.customerId === "0"
            ? parsedIds.driver_id
            : parsedIds.customerId
        );
      } catch (error) {
        console.error("Error retrieving data:", error);
      }
    };

    const topUplocal = async () => {
      try {
        const topupDetails = await AsyncStorage.getItem("Topup_Details");
        const parsedTopupDetails = JSON.parse(topupDetails);

        const res = await fetch(`${APILINK}/TopUp`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(parsedTopupDetails),
        });

        if (res.status === 200) {
          console.log("Success", "Top up successful!");
        } else {
          console.log("Error", "Failed to top up. Please try again.");
        }
      } catch (err) {
        console.error("Error during top up:", err.message);
      }
    };

    getData();
    topUplocal();
  }, []); // Empty dependency array to run only on mount

  const redirectHome = async () => {
    navigation.navigate("Wallet", { userId: id, Data: data });
  };

  const handleOkPress = () => {
    redirectHome();
  };

  React.useEffect(() => {
    startAnimation();
  }, []);

  return (
    <View style={styles.container}>
      <Animated.View style={{ transform: [{ scale: scaleValue }] }}>
        <FontAwesome name="check-circle" size={100} color="green" />
      </Animated.View>
      <Text style={styles.successMessage}>Payment Successful</Text>
      <TouchableOpacity style={styles.button} onPress={handleOkPress}>
        <Text style={styles.buttonText}>OK</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#fff",
  },
  successMessage: {
    fontSize: 24,
    marginVertical: 20,
    textAlign: "center",
  },
  button: {
    backgroundColor: "#FCC000",
    padding: 15,
    borderRadius: 50,
    width: "80%",
    position: "absolute",
    bottom: 35,
    alignItems: "center",
  },
  buttonText: {
    color: "#000", // Black text color
    fontSize: 18,
  },
});

export default PaymentSuccessful;

import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  Animated,
  TouchableOpacity,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage"; // Make sure to import AsyncStorage
import { API_URL } from "./config"; // Adjust the path as necessary
import Toast from "react-native-toast-message"; // Adjust the path as necessary

const Welcome = ({ navigation, route }) => {
  const { email, password } = route.params; // Destructure email and password from route params
  const [fadeAnim] = useState(new Animated.Value(0)); // Initial opacity for fade animation
  const [rotationAnim] = useState(new Animated.Value(0)); // Rotation animation
  const [loading, setLoading] = useState(false);
  const [customerId, setCustomerID] = useState(null); // State to hold customer ID

  const fetchUserDetails = async () => {
    setLoading(true); // Set loading state to true
    try {
      const response = await fetch(
        `${API_URL}/users/login/${email}/${password}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const result = await response.json();

      // Access the customer ID from the result
      const customerId = result[0]?.customerid;
      console.log("Customer ID:", customerId);
      setCustomerID(customerId);

      if (response.ok && result.length > 0) {
        const userStatus = result[0].status; // Assuming the user status is in the response

        const ids = {
          driver_id: result[0].driver_id,
          customerId: result[0]?.customerid,
          last_logged_account: result[0].last_logged_account,
        };

        console.log("The IDs", ids);
        // Store driver ID and customer ID in AsyncStorage
        await AsyncStorage.setItem("driver", JSON.stringify(result[0].driver_id));
        await AsyncStorage.setItem("theIds", JSON.stringify(ids));
        await AsyncStorage.setItem("theCustomerId", JSON.stringify(customerId));
        await AsyncStorage.setItem("userStatus", userStatus);

        if (userStatus === "Pending Verification") {
          navigation.navigate("Welcome", { email, password });
        } else if (userStatus === "Suspended" || userStatus === "Blacklisted") {
          navigation.navigate("AccountInError");
        } else {
          redirectHome(ids.last_logged_account, ids.driver_id);
        }
      } else {
        Alert.alert("Error", "No user found or wrong password/email.");
      }
    } catch (error) {
      console.log("Error fetching user details:", error);
      Toast.show({
        text1: "Error",
        text2: "An error occurred. Please try again.",
        type: "error",
        position: "center",
        visibilityTime: 3000,
        autoHide: true,
      });
    } finally {
      setLoading(false); // Reset loading state
    }
  };

  useEffect(() => {
    fetchUserDetails(); // Fetch user details when component mounts

    // Fade in animation
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();

    // Rotation animation
    Animated.loop(
      Animated.timing(rotationAnim, {
        toValue: 1,
        duration: 2000,
        useNativeDriver: true,
      })
    ).start();

    // Start fading in
    fadeAnim.setValue(1);
  }, [fadeAnim, rotationAnim]);

  const handleBack = () => {
    navigation.navigate("CustomerLogin"); // Navigate to CustomerLogin.js
  };

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
      <View style={styles.boxContainer}>
        <Animated.View
          style={[
            styles.box,
            {
              transform: [
                {
                  rotate: rotationAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: ["0deg", "360deg"],
                  }),
                },
              ],
            },
          ]}
        >
          <Text style={styles.boxText}>DropX</Text>
        </Animated.View>
      </View>
      <Text style={styles.message}>
        Your account is still being verified by the DropX agents.
      </Text>
      <Text style={[styles.message, { marginTop: 10 }]}>
        Please be patient...
      </Text>
      <TouchableOpacity style={styles.btnBack} onPress={handleBack}>
        <Text style={styles.txtBack}>Back</Text>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  boxContainer: {
    justifyContent: "center",
    alignItems: "center",
    height: 200, // Height for centering
    width: "100%",
  },
  box: {
    width: 120, // Increased width
    height: 120, // Increased height
    backgroundColor: "#ffc000",
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 80,
  },
  boxText: {
    color: "black",
    fontWeight: "bold",
    fontSize: 16,
  },
  message: {
    fontSize: 14,
    textAlign: "center",
    marginTop: 120,
  },
  btnBack: {
    backgroundColor: "#ffc000",
    borderRadius: 50,
    padding: 14,
    width: "100%",
    alignItems: "center",
    marginTop: 80,
    fontSize: 12,
  },
  txtBack: {
    color: "black",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default Welcome;

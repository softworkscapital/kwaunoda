import React, { useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Alert,
  ActivityIndicator, // Import ActivityIndicator
} from "react-native";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import {
  faEnvelope,
  faLock,
  faMapMarkerAlt,
} from "@fortawesome/free-solid-svg-icons";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Toast from "react-native-toast-message";
import { API_URL } from "./config";
import LocationSender from './LocationTracker';

const CustomerLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [customerID, setCustomerID] = useState(0);
  const [loading, setLoading] = useState(false); // Add loading state
  const navigation = useNavigation();

  const redirectSignUpCustomer = () => {
    navigation.navigate("SignUpCustomer");
  };

  const redirectSignUpDriver = () => {
    navigation.navigate("SignUpDriver");
  };

  const redirectHome = async (type, driverId) => {
    if (type === "driver") {
      try {
        const response = await fetch(
          `${API_URL}/trip/byStatus/driver_id/status?driver_id=${driverId}&status=InTransit`
        );
  
        // Handle 404 error specifically
        if (response.status === 404) {
          Toast.show({
            text1: "No trips found.",
            text2: "You can check your new orders instead.",
            type: "info",
            position: "center",
            visibilityTime: 3000,
            autoHide: true,
          });
          // Redirect to DriverNewOrderList
          navigation.navigate("DriverNewOrderList", { driverId });
          return; // Exit the function early
        }
  
        if (!response.ok) {
          const errorResponse = await response.json(); // Only read response once
          console.error("Error Response:", errorResponse);
          throw new Error(`HTTP error! status: ${response.status}`);
        }
  
        const tripData = await response.json(); // Read response here
  
        if (tripData.length > 0) {
          navigation.navigate("InTransitTrip"); // Navigate to in-transit screen
        } else {
          // Handle case when there are no trips in transit
          Toast.show({
            text1: "No trips in transit.",
            text2: "Redirecting to your new orders.",
            type: "info",
            position: "center",
            visibilityTime: 3000,
            autoHide: true,
          });
          navigation.navigate("DriverNewOrderList", { driverId });
        }
      } catch (error) {
        console.error("Error checking trip status:", error);
        Toast.show({
          text1: "Error checking trip status. Please try again.",
          type: "error",
          position: "center",
          visibilityTime: 3000,
          autoHide: true,
        });
      }
    } else if (type === "customer") {
      navigation.navigate("Home", { customerID });
    } else {
      Toast.show({
        text1: "Please Input the Correct Data",
        type: "error",
        position: "center",
        visibilityTime: 3000,
        autoHide: true,
      });
    }
  };

  const validateInput = () => {
    if (!email || !password) {
      Toast.show({
        text1: "Validation Error",
        text2: "Please fill in both email and password.",
        type: "error",
        position: "center",
        visibilityTime: 3000,
        autoHide: true,
      });
      return false;
    }
    return true;
  };

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

      // Access the customerid from the result
      const customerId = result[0]?.customerid;
      console.log("customa id:", customerId);
      setCustomerID(customerId);

      if (response.ok && result.length > 0) {
        const userStatus = result[0].status; // Assuming the user status is in the response

        const ids = {
          driver_id: result[0].driver_id,
          customerId: result[0]?.customerid, // Store as customerId
          last_logged_account: result[0].last_logged_account,
        };

        console.log("The ids", ids);
        // Store driver ID and customer ID in AsyncStorage
        await AsyncStorage.setItem(
          "driver",
          JSON.stringify(result[0].driver_id)
        );
        await AsyncStorage.setItem("theIds", JSON.stringify(ids));
        await AsyncStorage.setItem("theCustomerId", JSON.stringify(customerId)); // Store as customerId
        await AsyncStorage.setItem("userStatus", userStatus); // Store user status

        if (userStatus === "Pending Verification") {
          navigation.navigate("Welcome");
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

  const theLogin = async () => {
    if (!validateInput()) return; // Validate input before proceeding
    await fetchUserDetails(); // Fetch user details to check status
  };

  const handleSignIn = async () => {
    await theLogin(); // Attempt login
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.topBar}>
        <FontAwesomeIcon icon={faMapMarkerAlt} size={40} color="red" />
        <Text style={styles.appName}>DropX</Text>
      </View>
      <ScrollView>
        <View style={styles.formContainer}>
          <View>
            <Text
              style={{
                alignSelf: "center",
                fontSize: 16,
                marginBottom: 10,
                marginTop: 20,
              }}
            >
              Please Login
            </Text>
          </View>

          <View style={styles.inputContainer}>
            <FontAwesomeIcon icon={faEnvelope} size={12} style={styles.icon} />
            <TextInput
              style={styles.input}
              placeholder="Email"
              value={email}
              onChangeText={setEmail}
            />
          </View>

          <View style={styles.inputContainer}>
            <FontAwesomeIcon icon={faLock} size={12} style={styles.icon} />
            <TextInput
              style={styles.input}
              placeholder="Password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />
          </View>

          <View>
            <Text>Remember me</Text>
          </View>

          <TouchableOpacity
            style={[styles.btnSignUp, { marginTop: 50 }]}
            onPress={handleSignIn}
            disabled={loading} // Disable button while loading
          >
            {loading ? (
              <ActivityIndicator size="small" color="#000" /> // Show loading spinner
            ) : (
              <Text style={styles.txtSignUp}>Sign In</Text>
            )}
          </TouchableOpacity>

          <View style={{ alignItems: "center", marginTop: 4 }}>
            <Text>Forget Password</Text>
          </View>
        </View>
      </ScrollView>
      <View style={{ bottom: 0, marginBottom: 10 }}>
        <Text style={{ alignSelf: "center" }}>
          Create account{" "}
          <Text style={{ color: "#FFC000" }} onPress={redirectSignUpCustomer}>
            As Customer
          </Text>{" "}
          |{" "}
          <Text style={{ color: "#FFC000" }} onPress={redirectSignUpDriver}>
            As Driver
          </Text>
        </Text>
      </View>
      <Toast />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  topBar: {
    height: "25%",
    backgroundColor: "#FFC000",
    borderBottomLeftRadius: 45,
    borderBottomRightRadius: 45,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
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
  },
  btnSignUp: {
    backgroundColor: "#FFC000",
    borderRadius: 50,
    padding: 14,
    width: "100%",
    alignItems: "center",
  },
  txtSignUp: {
    color: "black",
    fontSize: 13,
    fontWeight: "bold",
  },
});

export default CustomerLogin;

import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  TextInput,
  TouchableOpacity,
  Text,
  SafeAreaView,
  ActivityIndicator,
  Alert,
} from "react-native";
import Toast from "react-native-toast-message";
import { API_URL } from "./config";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faMapMarkerAlt } from "@fortawesome/free-solid-svg-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";

const OTPDriver = ({ navigation }) => {
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [loading, setLoading] = useState(true);
  const [fetchedOtp, setFetchedOtp] = useState("");
  const [driverId, setDriverId] = useState(""); // State for driverId

  const fetchdriverDetails = async () => {
    try {
      const userData = await AsyncStorage.getItem("driverDetails"); // Fetch user details from local storage
      if (userData) {
        const driverDetails = JSON.parse(userData);
        setDriverId(driverDetails.driver_id); // Set driverId from user details
        console.log("Fetched Driver ID from local storage:", driverDetails.driver_id); // Log the fetched ID

        // Fetch OTP based on driverId
        const response = await fetch(`${API_URL}/USERS/${driverDetails.driver_id}`);
        if (response.ok) {
          const user = await response.json();
          setFetchedOtp(user[0].otp.toString()); // Convert OTP to string
          console.log("Fetched User Details:", user[0]);
        } else {
          const errorResponse = await response.json();
          console.error("Error fetching user data:", errorResponse);
          Toast.show({
            text1: "Error Fetching Data",
            text2: "Failed to fetch user data. Please try again.",
            type: "error",
            position: "top",
          });
        }
      } else {
        Toast.show({
          text1: "No User Data",
          text2: "User data not found in local storage.",
          type: "error",
          position: "top",
        });
      }
    } catch (error) {
      console.error("Network Error:", error);
      Toast.show({
        text1: "Network Error",
        text2: "Could not fetch user data. Please check your connection.",
        type: "error",
        position: "top",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchdriverDetails();
  }, []);

  const handleVerifyOtp = () => {
    const otpString = otp.join("");
    if (otpString === fetchedOtp) {
      Alert.alert("Success", "OTP verified successfully.");
      navigation.navigate("CustomerLogin");
    } else {
      Alert.alert("Error", "Invalid OTP. Please try again.");
    }
  };

  const handleChange = (text, index) => {
    const newOtp = [...otp];
    newOtp[index] = text;
    setOtp(newOtp);
    if (text.length === 1 && index < otp.length - 1) {
      this[`otpInput${index + 1}`].focus();
    }
  };

  const handleResendOtp = async () => {
    // Logic to resend OTP can go here
    Alert.alert("Resend OTP", "OTP has been resent to your phone.");
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="black" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.topBar}>
        <FontAwesomeIcon icon={faMapMarkerAlt} size={40} color="red" />
        <Text style={styles.appName}>Kwaunoda</Text>
      </View>

      <View style={styles.titleContainer}>
        <Text style={styles.title}>Enter OTP</Text>
      </View>

      <View style={styles.otpContainer}>
        {otp.map((digit, index) => (
          <TextInput
            key={index}
            ref={(input) => {
              this[`otpInput${index}`] = input;
            }}
            style={styles.otpInput}
            value={digit}
            onChangeText={(text) => handleChange(text, index)}
            keyboardType="numeric"
            maxLength={1}
          />
        ))}
      </View>

      <TouchableOpacity style={styles.btnVerify} onPress={handleVerifyOtp}>
        <Text style={styles.txtVerify}>Verify OTP</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={handleResendOtp} style={styles.resendContainer}>
        <Text style={styles.txtResend}>Resend OTP</Text>
      </TouchableOpacity>

      <Toast />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
  },
  topBar: {
    width: "100%",
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
  titleContainer: {
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
  },
  otpContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
    paddingHorizontal: 20,
    width: "100%",
  },
  otpInput: {
    width: 60,
    height: 60,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    textAlign: "center",
    fontSize: 24,
  },
  btnVerify: {
    backgroundColor: "#FFC000",
    borderRadius: 50,
    paddingVertical: 14,
    width: "90%",
    alignItems: "center",
  },
  txtVerify: {
    color: "black",
    fontSize: 16,
    fontWeight: "bold",
  },
  resendContainer: {
    marginTop: 20,
  },
  txtResend: {
    color: "#007BFF", // Change color to blue to indicate it's clickable
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default OTPDriver;
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
import { useRoute } from "@react-navigation/native"; // Import useRoute

const OTPDriver = ({ navigation }) => {
  const route = useRoute(); // Access route parameters
  const { userId } = route.params; // Destructure userId from route parameters

  const [otp, setOtp] = useState(["", "", "", ""]);
  const [loading, setLoading] = useState(true);
  const [fetchedOtp, setFetchedOtp] = useState("");

  useEffect(() => {
    console.log("Passed userId:", userId); // Log the passed userId
    fetchDriverDetails(userId); // Pass userId to fetchDriverDetails
  }, [userId]);

  const fetchDriverDetails = async (userId) => {
    try {
      if (!userId) {
        Toast.show({
          text1: "Error",
          text2: "User ID not found.",
          type: "error",
          position: "top",
        });
        return;
      }

      // Fetch OTP based on userId
      const response = await fetch(`${API_URL}/USERS/${userId}`);
      if (response.ok) {
        const user = await response.json();
        if (user.length > 0 && user[0].otp) {
          setFetchedOtp(user[0].otp.toString()); // Convert OTP to string
          console.log("Fetched User Details:", user[0]);
          console.log("Fetched OTP:", user[0].otp); // Log the fetched OTP
        } else {
          Toast.show({
            text1: "Error",
            text2: "No OTP found for this user.",
            type: "error",
            position: "top",
          });
        }
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
        <Text style={styles.appName}>DropX</Text>
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
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
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_URL } from "./config";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faMapMarkerAlt } from "@fortawesome/free-solid-svg-icons";

const OTPDriver = ({ navigation }) => {
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [generatedOtp, setGeneratedOtp] = useState("");
  const [driverDetails, setDriverDetails] = useState(null);

  const fetchDriverDetails = async () => {
    const data = await AsyncStorage.getItem("driverDetails");
    if (data) {
      const parsedData = JSON.parse(data);
      setDriverDetails(parsedData);
      console.log("Fetched Driver Details:", parsedData);
    }
  };

  useEffect(() => {
    fetchDriverDetails();
  }, []);

  const generateAndSendOtp = async () => {
    const otpCode = Math.floor(1000 + Math.random() * 9000).toString();
    setGeneratedOtp(otpCode);
    console.log("haaayas")
    console.log("Generated OTP:", otpCode);

    if (!driverDetails) {
      Toast.show({
        text1: "Error",
        text2: "Driver details not found.",
        type: "error",
        position: "top",
      });
      return;
    }

    // Prepare user data payload
    const userData = {
      userid: driverDetails.userid,
      username: driverDetails.username,
      password: driverDetails.password,
      role: "driver",
      email: driverDetails.email,
      notify: true,
      activesession: false,
      addproperty: false,
      editproperty: false,
      approverequests: false,
      delivery: false,
      status: "active",
      employee_id: driverDetails.employee_id,
      company_id: driverDetails.company_id,
      branch_id: driverDetails.branch_id,
      sync_status: false,
      last_logged_account: null,
      driver_id: driverDetails.driver_id,
      customerid: driverDetails.customerid,
      otp: otpCode, 
    };

    console.log("User Data to Post:", userData);

    try {
      const response = await fetch(`${API_URL}/users`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });

      if (response.ok) {
        // Send OTP to phone number
        await sendOtpToPhone(otpCode, driverDetails.phoneNumber);
      } else {
        const errorResponse = await response.json();
        console.error("Error posting user data:", errorResponse);
        Toast.show({
          text1: "Error Posting Data",
          text2: "Failed to register user. Please try again.",
          type: "error",
          position: "top",
        });
      }
    } catch (error) {
      console.error("Error posting user data:", error);
      Toast.show({
        text1: "Network Error",
        text2: "Could not register. Please check your connection.",
        type: "error",
        position: "top",
      });
    }
  };

  const sendOtpToPhone = async (otpCode, phoneNumber) => {
    try {
      const response = await fetch(`${API_URL}/send-otp`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer YOUR_API_KEY`, // Replace with your actual API key
        },
        body: JSON.stringify({
          to: phoneNumber,
          message: `Your OTP is ${otpCode}.`,
        }),
      });

      if (response.ok) {
        Toast.show({
          text1: "OTP Sent",
          text2: "Check your SMS for the OTP.",
          type: "success",
          position: "top",
        });
        console.log("OTP sent successfully to:", phoneNumber);
      } else {
        const errorResponse = await response.json();
        console.error("Error sending OTP:", errorResponse);
        Toast.show({
          text1: "Error Sending OTP",
          text2: errorResponse.message || "Failed to send OTP. Please try again.",
          type: "error",
          position: "top",
        });
      }
    } catch (error) {
      console.error("Error sending OTP:", error);
      Toast.show({
        text1: "Network Error",
        text2: "Could not send OTP. Please check your connection.",
        type: "error",
        position: "top",
      });
    }
  };

  const handleVerifyOtp = async () => {
    const otpString = otp.join("");
    if (otpString === generatedOtp) {
      Alert.alert("Success", "OTP verified successfully.");
      // Navigate to CustomerLogin
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

      <TouchableOpacity style={styles.btnGetOtp} onPress={generateAndSendOtp}>
        <Text style={styles.txtGetOtp}>Get OTP</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.btnVerify} onPress={handleVerifyOtp}>
        {loading ? (
          <ActivityIndicator size="small" color="black" />
        ) : (
          <Text style={styles.txtVerify}>Verify OTP</Text>
        )}
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
  btnGetOtp: {
    backgroundColor: "#FFC000",
    borderRadius: 50,
    paddingVertical: 14,
    width: "90%",
    alignItems: "center",
    marginBottom: 10,
  },
  txtGetOtp: {
    color: "black",
    fontSize: 16,
    fontWeight: "bold",
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
});

export default OTPDriver;
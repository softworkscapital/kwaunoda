import React, { useState, useRef } from "react";
import {
  StyleSheet,
  View,
  TextInput,
  TouchableOpacity,
  Text,
  SafeAreaView,
  ActivityIndicator,
  Alert,
  Image,
} from "react-native";
import { useRoute } from "@react-navigation/native";
import Toast from "react-native-toast-message";
import { API_URL } from "./config";

const OTPCustomer = ({ navigation }) => {
  const route = useRoute();
  const { userId, phone_number } = route.params;
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [generatedOtp, setGeneratedOtp] = useState("");
  const APILINK = API_URL;
  const otpRefs = [useRef(null), useRef(null), useRef(null), useRef(null)];

  const generateOTP = () => {
    return Math.floor(1000 + Math.random() * 9000).toString();
  };

  const sendOtpToPhone = async (phoneNumber) => {
    const message = `Your OTP is: ${generatedOtp}`;

    try {
      const response = await fetch(
        "https://srv547457.hstgr.cloud:3003/smsendpoint",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            clientid: "1001",
            clientkey: "hdojFa502Uy6nG2",
            message,
            recipients: [`${phoneNumber}`],
            senderid: "REMS",
          }),
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Error sending OTP:", response.status, errorText);
        return false;
      }

      return true;
    } catch (error) {
      console.error("Network Error:", error);
      return false;
    }
  };

  const handleVerifyOtp = async () => {
    const otpString = otp.join("");
    setLoading(true);

    try {
      const response = await fetch(`${APILINK}/users/${userId}`);
      const userDetails = await response.json();

      if (userDetails && userDetails.length > 0) {
        const fetchedOtp = userDetails[0].otp.toString();
        if (otpString === fetchedOtp) {
          await updateUserStatus();
        } else {
          Alert.alert("Error", "Invalid OTP. Please try again.");
        }
      } else {
        Alert.alert("Error", "User details not found.");
      }
    } catch (error) {
      Alert.alert(
        "Error",
        "An error occurred while verifying OTP. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const updateUserStatus = async () => {
    const status = { status: "Verified" };
    try {
      const response = await fetch(
        `${APILINK}/users/update_status/${userId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(status),
        }
      );

      if (response.ok) {
        Alert.alert("Success", "OTP verified successfully.");
        navigation.navigate("CustomerLogin");
      } else {
        const errorResponse = await response.json();
        console.error("Error updating status:", errorResponse);
        Alert.alert("Error", "Failed to update status.");
      }
    } catch (error) {
      console.error("Error:", error);
      Alert.alert("Error", "An error occurred while verifying OTP.");
    }
  };

  const handleChange = (text, index) => {
    const newOtp = [...otp];
    newOtp[index] = text;
    setOtp(newOtp);
    if (text.length === 1 && index < otp.length - 1) {
      otpRefs[index + 1].current.focus();
    }
  };

  const handleResendOtp = async () => {
    setLoading(true);

    try {
      const newOtp = generateOTP();
      setGeneratedOtp(newOtp);
      console.log("Generated OTP:", newOtp);
      console.log("Generated userId:", userId);

      const response = await fetch(
        `${APILINK}/users/AAA-100035`
      );
      console.log("response", response);
      const userDetails = await response.json();

      console.log("userDetails", userDetails);

      console.log("starting", newOtp);
        if (userDetails && userDetails.length > 0) {
          const updateResponse = await fetch(
            `${APILINK}/users/update_otp/AAA-100035`,
            {
              method: "PUT",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ otp: newOtp }),
            }
          );
          console.log("updated");

          if (!updateResponse.ok) {
            const errorText = await updateResponse.text(); // Get the raw error text
            console.error("Error updating OTP:", errorText);
            Alert.alert("Error", "Failed to update OTP. Please try again.");
            return;
          }

          const updateResult = await updateResponse.json(); // Parse the JSON response
          console.log("Update Result:", updateResult);
          const sent = await sendOtpToPhone(phone_number);
          if (sent) {
            Alert.alert("Success", "New OTP sent successfully.");
          } else {
            Alert.alert("Error", "Failed to send new OTP.");
          }
        } else {
          Alert.alert("Error", "User not found.");
        }
    } catch (error) {
      console.error("Error:", error);
      Alert.alert("Error", "An error occurred while resending OTP.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.topBar}>
        <Image
          source={require("../../assets/icon.png")}
          style={{ width: 200, height: 80 }}
        />
      </View>

      <View style={styles.titleContainer}>
        <Text style={styles.title}>Enter OTP</Text>
      </View>
      <View style={styles.otpContainer}>
        {otp.map((digit, index) => (
          <TextInput
            key={index}
            ref={otpRefs[index]}
            style={styles.otpInput}
            value={digit}
            onChangeText={(text) => handleChange(text, index)}
            keyboardType="numeric"
            maxLength={1}
          />
        ))}
      </View>
      <TouchableOpacity
        style={styles.btnVerify}
        onPress={handleVerifyOtp}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator size="small" color="black" />
        ) : (
          <Text style={styles.txtVerify}>Verify OTP</Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity
        onPress={handleResendOtp}
        style={styles.resendContainer}
      >
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
    width: "90%",
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
    padding: 14,
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
    color: "#007BFF",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default OTPCustomer;

import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  ActivityIndicator,
  Alert,
} from "react-native";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faMapMarkerAlt } from "@fortawesome/free-solid-svg-icons";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Toast from "react-native-toast-message";
import { API_URL } from "./config";

const SignUpDriver1 = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [passwordMatch, setPasswordMatch] = useState(true);
  const [username, setUsername] = useState("");
  const [otp, setOtp] = useState(""); // State for OTP
  const [phoneNumber, setPhoneNumber] = useState(""); // State for phone number input

  const navigation = useNavigation();

  useEffect(() => {
    const generatedOtp = generateOTP();
    setOtp(generatedOtp);
    console.log("Generated OTP:", generatedOtp);
  }, []);

  function generateOTP() {
    return Math.floor(1000 + Math.random() * 9000).toString();
  }

  const validateInput = () => {
    if (!email || !password || !confirmPassword || !username || !phoneNumber) {
      showToast("Validation Error", "Please fill all fields.");
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      showToast("Validation Error", "Please enter a valid email address.");
      return false;
    }

    if (password.length < 8) {
      showToast("Validation Error", "Password must be at least 8 characters long.");
      return false;
    }

    if (password !== confirmPassword) {
      showToast("Validation Error", "Passwords do not match.");
      return false;
    }

    return true;
  };

  const showToast = (title, message) => {
    Toast.show({
      text1: title,
      text2: message,
      type: "error",
      position: "center",
      visibilityTime: 3000,
      autoHide: true,
    });
  };

  const sendOtpToPhone = async (phoneNumber) => {
    const message = `Your OTP is: ${otp}`;

    try {
      const response = await fetch("https://srv547457.hstgr.cloud:3003/smsendpoint", {
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
      });

      return true; // Assuming the OTP was sent successfully
    } catch (error) {
      console.error("Network Error:", error);
      showToast("Error", "Could not send OTP. Please check your connection.");
      return false;
    }
  };

  const checkPasswordStrength = (password) => {
    let strength = 0;
    const regexWeak = /[a-z]/;
    const regexMedium = /[A-Z]/;
    const regexStrong = /\d/;

    if (regexWeak.test(password)) strength++;
    if (regexMedium.test(password)) strength++;
    if (regexStrong.test(password)) strength++;
    if (password.length >= 12) strength++;

    setPasswordStrength(strength);
    setPasswordMatch(password === confirmPassword);
  };

  const incrementId = (currentId) => {
    const [letters, number] = currentId.split("-");
    let newNumber = parseInt(number, 10) + 1;

    if (newNumber > 999999) {
      newNumber = 1;
      const newLetters = incrementLetters(letters);
      return `${newLetters}-${newNumber.toString().padStart(6, "0")}`;
    }

    return `${letters}-${newNumber.toString().padStart(6, "0")}`;
  };

  const incrementLetters = (letters) => {
    const lettersArray = letters.split("");
    let carry = true;

    for (let i = lettersArray.length - 1; i >= 0 && carry; i--) {
      if (lettersArray[i] === "Z") {
        lettersArray[i] = "A";
      } else {
        lettersArray[i] = String.fromCharCode(lettersArray[i].charCodeAt(0) + 1);
        carry = false;
      }
    }

    if (carry) {
      lettersArray.unshift("A");
    }

    return lettersArray.join("");
  };

  const handleNext = async () => {
    if (!validateInput()) return;

    const APILINK = API_URL;
    setLoading(true);

    try {
      const driveData = await AsyncStorage.getItem("driverDetailsD0");
      const driverDetails = JSON.parse(driveData);

      const otpSent = await sendOtpToPhone(phoneNumber);
      if (!otpSent) {
        setLoading(false);
        return;
      }

      const idResponse = await fetch(`${APILINK}/users/last_user_id/`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!idResponse.ok) {
        console.error("Error fetching last inserted ID:", idResponse.status);
        showToast("Error", "Failed to fetch last inserted ID.");
        return;
      }

      const idResult = await idResponse.json();
      const lastUserId = idResult[0].userid;

      let user_id = incrementId(lastUserId);

      // Save user ID in local storage
      await AsyncStorage.setItem("user_id", user_id); // Store user_id for OTP page

      const user = {
        userId: user_id,
        role: "driver",
        username: username.trim(),
        email: email.trim(),
        password: password,
        otp: otp,
        notify: false, // Set default values
        activesession: false,
        addproperty: false,
        editproperty: false,
        approverequests: false,
        delivery: false,
        status: "Pending OTP Verification", // Set status as pending
        employee_id: null,
        company_id: null,
        branch_id: null,
        sync_status: "Pending",
        last_logged_account: "driver",
        driverId: user_id,
        customerId: 0,
      };

      console.log("User object to be sent:", user);
      
      // Save user details to local storage
      await AsyncStorage.setItem("driverDetails", JSON.stringify(user));

      await AsyncStorage.setItem("driver_id", JSON.stringify(user_id)); 
      console.log("wadzanai anopenga", user_id);

      const userResp = await fetch(`${APILINK}/users/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(user),
      });

      if (!userResp.ok) {
        const errorText = await userResp.text();
        console.error("Error posting to user details:", userResp.status, errorText);
        showToast("Error", "Failed to create user.");
        return;
      }

      const driver = {
        driver_id: user_id,
        ecnumber: "",
        account_type: "driver",
        signed_on: new Date().toISOString(),
        username: username.trim(),
        name: driverDetails.name.trim(),
        surname: driverDetails.surname.trim(),
        idnumber: driverDetails.idnumber.trim(),
        phone: phoneNumber.trim(),
        plate: driverDetails.plate.trim(),
        email: email.trim(),
        password: password,
        profilePic: driverDetails.profilePicPath.trim(),
        id_image: driverDetails.idPicPath.trim(),
        number_plate_image: driverDetails.platePicPath.trim(),
        driver_license_image: driverDetails.driversLicensePicPath.trim(),
        sex: driverDetails.sex || "",
        dob: driverDetails.dob || "",
        address: driverDetails.address || "",
        house_number_and_street_name: driverDetails.house_number_and_street_name || "",
        suburb: driverDetails.suburb || "",
        city: driverDetails.city || "",
        country: driverDetails.country || "",
        membershipstatus: "Pending OTP Verification",
      };

      const driverResp = await fetch(`${APILINK}/driver/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(driver),
      });

      if (!driverResp.ok) {
        const errorText = await driverResp.text();
        console.error("Error posting to driver details:", driverResp.status, errorText);
        showToast("Error", "Failed to create driver.");
        return;
      }

      const driverResponse = await driverResp.json();
      Alert.alert("Success", driverResponse.message);
      navigation.navigate("OTPDriver", { userId: user_id });
    } catch (error) {
      console.error("Error:", error);
      Alert.alert("Error", "Failed to save details. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.topBar}>
        <FontAwesomeIcon icon={faMapMarkerAlt} size={40} color="red" />
        <Text style={styles.appName}>DropX</Text>
      </View>
      <ScrollView>
        <View style={styles.formContainer}>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Username"
              value={username}
              onChangeText={setUsername}
              keyboardType="default"
            />
          </View>

          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Email"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
            />
          </View>

          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="+263 716 056 317"
              value={phoneNumber}
              onChangeText={setPhoneNumber}
              keyboardType="phone-pad"
            />
          </View>

          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Password"
              value={password}
              onChangeText={(text) => {
                setPassword(text);
                checkPasswordStrength(text);
              }}
              secureTextEntry
            />
          </View>

          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Confirm Password"
              value={confirmPassword}
              onChangeText={(text) => {
                setConfirmPassword(text);
                setPasswordMatch(text === password);
              }}
              secureTextEntry
            />
          </View>

          <View style={styles.strengthContainer}>
            <View
              style={[styles.strengthBar, passwordStrength >= 1 && styles.weak]}
            />
            <View
              style={[
                styles.strengthBar,
                passwordStrength >= 2 && styles.medium,
              ]}
            />
            <View
              style={[
                styles.strengthBar,
                passwordStrength >= 3 && styles.strong,
              ]}
            />
          </View>
          <Text style={styles.strengthText}>
            {passwordStrength === 0
              ? ""
              : passwordStrength === 1
              ? "Weak"
              : passwordStrength === 2
              ? "Medium"
              : "Strong"}
          </Text>
          {!passwordMatch && (
            <Text style={styles.errorText}>Passwords do not match.</Text>
          )}

          <TouchableOpacity style={styles.btnNext} onPress={handleNext}>
            {loading ? (
              <ActivityIndicator size="small" color="black" />
            ) : (
              <Text style={styles.txtNext}>Next</Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
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
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    marginBottom: 15,
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    paddingHorizontal: 10,
  },
  input: {
    height: 40,
    padding: 10,
  },
  strengthContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 5,
  },
  strengthBar: {
    flex: 1,
    height: 10,
    marginHorizontal: 2,
    backgroundColor: "#e0e0e0",
    borderRadius: 5,
  },
  weak: {
    backgroundColor: "red",
  },
  medium: {
    backgroundColor: "orange",
  },
  strong: {
    backgroundColor: "#FFC000",
  },
  strengthText: {
    alignSelf: "center",
    fontWeight: "bold",
    marginBottom: 5,
  },
  errorText: {
    color: "red",
    alignSelf: "center",
    marginBottom: 10,
  },
  btnNext: {
    backgroundColor: "#FFC000",
    borderRadius: 50,
    padding: 14,
    width: "100%",
    alignItems: "center",
  },
  txtNext: {
    color: "black",
    fontSize: 13,
    fontWeight: "bold",
  },
});

export default SignUpDriver1;
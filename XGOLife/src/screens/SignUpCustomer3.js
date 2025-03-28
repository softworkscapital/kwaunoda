import React, { useEffect, useState } from "react";
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
  Image,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faMapMarkerAlt } from "@fortawesome/free-solid-svg-icons";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Toast from "react-native-toast-message";
import { API_URL, API_URL_UPLOADS } from "./config";
import MD5 from 'react-native-md5';

const SignUpCustomer3 = () => {
  const [username, setUsername] = useState("");
  const [profileImage, setProfileImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [userDetails, setUserDetails] = useState(null);
  const [user1, setUser1] = useState(null);
  const [otp, setOtp] = useState(0);
  const navigation = useNavigation();
  const APILINK = API_URL;

  const fetchUserDetails = async () => {
    try {
      const custData = await AsyncStorage.getItem("customerDetailsC0");
      const custDetails = JSON.parse(custData);
      setUser1(custDetails);

      const cData = await AsyncStorage.getItem("userDetailsC2");
      if (cData) {
        const custDetails2 = JSON.parse(cData);
        setUserDetails(custDetails2);
      }
    } catch (error) {
      console.error("Error retrieving user details:", error);
    }
  };

  useEffect(() => {
    fetchUserDetails();
  }, []);

  const handleImagePick = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setProfileImage(result.assets[0].uri);
    }
  };

  const validateInput = () => {
    if (!username) {
      showToast("Please enter a username.");
      return false;
    }
    if (!profileImage) {
      showToast("Please select a profile image.");
      return false;
    }
    return true;
  };

  const showToast = (message) => {
    Toast.show({
      text1: "Validation Error",
      text2: message,
      type: "error",
      position: "center",
      visibilityTime: 3000,
      autoHide: true,
    });
  };

  const fetchLastUserId = async () => {
    try {
      const response = await fetch(`${APILINK}/users/last_user_id`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to fetch last inserted ID: ${response.status} ${errorText}`);
      }
      const idResult = await response.json();
      if (!idResult || !Array.isArray(idResult) || idResult.length === 0) {
        throw new Error("Invalid response structure: No user ID found.");
      }
      return idResult[0].userid;
    } catch (error) {
      console.error("Error fetching last user ID:", error);
      Alert.alert("Error", error.message);
      throw error;
    }
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

  useEffect(() => {
    const generatedOtp = generateOTP();
    setOtp(generatedOtp);
    console.log("Generated OTP:", generatedOtp);
  }, []);

  function generateOTP() {
    return Math.floor(1000 + Math.random() * 9000).toString();
  }

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

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Error sending OTP:", response.status, errorText);
        showToast("Error", "Failed to send OTP.");
        return false;
      }

      return true;
    } catch (error) {
      console.error("Network Error:", error);
      showToast("Error", "Could not send OTP. Please check your connection.");
      return false;
    }
  };

  const handleSignUp = async () => {
    if (!validateInput()) return;

    setLoading(true);

    try {
      const verificationUrl = `${APILINK}/customerdetails/customer_verify/${userDetails.email}/${user1.phone}/${user1.idnumber}`;
      console.log("Fetching from URL:", verificationUrl);

      const resp = await fetch(verificationUrl, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!resp.ok) {
        const errorText = await resp.text();
        throw new Error(`Network request failed: ${resp.status} ${errorText}`);
      }

      const result = await resp.json();

      if (result.length > 0) {
        Alert.alert("Error", "A user with the same email, phone number, or ID number already exists.");
        return;
      } else {
        try {
          const lastUserId = await fetchLastUserId();
          const newUserId = incrementId(lastUserId);
          const md5Hash = MD5.hex_md5(userDetails.password);

          const generateReferralCode = () => {
            const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
            let referralCode = '';
            for (let i = 0; i < 8; i++) {
              const randomIndex = Math.floor(Math.random() * characters.length);
              referralCode += characters[randomIndex];
            }
            return referralCode;
          };

          const generateReferencePaymentCode = () => {
            return `PAY-${Math.floor(1000 + Math.random() * 9000)}`;
          };

          const referralCode = generateReferralCode();
          const referencePaymentCode = generateReferencePaymentCode();

          const referredBy = await AsyncStorage.getItem("referred_by");
          console.log("Referred By ID:", referredBy); // Log referred_by ID

          const user = {
            userId: newUserId,
            role: "customer",
            username: username.trim(),
            email: userDetails.email.trim(),
            password: md5Hash,
            otp: otp,
            notify: false,
            activesession: false,
            addproperty: false,
            editproperty: false,
            approverequests: false,
            delivery: false,
            status: "Pending OTP Verification",
            sync_status: "Pending",
            last_logged_account: "customer",
            driverId: 0,
            customerId: newUserId,
            referral_code: referralCode,
            reference_payment_status: referencePaymentCode,
            referred_by: referredBy // Include the referred_by ID
          };

          console.log("User object to be created:", user);

          await createUser(user);

          await createCustomerDetails(newUserId);

          Alert.alert("Success", "User signed up. Now verify your number using the OTP we sent to your phone.");
          navigation.navigate("OTPCustomer", { userId: newUserId });
        } catch (error) {
          console.error("Sign-up error:", error);
          Alert.alert("Error", error.message || "Failed to sign up. Please try again.");
        } finally {
          setLoading(false);
        }
      }
    } catch (error) {
      console.error("Error during verification:", error);
      Alert.alert("Error", error.message || "Failed to verify user details. Please try again.");
      setLoading(false);
    }
  };

  const createUser = async (user) => {
    const response = await fetch(`${APILINK}/users/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(user),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to create user: ${errorText}`);
    } else {
      sendOtpToPhone(user1.phone);
    }
  };

  const handleImageUpload = async (imageUri) => {
    const formData = new FormData();
    const fileName = imageUri.split("/").pop();
    const type = `image/${fileName.split(".").pop()}`;

    formData.append("image", {
      uri: imageUri,
      name: fileName,
      type: type,
    });

    try {
      const response = await fetch(`${API_URL_UPLOADS}/uploads`, {
        method: "POST",
        body: formData,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      const data = await response.json();
      return `${data.path}`;
    } catch (error) {
      console.error("Upload error:", error);
      throw new Error("Failed to upload image");
    }
  };

  const createCustomerDetails = async (userId) => {
    const profilepic = await handleImageUpload(profileImage);

    const newCustomer = {
      customerid: userId,
      ecnumber: user1.ecnumber || "",
      account_type: user1.accountType || "",
      account_category: user1.account_category || "",
      signed_on: user1.signed_on || new Date().toISOString(),
      name: user1.name || "",
      surname: user1.surname || "",
      idnumber: user1.idnumber || "",
      sex: user1.sex || "",
      dob: user1.dob || "",
      address: user1.address || "",
      house_number_and_street_name: user1.house_number_and_street_name || "",
      suburb: user1.suburb || "",
      city: user1.city || "",
      country: user1.country || "",
      lat_coordinates: user1.lat_coordinates || "",
      long_coordinates: user1.long_coordinates || "",
      phone: user1.phone || "",
      username: username.trim(),
      email: userDetails.email || "",
      password: userDetails.password || "",
      employer: user1.employer || "",
      workindustry: user1.workindustry || "",
      workaddress: user1.workaddress || "",
      workphone: user1.workphone || "",
      workphone2: user1.workphone2 || "",
      nok1name: user1.nok1name || "",
      nok1surname: user1.nok1surname || "",
      nok1relationship: user1.nok1relationship || "",
      nok1phone: user1.nok1phone || "",
      nok2name: user1.nok2name || "",
      nok2surname: user1.nok2surname || "",
      nok2relationship: user1.nok2relationship || "",
      nok2phone: user1.nok2phone || "",
      creditstanding: user1.creditstanding || "",
      credit_bar_rule_exception: user1.credit_bar_rule_exception || "",
      membershipstatus: user1.membershipstatus || "",
      defaultsubs: user1.defaultsubs || "",
      sendmail: user1.sendmail ? "true" : "false",
      sendsms: user1.sendsms ? "true" : "false",
      product_code: user1.product_code || "",
      cost_price: user1.cost_price !== undefined ? user1.cost_price.toString() : "0",
      selling_price: user1.selling_price !== undefined ? user1.selling_price.toString() : "0",
      payment_style: user1.payment_style || "",
      bp_number: user1.bp_number || "",
      vat_number: user1.vat_number || "",
      profilePic: profilepic.trim(),
    };

    const response = await fetch(`${APILINK}/customerdetails/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newCustomer),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to create customer details: ${errorText}`);
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
      <ScrollView>
        <View style={styles.formContainer}>
          <TouchableOpacity
            style={styles.imagePicker}
            onPress={handleImagePick}
          >
            {profileImage ? (
              <Image
                source={{ uri: profileImage }}
                style={styles.profileImage}
              />
            ) : (
              <FontAwesomeIcon icon={faMapMarkerAlt} size={50} color="#ccc" />
            )}
          </TouchableOpacity>

          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Username"
              value={username}
              onChangeText={setUsername}
            />
          </View>

          <TouchableOpacity style={styles.btnSignUp} onPress={handleSignUp} disabled={loading}>
            {loading ? (
              <ActivityIndicator size="small" color="black" />
            ) : (
              <Text style={styles.txtSignUp}>Sign Up</Text>
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
  formContainer: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
  },
  imagePicker: {
    height: 150,
    width: 150,
    borderRadius: 75,
    backgroundColor: "#f0f0f0",
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
    marginBottom: 20,
  },
  profileImage: {
    height: "100%",
    width: "100%",
    borderRadius: 75,
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

export default SignUpCustomer3;
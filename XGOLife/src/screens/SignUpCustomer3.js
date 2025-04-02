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
import { faCamera, faMapMarkerAlt } from "@fortawesome/free-solid-svg-icons";
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

  // Fetch user details from AsyncStorage
  const fetchUserDetails = async () => {
    try {
      const custData = await AsyncStorage.getItem("customerDetailsC0");
      const custDetails = JSON.parse(custData);
      setUser1(custDetails);
      // console.log("from page 3", custDetails);

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

  // Handle image selection
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

  // Validate input fields
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

  // Show toast messages
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

  // Fetch last user ID from the API
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
        throw new Error(`Failed to fetch last inserted ID: ${errorText}`);
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

  // Increment user ID
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
        lettersArray[i] = String.fromCharCode(
          lettersArray[i].charCodeAt(0) + 1
        );
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

  // Send OTP to phone
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

  // Handle sign-up process
  const handleSignUp = async () => {
    if (!validateInput()) return; // Validate inputs before proceeding
  
    setLoading(true); // Start loading state
  
    try {
      // Verify driver details
      const resp = await fetch(`${APILINK}/customerdetails/customer_verify/${userDetails.email}/${user1.phone}/${user1.idnumber}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
  
      const result = await resp.json();
  
      // Check if a user with the same email, phone number, or ID number already exists
      if (result.length > 0) {
        Alert.alert("Error", "A user with the same email, phone number, or ID number already exists.");
        return; // Early return if verification fails
      } else {
        try {
          // Fetch last user ID and increment it
          const lastUserId = await fetchLastUserId();
          const newUserId = incrementId(lastUserId);
          console.log("New User ID:", newUserId); // Log the new user ID

          const referredBy = await AsyncStorage.getItem("customer_referred_by");
          console.log("Referred By ID:", referredBy); 

          // Generate reference code
          const referenceCode = `${newUserId.slice(0, -1)}${parseInt(newUserId.slice(-1)) + 1}${generateRandomLetters(2)}`;
          console.log("Generated Reference Code:", referenceCode); // Log the reference code

          const md5Hash = MD5.hex_md5(userDetails.password);
          // Create user object
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
            signed_up_on: new Date().toISOString(),
            driverId: 0,
            customerId: newUserId, // Set customerId to newUserId
            referral_code: referenceCode, // Use the generated referral code
            reference_payment_status: null,
            signed_up_on: new Date().toISOString(),
            referred_by: referredBy, // Include reference code
          };
  
          // Create the user in the database
          await createUser(user);
  
          // Create customer details
          await createCustomerDetails(newUserId); // Ensure newUserId is passed correctly
  
          Alert.alert("Success", "User signed up Now Verify Your Number Using the OTP we sent to your Phone.");
          navigation.navigate("OTPCustomer", { userId: newUserId }); // Navigate to OTP page
        } catch (error) {
          console.error("Sign-up error:", error);
          Alert.alert("Error", error.message || "Failed to sign up. Please try again.");
        } finally {
          setLoading(false); // Ensure loading state is reset
        }
      }
    } catch (error) {
      console.error("Error during verification:", error);
      Alert.alert("Error", "Failed to verify user details. Please try again.");
      setLoading(false); // Ensure loading state is reset
    }
  };

  // Generate two random letters
  const generateRandomLetters = (length) => {
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let result = '';
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * letters.length);
      result += letters[randomIndex];
    }
    return result;
  };

  // Create user API call
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

  // Image upload
  const handleImageUpload = async (imageUri) => {
    // console.log("Image", imageUri);
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
      return `${data.path}`; // Return the full URL
    } catch (error) {
      console.error("Upload error:", error);
      throw new Error("Failed to upload image");
    }
  };

  // Create customer details API call
  const createCustomerDetails = async (userId) => {
    const profilepic = await handleImageUpload(profileImage);

    const md5Hash = MD5.hex_md5(userDetails.password);
    const newCustomer = {
      customerid: userId,
      ecnumber: user1.ecnumber || "",
      account_type: user1.accountType || "",
      account_category: user1.account_category || "",
      signed_on: new Date().toISOString(),
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
      password: md5Hash || "",
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

    console.log("Going from page 3", newCustomer);

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
          style={{ width: 200, height: 80 }} // Set width and height to 40
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
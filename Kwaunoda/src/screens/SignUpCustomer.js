import React, { useState } from "react";
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
import {
  faUser,
  faPhone,
  faIdCard,
  faMapMarkerAlt,
} from "@fortawesome/free-solid-svg-icons";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Toast from "react-native-toast-message";
import { API_URL } from "./config";
import { Picker } from '@react-native-picker/picker';

const SignUpCustomer = () => {
  const [name, setName] = useState("");
  const [surname, setSurname] = useState("");
  const [phone, setPhone] = useState("");
  const [idnumber, setIdnumber] = useState("");
  const [loading, setLoading] = useState(false);
  const accountType = "customer";
  const membershipstatus = "Pending OTP Verification"


  const [countryCode, setCountryCode] = React.useState('263'); // Zimbabwe's country code

  const navigation = useNavigation();

  const redirectCustomerSignUp2 = () => {
    navigation.navigate("SignUpCustomer2");
  };

  const validateInput = () => {
    if (!name || !surname || !phone || !idnumber) {
      Toast.show({
        type: "error",
        text1: "Validation Error",
        text2: "Please fill all fields.",
        position: "center",
        visibilityTime: 3000,
        autoHide: true,
      });
      return false;
    }

    if (!/^\d+$/.test(phone)) {
      Toast.show({
        type: "error",
        text1: "Validation Error",
        text2: "Phone number must be more than 8 digits.",
        position: "center",
        visibilityTime: 3000,
        autoHide: true,
      });
      return false;
    }



    return true;
  };

  const handleSignUp = async () => {
    if (!validateInput()) return;

    setLoading(true);

    const customerDetails = { name, surname, phone, idnumber, accountType, membershipstatus };

    try {
      await AsyncStorage.setItem(
        "customerDetailsC0",
        JSON.stringify(customerDetails)
      );
      console.log("Customer details stored in Async Storage:", customerDetails);
      redirectCustomerSignUp2();
    } catch (error) {
      console.error("Error:", error);
      Alert.alert("Error", "Failed to sign up. Please try again.");
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
          <View>
            <Text
              style={{ alignSelf: "center", fontSize: 14, marginBottom: 10 }}
            >
              Sign Up As Customer
            </Text>
          </View>

          <View style={styles.inputContainer}>
            <FontAwesomeIcon icon={faUser} size={12} style={styles.icon} />
            <TextInput
              style={styles.input}
              placeholder="Name"
              value={name}
              onChangeText={setName}
            />
          </View>

          <View style={styles.inputContainer}>
            <FontAwesomeIcon icon={faUser} size={12} style={styles.icon} />
            <TextInput
              style={styles.input}
              placeholder="Surname"
              value={surname}
              onChangeText={setSurname}
            />
          </View>

          <View style={styles.inputContainer}>
            <FontAwesomeIcon icon={faPhone} size={12} style={styles.icon} />
            <TextInput
              style={styles.input}
              placeholder="Phone eg 263777111222"
              value={phone}
              onChangeText={setPhone}
              keyboardType="phone-pad"
            />
          </View>

          <View style={styles.inputContainer}>
            <FontAwesomeIcon icon={faIdCard} size={12} style={styles.icon} />
            <TextInput
              style={styles.input}
              placeholder="id number e.g 63-8888888A63"
              value={idnumber}
              onChangeText={setIdnumber}
            />
          </View>

          <TouchableOpacity
            style={styles.btnSignUp}
            onPress={handleSignUp}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator size="small" color="black" />
            ) : (
              <Text style={styles.txtSignUp}>Next</Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
      {/* <Toast ref={(ref) => Toast.setRef(ref)} /> */}
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

export default SignUpCustomer;

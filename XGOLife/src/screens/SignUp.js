import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Alert,
  ActivityIndicator,
  Image,
} from "react-native";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import {
  faEnvelope,
  faLock,
  faCheckCircle,
} from "@fortawesome/free-solid-svg-icons";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Toast from "react-native-toast-message";
import { API_URL } from "./config";
import MD5 from 'react-native-md5';


const SignUp = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [customerID, setCustomerID] = useState(0);
  const [loading, setLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const navigation = useNavigation();

  const redirectSignUpCustomer = () => {
    navigation.navigate("TermsConditions");
  };

  const redirectSignUpDriver = () => {
    navigation.navigate("DriverTerms");
  };

  const handleSignIn = () => {
    navigation.navigate("CustomerLogin");
  };


  return (
    <SafeAreaView style={styles.container}>
      {/* <View style={styles.topBar}>
        <Image
          source={require("../../assets/icon.png")}
          style={{ width: 150, height: 180, resizeMode: 'contain'}} 
        />
      </View> */}
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.formContainer}>
        {/* <Text style={styles.rememberText}>
            WELCOME
          </Text> */}
          <TouchableOpacity
            style={[styles.button, { marginTop: 30 }]}
            onPress={redirectSignUpCustomer}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator size="small" color="#000" />
            ) : (
              <Text style={styles.buttonText}>Create Account As Customer</Text>
            )}
          </TouchableOpacity>
  
          <TouchableOpacity
            style={[styles.button, { marginTop: 30, marginBottom: 5 }]}
            onPress={redirectSignUpDriver}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator size="small" color="#000" />
            ) : (
              <Text style={styles.buttonText}>Create Account As Driver</Text>
            )}
          </TouchableOpacity>
  
          {/* Line Separator */}
          <View style={{ height: 1, backgroundColor: '#002966', marginVertical: 20, marginHorizontal: 60, }} />

          <Text style={styles.rememberText2}>
            Already have an Account?
          </Text>
  
          <TouchableOpacity
            style={[styles.button, { marginTop: 20, alignSelf: "center" }]}
            onPress={handleSignIn}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator size="small" color="#000" />
            ) : (
              <Text style={styles.buttonText}>Sign In</Text>
            )}
          </TouchableOpacity>
  
        </View>
      </ScrollView>
      <View style={{ bottom: 0, paddingTop: 15, paddingBottom: 15 }}>
        {/* Additional content can go here */}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffc000",
    paddingTop:200,
  },
  topBar: {
    height: "25%",
    backgroundColor: "#FFC000",
    borderBottomLeftRadius: 45,
    borderBottomRightRadius: 45,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
    top: 0
  },
  formContainer: {
    flex: 1,
    padding: 20,
    marginTop: 70,
    justifyContent: "center",
    
  },


  button: {
    backgroundColor: "#002966",
    borderRadius: 50,
    padding: 14,
    width: "100%",
    alignItems: "center",
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 4,
  },
  buttonText: {
    color: 'white',
    fontSize: 12,
    marginRight: 10,
  },

  icon: {
    marginRight: 15,
    marginLeft: 10,
  },
  input: {
    flex: 1,
  },
  rememberText: {
    fontSize: 25,
    alignSelf: "center",
  },
  rememberText2: {
    fontSize: 14,
    alignSelf: "center",
  },
  btnSignUp: {
    backgroundColor: "#FFC000",
    borderRadius: 50,
    padding: 14,
    width: "100%",
    alignItems: "center",
  },
  btnSignUp2: {
    backgroundColor: "#FFC000",
    borderRadius: 50,
    padding: 14,
    width: "90%",
    alignItems: "center",
  },
  txtSignUp: {
    color: "black",
    fontSize: 13,
    fontWeight: "bold",
  },
});

export default SignUp;
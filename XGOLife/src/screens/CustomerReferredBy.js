import React, { useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_URL } from "./config"; 
import { useNavigation } from "@react-navigation/native";
import Icon from "react-native-vector-icons/Ionicons"; // Ensure you have installed react-native-vector-icons

const CustomerReferredBy = () => {
  const [referenceCode, setReferenceCode] = useState("");
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();

  const handleBack = () => {
    navigation.goBack();
  };

  const handleSkip = () => {
    navigation.navigate("TermsConditions");
  };

  const handleSubmit = async () => {
    if (!referenceCode) {
      Alert.alert("Error", "Please enter a reference code.");
      return;
    }
  
    setLoading(true); // Start loading
  
    try {
      const response = await fetch(`${API_URL}/users/GetUserByReferenceCode/${referenceCode}`);
      const result = await response.json();
  
      console.log("API Response:", result); // Log the entire response for debugging
  
      if (response.ok) {
        if (result && result.userid) { // Check if result and result.userid exist
          setUserInfo(result);
          console.log(`Referred By User ID: ${result.userid}`); // Log referred by user ID
          await AsyncStorage.setItem("referred_by", result.userid); // Store user ID in Async Storage
          navigation.navigate("TermsConditions"); // Redirect to TermsConditions
        } else {
          Alert.alert("Error", "User not found for the provided reference code.");
        }
      } else {
        Alert.alert("Error", result.message || "Failed to fetch user info.");
      }
    } catch (error) {
      console.error("Error fetching user info:", error);
      Alert.alert("Error", "An error occurred while fetching user info.");
    } finally {
      setLoading(false); // Stop loading
    }
  };






  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={handleBack} style={styles.backButton}>
        <Icon name="arrow-back" size={24} color="#000" />
      </TouchableOpacity>
      <Text style={styles.title}>Enter Reference Code</Text>
      <TextInput
        style={styles.input}
        placeholder="Reference Code"
        value={referenceCode}
        onChangeText={setReferenceCode}
      />
      <TouchableOpacity style={styles.button} onPress={handleSubmit} disabled={loading}>
        <Text style={styles.buttonText}>{loading ? "Loading..." : "Continue"}</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.skipButton} onPress={handleSkip}>
        <Text style={styles.skipButtonText}>Skip</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
    backgroundColor: "#fff", 
  },
  backButton: {
    position: "absolute",
    top: 40,
    left: 20,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
  input: {
    height: 40,
    backgroundColor: "#f0f0f0", 
    marginBottom: 20,
    paddingHorizontal: 10,
    borderWidth: 0,
  },
  button: {
    backgroundColor: "#FFD700", 
    padding: 10,
    alignItems: "center",
  },
  buttonText: {
    color: "#000",
    fontSize: 16,
  },
  skipButton: {
    marginTop: 10,
    alignItems: "center",
  },
  skipButtonText: {
    color: "#007BFF",
    fontSize: 16,
  },
  userInfo: {
    marginTop: 20,
  },
});

export default CustomerReferredBy;
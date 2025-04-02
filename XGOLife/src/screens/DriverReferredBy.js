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
import { API_URL } from "./config"; // Ensure to have your API_URL available
import { useNavigation } from "@react-navigation/native";
import Icon from "react-native-vector-icons/Ionicons"; // Import Ionicons

const DriverReferredBy = () => {
  const [referenceCode, setReferenceCode] = useState("");
  const [userInfo, setUserInfo] = useState(null);
  const navigation = useNavigation();

  const handleBack = () => {
    navigation.goBack(); // Navigate back to the previous screen
  };

  const handleSubmit = async () => {
    if (!referenceCode) {
      Alert.alert("Error", "Please enter a reference code.");
      return;
    }

    try {
      const response = await fetch(`${API_URL}/users/GetUserByReferenceCode/${referenceCode}`);
      const result = await response.json();

      console.log("API Response:", result); // Log the entire response for debugging

      if (response.ok) {
        if (result && result.userid) {
          setUserInfo(result);
          console.log(`Referred By User ID: ${result.userid}`); // Log referred by user ID
          await AsyncStorage.setItem("referred_by", result.userid); // Store user ID in Async Storage
          navigation.navigate("DriverTerms"); // Redirect to DriverTerms
        } else {
          Alert.alert("Error", "User not found for the provided reference code.");
        }
      } else {
        Alert.alert("Error", result.message || "Failed to fetch user info.");
      }
    } catch (error) {
      console.error("Error fetching user info:", error);
      Alert.alert("Error", "An error occurred while fetching user info.");
    }
  };

  const handleSkip = () => {
    navigation.navigate("DriverTerms"); // Redirect to DriverTerms without reference code
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
      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Continue</Text>
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
    backgroundColor: "#fff", // Ensure the background is white
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
    backgroundColor: "#f0f0f0", // Light gray background
    marginBottom: 20,
    paddingHorizontal: 10,
    borderWidth: 0, // No borders
  },
  button: {
    backgroundColor: "#FFD700", // Golden yellow background
    padding: 10,
    alignItems: "center",
  },
  buttonText: {
    color: "#000", // Black text
    fontSize: 16,
  },
  skipButton: {
    marginTop: 15,
    padding: 10,
    alignItems: "center",
  },
  skipButtonText: {
    color: "#007BFF", // Blue text for skip
    fontSize: 16,
  },
  userInfo: {
    marginTop: 20,
  },
});

export default DriverReferredBy;
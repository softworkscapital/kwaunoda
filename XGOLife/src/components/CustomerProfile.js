import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  Image,
  Modal,
  TouchableOpacity,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_URL, API_URL_UPLOADS } from "../screens/config";
import { FontAwesome } from "@expo/vector-icons";

const CustomerProfile = () => {
  const [profileImage, setPic] = useState();
  const [customerType, setType] = useState("");
  const [name, setName] = useState("");
  const [id, setid] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const storedIds = await AsyncStorage.getItem("theIds");
        if (storedIds) {
          const parsedIds = JSON.parse(storedIds);
          let acc =
            parsedIds.last_logged_account === "driver"
              ? parsedIds.driver_id
              : parsedIds.customerId;
          setid(acc);
          await fetchUserDetails(acc, parsedIds.last_logged_account);
        } else {
          Alert.alert("Driver ID not found", "Please log in again.");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        Alert.alert("Error", "An error occurred while fetching data.");
      }
    };

    const fetchUserDetails = async (id, type) => {
      try {
        const endpoint =
          type === "driver" ? `driver/${id}` : `customerdetails/${id}`;
        const response = await fetch(`${API_URL}/${endpoint}`);
        const result = await response.json();

        if (result && result.length > 0) {
          await AsyncStorage.setItem("userDetails", JSON.stringify(result[0]));
          setPic(
            result[0].profilePic
              ? `${API_URL_UPLOADS}/${result[0].profilePic.replace(/\\/g, "/")}`
              : null
          );
          setType(result[0].account_type);
          setName(result[0].username);
        } else {
          Alert.alert(`${type === "driver" ? "Driver" : "Customer"} details not found.`);
        }
      } catch (error) {
        Alert.alert("Error", "Failed to fetch details. Please try again.");
      }
    };

    fetchData();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.profileContainer}>
        {profileImage ? (
          <Image source={{ uri: profileImage }} style={styles.profileImage} />
        ) : (
          <View style={styles.profileImagePlaceholder}>
            <FontAwesome name="user" size={60} color="gray" />
          </View>
        )}
        <Text style={styles.profileName}>{name || "No Name"}</Text>
        <Text style={styles.roleText}>{customerType === "customer" ? "Customer" : "Driver"}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
  },
  profileContainer: {
    alignItems: "center",
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
  },
  profileImagePlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f0f0f0",
    marginBottom: 10,
  },
  profileName: {
    fontSize: 18,
    fontWeight: "bold",
  },
  roleText: {
    fontSize: 14,
    color: "gray",
  },
});

export default CustomerProfile;
import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  Animated,
  TouchableOpacity,
  Alert,
  SafeAreaView,
  StatusBar,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_URL } from "./config";
import Toast from "react-native-toast-message";

const Welcome = ({ navigation, route }) => {
  const { email } = route.params;
  const [fadeAnim] = useState(new Animated.Value(0));
  const [rotationAnim] = useState(new Animated.Value(0));
  const [loading, setLoading] = useState(false);
  const [customerId, setCustomerID] = useState(null);
  const [userName, setUserName] = useState("");
  const [userStatus, setUserStatus] = useState("");

  const fetchUserDetails = async () => {
    setLoading(true);
    try {
      const hashedPassword = await AsyncStorage.getItem("hashedPassword");
      console.log("Hashed Password:", hashedPassword);

      const response = await fetch(
        `${API_URL}/users/login/${email}/${hashedPassword}`,
        {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        }
      );

      const result = await response.json();
      console.log("API Response:", result);

      const customerId = result[0]?.customerid;
      console.log("Customer ID:", customerId);
      setCustomerID(customerId);

      if (response.ok && result.length > 0) {
        const userId = result[0]?.driver_id;

        const userResponse = await fetch(`${API_URL}/users/${userId}`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });

        const userInfo = await userResponse.json();
        console.log("User Info:", userInfo);

        if (userResponse.ok && userInfo.length > 0) {
          const name = userInfo[0].username;
          const status = userInfo[0].status;
          setUserName(name);
          setUserStatus(status);

          Alert.alert(
            "Welcome",
            `Welcome ${name}, your account is ${status} and it's going to be verified by the XGO Life agents. Please be patient.`
          );
        }

        await AsyncStorage.setItem("driver", JSON.stringify(userId));
        await AsyncStorage.setItem("theIds", JSON.stringify(result[0]));
        await AsyncStorage.setItem("theCustomerId", JSON.stringify(customerId));
      } else {
        Alert.alert("Error", "No user found or wrong password/email.");
      }
    } catch (error) {
      console.log("Error fetching user details:", error);
      Toast.show({
        text1: "Error",
        text2: "An error occurred. Please try again.",
        type: "error",
        position: "center",
        visibilityTime: 3000,
        autoHide: true,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserDetails();

    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();

    Animated.loop(
      Animated.timing(rotationAnim, {
        toValue: 1,
        duration: 2000,
        useNativeDriver: true,
      })
    ).start();

    fadeAnim.setValue(1);
  }, [fadeAnim, rotationAnim]);

  const redirectToFindOutChatHome = () => {
    navigation.navigate("FindOutChatHome");
  };

  const redirectToViewEditInformation = () => {
    navigation.navigate("ViewEditInformation");
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>XGO Life</Text>
      </View>

      <View style={styles.content}>
        <View style={styles.boxContainer}>
          <Animated.View
            style={[
              styles.box,
              {
                transform: [
                  {
                    rotate: rotationAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: ["0deg", "360deg"],
                    }),
                  },
                ],
              },
            ]}
          >
            <Text style={styles.boxText}>XGO Life</Text>
          </Animated.View>
        </View>

        <View style={styles.welcomeSection}>
          <Text style={styles.welcomeText}>Welcome, {userName}</Text>
          <View style={styles.statusContainer}>
            <Text style={styles.statusLabel}>Status: </Text>
            <View style={styles.statusBadge}>
              <Text style={styles.statusText}>{userStatus}</Text>
            </View>
          </View>
          <Text style={styles.message}>
            Your account is going to be verified by the XGO Life agents. Please be patient...
          </Text>
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity 
            style={styles.btnNavigate} 
            onPress={redirectToFindOutChatHome}
          >
            <Text style={styles.txtNavigate}>Go to Find Out Chat</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.btnNavigate} 
            onPress={redirectToViewEditInformation}
          >
            <Text style={styles.txtNavigate}>Edit Information</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
    marginTop: 30,
  },
  backButton: {
    padding: 8,
    marginRight: 8,
  },
  backButtonText: {
    fontSize: 28,
    color: "#333",
  },
  headerTitle: {
    flex: 1,
    fontSize: 20,
    fontWeight: "600",
    textAlign: "center",
    color: "#333",
    fontFamily: "System",
  },
  content: {
    flex: 1,
    marginTop: 80, // Account for fixed header
    paddingHorizontal: 20,
  },
  boxContainer: {
    justifyContent: "center",
    alignItems: "center",
    height: 200,
  },
  box: {
    width: 120,
    height: 120,
    backgroundColor: "#ffc000",
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  boxText: {
    color: "#333",
    fontWeight: "700",
    fontSize: 18,
    fontFamily: "System",
  },
  welcomeSection: {
    alignItems: "center",
    marginTop: 20,
    paddingHorizontal: 16,
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: "600",
    color: "#333",
    marginBottom: 12,
    fontFamily: "System",
  },
  statusContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  statusLabel: {
    fontSize: 16,
    color: "#666",
    fontFamily: "System",
  },
  statusBadge: {
    backgroundColor: "#f0f0f0",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginLeft: 8,
  },
  statusText: {
    color: "#333",
    fontSize: 14,
    fontWeight: "500",
    fontFamily: "System",
  },
  message: {
    fontSize: 15,
    textAlign: "center",
    color: "#666",
    lineHeight: 22,
    fontFamily: "System",
  },
  buttonContainer: {
    marginTop: 32,
    paddingHorizontal: 16,
  },
  btnNavigate: {
    backgroundColor: "#ffc000",
    borderRadius: 25,
    padding: 16,
    marginBottom: 12,
    alignItems: "center",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
  },
  txtNavigate: {
    color: "#333",
    fontSize: 16,
    fontWeight: "600",
    fontFamily: "System",
  },
});

export default Welcome;
import React, { useEffect, useRef } from "react";
import { View, StyleSheet, Image, Animated } from "react-native";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_URL } from "./config";
import VersionCheck from './VersionChecker';

const Start = () => {
  const navigation = useNavigation();
  const scaleAnimation = useRef(new Animated.Value(0)).current; // For scaling
  const opacityAnimation = useRef(new Animated.Value(0)).current; // For opacity

  useEffect(() => {
    const logUpdate = async () => {
      const theIds = await AsyncStorage.getItem("theIds");
      let data;
      try {
        data = JSON.parse(theIds);
        console.log("splash", data);
      } catch (error) {
        console.error("JSON Parse error:", error);
        return false;
      }

      if (data.last_logged_account === "driver") {
        const id = data.driver_id;
        console.log("splash", id);
      } else if (data.last_logged_account === "customer") {
        const id = data.customerId;
        console.log("splash", id);
      }

      if (id) {
        try {
          const response = await fetch(
            `${API_URL}/users/update_last_logged_in/${id}`,
            {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
              },
            }
          );

          if (!response.ok) {
            const errorText = await response.text(); // Log the error response body
            console.error("Error Response:", errorText);
            throw new Error(`HTTP error! status: ${response.status}`);
          }

          const result =await response.json();
          console.log("result", result)// Return true if the request was successful
        } catch (error) {
          console.log("Fetch error:", error);
        }
      }// Return false if no ID is found
    };

    logUpdate();

    const startAnimations = () => {
      Animated.parallel([
        Animated.timing(opacityAnimation, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnimation, {
          toValue: 2,
          duration: 2000,
          useNativeDriver: true,
        }),
      ]).start();
    };


    const checkNavigation = async () => {
      const theIds = await AsyncStorage.getItem("theIds");
      const userId = await AsyncStorage.getItem("theCustomerId");
      const driverId = await AsyncStorage.getItem("driver");

      if (theIds) {
        navigation.navigate(
          userId || driverId ? "CustomerLogin" : "SplashScreen"
        );
      } else {
        navigation.navigate("SplashScreen");
      }
    };

    startAnimations();

    const timer = setTimeout(() => {
      checkNavigation();
    }, 4000);

    return () => clearTimeout(timer);
  }, [scaleAnimation, navigation, opacityAnimation]);


  return (
    <View style={styles.container}>
      <Animated.View
        style={{
          transform: [
            { scale: scaleAnimation }, 
          ],
          opacity: opacityAnimation,
        }}
      >
        <View style={styles.imageContainer}>
          <Image
            style={styles.image}
            source={require("../thumbnails/xgologofootertext.png")}
          />
        </View>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFC000",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  imageContainer: {
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
  },
  image: {
    height: 100,
    width: 100,
    resizeMode: "contain",
  },
});

export default Start;

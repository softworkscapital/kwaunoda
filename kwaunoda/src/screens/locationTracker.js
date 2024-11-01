
import React, { useEffect } from "react";
import { PermissionsAndroid, Platform } from "react-native";
import Geolocation from "react-native-geolocation-service";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_URL } from "./config";

const LocationTracker = () => {
  // Replace with your actual API endpoint
  const APILINK = API_URL;
  const API_URL1 = `${APILINK}//driver/${userId}/coordinates`;
  useEffect(() => {
    const startTracking = async (userId) => {
      Geolocation.watchPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          console.log("Position:", position);
          sendLocationToAPI(userId, latitude, longitude);
        },
        (error) => {
          console.error("Error obtaining location:", error);
        },
        {
          enableHighAccuracy: true,
          distanceFilter: 0,
          interval: 10000, // Update every 10 seconds
          fastestInterval: 5000, // Fastest update interval
        }
      );
    };

    const sendLocationToAPI = async (userId, latitude, longitude) => {
      try {
        const response = await fetch(API_URL1, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId,
            latitude,
            longitude,
          }),
        });

        if (!response.ok) {
          throw new Error("Failed to update location");
        }

        const data = await response.json();
        console.log("Location updated:", data);
      } catch (error) {
        console.error("Error sending location to API:", error);
      }
    };

    const requestPermissions = async () => {
      if (Platform.OS === "android") {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            title: "Location Permission",
            message: "This app needs access to your location.",
            buttonPositive: "OK",
          }
        );

        if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
          console.error("Location permission denied");
          return;
        }
      }
    };

    const init = async () => {
      await requestPermissions();
      const storedUserId = await AsyncStorage.getItem("Driver_id");
      if (storedUserId) {
        startTracking(storedUserId);
      } else {
        console.error("User ID not found in AsyncStorage");
      }
    };

    init();

    return () => {
      Geolocation.clearWatch();
    };
  }, []);

  return null; // No UI components to render
};

export default LocationTracker;

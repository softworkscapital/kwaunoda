import React, { useEffect, useRef } from "react";
import { PermissionsAndroid, Platform, Alert } from "react-native";
import Geolocation from "react-native-geolocation-service";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_URL } from "./config";

const LocationTracker = ({ driverId }) => {
  const watchIdRef = useRef(null);

  useEffect(() => {
    const init = async () => {
      const permissionGranted = await requestPermissions();
      if (!permissionGranted) return;

      if (driverId) {
        startTracking(driverId);
      } else {
        console.error("No User ID provided");
      }
    };

    init();

    return () => {
      if (watchIdRef.current) {
        Geolocation.clearWatch(watchIdRef.current);
        console.log("Location tracking stopped");
      }
    };
  }, [driverId]);

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
        return false;
      }
    }
    return true;
  };

  const sendLocationToAPI = async (userId, latitude, longitude) => {
    const API_URL1 = `${API_URL}/driver/${userId}/coordinates`;
    console.log("Sending location to API:", { userId, latitude, longitude });

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
      Alert.alert("Error", "Failed to send location. Please try again later.");
    }
  };

  const startTracking = (userId) => {
    console.log("Starting to watch position...");
    
    watchIdRef.current = Geolocation.watchPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        console.log("Current Coordinates: Latitude:", latitude, "Longitude:", longitude);
        sendLocationToAPI(userId, latitude, longitude);
      },
      (error) => {
        console.error("Error obtaining location:", error);
        Alert.alert("Location Error", error.message);
      },
      {
        enableHighAccuracy: true,
        distanceFilter: 10,
        interval: 10000,
        fastestInterval: 5000,
        showLocationDialog: true, // Optional, prompts user if location services are disabled
      }
    );
  
    console.log("Position watching initiated.");
  };

  return null; // No UI components to render
};

export default LocationTracker;
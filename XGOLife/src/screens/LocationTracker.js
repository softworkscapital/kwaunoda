import React, { useEffect } from "react";
import * as Location from "expo-location";
import { API_URL } from "./config";

const LocationTracker = ({ userId, userType }) => {
  const userType1 = 'driver';
  useEffect(() => {
    // console.log("MuUse Effekiti Location Tracker:", userId);
    const init = async () => {
      const permissionGranted = await requestPermissions();
      if (!permissionGranted) return;

      if (userId) {
        startTracking(userId);
      } else {
        console.error("No User ID provided");
      }
    };

    init();

    // Cleanup function
    return () => {
      console.log("Location tracking stopped");
    };
  }, [userId]);

  const requestPermissions = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      console.error("Location permission denied");
      return false; // Permission not granted
    }
    return true; // Permission granted
  };

  // Send location to API
  const sendLocationToAPI = async (userId, latitude, longitude) => {
    // console.log("mmmm", userId, "", userType1);
    // console.log("mmmm", userType1);
    const endpoint =
      userType1 === "driver"
        ? `${API_URL}/driver/${userId}/coordinates`
        : `${API_URL}/customerdetails/${userId}/coordinates`; // Change endpoint for customer

    // console.log("Sending location to API:", { userId, latitude, longitude });

    try {
      const response = await fetch(endpoint, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          lat_cordinates: latitude,
          long_cordinates: longitude,
        }),
      });

      if (!response.ok) {
        const errorMessage = await response.text();
        throw new Error(`Failed to update location: ${errorMessage}`);
      }

      const data = await response.json();
      // console.log("Location updated:", data);
    } catch (error) {
      // console.error("Error sending location to API:", error);
    }
  };

  // Start tracking location
  const startTracking = async (userId) => {
    // console.log("userid", userId);
    const subscription = Location.watchPositionAsync(
      {
        accuracy: Location.Accuracy.High,
        distanceInterval: 0,
        timeInterval: 10000,
      },
      (position) => {
        // console.log("Position update received:", position);
        const { latitude, longitude } = position.coords;
        // console.log(
        //   "Current Coordinates: Latitude:",
        //   latitude,
        //   "Longitude:",
        //   longitude
        // );
        sendLocationToAPI(userId, latitude, longitude);
      },
      (error) => {
        // console.error("Error obtaining location:", error);
      }
    );

    // Cleanup function
    return () => {
      subscription.remove(); // Stop location updates
    };
  };

  return null; // No UI components to render
};

export default LocationTracker;

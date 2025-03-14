import React, { useState, useRef } from "react";
import { StyleSheet, View, ActivityIndicator, Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { WebView } from "react-native-webview";
import { useNavigation } from "@react-navigation/native";

// Replace with your actual API key from an environment variable
const API_KEY = "AIzaSyA4ZQWDwYRHmhu66Cb1F8DgXbJJrArHYyE";

const MapViewComponent = () => {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);
  const webViewRef = useRef(null);

  const handleMessage = async (event) => {
    try {
      const data = JSON.parse(event.nativeEvent.data);

      // Extract coordinates and addresses
      const startCoords = {
        latitude: data.pointA.lat,
        longitude: data.pointA.lng,
        address: data.pointA.address, // Include start address
      };

      const destCoords = {
        latitude: data.pointB.lat,
        longitude: data.pointB.lng,
        address: data.pointB.address, // Include destination address
      };

      // Fetch trip details using coordinates
      await fetchTripDetails(
        startCoords,
        destCoords,
        data.pointA.address,
        data.pointB.address
      );
    } catch (error) {
      console.error("Error parsing message:", error);
      Alert.alert("Error", "Failed to parse the received data.");
    }
  };

  const fetchTripDetails = async (
    startCoords,
    destCoords,
    startAddress,
    destAddress
  ) => {
    setLoading(true);
    const url = `https://maps.googleapis.com/maps/api/directions/json?origin=${startCoords.latitude},${startCoords.longitude}&destination=${destCoords.latitude},${destCoords.longitude}&key=${API_KEY}`;

    try {
      const response = await fetch(url);
      const data = await response.json();

      if (data.routes.length > 0) {
        const leg = data.routes[0].legs[0];

        // Updated delivery data structure
        const deliveryData = {
          origin: startCoords, // Keep coordinates as is
          startingLocation: startAddress, // Starting address
          destinationLocation: destAddress, // Destination address
          dest: destCoords, // Destination coordinates
          distance: leg.distance.text, // Distance string
          duration: leg.duration.text, // Duration string
        };

        console.log("Delivery Data:", deliveryData);
        await saveDeliveryToAsyncStorage(deliveryData);
      } else {
        Alert.alert("Error", "No route found.");
      }
    } catch (error) {
      console.error("Error fetching trip details:", error);
      Alert.alert("Error", "Unable to fetch trip details.");
    } finally {
      setLoading(false);
    }
  };

  const saveDeliveryToAsyncStorage = async (deliveryData) => {
    try {
      const existingDeliveries = await AsyncStorage.getItem("deliveries");
      const deliveries = existingDeliveries
        ? JSON.parse(existingDeliveries)
        : [];
      deliveries.push(deliveryData);
      await AsyncStorage.setItem("deliveries", JSON.stringify(deliveries));
      navigation.navigate("NewDelivery");
    } catch (error) {
      console.error("Error saving delivery:", error);
      Alert.alert("Error", "Unable to save delivery.");
    }
  };

  return (
    <View style={styles.container}>
      {loading && <ActivityIndicator size="large" color="#0000ff" />}
      <WebView
        ref={webViewRef}
        source={{ uri: "https://xgolifedash.softworkscapital.com/locate" }}
        style={styles.webview}
        onMessage={handleMessage}
        // cacheEnabled={false} 
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  webview: {
    flex: 1,
  },
});

export default MapViewComponent;

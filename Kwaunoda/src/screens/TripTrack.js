import React, { useEffect, useState } from "react";
import { View, StyleSheet, ActivityIndicator } from "react-native";
import { WebView } from "react-native-webview";
import { API_URL } from "./config";

const TripTrack = ({ route }) => {
  const { trip } = route.params;
  const [driverLocation, setDriverLocation] = useState(null);
  const [loadingDriver, setLoadingDriver] = useState(true);
  const [webViewUrl, setWebViewUrl] = useState("");
  const driverId = trip.driver_id;
  const APILINK = API_URL;

  const origin = {
    latitude: trip.origin_location_lat,
    longitude: trip.origin_location_long,
  };

  const destination = {
    latitude: trip.destination_lat,
    longitude: trip.destination_long,
  };

  useEffect(() => {
    const fetchDriverLocation = async () => {
      try {
        const response = await fetch(`${APILINK}/driver/${driverId}`);
        const driverArray = await response.json();

        if (Array.isArray(driverArray) && driverArray.length > 0) {
          const driver = driverArray[0];
          if (
            driver.lat_cordinates !== undefined &&
            driver.long_cordinates !== undefined
          ) {
            setDriverLocation({
              latitude: driver.lat_cordinates,
              longitude: driver.long_cordinates,
            });
          }
        } else {
          console.error("No driver data found or unexpected format");
        }
      } catch (error) {
        console.error("Error fetching driver location:", error);
      } finally {
        setLoadingDriver(false);
      }
    };

    fetchDriverLocation();
  }, [driverId, APILINK]);

  useEffect(() => {
    3000;
    if (driverLocation) {
      // Construct the URL based on the driver and route coordinates
      const url = `https://kwaunoda.softworkscapital.com/mapWithDriver?latDriver=${driverLocation.latitude}&lngDriver=${driverLocation.longitude}&lat1=${origin.latitude}&lng1=${origin.longitude}&lat2=${destination.latitude}&lng2=${destination.longitude}`;
      setWebViewUrl(url);
    }
  }, [driverLocation, origin, destination]);

  if (loadingDriver) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  return (
    <View style={styles.container}>
      {webViewUrl ? (
        <WebView source={{ uri: webViewUrl }} style={styles.webView} />
      ) : (
        <ActivityIndicator size="large" color="#0000ff" />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  webView: {
    flex: 1,
  },
});

export default TripTrack;
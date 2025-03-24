import React, { useEffect, useState } from "react";
import { View, Text, Alert, StyleSheet, Linking } from "react-native";
import API_URL from './config';

const VersionCheck = () => {
  const [message, setMessage] = useState("");
  const [isBlocked, setIsBlocked] = useState(false);
  const hardcodedVersion = "Version 1.0.4 Build 25.04.24"; // Hardcoded version to compare against
  const downloadUrl = "https://xgolife.com/download-2/"; // Replace with your download URL

  useEffect(() => {
    const checkAppVersion = async () => {
      try {
        const response = await fetch(
          `https://srv547457.hstgr.cloud:3011/application_configs/recent`
        );

        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        const data = await response.json();

        // Check if the value matches the hardcoded version
        if (data.value !== hardcodedVersion) {
          Alert.alert(
            "Version Mismatch",
            "The application version is not authorized. Please update the app to continue usage.",
            [
              {
                text: "OK",
                onPress: () => Linking.openURL(downloadUrl), // Redirect to the download URL
              },
            ],
            { cancelable: false }
          );
          setMessage("Unauthorized version. Update required.");
          setIsBlocked(true); // Block usage
        } else {
          setMessage("The application version is authorized.");
          setIsBlocked(false); // Allow usage
        }
      } catch (error) {
        console.error("There was a problem with the fetch operation:", error);
        setMessage("Error fetching application version.");
      }
    };

    checkAppVersion();
  }, []);

  return null;
  // <View style={styles.container}>
  //   <Text style={styles.message}>{message}</Text>

  //   {isBlocked && (
  //     <View style={styles.overlay}>
  //       <Text style={styles.overlayText}>Application Blocked</Text>
  //     </View>
  //   )}
  // </View>
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  message: {
    fontSize: 18,
    textAlign: "center",
  },
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)", // Dimmed background
    justifyContent: "center",
    alignItems: "center",
  },
  overlayText: {
    fontSize: 24,
    color: "white",
    fontWeight: "bold",
  },
});

export default VersionCheck;

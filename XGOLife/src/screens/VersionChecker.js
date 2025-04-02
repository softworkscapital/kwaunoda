import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Alert,
  StyleSheet,
  Linking,
  BackHandler,
  Modal,
  TouchableOpacity,
} from "react-native";

const VersionCheck = () => {
  const [message, setMessage] = useState("");
  const [isBlocked, setIsBlocked] = useState(false);
  const hardcodedVersion = "1.2.4"; // Hardcoded version to compare against
  const downloadUrl = "https://xgolife.com/download-2/"; // Download URL

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
        console.log("vvv", data[0].value);
        // Check if the fetched version matches the hardcoded version
        if (data[0].value !== hardcodedVersion) {
          setMessage(
            "The application version is not authorized. Please update the app to continue usage."
          );
          setIsBlocked(true); // Block usage
          Linking.openURL(downloadUrl); // Redirect to the download URL
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

  useEffect(() => {
    // If the app is blocked, disable the back button
    const backAction = () => {
      if (isBlocked) {
        return true; // Block back action
      }
      return false; // Allow back action
    };

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );

    return () => backHandler.remove(); // Cleanup the event listener
  }, [isBlocked]);

  return (
    <View style={styles.container}>
      {isBlocked && (
        <Modal
          transparent={true}
          animationType="slide"
          visible={isBlocked}
          onRequestClose={() => {}} // Disable back button from closing modal
        >
          <View style={styles.overlay}>
            <View style={styles.modalContent}>
              <Text style={styles.overlayText}>New Version Available</Text>
              <Text style={styles.modalMessage}>
                You need to download the latest version to continue using our
                services.
              </Text>
              <TouchableOpacity
                style={styles.button}
                onPress={() => Linking.openURL(downloadUrl)}
              >
                <Text style={styles.buttonText}>Update Now</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  overlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.7)", // Dimmed background
  },
  modalContent: {
    width: "80%",
    backgroundColor: "white",
    borderRadius: 10,
    padding: 20,
    alignItems: "center",
  },
  overlayText: {
    fontSize: 24,
    fontWeight: "bold",
    marginVertical: 10,
    color: "black",
  },
  modalMessage: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 20,
  },
  button: {
    backgroundColor: "#ffc000",
    padding: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: "black",
    fontWeight: "bold",
  },
});

export default VersionCheck;

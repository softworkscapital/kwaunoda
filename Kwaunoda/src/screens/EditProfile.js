import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_URL } from "./config";
import Toast from "react-native-toast-message";
import { launchImageLibrary } from "react-native-image-picker";

const EditProfile = ({ navigation }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [licensePlate, setLicensePlate] = useState("");
  const [driver_id, setDriver_id] = useState(null);
  const [profileImage, setProfileImage] = useState("");
  const [idImage, setIdImage] = useState("");
  const [numberPlateImage, setNumberPlateImage] = useState("");
  const [vehicleLicenseImage, setVehicleLicenseImage] = useState("");
  const [driverLicenseImage, setDriverLicenseImage] = useState("");
  const APILINK = API_URL;

  useEffect(() => {
    const loadUserData = async () => {
      const details = await AsyncStorage.getItem("userDetails");
      if (details) {
        const parsedData = JSON.parse(details);
        setName(parsedData.name);
        setEmail(parsedData.email);
        setPhone(parsedData.phone);
        setAddress(parsedData.address);
        setDriver_id(parsedData.driver_id);
        fetchDriverImages(parsedData.driver_id);
      }
    };

    const fetchDriverImages = async (id) => {
      try {
        const response = await fetch(`${APILINK}/driver/${id}`);
        const result = await response.json();

        if (response.ok) {
          const driverData = result[0]; // Assuming the response is an array
          if (driverData) {
            // Construct image URLs
            setProfileImage(`${APILINK}${driverData.profilePic}`);
            setIdImage(`${APILINK}${driverData.id_image}`);
            setNumberPlateImage(`${APILINK}${driverData.number_plate_image}`);
            setVehicleLicenseImage(
              `${APILINK}${driverData.vehicle_license_image}`
            );
            setDriverLicenseImage(
              `${APILINK}${driverData.driver_license_image}`
            );
          }
        } else {
          Toast.show({
            type: "error",
            text1: "Fetch Error",
            text2: result.message || "Failed to fetch images.",
          });
        }
      } catch (error) {
        console.error("Fetch Error:", error);
        Toast.show({
          type: "error",
          text1: "Network Error",
          text2: "Failed to fetch images.",
        });
      }
    };

    loadUserData();
  }, []);

  const handleImagePick = (field) => {
    const options = {
      mediaType: "photo",
      includeBase64: false, // Set to true if you want base64 string
    };

    launchImageLibrary(options, (response) => {
      if (response.didCancel) {
        console.log("User cancelled image picker");
      } else if (response.error) {
        console.error("ImagePicker Error: ", response.error);
        Toast.show({
          type: "error",
          text1: "Image Picker Error",
          text2: "Failed to pick an image.",
        });
      } else if (response.assets) {
        const source = response.assets[0].uri;
        switch (field) {
          case "profile":
            setProfileImage(source);
            break;
          case "id":
            setIdImage(source);
            break;
          case "numberPlate":
            setNumberPlateImage(source);
            break;
          case "vehicleLicense":
            setVehicleLicenseImage(source);
            break;
          case "driverLicense":
            setDriverLicenseImage(source);
            break;
          default:
            break;
        }
      }
    });
  };

  const handleSave = async () => {
    if (!name || !email || !phone || !licensePlate) {
      Toast.show({
        type: "error",
        text1: "Validation Error",
        text2: "Please fill in all fields before saving.",
      });
      return;
    }

    const data = { name, email, phone, address, licensePlate };

    try {
      const response = await fetch(`${APILINK}/driver/${driver_id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();
      if (response.ok) {
        Toast.show({
          type: "success",
          text1: "Success",
          text2: "Profile updated successfully.",
        });
        navigation.goBack(); // Navigate back on successful save
      } else {
        Toast.show({
          type: "error",
          text1: "Update Error",
          text2: result.message || "Failed to update profile.",
        });
      }
    } catch (error) {
      console.log("Update Error:", error);
      Toast.show({
        type: "error",
        text1: "Network Error",
        text2: "Failed to update profile.",
      });
    }
  };

  const handleGoBack = () => {
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <View style={styles.topBar}>
        <TouchableOpacity onPress={handleGoBack} style={styles.backButton}>
          <Ionicons name="arrow-back-outline" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.headerText}>Edit Profile</Text>
      </View>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.imageContainer}>
          <View style={styles.imageWrapper}>
            <Image
              source={{
                uri: profileImage || "https://via.placeholder.com/150",
              }}
              style={styles.image}
            />
            <Text style={styles.imageLabel}>Profile Picture</Text>
          </View>
        </View>

        <TextInput
          style={styles.input}
          placeholder="Name"
          value={name}
          onChangeText={setName}
        />
        <TextInput
          style={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
        />
        <TextInput
          style={styles.input}
          placeholder="Phone"
          value={phone}
          onChangeText={setPhone}
          keyboardType="phone-pad"
        />
        <TextInput
          style={styles.input}
          placeholder="Address"
          value={address}
          onChangeText={setAddress}
        />

        <View style={styles.imageContainer}>
          <View style={styles.imageWrapper}>
            <Image
              source={{
                uri: idImage || "https://via.placeholder.com/150",
              }}
              style={styles.image}
            />
            <Text style={styles.imageLabel}>ID Image</Text>
          </View>
        </View>

        <TextInput
          style={styles.input}
          placeholder="National ID Number"
          value={address}
          onChangeText={setAddress}
        />

        <View style={styles.imageContainer}>
          <View style={styles.imageWrapper}>
            <Image
              source={{
                uri: driverLicenseImage || "https://via.placeholder.com/150",
              }}
              style={styles.image}
            />
            <Text style={styles.imageLabel}>Driver License</Text>
          </View>
          <View style={styles.imageWrapper}>
            <Image
              source={{
                uri: vehicleLicenseImage || "https://via.placeholder.com/150",
              }}
              style={styles.image}
            />
            <Text style={styles.imageLabel}>Vehicle License</Text>
          </View>
          <View style={styles.imageWrapper}>
            <Image
              source={{
                uri: numberPlateImage || "https://via.placeholder.com/150",
              }}
              style={styles.image}
            />
            <Text style={styles.imageLabel}>Number Plate</Text>
          </View>
        </View>

        <TextInput
          style={styles.input}
          placeholder="License Plate"
          value={licensePlate}
          onChangeText={setLicensePlate}
        />

        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.saveButtonText}>Save</Text>
        </TouchableOpacity>
      </ScrollView>
      <Toast ref={(ref) => Toast.setRef(ref)} style={styles.toast} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f8f8",
  },
  topBar: {
    width: "100%",
    backgroundColor: "#ffc000",
    paddingVertical: 30,
    paddingHorizontal: 15,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1,
  },
  backButton: {
    position: "absolute",
    left: 15,
  },
  headerText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    textAlign: "center",
  },
  content: {
    flexGrow: 1,
    paddingTop: 120,
    paddingHorizontal: 20,
  },
  input: {
    height: 50,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 15,
    backgroundColor: "#fff",
  },
  saveButton: {
    backgroundColor: "#FFC000",
    paddingVertical: 10,
    borderRadius: 25,
    alignItems: "center",
    marginTop: 20,
  },
  saveButtonText: {
    color: "#000",
    fontSize: 18,
    fontWeight: "bold",
  },
  imageContainer: {
    flexDirection: "row", // Align children in a row
    justifyContent: "center", // Center the children horizontally
    alignItems: "center", // Center the children vertically
    marginVertical: 10, // Add vertical spacing if needed
  },
  imageWrapper: {
    alignItems: "center",
    width: "30%", // Adjust width for better layout
    marginHorizontal: 5, // Add horizontal spacing between images
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 40, // Circular image
    marginBottom: 5,
    resizeMode: "cover",
  },
  imageLabel: {
    fontSize: 14,
    color: "#333",
    textAlign: "center",
  },
  toast: {
    zIndex: 2,
  },
});

export default EditProfile;

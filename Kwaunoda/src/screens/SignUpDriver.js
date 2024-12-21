import React, { useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  SafeAreaView,
  ScrollView,
  Alert,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import {
  faUser,
  faPhone,
  faIdCard,
  faMapMarkerAlt,
} from "@fortawesome/free-solid-svg-icons";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Toast from "react-native-toast-message";
import { API_URL } from "./config"; // Import the API_URL

const SignUpDriver = () => {
  const [name, setName] = useState("");
  const [surname, setSurname] = useState("");
  // const [phone, setPhone] = useState("");
  const [plate, setPlate] = useState("");
  const [idnumber, setIdnumber] = useState("");
  const [profilePic, setProfilePic] = useState(null);
  const [idPic, setIdPic] = useState(null);
  const [platePic, setPlatePic] = useState(null);
  const [vehicleLicensePic, setVehicleLicensePic] = useState(null);
  const [driversLicensePic, setDriversLicensePic] = useState(null);
  const [loading, setLoading] = useState(false);

  const navigation = useNavigation();

  const validateInput = () => {
    if (
      !name ||
      !surname ||
      // !phone ||
      !idnumber ||
      !plate ||
      !profilePic ||
      !idPic ||
      !platePic ||
      !vehicleLicensePic ||
      !driversLicensePic
    ) {
      Toast.show({
        text1: "Validation Error",
        text2: "Please fill all fields and upload all required pictures.",
        type: "error",
        position: "center",
        visibilityTime: 3000,
        autoHide: true,
      });
      return false;
    }

    // if (!/^\d+$/.test(phone)) {
    //   Toast.show({
    //     text1: "Validation Error",
    //     text2: "Phone number should contain only digits.",
    //     type: "error",
    //     position: "center",
    //     visibilityTime: 3000,
    //     autoHide: true,
    //   });
    //   return false;
    // }

    return true;
  };

  const pickImage = async (setImage) => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const handleImageUpload = async (imageUri) => {
    const formData = new FormData();
    const fileName = imageUri.split("/").pop();
    const type = `image/${fileName.split(".").pop()}`;

    formData.append("image", {
      uri: imageUri,
      name: fileName,
      type: type,
    });

    try {
      const response = await fetch(`${API_URL}/upload`, {
        method: "POST",
        body: formData,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      const data = await response.json();
      return `${data.path}`; // Return the full URL
    } catch (error) {
      console.error("Upload error:", error);
      throw new Error("Failed to upload image");
    }
  };

  const handleSignUp = async () => {
    if (!validateInput()) return;

    setLoading(true);

    try {
      const profilePicPath = await handleImageUpload(profilePic);
      const idPicPath = await handleImageUpload(idPic);
      const platePicPath = await handleImageUpload(platePic);
      const vehicleLicensePicPath = await handleImageUpload(vehicleLicensePic);
      const driversLicensePicPath = await handleImageUpload(driversLicensePic);

      const driverDetails = {
        name,
        surname,
        // phone,
        idnumber,
        plate,
        profilePicPath,
        idPicPath,
        platePicPath,
        vehicleLicensePicPath,
        driversLicensePicPath,
      };

      await AsyncStorage.setItem(
        "driverDetailsD0",
        JSON.stringify(driverDetails)
      );
      console.log("Driver details stored in Async Storage:", driverDetails);

      navigation.navigate("SignUpDriver1");
    } catch (error) {
      console.error("Error:", error);
      Alert.alert("Error", "Failed to sign up. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.topBar}>
        <FontAwesomeIcon icon={faMapMarkerAlt} size={40} color="red" />
        <Text style={styles.appName}>DropX</Text>
      </View>
      <ScrollView>
        <View style={styles.formContainer}>
          <View>
            <Text
              style={{ alignSelf: "center", fontSize: 14, marginBottom: 10 }}
            >
              Sign Up As Driver
            </Text>
          </View>

          <View style={styles.inputContainer}>
            <FontAwesomeIcon icon={faUser} size={12} style={styles.icon} />
            <TextInput
              style={styles.input}
              placeholder="Name"
              value={name}
              onChangeText={setName}
            />
          </View>

          <View style={styles.inputContainer}>
            <FontAwesomeIcon icon={faUser} size={12} style={styles.icon} />
            <TextInput
              style={styles.input}
              placeholder="Surname"
              value={surname}
              onChangeText={setSurname}
            />
          </View>

          {/* <View style={styles.inputContainer}>
            <FontAwesomeIcon icon={faPhone} size={12} style={styles.icon} />
            <TextInput
              style={styles.input}
              placeholder="Phone eg 263777111222"
              value={phone}
              onChangeText={setPhone}
              keyboardType="phone-pad"
            />
          </View> */}

          <View style={styles.inputContainer}>
            <FontAwesomeIcon icon={faIdCard} size={12} style={styles.icon} />
            <TextInput
              style={styles.input}
              placeholder="id number e.g 63-8888888A63"
              value={idnumber}
              onChangeText={setIdnumber}
            />
          </View>

          <View style={styles.inputContainer}>
            <FontAwesomeIcon icon={faIdCard} size={12} style={styles.icon} />
            <TextInput
              style={styles.input}
              placeholder="Vehicle Number Plate e.g AAA-0000"
              value={plate}
              onChangeText={setPlate}
            />
          </View>

          {/* Upload Buttons with Images */}
          <View style={styles.uploadContainer}>
            <View style={styles.picWrapper}>
              {profilePic && (
                <Image
                  source={{ uri: profilePic }}
                  style={styles.profileImage}
                />
              )}
              <TouchableOpacity
                style={styles.picButton}
                onPress={() => pickImage(setProfilePic)}
              >
                <Text style={styles.picButtonText}>
                  {profilePic
                    ? "Change Profile Picture"
                    : "Upload Profile Picture"}
                </Text>
              </TouchableOpacity>
            </View>

            <View style={styles.picWrapper}>
              {idPic && (
                <Image source={{ uri: idPic }} style={styles.profileImage} />
              )}
              <TouchableOpacity
                style={styles.picButton}
                onPress={() => pickImage(setIdPic)}
              >
                <Text style={styles.picButtonText}>
                  {idPic ? "Change ID Picture" : "Upload ID Picture"}
                </Text>
              </TouchableOpacity>
            </View>

            <View style={styles.picWrapper}>
              {platePic && (
                <Image source={{ uri: platePic }} style={styles.profileImage} />
              )}
              <TouchableOpacity
                style={styles.picButton}
                onPress={() => pickImage(setPlatePic)}
              >
                <Text style={styles.picButtonText}>
                  {platePic ? "Change Plate Picture" : "Upload Plate Picture"}
                </Text>
              </TouchableOpacity>
            </View>

            <View style={styles.picWrapper}>
              {vehicleLicensePic && (
                <Image
                  source={{ uri: vehicleLicensePic }}
                  style={styles.profileImage}
                />
              )}
              <TouchableOpacity
                style={styles.picButton}
                onPress={() => pickImage(setVehicleLicensePic)}
              >
                <Text style={styles.picButtonText}>
                  {vehicleLicensePic
                    ? "Change Vehicle License"
                    : "Upload Vehicle License"}
                </Text>
              </TouchableOpacity>
            </View>

            <View style={styles.picWrapper}>
              {driversLicensePic && (
                <Image
                  source={{ uri: driversLicensePic }}
                  style={styles.profileImage}
                />
              )}
              <TouchableOpacity
                style={styles.picButton}
                onPress={() => pickImage(setDriversLicensePic)}
              >
                <Text style={styles.picButtonText}>
                  {driversLicensePic
                    ? "Change Driver's License"
                    : "Upload Driver's License"}
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          <TouchableOpacity style={styles.btnSignUp} onPress={handleSignUp}>
            <Text style={styles.txtSignUp}>Next</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
      <Toast />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  topBar: {
    height: "25%",
    backgroundColor: "#FFC000",
    borderBottomLeftRadius: 45,
    borderBottomRightRadius: 45,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 5,
  },
  appName: {
    fontSize: 20,
    fontWeight: "bold",
    color: "black",
    marginLeft: 10,
  },
  formContainer: {
    padding: 20,
    justifyContent: "space-between",
    flexDirection: "column",
    height: "100%",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    padding: 5,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    marginBottom: 15,
    backgroundColor: "rgba(255, 255, 255, 0.8)",
  },
  icon: {
    marginRight: 15,
    marginLeft: 10,
  },
  input: {
    flex: 1,
  },
  btnSignUp: {
    backgroundColor: "#FFC000",
    borderRadius: 50,
    padding: 14,
    width: "100%",
    alignItems: "center",
  },
  txtSignUp: {
    color: "black",
    fontSize: 13,
    fontWeight: "bold",
  },
  picButton: {
    backgroundColor: "#FFC00040",
    borderRadius: 50,
    padding: 14,
    width: "100%",
    alignItems: "center",
    marginTop: 5,
  },
  picButtonText: {
    color: "black",
    fontSize: 13,
    fontWeight: "bold",
  },
  profileImage: {
    width: 100, // Width of the uploaded image
    height: 100, // Height of the uploaded image
    marginBottom: 5, // Space between image and button
    borderRadius: 10, // Optional: rounded corners for the images
    alignSelf: "center", // Center the image
  },
  uploadContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginTop: 20,
  },
  picWrapper: {
    alignItems: "center",
    marginBottom: 20,
    width: "100%", // Make each button occupy the full width
  },
});

export default SignUpDriver;

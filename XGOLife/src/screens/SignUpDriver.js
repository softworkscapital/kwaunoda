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
  ActivityIndicator,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import {
  faUser,
  faIdCard,
  faCar,
  faPalette,
  faList,
  faCalendar,
  faHashtag,
} from "@fortawesome/free-solid-svg-icons";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Toast from "react-native-toast-message";
import { API_URL_UPLOADS } from "./config"; // Import the API_URL
import { Picker } from "@react-native-picker/picker";

const SignUpDriver = () => {
  const [name, setName] = useState("");
  const [surname, setSurname] = useState("");
  const [dob, setDob] = useState("");
  const [gender, setGender] = useState("");
  const [plate, setPlate] = useState("");
  const [idnumber, setIdnumber] = useState("");
  const [vehicleMake, setVehicleMake] = useState("");
  const [vehicleModel, setVehicleModel] = useState("");
  const [vehicleColor, setVehicleColor] = useState("");
  const [vehicleCategory, setVehicleCategory] = useState("");
  const [vehicleYear, setVehicleYear] = useState("");
  const [vehicleCount, setVehicleCount] = useState("");
  const [vehicleType, setVehicleType] = useState("");
  const [profilePic, setProfilePic] = useState(null);
  const [idPic, setIdPic] = useState(null);
  const [platePic, setPlatePic] = useState(null);
  const [vehicleLicensePic, setVehicleLicensePic] = useState(null);
  const [driversLicensePic, setDriversLicensePic] = useState(null);

  const [vehicleImage1, setVehicleImage1] = useState(null);
  const [vehicleImage2, setVehicleImage2] = useState(null);
  const [vehicleImage3, setVehicleImage3] = useState(null);

  const [loading, setLoading] = useState(false);

  const navigation = useNavigation();

  const validateInput = () => {
    if (
      !name ||
      !surname ||
      !idnumber ||
      !plate ||
      !dob ||
      !gender ||
      !vehicleMake ||
      !vehicleModel ||
      !vehicleColor ||
      !vehicleCategory ||
      !vehicleYear ||
      !vehicleCount ||
      !vehicleType ||
      !profilePic ||
      !idPic ||
      !platePic ||
      !vehicleLicensePic ||
      !driversLicensePic ||
      !vehicleImage1 ||
      !vehicleImage2 ||
      !vehicleImage3
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

    if (
      vehicleYear &&
      (isNaN(vehicleYear) ||
        vehicleYear < 1900 ||
        vehicleYear > new Date().getFullYear())
    ) {
      Toast.show({
        text1: "Validation Error",
        text2: "Please enter a valid vehicle year.",
        type: "error",
        position: "center",
        visibilityTime: 3000,
        autoHide: true,
      });
      return false;
    }

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

  const handleSignUp = async () => {
    if (!validateInput()) return;

    setLoading(true);

    try {
      const driverDetails = {
        name,
        surname,
        idnumber,
        plate,
        dob,
        gender,
        vehicleMake,
        vehicleModel,
        vehicleColor,
        vehicleCategory,
        vehicleYear,
        vehicleCount,
        vehicleType,
        profilePic,
        idPic,
        platePic,
        vehicleLicensePic,
        driversLicensePic,
        vehicleImage1,
        vehicleImage2,
        vehicleImage3,
      };

      console.log("Driver Details:", driverDetails);

      await AsyncStorage.setItem(
        "driverDetailsD0",
        JSON.stringify(driverDetails)
      );
      console.log("Driver details stored in Async Storage:", driverDetails);

      navigation.navigate("SignUpDriver1");
    } catch (error) {
      console.error("Error storing driver details:", error);
      Alert.alert("Error", "Failed to save information. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.topBar}>
        <Image
          source={require("../../assets/icon.png")}
          style={{ width: 200, height: 80 }}
        />
      </View>
      <ScrollView>
        <View style={styles.formContainer}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Personal Information</Text>
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

          <View style={styles.inputContainer}>
            <FontAwesomeIcon icon={faCalendar} size={12} style={styles.icon} />
            <TextInput
              style={styles.input}
              placeholder="Date of Birth (YYYY-MM-DD)"
              value={dob}
              onChangeText={setDob}
            />
          </View>

          <View style={styles.inputContainer}>
            <FontAwesomeIcon icon={faUser} size={12} style={styles.icon} />
            <Picker
              selectedValue={gender}
              style={styles.input}
              onValueChange={(itemValue) => setGender(itemValue)}
            >
              <Picker.Item label="Select Gender" value="" />
              <Picker.Item label="Male" value="male" />
              <Picker.Item label="Female" value="female" />
              <Picker.Item label="Other" value="other" />
            </Picker>
          </View>

          <View style={styles.inputContainer}>
            <FontAwesomeIcon icon={faIdCard} size={12} style={styles.icon} />
            <TextInput
              style={styles.input}
              placeholder="ID Number e.g 63-8888888A63"
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
          <View style={styles.picWrapper}>
            {profilePic && (
              <Image source={{ uri: profilePic }} style={styles.profileImage} />
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

          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Vehicle Information</Text>
          </View>
          <View style={styles.inputContainer}>
            <FontAwesomeIcon icon={faList} size={12} style={styles.icon} />
            <Picker
              selectedValue={vehicleCategory}
              style={styles.input}
              onValueChange={(itemValue) => setVehicleCategory(itemValue)}
            >
              <Picker.Item label="Select Vehicle Category" value="" />
              <Picker.Item label="Economy" value="economy" />
              <Picker.Item label="Standard" value="standard" />
              <Picker.Item label="Luxury" value="luxury" />
              <Picker.Item label="Commercial" value="commercial" />
            </Picker>
          </View>

          <View style={styles.inputContainer}>
            <FontAwesomeIcon icon={faCar} size={12} style={styles.icon} />
            <Picker
              selectedValue={vehicleType}
              style={styles.input}
              onValueChange={(itemValue) => setVehicleType(itemValue)}
            >
              <Picker.Item label="Select Vehicle Type" value="" />
              <Picker.Item label="Delivery Bike" value="DeliveryBike" />
              <Picker.Item label="Sedan" value="Sedan" />
              <Picker.Item label="Coupe" value="Coupe" />
              <Picker.Item label="HatchBack" value="HatchBack" />
              <Picker.Item label="SUV" value="SUV" />
              <Picker.Item label="Van" value="Van" />
              <Picker.Item
                label="PickUp 1.0 to 1.2 tonnes"
                value="PickUp1.0to1.2tonnes"
              />
              <Picker.Item
                label="Truck Max load 1.0 to 2.5 tonne"
                value="TruckMaxLoad1.0to2.5tonne"
              />
              <Picker.Item
                label="Truck Max load 2.5 to 5.0 tonne"
                value="TruckMaxLoad2.5to5.0tonne"
              />
            </Picker>
          </View>

          <View style={styles.inputContainer}>
            <FontAwesomeIcon icon={faCar} size={12} style={styles.icon} />
            <TextInput
              style={styles.input}
              placeholder="Vehicle Make"
              value={vehicleMake}
              onChangeText={setVehicleMake}
            />
          </View>

          <View style={styles.inputContainer}>
            <FontAwesomeIcon icon={faCar} size={12} style={styles.icon} />
            <TextInput
              style={styles.input}
              placeholder="Vehicle Model"
              value={vehicleModel}
              onChangeText={setVehicleModel}
            />
          </View>

          <View style={styles.inputContainer}>
            <FontAwesomeIcon icon={faPalette} size={12} style={styles.icon} />
            <TextInput
              style={styles.input}
              placeholder="Vehicle Color"
              value={vehicleColor}
              onChangeText={setVehicleColor}
            />
          </View>

          <View style={styles.inputContainer}>
            <FontAwesomeIcon icon={faCalendar} size={12} style={styles.icon} />
            <TextInput
              style={styles.input}
              placeholder="Vehicle Year"
              value={vehicleYear}
              onChangeText={setVehicleYear}
              keyboardType="numeric"
            />
          </View>

          <View style={styles.inputContainer}>
            <FontAwesomeIcon icon={faHashtag} size={12} style={styles.icon} />
            <TextInput
              style={styles.input}
              placeholder="Vehicle Count"
              value={vehicleCount}
              onChangeText={setVehicleCount}
              keyboardType="numeric"
            />
          </View>

          {/* Upload Buttons for Images */}

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

          {/* Vehicle Image Uploads */}
          <View style={styles.picWrapper}>
            {vehicleImage1 && (
              <Image
                source={{ uri: vehicleImage1 }}
                style={styles.profileImage}
              />
            )}
            <TouchableOpacity
              style={styles.picButton}
              onPress={() => pickImage(setVehicleImage1)}
            >
              <Text style={styles.picButtonText}>
                {vehicleImage1
                  ? "Change Vehicle Image 1"
                  : "Upload Vehicle Image 1"}
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.picWrapper}>
            {vehicleImage2 && (
              <Image
                source={{ uri: vehicleImage2 }}
                style={styles.profileImage}
              />
            )}
            <TouchableOpacity
              style={styles.picButton}
              onPress={() => pickImage(setVehicleImage2)}
            >
              <Text style={styles.picButtonText}>
                {vehicleImage2
                  ? "Change Vehicle Image 2"
                  : "Upload Vehicle Image 2"}
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.picWrapper}>
            {vehicleImage3 && (
              <Image
                source={{ uri: vehicleImage3 }}
                style={styles.profileImage}
              />
            )}
            <TouchableOpacity
              style={styles.picButton}
              onPress={() => pickImage(setVehicleImage3)}
            >
              <Text style={styles.picButtonText}>
                {vehicleImage3
                  ? "Change Vehicle Image 3"
                  : "Upload Vehicle Image 3"}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Next Button with Loading State */}
          <TouchableOpacity
            style={[styles.btnSignUp, loading && styles.btnDisabled]}
            onPress={handleSignUp}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="black" />
            ) : (
              <Text style={styles.txtSignUp}>Next</Text>
            )}
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
    padding: 3,
    paddingLeft: 15,
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
  picker: {
    flex: 1,
    height: 40,
  },
  icon: {
    marginRight: 10,
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
    width: 100,
    height: 100,
    marginBottom: 5,
    borderRadius: 10,
    alignSelf: "center",
  },
  picWrapper: {
    alignItems: "center",
    marginBottom: 20,
    width: "100%",
  },
  btnDisabled: {
    opacity: 0.7,
  },
  sectionHeader: {
    marginTop: 20,
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#FFC000",
    paddingBottom: 5,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
});

export default SignUpDriver;

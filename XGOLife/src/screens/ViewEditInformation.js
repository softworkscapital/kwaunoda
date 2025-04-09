import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Image,
  Alert,
  Dimensions,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_URL, API_URL_UPLOADS } from "./config";

const { width } = Dimensions.get("window");

const ViewEditInformation = ({ navigation }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState(null);
  const [driverData, setDriverData] = useState(null);
  const [formData, setFormData] = useState({
    personalInfo: {},
    contactInfo: {},
    vehicleInfo: {},
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const storedIds = await AsyncStorage.getItem("theIds");
      const { driver_id } = JSON.parse(storedIds); // Retrieve driver ID from local storage
      
      const userResponse = await fetch(`${API_URL}/users/${driver_id}`);
      const userResult = await userResponse.json();
      console.log("User Data:", userResult);

      const driverResponse = await fetch(`${API_URL}/driver/${driver_id}`);
      const driverResult = await driverResponse.json();
      console.log("Driver Data:", driverResult);

      setUserData(userResult[0]); // Assuming userResult is an array
      setDriverData(driverResult[0]); // Assuming driverResult is an array
      
      setFormData({
        personalInfo: {
          name: driverResult[0].name || "",
          surname: driverResult[0].surname || "",
          idNumber: driverResult[0].idnumber || "",
          gender: driverResult[0].sex || "",
          dob: driverResult[0].dob || "",
        },
        contactInfo: {
          email: driverResult[0].email || "",
          phone: driverResult[0].phone || "",
          address: driverResult[0].address || "",
          city: driverResult[0].city || "",
          country: driverResult[0].country || "",
        },
        vehicleInfo: {
          plate: driverResult[0].plate || "",
          make: driverResult[0].make || "",
          model: driverResult[0].model || "",
          color: driverResult[0].colour || "",
          type: driverResult[0].type || "",
        },
      });
      
      setLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
      Alert.alert("Error", "Failed to fetch user data");
      setLoading(false);
    }
  };

  const handleSave = async () => {
    // Implement your save logic here
    Alert.alert("Success", "Information updated successfully");
    setIsEditing(false);
  };

  const renderSection = (title, data, section) => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {Object.entries(data).map(([key, value]) => (
        value ? ( // Only render if value is not null or empty
          <View key={key} style={styles.inputContainer}>
            <Text style={styles.label}>
              {key.replace(/([A-Z])/g, " $1").trim()}:
            </Text>
            <TextInput
              style={[
                styles.input,
                !isEditing && styles.disabledInput
              ]}
              value={value}
              onChangeText={(text) =>
                setFormData(prev => ({
                  ...prev,
                  [section]: {
                    ...prev[section],
                    [key]: text
                  }
                }))
              }
              editable={isEditing}
            />
          </View>
        ) : null
      ))}
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#ffc000" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          onPress={() => navigation.goBack()} 
          style={styles.backButton}
        >
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Driver Profile</Text>
        <TouchableOpacity
          onPress={() => isEditing ? handleSave() : setIsEditing(true)}
          style={styles.editButton}
        >
          <Text style={styles.editButtonText}>
            {isEditing ? "Save" : "Edit"}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Status Section */}
      <View style={styles.statusContainer}>
        <View style={styles.statusItem}>
          <Text style={styles.statusLabel}>Account Status</Text>
          <View style={[
            styles.statusBadge,
            { backgroundColor: userData?.status === "Verified" ? "#e6ffe6" : "#fff3e6" }
          ]}>
            <Text style={[
              styles.statusText,
              { color: userData?.status === "Verified" ? "#008000" : "#ff8c00" }
            ]}>
              {userData?.status}
            </Text>
          </View>
        </View>

        <View style={styles.statusItem}>
          <Text style={styles.statusLabel}>Membership Status</Text>
          <View style={[
            styles.statusBadge,
            { backgroundColor: driverData?.membershipstatus === "Verified" ? "#e6ffe6" : "#fff3e6" }
          ]}>
            <Text style={[
              styles.statusText,
              { color: driverData?.membershipstatus === "Verified" ? "#008000" : "#ff8c00" }
            ]}>
              {driverData?.membershipstatus}
            </Text>
          </View>
        </View>
      </View>

      {/* Profile Picture */}
      {driverData?.profilePic && (
        <View style={styles.profilePictureContainer}>
          <Image
            source={{
              uri: `${API_URL_UPLOADS}/${driverData.profilePic.replace(/\\/g, "/")}`,
            }}
            style={styles.profilePicture}
          />
          <Text>Profile Picture</Text>
        </View>
      )}

      {renderSection("Personal Information", formData.personalInfo, "personalInfo")}
      
      {/* ID Picture */}
      {driverData?.id_image && (
        <View style={styles.idImageContainer}>
          <Image
            source={{
              uri: `${API_URL_UPLOADS}/${driverData.id_image.replace(/\\/g, "/")}`,
            }}
            style={styles.idImage}
          />
          <Text>Id Picture</Text>
        </View>
      )}

      {renderSection("Contact Information", formData.contactInfo, "contactInfo")}
      {renderSection("Vehicle Information", formData.vehicleInfo, "vehicleInfo")}

      {/* Documents Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Documents & Images</Text>
        <View style={styles.documentsGrid}>
          {[
            { label: "License Image", image: driverData?.driver_license_image },
            { label: "Vehicle Image 1", image: driverData?.vehicle_img1 },
            { label: "Vehicle Image 2", image: driverData?.vehicle_img2 },
            { label: "Vehicle Image 3", image: driverData?.vehicle_img3 },
          ].map((doc, index) => (
            doc.image ? ( // Only render if image exists
              <View key={index} style={styles.documentItem}>
                <Image
                  source={{
                    uri: `${API_URL_UPLOADS}/${doc.image.replace(/\\/g, "/")}`,
                  }}
                  style={styles.documentImage}
                  resizeMode="contain"
                />
                <Text style={styles.documentLabel}>{doc.label}</Text>
              </View>
            ) : null
          ))}
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  backButton: {
    padding: 8,
  },
  backButtonText: {
    fontSize: 24,
    color: "#000",
    marginTop: 40
  },
  headerTitle: {
    flex: 1,
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    marginTop: 40
  },
  editButton: {
    backgroundColor: "#ffc000",
    padding: 8,
    borderRadius: 5,
    minWidth: 70,
    alignItems: "center",
    marginTop: 40
  },
  editButtonText: {
    color: "#000",
    fontWeight: "bold",
  },
  statusContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    padding: 16,
    backgroundColor: "#fff",
    marginVertical: 8,
  },
  statusItem: {
    alignItems: "center",
  },
  statusLabel: {
    fontSize: 14,
    color: "#666",
    marginBottom: 4,
  },
  statusBadge: {
    padding: 8,
    borderRadius: 20,
    minWidth: 100,
    alignItems: "center",
  },
  statusText: {
    fontSize: 14,
    fontWeight: "500",
  },
  section: {
    backgroundColor: "#fff",
    padding: 16,
    marginVertical: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 16,
    color: "#333",
  },
  inputContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    color: "#666",
    marginBottom: 4,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 5,
    padding: 10,
    fontSize: 16,
    backgroundColor: "#fff",
  },
  disabledInput: {
    backgroundColor: "#f5f5f5",
    color: "#666",
  },
  documentsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  documentItem: {
    width: (width - 48) / 2,
    marginBottom: 16,
  },
  documentImage: {
    width: "100%",
    height: 120,
    borderRadius: 8,
    backgroundColor: "#f0f0f0",
  },
  documentLabel: {
    fontSize: 14,
    color: "#666",
    marginTop: 4,
    textAlign: "center",
  },
  profilePictureContainer: {
    alignItems: 'center',
    marginVertical: 16,
  },
  profilePicture: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#f0f0f0',
  },
  idImageContainer: {
    alignItems: 'center',
    marginVertical: 16,
    width: 200,
    alignSelf: 'center'
  },
  idImage: {
    width: '100%',
    height: 120,
    borderRadius: 8,
    backgroundColor: '#f0f0f0',
  },
});

export default ViewEditInformation;
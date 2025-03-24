import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, ScrollView, Image, Modal, ActivityIndicator } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL, API_URL_UPLOADS } from './config'; // Import both API URLs

const DriverProfile = () => {
  const [driverData, setDriverData] = useState(null);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();

  const redirectHome = () => {
    navigation.goBack(); 
  };

  useEffect(() => {
    const fetchDriverData = async () => {
      setLoading(true);
      try {
        const idsString = await AsyncStorage.getItem("theIds");
        const ids = JSON.parse(idsString);
        const driverId = ids?.driver_id; // Access driver_id directly

        if (driverId) {
          const response = await fetch(`${API_URL}/driver/${driverId}`);
          const data = await response.json();

          if (data && data.length > 0) {
            setDriverData(data[0]); // Set the first driver data object
            console.log('Fetched Driver Details:', data[0]); // Console log driver details
          } else {
            console.error('No data found or data is not in expected format.');
          }
        } else {
          console.error('No driver ID found in storage.');
        }
      } catch (error) {
        console.error('Error fetching driver data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDriverData();
  }, []);

  const handleUpdateProfile = async () => {
    // Code to update profile goes here
    setIsEditModalVisible(false);
  };

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  if (!driverData) {
    return <Text>No driver data found.</Text>;
  }

  // Safely construct the profile image URLs
  const profileImageUri = driverData.profilePic ? `${API_URL_UPLOADS}/${driverData.profilePic}` : null;
  const idImageUri = driverData.id_image ? `${API_URL_UPLOADS}/${driverData.id_image}` : null;
  const numberPlateImageUri = driverData.number_plate_image ? `${API_URL_UPLOADS}/${driverData.number_plate_image}` : null;
  const driverLicenseImageUri = driverData.driver_license_image ? `${API_URL_UPLOADS}/${driverData.driver_license_image}` : null;

  return (
    <View style={styles.container}>
      <View style={styles.topBar}>
        <TouchableOpacity style={styles.backArrow} onPress={redirectHome}>
          <MaterialIcons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.title}>Driver Profile</Text>
        <TouchableOpacity style={styles.editButton} onPress={() => setIsEditModalVisible(true)}>
          <MaterialIcons name="edit" size={24} color="#000" />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.profileContainer}>
          {profileImageUri ? (
            <Image source={{ uri: profileImageUri }} style={styles.profileImage} />
          ) : (
            <View style={styles.placeholderImage}></View>
          )}
          <View style={styles.detailsContainer}>
            <View style={styles.detailItem}>
              <Text style={styles.label}>Name:</Text>
              <TextInput style={styles.input} value={driverData.name} editable={false} />
            </View>
            <View style={styles.detailItem}>
              <Text style={styles.label}>Surname:</Text>
              <TextInput style={styles.input} value={driverData.surname} editable={false} />
            </View>
            <View style={styles.detailItem}>
              <Text style={styles.label}>Username:</Text>
              <TextInput style={styles.input} value={driverData.username} editable={false} />
            </View>
            <View style={styles.detailItem}>
              <Text style={styles.label}>Phone:</Text>
              <TextInput style={styles.input} value={driverData.phone} editable={false} />
            </View>
            <View style={styles.detailItem}>
              <Text style={styles.label}>Email:</Text>
              <TextInput style={styles.input} value={driverData.email} editable={false} />
            </View>
            <View style={styles.detailItem}>
              <Text style={styles.label}>Vehicle Plate:</Text>
              <TextInput style={styles.input} value={driverData.plate} editable={false} />
            </View>
            <View style={styles.detailItem}>
              <Text style={styles.label}>Membership Status:</Text>
              <TextInput style={styles.input} value={driverData.membershipstatus} editable={false} />
            </View>
          </View>

          {/* Display images with labels */}
          <Text style={styles.label}>Images:</Text>
          <View style={styles.imageContainer}>
            {profileImageUri && (
              <View style={styles.imageWrapper}>
                <Text style={styles.imageLabel}>Profile Picture</Text>
                <Image source={{ uri: profileImageUri }} style={styles.image} />
              </View>
            )}
            {idImageUri && (
              <View style={styles.imageWrapper}>
                <Text style={styles.imageLabel}>ID Image</Text>
                <Image source={{ uri: idImageUri }} style={styles.image} />
              </View>
            )}
            {numberPlateImageUri && (
              <View style={styles.imageWrapper}>
                <Text style={styles.imageLabel}>Number Plate Image</Text>
                <Image source={{ uri: numberPlateImageUri }} style={styles.image} />
              </View>
            )}
            {driverLicenseImageUri && (
              <View style={styles.imageWrapper}>
                <Text style={styles.imageLabel}>Driver License Image</Text>
                <Image source={{ uri: driverLicenseImageUri }} style={styles.image} />
              </View>
            )}
          </View>
        </View>

        <Modal
          visible={isEditModalVisible}
          animationType="slide"
          onRequestClose={() => setIsEditModalVisible(false)}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Edit Driver Profile</Text>
              <TouchableOpacity onPress={() => setIsEditModalVisible(false)}>
                <MaterialIcons name="close" size={24} color="#000" />
              </TouchableOpacity>
            </View>
            <View style={styles.modalContent}>
              <View style={styles.detailItem}>
                <Text style={styles.label}>Name:</Text>
                <TextInput
                  style={styles.input}
                  value={driverData.name}
                  onChangeText={(text) => setDriverData({ ...driverData, name: text })}
                />
              </View>
              <View style={styles.detailItem}>
                <Text style={styles.label}>Surname:</Text>
                <TextInput
                  style={styles.input}
                  value={driverData.surname}
                  onChangeText={(text) => setDriverData({ ...driverData, surname: text })}
                />
              </View>
              <View style={styles.detailItem}>
                <Text style={styles.label}>Phone:</Text>
                <TextInput
                  style={styles.input}
                  value={driverData.phone}
                  onChangeText={(text) => setDriverData({ ...driverData, phone: text })}
                />
              </View>
              <View style={styles.detailItem}>
                <Text style={styles.label}>Email:</Text>
                <TextInput
                  style={styles.input}
                  value={driverData.email}
                  onChangeText={(text) => setDriverData({ ...driverData, email: text })}
                />
              </View>
              <TouchableOpacity style={styles.updateButton} onPress={handleUpdateProfile}>
                <Text style={styles.updateButtonText}>Update Profile</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    backgroundColor: "#FFC000",
    paddingTop: 30,
    paddingBottom: 10,
  },
  backArrow: {
    padding: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: '#000',
    textAlign: 'center',
    flex: 1,
  },
  editButton: {
    padding: 8,
  },
  scrollContainer: {
    paddingHorizontal: 20,
    paddingVertical: 30,
  },
  profileContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 20,
    borderWidth: 2,
    borderColor: '#ccc',
  },
  placeholderImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#ccc', // Placeholder color
    marginBottom: 20,
  },
  detailsContainer: {
    alignSelf: 'flex-start', // Aligns text to the left
    width: '100%', // Ensures full width for text
  },
  detailItem: {
    marginBottom: 15,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
    color: '#000',
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 4,
    padding: 10,
    backgroundColor: '#f8f8f8', // Light background for input
  },
  imageContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  imageWrapper: {
    alignItems: 'center', // Center label and image
    margin: 5,
  },
  imageLabel: {
    marginBottom: 5,
    fontSize: 14,
    fontWeight: 'bold',
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 10,
  },
  modalContainer: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
  },
  modalContent: {
    marginTop: 20,
  },
  updateButton: {
    paddingVertical: 12,
    borderRadius: 4,
    alignItems: "center",
    backgroundColor: '#FFD700',
    marginTop: 20,
  },
  updateButtonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: '#000',
  },
});

export default DriverProfile;
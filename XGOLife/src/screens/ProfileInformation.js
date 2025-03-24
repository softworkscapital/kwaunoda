import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, ScrollView, Image, Modal, ActivityIndicator } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL, API_URL_UPLOADS } from './config'; // Import both API URLs

const ProfileInformation = () => {
  const [userData, setUserData] = useState(null);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();

  const redirectHome = () => {
    navigation.navigate("Home");
  };

  useEffect(() => {
    const fetchUserData = async () => {
      setLoading(true);
      try {
        const idsString = await AsyncStorage.getItem("theIds");
        const ids = JSON.parse(idsString);
        const customerId = ids?.customerId; // Extracting customerId from theIds object

        if (customerId) {
          const response = await fetch(`${API_URL}/customerdetails/${customerId}`);
          const data = await response.json();

          // Assuming data is an array, get the first element
          if (Array.isArray(data) && data.length > 0) {
            setUserData(data[0]); // Set the first element as user data
            console.log('Fetched Customer Details:', data[0]); // Console log customer details
          } else {
            console.error('No data found or data is not in expected format.');
          }
        } else {
          console.error('No customer ID found in storage.');
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const handleUpdateProfile = async () => {
    // Code to update profile goes here
    // For example, make an API call to update the user data
    setIsEditModalVisible(false);
  };

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  if (!userData) {
    return <Text>No user data found.</Text>;
  }

  // Safely construct the profile image URL
  const profileImageUri = userData.profilePic ? `${API_URL_UPLOADS}/${userData.profilePic}` : null;

  return (
    <View style={styles.container}>
      <View style={styles.topBar}>
        <TouchableOpacity style={styles.backArrow} onPress={redirectHome}>
          <MaterialIcons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.title}>Profile Information</Text>
        <TouchableOpacity style={styles.editButton} onPress={() => setIsEditModalVisible(true)}>
          <MaterialIcons name="edit" size={24} color="#000" />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.profileContainer}>
          {profileImageUri ? (
            <Image
              source={{ uri: profileImageUri }} // Use the constructed URI
              style={styles.profileImage}
            />
          ) : (
            <View style={styles.placeholderImage}></View> // Placeholder if image is not available
          )}
          <View style={styles.detailsContainer}>
            <View style={styles.detailItem}>
              <Text style={styles.label}>Name:</Text>
              <TextInput
                style={styles.input}
                value={userData.name}
                editable={false} // Disable editing for display
              />
            </View>
            <View style={styles.detailItem}>
              <Text style={styles.label}>Surname:</Text>
              <TextInput
                style={styles.input}
                value={userData.surname}
                editable={false} // Disable editing for display
              />
            </View>
            <View style={styles.detailItem}>
              <Text style={styles.label}>Email:</Text>
              <TextInput
                style={styles.input}
                value={userData.email}
                editable={false} // Disable editing for display
              />
            </View>
            <View style={styles.detailItem}>
              <Text style={styles.label}>Phone:</Text>
              <TextInput
                style={styles.input}
                value={userData.phone}
                editable={false} // Disable editing for display
              />
            </View>
            <View style={styles.detailItem}>
              <Text style={styles.label}>Account Type:</Text>
              <TextInput
                style={styles.input}
                value={userData.account_type}
                editable={false} // Disable editing for display
              />
            </View>
            <View style={styles.detailItem}>
              <Text style={styles.label}>Membership Status:</Text>
              <TextInput
                style={styles.input}
                value={userData.membershipstatus}
                editable={false} // Disable editing for display
              />
            </View>
          </View>
        </View>

        <Modal
          visible={isEditModalVisible}
          animationType="slide"
          onRequestClose={() => setIsEditModalVisible(false)}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Edit Profile</Text>
              <TouchableOpacity onPress={() => setIsEditModalVisible(false)}>
                <MaterialIcons name="close" size={24} color="#000" />
              </TouchableOpacity>
            </View>
            <View style={styles.modalContent}>
              <View style={styles.detailItem}>
                <Text style={styles.label}>Name:</Text>
                <TextInput
                  style={styles.input}
                  value={userData.name}
                  onChangeText={(text) => setUserData({ ...userData, name: text })}
                />
              </View>
              <View style={styles.detailItem}>
                <Text style={styles.label}>Surname:</Text>
                <TextInput
                  style={styles.input}
                  value={userData.surname}
                  onChangeText={(text) => setUserData({ ...userData, surname: text })}
                />
              </View>
              <View style={styles.detailItem}>
                <Text style={styles.label}>Email:</Text>
                <TextInput
                  style={styles.input}
                  value={userData.email}
                  onChangeText={(text) => setUserData({ ...userData, email: text })}
                />
              </View>
              <View style={styles.detailItem}>
                <Text style={styles.label}>Phone:</Text>
                <TextInput
                  style={styles.input}
                  value={userData.phone}
                  onChangeText={(text) => setUserData({ ...userData, phone: text })}
                />
              </View>
              <View style={styles.detailItem}>
                <Text style={styles.label}>Account Type:</Text>
                <TextInput
                  style={styles.input}
                  value={userData.account_type}
                  onChangeText={(text) => setUserData({ ...userData, account_type: text })}
                />
              </View>
              <View style={styles.detailItem}>
                <Text style={styles.label}>Membership Status:</Text>
                <TextInput
                  style={styles.input}
                  value={userData.membershipstatus}
                  onChangeText={(text) => setUserData({ ...userData, membershipstatus: text })}
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

export default ProfileInformation;
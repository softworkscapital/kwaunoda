import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons'; // Make sure you have @expo/vector-icons installed
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL } from './config';
import Toast from 'react-native-toast-message';

const EditProfile = ({ navigation }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [licensePlate, setLicensePlate] = useState('');
  const [driver_id, setDriver_id] = useState();
  const APILINK = API_URL;

  // Load user details from AsyncStorage on component mount
  useEffect(() => {
    const loadUserData = async () => {
      const Details = await AsyncStorage.getItem("userDetails");
      if (Details) {
        const parsedData = JSON.parse(Details);
        setName(parsedData.name);
        setEmail(parsedData.email);
        setPhone(parsedData.phone);
        setAddress(parsedData.address);
        setLicensePlate(parsedData.licensePlate);
        setDriver_id(parsedData.driver_id); // You might want to replace this with dynamic data
      }
    };
    loadUserData();
  }, []);

  const handleSave = async () => {
    // Validation check
    if (!name || !email || !phone || !licensePlate) {
      Toast.show({
        type: 'error',
        text1: 'Validation Error',
        text2: 'Please fill in all fields before saving.',
      });
      return;
    }

    const data = {
      name,
      email,
      phone,
      address,
      licensePlate,
    };

    try {
      const response = await fetch(`${APILINK}/driver/${driver_id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();
      console.log('Response:', result);

    } catch (error) {
      console.log(error);
    }

    navigation.goBack(); // Go back to the previous screen after saving
  };

  const handleGoBack = () => {
    navigation.goBack(); // Navigate back to the previous screen
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
    backgroundColor: '#f8f8f8',
  },
  topBar: {
    width: '100%',
    backgroundColor: '#ffc000', // Yellow background for the top bar
    paddingVertical: 30,
    paddingHorizontal: 15,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1, // Ensure top bar is on top of other content
  },
  backButton: {
    position: 'absolute',
    left: 15,
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333', // Darker text for contrast
    textAlign: 'center',
  },
  content: {
    flexGrow: 1,
    paddingTop: 120, // Adjust this value based on the height of the top bar
    paddingHorizontal: 20,
  },
  input: {
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 15,
    backgroundColor: '#fff',
  },
  saveButton: {
    backgroundColor: '#FFC000',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  saveButtonText: {
    color: '#000',
    fontSize: 18,
    fontWeight: 'bold',
  },
  toast: {
    zIndex: 2, // Ensure the toast appears above the header
  },
});

export default EditProfile;
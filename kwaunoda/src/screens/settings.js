import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons'; // Make sure you have @expo/vector-icons installed

const Settings = ({ navigation }) => {
  const handleUpdateProfile = () => {
    navigation.navigate('EditProfile'); // Navigate to EditProfile.js
  };

  const handleChangePassword = () => {
    navigation.navigate('ChangePassword'); // Navigate to ChangePassword.js
  };

  const handleGoBack = () => {
    navigation.goBack(); // Go back to the previous page
  };

  return (
    <View style={styles.container}>
      <View style={styles.topBar}>
        <TouchableOpacity onPress={handleGoBack} style={styles.backButton}>
          <Ionicons name="arrow-back-outline" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.headerText}>Settings</Text>
      </View>

      <View style={[styles.content]}>
        <TouchableOpacity style={styles.option} onPress={handleUpdateProfile}>
          <Ionicons name="person-circle-outline" size={24} color="black" />
          <Text style={styles.optionText}>Update Profile</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.option} onPress={handleChangePassword}>
          <Ionicons name="key-outline" size={24} color="black" />
          <Text style={styles.optionText}>Change Password</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F8F8', // Light gray background for modern feel
  },
  topBar: {
    width: '100%',
    backgroundColor: '#ffc000', // Yellow background for the top bar
    paddingVertical: 30, // Adjust padding for top bar height
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
    flex: 1,
    paddingTop: 120, // Adjust this value based on the height of the top bar
    paddingHorizontal: 20,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 10,
    marginBottom: 20,
    backgroundColor: '#FFF',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  optionText: {
    marginLeft: 10,
    fontSize: 18,
    color: '#333',
  },
});

export default Settings;
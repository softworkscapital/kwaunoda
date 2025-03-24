import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons'; 
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL } from './config';
import Toast from 'react-native-toast-message';
import { useNavigation } from "@react-navigation/native";

const ChangePassword = () => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const navigation = useNavigation();
  
  const validateInput = () => {
    if (!currentPassword) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Please fill out the current password.',
      });
      return false;
    }

    if (!newPassword) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Please fill out the new password.',
      });
      return false;
    }

    if (!confirmPassword) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Please fill out the confirm password.',
      });
      return false;
    }

    return true;
  };

  const handleChangePassword = async () => {
    const result = await AsyncStorage.getItem("userDetails");
    const user = JSON.parse(result);

    if (!user) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'User not found. Please log in again.',
      });
      return;
    }

    if (!validateInput()) return;

    const userType = user.account_type;
    const id = user.driver_id;
    const cid = user.customerid;
    const APILINK = API_URL;

    try {
      const response = await fetch(userType === "driver" ? `${APILINK}/driver/${id}` : `${APILINK}/customerdetails/${cid}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ password: newPassword }),
      });

      if (response.ok) {
        Toast.show({
          type: 'success',
          text1: 'Success',
          text2: 'Your password has been changed.',
        });
        navigation.goBack(); 
      } else {
        const result = await response.json();
        Toast.show({
          type: 'error',
          text1: 'Error',
          text2: result.message || 'Failed to change password.',
        });
      }
    } catch (error) {
      console.log("Error:", error);
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Failed to change password. Please try again.',
      });
    }
  };

  const handleredirectdashboard = () => {
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <View style={styles.topBar}>
        <TouchableOpacity onPress={handleredirectdashboard} style={styles.backButton}>
          <Ionicons name="arrow-back-outline" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.headerText}>Change Password</Text>
      </View>

      <View style={styles.content}>
        <View style={styles.inputContainer}>
          <Ionicons name="lock-closed-outline" size={20} color="#888" style={styles.icon} />
          <TextInput
            style={styles.input}
            placeholder="Current Password"
            secureTextEntry
            value={currentPassword}
            onChangeText={setCurrentPassword}
          />
        </View>

        <View style={styles.inputContainer}>
          <Ionicons name="lock-closed-outline" size={20} color="#888" style={styles.icon} />
          <TextInput
            style={styles.input}
            placeholder="New Password"
            secureTextEntry
            value={newPassword}
            onChangeText={setNewPassword}
          />
        </View>

        <View style={styles.inputContainer}>
          <Ionicons name="lock-closed-outline" size={20} color="#888" style={styles.icon} />
          <TextInput
            style={styles.input}
            placeholder="Confirm New Password"
            secureTextEntry
            value={confirmPassword}
            onChangeText={setConfirmPassword}
          />
        </View>

        <TouchableOpacity style={styles.button} onPress={handleChangePassword}>
          <Text style={styles.buttonText}>Change Password</Text>
        </TouchableOpacity>
      </View>

      <Toast ref={(ref) => Toast.setRef(ref)} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9',
  },
  topBar: {
    width: '100%',
    backgroundColor: '#ffc000',
    paddingVertical: 30,
    paddingHorizontal: 15,
    flexDirection: 'row',
    alignItems: 'center',
    position: 'absolute',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1,
  },
  backButton: {
    position: 'absolute',
    left: 15,
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    flex: 1,
  },
  content: {
    flex: 1,
    paddingTop: 75,
    paddingHorizontal: 30,
    justifyContent: 'center',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 5,
    backgroundColor: '#fff',
    marginBottom: 15,
  },
  icon: {
    paddingHorizontal: 10,
  },
  input: {
    height: 50,
    flex: 1,
    paddingHorizontal: 10,
  },
  button: {
    backgroundColor: '#FFC000',
    paddingVertical: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#000',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ChangePassword;
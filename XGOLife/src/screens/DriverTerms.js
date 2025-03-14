import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
  Image
} from 'react-native';
import { WebView } from 'react-native-webview';
import Toast from 'react-native-toast-message';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/FontAwesome';

const DriverTerms = ({ navigation }) => {
  const [loading, setLoading] = useState(true);
  const [userInfo, setUserInfo] = useState(null);
  const [profileImage, setProfileImage] = useState(null);
  const [isAgreed, setIsAgreed] = useState(false);

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const data = await AsyncStorage.getItem("userInfo");
        if (data) {
          setUserInfo(JSON.parse(data));
          setProfileImage(data.profileImage);
        }
      } catch (error) {
        console.error("Error retrieving user info:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserInfo();
  }, []);

  const handleAccept = () => {
    if (isAgreed) {
      navigation.navigate("SignUpDriver");
    } else {
      Alert.alert("Error", "You must agree to the terms and conditions.");
    }
  };

  const handleDecline = async () => {
    try {
      await AsyncStorage.clear();
      Alert.alert("Declined", "You have declined the terms and conditions.");
      navigation.navigate("CustomerLogin");
    } catch (error) {
      console.error("Error clearing AsyncStorage:", error);
      Alert.alert("Error", "Failed to clear user data. Please try again.");
    }
  };

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" style={styles.loadingIndicator} />;
  }

  return (
    <ScrollView style={styles.container}>
     <View style={styles.topBar}>
         <Image
           source={require("../../assets/icon.png")}
           style={{ width: 200, height: 80 }} // Set width and height to 40
         />
       </View>

      <Text style={styles.title}>Terms and Conditions</Text>

      <WebView 
        source={{ uri: 'https://remsbobtail.softworkscapital.com/rems/rems/about.php' }}  
        style={styles.webview} 
      />

      <View style={styles.agreementContainer}>
        <TouchableOpacity
          style={[styles.checkbox, isAgreed && styles.checkedCheckbox]}
          onPress={() => setIsAgreed(!isAgreed)}
        >
          {isAgreed && <Icon name="check" size={20} color="#fff" />}
        </TouchableOpacity>
        <Text style={styles.agreementText}>
          By clicking, you have agreed to the terms and conditions.
        </Text>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={handleAccept}>
          <Text style={styles.continueButtonText}>Continue</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.button, styles.declineButton]} onPress={handleDecline}>
          <Text style={styles.declineButtonText}>Decline</Text>
        </TouchableOpacity>
      </View>

      <Toast />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  loadingIndicator: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  topBar: {
    height: 150,
    backgroundColor: "#FFC000",
    borderBottomLeftRadius: 45,
    borderBottomRightRadius: 45,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  logo: {
    width: 200,
    height: 80,
  },
  title: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 20,
    marginTop: 50,
  },
  webview: {
    height: 570,
    marginBottom: 20,
  },
  agreementContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
    padding: 10,
    backgroundColor: '#f9f9f9',
    borderRadius: 5,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderWidth: 2,
    borderColor: '#000',
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
    marginLeft: 40,
  },
  checkedCheckbox: {
    backgroundColor: 'red',
  },
  agreementText: {
    fontSize: 16,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  button: {
    width: 150, // Fixed width for buttons
    height: 50, // Fixed height for buttons
    paddingVertical: 12,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFC000',
  },
  continueButtonText: {
    color: 'black',
    fontSize: 16,
    fontWeight: 'bold',
  },
  declineButton: {
    backgroundColor: 'red',
  },
  declineButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default DriverTerms;
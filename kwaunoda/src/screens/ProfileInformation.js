import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, ScrollView, Image, Modal } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from "@react-navigation/native";
import BottomFooter from './BottomFooter';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL } from './config';

const ProfileInformation = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [role, setRole] = useState('');
  const [driver_id, setDriver_id] = useState();
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [deliveryCount, setDeliveryCount] = useState(0);
  const APILINK = API_URL;

  const navigation = useNavigation();

  const redirectHome = () => {
    navigation.navigate("HomeDriver");
  };

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const Details = await AsyncStorage.getItem("userDetails");
        if (Details) {
          const parsedData = JSON.parse(Details);
          setName(parsedData.name);
          setEmail(parsedData.email);
          setPhone(parsedData.phone);
          setAddress(parsedData.address);
          setDriver_id(parsedData.driver_id);
          setRole(parsedData.usertype);
          await fetchDeliveryCount(parsedData.driver_id); // Fetch delivery count
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, []);

  const fetchDeliveryCount = async (driverId) => {
    try {
      const response = await fetch(`${APILINK}/trip/byStatus/driver_id/status?driver_id=${driverId}&status=Trip Ended`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      const count = Array.isArray(data) ? data.length : 0; // Ensure data is an array before counting
      setDeliveryCount(count); // Update state with the count
    } catch (error) {
      console.error("Error fetching delivery count:", error);
    }
  };

  const handleUpdateProfile = async () => {
    const data = {
      name: name,
      email: email,
      phone: phone,
      address: address,
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
      console.log(result);
    } catch (error) {
      console.log(error);
    }
    
    setIsEditModalVisible(false);
  };

  return (
    <View style={styles.container}>
      <View style={[styles.topBar, styles.goldenYellow, { paddingTop: 30 }]}>
        <TouchableOpacity style={styles.backArrow} onPress={redirectHome}>
          <MaterialIcons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <View style={styles.topBarContent}>
          <Text style={[styles.title, { color: '#000' }]}>Profile Information</Text>
        </View>
        <TouchableOpacity style={styles.editButton} onPress={() => setIsEditModalVisible(true)}>
          <MaterialIcons name="edit" size={24} color="#000" />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.profileContainer}>
          <Image
            style={styles.profilePicture}
            source={require("../../assets/profile.jpeg")}
          />
          <View>
            <Text style={styles.username}>{name}</Text>
            <Text style={styles.username}>{role}</Text>
          </View>
        </View>

        <View style={styles.detailsContainer}>
          <View style={styles.detail}>
            <MaterialIcons name="phone" size={20} color="#000" />
            <Text style={[styles.text, { marginLeft: 10 }]}>{phone}</Text>
          </View>
          <View style={styles.detail}>
            <MaterialIcons name="email" size={20} color="#000" />
            <Text style={[styles.text, { marginLeft: 10 }]}>{email}</Text>
          </View>
          <View style={styles.detail}>
            <MaterialIcons name="location-on" size={20} color="#000" />
            <Text style={[styles.text, { marginLeft: 10 }]}>{address}</Text>
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Total Deliveries</Text>
          <Text style={styles.cardValue}>{deliveryCount}</Text> {/* Updated to show delivery count */}
        </View>

        <View style={styles.linksContainer}>
          <TouchableOpacity style={[styles.linkItem, { flexDirection: 'row', marginBottom: 20 }]}>
            <MaterialIcons name="people" size={24} color="#000" />
            <Text style={[styles.linkText, { marginLeft: 10 }]}>Invite Friends</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.linkItem, { flexDirection: 'row' }]}>
            <MaterialIcons name="local-offer" size={24} color="#000" />
            <Text style={[styles.linkText, { marginLeft: 10 }]}>Promotions</Text>
          </TouchableOpacity>
        </View>

        <Modal
          visible={isEditModalVisible}
          animationType="slide"
          onRequestClose={() => setIsEditModalVisible(false)}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: '#000' }]}>Edit Profile</Text>
              <TouchableOpacity onPress={() => setIsEditModalVisible(false)}>
                <MaterialIcons name="close" size={24} color="#000" />
              </TouchableOpacity>
            </View>
            <View style={styles.modalContent}>
              <View style={styles.detail}>
                <Text style={[styles.label, { color: '#000' }]}>Name:</Text>
                <TextInput
                  style={[styles.input, { color: '#000' }]}
                  value={name}
                  onChangeText={(text) => setName(text)}
                />
              </View>
              <View style={styles.detail}>
                <Text style={[styles.label, { color: '#000' }]}>Email:</Text>
                <TextInput
                  style={[styles.input, { color: '#000' }]}
                  value={email}
                  onChangeText={(text) => setEmail(text)}
                />
              </View>
              <View style={styles.detail}>
                <Text style={[styles.label, { color: '#000' }]}>Phone:</Text>
                <TextInput
                  style={[styles.input, { color: '#000' }]}
                  value={phone}
                  onChangeText={(text) => setPhone(text)}
                />
              </View>
              <View style={styles.detail}>
                <Text style={[styles.label, { color: '#000' }]}>Address:</Text>
                <TextInput
                  style={[styles.input, { color: '#000' }]}
                  value={address}
                  onChangeText={(text) => setAddress(text)}
                />
              </View>
              <TouchableOpacity style={[styles.updateButton, { backgroundColor: '#FFD700' }]} onPress={handleUpdateProfile}>
                <Text style={[styles.updateButtonText, { color: '#000' }]}>Update Profile</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </ScrollView>
      <BottomFooter />
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
  },
  backArrow: {
    padding: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
  },
  editButton: {
    padding: 8,
  },
  scrollContainer: {
    paddingHorizontal: 20,
    paddingVertical: 30,
  },
  profileContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  profilePicture: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 10,
  },
  username: {
    fontSize: 18,
    fontWeight: "bold",
  },
  detailsContainer: {
    marginBottom: 20,
  },
  detail: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  text: {
    fontSize: 16,
  },
  card: {
    padding: 20,
    backgroundColor: "#f9f9f9",
    borderRadius: 8,
    marginBottom: 20,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  cardValue: {
    fontSize: 24,
    color: "#000",
  },
  linksContainer: {
    marginVertical: 20,
  },
  linkItem: {
    paddingVertical: 10,
  },
  linkText: {
    fontSize: 16,
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
  label: {
    fontSize: 16,
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 4,
    padding: 10,
    marginBottom: 20,
  },
  updateButton: {
    paddingVertical: 12,
    borderRadius: 4,
    alignItems: "center",
  },
  updateButtonText: {
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default ProfileInformation;
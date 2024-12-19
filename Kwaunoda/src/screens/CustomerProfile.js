import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, ScrollView, Image, Modal } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import BottomFooter2 from './BottomFooter2';

const CustomerProfile = () => {
  const [user, setUser] = useState({
    name: '',
    surname: '',
    username: '',
    ID_no: '',
    email: '',
    phone: '',
    address: '',
    usertype: '', 
  });
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  
  const navigation = useNavigation();

  const redirectHome = () => {
    navigation.navigate("Home");
  };

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userData = await AsyncStorage.getItem('userDetails');
        if (userData) {
          setUser(JSON.parse(userData));
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };
    fetchUserData();
  }, []);

  const handleUpdateProfile = () => {
    // Implement logic to update user profile in AsyncStorage if needed
    console.log('Updating user profile:', user);
    setIsEditModalVisible(false);
  };

  return (
    <View style={styles.container}>
      <View style={[styles.topBar, styles.goldenYellow, {paddingTop: 30}]}>
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
            <Text style={styles.name}>{`${user.name} ${user.surname}`}</Text>
            <Text style={styles.usertype}>{user.usertype}</Text>
          </View>
        </View>

        <View style={styles.detailsContainer}>
          <View style={styles.detail}>
            <MaterialIcons name="user" size={20} color="#000" />
            <Text style={[styles.text, {marginLeft: 10}]}>{user.username}</Text>
          </View>
          <View style={styles.detail}>
            <MaterialIcons name="phone" size={20} color="#000" />
            <Text style={[styles.text, {marginLeft: 10}]}>{user.phone}</Text>
          </View>
          <View style={styles.detail}>
            <MaterialIcons name="email" size={20} color="#000" />
            <Text style={[styles.text, {marginLeft: 10}]}>{user.email}</Text>
          </View>
          <View style={styles.detail}>
            <MaterialIcons name="id" size={20} color="#000" />
            <Text style={[styles.text, {marginLeft: 10}]}>{user.ID_no}</Text>
          </View>
          <View style={styles.detail}>
            <MaterialIcons name="location-on" size={20} color="#000" />
            <Text style={[styles.text, {marginLeft: 10}]}>{user.address}</Text>
          </View>
        </View>

        <View style={[styles.card, { marginTop: 20 }]}>
          <Text style={styles.cardTitle}>Total Deliveries</Text>
          <Text style={styles.cardValue}>42</Text>
        </View>

        <View style={[styles.linksContainer, { marginTop: 20 }]}>
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
                  value={user.name}
                  onChangeText={(text) => setUser({ ...user, name: text })}
                />
              </View>
              <View style={styles.detail}>
                <Text style={[styles.label, { color: '#000' }]}>Email:</Text>
                <TextInput
                  style={[styles.input, { color: '#000' }]}
                  value={user.email}
                  onChangeText={(text) => setUser({ ...user, email: text })}
                />
              </View>
              <View style={styles.detail}>
                <Text style={[styles.label, { color: '#000' }]}>Phone:</Text>
                <TextInput
                  style={[styles.input, { color: '#000' }]}
                  value={user.phone}
                  onChangeText={(text) => setUser({ ...user, phone: text })}
                />
              </View>
              <View style={styles.detail}>
                <Text style={[styles.label, { color: '#000' }]}>Address:</Text>
                <TextInput
                  style={[styles.input, { color: '#000' }]}
                  value={user.address}
                  onChangeText={(text) => setUser({ ...user, address: text })}
                />
              </View>
              <TouchableOpacity style={[styles.updateButton, { backgroundColor: '#FFD700' }]} onPress={handleUpdateProfile}>
                <Text style={[styles.updateButtonText, { color: '#000' }]}>Update Profile</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </ScrollView>

      <BottomFooter2/>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  goldenYellow: {
    backgroundColor: '#FFD700',
  },
  backArrow: {
    padding: 8,
  },
  topBarContent: {
    flex: 1,
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  editButton: {
    padding: 8,
  },
  scrollContainer: {
    paddingHorizontal: 16,
    paddingVertical: 24,
  },
  profileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  profilePicture: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginRight: 16,
  },
  username: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  detailsContainer: {
    marginBottom: 20,
  },
  detail: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginRight: 8,
  },
  text: {
    fontSize: 16,
  },
  card: {
    backgroundColor: '#f5f5f5',
    padding: 16,
    borderRadius: 8,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  cardValue: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  linksContainer: {
    flexDirection: 'column',
  },
  linkItem: {
    marginHorizontal: 8,
  },
  linkText: {
    fontSize: 14,
    marginTop: 4,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 16,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  modalContent: {
    flex: 1,
  },
  input: {
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    padding: 8,
  },
  updateButton: {
    backgroundColor: '#FFD700',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 4,
    marginTop: 16,
  },
  updateButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  bottomBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 12,
  },
  bottomBarItem: {
    alignItems: 'center',
  },
  bottomBarText: {
    fontSize: 14,
    marginTop: 4,
  },
});

export default CustomerProfile;
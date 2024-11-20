import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Image,
  Modal,
  FlatList,
  ScrollView,
  Dimensions,
  Alert,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { FontAwesome } from "@expo/vector-icons"; // Ensure you have this package installed
import AsyncStorage from "@react-native-async-storage/async-storage"; // Ensure AsyncStorage is installed
import defaultprofpic from "../../assets/defaultprofpic.webp";
import { API_URL } from "../screens/config";

const { height } = Dimensions.get("window"); // Get device height

const TopView = ({}) => {
  const navigation = useNavigation();
  const [modalVisible, setModalVisible] = useState(false);
  const [profileImage, setPic] = useState();
  const [customerType, setType] = useState("");
  const [name, setName] = useState("");
  const [id, setid] = useState("");
  const [notificationCount, setNotificationCount] = useState(0);
  const APILINK = API_URL;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const storedIds = await AsyncStorage.getItem("theIds");
        if (storedIds) {
         const parsedIds = JSON.parse(storedIds);
          let acc; // Use let to define acc here

          if (parsedIds.last_logged_account === "driver") {
            acc = parsedIds.driver_id;
            setid(parsedIds.driver_id);
          } else {
            acc = parsedIds.customerId;
          }

          await fetchUserDetails(acc, parsedIds.last_logged_account);
         
        } else {
          Alert.alert("Driver ID not found", "Please log in again.");
          setLoading(false);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        Alert.alert("Error", "An error occurred while fetching data.");
        setLoading(false);
      }
    };
    fetchData();
    const fetchUserDetails = async (id, type) => {
      try {
        const endpoint =
          type === "driver" ? `driver/${id}` : `customerdetails/${id}`;
        const response = await fetch(`${APILINK}/${endpoint}`);
        const result = await response.json();

        if (result && result.length > 0) {
          await AsyncStorage.setItem("userDetails", JSON.stringify(result[0]));
          console.log(result);
          setPic(`${APILINK}${result[0].profilePic}`);
          setType(result[0].account_type);
          setName(result[0].username);
        } else {
          Alert.alert(
            "Error",
            `${type === "driver" ? "Driver" : "Customer"} details not found.`
          );
        }
      } catch (error) {
        Alert.alert("Error", "Failed to fetch details. Please try again.");
      }
    };
  });

  const menuOptions = [
    {
      id: "0",
      title: "Standard Account",
      onPress: () => handleMenuPress("StandardAccount"),
    },
    {
      id: "1",
      title: "Profile Info",
      onPress: () => handleMenuPress("EditProfile"),
    },
    { id: "9", title: "Wallet", onPress: () => handleMenuPress("Wallet") },
    { id: "7", title: "History", onPress: () => handleMenuPress("History") },
    { id: "8", title: "Settings", onPress: () => handleMenuPress("Settings") },
    { id: "2", title: "FAQ", onPress: () => handleMenuPress("FAQ") },
    { id: "3", title: "Safety", onPress: () => handleMenuPress("Safety") },
    {
      id: "10",
      title: "Chat",
      onPress: () => handleMenuPress("CustomerAdminChat"),
    },
    { id: "4", title: "Feedback", onPress: () => handleMenuPress("Feedback") },
    { id: "5", title: "About Us", onPress: () => handleMenuPress("AboutUs") },
    {
      id: "6",
      title: "Complaint",
      onPress: () => handleMenuPress("Complaint"),
    },
    {
      id: "11",
      title: "Tell A Friend",
      onPress: () => handleMenuPress("Invite"),
    },
    {
      id: "11",
      title: "Log Out",
      onPress: () => handleLogout(),
    },
  ];

  const handleMenuPress = (screen) => {
    setModalVisible(false);
    navigation.navigate(screen, { userId: id });
  };

  const handleLogout = async () => {
    try {
      await AsyncStorage.clear(); // Clear all items from AsyncStorage
      navigation.navigate("CustomerLogin"); // Navigate to the login screen
    } catch (error) {
      Alert.alert("Error", "Failed to log out. Please try again.");
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.profileContainer}>
        <Image
          source={{ uri: profileImage }}
          style={[styles.profileImage, { marginTop: 10 }]}
        />
        <View>
          <Text style={styles.profileName}>{name}</Text>
          <Text>{customerType}</Text>
        </View>
      </View>
      <View style={styles.notificationContainer}>
        <TouchableOpacity onPress={() => setModalVisible(true)}>
          <FontAwesome name="bell" size={24} color="black" />
          {notificationCount > 0 && (
            <View style={styles.notificationCount}>
              <Text style={styles.countText}>{notificationCount}</Text>
            </View>
          )}
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setModalVisible(true)}
          style={styles.menuButton}
        >
          <FontAwesome name="bars" size={24} color="black" />
        </TouchableOpacity>
      </View>

      <Modal
        transparent={true}
        animationType="slide"
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalBackground}>
          <View style={[styles.modalContainer, { height: height * 0.9 }]}>
            <ScrollView style={styles.scrollView}>
              <FlatList
                data={menuOptions}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={styles.menuItem}
                    onPress={item.onPress}
                  >
                    <Text style={styles.menuText}>{item.title}</Text>
                  </TouchableOpacity>
                )}
              />
            </ScrollView>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.closeText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 8,
    backgroundColor: "green",
    paddingTop: 30,
    paddingRight: 30,
    width: "100%",
  },
  profileContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  profileName: {
    fontWeight: "800",
  },
  notificationContainer: {
    flexDirection: "row",
    alignItems: "center",
    position: "relative",
  },
  notificationCount: {
    position: "absolute",
    right: -8,
    top: -8,
    backgroundColor: "red",
    borderRadius: 10,
    padding: 3,
    minWidth: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  countText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 12,
  },
  menuButton: {
    marginLeft: 15,
  },
  modalBackground: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContainer: {
    width: "90%",
    height: "100%",
    backgroundColor: "white",
    borderRadius: 10,
    padding: 20,
    elevation: 5,
  },
  scrollView: {
    width: "100%",
  },
  menuItem: {
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  menuText: {
    fontSize: 16,
  },
  closeButton: {
    alignItems: "center",
    padding: 10,
    backgroundColor: "green",
    borderRadius: 5,
    marginTop: 10,
  },
  closeText: {
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default TopView;

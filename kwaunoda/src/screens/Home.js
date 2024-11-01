import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  View,
  SafeAreaView,
  Image,
  ImageBackground,
  Text,
  TouchableOpacity,
  Modal,
  FlatList,
} from "react-native";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_URL } from "./config";

const menuOptions = [
  { id: "1", title: "Profile Info" },
  { id: "2", title: "Safety" },
  { id: "3", title: "Feedback" },
  { id: "4", title: "About Us" },
  { id: "5", title: "Complaint" },
  { id: "6", title: "History" },
  { id: "7", title: "Settings" },
];

const APILINK = API_URL;

const Home = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [notificationModalVisible, setNotificationModalVisible] =
    useState(false);
  const [userDetails, setUserDetails] = useState({
    name: "",
    surname: "",
    usertype: "",
  });
  const navigation = useNavigation();
  const [notificationCount, setNotificationCount] = useState(0);
  const [menuRequests, setMenuRequests] = useState([]);
  const [customerid, setCustomerid] = useState();

  const redirectToNotice = async (tripId) => {
    setNotificationModalVisible(false);

    try {
      const tripData = await AsyncStorage.getItem("tripStatus");
      const parsedTripData = JSON.parse(tripData);
      const tripDetails = parsedTripData.find(
        (item) => item.trip_id === tripId
      );
      console.log(tripDetails);

      await AsyncStorage.setItem("tripDetails", JSON.stringify(tripDetails));
      navigation.navigate("DeliveryAccepted", { tripDetails });
    } catch (error) {
      console.error("Error fetching trip data:", error);
    }
  };

  const fetchData = async (id) => {
    try {
      if (!id) {
        console.error("No ID provided to fetchData");
        return;
      }

      // console.log("henaro zi", id);
      const response = await fetch(`${APILINK}/trip/customer/notify/${id}`);
      const data = await response.json();
      // console.log(data);
      await AsyncStorage.setItem("tripStatus", JSON.stringify(data));

      if (data.length > 0) {
        const requests = data.map((item) => ({
          id: item.trip_id.toString(),
          title: `Order no ${item.trip_id}  |  ${item.status} \nPackage : ${item.deliveray_details}`,
          onPress: () => redirectToNotice(item.trip_id),
        }));

        setNotificationCount((prevCount) => prevCount + 1);
        setMenuRequests(requests);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    const fetchUserDetails = async () => {
      const storedId = await AsyncStorage.getItem("theIds");
      const parsedId = JSON.parse(storedId);
      const customerid = parsedId?.customerid; // Use optional chaining to avoid errors
      try {
        if (customerid) {
          const response = await fetch(
            `${APILINK}/customerdetails/${customerid}`,
            {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
              },
            }
          );

          const result = await response.json();
          // console.log(result);
          await AsyncStorage.setItem("userDetails", JSON.stringify(result[0]));

          setUserDetails({
            name: result[0].name || "",
            surname: result[0].surname || "",
            usertype: result[0].usertype || "",
          });

          fetchData(customerid); // Fetch data once user details are ready
          // console.log("chibaba ichii", customerid);

          // Set the interval here to keep fetching with the correct customerid
          const interval = setInterval(() => {
            fetchData(customerid); // Fetch data every 60 seconds
          }, 7000);

          // Clear interval on component unmount
          return () => clearInterval(interval);
        }
      } catch (error) {
        console.error("Error fetching user details: ", error);
      }
    };

    fetchUserDetails();
  }, []); // Only run once when the component mounts

  const redirectNewDelivery = async () => {
    navigation.navigate("MapViewComponent");
  };

  const toggleModal = () => {
    setModalVisible(!modalVisible);
  };

  const toggleNotificationModal = () => {
    setNotificationCount(0);
    setNotificationModalVisible(!notificationModalVisible);
  };

  const handleMenuOptionPress = (optionId) => {
    toggleModal();

    switch (optionId) {
      case "1":
        navigation.navigate("CustomerProfile");
        break;
      case "2":
        navigation.navigate("CustomerSafety");
        break;
      case "3":
        navigation.navigate("CustomerFeedback");
        break;
      case "4":
        navigation.navigate("CustomerAboutUs");
        break;
      case "5":
        navigation.navigate("CustomerComplaint");
        break;
      case "6":
        navigation.navigate("CustomerHistory");
        break;
      case "7":
        navigation.navigate("settings");
        break;
      default:
        console.log("Unknown option");
    }
  };

  // const handleNotificationPress = (tripId) => {
  //   toggleNotificationModal();

  //   setTimeout(() => {
  //     redirectToNotice(tripId);
  //   }, 300);
  // };

  return (
    <ImageBackground
      source={require("../../assets/map.png")}
      style={styles.backgroundImage}
      resizeMode="cover"
    >
      <View style={styles.overlay} />
      <SafeAreaView style={styles.container}>
        <View style={styles.viewTop}>
          <Image
            style={styles.profileImage}
            source={require("../../assets/profile.jpeg")}
          />

          <View style={styles.nameContainer}>
            <Text style={styles.firstName}>
              {userDetails.name} {userDetails.surname}
            </Text>
            <Text style={styles.surname}>{userDetails.usertype}</Text>
          </View>
          <TouchableOpacity
            style={styles.menuIcon}
            onPress={toggleNotificationModal}
          >
            <View style={styles.notificationBellContainer}>
              <FontAwesome5 name="bell" size={20} color="#595959" />
              <View style={styles.notificationBadge}>
                <Text style={styles.notificationBadgeText}>
                  {notificationCount}
                </Text>
              </View>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.menuIcon, { marginLeft: 15 }]}
            onPress={toggleModal}
          >
            <FontAwesome5 name="bars" size={20} color="#595959" />
          </TouchableOpacity>
        </View>

        {/* Menu Modal */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={toggleModal}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContainer}>
              <FlatList
                data={menuOptions}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={styles.menuOption}
                    onPress={() => handleMenuOptionPress(item.id)}
                  >
                    <Text style={styles.menuText}>{item.title}</Text>
                  </TouchableOpacity>
                )}
              />
              <TouchableOpacity
                style={styles.closeButton}
                onPress={toggleModal}
              >
                <Text style={styles.closeButtonText}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        {/* Notification Modal */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={notificationModalVisible}
          onRequestClose={toggleNotificationModal}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContainer}>
              <FlatList
                data={menuRequests}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={styles.menuOption}
                    onPress={item.onPress}
                  >
                    <Text style={styles.menuText}>{item.title}</Text>
                  </TouchableOpacity>
                )}
              />
              <TouchableOpacity
                style={styles.closeButton}
                onPress={toggleNotificationModal}
              >
                <Text style={styles.closeButtonText}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </SafeAreaView>

      {/* Single Card fixed at the bottom */}
      <View style={styles.fixedCard}>
        <View style={styles.ribbon}>
          <View
            style={{
              width: "90%",
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            <View style={styles.ribbonCard}>
              <TouchableOpacity style={styles.ribbonSection}>
                <FontAwesome5 name="truck" size={24} color="#595959" />
                <Text style={styles.ribbonText}>Mini Truck</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.ribbonCard}>
              <TouchableOpacity style={styles.ribbonSection}>
                <FontAwesome5 name="car" size={24} color="#595959" />
                <Text style={styles.ribbonText}>Car</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.ribbonCardActive}>
              <TouchableOpacity style={styles.ribbonSection}>
                <FontAwesome5 name="bicycle" size={24} color="#595959" />
                <Text style={styles.ribbonText}>Bike</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
        <TouchableOpacity
          style={styles.btnButton1}
          onPress={redirectNewDelivery}
        >
          <Text style={styles.txtLogin}>Request Delivery</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    width: "100%",
    justifyContent: "center",
  },
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-start",
    width: "100%",
  },
  viewTop: {
    height: 60,
    flexDirection: "row",
    backgroundColor: "rgba(255, 255, 255, 0.5)",
    width: "100%",
    marginTop: 32,
    paddingHorizontal: 20,
    alignItems: "center",
    justifyContent: "space-between",
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  nameContainer: {
    flexDirection: "column",
    flex: 1,
  },
  firstName: {
    fontSize: 13,
    color: "#595959",
    fontWeight: "bold",
  },
  surname: {
    fontSize: 13,
    color: "#595959",
    fontWeight: "bold",
  },
  menuIcon: {
    padding: 10,
  },
  notificationBellContainer: {
    position: "relative",
  },
  notificationBadge: {
    position: "absolute",
    top: -10,
    right: -10,
    backgroundColor: "#FF0000",
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  notificationBadgeText: {
    color: "#FFF",
    fontSize: 12,
    fontWeight: "bold",
  },
  fixedCard: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    backgroundColor: "#FFC000",
    height: "70%", // Adjust height as needed
    borderTopEndRadius: 50,
    borderTopStartRadius: 50,
    alignItems: "center",
    paddingBottom: 10,
    paddingTop: 100,
  },
  ribbon: {
    backgroundColor: "#fff",
    width: "90%",
    height: 100,
    flexDirection: "row",
    borderRadius: 40,
    justifyContent: "space-around",
    alignItems: "center",
    marginBottom: 10,
  },
  ribbonSection: {
    alignItems: "center",
  },
  ribbonText: {
    color: "#595959",
    fontSize: 12,
  },
  ribbonCard: {
    width: "28%",
    borderWidth: 1,
    borderColor: "#000000",
    backgroundColor: "#FFC00035",
    borderRadius: 20,
    padding: 7,
  },
  ribbonCardActive: {
    width: "28%",
    borderWidth: 1,
    borderColor: "#000000",
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 7,
  },
  btnButton1: {
    borderRadius: 20,
    backgroundColor: "#FFC000", // Background color
    borderWidth: 1, // Border width
    borderColor: "#000000", // Border color
    padding: 13,
    width: "50%",
    height: 50,
    alignItems: "center",
    alignSelf: "center",
    justifyContent: "center",
    marginTop: 20,
  },
  txtLogin: {
    color: "#595959",
    fontWeight: "bold",
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    width: "80%",
    backgroundColor: "white",
    borderRadius: 10,
    padding: 20,
    elevation: 5,
  },
  menuOption: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  menuText: {
    fontSize: 16,
    color: "#595959",
  },
  closeButton: {
    marginTop: 15,
    alignItems: "center",
    padding: 10,
    backgroundColor: "#FFC000",
    borderRadius: 5,
  },
  closeButtonText: {
    color: "#595959",
    fontWeight: "bold",
  },
});

export default Home;

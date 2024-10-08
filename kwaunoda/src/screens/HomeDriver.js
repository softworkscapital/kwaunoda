import React, { useState, useEffect } from "react";
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
  ScrollView,
} from "react-native";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_URL } from "./config";

const HomeDriver = () => {
  const navigation = useNavigation();
  const APILINK = API_URL;

  const [name, setName] = useState();
  const [type, setType] = useState();
  const [pic, setPic] = useState();
  const [driver, setDriverId] = useState();
  const [menuRequests, setMenuRequests] = useState([]);
  const [menuModalVisible, setMenuModalVisible] = useState(false);
  const [notificationModalVisible, setNotificationModalVisible] =
    useState(false);
  const [notificationCount, setNotificationCount] = useState(0);
  const [tripDetails, setTripDetails] = useState([]); // New state for trip details
  const [tripDetail, setTripDetail] = useState([]); // New state for trip details

  const [deliveryCount, setDeliveryCount] = useState(0);

  useEffect(() => {
    const instant = async () => {
      const storedIds = await AsyncStorage.getItem("theIds");
      if (storedIds) {
        const parsedIds = JSON.parse(storedIds);
        console.log(parsedIds);
        console.log(parsedIds.driver_id);

        const response = await fetch(
          `${APILINK}/driver/${parsedIds.driver_id}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        const result = await response.json();
        console.log(result);
        await AsyncStorage.setItem("userDetails", JSON.stringify(result[0]));

        setName(result[0].name);
        setType(result[0].usertype);
        setPic(result[0].profilePic);

        setDriverId(parsedIds.driver_id);
      }

      if (driver) {
        console.log("Calling getNumber with driver ID:", driver); // Log before calling
        getNumber(driver); // Call getNumber with the valid driver ID
        fetchData();
        getTrip(driver);
      }
    };

    instant();
    const interval = setInterval(() => {
      getTrip(driver);
      getNumber(driver);
      fetchData(); // Fetch data every 30 seconds
    }, 7000);
 
    // Clear interval on component unmount
    return () => clearInterval(interval);
  }, [driver]); // This will trigger when driver is updated

  const fetchData = async () => {



    try {

      const response = await fetch(`${APILINK}/trip/driver/notify/`);
      const data = await response.json();
      console.log(data);
      console.log("honaiwo", driver);

      if(data.length > 0){
              // Store the fetched data in AsyncStorage
      await AsyncStorage.setItem("tripStatus", JSON.stringify(data));

      const requests = data.map(item => ({
        id: item.trip_id.toString(), // Ensure the ID is a string
        title: `Order no ${item.trip_id}  |  ${item.status} \nPackage : ${item.deliveray_details} `, // Format the title
        onPress: () => redirectToNotice(item.trip_id), // Pass trip_id for further actions if needed
      }));

      setNotificationCount((prevCount) => prevCount + 1); // Increment count when opening the modal
      setMenuRequests(requests);
      }
            //////////////////////////////////////////////////////////////
            const Back = await fetch(`${APILINK}/trip/driver/notify/${driver}`);
            const back = await Back.json();
        
            if(back.length > 0){
              console.log("waiting iyi baba:", back);
              await AsyncStorage.setItem("EndTrip", JSON.stringify(back));
              navigation.navigate("Feedback");
            }
      
            /////////////////////////////////////////////////////////////

    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  console.log("driver", driver);

  const getNumber = async (driver) => {
    console.log("driver", driver);
    try {
      const response = await fetch(
        `${APILINK}/trip/byStatus/driver_id/status?driver_id=${driver}&status=Trip Ended`
      );
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();

      // Count the number of trips in the response
      const count = Array.isArray(data) ? data.length : 0; // Ensure data is an array before counting

      console.log(count); // Log the count
      setDeliveryCount(count); // Update state with the count

      // Optionally store in AsyncStorage if needed
      await AsyncStorage.setItem("tripStatus", JSON.stringify(data));
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const getTrip = async (driver) => {
    console.log("Driver ID:", driver);
    try {
      const response = await fetch(
        `${APILINK}/trip/byStatus/driver_id/status?driver_id=${driver}&status=InTransit`
      );

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      console.log("API Response Data:", data); // Log the raw response data

      // Extract relevant trip details and store them in state
      // Assuming 'data' is the response from your fetch call
      const details = data.map((trip) => ({
        trip_id: trip.trip_id, // Include trip_id
        order: trip.deliveray_details, // Replace with actual field name
        from: trip.origin_location, // Replace with actual field name
        to: trip.dest_location, // Replace with actual field name
        status: trip.status, // Replace with actual field name
      }));

      console.log("Extracted Trip Details:", details); // Log the extracted trip details
      setTripDetails(details); // Store trip details in state

      // Store the trip details in AsyncStorage
      await AsyncStorage.setItem("tripDetail", JSON.stringify(details));

      // Retrieving trip details from AsyncStorage
      const tripData = await AsyncStorage.getItem("tripDetail");
      const parsedTripData = JSON.parse(tripData);

      // Check if the parsed data is null or an empty array
      if (parsedTripData === null || parsedTripData.length === 0) {
        console.log("No trip details found.");
        setTripDetails([]); // Set to an empty array if no data exists
      } else {
        console.log("Retrieved Trip Details:", parsedTripData);
        setTripDetails(parsedTripData); // Update state with retrieved data
      }
    } catch (error) {
      console.error("Error fetching trip data:", error);
    }
  };

  const toggleMenuModal = () => {
    setMenuModalVisible(!menuModalVisible);
  };

  const toggleNotificationModal = () => {
    setNotificationModalVisible(!notificationModalVisible);
    if (!notificationModalVisible) {
      setNotificationCount(0); // Reset count when modal is opened
    }
  };

  const redirectToNotice = async (tripId) => {
    setNotificationModalVisible(false);

    try {
      const tripData = await AsyncStorage.getItem("tripStatus");
      const parsedTripData = JSON.parse(tripData);
      const tripDetails = parsedTripData.find(
        (item) => item.trip_id === tripId
      );
      console.log(parsedTripData, "musatye")
      console.log(tripDetails);

      await AsyncStorage.setItem("tripDetails", JSON.stringify(tripDetails));
      navigation.navigate("DeliveryNotice", { tripDetails });
    } catch (error) {
      console.error("Error fetching trip data:", error);
    }
  };

  const menuOptions = [
    {
      id: "1",
      title: "Profile Info",
      onPress: () => {navigation.navigate("ProfileInformation"); setMenuModalVisible(false)},
    },
    { id: "2", title: "FAQ", onPress: () => {navigation.navigate("FAQ"); setMenuModalVisible(false)} },
    { id: "3", title: "Safety", onPress: () => {navigation.navigate("Safety"); setMenuModalVisible(false)} },
    {
      id: "4",
      title: "Feedback",
      onPress: () => {navigation.navigate("Feedback"); setMenuModalVisible(false)},
    },
    {
      id: "5",
      title: "About Us",
      onPress: () => {navigation.navigate("AboutUs"); setMenuModalVisible(false)},
    },
    {
      id: "6",
      title: "Complaint",
      onPress: () => {navigation.navigate("Complaint"); setMenuModalVisible(false)},
    },
    {
      id: "7",
      title: "History",
      onPress: () => {navigation.navigate("History"); setMenuModalVisible(false)},
    },
    {
      id: "8",
      title: "Settings",
      onPress: () => {navigation.navigate("settings"); setMenuModalVisible(false)},
    },
  ];
  const redirectdeliveryaccepted = (trip_id, name) => {
    // Log the IDs to ensure they're being passed correctly
    console.log(
      "Navigating to Delivery Accepted with trip_id:",
      trip_id,
      "and name:",
      name
    );
    navigation.navigate("DriverDeliveryAccepted", { trip_id, name }); // Pass both IDs
  };
  return (
    <ImageBackground
      source={require("../../assets/map.png")}
      style={styles.backgroundImage}
      resizeMode="cover"
    >
      <SafeAreaView style={styles.container}>
        <View style={styles.viewTop}>
          <Image style={styles.profileImage} source={{ uri: pic }} />
          <View style={styles.nameContainer}>
            <Text style={styles.firstName}>{name}</Text>
            <Text style={styles.surname}>{type}</Text>
          </View>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              position: "relative",
            }}
          >
            <TouchableOpacity
              style={[
                styles.menuIcon,
                { flexDirection: "row", marginRight: 10 },
              ]}
              onPress={toggleNotificationModal}
            >
              <FontAwesome5 name="bell" size={20} color="#595959" />
              {notificationCount > 0 && (
                <View
                  style={[
                    styles.notificationView,
                    {
                      backgroundColor: "red",
                      position: "absolute",
                      top: -4,
                      right: -6,
                    },
                  ]}
                >
                  <Text
                    style={{ color: "white", fontSize: 12, fontWeight: "bold" }}
                  >
                    {notificationCount}
                  </Text>
                </View>
              )}
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.menuIcon, { flexDirection: "row" }]}
              onPress={toggleMenuModal}
            >
              <FontAwesome5 name="bars" size={20} color="#595959" />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.wrappercard}>
          <ScrollView>
            <View style={{ flex: 1, padding: 16 }}>
              {tripDetails.length > 0 ? (
                tripDetails.map((trip, index) => (
                  <TouchableOpacity
                    key={index}
                    onPress={() => {
                      redirectdeliveryaccepted(trip.trip_id, name); // Pass trip_id and driver_id
                    }}
                  >
                    <View style={styles.deliveryItem}>
                      <View style={styles.cardHeader}>
                        <FontAwesome5
                          name="shopping-bag"
                          size={20}
                          color="#595959"
                        />
                        <Text style={styles.cardTitle}>Current Order</Text>
                      </View>
                      <View style={styles.cardContent}>
                        <Text style={styles.cardText}>Order: {trip.order}</Text>
                        <Text style={styles.cardText}>From: {trip.from}</Text>
                        <Text style={styles.cardText}>To: {trip.to}</Text>
                        <Text style={styles.cardText}>
                          Status: {trip.status}
                        </Text>
                      </View>
                    </View>
                  </TouchableOpacity>
                ))
              ) : (
                <Text style={styles.cardText}>No current trips available.</Text>
              )}

              {/* Total Daily Deliveries Card */}
              <View style={styles.card}>
                <View style={styles.cardHeader}>
                  <FontAwesome5 name="car" size={20} color="#595959" />
                  <Text style={styles.cardTitle}>Total Daily Deliveries</Text>
                </View>
                <View style={styles.cardContent}>
                  <Text style={styles.cardCount}>{deliveryCount}</Text>
                  <Text style={styles.cardText}>Deliveries today</Text>
                </View>
              </View>
            </View>
          </ScrollView>
        </View>

        {/* Menu Modal */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={menuModalVisible}
          onRequestClose={toggleMenuModal}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContainer}>
              <FlatList
                data={menuOptions}
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
                onPress={toggleMenuModal}
              >
                <Text style={styles.closeButtonText}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        {/* Notifications Modal */}
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
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    width: "100%",
    justifyContent: "center",
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
    backgroundColor: "rgba(255, 255, 255, 0.8)",
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
  notificationView: {
    borderRadius: 10,
    paddingHorizontal: 6,
    paddingVertical: 2,
    marginLeft: 4,
    alignItems: "center",
    justifyContent: "center",
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
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    width: "90%",
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

  deliveryItem: {
    backgroundColor: "#f5f5f5",
    padding: 15,
    borderRadius: 8,
    marginBottom: 15,
  },
  wrappercard: {
    position: "absolute",
    bottom: 0,
    height: "70%",
    width: "100%",
    backgroundColor: "#FFC000",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  card: {
    backgroundColor: "rgba(255, 255, 255, 0.5)",
    borderRadius: 8,
    marginVertical: 8,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 8,
  },
  cardContent: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  cardText: {
    fontSize: 16,
    marginBottom: 8,
  },
  cardCount: {
    fontSize: 24,
    fontWeight: "bold",
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

export default HomeDriver;

import React, { useEffect, useState, useRef } from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Image,
  Modal,
  FlatList,
  Alert,
  Animated,
  Dimensions,
  ScrollView,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { FontAwesome } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_URL } from "../screens/config";
import Icon from "react-native-vector-icons/FontAwesome";
import "font-awesome/css/font-awesome.min.css";

const { height } = Dimensions.get("window");

const TopView = () => {
  const navigation = useNavigation();
  const [isCounterOfferModalVisible, setCounterOfferModalVisible] =
    useState(false);
  const [isMenuModalVisible, setMenuModalVisible] = useState(false);
  const [counterOffers, setCounterOffers] = useState([]);
  const [profileImage, setPic] = useState();
  const [customerType, setType] = useState("");
  const [name, setName] = useState("");
  const [id, setid] = useState("");
  const [notificationCount, setNotificationCount] = useState(0);
  const APILINK = API_URL;
  const progressAnimations = useRef({});
  const [refreshing, setRefreshing] = useState(false);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const storedIds = await AsyncStorage.getItem("theIds");
        if (storedIds) {
          const parsedIds = JSON.parse(storedIds);
          let acc =
            parsedIds.last_logged_account === "driver"
              ? parsedIds.driver_id
              : parsedIds.customerId;
          setid(acc);
          await fetchUserDetails(acc, parsedIds.last_logged_account);
        } else {
          Alert.alert("Driver ID not found", "Please log in again.");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        Alert.alert("Error", "An error occurred while fetching data.");
      }
    };

    const fetchUserDetails = async (id, type) => {
      try {
        const endpoint =
          type === "driver" ? `driver/${id}` : `customerdetails/${id}`;
        const response = await fetch(`${APILINK}/${endpoint}`);
        const result = await response.json();

        if (result && result.length > 0) {
          await AsyncStorage.setItem("userDetails", JSON.stringify(result[0]));
          setPic(`${APILINK}${result[0].profilePic}`);
          setType(result[0].account_type);
          setName(result[0].username);
        } else {
          Alert.alert(
            `${type === "driver" ? "Driver" : "Customer"} details not found.`
          );
        }
      } catch (error) {
        Alert.alert("Error", "Failed to fetch details. Please try again.");
      }
    };

    const fetchCounterOffers = async (userId) => {
      // console.log(userId);
      try {
        const response = await fetch(
          `${API_URL}/counter_offer/customerid/status/${userId}/seen`
        );
        const offers = await response.json();

        if (offers.length > 0) {
          const updatedOffers = await Promise.all(
            offers.map(async (offer) => {
              // Fetch driver details using driver_id from the offer
              const driverResponse = await fetch(
                `${API_URL}/driver/${offer.driver_id}`
              );
              const driverResult = await driverResponse.json();

              // Ensure that driverResult is valid and structured correctly
              const driverData = Array.isArray(driverResult)
                ? driverResult[0]
                : driverResult;

              // Return the offer with driver info included
              return {
                ...offer,
                profileImage: `${API_URL}${driverData.profilePic}`, // Construct the full image URL
                name: driverData.username,
                stars: driverData.rating,
              };
            })
          );

          // Update the state with the newly enriched offers
          setCounterOffers((prevOffers) => [
            ...prevOffers,
            ...updatedOffers.filter(
              (offer) =>
                !prevOffers.some(
                  (o) => o.counter_offer_id === offer.counter_offer_id
                )
            ),
          ]);

          // Start timers for each new offer
          // updatedOffers.forEach((offer) =>
          //   startOfferTimer(offer.counter_offer_id)
          // );
        }
      } catch (error) {
        // console.error("Error fetching counter offers:", error);
      }
    };

    fetchData();
    fetchCounterOffers(id);
    const intervalId = setInterval(() => fetchCounterOffers(id), 30000);
    return () => clearInterval(intervalId);
  }, [id]);

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
    { id: "8", title: "Settings", onPress: () => handleMenuPress("settings") },
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
    { id: "12", title: "Log Out", onPress: () => handleLogout() },
  ];

  const handleMenuPress = (screen) => {
    setMenuModalVisible(false);
    navigation.navigate(screen, { userId: id });
  };

  const handleLogout = async () => {
    try {
      await AsyncStorage.clear();
      navigation.navigate("CustomerLogin");
    } catch (error) {
      Alert.alert("Error", "Failed to log out. Please try again.");
    }
  };
  const markOfferAsSeen = async (offerId) => {
    try {
      const response = await fetch(
        `${API_URL}/counter_offer/${offerId}/status`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json", // Specify content type
          },
          body: JSON.stringify({ status: "seen" }), // Convert to JSON string
        }
      );

      // Optionally handle the response
      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }

      const data = await response.json();
      // console.log("Offer marked as seen:", data); // Log success message or response data
    } catch (error) {
      console.error("Error marking offer as seen:", error);
    }
  };
  const renderCounterOffer = () => {
    return counterOffers.map((offer) => {
      // Start the timer for this offer as it is being rendered
      startOfferTimer(offer.counter_offer_id);

      return (
        <View key={offer.counter_offer_id} style={styles.offerCard}>
          <View style={styles.profileContainer}>
            <Image
              source={{ uri: offer.profileImage }}
              style={[styles.profileImage, { marginTop: 10 }]}
            />
          </View>
          <Text style={styles.offerText}>
            {offer.name} {renderStars(offer.stars)}
          </Text>
          <Text style={styles.offerText}>
            Counter Offer: {offer.counter_offer_value} {offer.currency}
          </Text>
          <Text style={styles.offerText}>For Trip: {offer.trip_id}</Text>
          <Animated.View
            style={[
              styles.progressBarContainer,
              {
                width: progressAnimations.current[
                  offer.counter_offer_id
                ]?.interpolate({
                  inputRange: [0, 100],
                  outputRange: ["100%", "0%"],
                }),
              },
            ]}
          />
          <View style={styles.offerButtonContainer}>
            <TouchableOpacity
              style={styles.rejectButton}
              onPress={() => rejectCounterOffer(offer.counter_offer_id)}
            >
              <Text style={styles.buttonText}>Reject</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.acceptButton}
              onPress={() => acceptCounterOffer(offer.counter_offer_id, offer)}
            >
              <Text style={styles.acceptButtonText}>Accept</Text>
            </TouchableOpacity>
          </View>
        </View>
      );
    });
  };
  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <Icon
          key={i}
          name={i <= rating ? "star" : "star-o"} // Filled star or empty star
          size={20}
          color="#FFD700" // Gold color for stars
        />
      );
    }
    return stars;
  };

  const startOfferTimer = (offerId) => {
    const animation = new Animated.Value(0);
    progressAnimations.current[offerId] = animation;

    Animated.timing(animation, {
      toValue: 100,
      duration: 30000, // Adjust to 30 seconds for your timer
      useNativeDriver: false,
    }).start(() => {
      // Remove the offer when the animation completes
      markOfferAsSeen(offerId); // Mark the offer as seen, if necessary
      setCounterOffers((prevOffers) =>
        prevOffers.filter((offer) => offer.counter_offer_id !== offerId)
      );
      delete progressAnimations.current[offerId];
    });

    // You can also show the progress in the progress bar
    setTimeout(async () => {
      await markOfferAsSeen(offerId);
      setCounterOffers((prevOffers) =>
        prevOffers.filter((offer) => offer.counter_offer_id !== offerId)
      );
      delete progressAnimations.current[offerId];
    }, 30000);
  };

  const acceptCounterOffer = async (offerId, offer) => {
    try {
      // First, mark the counter offer as accepted
      const acceptResponse = await fetch(
        `${API_URL}/counter_offer/${offerId}/status`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json", // Specify content type
          },
          body: JSON.stringify({ status: "accepted" }), // Convert to JSON string
        }
      );
      // Check if the response was successful
      if (!acceptResponse.ok) {
        throw new Error(
          `Error accepting counter offer: ${acceptResponse.statusText}`
        );
      }
      // Then, update the trip status and driver details
      const statusResponse = await fetch(
        `${APILINK}/trip/updateStatusAndDriver/${offer.trip_id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            driver_id: offer.driver_id,
            status: "InTransit",
          }),
        }
      );

      // Check if the status update was successful
      if (!statusResponse.ok) {
        throw new Error(
          `Error updating trip status: ${statusResponse.statusText}`
        );
      }
      // Remove the accepted offer from the local state
      setCounterOffers((prevOffers) =>
        prevOffers.filter(
          (existingOffer) => existingOffer.counter_offer_id !== offerId
        )
      );

      // Optional: You might want to handle the response from the status update if needed
      const updatedData = await statusResponse.json();
      // console.log("Trip status updated:", updatedData);
    } catch (error) {
      console.error("Error accepting counter offer:", error);
    }
  };

  const rejectCounterOffer = async (offerId) => {
    setCounterOffers((prevOffers) =>
      prevOffers.filter((offer) => offer.id !== offerId)
    );
    await markOfferAsSeen(offerId);
    delete progressAnimations.current[offerId];
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
        <TouchableOpacity onPress={() => setCounterOfferModalVisible(true)}>
          <FontAwesome name="bell" size={24} color="black" />
          {notificationCount > 0 && (
            <View style={styles.notificationCount}>
              <Text style={styles.countText}>x{notificationCount}</Text>
            </View>
          )}
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => navigation.navigate("ChatScreen")} // Replace with your chat screen name
          style={styles.menuButton}
        >
          <FontAwesome name="comments" size={24} color="black" />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => navigation.navigate("OnlineStore")} // Replace with your store screen name
          style={styles.menuButton}
        >
          <FontAwesome name="shopping-cart" size={24} color="black" />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setMenuModalVisible(true)}
          style={styles.menuButton}
        >
          <FontAwesome name="bars" size={24} color="black" />
        </TouchableOpacity>
      </View>

      {/* Counter Offer Modal */}
      <Modal
        transparent={true}
        animationType="slide"
        visible={isCounterOfferModalVisible}
        onRequestClose={() => setCounterOfferModalVisible(false)}
      >
        <View style={styles.modalBackground}>
          <View style={[styles.modalContainer, { height: height * 0.9 }]}>
            <FlatList
              data={counterOffers}
              keyExtractor={(item) => item.counter_offer_id.toString()}
              renderItem={renderCounterOffer}
              ListEmptyComponent={
                <Text style={styles.emptyText}>
                  No counter offers available.
                </Text>
              }
            />
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setCounterOfferModalVisible(false)}
            >
              <Text style={styles.closeText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Menu Options Modal */}
      <Modal
        transparent={true}
        animationType="slide"
        visible={isMenuModalVisible}
        onRequestClose={() => setMenuModalVisible(false)}
      >
        <View style={styles.modalBackground}>
          <View style={[styles.modalContainer, { height: height * 0.9 }]}>
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
              ListEmptyComponent={
                <Text style={styles.emptyText}>No menu options available.</Text>
              }
            />
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setMenuModalVisible(false)}
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
    backgroundColor: "#FFC000",
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
    justifyContent: "flex-end",
    marginRight: 10,
  },
  menuButton: {
    marginHorizontal: 10,
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
  counterOffersContainer: {
    paddingVertical: 10,
    paddingHorizontal: 0,
    backgroundColor: "rgba(255, 255, 255, 0.5)",
    borderRadius: 10,
    marginTop: 10,
    maxHeight: 260,
    width: "90%",
  },
  offersHeaderText: {
    fontWeight: "bold",
    fontSize: 18,
    marginBottom: 10,
  },
  offersScrollContainer: {
    paddingBottom: 10,
  },
  offerCard: {
    padding: 10,
    backgroundColor: "#FFC000",
    borderRadius: 8,
    marginBottom: 10,
    position: "relative",
    overflow: "hidden",
  },
  offerText: {
    fontSize: 16,
    color: "white",
  },
  offerButtonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  acceptButton: {
    backgroundColor: "#4CAF50",
    padding: 8,
    borderRadius: 5,
    flex: 1,
    marginLeft: 5,
  },
  rejectButton: {
    backgroundColor: "#FF5733",
    padding: 8,
    borderRadius: 5,
    flex: 1,
    marginRight: 5,
  },
  buttonText: {
    color: "#FFFFFF",
    fontWeight: "bold",
    textAlign: "center",
  },
  noOffersText: {
    textAlign: "center",
    color: "#333",
  },
  closeButton: {
    alignItems: "center",
    padding: 10,
    backgroundColor: "#FFC000",
    borderRadius: 5,
    marginTop: 10,
  },
  closeText: {
    fontSize: 16,
    fontWeight: "bold",
  },
  emptyText: {
    textAlign: "center",
    marginTop: 20,
    fontSize: 16,
    color: "#777",
  },
  menuItem: {
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  menuText: {
    fontSize: 16,
  },

  counterOffersContainer: {
    paddingVertical: 10,
    paddingHorizontal: 0,
    backgroundColor: "rgba(255, 255, 255, 0.5)",
    borderRadius: 10,
    marginTop: 10,
    maxHeight: 260,
    width: "90%",
  },
  offersHeaderText: {
    fontWeight: "bold",
    fontSize: 18,
    marginBottom: 10,
  },
  offersScrollContainer: {
    paddingBottom: 10,
  },
  offerCard: {
    padding: 10,
    backgroundColor: "#FFC000",
    borderRadius: 8,
    marginBottom: 10,
    position: "relative",
    overflow: "hidden",
  },
  progressBarContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    height: 3,
    backgroundColor: "#FFA500",
    zIndex: 1,
  },
  offerText: {
    fontSize: 16,
    color: "white",
  },
  offerButtonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  acceptButton: {
    backgroundColor: "#4CAF50",
    padding: 8,
    borderRadius: 5,
    flex: 1,
    marginLeft: 5,
  },
  rejectButton: {
    backgroundColor: "#FF5733",
    padding: 8,
    borderRadius: 5,
    flex: 1,
    marginRight: 5,
  },
  buttonText: {
    color: "#FFFFFF",
    fontWeight: "bold",
    textAlign: "center",
  },
  acceptButtonText: {
    color: "#FFFFFF",
    fontWeight: "bold",
    textAlign: "center",
  },
  noOffersText: {
    textAlign: "center",
    color: "#333",
  },
});

export default TopView;

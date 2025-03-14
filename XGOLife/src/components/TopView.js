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
import { API_URL, API_URL_UPLOADS } from "../screens/config";
import Icon from "react-native-vector-icons/FontAwesome";
import "font-awesome/css/font-awesome.min.css";
import LocationTracker from "../screens/LocationTracker";

const { height } = Dimensions.get("window");

const TopView = () => {
  const navigation = useNavigation();
  const [isCounterOfferModalVisible, setCounterOfferModalVisible] = useState(false);
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
  const [data, setData] = useState();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const storedIds = await AsyncStorage.getItem("theIds");
        if (storedIds) {
          const parsedIds = JSON.parse(storedIds);
          let acc = parsedIds.last_logged_account === "driver" ? parsedIds.driver_id : parsedIds.customerId;
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
        const endpoint = type === "driver" ? `driver/${id}` : `customerdetails/${id}`;
        const response = await fetch(`${APILINK}/${endpoint}`);
        const result = await response.json();

        if (result && result.length > 0) {
          await AsyncStorage.setItem("userDetails", JSON.stringify(result[0]));

          if (result[0].profilePic === null || result[0].profilePic === "") {
            setPic(null);
            setType(result[0].account_type);
            setName(result[0].username);
            setData(result[0]);
          } else {
            setPic(`${API_URL_UPLOADS}/${result[0].profilePic.replace(/\\/g, "/")}`);
            setType(result[0].account_type);
            setName(result[0].username);
            setData(result[0]);
          }
        } else {
          Alert.alert(`${type === "driver" ? "Driver" : "Customer"} details not found.`);
        }
      } catch (error) {
        Alert.alert("Error", "Failed to fetch details. Please try again.");
      }
    };

    const fetchCounterOffers = async (userId) => {
      try {
        const response = await fetch(`${API_URL}/counter_offer/customerid/status/${userId}/Unseen`);
        const offers = await response.json();

        if (offers.length > 0) {
          const updatedOffers = await Promise.all(
            offers.map(async (offer) => {
              const driverResponse = await fetch(`${API_URL}/driver/${offer.driver_id}`);
              const driverResult = await driverResponse.json();
              const driverData = Array.isArray(driverResult) ? driverResult[0] : driverResult;

              return {
                ...offer,
                profileImage: `${API_URL}${driverData.profilePic}`,
                name: driverData.username,
                stars: driverData.rating,
              };
            })
          );

          setCounterOffers((prevOffers) => [
            ...prevOffers,
            ...updatedOffers.filter((offer) => !prevOffers.some((o) => o.counter_offer_id === offer.counter_offer_id)),
          ]);
        }
      } catch (error) {
        console.error("Error fetching counter offers:", error);
      }
    };

    fetchData();
    fetchCounterOffers(id);
    const intervalId = setInterval(() => fetchCounterOffers(id), 30000);
    return () => clearInterval(intervalId);
  }, [id]);

  const iconMap = {
    "Profile Info": "user",
    Wallet: "money",
    History: "history",
    Settings: "cog",
    FAQ: "question-circle",
    Safety: "shield",
    Chat: "comments",
    Feedback: "comment",
    "About Us": "info-circle",
    Complaint: "exclamation-triangle",
    "Tell A Friend": "share-alt",
    "Log Out": "sign-out",
  };

  const menuOptions = [
    {
      id: "1",
      title: "Profile Info",
      onPress: () => handleMenuPress("ProfileInfo"),
    },
    { id: "9", title: "Wallet", onPress: () => handleMenuPress("Wallet") },
    { id: "7", title: "History", onPress: () => handleMenuPress("History") },
    { id: "8", title: "Settings", onPress: () => handleMenuPress("settings") },
    { id: "2", title: "FAQ", onPress: () => handleMenuPress("FAQ") },
    { id: "3", title: "Safety", onPress: () => handleMenuPress("Safety") },
    { id: "10", title: "Chat", onPress: () => handleMenuPress("ChatMenu") },
    { id: "5", title: "About Us", onPress: () => handleMenuPress("AboutUs") },
    { id: "11", title: "Tell A Friend", onPress: () => handleMenuPress("Invite") },
    { id: "12", title: "Log Out", onPress: () => handleLogout() },
  ];

  const handleMenuPress = (screen) => {
    setMenuModalVisible(false);
    if (screen === "ProfileInfo") {
      navigation.navigate(customerType === "customer" ? "ProfileInformation" : "DriverProfile", { userId: id, Data: data });
    } else {
      navigation.navigate(screen, { userId: id, Data: data });
    }
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
      const response = await fetch(`${API_URL}/counter_offer/${offerId}/status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: "seen" }),
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }

      const data = await response.json();
    } catch (error) {
      console.error("Error marking offer as seen:", error);
    }
  };

  const renderCounterOffer = () => {
    return counterOffers.map((offer) => {
      return (
        <View key={offer.counter_offer_id} style={styles.offerCard}>
          <View style={styles.profileContainer}>
            {offer.profileImage && offer.profileImage.trim() ? (
              <Image source={{ uri: offer.profileImage }} style={[styles.profileImage, { marginTop: 5 }]} />
            ) : (
              <View
                style={[
                  styles.profileImage,
                  {
                    marginTop: 5,
                    justifyContent: "center",
                    alignItems: "center",
                    backgroundColor: "#f0f0f0",
                  },
                ]}
              >
                <FontAwesome name="user" size={50} color="gray" />
              </View>
            )}
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
                width: progressAnimations.current[offer.counter_offer_id]?.interpolate({
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
    for (let i = 0; i < 5; i++) {
      stars.push(
        <Text key={i} style={styles.star}>
          {i < rating ? "★" : "☆"}
        </Text>
      );
    }
    return <View style={styles.starContainer}>{stars}</View>;
  };

  const startOfferTimer = (offerId) => {
    const animation = new Animated.Value(0);
    progressAnimations.current[offerId] = animation;

    Animated.timing(animation, {
      toValue: 100,
      duration: 30000,
      useNativeDriver: false,
    }).start(() => {
      setCounterOffers((prevOffers) =>
        prevOffers.filter((offer) => offer.counter_offer_id !== offerId)
      );
    });

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
      const acceptResponse = await fetch(
        `${API_URL}/counter_offer/${offerId}/status`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ status: "accepted" }),
        }
      );

      if (!acceptResponse.ok) {
        throw new Error(`Error accepting counter offer: ${acceptResponse.statusText}`);
      }

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

      if (!statusResponse.ok) {
        throw new Error(`Error updating trip status: ${statusResponse.statusText}`);
      }

      setCounterOffers((prevOffers) =>
        prevOffers.filter((existingOffer) => existingOffer.counter_offer_id !== offerId)
      );

      const updatedData = await statusResponse.json();
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
      <LocationTracker userId={id} userType={customerType} />
      <View style={styles.notificationContainer}>
        <TouchableOpacity
          onPress={() => setMenuModalVisible(true)}
          style={styles.menuButton}
        >
          <FontAwesome name="bars" size={24} color="black" />
        </TouchableOpacity>

        <TouchableOpacity onPress={() => setCounterOfferModalVisible(true)}>
          <FontAwesome
            name="bell"
            size={24}
            color="black"
            style={styles.menuButton}
          />
          {notificationCount > 0 && (
            <View style={styles.notificationCount}>
              <Text style={styles.countText}>x{notificationCount}</Text>
            </View>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => navigation.navigate("CustomerAdminChat")}
          style={styles.menuButton}
        >
          <FontAwesome name="comments" size={24} color="black" />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => navigation.navigate("OnlineStore")}
          style={styles.menuButton}
        >
          <FontAwesome name="shopping-cart" size={24} color="black" />
        </TouchableOpacity>
      </View>

      <View style={styles.profileContainer}>
        <View>
          <Text style={styles.profileName}>{name || "No Name"}</Text>
          <Text style={{ marginBottom: 3, fontSize: 11 }}>
            {customerType === "customer" ? "Customer" : "Driver"}
          </Text>
        </View>
        {profileImage && profileImage.trim() ? (
          <Image source={{ uri: profileImage }} style={[styles.profileImage]} />
        ) : (
          <View
            style={[
              styles.profileImage,
              {
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: "#f0f0f0",
              },
            ]}
          >
            <FontAwesome name="user" size={40} color="gray" />
          </View>
        )}
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
            <View style={styles.profileContainerModal}>
              {profileImage && profileImage.trim() ? (
                <Image
                  source={{ uri: profileImage }}
                  style={[styles.profileImage]}
                />
              ) : (
                <View
                  style={[
                    styles.profileImage,
                    {
                      marginTop: 5,
                      justifyContent: "center",
                      alignItems: "center",
                      backgroundColor: "#f0f0f0",
                    },
                  ]}
                >
                  <FontAwesome name="user" size={50} color="gray" />
                </View>
              )}

              <View style={styles.nameContainer}>
                <Text style={styles.profileName}>{name || "No Name"}</Text>
                <Text style={{ marginBottom: 3, fontSize: 11 }}>
                  {data && renderStars(data.rating)}
                </Text>
              </View>
            </View>

            <FlatList
              data={menuOptions}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.menuItem}
                  onPress={item.onPress}
                >
                  <FontAwesome
                    name={iconMap[item.title] || "question"}
                    size={35}
                    style={styles.icon}
                  />
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
    padding: 3,
    backgroundColor: "#FFC000",
    paddingRight: 9,
    width: "100%",
    paddingVertical: 15,
  },
  profileContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  profileImage: {
    width: 35,
    height: 35,
    borderRadius: 30,
    marginLeft: 10,
    marginBottom: 8,
  },
  profileName: {
    fontSize: 12,
    fontWeight: "bold",
  },

  profileContainerModal: {
    flexDirection: "row",
    alignItems: "center",
  },
  profileImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginLeft: 5,
    marginright: 10,
  },
  profileNameModal: {
    fontSize: 12,
    fontWeight: "bold",
  },

  nameContainer: {
    flexDirection: "column", // Stack stars and name vertically
    justifyContent: "center", // Center items vertically
    marginLeft: 10,
    // Space between image and text
  },

  starContainer: {
    flexDirection: "row",
    marginTop: 5,
  },
  star: {
    fontSize: 18, // Adjust size as needed
    color: "gold", // Star color
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
  closeButton: {
    alignItems: "center",
    padding: 10,
    backgroundColor: "#FFC000",
    borderRadius: 25,
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
    flexDirection: "row", // Align items in a row
    alignItems: "center", // Center vertically
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  icon: {
    marginRight: 10, // Space between icon and text
  },
  menuText: {
    fontSize: 11, // Adjust font size as needed
    flex: 1, // Allows text to take available space
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
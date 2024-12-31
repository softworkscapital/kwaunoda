import React, { useEffect, useState, useRef } from "react";
import {
  StyleSheet,
  View,
  SafeAreaView,
  ImageBackground,
  Text,
  TouchableOpacity,
  Animated,
  Dimensions,
  Image,
  ScrollView,
} from "react-native";
import FontAwesome from "react-native-vector-icons/FontAwesome5";
import { API_URL, API_URL_UPLOADS } from "./config";
import TopView from "../components/TopView";
import AsyncStorage from "@react-native-async-storage/async-storage";
import LocationSender from "./LocationTracker";

const { height } = Dimensions.get("window");

const Home = ({ navigation }) => {
  const [trips, setTrips] = useState([]);
  const [userId, setUserId] = useState(null);
  const [carAnimation] = useState(new Animated.Value(0));
  const [counterOffers, setCounterOffers] = useState([]);
  const [driver, setDriver] = useState();
  const [showCounterOffers, setShowCounterOffers] = useState(false);
  const [shownOfferIds, setShownOfferIds] = useState(new Set());
  const progressAnimations = useRef({});

  useEffect(() => {
    const fetchUserData = async () => {
      const storedIds = await AsyncStorage.getItem("theIds");
      const parsedIds = JSON.parse(storedIds);
      setUserId(parsedIds.customerId);
      fetchUserTrips(parsedIds.customerId);

      const intervalId = setInterval(() => {
        fetchUserTrips(parsedIds.customerId);
        fetchCounterOffers(parsedIds.customerId);
      }, 500);

      return () => clearInterval(intervalId);
    };

    fetchUserData();
    Animated.loop(
      Animated.sequence([
        Animated.timing(carAnimation, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: false,
        }),
        Animated.timing(carAnimation, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: false,
        }),
      ])
    ).start();
  }, []);

  const fetchUserTrips = async (userId) => {
    try {
      const response = await fetch(`${API_URL}/trip/customer/notify/${userId}`);
      const userTrips = await response.json();

      if (userTrips.length > 0) {
        // Fetch driver details for all unique driver IDs
        const driverIds = userTrips.map((trip) => trip.driver_id);
        const uniqueDriverIds = [...new Set(driverIds)];
        const drivers = await fetchDrivers(uniqueDriverIds);

        // Create a map of driver details
        const driverMap = new Map(
          drivers.map((driver) => [driver.driver_id, driver])
        );

        // Add driver details to each trip
        const tripsWithDrivers = userTrips.map((trip) => ({
          ...trip,
          driver: driverMap.get(trip.driver_id) || null, // Get driver details or null if not found
        }));

        setTrips(tripsWithDrivers);
      } else {
        console.log("No trips found for user ID");
      }
    } catch (error) {
      console.error("Error fetching trips:", error);
    }
  };

  const fetchDrivers = async (driverIds) => {
    try {
      const driverPromises = driverIds.map((driverId) =>
        fetch(`${API_URL}/driver/${driverId}`).then((res) => res.json())
      );
      const drivers = await Promise.all(driverPromises);
      return drivers.flat(); // Flatten in case of multiple results
    } catch (error) {
      console.error("Error fetching drivers:", error);
      return [];
    }
  };

  const fetchCounterOffers = async (userId) => {
    try {
      const response = await fetch(
        `${API_URL}/counter_offer/customerid/status/${userId}/Unseen`
      );

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const responseText = await response.text();
      console.log("Counter Offers Response:", responseText);

      try {
        const offers = JSON.parse(responseText);
        if (offers.length > 0) {
          const updatedOffers = await Promise.all(
            offers.map(async (offer) => {
              const driverResponse = await fetch(
                `${API_URL}/driver/${offer.driver_id}`
              );
              const driverResult = await driverResponse.json();
              const driverData = Array.isArray(driverResult)
                ? driverResult[0]
                : driverResult;

              return {
                ...offer,
                profileImage: `${API_URL}${driverData.profilePic}`,
                name: driverData.username,
                stars: driverData.rating,
                duration: getRandomDuration(),
              };
            })
          );

          // Filter out already shown offers before setting state
          const newOffers = updatedOffers.filter(
            (offer) => !shownOfferIds.has(offer.counter_offer_id)
          );

          if (newOffers.length > 0) {
            setCounterOffers((prev) => [...prev, ...newOffers]);

            // Add new IDs to the set
            newOffers.forEach((offer) =>
              shownOfferIds.add(offer.counter_offer_id)
            );
            setShowCounterOffers(true);

            // Start the timer for each offer
            newOffers.forEach((offer) =>
              startOfferTimer(offer.counter_offer_id)
            );
          }
        }
      } catch (parseError) {
        console.error("Error parsing JSON:", parseError);
      }
    } catch (error) {
      console.error("Error fetching counter offers:", error);
    }
  };

  const getRandomDuration = () => {
    return Math.floor(Math.random() * 5000) + 3000; // Random duration between 3000ms and 8000ms
  };

  const startOfferTimer = (offerId) => {
    const animation = new Animated.Value(0);
    progressAnimations.current[offerId] = animation;

    Animated.timing(animation, {
      toValue: 100,
      duration: 30000, // Adjust to 30 seconds for your timer
      useNativeDriver: false,
    }).start(() => {
      markOfferAsSeen(offerId); // Mark the offer as seen, if necessary
      setCounterOffers((prevOffers) =>
        prevOffers.filter((offer) => offer.counter_offer_id !== offerId)
      );
      delete progressAnimations.current[offerId];
    });
  };

  const acceptCounterOffer = async (offerId, offer) => {
    try {
      // Mark the counter offer as accepted
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
        throw new Error(
          `Error accepting counter offer: ${acceptResponse.statusText}`
        );
      }

      // Update the trip status and driver details
      const statusResponse = await fetch(
        `${API_URL}/trip/updateStatusAndDriver/${offer.trip_id}`,
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
        throw new Error(
          `Error updating trip status: ${statusResponse.statusText}`
        );
      }

      setCounterOffers((prevOffers) =>
        prevOffers.filter(
          (existingOffer) => existingOffer.counter_offer_id !== offerId
        )
      );

      // Optional: Handle the response from the status update if needed
      const updatedData = await statusResponse.json();
      // console.log("Trip status updated:", updatedData);
    } catch (error) {
      console.error("Error accepting counter offer:", error);
    }
  };

  const rejectCounterOffer = async (offerId) => {
    setCounterOffers((prevOffers) =>
      prevOffers.filter((offer) => offer.counter_offer_id !== offerId)
    );
    await markOfferAsSeen(offerId);
    delete progressAnimations.current[offerId];
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

      console.log("marked counter offer as seen id: ", offerId);

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

  return (
    <ImageBackground
      source={require("../../assets/map.png")}
      style={styles.backgroundImage}
      resizeMode="cover"
    >
      <View style={styles.overlay} />
      <SafeAreaView style={styles.container}>
        <TopView id={userId} />
        <ScrollView>
          {showCounterOffers &&
            counterOffers.map((offer) => {
              const slideAnimation = new Animated.Value(
                Dimensions.get("window").width
              ); // Start off-screen

              Animated.timing(slideAnimation, {
                toValue: 0, // Move to the starting position
                duration: 500, // Animation duration
                useNativeDriver: true,
              }).start();

              const offerProgress =
                progressAnimations.current[offer.counter_offer_id] ||
                new Animated.Value(1);

              return (
                <Animated.View
                  key={offer.counter_offer_id}
                  style={[
                    styles.offerCard,
                    {
                      transform: [{ translateX: slideAnimation }],
                      marginBottom: 10,
                    },
                  ]}
                >
                  <View style={styles.progressBarContainer}>
                    <Animated.View
                      style={{
                        ...styles.progressBar,
                        width: offerProgress.interpolate({
                          inputRange: [0, 100],
                          outputRange: ["100%", "0%"],
                        }),
                      }}
                    />
                  </View>
                  <Text style={styles.offerText}>
                    {offer.name} {renderStars(offer.stars)}
                  </Text>
                  <Text style={styles.offerText}>
                    Counter Offer: {offer.counter_offer_value} {offer.currency}
                  </Text>
                  <Text style={styles.offerText}>
                    For Trip: {offer.trip_id}
                  </Text>
                  <View style={styles.offerButtonContainer}>
                    <TouchableOpacity
                      style={styles.acceptButton}
                      onPress={() =>
                        acceptCounterOffer(offer.counter_offer_id, offer)
                      }
                    >
                      <Text style={styles.buttonText}>Accept</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.rejectButton}
                      onPress={() => rejectCounterOffer(offer.counter_offer_id)}
                    >
                      <Text style={styles.buttonText}>Decline</Text>
                    </TouchableOpacity>
                  </View>
                </Animated.View>
              );
            })}
        </ScrollView>
        <View style={styles.fixedCurrentTripContainer}>
          <ScrollView
            style={styles.tripCard}
            showsVerticalScrollIndicator={false}
          >
            <Text style={styles.tripHeaderText}>My Trips</Text>
            {trips.length > 0 ? (
              trips.map((trip) => (
                <TouchableOpacity
                  key={trip.trip_id}
                  style={[
                    styles.tripDetailsView,
                    { backgroundColor: "rgb(255, 255, 255)" },
                  ]}
                  onPress={() => navigation.navigate("TripTrack", { trip })}
                >
                  <View style={styles.driverInfoContainer}>
                    <View>{/* Other driver info details can go here */}</View>

                    <View style={styles.driverDetails}>
                      {trip.status !== "New Order" && trip.driver ? (
                        <>
                          <Text
                            style={[styles.tripDetailsText, styles.statusText]}
                          >
                            {trip.status}
                          </Text>

                          <View style={styles.profileContainer}>
                            <Image
                              source={{
                                uri: `${API_URL_UPLOADS}/${trip.driver.profilePic.replace(
                                  /\\/g,
                                  "/"
                                )}`,
                              }}
                              style={[styles.profileImage, { marginTop: 5 }]}
                            />

                            <View style={styles.nameContainer}>
                              
                              <Text style={styles.tripDetailsTextPro}>
                                Driver: {trip.driver.name} {trip.driver.surname}
                              </Text>
                              {renderStars(trip.driver.rating)}
                            </View>
                          </View>

                          <Text style={styles.tripDetailsText}>
                            License Plate: {trip.driver.license_plate || "N/A"}
                          </Text>
                        </>
                      ) : (
                        <Text
                          style={[styles.tripDetailsText, styles.statusText]}
                        >
                          {trip.status}
                        </Text>
                      )}
                    </View>
                  </View>
                  {trip.deliveray_details &&
                    trip.deliveray_details.length > 0 && (
                      <Text style={styles.tripDetailsText}>
                        {trip.deliveray_details}
                      </Text>
                    )}
                  <Text style={styles.tripDetailsText}>
                    Trip ID: {trip.trip_id}
                  </Text>
                  <Text style={styles.tripDetailsText}>
                    Start Time: {trip.request_start_datetime}
                  </Text>
                  <Text style={styles.tripDetailsText}>
                    To: {trip.dest_location}
                  </Text>
                  <Text style={styles.tripDetailsText}>
                    From: {trip.origin_location || "N/A"}
                  </Text>

                  <View style={styles.buttonContainer}>
                    {trip.status === "New Order" ? (
                      <TouchableOpacity
                        style={styles.cancelTripButton}
                        onPress={() =>
                          console.log(
                            `Cancelling trip with ID: ${trip.trip_id}`
                          )
                        }
                      >
                        <Text style={styles.cancelTripText}>Cancel</Text>
                      </TouchableOpacity>
                    ) : (
                      <TouchableOpacity
                        style={styles.endTripButton}
                        onPress={() =>
                          navigation.navigate("CustomerEndTrip", { trip })
                        }
                      >
                        <Text style={styles.endTripText}>End</Text>
                      </TouchableOpacity>
                    )}
                    <TouchableOpacity
                      style={styles.chatButton}
                      onPress={() =>
                        navigation.navigate("CustomerChat", {
                          tripId: trip.trip_id,
                        })
                      }
                    >
                      <Text style={styles.chatText}>Chat</Text>
                    </TouchableOpacity>
                  </View>
                </TouchableOpacity>
              ))
            ) : (
              <Text style={styles.noTripText}>
                You have no trips in transit or new orders.
              </Text>
            )}
          </ScrollView>

          <View style={styles.selectTripContainer}>
            <View style={styles.requestButtonRow}>
              <TouchableOpacity
                style={styles.requestTripButton}
                onPress={() => navigation.navigate("MapViewComponent")}
              >
                <Text style={styles.requestTripText}>Request Trip</Text>
              </TouchableOpacity>
              <LocationSender
                userId={userId}
                userType="customer"
                interval={60000}
              />
              <TouchableOpacity
                style={styles.requestTripButton}
                onPress={() => navigation.navigate("DeliveryMap")}
              >
                <Text style={styles.requestTripText}>Request Delivery</Text>
              </TouchableOpacity>
              {/* <TouchableOpacity
              style={styles.requestTripButton}
              onPress={() => navigation.navigate("OnlineStore")}
            >
              <Text style={styles.requestTripText}>Online Store</Text>
            </TouchableOpacity> */}
            </View>
          </View>
        </View>
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
  fixedCurrentTripContainer: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    height: 400,
    backgroundColor: "#FFC000",
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    elevation: 5,
    paddingBottom: 20,
  },

  selectTripContainer: {
    alignItems: "center",
    display: "flex",
    marginTop: -6,
    marginBottom: -1,
    backgroundColor: "rgba(255, 255, 255, 0.8)", // Background color
    paddingTop: "5", // Padding for spacing
    borderBottomEndRadius: 10,
    borderStartEndRadius: 10, // Rounded corners
    shadowColor: "#000", // Shadow effect
    shadowOffset: {
      width: 0,
      height: 2,
    },
  },

  nameContainer: {
    flexDirection: "column", // Stack stars and name vertically
    justifyContent: "center", // Center items vertically
    marginLeft: 5,
    marginBottom: 20, // Space between image and text
  },
  profileContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  profileName: {
    fontSize: 12,
    fontWeight: "bold",
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginLeft: 3,
    marginRight: 5,
    marginBottom: 8,
  },
  starContainer: {
    flexDirection: "row",
  
  },
  star: {
    fontSize: 18, // Adjust size as needed
    color: "gold", // Star color
  },

  tripCard: {
    marginVertical: 5,
    padding: 10,
    width: "100%",
    maxHeight: 300,
    paddingBottom: 10,
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  tripDetailsView: {
    borderRadius: 10,
    marginTop: 10,
    paddingBottom: 10,
    backgroundColor: "rgba(255, 255, 255)",
    padding: 10,
  },
  tripHeaderText: {
    fontWeight: "bold",
    fontSize: 18,
    marginBottom: 5,
    textAlign: "center",
  },
  tripDetailsText: {
    fontSize: 14,
    color: "#595959",
  },
  tripDetailsTextPro: {
    marginTop: 5,
    fontSize: 14,
    color: "#595959",
  },
  statusText: {
    fontWeight: "bold",
    fontSize: 16,
    color: "red",
    backgroundColor: "rgba(255, 255, 255, 0.5)",
    padding: 10,
    borderRadius: 10,
    marginBottom: 10,
  },
  noTripText: {
    fontSize: 12,
    color: "Black",
    textAlign: "center",
  },
  requestTripButton: {
    backgroundColor: "#FFC000",
    borderRadius: 25,
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginBottom: 10,
    alignSelf: "center",
    // borderWidth: 1,
    // borderColor: "black",
    marginLeft: 5,
  },
  requestTripText: {
    fontWeight: "bold",
    color: "#000",
    fontSize: 14,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "flex-start", // Adjusted to space-between for better button arrangement
    marginTop: 10,
    marginBottom: 5,
  },
  cancelTripButton: {
    backgroundColor: "#FF5733",
    borderRadius: 15, // Smaller border radius
    paddingVertical: 6, // Reduced padding
    paddingHorizontal: 12, // Reduced padding
    marginRight: 5, // Slight margin for spacing
  },
  endTripButton: {
    backgroundColor: "#FFA500",
    borderRadius: 15, // Smaller border radius
    paddingVertical: 6, // Reduced padding
    paddingHorizontal: 12, // Reduced padding
    marginRight: 5, // Slight margin for spacing
  },
  chatButton: {
    backgroundColor: "#007BFF",
    borderRadius: 15, // Smaller border radius
    paddingVertical: 6, // Reduced padding
    paddingHorizontal: 12, // Reduced padding
    elevation: 5,
  },
  requestButtonRow: {
    flexDirection: "row",
    justifyContent: "center", // Center the buttons
    // marginBottom: 1,
  },

  cancelTripText: {
    fontWeight: "bold",
    color: "#FFFFFF",
    fontSize: 13,
  },

  endTripText: {
    fontWeight: "bold",
    color: "#FFFFFF",
    fontSize: 14,
  },

  chatText: {
    fontWeight: "bold",
    color: "#FFFFFF",
    fontSize: 13,
  },
  offerCard: {
    padding: 15,
    backgroundColor: "#FFC000",
    borderRadius: 10,
    marginBottom: 10,
    position: "relative",
    overflow: "hidden",
    width: "90%",
    alignSelf: "flex-end",
  },
  progressBarContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    height: 3,
    backgroundColor: "transparent",
    width: "100%",
    zIndex: 1,
  },
  progressBar: {
    height: "100%",
    backgroundColor: "#FFA500",
  },
  offerText: {
    fontSize: 18,
    color: "black",
  },
  offerButtonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  acceptButton: {
    backgroundColor: "#4CAF50",
    padding: 10,
    borderRadius: 5,
    flex: 1,
    marginRight: 5,
  },
  rejectButton: {
    backgroundColor: "#FF5733",
    padding: 10,
    borderRadius: 5,
    flex: 1,
    marginLeft: 5,
  },
  buttonText: {
    color: "#FFFFFF",
    fontWeight: "bold",
    textAlign: "center",
  },
});

export default Home;

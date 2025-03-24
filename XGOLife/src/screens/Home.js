import React, { useEffect, useState, useRef, useCallback } from "react";import {
  StyleSheet,
  View,
  SafeAreaView,
  Text,
  TouchableOpacity,
  Animated,
  Dimensions,
  Image,
  ScrollView,
  StatusBar,
  ActivityIndicator,
} from "react-native";
import { WebView } from "react-native-webview";
import FontAwesome from "react-native-vector-icons/FontAwesome5";
import { API_URL, API_URL_UPLOADS } from "./config";
import TopView from "../components/TopView";
import AsyncStorage from "@react-native-async-storage/async-storage";
import LocationSender from "./LocationTracker";
import Toast from "react-native-toast-message";
import { LinearGradient } from "expo-linear-gradient";
import { useFocusEffect } from "@react-navigation/native";

const { height, width } = Dimensions.get("window");

const Home = ({ navigation }) => {
  const [trips, setTrips] = useState([]);
  const [userId, setUserId] = useState(null);
  const [carAnimation] = useState(new Animated.Value(0));
  const [counterOffers, setCounterOffers] = useState([]);
  const [driver, setDriver] = useState();
  const [showCounterOffers, setShowCounterOffers] = useState(false);
  const [shownOfferIds, setShownOfferIds] = useState(new Set());
  const progressAnimations = useRef({});
  const [bottomSheetHeight] = useState(new Animated.Value(150));
  const [isExpanded, setIsExpanded] = useState(false);
  const [navigated, setNavigated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [slowConnection, setSlowConnection] = useState(false);
  const [showSlowConnection, setShowSlowConnection] = useState(false);

  // Fetch user data and set up interval
  useEffect(() => {
    const fetchUserData = async () => {
      const storedIds = await AsyncStorage.getItem("theIds");
      const parsedIds = JSON.parse(storedIds);
      setUserId(parsedIds.customerId);

      // Initial fetch of user trips
      fetchUserTrips(parsedIds.customerId);

      // Set up an interval to fetch user trips and counter offers
      const intervalId = setInterval(() => {
        if (!navigated) {
          // Only fetch if not navigated
          fetchUserTrips(parsedIds.customerId);
        }
      }, 500);

      return () => clearInterval(intervalId); // Clear interval on unmount
    };

    fetchUserData();

    // Start animation loop
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
  }, [navigated]);




  const toggleBottomSheet = () => {
    Animated.timing(bottomSheetHeight, {
      toValue: isExpanded ? 150 : height * 0.7,
      duration: 300,
      useNativeDriver: false,
    }).start();
    setIsExpanded(!isExpanded);
  };
  const handleLoadStart = () => {
    setLoading(true);
    setSlowConnection(false);
    setShowSlowConnection(false); // Hide the message initially

    setTimeout(() => {
      setSlowConnection(true);
      setShowSlowConnection(true); // Show the message
      setTimeout(() => {
        setShowSlowConnection(false); // Hide after 3 seconds
      }, 3000);
    }, 5000); // Adjust this time as necessary
  };
  const handleLoadEnd = () => {
    setLoading(false);
    setSlowConnection(false);
  };












  // Call lastActivity when the screen is focused
  useFocusEffect(
    useCallback(() => {
      const fetchUserIdAndCallLastActivity = async () => {
        const storedIds = await AsyncStorage.getItem("theIds");
        const parsedIds = JSON.parse(storedIds);
        if (parsedIds && parsedIds.customerId) {
          lastActivity(parsedIds.customerId);
        }
      };

      fetchUserIdAndCallLastActivity();
    }, [])
  );


  const lastActivity = async (id) => {
    console.log("user last activity logged", id);
    try {
      const response = await fetch(
        `${API_URL}/users/update_last_activity_date_time/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        const errorResponse = await response.json();
        console.error("Error Response:", errorResponse);
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log("last acty loggy:", result);
    } catch (error) {
      console.log(error);
    }
  };











  // Dependency on navigated
  const fetchUserTrips = async (userId) => {
    try {
      const response = await fetch(`${API_URL}/trip/customer/notify/${userId}`);
      const userTrips = await response.json();

      // Filter out trips with customer_status "Ended"
      const filteredUserTrips = userTrips.filter(
        (trip) => trip.customer_status !== "Ended" || trip.weight > 0
      );

      if (filteredUserTrips.length > 0) {
        const driverIds = filteredUserTrips.map((trip) => trip.driver_id);
        const uniqueDriverIds = [...new Set(driverIds)];
        const drivers = await fetchDrivers(uniqueDriverIds);

        const driverMap = new Map(
          drivers.map((driver) => [driver.driver_id, driver])
        );

        // Create tripsWithDrivers
        const tripsWithDrivers = filteredUserTrips.map((trip) => ({
          ...trip,
          driver: driverMap.get(trip.driver_id) || null,
        }));

        // Check conditions on tripsWithDrivers
        tripsWithDrivers.forEach((trip) => {
          if (
            trip.driver_status === "Ended" &&
            trip.weight === 0 &&
            trip.status === "InTransit"
          ) {
            console.log("Driver has ended");
            setNavigated(true); // Set navigated to true
            navigation.navigate("CustomerEndTrip", { trip: trip });
          }
        });

        // Set trips with drivers
        setTrips(tripsWithDrivers);
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
      return drivers.flat();
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

          const newOffers = updatedOffers.filter(
            (offer) => !shownOfferIds.has(offer.counter_offer_id)
          );

          if (newOffers.length > 0) {
            setCounterOffers((prev) => [...prev, ...newOffers]);

            newOffers.forEach((offer) =>
              shownOfferIds.add(offer.counter_offer_id)
            );
            setShowCounterOffers(true);

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
    return Math.floor(Math.random() * 5000) + 3000;
  };

  const startOfferTimer = (offerId) => {
    const animation = new Animated.Value(0);
    progressAnimations.current[offerId] = animation;

    Animated.timing(animation, {
      toValue: 100,
      duration: 30000,
      useNativeDriver: false,
    }).start(() => {
      markOfferAsSeen(offerId);
      setCounterOffers((prevOffers) =>
        prevOffers.filter((offer) => offer.counter_offer_id !== offerId)
      );
      delete progressAnimations.current[offerId];
    });
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
        throw new Error(
          `Error accepting counter offer: ${acceptResponse.statusText}`
        );
      }

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

      const updatedData = await statusResponse.json();
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
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ status: "seen" }),
        }
      );

      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }

      const data = await response.json();
    } catch (error) {
      console.error("Error marking offer as seen:", error);
    }
  };

  const renderStars = (rating) => {
    const stars = [];
    for (let i = 0; i < 5; i++) {
      stars.push(
        <FontAwesome
          key={i}
          name={i < rating ? "star" : "star"}
          solid={i < rating}
          style={[styles.star, { color: i < rating ? "#FFD700" : "#E0E0E0" }]}
        />
      );
    }
    return <View style={styles.starContainer}>{stars}</View>;
  };

  const Cancel = async (Id) => {
    try {
      console.log("Now Cancelling", Id.trip_id);

      const tripId = Id.trip_id;
      const updateData = {
        driver_id: Id.driver_id,
        cust_id: Id.cust_id,
        request_start_datetime: Id.request_start_datetime,
        order_start_datetime: Id.order_start_datetime,
        order_end_datetime: Id.order_end_datetime,
        status: "Cancelled",
        deliveray_details: Id.deliveray_details,
        delivery_notes: Id.delivery_notes,
        weight: Id.weight,
        delivery_contact_details: Id.delivery_contact_details,
        dest_location: Id.dest_location,
        origin_location: Id.origin_location,
        origin_location_lat: Id.origin_location_lat,
        origin_location_long: Id.origin_location_long,
        destination_lat: Id.destination_lat,
        destination_long: Id.destination_long,
        distance: Id.distance,
        delivery_cost_proposed: Id.delivery_cost_proposed,
        accepted_cost: Id.accepted_cost,
        paying_when: Id.paying_when,
        payment_type: Id.payment_type,
        currency_id: Id.currency_id,
        currency_code: Id.currency_code,
        usd_rate: Id.usd_rate,
        customer_comment: Id.customer_comment,
        driver_comment: Id.driver_comment,
        driver_stars: Id.driver_stars,
        customer_stars: Id.customer_stars,
        pascel_pic1: Id.pascel_pic1,
        pascel_pic2: Id.pascel_pic2,
        pascel_pic3: Id.pascel_pic3,
        trip_priority_type: Id.trip_priority_type,
      };

      const response = await fetch(`${API_URL}/trip/${tripId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updateData),
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }

      Toast.show({
        text1: "Success",
        text2: "Trip has been successfully cancelled!",
        type: "success",
        position: "top",
        visibilityTime: 3000,
        autoHide: true,
      });
    } catch (error) {
      console.error("Error cancelling trip:", error);

      Toast.show({
        text1: "Error",
        text2: "Failed to cancel trip. Please try again.",
        type: "error",
        position: "top",
        visibilityTime: 3000,
        autoHide: true,
      });
    }
  };

  const endtrip = (trip) => {
    console.log("ending trip", trip);
    navigation.navigate("CustomerEndTrip", { trip: trip });
  };

  const formatTime = (datetime) => {
    const date = new Date(datetime);

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");

    return `${year}-${month}-${day} ${hours}:${minutes}hrs`;
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "New Order":
        return "#3498db"; // Blue
      case "InTransit":
        return "#2ecc71"; // Green
      case "Completed":
        return "#27ae60"; // Dark Green
      case "Cancelled":
        return "#e74c3c"; // Red
      default:
        return "#f39c12"; // Orange for other statuses
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor="transparent"
        translucent
      />

      {/* Top Bar */}
      <SafeAreaView style={styles.topBar}>
        <TopView id={userId} />
      </SafeAreaView>

      {/* Map */}
      {loading && (
        <ActivityIndicator size="large" color="#ffc000" style={styles.loader} />
      )}
      {showSlowConnection && !loading && (
        <View style={styles.slowConnectionContainer}>
          <Text style={styles.slowConnectionText}>
            Slow connection detected...
          </Text>
        </View>
      )}
      <WebView
        source={{ uri: "https://xgolifedash.softworkscapital.com/d" }}
        style={styles.webview}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        startInLoadingState={true}
        onLoadStart={handleLoadStart}
        onLoadEnd={handleLoadEnd}
      />

      {/* Bottom Sheet */}
      <Animated.View
        style={[styles.bottomSheet, { height: bottomSheetHeight }]}
      >
        {/* Handle for expanding/collapsing */}
        <TouchableOpacity style={styles.handle} onPress={toggleBottomSheet}>
          <FontAwesome
            name={isExpanded ? "chevron-down" : "chevron-up"}
            size={24}
            color="#666"
          />
        </TouchableOpacity>
        {/* Title and Trip Count */}
        <View style={styles.headerContainer}>
          <Text style={styles.tripHeaderText}>My Trips</Text>
          <View style={styles.tripCountBadge}>
            <Text style={styles.tripCountText}>{trips.length}</Text>
          </View>
        </View>

        {/* Trips List */}
        <ScrollView
          style={styles.tripList}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.tripListContent}
        >
          {trips.length > 0 ? (
            trips.map((trip) => (
              <TouchableOpacity
                key={trip.trip_id}
                style={styles.tripCard}
                onPress={() => navigation.navigate("TripTrack", { trip })}
                activeOpacity={0.9}
              >
                {/* Status Badge */}
                <View
                  style={[
                    styles.statusBadge,
                    { backgroundColor: getStatusColor(trip.status) },
                  ]}
                >
                  <Text style={styles.statusText}>{trip.status}</Text>
                </View>

                {/* Trip ID and Time */}
                <View style={styles.tripMetaContainer}>
                  <View style={styles.tripIdContainer}>
                    <FontAwesome name="hashtag" size={14} color="#666" />
                    <Text style={styles.tripIdText}>{trip.trip_id}</Text>
                  </View>
                  <View style={styles.timeContainer}>
                    <FontAwesome name="clock" size={14} color="#666" />
                    <Text style={styles.timeText}>
                      {formatTime(trip.request_start_datetime)}
                    </Text>
                  </View>
                </View>

                {/* Driver Information (if available) */}
                {trip.status !== "New Order" && trip.driver && (
                  <View style={styles.driverContainer}>
                    <View style={styles.driverHeader}>
                      <FontAwesome name="user-circle" size={14} color="#666" />
                      <Text style={styles.driverHeaderText}>Driver</Text>
                    </View>

                    <View style={styles.driverInfoRow}>
                      <Image
                        source={{
                          uri: `${API_URL_UPLOADS}/${trip.driver.profilePic.replace(
                            /\\/g,
                            "/"
                          )}`,
                        }}
                        style={styles.driverImage}
                      />

                      <View style={styles.driverDetails}>
                        <Text style={styles.driverName}>
                          {trip.driver.name} {trip.driver.surname}
                        </Text>

                        <View style={styles.licensePlateContainer}>
                          <Text style={styles.licensePlateLabel}>License:</Text>
                          <Text style={styles.licensePlateValue}>
                            {trip.driver.license_plate || "N/A"}
                          </Text>
                        </View>

                        {renderStars(trip.driver.rating)}
                      </View>
                    </View>
                  </View>
                )}

                {/* Trip Locations */}
                <View style={styles.tripLocations}>
                  <View style={styles.locationLine}>
                    <View style={styles.locationDot} />
                    <View style={styles.locationConnector} />
                    <View style={[styles.locationDot, styles.destinationDot]} />
                  </View>

                  <View style={styles.locationDetails}>
                    <View style={styles.locationItem}>
                      <Text style={styles.locationLabel}>Origin</Text>
                      <Text style={styles.locationValue} numberOfLines={1}>
                        {trip.origin_location || "N/A"}
                      </Text>
                    </View>

                    <View style={styles.locationItem}>
                      <Text style={styles.locationLabel}>Destination</Text>
                      <Text style={styles.locationValue} numberOfLines={1}>
                        {trip.dest_location || "N/A"}
                      </Text>
                    </View>
                  </View>
                </View>

                {/* Trip Details (if any) */}
                {trip.deliveray_details &&
                  trip.deliveray_details.length > 0 && (
                    <View style={styles.deliveryDetailsContainer}>
                      <Text style={styles.deliveryDetailsLabel}>Details:</Text>
                      <Text
                        style={styles.deliveryDetailsText}
                        numberOfLines={2}
                      >
                        {trip.deliveray_details}
                      </Text>
                    </View>
                  )}

                {/* Action Buttons */}
                <View style={styles.actionButtonsContainer}>
                  {trip.status === "New Order" ? (
                    <TouchableOpacity
                      style={styles.cancelButton}
                      onPress={() => Cancel(trip)}
                    >
                      <FontAwesome
                        name="times-circle"
                        size={16}
                        color="white"
                      />
                      <Text style={styles.buttonText}>Cancel Trip</Text>
                    </TouchableOpacity>
                  ) : (
                    trip.weight === 0 && (
                      <TouchableOpacity
                        style={styles.endButton}
                        onPress={() => endtrip(trip)}
                      >
                        <FontAwesome
                          name="flag-checkered"
                          size={16}
                          color="white"
                        />
                        <Text style={styles.buttonText}>End Trip</Text>
                      </TouchableOpacity>
                    )
                  )}

                  <TouchableOpacity
                    style={styles.trackButton}
                    onPress={() => navigation.navigate("TripTrack", { trip })}
                  >
                    <FontAwesome
                      name="map-marker-alt"
                      size={16}
                      color="white"
                    />
                    <Text style={styles.buttonText}>Track</Text>
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>
            ))
          ) : (
            <View style={styles.noTripsContainer}>
              <FontAwesome name="route" size={50} color="#DDD" />
              <Text style={styles.noTripText}>You have no active trips</Text>
              <Text style={styles.noTripSubtext}>
                Create a new trip request to get started
              </Text>
            </View>
          )}
        </ScrollView>

        {/* Action Buttons */}
        <View style={styles.actionContainer}>
          <LinearGradient
            colors={["#FFC000", "#FFD700"]}
            style={styles.gradientButton}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          >
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => navigation.navigate("MapViewComponent")}
            >
              <FontAwesome name="car" size={20} color="#000" />
              <Text style={styles.actionButtonText}>Request Trip</Text>
            </TouchableOpacity>
          </LinearGradient>

          <LocationSender
            userId={userId}
            userType="customer"
            interval={60000}
          />

          <LinearGradient
            colors={["#FFC000", "#FFD700"]}
            style={styles.gradientButton}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          >
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => navigation.navigate("DeliveryMap")}
            >
              <FontAwesome name="box" size={20} color="#000" />
              <Text style={styles.actionButtonText}>Request Delivery</Text>
            </TouchableOpacity>
          </LinearGradient>
        </View>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  topBar: {
    zIndex: 10,
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
  },
  webview: {
    flex: 1,
  },
  bottomSheet: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#fff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: -3,
    },
    shadowOpacity: 0.27,
    shadowRadius: 4.65,
    elevation: 6,
    paddingBottom: 20,
  },
  handle: {
    alignSelf: "center",
    width: 50,
    height: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  handle: {
    alignSelf: "center",
    paddingVertical: 10,
  },

  circleBackground: {
    width: 50, // Adjust size as needed
    height: 50, // Adjust size as needed
    borderRadius: 25, // Half of the width/height for circular shape
    backgroundColor: "#ffc000", // Background color
    justifyContent: "center",
    alignItems: "center",
  },
  handleBar: {
    width: 40,
    height: 5,
    borderRadius: 3,
    backgroundColor: "#DDD",
    marginTop: 10,
  },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
    marginTop: 5,
    marginBottom: 15,
  },
  tripHeaderText: {
    fontSize: 20,
    fontWeight: "700",
    color: "#333",
  },
  tripCountBadge: {
    backgroundColor: "#ffc000",
    borderRadius: 12,
    width: 24,
    height: 24,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 8,
  },
  tripCountText: {
    color: "#000",
    fontSize: 14,
    fontWeight: "700",
  },
  tripList: {
    flex: 1,
    paddingHorizontal: 20,
  },
  tripListContent: {
    paddingBottom: 20,
  },
  tripCard: {
    backgroundColor: "#ffc000",
    borderRadius: 15,
    marginBottom: 15,
    padding: 15,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  statusBadge: {
    alignSelf: "flex-start",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginBottom: 10,
  },
  statusText: {
    color: "white",
    fontWeight: "700",
    fontSize: 12,
  },
  tripMetaContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 15,
  },
  tripIdContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  tripIdText: {
    marginLeft: 5,
    fontSize: 14,
    color: "#666",
    fontWeight: "500",
  },
  timeContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  timeText: {
    marginLeft: 5,
    fontSize: 14,
    color: "#666",
    fontWeight: "500",
  },
  tripLocations: {
    flexDirection: "row",
    marginBottom: 15,
    backgroundColor: "#f9f9f9",
    padding: 10,
    borderRadius: 10,
  },
  locationLine: {
    width: 20,
    alignItems: "center",
    marginRight: 10,
  },
  locationDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: "#4CAF50",
  },
  destinationDot: {
    backgroundColor: "#F44336",
  },
  locationConnector: {
    width: 2,
    height: 40,
    backgroundColor: "#ddd",
    marginVertical: 5,
  },
  locationDetails: {
    flex: 1,
  },
  locationItem: {
    marginBottom: 15,
  },
  locationLabel: {
    fontSize: 12,
    color: "#888",
    marginBottom: 3,
  },
  locationValue: {
    fontSize: 14,
    color: "#333",
    fontWeight: "500",
  },
  driverContainer: {
    backgroundColor: "#f9f9f9",
    borderRadius: 10,
    padding: 10,
    marginBottom: 15,
  },
  driverHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  driverHeaderText: {
    marginLeft: 5,
    fontSize: 14,
    color: "#666",
    fontWeight: "700",
  },
  driverInfoRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  driverImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 15,
    borderWidth: 2,
    borderColor: "#FFC000",
  },
  driverDetails: {
    flex: 1,
  },
  driverName: {
    fontSize: 16,
    fontWeight: "700",
    color: "#333",
    marginBottom: 3,
  },
  licensePlateContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 5,
  },
  licensePlateLabel: {
    fontSize: 12,
    color: "#888",
    marginRight: 5,
  },
  licensePlateValue: {
    fontSize: 14,
    color: "#333",
    fontWeight: "500",
  },
  starContainer: {
    flexDirection: "row",
    marginTop: 3,
  },
  star: {
    fontSize: 16,
    marginRight: 2,
  },
  deliveryDetailsContainer: {
    marginBottom: 15,
    backgroundColor: "#f9f9f9",
    padding: 10,
    borderRadius: 10,
  },
  deliveryDetailsLabel: {
    fontSize: 12,
    color: "#888",
    marginBottom: 3,
  },
  deliveryDetailsText: {
    fontSize: 14,
    color: "#333",
  },
  actionButtonsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    // color: "#000",
  },
  cancelButton: {
    backgroundColor: "#e74c3c",
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 15,
    flexDirection: "row",
    alignItems: "center",
    flex: 0.48,
    justifyContent: "center",
  },
  endButton: {
    backgroundColor: "#f39c12",
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 15,
    flexDirection: "row",
    alignItems: "center",
    flex: 0.48,
    justifyContent: "center",
  },
  trackButton: {
    backgroundColor: "#3498db",
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 15,
    flexDirection: "row",
    alignItems: "center",
    flex: 0.48,
    justifyContent: "center",
  },
  buttonText: {
    color: "white",
    fontWeight: "700",
    marginLeft: 5,
    fontSize: 14,
  },
  noTripsContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 30,
  },
  noTripText: {
    fontSize: 18,
    fontWeight: "700",
    color: "#666",
    marginTop: 15,
  },
  noTripSubtext: {
    fontSize: 14,
    color: "#999",
    marginTop: 5,
    textAlign: "center",
  },
  actionContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    marginTop: 10,
  },
  gradientButton: {
    borderRadius: 15,
    flex: 0.48,
    overflow: "hidden",
  },
  actionButton: {
    paddingVertical: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderBlockColor: "#000",
  },
  actionButtonText: {
    fontWeight: "700",
    color: "#000",
    marginLeft: 8,
    fontSize: 15,
  },
  loader: {
    position: "absolute",
    top: height / 2 - 20,
    left: width / 2 - 20,
    zIndex: 1000,
  },
  slowConnectionContainer: {
    position: "absolute",
    top: height / 2 - 50,
    left: width / 2 - 100,
    zIndex: 1000,
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    padding: 10,
    borderRadius: 10,
    alignItems: "center",
  },
  slowConnectionText: {
    color: "#e74c3c",
    fontWeight: "bold",
  },
  bottomSheet: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#fff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: -3,
    },
    shadowOpacity: 0.27,
    shadowRadius: 4.65,
    elevation: 6,
    paddingBottom: 20,
  },
});

export default Home;

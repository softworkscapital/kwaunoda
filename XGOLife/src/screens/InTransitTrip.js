import React, { useEffect, useState, useRef } from "react";
import {
  StyleSheet,
  View,
  SafeAreaView,
  Text,
  TouchableOpacity,
  Dimensions,
  Image,
  Animated,
  ScrollView,
  StatusBar,
  Platform,
  ActivityIndicator,
  PanResponder,
  Linking,
} from "react-native";
import { WebView } from "react-native-webview";
import TopView from "../components/TopView";
import { Ionicons, MaterialIcons, FontAwesome5 } from "@expo/vector-icons";
import { useRoute } from "@react-navigation/native";

const { height, width } = Dimensions.get("window");

const InTransitTrip = ({ navigation }) => {
  const [activeState, setActiveState] = useState(3);
  const [tripDetails, setTripDetails] = useState(null);
  const [driverDetails, setDriverDetails] = useState(null);
  const [customerDetails, setCustomerDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [bottomSheetHeight, setBottomSheetHeight] = useState("auto");
  const [liveTracking, setLiveTracking] = useState({
    eta: 0,
    vehicleType: "",
    package: "",
  });
  const contactDriver = () => {
    if (customerDetails && customerDetails.phone) {
      const phoneNumber = customerDetails.phone;
      Linking.openURL(`tel:${phoneNumber}`) // Open the phone dialer
        .catch((err) => console.error("Error opening dialer:", err));
    }
  };

  const route = useRoute();
  const { OntripData } = route.params;
  const API_URL = "https://srv547457.hstgr.cloud:3011";
  const API_URL_UPLOADS = "https://srv547457.hstgr.cloud:3020";

  const bottomSheetRef = useRef(null);
  const animatedValue = useRef(new Animated.Value(0)).current;

  const states = [
    { label: "Customer", icon: "person" },
    { label: "Trip", icon: "map" },
    { label: "Live", icon: "location-sharp" },
  ];

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (evt, gestureState) => {
        return gestureState.dy > 20; // Threshold for swipe down
      },
      onPanResponderRelease: (evt, gestureState) => {
        if (gestureState.dy > 50) {
          // Threshold to close
          setActiveState(3);
          setBottomSheetHeight("auto"); // Reset height when closing
        }
      },
    })
  ).current;

  const expandBottomSheet = (index) => {
    setActiveState(index);

    if (index === activeState && index !== 3) {
      setActiveState(3);
      setBottomSheetHeight("auto"); // Reset to auto when collapsing
      return;
    }

    setBottomSheetHeight("auto"); // Set to auto when expanding
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const tripResponse = await fetch(
          `${API_URL}/trip/${OntripData.trip_id}`
        );
        const tripData = await tripResponse.json();
        setTripDetails(tripData[0]);

        if (OntripData.cust_id) {
          console.log("td", OntripData.cust_id);
          const CustomerResponse = await fetch(
            `${API_URL}/customerdetails/${tripData[0].cust_id}`
          );
          console.log("rr", CustomerResponse);
          const CustomerData = await CustomerResponse.json();
          setCustomerDetails(CustomerData[0]);
          console.log("tt", CustomerData);
        }

        if (OntripData.driver_id) {
          const driverResponse = await fetch(
            `${API_URL}/driver/${OntripData.driver_id}`
          );
          const driverData = await driverResponse.json();
          setDriverDetails(driverData[0]);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [OntripData]);

  useEffect(() => {
    if (tripDetails && driverDetails) {
      const calculateETA = () => {
        const destinationLat = tripDetails.destination_lat;
        const destinationLng = tripDetails.destination_long;
        const driverLat = parseFloat(driverDetails.lat_cordinates);
        const driverLng = parseFloat(driverDetails.long_cordinates);

        const toRad = (value) => (value * Math.PI) / 180;
        const R = 6371; // Radius of the Earth in km
        const dLat = toRad(destinationLat - driverLat);
        const dLon = toRad(destinationLng - driverLng);
        const a =
          Math.sin(dLat / 2) * Math.sin(dLat / 2) +
          Math.cos(toRad(driverLat)) *
            Math.cos(toRad(destinationLat)) *
            Math.sin(dLon / 2) *
            Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        const distance = R * c;

        const averageSpeed = 60; // km/h
        const etaMinutes = (distance / averageSpeed) * 60;

        setLiveTracking({
          eta: Math.round(etaMinutes),
          vehicleType: driverDetails.vehicle_category || "Unknown",
          vehicleModel: driverDetails.model || "Unknown",
          vehicleMake: driverDetails.make || "Unknown",
          package: tripDetails.package || "Standard Package",
        });
      };

      calculateETA();
    }
  }, [tripDetails, driverDetails]);

  const renderStars = (rating) => {
    const stars = [];
    const ratingValue = parseFloat(rating) || 0;

    for (let i = 0; i < 5; i++) {
      stars.push(
        <Text key={i} style={styles.star}>
          {i < ratingValue ? "★" : "☆"}
        </Text>
      );
    }
    return <View style={styles.starContainer}>{stars}</View>;
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "completed":
        return "#4CAF50";
      case "in progress":
        return "#2196F3";
      case "cancelled":
        return "#F44336";
      case "pending":
        return "#FFC107";
      default:
        return "#757575";
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
    
  };
  const endtrip = (trip) => {
    navigation.navigate("DriverEndTrip", { trip: trip });
  };
  const GotoChart = (tripid, customerId, driverId) => {
    navigation.navigate("DriverChat", {
      tripId: tripid,
      driverId: driverId,
      customerId: customerId,
    });
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFC000" />
      <TopView />
      <WebView
        source={{
          uri: `http://xgolifedash.softworkscapital.com/Director/${OntripData.trip_id}`,
        }}
        style={styles.webview}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        startInLoadingState={true}
        renderLoading={() => (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#FFC000" />
            <Text style={styles.loadingText}>Loading map...</Text>
          </View>
        )}
      />

      <Animated.View
        ref={bottomSheetRef}
        style={[styles.bottomBar, { height: bottomSheetHeight }]}
        {...panResponder.panHandlers} // Attach PanResponder handlers
      >
        <View style={styles.bottomSheetHandle}>
          <View style={styles.handle} />
        </View>

        <View style={styles.tabContainer}>
          {states.map((state, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.tabButton,
                activeState === index && styles.activeTabButton,
              ]}
              onPress={() => expandBottomSheet(index)}
            >
              <Ionicons
                name={state.icon}
                size={20}
                color={activeState === index ? "#FFC000" : "#555"}
              />
              <Text
                style={[
                  styles.tabText,
                  activeState === index && styles.activeTabText,
                ]}
              >
                {state.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {loading ? (
          <View style={styles.loadingContentContainer}>
            <ActivityIndicator size="small" color="#FFC000" />
            <Text style={styles.loadingContentText}>
              Loading trip information...
            </Text>
          </View>
        ) : (
          <ScrollView
            style={styles.contentScrollView}
            showsVerticalScrollIndicator={false}
          >
            {activeState === 0 && customerDetails && (
              <View style={styles.contentContainer}>
                <View style={styles.driverProfileCard}>
                  <View style={styles.driverHeaderSection}>
                    {customerDetails.profilePic ? (
                      <Image
                        source={{
                          uri: `${API_URL_UPLOADS}/${customerDetails.profilePic}`,
                        }}
                        style={styles.driverProfileImage}
                      />
                    ) : (
                      <View style={styles.driverProfilePlaceholder}>
                        <Ionicons name="person" size={40} color="#FFC000" />
                      </View>
                    )}
                    <View style={styles.driverHeaderInfo}>
                      <Text style={styles.driverName}>
                        {customerDetails.name} {customerDetails.surname}
                      </Text>
                      {renderStars(customerDetails.rating || 0)}
                      <View style={styles.driverBadge}>
                        <Text style={styles.driverBadgeText}>
                          {customerDetails.account_type || "Customer"}
                        </Text>
                      </View>
                    </View>
                  </View>

                  <View style={styles.divider} />

                  <View style={styles.driverDetailsSection}>
                    <View style={styles.detailRow}>
                      <View style={styles.detailItem}>
                        <Ionicons
                          name="call-outline"
                          size={16}
                          color="#555"
                          style={styles.detailIcon}
                        />
                        <Text style={styles.detailLabel}>Contact</Text>
                        <Text style={styles.detailValue}>
                          {customerDetails.phone || "N/A"}
                        </Text>
                      </View>
                      <View style={styles.detailItem}>
                        <Ionicons
                          name="mail-outline"
                          size={16}
                          color="#555"
                          style={styles.detailIcon}
                        />
                        <Text style={styles.detailLabel}>Email</Text>
                        <Text style={styles.detailValue}>
                          {customerDetails.email || "N/A"}
                        </Text>
                      </View>
                    </View>

                    <View style={styles.detailRow}>
                      <View style={styles.detailItem}>
                        <Ionicons
                          name="document-outline"
                          size={16}
                          color="#555"
                          style={styles.detailIcon}
                        />
                        <Text style={styles.detailLabel}>ID Number</Text>
                        <Text style={styles.detailValue}>
                          {customerDetails.idnumber || "N/A"}
                        </Text>
                      </View>
                      <View style={styles.detailItem}>
                        <MaterialIcons
                          name="verified-user"
                          size={16}
                          color="#555"
                          style={styles.detailIcon}
                        />
                        <Text style={styles.detailLabel}>Status</Text>
                        <Text style={styles.detailValue}>
                          {customerDetails.membershipstatus || "Active"}
                        </Text>
                      </View>
                    </View>
                  </View>

                  {/* Additional customer info can be added here if necessary */}
                </View>
              </View>
            )}

            {activeState === 1 && tripDetails && (
              <View style={styles.contentContainer}>
                <View style={styles.tripDetailsCard}>
                  <View style={styles.tripHeaderSection}>
                    <View style={styles.tripIdContainer}>
                      <Text style={styles.tripIdLabel}>Trip ID</Text>
                      <Text style={styles.tripIdValue}>
                        {tripDetails.trip_id}
                      </Text>
                    </View>

                    <View
                      style={[
                        styles.statusBadge,
                        { backgroundColor: getStatusColor(tripDetails.status) },
                      ]}
                    >
                      <Text style={styles.statusText}>
                        {tripDetails.status || "Unknown"}
                      </Text>
                    </View>
                  </View>

                  <View style={styles.divider} />

                  <View style={styles.tripLocations}>
                    <View style={styles.locationLine}>
                      <View style={styles.locationDot} />
                      <View style={styles.locationConnector} />
                      <View
                        style={[styles.locationDot, styles.destinationDot]}
                      />
                    </View>

                    <View style={styles.locationDetails}>
                      <View style={styles.locationItem}>
                        <Text style={styles.locationLabel}>Origin</Text>
                        <Text style={styles.locationValue}>
                          {tripDetails.origin_location || "N/A"}
                        </Text>
                      </View>

                      <View style={styles.locationItem}>
                        <Text style={styles.locationLabel}>Destination</Text>
                        <Text style={styles.locationValue}>
                          {tripDetails.dest_location || "N/A"}
                        </Text>
                      </View>
                    </View>
                  </View>

                  <View style={styles.divider} />

                  <View style={styles.tripMetrics}>
                    <View style={styles.metricItem}>
                      <Ionicons
                        name="speedometer-outline"
                        size={20}
                        color="#FFC000"
                      />
                      <Text style={styles.metricValue}>
                        {tripDetails.distance || "0"} km
                      </Text>
                      <Text style={styles.metricLabel}>Distance</Text>
                    </View>

                    <View style={styles.metricDivider} />

                    <View style={styles.metricItem}>
                      <Ionicons name="cash-outline" size={20} color="#FFC000" />
                      <Text style={styles.metricValue}>
                        {tripDetails.delivery_cost_proposed || "0"}{" "}
                        {tripDetails.currency_symbol || ""}
                      </Text>
                      <Text style={styles.metricLabel}>Cost</Text>
                    </View>

                    <View style={styles.metricDivider} />

                    <View style={styles.metricItem}>
                      <Ionicons name="card-outline" size={20} color="#FFC000" />
                      <Text style={styles.metricValue}>
                        {tripDetails.payment_type || "N/A"}
                      </Text>
                      <Text style={styles.metricLabel}>Payment</Text>
                    </View>
                  </View>

                  <View style={styles.divider} />

                  <View style={styles.tripParties}>
                    <View style={styles.partyItem}>
                      <Text style={styles.partyLabel}>Customer ID</Text>
                      <Text style={styles.partyValue}>
                        {tripDetails.cust_id || "N/A"}
                      </Text>
                    </View>

                    <View style={styles.partyItem}>
                      <Text style={styles.partyLabel}>Driver ID</Text>
                      <Text style={styles.partyValue}>
                        {tripDetails.driver_id || "Not Assigned"}
                      </Text>
                    </View>
                  </View>
                </View>
              </View>
            )}

            {activeState === 2 && driverDetails && tripDetails && (
              <View style={styles.contentContainer}>
                <View style={styles.liveTrackingCard}>
                  <View style={styles.liveStatusHeader}>
                    <View style={styles.pulsingDot}>
                      <View style={styles.pulsingDotInner} />
                    </View>
                    <Text style={styles.liveStatusText}>Live Tracking</Text>
                  </View>

                  <View style={styles.divider} />

                  <View style={styles.driverTrackingInfo}>
                    {driverDetails.profilePic ? (
                      <Image
                        source={{
                          uri: `${API_URL_UPLOADS}/${customerDetails.profilePic}`,
                        }}
                        style={styles.liveDriverImage}
                      />
                    ) : (
                      <View style={styles.liveDriverImagePlaceholder}>
                        <Ionicons name="person" size={30} color="#FFC000" />
                      </View>
                    )}

                    <View style={styles.liveDriverDetails}>
                      <Text style={styles.liveDriverName}>
                        {customerDetails.name} {customerDetails.surname}
                      </Text>
                      {renderStars(customerDetails.rating || 0)}
                      {/* <Text style={styles.liveVehicleInfo}>
                        {liveTracking.vehicleType}-{liveTracking.vehicleModel}-
                        {liveTracking.vehicleMake}
                      </Text> */}
                    </View>
                  </View>

                  <View style={styles.divider} />

                  <View style={styles.etaContainer}>
                    <View style={styles.etaItem}>
                      <Ionicons name="time-outline" size={24} color="#FFC000" />
                      <View style={styles.etaTextContainer}>
                        <Text style={styles.etaValue}>
                          {liveTracking.eta} min
                        </Text>
                        <Text style={styles.etaLabel}>Estimated Time</Text>
                      </View>
                    </View>

                    <View style={styles.etaItem}>
                      <Ionicons
                        name="navigate-outline"
                        size={24}
                        color="#FFC000"
                      />
                      <View style={styles.etaTextContainer}>
                        <Text style={styles.etaValue}>
                          {tripDetails.distance} km
                        </Text>
                        <Text style={styles.etaLabel}>Distance</Text>
                      </View>
                    </View>
                  </View>

                  <View style={styles.divider} />

                  <View style={styles.buttonContainer}>
                    <TouchableOpacity
                      style={styles.smallButton}
                      onPress={contactDriver}
                    >
                      <Ionicons name="call" size={30} color="#fff" />
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.smallButton}
                      onPress={() =>
                        GotoChart(
                          tripDetails.trip_id,
                          tripDetails.cust_id,
                          tripDetails.driver_id
                        )
                      }
                    >
                      <Ionicons name="chatbubbles" size={30} color="#fff" />
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.smallButton}
                      onPress={() => endtrip(tripDetails)}
                    >
                      
                      <Ionicons name="close-circle" size={30} color="#fff" />
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            )}
          </ScrollView>
        )}
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  webview: {
    flex: 1,
  },
  loadingContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.8)",
  },
  loadingText: {
    marginTop: 10,
    color: "#555",
    fontSize: 16,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 8,
  },
  smallButton: {
    backgroundColor: "#FFC000",
    borderRadius: 5,
    padding: 5,
    alignItems: "center",
    justifyContent: "center",
  },
  bottomBar: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    backgroundColor: "#ffc000",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: -3,
    },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 10,
    overflow: "hidden",
  },
  bottomSheetHandle: {
    alignItems: "center",
    paddingVertical: 10,
  },
  handle: {
    width: 40,
    height: 5,
    borderRadius: 3,
    backgroundColor: "#ddd",
  },
  tabContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingHorizontal: 20,
  },
  tabButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 30,
    backgroundColor: "#f5f5f5",
  },
  activeTabButton: {
    backgroundColor: "#333",
  },
  tabText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#555",
    marginLeft: 5,
  },
  activeTabText: {
    color: "#FFC000",
  },
  contentScrollView: {
    flex: 1,
    marginTop: 10,
  },
  contentContainer: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  loadingContentContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  loadingContentText: {
    marginTop: 10,
    color: "#555",
    fontSize: 14,
  },

  // Driver Info Styles
  driverProfileCard: {
    backgroundColor: "#fff",
    borderRadius: 15,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  driverHeaderSection: {
    flexDirection: "row",
    alignItems: "center",
  },
  driverProfileImage: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: "#f0f0f0",
  },
  driverProfilePlaceholder: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: "#f0f0f0",
    justifyContent: "center",
    alignItems: "center",
  },
  driverHeaderInfo: {
    marginLeft: 15,
    flex: 1,
  },
  driverName: {
    fontSize: 18,
    fontWeight: "700",
    color: "#333",
    marginBottom: 4,
  },
  starContainer: {
    flexDirection: "row",
    marginBottom: 6,
  },
  star: {
    fontSize: 16,
    color: "#FFC000",
    marginRight: 2,
  },
  driverBadge: {
    backgroundColor: "#f0f0f0",
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 12,
    alignSelf: "flex-start",
  },
  driverBadgeText: {
    fontSize: 12,
    color: "#555",
    fontWeight: "600",
  },
  divider: {
    height: 1,
    backgroundColor: "#eee",
    marginVertical: 15,
  },
  driverDetailsSection: {
    marginBottom: 5,
  },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 15,
  },
  detailItem: {
    flex: 1,
    marginHorizontal: 5,
  },
  detailIcon: {
    marginBottom: 5,
  },
  detailLabel: {
    fontSize: 12,
    color: "#888",
    marginBottom: 3,
  },
  detailValue: {
    fontSize: 14,
    color: "#333",
    fontWeight: "500",
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 10,
  },
  vehicleImagesScroll: {
    flexDirection: "row",
  },
  vehicleImage: {
    width: 120,
    height: 80,
    borderRadius: 8,
    marginRight: 10,
  },

  // Trip Details Styles
  tripDetailsCard: {
    backgroundColor: "#fff",
    borderRadius: 15,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  tripHeaderSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  tripIdContainer: {
    flex: 1,
  },
  tripIdLabel: {
    fontSize: 12,
    color: "#888",
  },
  tripIdValue: {
    fontSize: 16,
    fontWeight: "700",
    color: "#333",
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  statusText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "600",
  },
  tripLocations: {
    flexDirection: "row",
    marginBottom: 5,
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
    marginBottom: 20,
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
  tripMetrics: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 5,
  },
  metricItem: {
    flex: 1,
    alignItems: "center",
  },
  metricDivider: {
    width: 1,
    backgroundColor: "#eee",
  },
  metricValue: {
    fontSize: 16,
    fontWeight: "700",
    color: "#333",
    marginTop: 5,
    marginBottom: 3,
  },
  metricLabel: {
    fontSize: 12,
    color: "#888",
  },
  tripParties: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  partyItem: {
    flex: 1,
    marginHorizontal: 5,
  },
  partyLabel: {
    fontSize: 12,
    color: "#888",
    marginBottom: 3,
  },
  partyValue: {
    fontSize: 14,
    color: "#333",
    fontWeight: "500",
  },

  // Live Tracking Styles
  liveTrackingCard: {
    backgroundColor: "#fff",
    borderRadius: 15,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  liveStatusHeader: {
    flexDirection: "row",
    alignItems: "center",
  },
  pulsingDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: "#4CAF50",
    marginRight: 8,
  },
  pulsingDotInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: "rgba(76, 175, 80, 0.4)",
    position: "absolute",
  },
  liveStatusText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#333",
  },
  driverTrackingInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  liveDriverImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#f0f0f0",
  },
  liveDriverImagePlaceholder: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#f0f0f0",
    justifyContent: "center",
    alignItems: "center",
  },
  liveDriverDetails: {
    marginLeft: 15,
    flex: 1,
  },
  liveDriverName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 3,
  },
  liveVehicleInfo: {
    fontSize: 13,
    color: "#555",
    marginTop: 3,
  },
  etaContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  etaItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
  },
  etaTextContainer: {
    marginLeft: 10,
  },
  etaValue: {
    fontSize: 18,
    fontWeight: "700",
    color: "#333",
  },
  etaLabel: {
    fontSize: 12,
    color: "#888",
  },
  
  
});

export default InTransitTrip;

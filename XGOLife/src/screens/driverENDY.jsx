import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Modal,
  Image,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import BottomFooter2 from "./BottomFooter2";
import { API_URL, API_URL_UPLOADS } from "./config";
import Toast from "react-native-toast-message";

const DriverEndTrip = () => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const navigation = useNavigation();
  const route = useRoute();
  const trip = route.params?.trip;
  const tripId = trip.trip_id;
  const [loading, setLoading] = useState(false);
  const [customerState, setCustomerState] = useState(null);
  const [modalVisible, setModalVisible] = useState(true); // Modal starts as visible
  const [profileImage, setPic] = useState();
  const [type, setType] = useState();
  const [name, setName] = useState();
  const [code, setCode] = useState("0");

  useEffect(() => {
    fetchCustDetails();

    CheckCustState();
    // Set interval to check customer state every 5 seconds
    const intervalId = setInterval(() => {
      CheckCustState();
    }, 5000);

    // Clear interval on component unmount
    return () => clearInterval(intervalId);
  }, []);

  const fetchCustDetails = async () => {
    try {
      const response = await fetch(
        `${API_URL}/customerdetails/${trip.cust_id}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const result = await response.json();

      if (result && result.length > 0) {
        if (result[0].profilePic === null || result[0].profilePic === "") {
          setPic(null);
          setType(result[0].account_type);
          setName(result[0].username);
        } else {
          setPic(
            `${API_URL_UPLOADS}/${result[0].profilePic.replace(/\\/g, "/")}`
          );
          setType(result[0].account_type);
          setName(result[0].username);
        }
      } else {
        Alert.alert("Customer details not found.");
      }
    } catch (error) {
      console.log("Error fetching customer details:", error);
    }
  };

  const redirectHome = () => {
    navigation.navigate("DriverNewOrderList", {});
  };

  const CheckCustState = async () => {
    try {
      const response = await fetch(`${API_URL}/trip/${trip.trip_id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const result = await response.json();
      setCustomerState(result);
      console.log("Trip status", result);
      if (
        result &&
        result.length > 0 &&
        result[0]?.customer_status === "Ended"
      ) {
        setModalVisible(false); // Hide modal only if status is "Ended"
      }
      return result;
    } catch (error) {
      console.log("Error checking customer state:", error);
    }
  };

  const endTrip = async () => {
    console.log("tripcode", trip.delivery_received_confirmation_code);

    if (trip.delivery_received_confirmation_code === code) {
      try {
        const response = await fetch(
          `${API_URL}/trip/end-trip/driver/${trip.trip_id}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        const result = await response.json();
        console.log("Result from end trip function:", result);
        return response.ok; // Return true if response is OK
      } catch (error) {
        console.error("Error ending trip:", error);
      }
    }
    return false; // Return false if confirmation code doesn't match
  };

  const commentD = async () => {
 // Start loading

    // Check if state is valid and customer_status is "Ended"
    console.log("kasitoma", customerState);
    try {
      const FeedbackData = {
        driver_comment: comment,
        customer_stars: rating,
      };

      console.log("Comment of driver", FeedbackData);

      const response = await fetch(
        `${API_URL}/trip/driverComment/${tripId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(FeedbackData),
        }
      );

      const result = await response.json();
      console.log("Result from Comment of driver", result);

      if (response.ok) {
        Toast.show({
          text1: "Success",
          text2: result.message,
          type: "success",
          position: "top",
          visibilityTime: 3000,
          autoHide: true,
        });
       
      } else {
        Toast.show({
          text1: "Error",
          text2: result.message || "Failed to submit feedback.",
          type: "error",
          position: "top",
          visibilityTime: 3000,
          autoHide: true,
        });
      }
    } catch (error) {
      console.error("Error posting feedback:", error);
      Toast.show({
        text1: "Error",
        text2: "An error occurred while submitting your feedback.",
        type: "error",
        position: "top",
        visibilityTime: 3000,
        autoHide: true,
      });
    } 
  };

  const handleFeedback = async () => {
    // Check if a rating has been provided
    if (rating === 0) {
      Toast.show({
        text1: "Error",
        text2: "Please provide a rating.",
        type: "error",
        position: "top",
        visibilityTime: 3000,
        autoHide: true,
      });
      return;
    }

    // Check if a comment has been provided
    if (comment.trim() === "") {
      Toast.show({
        text1: "Error",
        text2: "Please provide additional comments.",
        type: "error",
        position: "top",
        visibilityTime: 3000,
        autoHide: true,
      });
      return;
    }

    setLoading(true); // Start loading

    const end = await endTrip(); // Ensure this is awaited
    console.log("Trip ended:", end);

    if (end) {
      await commentD();
      if (customerState && customerState.length > 0) {
        console.log("Current customer state:", customerState);
        if (customerState[0]?.customer_status === "Ended") {
          setLoading(false);
          redirectHome();
        }
      } else {
        Toast.show({
          text1: "Error",
          text2: "No customer state found.",
          type: "error",
          position: "top",
          visibilityTime: 3000,
          autoHide: true,
        });
      }
    } else {
      Toast.show({
        text1: "Error",
        text2: "Failed to end the trip. Please check the confirmation code.",
        type: "error",
        position: "top",
        visibilityTime: 3000,
        autoHide: true,
      });
    } // End loading
  };

  const redirectInt = (trip) => {
    console.log("yy", trip);
    console.log(tripId);
    navigation.navigate("InTransitTrip", { OntripData: trip });
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.topBar}>
          <TouchableOpacity
            style={styles.backArrow}
            onPress={() => redirectInt(trip)}
          >
            <MaterialIcons name="arrow-back" size={24} color="#000" />
          </TouchableOpacity>
          <View style={styles.topBarContent}>
            <Text style={styles.title}>End Trip</Text>
          </View>
        </View>

        <View style={styles.feedbackContainer}>
          <View style={styles.profileContainer}>
            <Image
              style={styles.profilePicture}
              source={{ uri: profileImage }}
            />
            <View>
              <Text style={styles.driverName}>{name}</Text>
              <Text style={styles.username}>{type}</Text>
            </View>
          </View>

          <View style={styles.ratingContainer}>
            <Text style={styles.ratingLabel}>Rate your experience:</Text>
            <View style={styles.ratingStars}>
              {[1, 2, 3, 4, 5].map((value) => (
                <TouchableOpacity
                  key={value}
                  onPress={() => setRating(value)}
                  style={[
                    styles.star,
                    rating >= value ? styles.starActive : null,
                  ]}
                >
                  <Text
                    style={[
                      styles.starIcon,
                      rating >= value && styles.starActive,
                    ]}
                  >
                    ★
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.commentContainer}>
            <Text style={styles.commentLabel}>Additional comments:</Text>
            <TextInput
              style={styles.commentInput}
              value={comment}
              onChangeText={setComment}
              multiline
              numberOfLines={4}
              placeholder="Share your feedback"
            />
          </View>

          {trip.weight !== 0 && (
            <View style={styles.commentContainer}>
              <Text style={styles.commentLabel}>Enter Code:</Text>
              <TextInput
                style={styles.commentInput}
                value={code}
                onChangeText={setCode}
                placeholder="Enter Package code"
              />
            </View>
          )}

          <TouchableOpacity
            style={[styles.submitButton, styles.goldenYellow, styles.textWhite]}
            onPress={handleFeedback}
          >
            <Text style={styles.submitButtonText}>Submit Feedback</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Loading Modal */}
      <Modal
        transparent={true}
        animationType="slide"
        visible={loading}
        onRequestClose={() => setLoading(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.loadingText}>Waiting for </Text>
            <Text style={styles.loadingText}>Customer</Text>
            <Text style={styles.loadingText}>To End trip . . .</Text>
          </View>
        </View>
      </Modal>

      <Toast />
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
    paddingVertical: 12,
    backgroundColor: "#FFC000",
  },
  backArrow: {
    padding: 8,
  },
  topBarContent: {
    flex: 1,
    alignItems: "center",
  },
  feedbackContainer: {
    paddingHorizontal: 20,
    marginTop: 30,
    backgroundColor: "#fff",
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
  driverName: {
    fontSize: 18,
    fontWeight: "bold",
  },
  username: {
    fontSize: 16,
    color: "#555",
  },
  ratingContainer: {
    marginBottom: 20,
  },
  ratingLabel: {
    fontSize: 16,
    marginBottom: 10,
  },
  ratingStars: {
    flexDirection: "row",
  },
  star: {
    marginHorizontal: 4,
  },
  starIcon: {
    fontSize: 24,
    color: "#ccc",
  },
  starActive: {
    color: "#FFD700",
  },
  commentContainer: {
    marginBottom: 20,
  },
  commentLabel: {
    fontSize: 16,
    marginBottom: 10,
  },
  commentInput: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 4,
    padding: 10,
    textAlignVertical: "top",
  },
  submitButton: {
    backgroundColor: "#FFC000",
    borderRadius: 50,
    padding: 14,
    width: "100%",
    alignItems: "center",
  },
  goldenYellow: {
    backgroundColor: "#FFC000",
  },
  textWhite: {
    color: "#fff",
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)", // Semi-transparent background
  },
  modalContent: {
    width: 200,
    padding: 20,
    borderRadius: 10,
    backgroundColor: "white",
    alignItems: "center",
  },
  loadingText: {
    fontSize: 18,
    fontWeight: "bold",
    alignSelf: "center",
  },
  loadingText1: {
    fontSize: 12,
    fontWeight: "bold",
  },
});

export default DriverEndTrip;

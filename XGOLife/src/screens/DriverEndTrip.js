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
  const [profileImage, setPic] = useState();
  const [type, setType] = useState();
  const [name, setName] = useState();
  const route = useRoute();
  const [code, setCode] = useState("0");
  const trip = route.params?.trip;
  const tripId = trip.trip_id;
  const [loading, setLoading] = useState(false);
  const [customerState, setCustomerState] = useState(null); // State for loading modal

  useEffect(() => {
    fetchCustDetails();
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
      console.log(error);
    }
  };

  const redirectHome = () => {
    navigation.navigate("DriverNewOrderList", {});
  };
  const redirectInt = (trip) => {
    console.log("yy", trip);
    console.log(tripId);
    navigation.navigate("InTransitTrip", { OntripData: trip });
  };

  const handleRatingPress = (value) => {
    setRating(value);
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
      console.log("Trip status", result);
      return result;
    } catch (error) {
      console.log(error);
    }
  };

  

  const endTrip = async () => {
    console.log("tripcode", trip.delivery_received_confirmation_code);
    
    if(trip.delivery_received_confirmation_code === code){
      try {
        const response = await fetch(
          `${API_URL}/trip//end-trip/driver/${trip.trip_id}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
  
        const result = await response.json();
        console.log("result from end trip function in Customer", result);
      } catch (error) {
        console.error("Error posting feedback:", error);
      }
    }
  };

  const handleFeedback = async () => {
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

    // Show loading modal

    const end = endTrip(); // Assuming this function ends the trip

    if (!end) {
      setLoading(false); // Hide loading modal if ending trip fails
      return;
    } else {
      
    
      
      console.log("Check", customerState);
      while (true) {
        setLoading(true);
        const state = await CheckCustState();
        setCustomerState(state);
      
        if (state && state[0]?.customer_status === "Ended") {
          try {
           
            const FeedbackData = {
              driver_comment: comment,
              customer_stars: rating,
              code: code, // Include code if needed
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
            console.log("result from Comment of driver", result);
      
            if (response.ok) {
              Toast.show({
                text1: "Success",
                text2: result.message,
                type: "success",
                position: "top",
                visibilityTime: 3000,
                autoHide: true,
              });
              redirectHome();
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
          } finally {
            setLoading(false);
          }
          break; // Exit the loop after executing the feedback logic
        }
      
        // Wait for 3 seconds before the next check
        await new Promise(resolve => setTimeout(resolve, 3000));
      }
    }
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
            <Text style={styles.loadingText}>Loading...</Text>
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
  },
});

export default DriverEndTrip;

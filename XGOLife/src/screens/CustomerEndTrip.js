import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Image,
  Modal,
  ActivityIndicator,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Toast from "react-native-toast-message"; // Import Toast
import { API_URL_UPLOADS, API_URL } from "./config";

const CustomerEndTrip = () => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const navigation = useNavigation();
  const route = useRoute(); // Use the useRoute hook to access route params
  const trip = route.params?.trip; // Get trip parameter from route
  const [loading, setLoading] = useState(false);

  if (!trip) {
    return <Text>No trip data available.</Text>; // Handle the case where trip is undefined
  }

  const tripId = trip.trip_id;

  const redirectHome = () => {
    navigation.navigate("Home");
  };

  const handleRatingPress = (value) => {
    setRating(value);
  };

  const endTrip = async () => {
    try {
      const response = await fetch(
        `${API_URL}/trip//end-trip/customer/${trip.trip_id}`,
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

    const end = endTrip();

    if (!end) return;

    try {
      setLoading(true);
      const FeedbackData = {
        customer_comment: comment,
        driver_stars: rating,
      };
      console.log("feedbackdata", FeedbackData);
    
      const response = await fetch(
        `${API_URL}/trip/customerComment/${trip.trip_id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(FeedbackData),
        }
      );
    
      const result = await response.json();
      console.log("result from Comment of Customer", result);
    
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
        redirectHome();
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
      // Set loading to false after a 5-second delay
      setTimeout(() => {
        setLoading(false);
        redirectHome(); // Redirect after the delay
      }, 500);
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
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.topBar}>
          <TouchableOpacity style={styles.backArrow} onPress={redirectHome}>
            <Text>
              <MaterialIcons name="arrow-back" size={24} color="#000" />
            </Text>
          </TouchableOpacity>
          <Text style={styles.title}>End Trip</Text>
          <View style={{ width: 24 }} />
        </View>

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
              {trip.driver.name} {trip.driver.surname}
            </Text>
            <Text style={styles.username}>Driver</Text>
          </View>
        </View>

        <View style={styles.feedbackContainer}>
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

          <TouchableOpacity
            style={[styles.submitButton, styles.goldenYellow, styles.textWhite]}
            onPress={async () => {
              setLoading(true); // Set loading to true
              await handleFeedback(); // Call the feedback handler
              setLoading(false); // Set loading to false after feedback is processed
            }}
          >
            <Text style={styles.submitButtonText}>Submit Feedback</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Loading Modal */}
      <Modal transparent={true} animationType="fade" visible={loading}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <ActivityIndicator size="large" color="#0000ff" />
            <Text style={styles.modalText}>Loading...</Text>
          </View>
        </View>
      </Modal>
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
    backgroundColor: "#FFC000",
    paddingTop: 50,
    paddingBottom: 20,
    marginBottom: 20,
  },
  backArrow: {
    padding: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    flex: 1,
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
    paddingHorizontal: 20,
  },
  profileImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 10,
  },
  nameContainer: {
    flexDirection: "column",
    justifyContent: "center",
  },
  username: {
    fontSize: 16,
    color: "#555",
  },
  tripDetailsTextPro: {
    fontSize: 18,
    fontWeight: "bold",
  },
  starContainer: {
    flexDirection: "row",
  },
  star: {
    fontSize: 18,
    color: "gold",
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
  starActive: {
    color: "#FFD700",
  },
  starIcon: {
    fontSize: 24,
    color: "#ccc",
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
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: 200,
    padding: 20,
    backgroundColor: "white",
    borderRadius: 10,
    alignItems: "center",
  },
  modalText: { 
    marginTop: 10,
    fontSize: 16
  },
});

export default CustomerEndTrip;

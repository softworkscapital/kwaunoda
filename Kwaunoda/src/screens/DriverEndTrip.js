import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Image,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import BottomFooter2 from "./BottomFooter2";
import { API_URL } from "./config";
import Toast from "react-native-toast-message";

const DriverEndTrip = () => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const navigation = useNavigation();
  const route = useRoute();
  const tripId = route.params?.tripId;

  const redirectHome = () => {
    navigation.navigate("DriverNewOrderList");
  };

  const handleRatingPress = (value) => {
    setRating(value);
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

    const User = await AsyncStorage.getItem("userDetails");
    const user = JSON.parse(User);
    const FeedbackData = {
      driver_comment: comment,
      customer_stars: rating,
      status: "Trip Ended",
    };

    try {
      const response = await fetch(`${API_URL}/trip/driverComment/${tripId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(FeedbackData),
      });

      const result = await response.json();

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
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.topBar}>
          <TouchableOpacity style={styles.backArrow} onPress={redirectHome}>
            <MaterialIcons name="arrow-back" size={24} color="#000" />
          </TouchableOpacity>
          <View style={styles.topBarContent}>
            <Text style={styles.title}>Provide Feedback</Text>
          </View>
        </View>

        <View style={styles.feedbackContainer}>
          <View style={styles.profileContainer}>
            <Image
              style={styles.profilePicture}
              source={require("../../assets/profile.jpeg")}
            />
            <View>
              <Text style={styles.driverName}>Driver</Text>
              <Text style={styles.username}>King Godo</Text>
            </View>
          </View>

          <View style={styles.ratingContainer}>
            <Text style={styles.ratingLabel}>Rate your experience:</Text>
            <View style={styles.ratingStars}>
              {[1, 2, 3, 4, 5].map((value) => (
                <TouchableOpacity
                  key={value}
                  onPress={() => handleRatingPress(value)}
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
            onPress={handleFeedback}
          >
            <Text style={styles.submitButtonText}>Submit Feedback</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
      <BottomFooter2 />
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
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 4,
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
});

export default DriverEndTrip;
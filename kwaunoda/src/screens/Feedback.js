import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import BottomFooter from "./BottomFooter";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_URL } from "./config";

const Feedback = () => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");


  const navigation = useNavigation();

  const redirectHome = () => {
    navigation.goBack(); 
  };

  const handleRatingPress = (value) => {
    setRating(value);
  };



  const handleFeedback = async () => {
    const User = await AsyncStorage.getItem("userDetails");
    const storedDriverId = await AsyncStorage.getItem("driver");
    const user = JSON.parse(User);
    const FeedbackData = {
      driver_id: storedDriverId, // Replace with actual driver ID
      driver_comment: comment, // Optional comments
      customer_stars: rating,
      status: "Trip Ended",
    };



    console.log(FeedbackData);
    const APILINK = API_URL;
    try {

    const Trip = await AsyncStorage.getItem("EndTrip");
    const trip = JSON.parse(Trip);
    console.log("iri ziId Renyu", trip[0].trip_id);

      const response = await fetch(`${APILINK}/trip/driverComment/${trip[0].trip_id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(FeedbackData),
      });

      const result = await response.json();
      console.log(result);

      if (response.ok) {
        Alert.alert("Success", result.message);
        redirectHome()
      } else {
        Alert.alert(
          "Error",
          result.message || "Failed to submit delivery details."
        );
      }
      console.log(user);
    } catch (error) {
      console.error("Error posting comment data:", error);
      Alert.alert(
        "Error",
        "An error occurred while submitting your delivery details."
      );
    }
  };



  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={[styles.topBar, styles.goldenYellow, { paddingTop: 35 }]}>
          <TouchableOpacity style={styles.backArrow} onPress={redirectHome}>
            <MaterialIcons name="arrow-back" size={24} color="#000" />
          </TouchableOpacity>

          <View style={styles.topBarContent}>
            <Text style={[styles.title, { color: "#000" }]}>
              Provide Feedback
            </Text>
          </View>
          <TouchableOpacity
            style={styles.editButton}
            onPress={() => setIsEditModalVisible(true)}
          />
        </View>

        <View
          style={[
            styles.feedbackContainer,
            styles.bgWhite,
            { paddingHorizontal: 20, marginTop: 30 },
          ]}
        >
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
            style={[styles.btnFeeedback, styles.goldenYellow, styles.textWhite]}
            onPress={handleFeedback}
          >
            <Text style={styles.submitButtonText}>Submit Feedback</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
      <BottomFooter />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  scrollContent: {
    paddingBottom: 80, // Prevent content from being hidden behind the fixed bottom bar
  },
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  goldenYellow: {
    backgroundColor: "#FFC000",
  },
  backArrow: {
    padding: 8,
  },
  topBarContent: {
    flex: 1,
    alignItems: "center",
  },
  bgWhite: {
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 20,
    marginBottom: 20,
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
    color: "#ccc", // Default color for inactive stars
  },
  starActive: {
    color: "#FFD700", // Color for active stars
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
  textWhite: {
    color: "#fff",
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
  bottomBar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    paddingVertical: 12,
    backgroundColor: "#FFC000",
  },
  bottomBarItem: {
    alignItems: "center",
  },
  bottomBarText: {
    fontSize: 14,
    marginTop: 4,
  },
});

export default Feedback;

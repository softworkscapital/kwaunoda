import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from '@react-native-async-storage/async-storage'; // Import AsyncStorage
import { API_URL } from "./config";
import BottomFooter2 from './BottomFooter2';

const CustomerFeedback = () => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');


  const navigation = useNavigation();

  const redirectHome = () => {
    navigation.navigate("Home");
  };

  const handleRatingPress = (value) => {
    setRating(value);
  };

  const handleCustomerFeedback = async () => {
    const User = await AsyncStorage.getItem("userDetails");
    const user = JSON.parse(User);
    const CustomerFeedbackData = { // Correct variable name
      customer_id: user.id, // Replace with actual driver ID
      customer_comment: comment, // Optional comments
      driver_stars: rating,
      status: "Waiting Driver Rating",  // Optional stars rating
    };
     
      console.log(CustomerFeedbackData)

    const APILINK = API_URL;
    try {
      const tripData = await AsyncStorage.getItem('tripDetails'); 
      const parsedTripData = JSON.parse(tripData);
      console.log(parsedTripData);

      const response = await fetch(`${APILINK}/trip/customerComment${parsedTripData.trip_id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(CustomerFeedbackData),
      });

      const result = await response.json();
      if (response.ok) {
        Alert.alert("Success", result.message)
        redirectHome();
      } else {
        Alert.alert("Error", result.message || "Failed to submit delivery details.");
      }
    } catch (error) {
      console.error("Error posting comment data:", error);
      Alert.alert("Error", "An error occurred while submitting your delivery details.");
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
            <Text style={[styles.title, { color: '#000' }]}>Provide Feedback</Text>
          </View>
        </View>

        <View style={[styles.feedbackContainer, styles.bgWhite, { paddingHorizontal: 20, marginTop: 30 }]}>
          <View style={styles.ratingContainer}>
            <Text style={styles.ratingLabel}>Rate your experience:</Text>
            <View style={styles.ratingStars}>
              {[1, 2, 3, 4, 5].map((value) => (
                <TouchableOpacity
                  key={value}
                  onPress={() => handleRatingPress(value)}
                  style={[styles.star, rating >= value ? styles.starActive : null]}
                >
                  <Text style={[styles.starIcon, rating >= value && styles.starActive]}>★</Text>
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
          <TouchableOpacity style={[styles.submitButton, styles.goldenYellow, styles.textWhite]} onPress={handleCustomerFeedback}>
            <Text style={styles.submitButtonText}>Submit Feedback</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
      <BottomFooter2/>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  scrollContent: {
    paddingBottom: 80, // Prevent content from being hidden behind the fixed bottom bar
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  goldenYellow: {
    backgroundColor: '#FFC000',
  },
  backArrow: {
    padding: 8,
  },
  topBarContent: {
    flex: 1,
    alignItems: 'center',
  },
  bgWhite: {
    backgroundColor: '#fff',
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
    flexDirection: 'row',
  },
  star: {
    marginHorizontal: 4,
  },
  starIcon: {
    fontSize: 24,
    color: '#ccc', // Default color for inactive stars
  },
  starActive: {
    color: '#FFD700', // Color for active stars
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
    borderColor: '#ccc',
    borderRadius: 4,
    padding: 10,
    textAlignVertical: 'top',
  },
  submitButton: {
    backgroundColor: "#FFC000",
    borderRadius: 50,
    padding: 14,
    width: "100%",
    alignItems: "center",
  },
  textWhite: {
    color: '#fff',
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 12,
    backgroundColor: '#FFC000',
  },
  bottomBarItem: {
    alignItems: 'center',
  },
  bottomBarText: {
    fontSize: 14,
    marginTop: 4,
  },
});

export default CustomerFeedback;
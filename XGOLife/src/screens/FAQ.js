import React, { useState } from "react";
import {
  ScrollView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

const FAQ = () => {
  const navigation = useNavigation();
  const [openIndex, setOpenIndex] = useState(null);

  const redirectHome = () => {
    navigation.goBack();
  };

  const toggleAnswer = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const questions = [
    {
      question: "What payment methods are accepted?",
      answer:
        "Kwaunoda accepts various payment methods including credit/debit cards, mobile money, and cash on delivery. You can choose your preferred payment option at checkout.",
    },
    {
      question: "How can I track my order?",
      answer:
        "Once your order is placed, you can track it in real-time through the app. You'll receive updates on the status of your order, including when it's out for delivery and when it arrives.",
    },
    {
      question: "What should I do if I have an issue with my order?",
      answer:
        "If you encounter any issues with your order, you can contact our customer support through the app. We are here to assist you and ensure your experience with Kwaunoda is smooth and satisfactory.",
    },
    {
      question: "Can I cancel or modify my order?",
      answer:
        "Yes, you can cancel or modify your order within a certain time frame after placing it. Please check the app for specific details on how to manage your order, or contact customer support for assistance.",
    },
  ];

  return (
    <View style={styles.container}>
      <View
        style={[
          styles.topBar,
          styles.goldenYellow,
          { paddingTop: 30, marginBottom: 30 },
        ]}
      >
        <TouchableOpacity style={styles.backArrow} onPress={redirectHome}>
          <MaterialIcons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>

        <View style={styles.topBarContent}>
          <Text style={[styles.title, { color: "#000" }]}>
            Frequently Asked Questions
          </Text>
        </View>
        <TouchableOpacity
          style={styles.editButton}
          onPress={() => setIsEditModalVisible(true)}
        >
          {/* <MaterialIcons name="edit" size={24} color="#000" /> */}
        </TouchableOpacity>
      </View>
      <ScrollView style={[styles.container, { paddingHorizontal: 15 }]}>
        {questions.map((item, index) => (
          <View key={index} style={styles.faqItem}>
            <View style={styles.card}>
              <View style={styles.cardHeader}>
                <Text style={styles.question}>{item.question}</Text>
                <TouchableOpacity onPress={() => toggleAnswer(index)}>
                  <MaterialIcons
                    name={
                      openIndex === index
                        ? "keyboard-arrow-up"
                        : "keyboard-arrow-down"
                    }
                    size={24}
                    color="#000"
                  />
                </TouchableOpacity>
              </View>
              {openIndex === index && (
                <View style={styles.answerContainer}>
                  <Text style={styles.answer}>
                    <Text style={styles.boldText}>Answer: </Text>
                    {item.answer}
                  </Text>
                </View>
              )}
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
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
  title: {
    fontSize: 18,
    fontWeight: "bold",
  },
  editButton: {
    padding: 8,
  },
  faqItem: {
    marginBottom: 20,
  },
  card: {
    backgroundColor: "#f0f0f0",
    borderRadius: 8,
    padding: 15,
    marginBottom: 10,
    elevation: 2, // Adds shadow
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  question: {
    fontSize: 18,
    fontWeight: "bold",
  },
  answerContainer: {
    marginTop: 10,
  },
  answer: {
    fontSize: 16,
  },
  boldText: {
    fontWeight: "bold",
  },
});

export default FAQ;

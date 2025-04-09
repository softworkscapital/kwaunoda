import React, { useState, useEffect, useRef } from "react";
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
  SafeAreaView,
  Platform,
  StatusBar,
  Dimensions,
  Animated,
} from "react-native";
import { MaterialIcons, Ionicons } from "@expo/vector-icons";
import { API_URL } from "./config";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Haptics from 'expo-haptics';

const { width } = Dimensions.get('window');

const FindOutChat = ({ navigation, route }) => {
  const [message, setMessage] = useState("");
  const [useid, setUserid] = useState(" ");
  const [chatHistory, setChatHistory] = useState([]);
  const scrollViewRef = useRef();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const tripId = 12;
  const { chatId } = route.params;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const storedIds = await AsyncStorage.getItem("theIds");
        if (storedIds) {
          const parsedIds = JSON.parse(storedIds);
          let acc =
            parsedIds.last_logged_account === "driver"
              ? parsedIds.driver_id
              : parsedIds.customerId;
          setUserid(acc);
        } else {
          Alert.alert("User ID not found", "Please log in again.");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        Alert.alert("Error", "An error occurred while fetching data.");
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const fetchChatMessages = async () => {
      if (!useid) return;

      try {
        const response = await fetch(`http://192.168.170.214:3011/clientservicechat/getchatsbychatid/${chatId}`);
        if (!response.ok) {
          console.error("Network response was not ok:", response.statusText);
          return;
        }

        const result = await response.json();
        if (result) {
          const newMessages = result.sort((a, b) => {
            const dateA = new Date(`${a.date_chat}T${a.time_chat}`);
            const dateB = new Date(`${b.date_chat}T${b.time_chat}`);
            return dateA - dateB;
          });

          setChatHistory((prevHistory) => {
            const existingIds = new Set(prevHistory.map((chat) => chat.customer_admin_chat_id));
            const filteredMessages = newMessages.filter((chat) => !existingIds.has(chat.customer_admin_chat_id));
            return [...prevHistory, ...filteredMessages];
          });
        }
      } catch (error) {
        console.error("Error fetching chat messages:", error);
      }
    };

    fetchChatMessages();
    const intervalId = setInterval(fetchChatMessages, 5000);
    return () => clearInterval(intervalId);
  }, [useid, chatId]);

  useEffect(() => {
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollToEnd({ animated: true });
    }
  }, [chatHistory]);

  const handleSend = async () => {
    if (message.trim()) {
      if (Platform.OS === 'ios') {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      }
      const now = new Date();
      const dateChat = now.toISOString().split("T")[0];
      const timeChat = now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

      const newMessage = {
        date_chat: dateChat,
        time_chat: timeChat,
        trip_id: tripId,
        admin_id: "N/A",
        driver_id: useid,
        conversation_id: chatId,
        message: message.trim(),
        origin: useid,
      };

      try {
        const response = await fetch(`${API_URL}/customer_admin_chats`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newMessage),
        });

        const result = await response.json();
        console.log("Message sent:", result);
        setMessage(""); // Clear input
      } catch (error) {
        console.error("Error posting message:", error);
      }
    }
  };

  const formatTime = (dateStr, timeStr) => {
    const now = new Date();
    const msgDate = new Date(`${dateStr}T${timeStr}`);
    if (now.toDateString() === msgDate.toDateString()) {
      return timeStr.slice(0, 5);
    }
    return `${dateStr.slice(5)} ${timeStr.slice(0, 5)}`;
  };

  const renderMessageTime = (dateStr, timeStr) => {
    return (
      <View style={styles.timeContainer}>
        <Ionicons name="time-outline" size={12} color="#666666" />
        <Text style={styles.timeText}>{formatTime(dateStr, timeStr)}</Text>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => {
              if (Platform.OS === 'ios') {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              }
              navigation.goBack();
            }}
            style={styles.backButton}
          >
            <MaterialIcons name="arrow-back-ios" size={24} color="#002966" />
          </TouchableOpacity>
          <View style={styles.headerContent}>
            <Text style={styles.headerText}>Customer Support</Text>
            <View style={styles.statusContainer}>
              <View style={styles.statusDot} />
              <Text style={styles.subHeaderText}>Online • Usually replies within 5 minutes</Text>
            </View>
          </View>
        </View>

        <ScrollView
          ref={scrollViewRef}
          style={styles.chatContainer}
          contentContainerStyle={styles.chatContent}
          showsVerticalScrollIndicator={false}
        >
          {chatHistory.map((chat) => (
            <View
              key={chat.customer_admin_chat_id}
              style={[
                styles.messageContainer,
                chat.origin === useid ? styles.sentMessage : styles.receivedMessage,
              ]}
            >
              <View style={[
                styles.messageContent,
                chat.origin === useid ? styles.sentMessageContent : styles.receivedMessageContent
              ]}>
                <Text style={[
                  styles.messageText,
                  chat.origin === useid ? styles.sentMessageText : styles.receivedMessageText
                ]}>
                  {chat.message}
                </Text>
                {renderMessageTime(chat.date_chat, chat.time_chat)}
              </View>
              {chat.origin === useid && (
                <View style={styles.messageStatus}>
                  <Ionicons name="checkmark-done" size={16} color="#ffc000" />
                </View>
              )}
            </View>
          ))}
        </ScrollView>

        <View style={styles.inputContainer}>
          <View style={styles.inputWrapper}>
            <TextInput
              style={styles.input}
              placeholder="Type your message..."
              placeholderTextColor="#999"
              value={message}
              onChangeText={setMessage}
              multiline
              maxLength={500}
              returnKeyType="send"
              onSubmitEditing={handleSend}
            />
            <TouchableOpacity
              style={[
                styles.sendButton,
                { backgroundColor: message.trim() ? '#002966' : '#E0E0E0' }
              ]}
              onPress={handleSend}
              disabled={!message.trim()}
            >
              <Ionicons 
                name="send" 
                size={20} 
                color={message.trim() ? '#ffc000' : '#999999'} 
              />
            </TouchableOpacity>
          </View>
        </View>
      </Animated.View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  header: {
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ffc000',
    elevation: 4,
    shadowColor: '#002966',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  headerContent: {
    flex: 1,
    marginLeft: 12,
  },
  headerText: {
    fontSize: 20,
    fontWeight: '700',
    color: '#002966',
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#4CAF50',
    marginRight: 6,
  },
  subHeaderText: {
    fontSize: 13,
    color: '#666666',
  },
  
  backButton: {
    padding: 8,
  },
  chatContainer: {
    flex: 1,
    paddingHorizontal: 16,
  },
  chatContent: {
    paddingVertical: 16,
  },
  messageContainer: {
    marginVertical: 6,
    maxWidth: '80%',
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  messageContainer: {
    marginVertical: 6,
    maxWidth: '80%',
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  sentMessage: {
    alignSelf: 'flex-end', // Align sent messages to the right
  },
  receivedMessage: {
    alignSelf: 'flex-start', // Align received messages to the left
  },
  sentMessageContent: {
    backgroundColor: '#002966',
    borderBottomRightRadius: 4,
    borderRadius: 20,
    padding: 12,
  },
  receivedMessageContent: {
    backgroundColor: '#FFFFFF',
    borderBottomLeftRadius: 4,
    borderWidth: 1,
    borderColor: '#ffc000',
    borderRadius: 20,
    padding: 12,
  },
  messageText: {
    fontSize: 16,
    lineHeight: 22,
  },
  sentMessageText: {
    color: '#FFFFFF',
  },
  receivedMessageText: {
    color: '#002966',
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
  },
  timeText: {
    fontSize: 11,
    color: '#666666',
    marginLeft: 4,
  },
  messageStatus: {
    marginLeft: 4,
    alignSelf: 'flex-end',
  },
  inputContainer: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#ffc000',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  input: {
    flex: 1,
    backgroundColor: '#F8F9FA',
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: 12,
    maxHeight: 100,
    fontSize: 16,
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#ffc000',
  },
  sendButton: {
    width: 45,
    height: 45,
    borderRadius: 23,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
});

export default FindOutChat;
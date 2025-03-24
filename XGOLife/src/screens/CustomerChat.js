import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Animated,
  Keyboard,
  RefreshControl,
  StatusBar,
  Vibration,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { API_URL } from "./config";
import { useNavigation, useRoute } from "@react-navigation/native";
import NetInfo from "@react-native-community/netinfo";

const CustomerChat = () => {
  const [message, setMessage] = useState("");
  const [chatHistory, setChatHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isOnline, setIsOnline] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const fadeAnim = useRef(new Animated.Value(1)).current;
  const flatListRef = useRef(null);
  const navigation = useNavigation();
  const route = useRoute();
  const { tripId, driverId, customerId } = route.params || {};

  // Animation for error message
  const fadeIn = () => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const fadeOut = () => {
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  // Check network connectivity
  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      setIsOnline(state.isConnected);
    });
    return () => unsubscribe();
  }, []);

  const fetchChatMessages = useCallback(async () => {
    console.log(tripId);
    console.log(API_URL);
    try {
      setIsLoading(true);
      const response = await fetch(
        `${API_URL}/customer_driver_chats/customer_driver_chats/${tripId}`
      );
  
      console.log('ahhhhh', response);
      if (!response.ok) throw new Error("Failed to fetch messages");
  
      const result = await response.json();
  
      if (result && result.status === "200" && Array.isArray(result.data)) {
        const sortedMessages = result.data.sort((a, b) => {
          const dateA = new Date(`${a.date_chat} ${a.time_chat}`);
          const dateB = new Date(`${b.date_chat} ${b.time_chat}`);
          return dateA - dateB; // Ascending order
        });
        setChatHistory(sortedMessages);
      }
    } catch (error) {
      setErrorMessage("Failed to load messages");
      setTimeout(() => setErrorMessage(""), 3000);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, [tripId]);
  
  const cleanTime = (time) => time.replace(/\u00A0/g, ' ').trim(); // Remove non-breaking space
  useEffect(() => {
    fetchChatMessages();
    const intervalId = setInterval(fetchChatMessages, 5000);
    return () => clearInterval(intervalId);
  }, [fetchChatMessages]);

  const handleSend = async () => {
    if (!message.trim() || isSending || !isOnline) return;

    Vibration.vibrate(50); // Haptic feedback
    setIsSending(true);

    const now = new Date();
    const newMessage = {
      date_chat: now.toISOString().split("T")[0],
      time_chat: now.toLocaleTimeString(),
      trip_id: tripId,
      driver_id: driverId,
      customerid: customerId,
      message: message.trim(),
      origin: customerId,
      pending: true,
    };

    // Optimistic update
    setChatHistory((prev) => [newMessage, ...prev]);
    setMessage("");

    try {
      const response = await fetch(`https://srv547457.hstgr.cloud:3011/customer_driver_chats`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newMessage),
      });

      if (!response.ok) throw new Error("Failed to send message");

      // Update message status
      setChatHistory((prev) =>
        prev.map((msg) =>
          msg === newMessage ? { ...msg, pending: false } : msg
        )
      );
    } catch (error) {
      setErrorMessage("Failed to send message");
      setTimeout(() => setErrorMessage(""), 3000);
      // Remove failed message
      setChatHistory((prev) => prev.filter((msg) => msg !== newMessage));
    } finally {
      setIsSending(false);
    }
  };

  const renderItem = ({ item }) => (
    <Animated.View
      style={[
        styles.messageContainer,
        item.origin === customerId
          ? styles.customerMessage
          : styles.driverMessage,
        item.pending && styles.pendingMessage,
      ]}
    >
      <Text style={styles.messageText}>{item.message}</Text>
      <View style={styles.messageFooter}>
        <Text style={styles.messageTime}>
          {item.date_chat} {item.time_chat}
        </Text>
        {item.pending && (
          <Ionicons name="time-outline" size={16} color="#666" />
        )}
      </View>
    </Animated.View>
  );

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <StatusBar barStyle="light-content" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Chat - Trip ID: {tripId}</Text>
        {!isOnline && <Text style={styles.offlineText}>Offline Mode</Text>}
      </View>

      {/* Error Message */}
      {errorMessage && (
        <Animated.View style={[styles.errorContainer, { opacity: fadeAnim }]}>
          <Text style={styles.errorText}>{errorMessage}</Text>
        </Animated.View>
      )}





{/* Chat Messages */}
<ScrollView
  ref={flatListRef}
  style={styles.chatContainer}
  contentContainerStyle={styles.chatContent}
  refreshControl={
    <RefreshControl
      refreshing={isRefreshing}
      onRefresh={() => {
        setIsRefreshing(true);
        fetchChatMessages();
      }}
      colors={["#FFD700"]}
    />
  }
>
  {chatHistory
    .slice() // Make a shallow copy to avoid mutating the original array
    .reverse() // Reverse the order to show the latest messages first
    .map((chat, index) => (
      <View
        key={`${chat.date_chat}-${chat.time_chat}-${index}`}
        style={[
          styles.messageContainer,
          chat.origin === driverId ? styles.sentMessage : styles.receivedMessage,
        ]}
      >
        <Text style={styles.messageText}>{chat.message}</Text>
        <Text style={styles.dateText}>{`${chat.date_chat} ${cleanTime(chat.time_chat)}`}</Text>
      </View>
    ))}
</ScrollView>

      {isLoading && (
        <ActivityIndicator style={styles.loader} size="large" color="#FFD700" />
      )}

      {/* Input Area */}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={message}
          onChangeText={setMessage}
          placeholder="Type a message..."
          placeholderTextColor="#999"
          multiline
          maxLength={500}
          editable={!isSending && isOnline}
        />
        <TouchableOpacity
          onPress={handleSend}
          disabled={!message.trim() || isSending || !isOnline}
          style={[
            styles.sendButton,
            (!message.trim() || isSending || !isOnline) &&
              styles.sendButtonDisabled,
          ]}
        >
          <Ionicons
            name={isSending ? "timer-outline" : "send"}
            size={24}
            color="white"
          />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9F9F9",
  },
  header: {
    backgroundColor: "#FFD700",
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  backButton: {
    marginRight: 16,
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    flex: 1,
  },
  offlineText: {
    color: "red",
    fontSize: 12,
    marginLeft: 8,
  },
  errorContainer: {
    backgroundColor: "#FF6B6B",
    padding: 10,
    position: "absolute",
    top: 60,
    left: 20,
    right: 20,
    borderRadius: 8,
    zIndex: 999,
  },
  errorText: {
    color: "white",
    textAlign: "center",
  },
  messageList: {
    padding: 16,
    flexGrow: 1,
  },
  messageContainer: {
    maxWidth: "80%",
    borderRadius: 16,
    padding: 12,
    marginVertical: 4,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1,
  },
  customerMessage: {
    backgroundColor: "#FFD700",
    alignSelf: "flex-end",
    borderBottomRightRadius: 4,
  },
  driverMessage: {
    backgroundColor: "#FFF",
    alignSelf: "flex-start",
    borderBottomLeftRadius: 4,
  },
  pendingMessage: {
    opacity: 0.7,
  },
  messageText: {
    fontSize: 16,
    lineHeight: 22,
  },
  messageFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 4,
  },
  messageTime: {
    fontSize: 12,
    color: "#666",
  },
  inputContainer: {
    flexDirection: "row",
    padding: 8,
    borderTopWidth: 1,
    borderTopColor: "#E0E0E0",
    backgroundColor: "#FFF",
  },
  input: {
    flex: 1,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#E0E0E0",
    padding: 12,
    marginRight: 8,
    maxHeight: 100,
    fontSize: 16,
  },
  sendButton: {
    backgroundColor: "#FFD700",
    borderRadius: 25,
    width: 50,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1,
  },
  sendButtonDisabled: {
    backgroundColor: "#E0E0E0",
  },
  loader: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: [{ translateX: -15 }, { translateY: -15 }],
  },
  chatContainer: {
    flex: 1,
    padding: 10,
  },
  chatContent: {
    paddingBottom: 100,
  },
  messageContainer: {
    marginVertical: 5,
    padding: 10,
    borderRadius: 15,
    maxWidth: '80%',
  },
  sentMessage: {
    backgroundColor: '#b2d600',
    alignSelf: 'flex-start',
  },
  receivedMessage: {
    backgroundColor: '#e0ffe0',
    alignSelf: 'flex-end',
  },

});

export default CustomerChat;

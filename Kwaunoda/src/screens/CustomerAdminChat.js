import React, { useState, useEffect } from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet, ScrollView } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons'; // Import the MaterialIcons for the back arrow
import { API_URL } from "./config";

const CustomerAdminChat = ({ navigation }) => { // Add navigation prop
  const [message, setMessage] = useState('');
  const [chatHistory, setChatHistory] = useState([]);
  const tripId = 12; // Hardcoded trip ID
  const customerid = 4; // Hardcoded customer ID for comparison

  useEffect(() => {
    const fetchChatMessages = async () => {
      try {
        const response = await fetch(`${API_URL}/customer_admin_chats/customer_admin_chats/${tripId}`);
        
        if (!response.ok) {
          console.error('Network response was not ok:', response.statusText);
          return;
        }

        const result = await response.json();
        console.log('Fetched response:', result);

        if (result && result.status === "200" && Array.isArray(result.data)) {
          const sortedMessages = result.data.sort((a, b) => {
            const dateA = new Date(`${a.date_chat} ${a.time_chat}`);
            const dateB = new Date(`${b.date_chat} ${b.time_chat}`);
            return dateA - dateB; // Ascending order
          });
          setChatHistory(sortedMessages);
        } else {
          console.error('Failed to retrieve messages:', result.message || 'No message provided');
        }
      } catch (error) {
        console.error('Error fetching chat messages:', error);
      }
    };

    fetchChatMessages();

    // Set up an interval to fetch messages every 5 seconds
    const intervalId = setInterval(fetchChatMessages, 5000);

    // Cleanup function to clear the interval
    return () => clearInterval(intervalId);
  }, [tripId]);

  const handleSend = async () => {
    if (message.trim()) {
      const now = new Date();
      const dateChat = now.toISOString().split('T')[0]; // Current date
      const timeChat = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }); // Current time with seconds

      const newMessage = {
        date_chat: dateChat,
        time_chat: timeChat,
        trip_id: tripId,
        admin_id: 1, // Hardcoded for demonstration
        customerid: customerid, // Hardcoded customer ID
        message: message.trim(),
        origin: customerid, // Use customerid as origin for sent messages
      };

      try {
        const response = await fetch(`${API_URL}/customer_admin_chats`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(newMessage),
        });

        const result = await response.json();
        console.log('Message sent:', result);

        // Append the new message to the chat history
        setChatHistory(prevHistory => [...prevHistory, newMessage]);
        setMessage(''); // Clear input
      } catch (error) {
        console.error('Error posting message:', error);
      }
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <MaterialIcons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerText}>Let's Chat</Text>
      </View>
      <ScrollView style={styles.chatContainer} contentContainerStyle={styles.chatContent}>
        {chatHistory.map((chat, index) => (
          <View
            key={`${chat.date_chat}-${chat.time_chat}-${index}`} // Ensure a unique key with seconds
            style={[
              styles.messageContainer,
              chat.origin === customerid ? styles.sentMessage : styles.receivedMessage,
            ]}
          >
            <Text style={styles.messageText}>{chat.message}</Text>
            <Text style={styles.dateText}>{`${chat.date_chat} ${chat.time_chat}`}</Text>
          </View>
        ))}
      </ScrollView>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Type a message"
          value={message}
          onChangeText={setMessage}
          onSubmitEditing={handleSend}
          returnKeyType="send"
        />
        <TouchableOpacity style={styles.sendButton} onPress={handleSend}>
          <Text style={styles.buttonText}>➤</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    backgroundColor: 'goldenrod', // Golden yellow background
    paddingVertical: 30, // Increased vertical padding
    flexDirection: 'row', // Align items horizontally
    alignItems: 'center', // Center items vertically
  },
  backButton: {
    paddingLeft: 20

  },
  headerText: {
    fontSize: 20,
    color: '#000', // Black text color
    fontWeight: 'bold',
    flex: 1, // Allow header text to take available space
    textAlign: 'center', // Center align the header text
  },
  chatContainer: {
    flex: 1,
    padding: 10,
  },
  chatContent: {
    paddingBottom: 100, // Prevent overlap with input
  },
  messageContainer: {
    marginVertical: 5,
    padding: 15, // Increased padding for better spacing
    borderRadius: 15,
    maxWidth: '80%', // Limit the width of the message bubble
    overflow: 'hidden', // Prevent the message from overflowing its container
  },
  sentMessage: {
    backgroundColor: '#dcf8c6', // Light #FFC000 for sent messages
    alignSelf: 'flex-end', // Align sent messages to the right
  },
  receivedMessage: {
    backgroundColor: '#fff', // White for received messages
    alignSelf: 'flex-start', // Align received messages to the left
  },
  messageText: {
    fontSize: 16,
    color: '#000', // Set message text color to black
  },
  dateText: {
    fontSize: 12,
    color: '#888',
    marginTop: 5, // Add some space above the date text
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#fff',
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 20,
    padding: 10,
    marginRight: 10,
  },
  sendButton: {
    backgroundColor: 'goldenrod',
    borderRadius: 20,
    padding: 10,
  },
  buttonText: {
    fontSize: 20,
    color: '#fff',
  },
});

export default CustomerAdminChat;
import React, { useState, useEffect, useRef } from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet, ScrollView } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { API_URL } from "./config";

const CustomerAdminChat = ({ navigation }) => {
  const [message, setMessage] = useState('');
  const [chatHistory, setChatHistory] = useState([]);
  const scrollViewRef = useRef();
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
          const newMessages = result.data.sort((a, b) => {
            const dateA = new Date(`${a.date_chat}T${a.time_chat}`);
            const dateB = new Date(`${b.date_chat}T${b.time_chat}`);
            return dateA - dateB; // Ascending order
          });

          // Update chat history only if new messages are fetched
          setChatHistory(prevHistory => {
            const existingIds = new Set(prevHistory.map(chat => chat.customer_admin_chat_id));
            const filteredMessages = newMessages.filter(chat => !existingIds.has(chat.customer_admin_chat_id));
            return [...prevHistory, ...filteredMessages];
          });
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

  useEffect(() => {
    // Automatically scroll to the bottom when chat history updates
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollToEnd({ animated: true });
    }
  }, [chatHistory]);

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
        <Text style={styles.headerText}>Chat with Us</Text>
      </View>
      <ScrollView 
        ref={scrollViewRef}
        style={styles.chatContainer} 
        contentContainerStyle={styles.chatContent}
      >
        {chatHistory.map((chat) => (
          <View
            key={chat.customer_admin_chat_id} // Use unique ID for key
            style={[
              styles.messageContainer,
              chat.origin === '1' ? styles.receivedMessage : styles.sentMessage,
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
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 1,
    paddingTop: 50, 
    paddingVertical: 20,
  },
  backButton: {
    paddingLeft: 5,
  },
  headerText: {
    fontSize: 14,
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
    padding: 15,
    borderRadius: 15,
    maxWidth: '80%',
    overflow: 'hidden',
  },
  sentMessage: {
    backgroundColor: '#dcf8c6', // Light green for sent messages
    alignSelf: 'flex-end',
  },
  receivedMessage: {
    backgroundColor: '#f0f0f0', // Gray for received messages
    borderColor: '#ccc',
    borderWidth: 1,
    alignSelf: 'flex-start',
  },
  messageText: {
    fontSize: 16,
    color: '#000',
  },
  dateText: {
    fontSize: 12,
    color: '#888',
    marginTop: 5,
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
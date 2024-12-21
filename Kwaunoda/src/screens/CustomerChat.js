import React, { useState, useEffect } from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet, ScrollView } from 'react-native';
import { API_URL } from "./config";
import { useNavigation, useRoute } from '@react-navigation/native';

const CustomerChat = () => {
  const [message, setMessage] = useState('');
  const [chatHistory, setChatHistory] = useState([]); // To hold the chat history
  const route = useRoute();
  const { tripId, customerId, driverId } = route.params || {}; // Ensure customerId is correctly destructured

  console.log(driverId);

  const navigation = useNavigation(); // Get navigation object

  useEffect(() => {
    const fetchChatMessages = async () => {
      try {
        const response = await fetch(`${API_URL}/customer_driver_chats/customer_driver_chats/${tripId}`);
        
        if (!response.ok) {
          console.error('Network response was not ok:', response.statusText);
          return;
        }
    
        const result = await response.json();
        // console.log('Fetched response:', result);
    
        if (result && result.status === "200" && Array.isArray(result.data)) {
          const sortedMessages = result.data.sort((a, b) => {
            const dateA = new Date(`${a.date_chat} ${a.time_chat}`);
            const dateB = new Date(`${b.date_chat} ${b.time_chat}`);
            return dateA - dateB; // Ascending order
          });
          setChatHistory(sortedMessages);
          console.log('Chat History:', sortedMessages); // Log the sorted messages
        } else {
          console.error('Failed to retrieve messages:', result.message || 'No message provided');
        }
      } catch (error) {
        console.error('Error fetching chat messages:', error);
      }
    };

    fetchChatMessages();

    const intervalId = setInterval(fetchChatMessages, 1000);

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
        driver_id: driverId, // Hardcoded for demonstration
        customerid: customerId, // Use customerId from route
        message: message.trim(),
        origin: customerId, // Use customerId as origin for sent messages
      };

      

      try {
        const response = await fetch(`${API_URL}/customer_driver_chats`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(newMessage),
        });

        const result = await response.json();
        console.log('Message sent:', result);

        // Append the new message to the chat history
        setChatHistory(prevHistory => {
          const updatedHistory = [...prevHistory, newMessage].sort((a, b) => {
            const dateA = new Date(`${a.date_chat} ${a.time_chat}`);
            const dateB = new Date(`${b.date_chat} ${b.time_chat}`);
            return dateA - dateB; // Sort in ascending order
          });
          return updatedHistory; // Return the updated sorted chat history
        });
        setMessage(''); // Clear input
      } catch (error) {
        console.error('Error posting message:', error);
      }
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.topView}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.chatTitle}>Chat</Text>
      </View>

      <ScrollView style={styles.chatContainer} contentContainerStyle={styles.chatContent}>
        {chatHistory.map((chat, index) => {
          // console.log('Chat Origin:', chat.origin, 'Customer ID:', customerId); // Debugging log

          return (
            <View
              key={`${chat.date_chat}-${chat.time_chat}-${index}`} // Ensure a unique key with seconds
              style={[
                styles.messageContainer,
                chat.origin === customerId ? styles.sentMessage : styles.receivedMessage,
              ]}
            >
              <Text style={styles.messageText}>{chat.message}</Text>
              <Text style={styles.dateText}>{`${chat.date_chat} ${chat.time_chat}`}</Text>
            </View>
          );
        }).reverse()} {/* Reverse the order of rendering */}
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
  topView: {
    height: 60,
    backgroundColor: '#FFC000',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
  },
  backButton: {
    marginRight: 10,
  },
  backButtonText: {
    fontSize: 24,
    color: 'black',
  },
  chatTitle: {
    fontSize: 20,
    color: 'black',
    textAlign: 'center',
    flex: 1, // Allow title to be centered
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
    padding: 10,
    borderRadius: 15,
    maxWidth: '80%', // Limit the width of the message bubble
  },
  sentMessage: {
    backgroundColor: '#b2d600', // Golden yellow-#FFC000 for sent messages
    alignSelf: 'flex-end', // Align sent messages to the right
  },
  receivedMessage: {
    backgroundColor: '#e0ffe0', // Light #FFC000 for received messages
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
    borderColor: '#b2d600', // Golden yellow-#FFC000 for input border
    borderRadius: 20,
    padding: 10,
    marginRight: 10,
  },
  sendButton: {
    backgroundColor: '#b2d600', // Golden yellow-#FFC000 for send button
    borderRadius: 20,
    padding: 10,
  },
  buttonText: {
    fontSize: 20,
    color: '#fff', // White text for button
  },
});

export default CustomerChat;
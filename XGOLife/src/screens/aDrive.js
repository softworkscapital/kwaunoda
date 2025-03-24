import RNFS from 'react-native-fs';

// Function to save an image
const saveImage = async (uri) => {
  const filePath = `${RNFS.DocumentDirectoryPath}/image.jpg`;

  try {
    await RNFS.downloadFile({ fromUrl: uri, toFile: filePath }).promise;
    console.log('Image saved to:', filePath);
    // Store the filePath in AsyncStorage if needed
  } catch (error) {
    console.error('Error saving image:', error);
  }
};


import React, { useState, useEffect } from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet, ScrollView } from 'react-native';
import { API_URL } from "./config";
import { useNavigation, useRoute } from '@react-navigation/native';

const DriverChat = () => {
  const [message, setMessage] = useState('');
  const [chatHistory, setChatHistory] = useState([]);
  const route = useRoute();
  const { tripId, driverId, customerId } = route.params || {};

  const navigation = useNavigation();

  useEffect(() => {
    const fetchChatMessages = async () => {
      try {
        const response = await fetch(`${API_URL}/customer_driver_chats/customer_driver_chats/${tripId}`);
        
        if (!response.ok) {
          console.error('Network response was not ok:', response.statusText);
          return;
        }
    
        const result = await response.json();
    
        if (result && result.status === "200" && Array.isArray(result.data)) {
          const sortedMessages = result.data.sort((a, b) => {
            const dateA = new Date(`${a.date_chat} ${a.time_chat}`);
            const dateB = new Date(`${b.date_chat} ${b.time_chat}`);
            return dateA - dateB;
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

    const intervalId = setInterval(fetchChatMessages, 1000);

    return () => clearInterval(intervalId);
  }, [tripId]);

  const handleSend = async () => {
    if (message.trim()) {
      const now = new Date();
      const dateChat = now.toISOString().split('T')[0];
      const timeChat = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });

      const newMessage = {
        date_chat: dateChat,
        time_chat: timeChat,
        trip_id: tripId,
        driver_id: driverId,
        customerid: customerId,
        message: message.trim(),
        origin: driverId,
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

        setChatHistory(prevHistory => {
          const updatedHistory = [...prevHistory, newMessage].sort((a, b) => {
            const dateA = new Date(`${a.date_chat} ${a.time_chat}`);
            const dateB = new Date(`${b.date_chat} ${b.time_chat}`);
            return dateA - dateB;
          });
          return updatedHistory;
        });
        setMessage('');
      } catch (error) {
        console.error('Error posting message:', error);
      }
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.topView}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Text style={styles.backButtonText}>←</Text> {/* Ensure this is wrapped in Text */}
        </TouchableOpacity>
        <Text style={styles.chatTitle}>Chat</Text>
      </View>

      <ScrollView style={styles.chatContainer} contentContainerStyle={styles.chatContent}>
        {chatHistory.map((chat, index) => (
          <View
            key={`${chat.date_chat}-${chat.time_chat}-${index}`}
            style={[
              styles.messageContainer,
              chat.origin === driverId ? styles.sentMessage : styles.receivedMessage,
            ]}
          >
            <Text style={styles.messageText}>{chat.message}</Text>
            <Text style={styles.dateText}>{`${chat.date_chat} ${chat.time_chat}`}</Text>
          </View>
        )).reverse()}
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
          <Text style={styles.buttonText}>➤</Text> {/* Ensure this is wrapped in Text */}
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
    backgroundColor: 'green',
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
    flex: 1,
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
    alignSelf: 'flex-end',
  },
  receivedMessage: {
    backgroundColor: '#e0ffe0',
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
    borderColor: '#b2d600',
    borderRadius: 20,
    padding: 10,
    marginRight: 10,
  },
  sendButton: {
    backgroundColor: '#b2d600',
    borderRadius: 20,
    padding: 10,
  },
  buttonText: {
    fontSize: 20,
    color: '#fff',
  },
});

export default DriverChat;
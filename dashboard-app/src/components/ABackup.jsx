import React, { useState, useEffect } from 'react';
import './CustomerAdmin.css'; // Importing CSS for styles
import { API_URL } from './config';


const CustomerAdminChat = () => {
  const [message, setMessage] = useState('');
  const [chatHistory, setChatHistory] = useState([]);
 
  useEffect(() => {
    // const fetchChatMessages = async () => {
    //   try {
    //     const response = await fetch(`${API_URL}/customer_admin_chats/customer_admin_chats/${tripId}`);
        
    //     if (!response.ok) {
    //       console.error('Network response was not ok:', response.statusText);
    //       return;
    //     }

    //     const result = await response.json();
    //     console.log('Fetched response:', result);

    //     if (result && result.status === "200" && Array.isArray(result.data)) {
    //       const sortedMessages = result.data.sort((a, b) => {
    //         const dateA = new Date(`${a.date_chat} ${a.time_chat}`);
    //         const dateB = new Date(`${b.date_chat} ${b.time_chat}`);
    //         return dateA - dateB; // Ascending order
    //       });
    //       setChatHistory(sortedMessages);
    //     } else {
    //       console.error('Failed to retrieve messages:', result.message || 'No message provided');
    //     }
    //   } catch (error) {
    //     console.error('Error fetching chat messages:', error);
    //   }
    // };
    const fetchChatMessages = async () => {
      try {
        const response = await fetch(`${API_URL}/customeradminchat/`);
        
        if (!response.ok) {
          console.error('Network response was not ok:', response.statusText);
          return;
        }

        const result = await response.json();
        console.log('Fetched response:', result);

        // if (result && result.status === "200" && Array.isArray(result.data)) {
        //   const sortedMessages = result.data.sort((a, b) => {
        //     const dateA = new Date(`${a.date_chat} ${a.time_chat}`);
        //     const dateB = new Date(`${b.date_chat} ${b.time_chat}`);
        //     return dateA - dateB; // Ascending order
        //   });
        //   setChatHistory(sortedMessages);
        // } else {
        //   console.error('Failed to retrieve messages:', result.message || 'No message provided');
        // }
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
    <div className="container">
      <div className="chat-container">
        {chatHistory.map((chat, index) => (
          <div
            key={`${chat.date_chat}-${chat.time_chat}-${index}`} // Ensure a unique key with seconds
            className={`message-container ${chat.origin === customerid ? 'sent-message' : 'received-message'}`}
          >
            <p className="message-text">{chat.message}</p>
            <p className="date-text">{`${chat.date_chat} ${chat.time_chat}`}</p>
          </div>
        ))}
      </div>
      <div className="input-container">
        <input
          type="text"
          className="input"
          placeholder="Type a message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSend()}
        />
        <button className="send-button" onClick={handleSend}>
          ➤
        </button>
      </div>
    </div>
  );
};

export default CustomerAdminChat;
import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom'; // Import useParams to get the trip ID from the URL
import './CustomerAdmin.css'; // Importing CSS for styles
import { API_URL } from './config';

const CustomerAdminChat = () => {
  const { tripId } = useParams(); // Get tripId from URL parameters
  const [message, setMessage] = useState('');
  const [chatHistory, setChatHistory] = useState([]);
  const customerid = 4; // Hardcoded customer ID for comparison
  const driverId = 4; // Hardcoded driver ID for display
  const endOfChatRef = useRef(null); // Ref for scroll to bottom

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
            return a.customer_admin_chat_id - b.customer_admin_chat_id; // Sort in ascending order based on ID
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

    const intervalId = setInterval(fetchChatMessages, 5000);
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
        admin_id: 1,
        customerid: customerid,
        message: message.trim(),
        origin: 1, 
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

        setChatHistory(prevHistory => [...prevHistory, newMessage]);
        setMessage('');
      } catch (error) {
        console.error('Error posting message:', error);
      }
    }
  };

  useEffect(() => {
    // Scroll to the last message when chatHistory changes
    if (endOfChatRef.current) {
      endOfChatRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatHistory]);

  return (
    <div className="chat-container">
      <header className="chat-header">
        <h2>Driver ID: {driverId}</h2>
      </header>
      <div className="chat-content">
        {chatHistory.map((chat, index) => (
          <div
            key={`${chat.date_chat}-${chat.time_chat}-${index}`}
            className={`message-container ${chat.origin === '1' ? 'sent-message' : 'received-message'}`}
          >
            <p className="message-text">{chat.message}</p>
            <p className="date-text">{`${chat.date_chat} ${chat.time_chat}`}</p>
          </div>
        ))}
        <div ref={endOfChatRef} /> {/* Empty div to scroll to */}
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
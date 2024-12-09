import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";import './ChatMessages.css'; // Importing CSS for styles
import { API_URL } from './config';

const ChatHome = () => {
  const [chatHistory, setChatHistory] = useState([]);
  const navigate = useNavigate(); // Initialize useNavigate

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await fetch(`${API_URL}/customer_admin_chats/`);
        if (!response.ok) throw new Error('Network response was not ok');
        
        const result = await response.json();
        console.log('Fetched response:', result);
        
        if (Array.isArray(result)) {
          setChatHistory(result);
        } else {
          console.error('Unexpected data structure:', result);
        }
      } catch (error) {
        console.error('Error fetching chat messages:', error);
      }
    };

    fetchMessages();
    const intervalId = setInterval(fetchMessages, 5000);
    return () => clearInterval(intervalId);
  }, []);

  const handleCardClick = (tripId) => {
    // Navigate to the CustomerAdminChat page with the trip ID
    navigate(`/chatNow/${tripId}`); // Use navigate
  };

  // Group messages by trip_id
  const groupedMessages = chatHistory.reduce((acc, message) => {
    const { trip_id, origin, message: msg } = message;
    if (!acc[trip_id]) {
      acc[trip_id] = { lastMessage: null };
    }
    
    if (origin === "4") {
      acc[trip_id].lastMessage = msg;
    }
    
    return acc;
  }, {});

  return (
    <div className="chat-container">
<h2>
  <div
    style={{
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      marginBottom: "20px"
    }}
  >
    <button
      style={{
        background: "none",
        border: "none",
        cursor: "pointer",
        color: "#FFD700", // Golden color for the icon
        fontSize: "24px",
        marginRight: "10px", // Space between button and title
      }}
      onClick={() => navigate(-1)} // Navigate back to the previous page
    >
      <FontAwesomeIcon icon={faArrowLeft} />
    </button>
    <span style={{ flexGrow: 1, textAlign: 'center', fontSize: '45px' }}>Chat Messages</span>
  </div>
</h2>
      <div className="chat-cards">
        {Object.entries(groupedMessages).length > 0 ? (
          Object.entries(groupedMessages).map(([tripId, { lastMessage }]) => (
            <div 
              key={tripId} 
              className="chat-card" 
              onClick={() => handleCardClick(tripId)} // Handle card click
            >
              <div className="card-body">
                <h3 className="chat-title">Trip ID: {tripId}</h3>
                {lastMessage ? (
                  <p className="chat-text">Last Message from Driver: {lastMessage}</p>
                ) : (
                  <p className="chat-text">No messages from the driver.</p>
                )}
              </div>
            </div>
          ))
        ) : (
          <p>No messages available.</p>
        )}
      </div>
    </div>
  );
};

export default ChatHome;
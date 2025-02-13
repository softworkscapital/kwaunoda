import React, { useState, useEffect } from "react";
import { API_URL } from "./config"; // Ensure API_URL is imported
import { useNavigate } from "react-router-dom"; // Import useNavigate for navigation
import './TripCards.css'; // Import the CSS for styling
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar as solidStar } from '@fortawesome/free-solid-svg-icons';
import { faStar as regularStar } from '@fortawesome/free-regular-svg-icons';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons'; // Import the back arrow icon

const Feedback = () => {
  const APILINK = API_URL;
  const [feedbackData, setFeedbackData] = useState([]);
  const navigate = useNavigate(); // Initialize useNavigate

  const getFeedback = async () => {
    try {
      const response = await fetch(`${APILINK}/trip/getlasttwentyfeedback`);
      const data = await response.json();
      console.log(data);
      setFeedbackData(data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getFeedback();
    const interval = setInterval(() => {
      getFeedback();
    }, 7000);
    return () => clearInterval(interval); // Cleanup on unmount
  }, []);

  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <FontAwesomeIcon
          key={i}
          icon={i <= rating ? solidStar : regularStar}
          style={{ color: '#FFD700', marginRight: '4px', fontSize: '20px' }} // Adjust color and size as needed
        />
      );
    }
    return stars;
  };

  return (
    <div className="hearder-feed">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
        <button
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            color: '#FFD700', // Golden color for the icon
            fontSize: '24px',
            marginRight: '10px' // Space between button and title
          }}
          onClick={() => navigate('/')} // Navigate back to home
        >
          <FontAwesomeIcon icon={faArrowLeft} />
        </button>
        <h1 style={{ margin: '0 auto', textAlign: 'center', flexGrow: 1 }}>Feedbacks</h1>
      </div>
      <div className="trip-cards-container">
        {feedbackData.length > 0 ? (
          feedbackData.map((trip) => (
            <div key={trip.trip_id} className="trip-card">
              <h3>Trip ID: {trip.trip_id}  ({trip.status})</h3>
              
              <div className="comments-container">
                <p><strong>Customer Comment:</strong></p>
                <div className="comment-card">
                  <p>{trip.customer_comment || 'No comments'}</p>
                </div>
                
                <p><strong>Driver Comment:</strong></p>
                <div className="comment-card">
                  <p>{trip.driver_comment || 'No comments'}</p>
                </div>
              </div>

              <div className="stars-container">
                <p><strong>Driver Stars:</strong> {trip.driver_id || 'N/A'} ({renderStars(trip.driver_stars)}) </p>
                <p><strong>Customer Stars:</strong> {trip.cust_id || 'N/A'} ({renderStars(trip.customer_stars !== null ? trip.customer_stars : 0)})</p>
              </div>
            </div>
          ))
        ) : (
          <p>No feedback available.</p>
        )}
      </div>
    </div>
  );
};

export default Feedback;
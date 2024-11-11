import React, { useState } from "react";
import "../css/SearchPage.css"; // Import the CSS file
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import { API_URL } from './config'; // Ensure this is the correct import

function SearchTrip() {
  const [searchTerm, setSearchTerm] = useState("");
  const [trip, setTrip] = useState(null);
  const [chat, setChat] = useState(null);

  const APILINK = API_URL;

  const fetchTripData = async (tripId) => {
    console.log("honaiwo",tripId)
    try {
      const response = await fetch(`${APILINK}/trip/${tripId}`);
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
      const data = await response.json();
      console.log("Trip data:", data);
      return data; // Return the fetched data
    } catch (error) {
      console.error('Failed to fetch trip data:', error);
      throw error; // Rethrow or handle it as needed
    }
  };

  const fetchChatData = async (tripId) => {
    try {
      const response = await fetch(`${APILINK}/customer_driver_chats/customer_driver_chats/${tripId}`);
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
      const data = await response.json();
      console.log("Chat data:", data);
      return data; // Return the fetched data
    } catch (error) {
      console.error('Failed to fetch chat data:', error);
      throw error; // Rethrow or handle it as needed
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();

    const tripData = await fetchTripData(searchTerm);
    const chatData = await fetchChatData(searchTerm);
    
    setTrip(tripData.length > 0 ? tripData[0] : null);
    setChat(chatData.length > 0 ? chatData[0] : null);
  };

  return (
    <div className="min-h-screen">
      <div className="container">
        <h1>Search Here</h1>
        <form onSubmit={handleSearch} className="mb-8">
          <div className="flex gap-2">
            <input
              type="text"
              name="search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search for Trip ID..."
            />
            <button type="submit">
              <FontAwesomeIcon icon={faMagnifyingGlass} style={{ color: "#ffffff" }} />
            </button>
          </div>
        </form>

        {trip && ( 
          <div className="card">
            <h2>Trip Information</h2>
            <div className="scrollable">
              <p><strong>Trip ID:</strong> {trip.trip_id || 'N/A'}</p>
              <p><strong>Customer ID:</strong> {trip.cust_id || 'N/A'}</p>
              <p><strong>Driver ID:</strong> {trip.driver_id || 'N/A'}</p>
              <p><strong>Origin Location:</strong> {trip.origin_location || 'N/A'}</p>
              <p><strong>Destination Location:</strong> {trip.dest_location || 'N/A'}</p>
              <p><strong>Order Start DateTime:</strong> {trip.order_start_datetime ? new Date(trip.order_start_datetime).toLocaleString() : 'N/A'}</p>
              <p><strong>Order End DateTime:</strong> {trip.order_end_datetime ? new Date(trip.order_end_datetime).toLocaleString() : 'N/A'}</p>
              <p><strong>Status:</strong> {trip.status || 'N/A'}</p>
              <p><strong>Distance:</strong> {trip.distance || 'N/A'} km</p>
              <p><strong>Weight:</strong> {trip.weight || 'N/A'} kg</p>
              <p><strong>Delivery Cost Proposed:</strong> {trip.delivery_cost_proposed || 'N/A'} {trip.currency_code || ''}</p>
              <p><strong>Accepted Cost:</strong> {trip.accepted_cost || 'N/A'} {trip.currency_code || ''}</p>
              <p><strong>Customer Comment:</strong> {trip.customer_comment || 'N/A'}</p>
              <p><strong>Driver Comment:</strong> {trip.driver_comment || 'N/A'}</p>
              <p><strong>Driver Stars:</strong> {trip.driver_stars || 'N/A'}</p>
              <p><strong>Customer Stars:</strong> {trip.customer_stars || 'N/A'}</p>
              <p><strong>Delivery Notes:</strong> {trip.delivery_notes || 'N/A'}</p>
              <p><strong>Payment Type:</strong> {trip.payment_type || 'N/A'}</p>
              <p><strong>Paying When:</strong> {trip.paying_when || 'N/A'}</p>
              <h3>Package Images:</h3>
              <ul>
                {trip.package_image1 && <li>Image 1: <img src={trip.package_image1} alt="Package 1" /></li>}
                {trip.package_image2 && <li>Image 2: <img src={trip.package_image2} alt="Package 2" /></li>}
                {trip.package_image3 && <li>Image 3: <img src={trip.package_image3} alt="Package 3" /></li>}
              </ul>
            </div>
          </div>
        )}

        {trip === null && <div>No results found</div>} 

        {chat && (
          <div className="card">
            <h2>Chat Information</h2>
            <div className="scrollable">
              <p><strong>Trip ID:</strong> {chat.trip_id || 'N/A'}</p>
              <p><strong>Customer ID:</strong> {chat.cust_id || 'N/A'}</p>
              <p><strong>Driver ID:</strong> {chat.driver_id || 'N/A'}</p>
              <p><strong>Chat Messages:</strong> {chat.messages && chat.messages.length > 0 ? chat.messages.join(', ') : 'No messages'}</p>
              <p><strong>Delivery Contact Details:</strong> {chat.delivery_contact_details || 'N/A'}</p>
              <p><strong>Delivery Details:</strong> {chat.deliveray_details || 'N/A'}</p>
              <p><strong>Status:</strong> {chat.status || 'N/A'}</p>
            </div>
          </div>
        )}

        {chat === null && <div>No chat results found</div>} 
      </div>
    </div>
  );
}

export default SearchTrip;
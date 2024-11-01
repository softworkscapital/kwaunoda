import React, { useState, useEffect } from "react";
import { API_URL } from '../config';
import "../SearchPage.css";

const PendingReg = () => {
  const [pendingVerifications, setPendingVerifications] = useState([]); // Change to an array
  
  
  const APILINK = API_URL;

  const fetchUserData = async (status) => {
    try {
      const response = await fetch(`${APILINK}/driver/driver_status/${status}`);
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
      const data = await response.json();
      console.log("All data:", data);
      return data; // Return the fetched data
    } catch (error) {
      console.error('Failed to fetch user data:', error);
      throw error; // Rethrow or handle it as needed
    }
  };

  useEffect(() => {
    handleSearch();
    const interval = setInterval(() => {
      handleSearch(); // Call handleSearch every 7 seconds
    }, 7000);
  
    return () => clearInterval(interval);
  }, []);

  const handleSearch = async () => {
    try {
      const status = 'Pending';
      const pending = await fetchUserData(status);
      setPendingVerifications(pending); // Set the fetched data directly
    } catch (error) {
      console.error('Error in handleSearch:', error);
      setPendingVerifications([]); // Reset to empty on error
    }
  };

  const verifyUser = async (driverId) => {
    try {
      const response = await fetch(`${APILINK}/driver/update_status/${driverId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ membershipstatus: "Verified" }), // Correctly formatted
      });
  
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
  
      console.log(`User ${driverId} verified successfully.`);
      handleSearch(); // Refresh the list after verification
    } catch (error) {
      console.error('Failed to verify user:', error);
    }
  };

  return (
    <div className="min-h-screen">
      <div className="container">
        <h1>Verify</h1>
        
        {pendingVerifications.length > 0 ? (
          <div className="card-container">
            {pendingVerifications.map((verification) => (
              <div key={verification.driver_id} className="card">
                <h3>Pending Verification</h3>
                <h2>User Information</h2>
                <p><strong>User ID:</strong> {verification.driver_id}</p>
                <p><strong>Username:</strong> {verification.username}</p>
                <p><strong>Email:</strong> {verification.email}</p>
                <p><strong>Phone:</strong> {verification.phone}</p>
                <p><strong>Role:</strong> {verification.account_type}</p>
                <p><strong>Account Category:</strong> {verification.membershipstatus}</p>
                <p><strong>Plate:</strong> {verification.plate}</p>
                <p><strong>ID Number:</strong> {verification.idnumber}</p>
                <p><strong>Signed On:</strong> {new Date(verification.signed_on).toLocaleDateString()}</p>
                <p><strong>Address:</strong> {verification.address || 'N/A'}</p>
                <p><strong>City:</strong> {verification.city || 'N/A'}</p>
                <p><strong>Country:</strong> {verification.country || 'N/A'}</p>
                <button 
                  className="verify-button" 
                  onClick={() => verifyUser(verification.driver_id)}>
                  Verify
                </button>
              </div>
            ))}
          </div>
        ) : (
          <p>No pending verifications found.</p>
        )}

      </div>
    </div>
  );
};

export default PendingReg;
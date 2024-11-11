import React, { useState, useEffect } from "react";
import { API_URL } from '../config';
import "../../components/SearchPage.css";

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
      const status = 'Pending Verification';
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
      }else{

        console.log("kwaDriver", response);
        const result = await fetch(`${APILINK}/users/update_status/${driverId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ status: "Verified" }), // Correctly formatted
        });


        if(!result.ok){
          throw new Error(`Error: ${result.status}`);
        }
        console.log("kwaUser", result);

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

    <div className="info-row">
      <strong>User ID:</strong>
      <div>{verification.driver_id}</div>
    </div>
    <div className="info-row">
      <strong>Username:</strong>
      <div>{verification.username}</div>
    </div>
    <div className="info-row">
      <strong>Email:</strong>
      <div>{verification.email}</div>
    </div>
    <div className="info-row">
      <strong>Phone:</strong>
      <div>{verification.phone}</div>
    </div>
    <div className="info-row">
      <strong>Role:</strong>
      <div>{verification.account_type}</div>
    </div>
    <div className="info-row">
      <strong>Account Category:</strong>
      <div>{verification.membershipstatus}</div>
    </div>
    <div className="info-row">
      <strong>Plate:</strong>
      <div>{verification.plate}</div>
    </div>
    <div className="info-row">
      <strong>ID Number:</strong>
      <div>{verification.idnumber}</div>
    </div>
    <div className="info-row">
      <strong>Signed On:</strong>
      <div>{new Date(verification.signed_on).toLocaleDateString() || 'N/A'}</div>
    </div>
    <div className="info-row">
      <strong>Address:</strong>
      <div>{verification.address || 'N/A'}</div>
    </div>
    <div className="info-row">
      <strong>House Number and Street Name:</strong>
      <div>{verification.house_number_and_street_name || 'N/A'}</div>
    </div>
    <div className="info-row">
      <strong>City:</strong>
      <div>{verification.city || 'N/A'}</div>
    </div>
    <div className="info-row">
      <strong>Suburb:</strong>
      <div>{verification.surbub || 'N/A'}</div>
    </div>
    <div className="info-row">
      <strong>Country:</strong>
      <div>{verification.country || 'N/A'}</div>
    </div>
    <div className="info-row">
      <strong>Date of Birth:</strong>
      <div>{new Date(verification.dob).toLocaleDateString() || 'N/A'}</div>
    </div>
    <div className="info-row">
      <strong>Employer:</strong>
      <div>{verification.employer || 'N/A'}</div>
    </div>
    <div className="info-row">
      <strong>Work Industry:</strong>
      <div>{verification.workindustry || 'N/A'}</div>
    </div>
    <div className="info-row">
      <strong>Work Address:</strong>
      <div>{verification.workaddress || 'N/A'}</div>
    </div>
    <div className="info-row">
      <strong>Work Phone 1:</strong>
      <div>{verification.workphone || 'N/A'}</div>
    </div>
    <div className="info-row">
      <strong>Work Phone 2:</strong>
      <div>{verification.workphone2 || 'N/A'}</div>
    </div>
    <div className="info-row">
      <strong>Next of Kin 1 Name:</strong>
      <div>{verification.nok1name || 'N/A'}</div>
    </div>
    <div className="info-row">
      <strong>Next of Kin 1 Surname:</strong>
      <div>{verification.nok1surname || 'N/A'}</div>
    </div>
    <div className="info-row">
      <strong>Next of Kin 1 Relationship:</strong>
      <div>{verification.nok1relationship || 'N/A'}</div>
    </div>
    <div className="info-row">
      <strong>Next of Kin 1 Phone:</strong>
      <div>{verification.nok1phone || 'N/A'}</div>
    </div>
    <div className="info-row">
      <strong>Next of Kin 2 Name:</strong>
      <div>{verification.nok2name || 'N/A'}</div>
    </div>
    <div className="info-row">
      <strong>Next of Kin 2 Surname:</strong>
      <div>{verification.nok2surname || 'N/A'}</div>
    </div>
    <div className="info-row">
      <strong>Next of Kin 2 Relationship:</strong>
      <div>{verification.nok2relationship || 'N/A'}</div>
    </div>
    <div className="info-row">
      <strong>Next of Kin 2 Phone:</strong>
      <div>{verification.nok2phone || 'N/A'}</div>
    </div>
    <div className="info-row">
      <strong>Rating:</strong>
      <div>{verification.rating || 'N/A'}</div>
    </div>
    <div className="info-row">
      <strong>Credit Bar Rule Exception:</strong>
      <div>{verification.credit_bar_rule_exception || 'N/A'}</div>
    </div>
    <div className="info-row">
      <strong>Cost Price:</strong>
      <div>{verification.cost_price || '0'}</div>
    </div>
    <div className="info-row">
      <strong>Selling Price:</strong>
      <div>{verification.selling_price || '0'}</div>
    </div>
    <div className="info-row">
      <strong>Payment Style:</strong>
      <div>{verification.payment_style || 'N/A'}</div>
    </div>

    <div className="info-row">
      <strong>Profile Picture:</strong>
      <div>
        {verification.profilePic ? (
          <img src={verification.profilePic} alt="Profile" style={{ width: '100px', height: 'auto' }} />
        ) : 'No Profile Picture'}
      </div>
    </div>

    <div className="info-row">
      <strong>Driver License Image:</strong>
      <div>
        {verification.driver_license_image ? (
          <img src={verification.driver_license_image} alt="Driver License" style={{ width: '100px', height: 'auto' }} />
        ) : 'No Driver License Image'}
      </div>
    </div>

    <div className="info-row">
      <strong>ID Image:</strong>
      <div>
        {verification.id_image ? (
          <img src={verification.id_image} alt="ID" style={{ width: '100px', height: 'auto' }} />
        ) : 'No ID Image'}
      </div>
    </div>

    <div className="info-row">
      <strong>Vehicle License Image:</strong>
      <div>
        {verification.vehicle_license_image ? (
          <img src={verification.vehicle_license_image} alt="Vehicle License" style={{ width: '100px', height: 'auto' }} />
        ) : 'No Vehicle License Image'}
      </div>
    </div>

    <div className="info-row">
      <strong>Number Plate Image:</strong>
      <div>
        {verification.number_plate_image ? (
          <img src={verification.number_plate_image} alt="Number Plate" style={{ width: '100px', height: 'auto' }} />
        ) : 'No Number Plate Image'}
      </div>
    </div>

    <div className="info-row">
      <strong>Latitude Coordinates:</strong>
      <div>{verification.lat_cordinates}</div>
    </div>
    <div className="info-row">
      <strong>Longitude Coordinates:</strong>
      <div>{verification.long_cordinates}</div>
    </div>
    <div className="info-row">
      <strong>Password:</strong>
      <div>{verification.password || 'N/A'}</div>
    </div>


    {/* <button 
      className="verify-button" 
      onClick={{}}>
      Missing Information
    </button>

    <button 
      className="verify-button" 
      onClick={{}}>
      Decline
    </button> */}

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
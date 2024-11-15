import React, { useState, useEffect } from "react";
import Modal from 'react-modal';
import { API_URL } from '../config';
import "../../components/SearchPage.css";

const PendingReg = () => {
  const [pendingVerifications, setPendingVerifications] = useState([]);
  const APILINK = API_URL;
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState('');

  useEffect(() => {
    Modal.setAppElement('.min-h-screen'); // Set app element here
    handleSearch();
    const interval = setInterval(handleSearch, 7000);
  
    return () => clearInterval(interval);
  }, []);

  const openModal = (image) => {
    if (image) {
      setSelectedImage(image);
      setModalIsOpen(true);
    }
  };

  const closeModal = () => {
    setModalIsOpen(false);
    setSelectedImage('');
  };

  const fetchUserData = async (status) => {
    try {
      const response = await fetch(`${APILINK}/driver/driver_status/${status}`);
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
      const data = await response.json();
      console.log("All data:", data);
      return data;
    } catch (error) {
      console.error('Failed to fetch user data:', error);
      throw error;
    }
  };

  const handleSearch = async () => {
    try {
      const status = 'Pending Verification';
      const pending = await fetchUserData(status);
      setPendingVerifications(pending);
    } catch (error) {
      console.error('Error in handleSearch:', error);
      setPendingVerifications([]);
    }
  };

  const verifyUser = async (driverId) => {
    try {
      const response = await fetch(`${APILINK}/driver/update_status/${driverId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ membershipstatus: "Verified" }),
      });
  
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      } else {
        console.log("kwaDriver", response);
        const result = await fetch(`${APILINK}/users/update_status/${driverId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ status: "Verified" }),
        });

        if (!result.ok) {
          throw new Error(`Error: ${result.status}`);
        }
        console.log("kwaUser", result);
      }
  
      console.log(`User ${driverId} verified successfully.`);
      handleSearch();
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
                <div className="image-preview-container">
                  {verification.profilePic && (
                    <img 
                      src={(`${APILINK}.${verification.profilePic}`)} 
                      alt="Profile" 
                      onClick={() => openModal(verification.profilePic)} 
                      style={{ width: '100px', height: 'auto', cursor: 'pointer', marginRight: '10px' }} 
                    />
                  )}
                  {verification.driver_license_image && (
                    <img 
                      src={verification.driver_license_image} 
                      alt="Driver License" 
                      onClick={() => openModal(verification.driver_license_image)} 
                      style={{ width: '100px', height: 'auto', cursor: 'pointer', marginRight: '10px' }} 
                    />
                  )}
                  {verification.id_image && (
                    <img 
                      src={verification.id_image} 
                      alt="ID" 
                      onClick={() => openModal(verification.id_image)} 
                      style={{ width: '100px', height: 'auto', cursor: 'pointer', marginRight: '10px' }} 
                    />
                  )}
                  {verification.vehicle_license_image && (
                    <img 
                      src={verification.vehicle_license_image} 
                      alt="Vehicle License" 
                      onClick={() => openModal(verification.vehicle_license_image)} 
                      style={{ width: '100px', height: 'auto', cursor: 'pointer', marginRight: '10px' }} 
                    />
                  )}
                  {verification.number_plate_image && (
                    <img 
                      src={verification.number_plate_image} 
                      alt="Number Plate" 
                      onClick={() => openModal(verification.number_plate_image)} 
                      style={{ width: '100px', height: 'auto', cursor: 'pointer', marginRight: '10px' }} 
                    />
                  )}
                </div>

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

        <Modal 
          isOpen={modalIsOpen} 
          onRequestClose={closeModal} 
          contentLabel="Image Preview"
          style={{ overlay: { zIndex: 1000 }, content: { padding: '0', border: 'none' } }}
        >
          <img src={selectedImage} alt="Preview" style={{ width: '100%', height: 'auto' }} />
          <button onClick={closeModal} style={{ position: 'absolute', top: '10px', right: '10px', background: 'red', color: 'white', border: 'none', cursor: 'pointer' }}>
            Close
          </button>
        </Modal>
      </div>
    </div>
  );
};

export default PendingReg;
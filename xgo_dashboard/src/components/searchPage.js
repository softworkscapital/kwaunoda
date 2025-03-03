import React, { useState } from "react";
import "../css/SearchPage.css"; // Import the CSS file
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { API_URL, API_URL_UPLOADS } from "./config"; // Ensure this is the correct import

function SearchPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [user, setUser] = useState(null);
  const [customer, setCustomer] = useState(null);
  const [driver, setDriver] = useState(null);
  const [topUpList, setTopUpList] = useState([]);

  const APILINK = API_URL;
  const API_URL_UPLOADSS = API_URL_UPLOADS;

  const fetchDriver = async (userId) => {
    try {
      const driverResult = await fetch(`${APILINK}/driver/${userId}`);
      if (!driverResult.ok) {
        throw new Error(`Error: ${driverResult.status}`);
      }
      const driverData = await driverResult.json();
      console.log("Drivers Here", driverData);
      return driverData; // Return the fetched data
    } catch (error) {
      console.error("Failed to fetch driver data:", error);
      throw error; // Rethrow or handle it as needed
    }
  };

  const fetchCustomer = async (userId) => {
    try {
      const customerResult = await fetch(
        `${APILINK}/customerdetails/${userId}`
      );
      if (!customerResult.ok) {
        throw new Error(`Error: ${customerResult.status}`);
      }
      const customerData = await customerResult.json();
      console.log("Customers Here", customerData);
      return customerData; // Return the fetched data
    } catch (error) {
      console.error("Failed to fetch customer data:", error);
      throw error; // Rethrow or handle it as needed
    }
  };

  const fetchUserData = async (userId) => {
    try {
      const response = await fetch(`${APILINK}/users/${userId}`);
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
      const data = await response.json();
      console.log("User data:", data);
      return data; // Return the fetched data
    } catch (error) {
      console.error("Failed to fetch user data:", error);
      throw error; // Rethrow or handle it as needed
    }
  };

  // universal
  const verifyUser = async (driverId, status) => {
    try {
      let change = status;
      const result = await fetch(`${APILINK}/users/update_status/${driverId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: change }), // Correctly formatted
      });

      console.log("honai zvaita", result);
      if (!result.ok) {
        throw new Error(`Error: ${result.status}`);
      }
    } catch (error) {
      console.error("Failed", error);
    }
  };

  const fetchTopUp = async (driverId) => {
    try {
      const response = await fetch(`${APILINK}/topUp/topup/${driverId}`);
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
      const data = await response.json();
      console.log("Fetched top-up data:", data);
      return Array.isArray(data) ? data : []; // Ensure it's always an array
    } catch (error) {
      console.error('Failed to fetch top-up data:', error);
      return []; // Return an empty array in case of error
    }
  };

  const suspend = async () => {
    let status = "Suspended";
    let userId = user.userid;

    await verifyUser(userId, status);
    handleSearch(); // Refresh the search
  };

  const Blacklist = async () => {
    let status = "Blacklisted";
    let userId = user.userid;

    await verifyUser(userId, status);
    handleSearch(); // Refresh the search
  };

  const Activate = async () => {
    let status = "Active";
    let userId = user.userid;

    await verifyUser(userId, status);
    handleSearch(); // Refresh the search
  };

  const handleSearch = async (e) => {
    if (e) e.preventDefault(); // Prevent default only if event is provided

    try {
      const userResults = await fetchUserData(searchTerm);
      
      if (userResults.length > 0) {
        const userData = userResults[0];
        setUser(userData);

        const customerData = await fetchCustomer(searchTerm);
        const driverData = await fetchDriver(searchTerm);
        const topUpResults = await fetchTopUp(userData.driver_id); // Assuming userData has driver_id

        setCustomer(customerData.length > 0 ? customerData[0] : null);
        setDriver(driverData.length > 0 ? driverData[0] : null);
        setTopUpList(topUpResults); // Set top-up data directly
      } else {
        setUser(null);
        setCustomer(null);
        setDriver(null);
        setTopUpList([]); // Reset top-up list to empty array if no user found
      }
    } catch (error) {
      console.error("Search error:", error);
    }
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
              placeholder="Search..."
            />
            <button type="submit">
              <FontAwesomeIcon
                icon={faMagnifyingGlass}
                style={{ color: "#ffffff" }}
              />
            </button>
          </div>
        </form>
       
        <div className="card">
          <div className="row"></div>
          {customer && ( 
            <div className="col-md-4">
              {customer.profilePic ? (
                <img
                  src={`${API_URL_UPLOADSS}/${customer.profilePic.replace(/\\/g, '/')}`}
                  alt="Vehicle License"
                  style={{ width: "300px", height: "auto" }}
                />
              ) : (
                "N/A"
              )}
            </div>
          )}
          {user && ( // Render the card if user is not null
            <div className="col-md-8">
              <h2>User Information</h2>
              <div className="info-row">
                <strong>Status:</strong>
                <div>{user.status}</div>
              </div>
              <div className="info-row">
                <strong>User ID:</strong>
                <div>{user.userid}</div>
              </div>
              <div className="info-row">
                <strong>Username:</strong>
                <div>{user.username}</div>
              </div>
              <div className="info-row">
                <strong>Email:</strong>
                <div>{user.email}</div>
              </div>
              <div className="info-row">
                <strong>Phone:</strong>
                <div>{user.phone}</div>
              </div>
              <div className="info-row">
                <strong>Role:</strong>
                <div>{user.role}</div>
              </div>
              <div className="info-row">
                <strong>Account Category:</strong>
                <div>{user.account_category}</div>
              </div>

              <div className="button-container">
                <button
                  className="verify-button blacklist"
                  onClick={() => Blacklist()}
                >
                  Blacklist
                </button>

                <button
                  className="verify-button suspend"
                  onClick={() => suspend()}
                >
                  Suspend
                </button>

                <button className="verify-button" onClick={() => Activate()}>
                  ReActivate
                </button>
              </div>
            </div>
          )}
          {customer && ( // Render the card for customer if data exists
            <div className="card">
              <h2>Customer Information</h2>
              <div className="info-row">
                <strong>Customer ID:</strong>
                <div>{customer.customerid || "N/A"}</div>
              </div>
              <div className="info-row">
                <strong>EC Number:</strong>
                <div>{customer.ecnumber || "N/A"}</div>
              </div>
              <div className="info-row">
                <strong>Account Type:</strong>
                <div>{customer.account_type || "N/A"}</div>
              </div>
              <div className="info-row">
                <strong>Account Category:</strong>
                <div>{customer.account_category || "N/A"}</div>
              </div>
              <div className="info-row">
                <strong>Name:</strong>
                <div>{customer.name || "N/A"}</div>
              </div>
              <div className="info-row">
                <strong>Surname:</strong>
                <div>{customer.surname || "N/A"}</div>
              </div>
              <div className="info-row">
                <strong>Email:</strong>
                <div>{customer.email || "N/A"}</div>
              </div>
              <div className="info-row">
                <strong>Phone:</strong>
                <div>{customer.phone !== 0 ? customer.phone : "N/A"}</div>
              </div>
              <div className="info-row">
                <strong>Address:</strong>
                <div>{customer.address || "N/A"}</div>
              </div>
              <div className="info-row">
                <strong>City:</strong>
                <div>{customer.city || "N/A"}</div>
              </div>
              <div className="info-row">
                <strong>Country:</strong>
                <div>{customer.country || "N/A"}</div>
              </div>
              <div className="info-row">
                <strong>DOB:</strong>
                <div>{customer.dob || "N/A"}</div>
              </div>
              <div className="info-row">
                <strong>Signed On:</strong>
                <div>
                  {customer.signed_on
                    ? new Date(customer.signed_on).toLocaleDateString()
                    : "N/A"}
                </div>
              </div>
              <div className="info-row">
                <strong>Membership Status:</strong>
                <div>{customer.membershipstatus || "N/A"}</div>
              </div>
              <div className="info-row">
                <strong>Credit Bar Rule Exception:</strong>
                <div>{customer.credit_bar_rule_exception || "N/A"}</div>
              </div>
              <div className="info-row">
                <strong>Credit Standing:</strong>
                <div>{customer.creditstanding || "N/A"}</div>
              </div>
              <div className="info-row">
                <strong>Employer:</strong>
                <div>{customer.employer || "N/A"}</div>
              </div>
              <div className="info-row">
                <strong>House Number and Street Name:</strong>
                <div>{customer.house_number_and_street_name || "N/A"}</div>
              </div>
              <div className="info-row">
                <strong>ID Number:</strong>
                <div>{customer.idnumber || "N/A"}</div>
              </div>
              <div className="info-row">
                <strong>Sex:</strong>
                <div>{customer.sex || "N/A"}</div>
              </div>
              <div className="info-row">
                <strong>Next of Kin 1 Name:</strong>
                <div>{customer.nok1name || "N/A"}</div>
              </div>
              <div className="info-row">
                <strong>Next of Kin 1 Phone:</strong>
                <div>{customer.nok1phone || "N/A"}</div>
              </div>
              <div className="info-row">
                <strong>Next of Kin 1 Relationship:</strong>
                <div>{customer.nok1relationship || "N/A"}</div>
              </div>
              <div className="info-row">
                <strong>Next of Kin 1 Surname:</strong>
                <div>{customer.nok1surname || "N/A"}</div>
              </div>
              <div className="info-row">
                <strong>Next of Kin 2 Name:</strong>
                <div>{customer.nok2name || "N/A"}</div>
              </div>
              <div className="info-row">
                <strong>Next of Kin 2 Phone:</strong>
                <div>{customer.nok2phone || "N/A"}</div>
              </div>
              <div className="info-row">
                <strong>Next of Kin 2 Relationship:</strong>
                <div>{customer.nok2relationship || "N/A"}</div>
              </div>
              <div className="info-row">
                <strong>Next of Kin 2 Surname:</strong>
                <div>{customer.nok2surname || "N/A"}</div>
              </div>
              <div className="info-row">
                <strong>Work Address:</strong>
                <div>{customer.workaddress || "N/A"}</div>
              </div>
              <div className="info-row">
                <strong>Work Industry:</strong>
                <div>{customer.workindustry || "N/A"}</div>
              </div>
              <div className="info-row">
                <strong>Work Phone:</strong>
                <div>{customer.workphone || "N/A"}</div>
              </div>
              <div className="info-row">
                <strong>Work Phone 2:</strong>
                <div>{customer.workphone2 || "N/A"}</div>
              </div>
              <div className="info-row">
                <strong>Profile Picture:</strong>
                <div>
                  {customer.profilePic ? (
                    <img
                      src={`${API_URL_UPLOADSS}/${customer.profilePic.replace(/\\/g, '/')}`}
                      alt="Profile"
                      style={{ width: "100px", height: "auto" }}
                    />
                  ) : (
                    "N/A"
                  )}
                </div>
              </div>

              <div className="button-container">
                <button
                  className="verify-button blacklist"
                  onClick={() => Blacklist()}
                >
                  Blacklist
                </button>

                <button
                  className="verify-button suspend"
                  onClick={() => suspend()}
                >
                  Suspend
                </button>

                <button className="verify-button" onClick={() => Activate()}>
                  ReActivate
                </button>
              </div>
            </div>
          )}
          {driver && ( // Render the card for driver if data exists
            <div className="card">
              <h2>Driver Information</h2>

              <div className="info-row">
                <strong>Driver ID:</strong>
                <div>{driver.driver_id || "N/A"}</div>
              </div>
              <div className="info-row">
                <strong>Account Type:</strong>
                <div>{driver.account_type || "N/A"}</div>
              </div>
              <div className="info-row">
                <strong>Username:</strong>
                <div>{driver.username || "N/A"}</div>
              </div>
              <div className="info-row">
                <strong>Email:</strong>
                <div>{driver.email || "N/A"}</div>
              </div>
              <div className="info-row">
                <strong>Phone:</strong>
                <div>{driver.phone || "N/A"}</div>
              </div>
              <div className="info-row">
                <strong>Plate:</strong>
                <div>{driver.plate || "N/A"}</div>
              </div>
              <div className="info-row">
                <strong>Signed On:</strong>
                <div>
                  {driver.signed_on
                    ? new Date(driver.signed_on).toLocaleDateString()
                    : "N/A"}
                </div>
              </div>
              <div className="info-row">
                <strong>ID Number:</strong>
                <div>{driver.idnumber || "N/A"}</div>
              </div>
              <div className="info-row">
                <strong>Address:</strong>
                <div>{driver.address || "N/A"}</div>
              </div>
              <div className="info-row">
                <strong>City:</strong>
                <div>{driver.city || "N/A"}</div>
              </div>
              <div className="info-row">
                <strong>Country:</strong>
                <div>{driver.country || "N/A"}</div>
              </div>
              <div className="info-row">
                <strong>Cost Price:</strong>
                <div>{driver.cost_price || "N/A"}</div>
              </div>
              <div className="info-row">
                <strong>DOB:</strong>
                <div>{driver.dob || "N/A"}</div>
              </div>
              <div className="info-row">
                <strong>Employer:</strong>
                <div>{driver.employer || "N/A"}</div>
              </div>
              <div className="info-row">
                <strong>House Number and Street Name:</strong>
                <div>{driver.house_number_and_street_name || "N/A"}</div>
              </div>
              <div className="info-row">
                <strong>Membership Status:</strong>
                <div>{driver.membershipstatus || "N/A"}</div>
              </div>
              <div className="info-row">
                <strong>Sex:</strong>
                <div>{driver.sex || "N/A"}</div>
              </div>
              <div className="info-row">
                <strong>Rating:</strong>
                <div>{driver.rating || "N/A"}</div>
              </div>
              <div className="info-row">
                <strong>Profile Picture:</strong>
                <div>
                  {driver.profilePic ? (
                    <img
                      src={`${API_URL_UPLOADSS}/${driver.profilePic.replace(/\\/g, '/')}`}
                      alt="Profile"
                      style={{ width: "100px", height: "auto" }}
                    />
                  ) : (
                    "N/A"
                  )}
                </div>
              </div>
              <div className="info-row">
                <strong>Driver License Image:</strong>
                <div>
                  {driver.driver_license_image ? (
                    <img
                      src={`${API_URL_UPLOADSS}/${driver.driver_license_image.replace(/\\/g, '/')}`}
                      alt="Driver License"
                      style={{ width: "100px", height: "auto" }}
                    />
                  ) : (
                    "N/A"
                  )}
                </div>
              </div>
              <div className="info-row">
                <strong>ID Image:</strong>
                <div>
                  {driver.id_image ? (
                    <img
                      src={`${API_URL_UPLOADSS}/${driver.id_image.replace(/\\/g, '/')}`}
                      alt="ID"
                      style={{ width: "100px", height: "auto" }}
                    />
                  ) : (
                    "N/A"
                  )}
                </div>
              </div>
              <div className="info-row">
                <strong>Number Plate Image:</strong>
                <div>
                  {driver.number_plate_image ? (
                    <img
                      src={`${API_URL_UPLOADSS}/${driver.number_plate_image.replace(/\\/g, '/')}`}
                      alt="Number Plate"
                      style={{ width: "100px", height: "auto" }}
                    />
                  ) : (
                    "N/A"
                  )}
                </div>
              </div>
              <div className="info-row">
                <strong>Vehicle License Image:</strong>
                <div>
                  {driver.vehicle_license_image ? (
                    <img
                      src={`${API_URL_UPLOADSS}/${driver.vehicle_license_image.replace(/\\/g, '/')}`}
                      alt="Vehicle License"
                      style={{ width: "100px", height: "auto" }}
                    />
                  ) : (
                    "N/A"
                  )}
                </div>
              </div>
              <div className="info-row">
                <strong>Work Address:</strong>
                <div>{driver.workaddress || "N/A"}</div>
              </div>
              <div className="info-row">
                <strong>Work Industry:</strong>
                <div>{driver.workindustry || "N/A"}</div>
              </div>
              <div className="info-row">
                <strong>Work Phone:</strong>
                <div>{driver.workphone || "N/A"}</div>
              </div>
              <div className="info-row">
                <strong>Next of Kin 1 Name:</strong>
                <div>{driver.nok1name || "N/A"}</div>
              </div>
              <div className="info-row">
                <strong>Next of Kin 1 Phone:</strong>
                <div>{driver.nok1phone || "N/A"}</div>
              </div>
              <div className="info-row">
                <strong>Next of Kin 1 Relationship:</strong>
                <div>{driver.nok1relationship || "N/A"}</div>
              </div>
              <div className="info-row">
                <strong>Next of Kin 1 Surname:</strong>
                <div>{driver.nok1surname || "N/A"}</div>
              </div>
              <div className="info-row">
                <strong>Next of Kin 2 Name:</strong>
                <div>{driver.nok2name || "N/A"}</div>
              </div>
              <div className="info-row">
                <strong>Next of Kin 2 Phone:</strong>
                <div>{driver.nok2phone || "N/A"}</div>
              </div>
              <div className="info-row">
                <strong>Next of Kin 2 Relationship:</strong>
                <div>{driver.nok2relationship || "N/A"}</div>
              </div>
              <div className="info-row">
                <strong>Next of Kin 2 Surname:</strong>
                <div>{driver.nok2surname || "N/A"}</div>
              </div>

              <div className="button-container">
                <button
                  className="verify-button blacklist"
                  onClick={() => Blacklist()}
                >
                  Blacklist
                </button>

                <button
                  className="verify-button suspend"
                  onClick={() => suspend()}
                >
                  Suspend
                </button>

                <button className="verify-button" onClick={() => Activate()}>
                  ReActivate
                </button>
              </div>
            </div>
          )}
          {user === null && <div>No results found</div>} {/* If no user found */}

          {topUpList.length > 0 && ( // Check if topUpList is an array and has items
            <div className="card">
              <h2>Top-Up Information</h2>
              {topUpList.map((topUp) => (
                <div key={topUp.top_up_id} className="info-row">
                  <strong>Amount:</strong>
                  <div>{topUp.amount} {topUp.currency}</div> {/* Ensure 'amount' exists */}
                  <strong>Description:</strong>
                  <div>{topUp.description || 'No description available'}</div> {/* Ensure 'description' exists */}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default SearchPage;
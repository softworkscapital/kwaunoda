import React, { useState } from "react";
import "../css/SearchPage.css"; // Import the CSS file
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import { API_URL } from './config'; // Ensure this is the correct import

function SearchPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [user, setUser] = useState(null);
  const [customer, setCustomer] = useState(null);
  const [driver, setDriver] = useState(null);

  const APILINK = API_URL;

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
      console.error('Failed to fetch driver data:', error);
      throw error; // Rethrow or handle it as needed
    }
  };

  const fetchCustomer = async (userId) => {
    try {
      const customerResult = await fetch(`${APILINK}/customerdetails/${userId}`);
      if (!customerResult.ok) {
        throw new Error(`Error: ${customerResult.status}`);
      }
      const customerData = await customerResult.json();
      console.log("Customers Here", customerData);
      return customerData; // Return the fetched data
    } catch (error) {
      console.error('Failed to fetch customer data:', error);
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
      console.error('Failed to fetch user data:', error);
      throw error; // Rethrow or handle it as needed
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();

    const userResults = await fetchUserData(searchTerm);
    if (userResults.length > 0) {
      const userData = userResults[0];
      setUser(userData);

      const customerData = await fetchCustomer(searchTerm);
      const driverData = await fetchDriver(searchTerm);

      setCustomer(customerData.length > 0 ? customerData[0] : null);
      setDriver(driverData.length > 0 ? driverData[0] : null);
    } else {
      setUser(null);
      setCustomer(null);
      setDriver(null);
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
              <FontAwesomeIcon icon={faMagnifyingGlass} style={{ color: "#ffffff" }} />
            </button>
          </div>
        </form>

        {user && ( // Render the card if user is not null
          <div className="card">
            <h2>User Information</h2>
            <p><strong>User ID:</strong> {user.userid}</p>
            <p><strong>Username:</strong> {user.username}</p>
            <p><strong>Email:</strong> {user.email}</p>
            <p><strong>Phone:</strong> {user.phone}</p>
            <p><strong>Role:</strong> {user.role}</p>
            <p><strong>Account Category:</strong> {user.account_category}</p>
            {/* Add more fields as needed */}
          </div>
        )}

        {customer && ( // Render the card for customer if data exists
          <div className="card">
  <h2>Customer Information</h2>
  <p><strong>Customer ID:</strong> {customer.customerid || 'N/A'}</p>
  <p><strong>EC Number:</strong> {customer.ecnumber || 'N/A'}</p>
  <p><strong>Account Type:</strong> {customer.account_type || 'N/A'}</p>
  <p><strong>Account Category:</strong> {customer.account_category || 'N/A'}</p>
  <p><strong>Name:</strong> {customer.name || 'N/A'}</p>
  <p><strong>Surname:</strong> {customer.surname || 'N/A'}</p>
  <p><strong>Email:</strong> {customer.email || 'N/A'}</p>
  <p><strong>Phone:</strong> {customer.phone !== 0 ? customer.phone : 'N/A'}</p>
  <p><strong>Address:</strong> {customer.address || 'N/A'}</p>
  <p><strong>City:</strong> {customer.city || 'N/A'}</p>
  <p><strong>Country:</strong> {customer.country || 'N/A'}</p>
  <p><strong>DOB:</strong> {customer.dob || 'N/A'}</p>
  <p><strong>Signed On:</strong> {customer.signed_on ? new Date(customer.signed_on).toLocaleDateString() : 'N/A'}</p>
  <p><strong>Membership Status:</strong> {customer.membershipstatus || 'N/A'}</p>
  <p><strong>Credit Bar Rule Exception:</strong> {customer.credit_bar_rule_exception || 'N/A'}</p>
  <p><strong>Credit Standing:</strong> {customer.creditstanding || 'N/A'}</p>
  <p><strong>Employer:</strong> {customer.employer || 'N/A'}</p>
  <p><strong>House Number and Street Name:</strong> {customer.house_number_and_street_name || 'N/A'}</p>
  <p><strong>ID Number:</strong> {customer.idnumber || 'N/A'}</p>
  <p><strong>Sex:</strong> {customer.sex || 'N/A'}</p>
  <p><strong>Next of Kin 1 Name:</strong> {customer.nok1name || 'N/A'}</p>
  <p><strong>Next of Kin 1 Phone:</strong> {customer.nok1phone || 'N/A'}</p>
  <p><strong>Next of Kin 1 Relationship:</strong> {customer.nok1relationship || 'N/A'}</p>
  <p><strong>Next of Kin 1 Surname:</strong> {customer.nok1surname || 'N/A'}</p>
  <p><strong>Next of Kin 2 Name:</strong> {customer.nok2name || 'N/A'}</p>
  <p><strong>Next of Kin 2 Phone:</strong> {customer.nok2phone || 'N/A'}</p>
  <p><strong>Next of Kin 2 Relationship:</strong> {customer.nok2relationship || 'N/A'}</p>
  <p><strong>Next of Kin 2 Surname:</strong> {customer.nok2surname || 'N/A'}</p>
  <p><strong>Work Address:</strong> {customer.workaddress || 'N/A'}</p>
  <p><strong>Work Industry:</strong> {customer.workindustry || 'N/A'}</p>
  <p><strong>Work Phone:</strong> {customer.workphone || 'N/A'}</p>
  <p><strong>Work Phone 2:</strong> {customer.workphone2 || 'N/A'}</p>
  <p><strong>Profile Picture:</strong> {customer.profilePic ? <img src={customer.profilePic} alt="Profile" /> : 'N/A'}</p>
</div>
        )}

        {driver && ( // Render the card for driver if data exists
          <div className="card">
  <h2>Driver Information</h2>
  <p><strong>Driver ID:</strong> {driver.driver_id || 'N/A'}</p>
  <p><strong>Account Type:</strong> {driver.account_type || 'N/A'}</p>
  <p><strong>Username:</strong> {driver.username || 'N/A'}</p>
  <p><strong>Email:</strong> {driver.email || 'N/A'}</p>
  <p><strong>Phone:</strong> {driver.phone || 'N/A'}</p>
  <p><strong>Plate:</strong> {driver.plate || 'N/A'}</p>
  <p><strong>Signed On:</strong> {driver.signed_on ? new Date(driver.signed_on).toLocaleDateString() : 'N/A'}</p>
  <p><strong>ID Number:</strong> {driver.idnumber || 'N/A'}</p>
  <p><strong>Address:</strong> {driver.address || 'N/A'}</p>
  <p><strong>City:</strong> {driver.city || 'N/A'}</p>
  <p><strong>Country:</strong> {driver.country || 'N/A'}</p>
  <p><strong>Cost Price:</strong> {driver.cost_price || 'N/A'}</p>
  <p><strong>DOB:</strong> {driver.dob || 'N/A'}</p>
  <p><strong>Employer:</strong> {driver.employer || 'N/A'}</p>
  <p><strong>House Number and Street Name:</strong> {driver.house_number_and_street_name || 'N/A'}</p>
  <p><strong>Membership Status:</strong> {driver.membershipstatus || 'N/A'}</p>
  <p><strong>Sex:</strong> {driver.sex || 'N/A'}</p>
  <p><strong>Rating:</strong> {driver.rating || 'N/A'}</p>
  <p><strong>Profile Picture:</strong> {driver.profilePic || 'N/A'}</p>
  <p><strong>Driver License Image:</strong> {driver.driver_license_image || 'N/A'}</p>
  <p><strong>ID Image:</strong> {driver.id_image || 'N/A'}</p>
  <p><strong>Number Plate Image:</strong> {driver.number_plate_image || 'N/A'}</p>
  <p><strong>Vehicle License Image:</strong> {driver.vehicle_license_image || 'N/A'}</p>
  <p><strong>Work Address:</strong> {driver.workaddress || 'N/A'}</p>
  <p><strong>Work Industry:</strong> {driver.workindustry || 'N/A'}</p>
  <p><strong>Work Phone:</strong> {driver.workphone || 'N/A'}</p>
  <p><strong>Next of Kin 1 Name:</strong> {driver.nok1name || 'N/A'}</p>
  <p><strong>Next of Kin 1 Phone:</strong> {driver.nok1phone || 'N/A'}</p>
  <p><strong>Next of Kin 1 Relationship:</strong> {driver.nok1relationship || 'N/A'}</p>
  <p><strong>Next of Kin 1 Surname:</strong> {driver.nok1surname || 'N/A'}</p>
  <p><strong>Next of Kin 2 Name:</strong> {driver.nok2name || 'N/A'}</p>
  <p><strong>Next of Kin 2 Phone:</strong> {driver.nok2phone || 'N/A'}</p>
  <p><strong>Next of Kin 2 Relationship:</strong> {driver.nok2relationship || 'N/A'}</p>
  <p><strong>Next of Kin 2 Surname:</strong> {driver.nok2surname || 'N/A'}</p>
</div>
        )}

        {user === null && <div>No results found</div>} {/* If no user found */}
      </div>
    </div>
  );
}

export default SearchPage;
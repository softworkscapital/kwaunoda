require("dotenv").config();
const pool = require("./poolfile");

let NewOrderObj = {};

// Function to fetch the driver details and calculate eligible trips
NewOrderObj.getEligibleTrips = async (driver_id) => {
  try {
    // Fetch the driver details
    const driverDetails = await NewOrderObj.getDriverById(driver_id);
    const driver = driverDetails[0];

    if (!driver) {
      throw new Error("Driver not found");
    }

    // Calculate age
    const currentDate = new Date();
    const dob = new Date(driver.dob);
    const age = currentDate.getFullYear() - dob.getFullYear();
    console.log("age", age);

    // Prepare the criteria based on driver's preferences
    const preferredGender = driver.sex || null;
    const preferredCarType = driver.type || null;
    const numberOfPassengers = driver.number_of_passengers || 0; // Default to 0 if not specified

    // Query to fetch eligible trips
    const query = `
    SELECT * FROM trip 
    WHERE 
      (preferred_gender = 'Any' OR preferred_gender = ?) AND
      (preferred_car_type = 'Any' OR preferred_car_type = ?) AND
      (
        preferred_age = 'Any' OR 
        (
          CAST(SUBSTRING_INDEX(preferred_age, '-', 1) AS UNSIGNED) <= ? AND 
          CAST(SUBSTRING_INDEX(preferred_age, '-', -1) AS UNSIGNED) >= ?
        )
      ) AND
      (number_of_passengers = 'Any' OR number_of_passengers >= ?) AND 
      status = 'New Order'
    ORDER BY trip_id DESC
  `;

    // Execute the query with filters
    const results = await new Promise((resolve, reject) => {
      pool.query(
        query,
        [preferredGender, preferredCarType, age, age, numberOfPassengers],
        (err, results) => {
          if (err) {
            return reject(err);
          }
          return resolve(results);
        }
      );
    });

    return results; // Return the filtered trips
  } catch (error) {
    throw new Error("Error fetching eligible trips: " + error.message);
  }
};

// Example of adding the getDriverById method (just for completeness and context)
NewOrderObj.getDriverById = (driver_id) => {
  return new Promise((resolve, reject) => {
    pool.query(
      "SELECT * FROM driver_details WHERE driver_id = ?",
      [driver_id],
      (err, results) => {
        if (err) {
          return reject(err);
        }
        return resolve(results);
      }
    );
  });
};

// Exporting the NewOrderObj
module.exports = NewOrderObj;

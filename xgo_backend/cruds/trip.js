require("dotenv").config();
const pool = require("./poolfile");

let crudsObj = {};

crudsObj.postTrip = (
  driver_id,
  cust_id,
  request_start_datetime,
  order_start_datetime,
  order_end_datetime,
  status,
  deliveray_details,
  delivery_notes,
  weight,
  delivery_contact_details,
  dest_location,
  origin_location,
  origin_location_lat,
  origin_location_long,
  destination_lat,
  destination_long,
  distance,
  delivery_cost_proposed,
  accepted_cost,
  paying_when,
  payment_type,
  preferred_gender,
  preferred_car_type,
  preferred_age,
  number_of_passengers,
  driver_license_date,
  currency_id,
  currency_code,
  usd_rate,
  customer_comment,
  driver_comment,
  driver_stars,
  customer_stars,
  customer_status,
  pascel_pic1,
  pascel_pic2,
  pascel_pic3,
  trip_priority_type,
  delivery_received_confirmation_code
) => {
  return new Promise((resolve, reject) => {
    pool.query(
      `INSERT INTO trip (
             driver_id, cust_id, request_start_datetime, order_start_datetime,
             order_end_datetime, status, deliveray_details, delivery_notes, weight, 
             delivery_contact_details, dest_location, origin_location, 
             origin_location_lat, origin_location_long, destination_lat, 
             destination_long, distance, delivery_cost_proposed, 
             accepted_cost, paying_when, payment_type, preferred_gender, 
             preferred_car_type, preferred_age, number_of_passengers, 
             driver_license_date,
             currency_id, currency_code, usd_rate, customer_comment, driver_comment,
              driver_stars, customer_stars, customer_status, pascel_pic1, pascel_pic2, pascel_pic3, trip_priority_type, delivery_received_confirmation_code
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        driver_id,
        cust_id,
        request_start_datetime,
        order_start_datetime,
        order_end_datetime,
        status,
        deliveray_details,
        delivery_notes,
        weight,
        delivery_contact_details,
        dest_location,
        origin_location,
        origin_location_lat,
        origin_location_long,
        destination_lat,
        destination_long,
        distance,
        delivery_cost_proposed,
        accepted_cost,
        paying_when,
        payment_type,
        preferred_gender,
        preferred_car_type,
        preferred_age,
        number_of_passengers,
        driver_license_date,
        currency_id,
        currency_code,
        usd_rate,
        customer_comment,
        driver_comment,
        driver_stars,
        customer_stars,
        customer_status,
        pascel_pic1,
        pascel_pic2,
        pascel_pic3,
        trip_priority_type,
        delivery_received_confirmation_code
      ],
      (err, result) => {
        if (err) {
          console.error("Error occurred during SQL query:", err);
          return reject(err);
        }
        return resolve({ status: "200", message: "Saving successful" });
      }
    );
  });
};



crudsObj.getTrips = () => {
  return new Promise((resolve, reject) => {
    pool.query("SELECT * FROM trip ORDER BY trip_id DESC", (err, results) => {
      if (err) {
        return reject(err);
      }
      return resolve(results);
    });
  });
};

crudsObj.getTripById = (trip_id) => {
  return new Promise((resolve, reject) => {
    pool.query(
      "SELECT * FROM trip WHERE trip_id = ?",
      [trip_id],
      (err, results) => {
        if (err) {
          return reject(err);
        }
        return resolve(results);
      }
    );
  });
};

crudsObj.getTripByStatusToDriver = () => {
  return new Promise((resolve, reject) => {
    pool.query(
      'SELECT * FROM trip WHERE status = "New Order" ORDER BY trip_id DESC',
      (err, results) => {
        if (err) {
          return reject(err);
        }
        return resolve(results);
      }
    );
  });
};

crudsObj.getTripByStatusToDriverEnd = (driver_id) => {
  return new Promise((resolve, reject) => {
    pool.query(
      'SELECT * FROM trip WHERE status = "Waiting Driver Rating" AND driver_id = ? ORDER BY trip_id DESC',
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

crudsObj.getTripByDriverAndStatus = (driver_id, status) => {
  return new Promise((resolve, reject) => {
    const query = "SELECT * FROM trip WHERE driver_id = ? AND status = ? ORDER BY trip_id DESC";
    pool.query(query, [driver_id, status], (err, results) => {
      if (err) {
        return reject(err);
      }
      return resolve(results);
    });
  });
};

crudsObj.getTripByCustomerIdAndStatus = (cust_id, status) => {
  return new Promise((resolve, reject) => {
    const query = "SELECT * FROM trip WHERE cust_id = ? AND status = ? ORDER BY trip_id DESC";
    pool.query(query, [cust_id, status], (err, results) => {
      if (err) {
        return reject(err);
      }
      return resolve(results);
    });
  });
};

crudsObj.getNumberofTrips = (driver_id, status) => {
  return new Promise((resolve, reject) => {
    pool.query(
      "SELECT COUNT(*) AS tripCount FROM trip WHERE driver_id = ? AND status = ?",
      [driver_id, status],
      (err, results) => {
        if (err) {
          return reject(err);
        }
        return resolve(results[0].tripCount);
      }
    );
  });
};


crudsObj.getTripByStatusToCustomer = (cust_id) => {
  return new Promise((resolve, reject) => {
    pool.query(
      'SELECT * FROM trip WHERE cust_id = ? AND (status = "InTransit" OR status = "Waiting customer to end trip" OR status = "New Order") ORDER BY trip_id DESC',
      [cust_id],
      (err, results) => {
        if (err) {
          return reject(err);
        }
        return resolve(results);
      }
    );
  });
};

crudsObj.getTripDetailsOfTablesById = (trip_id) => {
  return new Promise((resolve, reject) => {
    const query = `
      SELECT 
        trip.*, 
        customer_details.*, 
        driver_details.*, 
        customer_driver_chats.*, 
        counter_offer.*, 
        top_up.* 
      FROM 
        trip 
      LEFT JOIN 
        customer_details ON trip.cust_id = customer_details.customerid 
      LEFT JOIN 
        driver_details ON trip.driver_id = driver_details.driver_id 
      LEFT JOIN 
        customer_driver_chats ON trip.trip_id = customer_driver_chats.trip_id 
      LEFT JOIN 
        counter_offer ON trip.trip_id = counter_offer.trip_id 
      LEFT JOIN 
        top_up ON trip.trip_id = top_up.trip_id 
      WHERE 
        trip.trip_id = ?
    `;

    pool.query(query, [trip_id], (err, results) => {
      if (err) {
        return reject(err);
      }
      return resolve(results);
    });
  });
};


crudsObj.getIntransitForDriverId = (driver_id, status) => {
  return new Promise((resolve, reject) => {
    const query = "SELECT * FROM trip WHERE driver_id = ? AND status = ?";
    pool.query(query, [driver_id, status], (err, results) => {
      if (err) {
        return reject(err);
      }
      return resolve(results);
    });
  });
};


crudsObj.updateTrip = (trip_id, updatedValues) => {
  const {
    driver_id,
    cust_id,
    request_start_datetime,
    order_start_datetime,
    order_end_datetime,
    status,
    deliveray_details,
    delivery_notes,
    weight,
    delivery_contact_details,
    dest_location,
    origin_location,
    origin_location_lat,
    origin_location_long,
    destination_lat,
    destination_long,
    distance,
    delivery_cost_proposed,
    accepted_cost,
    paying_when,
    payment_type,
    currency_id,
    currency_code,
    usd_rate,
    customer_comment,
    driver_comment,
    driver_stars,
    customer_stars,
    customer_status,
    pascel_pic1,
    pascel_pic2,
    pascel_pic3,
    trip_priority_type,
    delivery_received_confirmation_code
  } = updatedValues;

  return new Promise((resolve, reject) => {
    pool.query(
      `UPDATE trip SET 
                driver_id = ?, cust_id = ?, request_start_datetime = ?, 
                order_start_datetime = ?, order_end_datetime = ?, status = ?, 
                deliveray_details = ?, delivery_notes = ?, weight = ?, delivery_contact_details = ?, 
                dest_location = ?, origin_location = ?, 
                origin_location_lat = ?, origin_location_long = ?, 
                destination_lat = ?, destination_long = ?, 
                distance = ?, delivery_cost_proposed = ?, 
                accepted_cost = ?, paying_when = ?, payment_type = ?, 
                currency_id = ?, currency_code = ?,
                usd_rate = ?, customer_comment = ?, 
                driver_comment = ?, driver_stars = ?, customer_stars = ? , customer_status = ?,
                pascel_pic1 = ?, pascel_pic2 = ?, pascel_pic3 = ?, trip_priority_type = ?, delivery_received_confirmation_code = ?
            WHERE trip_id = ?`,
      [
        driver_id,
        cust_id,
        request_start_datetime,
        order_start_datetime,
        order_end_datetime,
        status,
        deliveray_details,
        delivery_notes,
        weight,
        delivery_contact_details,
        dest_location,
        origin_location,
        origin_location_lat,
        origin_location_long,
        destination_lat,
        destination_long,
        distance,
        delivery_cost_proposed,
        accepted_cost,
        paying_when,
        payment_type,
        currency_id,
        currency_code,
        usd_rate,
        customer_comment,
        driver_comment,
        driver_stars,
        customer_stars,
        customer_status,
        pascel_pic1,
        pascel_pic2,
        pascel_pic3,
        trip_priority_type,
        delivery_received_confirmation_code,
        trip_id,
      ],
      (err, result) => {
        if (err) {
          return reject(err);
        }
        return resolve({ status: "200", message: "update successful" });
      }
    );
  });
};

crudsObj.deleteTrip = (id) => {
  return new Promise((resolve, reject) => {
    pool.query("DELETE FROM trip WHERE trip_id= ?", [id], (err, results) => {
      if (err) {
        return reject(err);
      }
      return resolve(results);
    });
  });
};

crudsObj.updateCustomerComment = (trip_id, updatedValues) => {
  const {
    customer_comment,
    driver_stars,
    status,
  } = updatedValues;

  return new Promise((resolve, reject) => {
    pool.query(
      `UPDATE trip SET 
                customer_comment = ?, 
                driver_stars = ?
            WHERE trip_id = ?`,
      [
        customer_comment,
        driver_stars,
        trip_id,
      ],
      (err, result) => {
        if (err) {
          return reject(err);
        }
        return resolve({ status: "200", message: "update successful" });
      }
    );
  });
};

crudsObj.getMylastTwentyTripsById = (customer_id, driver_id) => {
  return new Promise((resolve, reject) => {
    pool.query(
      'SELECT * FROM trip WHERE cust_id = ? AND cust_id <> "0" OR driver_id=? AND driver_id<>"0"  LIMIT 20 ORDER BY trip_id DESC',
      [customer_id, driver_id],
      (err, results) => {
        if (err) {
          return reject(err);
        }
        return resolve(results);
      }
    );
  });
};

crudsObj.updateDriverComment = (trip_id, updatedValues) => {
  const {
    driver_comment,
    customer_stars,
    status,
  } = updatedValues;

  return new Promise((resolve, reject) => {
    pool.query(
      `UPDATE trip SET 
                driver_comment = ?, 
                customer_stars = ?
            WHERE trip_id = ?`,
      [
        driver_comment,
        customer_stars,
        trip_id,
      ],
      (err, result) => {
        if (err) {
          return reject(err);
        }
        return resolve({ status: "200", message: "update successful" });
      }
    );
  });
};

crudsObj.getTripToDash = (status) => {
  return new Promise((resolve, reject) => {
    pool.query(
      "SELECT * FROM trip WHERE status = ? ORDER BY trip_id DESC",
      [status],
      (err, results) => {
        if (err) {
          return reject(err);
        }
        return resolve(results);
      }
    );
  });
};

crudsObj.updateStatusAndDriver = (trip_id, driver_id, status) => {
  return new Promise((resolve, reject) => {
    // First query: Update trip table
    pool.query(
      `UPDATE trip SET 
                driver_id = ?, 
                status = ?
            WHERE trip_id = ?`,
      [driver_id, status, trip_id],
      (err, result) => {
        if (err) {
          return reject(err); // Reject if there's an error
        }

        // Calculate the updated date
        const currentDate = new Date();
        currentDate.setHours(currentDate.getHours() + 2); // Add 2 hours
        const formattedDate = currentDate
          .toISOString()
          .slice(0, 19)
          .replace("T", " "); // Format the date

        // Second query: Update users table
        pool.query(
          `UPDATE users SET 
                    last_fin_activity_date_time = ? 
                WHERE driver_id = ?`,
          [formattedDate, driver_id], // Correct parameter order
          (err, result) => {
            if (err) {
              return reject(err); // Reject if there's an error
            }

            // Resolve the promise after both queries succeed
            return resolve({ status: "200", message: "update successful" });
          }
        );
      }
    );
  });
};



crudsObj.endTripByCustomer = (trip_id) => {
  return new Promise((resolve, reject) => {
    // First, update customer status to 'Ended'
    pool.query(
      `UPDATE trip SET customer_status = 'Ended' WHERE trip_id = ?`,
      [trip_id],
      (err, result) => {
        if (err) {
          return reject(err);
        }

        // Now check if both statuses are 'Ended' to update trip status
        pool.query(
          `UPDATE trip SET status = 'Trip Ended' WHERE trip_id = ? 
           AND customer_status = 'Ended' AND driver_status = 'Ended'`,
          [trip_id],
          (err2, result2) => {
            if (err2) {
              return reject(err2);
            }
            return resolve({ status: "200", message: "Trip ended successfully" });
          }
        );
      }
    );
  });
};

crudsObj.endTripByDriver = (trip_id) => {
  return new Promise((resolve, reject) => {
    // First, update driver status to 'Ended'
    pool.query(
      `UPDATE trip SET driver_status = 'Ended' WHERE trip_id = ?`,
      [trip_id],
      (err, result) => {
        if (err) {
          return reject(err);
        }

        // Now check if both statuses are 'Ended' to update trip status
        pool.query(
          `UPDATE trip SET status = 'Trip Ended' WHERE trip_id = ? 
           AND customer_status = 'Ended' AND driver_status = 'Ended'`,
          [trip_id],
          (err2, result2) => {
            if (err2) {
              return reject(err2);
            }
            return resolve({ status: "200", result2 });
          }
        );
      }
    );
  });
};

module.exports = crudsObj;
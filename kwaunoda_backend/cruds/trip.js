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
  currency_id,
  currency_code,
  usd_rate,
  customer_comment,
  driver_comment,
  driver_stars,
  customer_stars
) => {
  return new Promise((resolve, reject) => {
    pool.query(
      `INSERT INTO trip (
             driver_id, cust_id, request_start_datetime, order_start_datetime,
             order_end_datetime, status, deliveray_details, delivery_notes, weight, 
             delivery_contact_details, dest_location, origin_location, 
             origin_location_lat, origin_location_long, destination_lat, 
             destination_long, distance, delivery_cost_proposed, 
             accepted_cost, paying_when, payment_type, currency_id, currency_code, usd_rate, customer_comment, driver_comment, driver_stars, customer_stars
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
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
      ],
      (err, result) => {
        if (err) {
          return reject(err);
        }
        return resolve({ status: "200", message: "saving successful" });
      }
    );
  });
};

crudsObj.getTrips = () => {
  return new Promise((resolve, reject) => {
    pool.query("SELECT * FROM trip", (err, results) => {
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
      'SELECT * FROM trip WHERE status = "New Order"',
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
      'SELECT * FROM trip WHERE status = "Waiting Driver Rating" AND driver_id = ?',
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
    const query = "SELECT * FROM trip WHERE driver_id = ? AND status = ?";
    pool.query(query, [driver_id, status], (err, results) => {
      if (err) {
        return reject(err); // Reject the promise if an error occurs
      }
      return resolve(results); // Resolve with the results
    });
  });
};


crudsObj.getTripByCustomerIdAndStatus = (cust_id, status) => {
  return new Promise((resolve, reject) => {
    const query = "SELECT * FROM trip WHERE cust_id = ? AND status = ?";
    pool.query(query, [cust_id, status], (err, results) => {
      if (err) {
        return reject(err); // Reject the promise if an error occurs
      }
      return resolve(results); // Resolve with the results
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
      'SELECT * FROM trip WHERE cust_id = ? AND status = "InTransit" OR status = "Arrived At Destination" OR status = "New Order"',
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
  } = updatedValues;

  return new Promise((resolve, reject) => {
    pool.query(
      `UPDATE trip SET 
                driver_id = ?, cust_id = ?, request_start_datetime = ?, 
                order_start_datetime = ?, order_end_datetime = ?, status = ?, 
                deliveray_details = ?,delivery_notes = ?, weight = ?, delivery_contact_details = ?, 
                dest_location = ?, origin_location = ?, 
                origin_location_lat = ?, origin_location_long = ?, 
                destination_lat = ?, destination_long = ?, 
                distance = ?, delivery_cost_proposed = ?, 
                accepted_cost = ?, paying_when = ?, payment_type = ?, 
                currency_id = ?, currency_code = ?,
                usd_rate = ?, customer_comment = ?, 
                driver_comment = ?, driver_stars = ?, customer_stars = ? 
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
        trip_id, // This is the value for WHERE clause
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
    customer_comment, // Field to update
    driver_stars,
    status, // Field to update
  } = updatedValues;

  return new Promise((resolve, reject) => {
    pool.query(
      `UPDATE trip SET 
                customer_comment = ?, 
                driver_stars = ?,
                status = ?
            WHERE trip_id = ?`,
      [
        customer_comment, // Value for customer_comment
        driver_stars,
        status, // Value for driver_stars
        trip_id, // This is the value for WHERE clause
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

//#########################
crudsObj.getMylastTwentyTripsById = (customer_id, driver_id) => {
  return new Promise((resolve, reject) => {
    pool.query(
      'SELECT * FROM trip WHERE cust_id = ? AND cust_id <> "0" OR driver_id=? AND driver_id<>"0"  LIMIT 20',
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
    driver_comment, // Field to update
    customer_stars,
    status, // Field to update
  } = updatedValues;

  return new Promise((resolve, reject) => {
    pool.query(
      `UPDATE trip SET 
                driver_comment = ?, 
                customer_stars = ?,
                status = ?
            WHERE trip_id = ?`,
      [
        driver_comment,
        customer_stars,
        status, // Value for customer_comment     // Value for driver_stars
        trip_id, // This is the value for WHERE clause
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
      'SELECT * FROM trip WHERE status = ?',
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
    pool.query(
      `UPDATE trip SET 
                driver_id = ?, 
                status = ?
            WHERE trip_id = ?`,
      [driver_id, status, trip_id],
      (err, result) => {
        if (err) {
          return reject(err);
        }
        return resolve({ status: "200", message: "update successful" });
      }
    );
  });
};

module.exports = crudsObj;

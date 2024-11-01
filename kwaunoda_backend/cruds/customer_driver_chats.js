require("dotenv").config();
const pool = require("./poolfile");

let crudsObj = {};

crudsObj.postCustomerDriverChat= (
        customer_driver_chat_id,
        date_chat,
        time_chat,
        trip_id,
        driver_id,
        customerid,
        message

) => {
  return new Promise((resolve, reject) => {
    pool.query(
      `INSERT INTO customer_driver_chats (
        date_chat,
        time_chat,
        trip_id,
        driver_id,
        customerid,
        message
              ) VALUES (?, ?, ?, ?,?,?)`,
      [
       
        date_chat,
        time_chat,
        trip_id,
        driver_id,
        customerid,
        message
      ],
      (err, result) => {
        if (err) {
          return reject(err);
        }
        return resolve({ status: "200", message: "saving successful", result });
      }
    );
  });
};

crudsObj.getCustomerDriverChats = () => {
  return new Promise((resolve, reject) => {
    pool.query("SELECT * FROM customer_driver_chats", (err, results) => {
      if (err) {
        return reject(err);
      }
      return resolve(results);
    });
  });
};

crudsObj.getCustomerDriverChatsByTripId = (trip_id) => {
    return new Promise((resolve, reject) => {
        pool.query(
            "SELECT * FROM customer_driver_chats WHERE trip_id = ? ORDER BY customer_driver_chat_id DESC LIMIT 20",
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


crudsObj.getCustomerDriverChatById = (customer_driver_chat_id) => {
  return new Promise((resolve, reject) => {
    pool.query(
      "SELECT * FROM customer_driver_chats WHERE customer_driver_chat_id = ?",
      [customer_driver_chat_id],
      (err, results) => {
        if (err) {
          return reject(err);
        }
        return resolve(results);
      }
    );
  });
};



crudsObj.updateCustomerDriverChat = (customer_driver_chat_id, updatedValues) => {
    const {
      date_chat,
      time_chat,
      trip_id,
      driver_id,
      customerid,
      message
    } = updatedValues;
  
    console.log("Updating record with ID:", customer_driver_chat_id);
    console.log("Updated values:", updatedValues);
  
    return new Promise((resolve, reject) => {
      pool.query(
        `UPDATE customer_driver_chats SET 
          date_chat =?,
          time_chat =?,
          trip_id =?,
          driver_id =?,
          customerid =?,
          message =?
        WHERE customer_driver_chat_id = ?`,
        [
          date_chat,
          time_chat,
          trip_id,
          driver_id,
          customerid,
          message,
          customer_driver_chat_id,
        ],
        (err, result) => {
          if (err) {
            console.error("Error updating member:", err);
            return reject(err);
          }
          if (result.affectedRows === 0) {
            return resolve({
              status: "404",
              message: "Hr_employee_record not found or no changes made",
            });
          }
          return resolve({ status: "200", message: "Update successful", result });
        }
      );
    });
  };
crudsObj.deleteCustomerDriverChat= (id) => {
  return new Promise((resolve, reject) => {
    pool.query(
      "DELETE FROM customer_driver_chats WHERE customer_driver_chat_id = ?",
      [id],
      (err, results) => {
        if (err) {
          return reject(err);
        }
        return resolve(results);
      }
    );
  });
};

module.exports = crudsObj;

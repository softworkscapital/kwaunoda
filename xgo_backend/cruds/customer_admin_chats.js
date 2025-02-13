require("dotenv").config();
const pool = require("./poolfile");

let crudsObj = {};

crudsObj.postCustomerAdminChat= (
        customer_admin_chat_id,
        date_chat,
        time_chat,
        trip_id,
        admin_id,
        driver_id,
        conversation_id,
        message,
        origin

) => {
  return new Promise((resolve, reject) => {
    pool.query(
      `INSERT INTO customer_admin_chats (
        date_chat,
        time_chat,
        trip_id,
        admin_id,
        driver_id,
        conversation_id,
        message,
        origin
              ) VALUES (?, ?, ?, ?, ?,?,?,?)`,
      [
       
        date_chat,
        time_chat,
        trip_id,
        admin_id,
        driver_id,
        conversation_id,
        message,
        origin
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

crudsObj.getCustomerAdminChats = () => {
  return new Promise((resolve, reject) => {
    pool.query("SELECT * FROM customer_admin_chats", (err, results) => {
      if (err) {
        return reject(err);
      }
      return resolve(results);
    });
  });
};

crudsObj.getCustomerAdminChatsByTripId = (trip_id) => {
    return new Promise((resolve, reject) => {
        pool.query(
            "SELECT * FROM customer_admin_chats WHERE trip_id = ? ORDER BY customer_admin_chat_id DESC LIMIT 20",
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


crudsObj.getCustomerAdminChatByDriverId = (driver_id) => {
  return new Promise((resolve, reject) => {
    pool.query(
      "SELECT * FROM customer_admin_chats WHERE driver_id = ?",
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


crudsObj.updateCustomerAdminChat = (customer_admin_chat_id, updatedValues) => {
    const {
        date_chat,
        time_chat,
        trip_id,
        admin_id,
        driver_id,
        message,
        conversation_id,
        origin
    } = updatedValues;

    console.log("Updating record with ID:", customer_admin_chat_id);
    console.log("Updated values:", updatedValues);

    return new Promise((resolve, reject) => {
        pool.query(
            `UPDATE customer_admin_chats SET 
                date_chat =?,
                time_chat =?,
                trip_id =?,
                admin_id =?,
                driver_id =?,
                conversation_id =?,
                message =?,
                origin =?
            WHERE customer_admin_chat_id = ?`,
            [
                date_chat,
                time_chat,
                trip_id,
                admin_id,
                driver_id,
                conversation_id,
                message,
                origin,
                customer_admin_chat_id,
            ],
            (err, result) => {
                if (err) {
                    console.error("Error updating member:", err);
                    return reject(err);
                }
                if (result.affectedRows === 0) {
                    return resolve({
                        status: "404",
                        message: "Customer admin chat not found or no changes made",
                    });
                }
                return resolve({ status: "200", message: "Update successful", result });
            }
        );
    });
};


crudsObj.deleteCustomerAdminChat= (id) => {
  return new Promise((resolve, reject) => {
    pool.query(
      "DELETE FROM customer_admin_chats WHERE customer_admin_chat_id = ?",
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

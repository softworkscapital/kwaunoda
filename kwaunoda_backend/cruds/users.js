require("dotenv").config();
const pool = require("./poolfile");
const axios = require("axios");

let crudsObj = {};

// Existing CRUD methods...

crudsObj.postUser = (user) => {
  return new Promise((resolve, reject) => {
    let User = user;
    console.log("honai user:", User);
    
    pool.query(
      "INSERT INTO users(userid, username, password, role, email, notify, activesession, addproperty, editproperty, approverequests, delivery, status, employee_id, company_id, branch_id, sync_status, last_logged_account, driver_id, customerid, otp, signed_on) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
      [
        user.userId, // User ID
        user.username, // Username
        user.password, // Password
        user.role, // Role
        user.email, // Email
        user.notify, // Notification preference
        user.activeSession, // Active session
        user.addProperty, // Add property
        user.editProperty, // Edit property
        user.approveRequests, // Approve requests
        user.delivery, // Delivery flag
        user.status, // Status
        user.employeeId, // Employee ID
        user.companyId, // Company ID
        user.branchId, // Branch ID
        user.syncStatus, // Sync status
        user.last_logged_account, // Last logged account type
        user.driverId, // Driver ID
        user.customerId, // Customer ID
        user.otp, // OTP
        user.signed_on, // Signed on
      ],
      (err, result) => {
        if (err) {
          return reject(err);
        }
        return resolve({ status: "200", message: "Your account has been created successfully, Now verify your phone number" });
      }
    );
  });
};

crudsObj.getLastUser = () => {
  return new Promise((resolve, reject) => {
    pool.query(
      "SELECT userid FROM users ORDER BY userid DESC LIMIT 1;",
      (err, results) => {
        if (err) {
          return reject(err);
        }
        return resolve(results);
      }
    );
  });
};

crudsObj.postUsernNew = (companyId, username, role, email, password) => {
  console.log(password);
  return new Promise((resolve, reject) => {
    pool.query(
      "INSERT INTO users(username,role,email,password,client_profile_id) VALUES (?,?,?,?,?)",
      [username, role, email, password, companyId],
      (err, result) => {
        if (err) {
          return reject(err);
        }
        return resolve({ statu: "200", message: "saving successful" });
      }
    );
  });
};

crudsObj.postUser2 = (
  company_id,
  branch_id,
  username,
  password,
  role,
  category,
  email,
  notify,
  activesession,
  addproperty,
  editproperty,
  approverequests,
  delivery,
  status,
  employee_id,
  company_email,
  client_profile_id,
  user_phone,
  otp,
  signed_on
) => {
  return new Promise((resolve, reject) => {
    pool.query(
      "INSERT INTO users(company_id,branch_id,username,password,role,category,email,notify,activesession,addproperty,editproperty,approverequests,delivery,status,client_profile_id, OTP,signed_on) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)",
      [
        company_id,
        branch_id,
        username,
        password,
        role,
        category,
        email,
        notify,
        activesession,
        addproperty,
        editproperty,
        approverequests,
        delivery,
        status,
        client_profile_id,
        otp,
        signed_on,
      ],
      (err, result) => {
        if (err) {
          return reject(err);
        }

        console.log(user_phone);
        console.log(email);

        const originalUrl = `https://sms.vas.co.zw/client/api/sendmessage?apikey=e28bb49ae7204dfe&mobiles=${user_phone}&sms=Hi ${username}! Your Tell Them Message Service account has been activated, you can proceed to login. Your first time password is ${otp}&senderid=softworks`;
        //const originalUrl = `http://196.43.100.209:8901/teleoss/sendsms.jsp?user=Softwork&password=Soft@012&mobiles=${user_phone}&sms=Hi ${username}! Your Tell Them Message Service account has been activated, you can proceed to login. Your first time password is ${otp}&unicode=1&clientsmsid=10001&senderid=Softwork`;
        const response = axios.get(originalUrl);

        return resolve({ status: "200", message: "saving successful" });
      }
    );
  });
};

crudsObj.getUsers = () => {
  return new Promise((resolve, reject) => {
    pool.query("SELECT * FROM users", (err, results) => {
      if (err) {
        return reject(err);
      }
      return resolve(results);
    });
  });
};

crudsObj.getUserById = (userId) => {
  return new Promise((resolve, reject) => {
    pool.query(
      "SELECT * FROM users WHERE userid = ?",
      [userId],
      (err, results) => {
        if (err) {
          return reject(err);
        }
        return resolve(results);
      }
    );
  });
};

crudsObj.getUserByCred = (email, password) => {
  return new Promise((resolve, reject) => {
    pool.query(
      "SELECT * FROM users WHERE email = ? AND password = ?",
      [email, password],
      (err, results) => {
        if (err) {
          return reject(err);
        }
        return resolve(results);
      }
    );
  });
};

//Get User By Email
crudsObj.getUserByEmail = (email) => {
  return new Promise((resolve, reject) => {
    pool.query(
      "SELECT * FROM users WHERE email = ?",
      [email],
      (err, results) => {
        if (err) {
          return reject(err);
        }
        return resolve(results);
      }
    );
  });
};

crudsObj.getUserByOtp = (email, otp) => {
  return new Promise((resolve, reject) => {
    pool.query(
      "SELECT * FROM users WHERE email = ? AND OTP = ?",
      [email, otp],
      (err, results) => {
        if (err) {
          return reject(err);
        }
        return resolve(results);
      }
    );
  });
};

//Update OTP
crudsObj.updateOTPStatus = (id, otp) => {
  return new Promise((resolve, reject) => {
    pool.query(
      "UPDATE users SET OTP = ? = ? WHERE userid = ?",
      [otp, id],
      (err, result) => {
        if (err) {
          return reject(err);
        }
        return resolve({ status: "200", message: "update successful" });
      }
    );
  });
};

//Update OTP
crudsObj.updatePasswordStatus = (id, otp) => {
  return new Promise((resolve, reject) => {
    pool.query(
      "UPDATE users SET password = ? WHERE userid = ?",
      [otp, id],
      (err, result) => {
        if (err) {
          return reject(err);
        }
        return resolve({ status: "200", message: "update successful" });
      }
    );
  });
};

crudsObj.updateUser = (
  id,
  company_id,
  branch_id,
  username,
  password,
  role,
  category,
  email,
  notify,
  activesession,
  addproperty,
  editproperty,
  approverequests,
  delivery,
  status,
  client_profile_id
) => {
  return new Promise((resolve, reject) => {
    pool.query(
      "UPDATE users SET company_id = ? ,branch_id = ? ,username = ? ,password = ? ,role = ? ,category = ? ,email = ? ,notify = ? ,activesession = ? ,addproperty = ? ,editproperty = ? ,approverequests = ? ,delivery = ? ,status = ? ,client_profile_id = ? WHERE userid = ?",
      [
        company_id,
        branch_id,
        username,
        password,
        role,
        category,
        email,
        notify,
        activesession,
        addproperty,
        editproperty,
        approverequests,
        delivery,
        status,
        client_profile_id,
        id,
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

crudsObj.deleteUser = (id) => {
  return new Promise((resolve, reject) => {
    pool.query("DELETE FROM users WHERE userid = ?", [id], (err, results) => {
      if (err) {
        return reject(err);
      }
      return resolve(results);
    });
  });
};

//update usersstatus
crudsObj.updateUserStatus = (userid, updatedValues) => {
  const { status } = updatedValues; // Only extract membershipstatus

  return new Promise((resolve, reject) => {
    pool.query(
      `UPDATE users SET 
        status = ?
      WHERE userid = ?`,
      [status, userid], // Only pass the necessary parameters
      (err, result) => {
        if (err) {
          return reject(err);
        }
        return resolve({ status: "200", message: "Update successful" });
      }
    );
  });
};

module.exports = crudsObj;

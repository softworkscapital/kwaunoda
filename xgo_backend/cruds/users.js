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
      "INSERT INTO users(userid, username, password, role, email, notify, activesession, addproperty, editproperty, approverequests, delivery, status, employee_id, company_id, branch_id, sync_status, last_logged_account, driver_id, customerid, otp, signed_up_on, last_logged_in, last_activity_date_time, last_fin_activity_date_time, referral_code, reference_payment_status, referred_by) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
      [
        user.userId,
        user.username,
        user.password,
        user.role,
        user.email,
        user.notify,
        user.activeSession,
        user.addProperty,
        user.editProperty,
        user.approveRequests,
        user.delivery,
        user.status,
        user.employeeId,
        user.companyId,
        user.branchId,
        user.syncStatus,
        user.last_logged_account,
        user.driverId,
        user.customerId,
        user.otp,
        user.signed_up_on,
        user.last_logged_in,
        user.last_activity_date_time,
        user.last_fin_activity_date_time, 
        user.referral_code, 
        user.reference_payment_status,
        user.referred_by 
      ],
      (err, result) => {
        if (err) {
          return reject(err);
        }
        return resolve({
          status: "200",
          message: "Your account has been created successfully. Now verify your phone number via the OTP sent to your mobile.",
        });
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
  // console.log(password);
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
  signed_up_on
) => {
  return new Promise((resolve, reject) => {
    pool.query(
      "INSERT INTO users(company_id,branch_id,username,password,role,category,email,notify,activesession,addproperty,editproperty,approverequests,delivery,status,client_profile_id, OTP,signed_up_on) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)",
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
        signed_up_on,
      ],
      (err, result) => {
        if (err) {
          return reject(err);
        }

        // console.log(user_phone);
        // console.log(email);

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



//Get User By Reference Code
crudsObj.getUserByReferenceCode = (referenceCode) => {
  return new Promise((resolve, reject) => {
    pool.query(
      "SELECT * FROM users WHERE referral_code = ?",
      [referenceCode],
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

//Update OTP status
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

// Update OTP
crudsObj.updateOTP = (userId, otp) => {
  return new Promise((resolve, reject) => {
    pool.query(
      "UPDATE users SET OTP = ? WHERE userid = ?",
      [otp, userId],
      (err, result) => {
        if (err) {
          return reject(err);
        }
        if (result.affectedRows === 0) {
          return reject(new Error("No user found with this ID"));
        }
        return resolve({
          status: "200",
          message: "OTP updated successfully",
        });
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

crudsObj.updateLastLoggedIn = (userid) => {
  const currentDate = new Date();
  currentDate.setHours(currentDate.getHours() + 2); // Add 2 hours
  const formattedDate = currentDate
    .toISOString()
    .slice(0, 19)
    .replace("T", " "); // Format the date

  console.log("Updating last_logged_in to:", formattedDate, "for userid:", userid);

  return new Promise((resolve, reject) => {
    pool.query(
      `UPDATE users SET last_logged_in = ? WHERE userid = ?`,
      [formattedDate, userid], // Correctly pass the parameters
      (err, result) => {
        if (err) {
          console.error("Error updating database:", err);
          return reject(err);
        }
        console.log(result);
        if (result.affectedRows === 0) {
          return resolve({ status: "404", message: "User not found" });
        }
        return resolve({ status: "200", message: "Update successful", result });
      }
    );
  });
};

crudsObj.updateLastActivityDateTime = (userid) => {

  const currentDate = new Date();
  currentDate.setHours(currentDate.getHours() + 2); // Add 2 hours
  const formattedDate = currentDate
    .toISOString()
    .slice(0, 19)
    .replace("T", " "); // Format the date
  console.log(formattedDate);
  const datefor = formattedDate;  // Only extract membershipstatus

  return new Promise((resolve, reject) => {
    pool.query(
      `UPDATE users SET 
        last_activity_date_time = ?
      WHERE userid = ?`,
      [formattedDate,userid], // Only pass the necessary parameters
      (err, result) => {
        if (err) {
          return reject(err);
        }
        return resolve({ status: "200", message: "Update successful", result });
      }
    );
  });
};

module.exports = crudsObj;

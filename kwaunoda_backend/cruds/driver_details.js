require("dotenv").config();
const pool = require("./poolfile");

let crudsObj = {};

crudsObj.postDriver = (
  driver_id,
  ecnumber,
  account_type,
  signed_on,
  username,
  name,
  surname,
  idnumber,
  sex,
  dob,
  address,
  house_number_and_street_name,
  surbub,
  city,
  country,
  lat_cordinates,
  long_cordinates,
  phone,
  plate,
  email,
  password,
  employer,
  workindustry,
  workaddress,
  workphone,
  workphone2,
  nok1name,
  nok1surname,
  nok1relationship,
  nok1phone,
  nok2name,
  nok2surname,
  nok2relationship,
  nok2phone,
  rating,
  credit_bar_rule_exception,
  membershipstatus,
  defaultsubs,
  sendmail,
  sendsms,
  product_code,
  cost_price,
  selling_price,
  payment_style,
  profilePic,
  id_image,
  number_plate_image,
  vehicle_license_image,
  driver_license_image
) => {
  return new Promise((resolve, reject) => {
    pool.query(
      `INSERT INTO driver_details (
                driver_id, ecnumber, account_type, signed_on, username, name, surname, idnumber, sex, dob,
                address, house_number_and_street_name, surbub, city, country, lat_cordinates, long_cordinates,
                phone, plate, email, password, employer, workindustry, workaddress, workphone, workphone2,
                nok1name, nok1surname, nok1relationship, nok1phone, nok2name, nok2surname, nok2relationship, nok2phone,
                rating, credit_bar_rule_exception, membershipstatus, defaultsubs, sendmail, sendsms, product_code,
                cost_price, selling_price, payment_style, profilePic, id_image, number_plate_image,
                vehicle_license_image, driver_license_image
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        driver_id,
        ecnumber,
        account_type,
        signed_on,
        username,
        name,
        surname,
        idnumber,
        sex,
        dob,
        address,
        house_number_and_street_name,
        surbub,
        city,
        country,
        lat_cordinates,
        long_cordinates,
        phone,
        plate,
        email,
        password,
        employer,
        workindustry,
        workaddress,
        workphone,
        workphone2,
        nok1name,
        nok1surname,
        nok1relationship,
        nok1phone,
        nok2name,
        nok2surname,
        nok2relationship,
        nok2phone,
        rating,
        credit_bar_rule_exception,
        membershipstatus,
        defaultsubs,
        sendmail,
        sendsms,
        product_code,
        cost_price,
        selling_price,
        payment_style,
        profilePic,
        id_image,
        number_plate_image,
        vehicle_license_image,
        driver_license_image,
      ],
      (err, result) => {
        if (err) {
          return reject(err);
        }
        return resolve({ status: "200", message: "Your account has been created successfully, Now verify your phone number via the OTP sent to your mobile" });
      }
    );
  });
};

crudsObj.getDrivers = () => {
  return new Promise((resolve, reject) => {
    pool.query("SELECT * FROM driver_details", (err, results) => {
      if (err) {
        return reject(err);
      }
      return resolve(results);
    });
  });
};

crudsObj.getDriverById = (driver_id) => {
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

crudsObj.getDriverByEmail = (driver_email) => {
  return new Promise((resolve, reject) => {
    pool.query(
      "SELECT * FROM driver_details WHERE email = ?",
      [driver_email],
      (err, results) => {
        if (err) {
          return reject(err);
        }
        return resolve(results);
      }
    );
  });
};

crudsObj.updateDriver = (driverid, updatedValues) => {
  const {
    driver_id,
    ecnumber,
    account_type,
    signed_on,
    username,
    name,
    surname,
    idnumber,
    sex,
    dob,
    address,
    house_number_and_street_name,
    surbub,
    city,
    country,
    lat_cordinates,
    long_cordinates,
    phone,
    plate,
    email,
    password,
    employer,
    workindustry,
    workaddress,
    workphone,
    workphone2,
    nok1name,
    nok1surname,
    nok1relationship,
    nok1phone,
    nok2name,
    nok2surname,
    nok2relationship,
    nok2phone,
    rating,
    credit_bar_rule_exception,
    membershipstatus,
    defaultsubs,
    sendmail,
    sendsms,
    product_code,
    cost_price,
    selling_price,
    payment_style,
    profilePic,
    id_image,
    number_plate_image,
    vehicle_license_image,
    driver_license_image,
  } = updatedValues;

  return new Promise((resolve, reject) => {
    pool.query(
      `UPDATE driver_details SET 
                driver_id = ?,ecnumber = ?, account_type = ?, signed_on = ?, username = ?, name = ?, surname = ?, 
                idnumber = ?, sex = ?, dob = ?, address = ?, house_number_and_street_name = ?, 
                surbub = ?, city = ?, country = ?, lat_cordinates = ?, long_cordinates = ?, 
                phone = ?, plate = ?, email = ?, password = ?, employer = ?, 
                workindustry = ?, workaddress = ?, workphone = ?, workphone2 = ?, 
                nok1name = ?, nok1surname = ?, nok1relationship = ?, nok1phone = ?, 
                nok2name = ?, nok2surname = ?, nok2relationship = ?, nok2phone = ?, rating = ?, 
                credit_bar_rule_exception = ?, membershipstatus = ?, defaultsubs = ?, sendmail = ?, 
                sendsms = ?, product_code = ?, cost_price = ?, selling_price = ?, 
                payment_style = ?, profilePic = ?, id_image = ?, number_plate_image = ?, 
                vehicle_license_image = ?, driver_license_image = ?
            WHERE driver_id = ?`,
      [
        driver_id,
        ecnumber,
        account_type,
        signed_on,
        username,
        name,
        surname,
        idnumber,
        sex,
        dob,
        address,
        house_number_and_street_name,
        surbub,
        city,
        country,
        lat_cordinates,
        long_cordinates,
        phone,
        plate,
        email,
        password,
        employer,
        workindustry,
        workaddress,
        workphone,
        workphone2,
        nok1name,
        nok1surname,
        nok1relationship,
        nok1phone,
        nok2name,
        nok2surname,
        nok2relationship,
        nok2phone,
        rating,
        credit_bar_rule_exception,
        membershipstatus,
        defaultsubs,
        sendmail,
        sendsms,
        product_code,
        cost_price,
        selling_price,
        payment_style,
        profilePic,
        id_image,
        number_plate_image,
        vehicle_license_image,
        driver_license_image,
        driverid,
      ],
      (err, result) => {
        if (err) {
          return reject(err);
        }
        return resolve({ status: "200", message: "Update successful" });
      }
    );
  });
};

crudsObj.deleteDriver = (id) => {
  return new Promise((resolve, reject) => {
    pool.query(
      "DELETE FROM driver_details WHERE driver_id = ?",
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

// New method for updating coordinates
crudsObj.updateDriverCoordinates = (
  driverid,
  lat_cordinates,
  long_cordinates
) => {
  return new Promise((resolve, reject) => {
    pool.query(
      `UPDATE driver_details SET 
                lat_cordinates = ?, long_cordinates = ?
            WHERE driver_id = ?`,
      [lat_cordinates, long_cordinates, driverid],
      (err, result) => {
        if (err) {
          return reject(err);
        }
        return resolve({
          status: "200",
          message: "Coordinates updated successfully",
        });
      }
    );
  });
};





crudsObj.getDriverByStatus = (status) => {
  return new Promise((resolve, reject) => {
    pool.query(
      "SELECT * FROM driver_details WHERE membershipstatus = ?",
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



// Driver Crud update
  crudsObj.updateDriverStatus = (driverid, updatedValues) => {
    const { membershipstatus } = updatedValues; // Only extract membershipstatus
  
    return new Promise((resolve, reject) => {
      pool.query(
        `UPDATE driver_details SET 
          membershipstatus = ?
        WHERE driver_id = ?`,
        [membershipstatus, driverid], // Only pass the necessary parameters
        (err, result) => {
          if (err) {
            return reject(err);
          }
          return resolve({ status: "200", message: "Update successful" });
        }
      );
    });
  };




  //update account_type using driver_id on the driver_details table
crudsObj.updateDriverAccountType = (driver_id, updatedValues) => {
  const { account_category } = updatedValues; // Only extract membershipstatus

  return new Promise((resolve, reject) => {
    pool.query(
      `UPDATE driver_details SET 
        account_category = ?
      WHERE driver_id = ?`,
      [account_category, driver_id], // Only pass the necessary parameters
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

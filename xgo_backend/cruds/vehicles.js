require("dotenv").config();
const pool = require("./poolfile");

let crudsObj = {};

crudsObj.postVehicle = (
    number_plate,
    driver_id,
    vehicle_make,
    vehicle_model,
    colour,
    vehicle_license_image,
    vehicle_image1,
    vehicle_image2,
    vehicle_image3,
    vehicle_category,
    vehicle_year,
    vehicle_count	,
    vehicle_type
) => {
  return new Promise((resolve, reject) => {
    pool.query(
      `INSERT INTO vehicles(
            number_plate,
            driver_id,
            vehicle_make,
            vehicle_model,
            colour,
            vehicle_license_image,
            vehicle_image1,
            vehicle_image2,
            vehicle_image3,
            vehicle_category,
            vehicle_year,
            vehicle_count	,
            vehicle_type
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,?)`,
      [
        number_plate,
        driver_id,
        vehicle_make,
        vehicle_model,
        colour,
        vehicle_license_image,
        vehicle_image1,
        vehicle_image2,
        vehicle_image3,
        vehicle_category,
        vehicle_year,
        vehicle_count	,
        vehicle_type
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

crudsObj.getVehicles = () => {
  return new Promise((resolve, reject) => {
    pool.query("SELECT * FROM vehicles", (err, results) => {
      if (err) {
        return reject(err);
      }
      return resolve(results);
    });
  });
};

crudsObj.getVehicleById = (number_plate) => {
  return new Promise((resolve, reject) => {
    pool.query(
      "SELECT * FROM vehicles WHERE number_plate = ?",
      [number_plate],
      (err, results) => {
        if (err) {
          return reject(err);
        }
        return resolve(results);
      }
    );
  });
};



crudsObj.getVehicleByDriverId = (driver_id) => {
  return new Promise((resolve, reject) => {
    pool.query(
      "SELECT * FROM vehicles WHERE driver_id = ?",
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


crudsObj.updateVehicle = (number_plate, updatedValues) => {
  const {
    
    driver_id,
    vehicle_make,
    vehicle_model,
    colour,
    vehicle_license_image,
    vehicle_image1,
    vehicle_image2,
    vehicle_image3,
    vehicle_category,
    vehicle_year,
    vehicle_count,
    vehicle_type	
  } = updatedValues;

  return new Promise((resolve, reject) => {
    pool.query(
      `UPDATE vehicles SET 
               
    driver_id =?,
    vehicle_make =?,
    vehicle_model =?,
    colour =?,
    vehicle_license_image =?,
    vehicle_image1 =?,
    vehicle_image2 =?,
    vehicle_image3 =?,
    vehicle_category =?,
    vehicle_year =?,
    vehicle_count =?	,
    vehicle_type =? 
            WHERE number_plate = ?`,
      [
        
    driver_id,
    vehicle_make,
    vehicle_model,
    colour,
    vehicle_license_image,
    vehicle_image1,
    vehicle_image2,
    vehicle_image3,
    vehicle_category,
    vehicle_year,
    vehicle_count,
    vehicle_type ,
    number_plate

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

crudsObj.deleteVehicle = (id) => {
  return new Promise((resolve, reject) => {
    pool.query(
      "DELETE FROM number_plate WHERE number_plate = ?",
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

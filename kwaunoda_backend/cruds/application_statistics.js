require("dotenv").config();
const pool = require("./poolfile");

let crudsObj = {};
crudsObj.postStatistic = (application_statistic_id) => {
  let datefor = "";
  let kms_billed = "";
  let customers_count = "";
  let drivers_count = "";
  let trips_count = "";
  let trips_per_customer = "";
  let billed_amount_usd = "";
  let average_trip_rate_usd = "";
  let mode_rate_usd = "";
  let average_billed = "";
  let new_customer_count = "";
  let new_drivers_count = "";
  let complaints_count = "";
  let total_rating_count = "";
  let ave_rating_count = "";
  let driver_open_balance = "";
  let driver_top_up = "";
  let driver_billed_charges = "";
  let driver_withdrawals = "";
  let driver_escrow = "";
  let driver_promo = "";
  let driver_deductions = "";
  let driver_additions = "";
  let driver_close_balance = "";
  let customer_open_balance = "";
  let customer_to_up = "";
  let customer_billed_charges = "";
  let customer_withdrawals = "";
  let customer_escrow = "";
  let customer_promo = "";
  let customer_deduction = "";
  let customer_additions = "";
  let customer_close_balance = "56.678";
  let company_open_balance = "789.00";
  let company_income_from_charges = "5.67";
  let company_promotions = "2322.56";
  let company_withdraws_out = "24564.7";
  let company_close_balance = "4646";

  return new Promise((resolve, reject) => {
      // Creating current day and populating datefor
      const currentDate = new Date();
      currentDate.setHours(currentDate.getHours() + 2); // Add 2 hours
      const formattedDate = currentDate.toISOString().slice(0, 19).replace('T', ' '); // Format the date
      console.log(formattedDate);
      datefor = formattedDate; // Assign to datefor

      // Calculating distance billed for the day
      pool.query("SELECT SUM(distance) AS total_distance FROM trip", (err, results) => {
          if (err) {
              return reject(err);
          }
          console.log("Total Distance:", results); // Log the result
          kms_billed = results[0].total_distance || 0; // Default to 0 if no distance is found

          // Customer counts
          pool.query("SELECT COUNT(customerid) AS total_customers FROM customer_details", (err, results) => {
              if (err) {
                  return reject(err);
              }
              console.log("Total Customers:", results[0].total_customers);
              customers_count = results[0].total_customers;

              // Driver counts                
              pool.query("SELECT COUNT(driver_id) AS total_drivers FROM driver_details", (err, results) => {
                  if (err) {
                      return reject(err);
                  }
                  console.log("Total Drivers:", results[0].total_drivers);
                  drivers_count = results[0].total_drivers;

                  // Trip counts
                  pool.query("SELECT COUNT(trip_id) AS total_trips FROM trip", (err, results) => {
                      if (err) {
                          return reject(err);
                      }
                      console.log("Total Trips:", results[0].total_trips);
                      trips_count = results[0].total_trips;

                      // Trips per customer
                      trips_per_customer = customers_count > 0 ? (trips_count / customers_count) : 0;
                      console.log("Trips per Customer:", trips_per_customer);

                      // // Average rating
                      pool.query("SELECT AVG(customer_stars + driver_stars) AS total_average FROM trip", (err, results) => {
                          if (err) {
                              return reject(err);
                          }
                          console.log("Average Rating:", results[0].total_average);
                          average_billed = results[0].total_average || 0;

                          // Average trip rate
                          pool.query("SELECT AVG(accepted_cost) AS total_average FROM trip", (err, results) => {
                              if (err) {
                                  return reject(err);
                              }
                              console.log("Total Average Accepted Cost:", results[0].total_average);
                              average_trip_rate_usd = results[0].total_average || 0;

                              // Mode of accepted cost
                              // pool.query("SELECT MODE(accepted_cost) FROM trip GROUP BY accepted_cost ORDER BY COUNT(*) DESC LIMIT 1", (err, results) => {
                              //     if (err) {
                              //         return reject(err);
                              //     }
                              //     mode_rate_usd = results[0] ? results[0].accepted_cost : 0;

                                  // New customer count
                                  pool.query("SELECT COUNT(customerid) AS total_count FROM customer_details", (err, results) => {
                                      if (err) {
                                          return reject(err);
                                      }
                                      new_customer_count = results[0].total_count || 0;

                                      // New drivers count
                                      pool.query("SELECT COUNT(driver_id) AS total_count FROM driver_details", (err, results) => {
                                          if (err) {
                                              return reject(err);
                                          }
                                          new_drivers_count = results[0].total_count || 0;

                                          // Complaints count
                                          pool.query("SELECT COUNT(conversation_support_id) AS total_count FROM conversation_support", (err, results) => {
                                              if (err) {
                                                  return reject(err);
                                              }
                                              complaints_count = results[0].total_count || 0;

                                              // Total rating count
                                              pool.query("SELECT SUM(customer_stars + driver_stars) AS total_sum FROM trip", (err, results) => {
                                                  if (err) {
                                                      return reject(err);
                                                  }
                                                  total_rating_count = results[0].total_sum || 0;

                                                  // Average rating count
                                                  pool.query("SELECT  AVG(customer_stars + driver_stars) AS average_rating FROM trip",(err,results) => {
                                                      if (err) {
                                                          return reject(err);
                                                      }
                                                      ave_rating_count = results[0].average_rating || 0;

                                                      // Driver open balance
                                                      // pool.query("SELECT SUM(balance) AS total_open_balance FROM driver_balances", (err, results) => { // Adjust this query based on your actual table
                                                      //     if (err) {
                                                      //         return reject(err);
                                                      //     }
                                                      //     driver_open_balance = results[0].total_open_balance || 0;

                                                          // Proceed with the insert query
                                                          pool.query(
                                                              `INSERT INTO application_statistics (
                                                                  datefor,
                                                                  kms_billed,
                                                                  customers_count,
                                                                  drivers_count,
                                                                  trips_count,
                                                                  trips_per_customer,
                                                                  billed_amount_usd,
                                                                  average_trip_rate_usd,
                                                                  mode_rate_usd,
                                                                  average_billed,
                                                                  new_customer_count,
                                                                  new_drivers_count,
                                                                  complaints_count,
                                                                  total_rating_count,
                                                                  ave_rating_count,
                                                                  driver_open_balance,
                                                                  driver_top_up,
                                                                  driver_billed_charges,
                                                                  driver_withdrawals,
                                                                  driver_escrow,
                                                                  driver_promo,
                                                                  driver_deductions,
                                                                  driver_additions,
                                                                  driver_close_balance,
                                                                  customer_open_balance,
                                                                  customer_to_up,
                                                                  customer_billed_charges,
                                                                  customer_withdrawals,
                                                                  customer_escrow,
                                                                  customer_promo,
                                                                  customer_deduction,
                                                                  customer_additions,
                                                                  customer_close_balance,
                                                                  company_open_balance,
                                                                  company_income_from_charges,
                                                                  company_promotions,
                                                                  company_withdraws_out,
                                                                  company_close_balance
                                                              ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?,
                                                                  ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,
                                                                  ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,
                                                                  ?, ?, ?, ?, ?, ?, ?, ?)`,
                                                              [
                                                                  datefor,
                                                                  kms_billed,
                                                                  customers_count,
                                                                  drivers_count,
                                                                  trips_count,
                                                                  trips_per_customer,
                                                                  billed_amount_usd,
                                                                  average_trip_rate_usd,
                                                                  mode_rate_usd,
                                                                  average_billed,
                                                                  new_customer_count,
                                                                  new_drivers_count,
                                                                  complaints_count,
                                                                  total_rating_count,
                                                                  ave_rating_count,
                                                                  driver_open_balance,
                                                                  driver_top_up,
                                                                  driver_billed_charges,
                                                                  driver_withdrawals,
                                                                  driver_escrow,
                                                                  driver_promo,
                                                                  driver_deductions,
                                                                  driver_additions,
                                                                  driver_close_balance,
                                                                  customer_open_balance,
                                                                  customer_to_up,
                                                                  customer_billed_charges,
                                                                  customer_withdrawals,
                                                                  customer_escrow,
                                                                  customer_promo,
                                                                  customer_deduction,
                                                                  customer_additions,
                                                                  customer_close_balance,
                                                                  company_open_balance,
                                                                  company_income_from_charges,
                                                                  company_promotions,
                                                                  company_withdraws_out,
                                                                  company_close_balance
                                                              ],
                                                              (err, result) => {
                                                                  if (err) {
                                                                      return reject(err);
                                                                  }
                                                                  return resolve({ status: 200, message: "Saving successful", result });
                                                              }
                                                          );
                                                      });
                                                  });
                                              });
                                          });
                                      });
                                  });
                              });
                          });
                      });
                  
              });
          });
        });
  
};

crudsObj.getStatistics = () => {
  return new Promise((resolve, reject) => {
    pool.query("SELECT * FROM application_statistics", (err, results) => {
      if (err) {
        return reject(err);
      }
      return resolve(results);
    });
  });
};

crudsObj.getStatisticById = (application_statistic_id ) => {
    return new Promise((resolve, reject) => {
        pool.query(
            "SELECT * FROM application_statistics WHERE application_statistic_id  = ? ",
            [application_statistic_id ],
            (err, results) => {
                if (err) {
                    return reject(err);
                }
                return resolve(results);
            }
        );
    });
};



crudsObj.updateStatistic = (application_statistic_id, updatedValues) => {
  const {
      datefor,
      kms_billed,
      customers_count,
      drivers_count,
      trips_count,
      trips_per_customer,
      billed_amount_usd,
      average_trip_rate_usd,
      mode_rate_usd,
      average_billed,
      new_customer_count,
      new_drivers_count,
      complaints_count,
      total_rating_count,
      ave_rating_count,
      driver_open_balance,
      driver_top_up,
      driver_billed_charges,
      driver_withdrawals,
      driver_escrow,
      driver_promo,
      driver_deductions,
      driver_additions,
      driver_close_balance,
      customer_open_balance,
      customer_to_up,
      customer_billed_charges,
      customer_withdrawals,
      customer_escrow,
      customer_promo,
      customer_deduction,
      customer_additions,
      customer_close_balance,
      company_open_balance,
      company_income_from_charges,
      company_promotions,
      company_withdraws_out,
      company_close_balance,
  } = updatedValues;

  console.log("Updating record with ID:", application_statistic_id);
  console.log("Updated values:", updatedValues);

  return new Promise((resolve, reject) => {
      pool.query(
          `UPDATE application_statistics SET 
              datefor =?,
              kms_billed =?,
              customers_count =?,
              drivers_count =?,
              trips_count =?,
              trips_per_customer =?,
              billed_amount_usd =?,
              average_trip_rate_usd =?,
              mode_rate_usd =?,
              average_billed =?,
              new_customer_count =?,
              new_drivers_count =?,
              complaints_count =?,
              total_rating_count =?,
              ave_rating_count =?,
              driver_open_balance =?,
              driver_top_up =?,
              driver_billed_charges =?,
              driver_withdrawals =?,
              driver_escrow =?,
              driver_promo =?,
              driver_deductions =?,
              driver_additions =?,
              driver_close_balance =?,
              customer_open_balance =?,
              customer_to_up =?,
              customer_billed_charges =?,
              customer_withdrawals =?,
              customer_escrow =?,
              customer_promo =?,
              customer_deduction =?,
              customer_additions =?,
              customer_close_balance =?,
              company_open_balance =?,
              company_income_from_charges =?,
              company_promotions =?,
              company_withdraws_out =?,
              company_close_balance =?
          WHERE application_statistic_id = ?`,
          [
              datefor,
              kms_billed,
              customers_count,
              drivers_count,
              trips_count,
              trips_per_customer,
              billed_amount_usd,
              average_trip_rate_usd,
              mode_rate_usd,
              average_billed,
              new_customer_count,
              new_drivers_count,
              complaints_count,
              total_rating_count,
              ave_rating_count,
              driver_open_balance,
              driver_top_up,
              driver_billed_charges,
              driver_withdrawals,
              driver_escrow,
              driver_promo,
              driver_deductions,
              driver_additions,
              driver_close_balance,
              customer_open_balance,
              customer_to_up,
              customer_billed_charges,
              customer_withdrawals,
              customer_escrow,
              customer_promo,
              customer_deduction,
              customer_additions,
              customer_close_balance,
              company_open_balance,
              company_income_from_charges,
              company_promotions,
              company_withdraws_out,
              company_close_balance,
              application_statistic_id // Ensure this is passed as last parameter
          ],
          (err, result) => {
              if (err) {
                  console.error("Error updating statistic:", err);
                  return reject(err);
              }
              if (result.affectedRows === 0) {
                  return resolve({
                      status: "404",
                      message: "Statistic not found or no changes made",
                  });
              }
              return resolve({ status: 200, message: "Update successful", result });
          }
      );
  });
};


crudsObj.deleteStatistic= (id) => {
  return new Promise((resolve, reject) => {
    pool.query(
      "DELETE FROM application_statistics WHERE application_statistic_id  = ?",
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

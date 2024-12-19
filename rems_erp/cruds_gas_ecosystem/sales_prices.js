require("dotenv").config();
const pool = require("../cruds_gas_ecosystem/poolfile");

let crudsObj = {};

// Post a new sales price
crudsObj.postSalesPrice = (
  sales_prices_id,
  item,
  price,
  changed_by,
  changed_on,
  branch_id,
  company_id,
  sync_date_time,
  sync_id,
  sync_status
) => {
  return new Promise((resolve, reject) => {
    pool.query(
      `INSERT INTO sales_prices (
                sales_prices_id,
                item,
                price,
                changed_by,
                changed_on,
                branch_id,
                company_id,
                sync_date_time,
                sync_id,
                sync_status
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?,?)`,
      [
        sales_prices_id,
        item,
        price,
        changed_by,
        changed_on,
        branch_id,
        company_id,
        sync_date_time,
        sync_id,
        sync_status
      ],
      (err, result) => {
        if (err) {
          console.error("Database error:", err.message);
          return reject(err);
        }
        return resolve({ status: "200", message: "Saving successful" });
      }
    );
  });
};

// Get all sales prices
crudsObj.getSalesPrices = () => {
  return new Promise((resolve, reject) => {
    pool.query("SELECT * FROM sales_prices", (err, results) => {
      if (err) {
        return reject(err);
      }
      return resolve(results);
    });
  });
};

// Get sales price by ID
crudsObj.getSalesPricesById = (id) => {
  return new Promise((resolve, reject) => {
    pool.query(
      "SELECT * FROM sales_prices WHERE sales_prices_id = ?",
      [id],
      (err, results) => {
        if (err) {
          return reject(err);
        }
        return resolve(results.length > 0 ? results[0] : null);
      }
    );
  });
};
crudsObj.getSalesPricesByBranchCompany = (branch_id, company_id) => {
  return new Promise((resolve, reject) => {
    pool.query(
      "SELECT * FROM sales_prices WHERE branch_id = ? AND company_id = ? ORDER BY changed_on DESC", // Sort by changed_on
      [branch_id, company_id],
      (err, results) => {
        if (err) {
          console.error("Database error:", err.message); // Log error message for debugging
          return reject(err);
        }
        console.log("Query Results:", results); // Log results for debugging
        return resolve(results); // Resolve with all matching results
      }
    );
  });
};

crudsObj.getSalesPricesLastPriceByBranchCompany = (branch_id, company_id) => {
  return new Promise((resolve, reject) => {
    pool.query(
      "SELECT * FROM sales_prices WHERE branch_id = ? AND company_id = ? ORDER BY changed_on DESC LIMIT 10",
      [branch_id, company_id],
      (err, results) => {
        if (err) {
          console.error("Database error:", err.message); // Log error message for debugging
          return reject(err);
        }
        // Log results for debugging
        console.log("Query Results:", results);
        return resolve(results.length > 0 ? results : null); // Return null if no results found
      }
    );
  });
};

// Update a sales price
crudsObj.updateSalesPrice = (
  sales_prices_id,
  item,
  price,
  changed_by,
  changed_on,
  branch_id,
  company_id,
  sync_id
) => {
  return new Promise((resolve, reject) => {
    pool.query(
      `UPDATE sales_prices SET 
                 item =?,
                 price =?,
                 changed_by =?,
                 changed_on =?,
                 branch_id =?,
                 company_id =?,
                 sync_id =?
            WHERE sales_prices_id = ?`,
      [
        item,
        price,
        changed_by,
        changed_on,
        branch_id,
        company_id,
        sync_id,
        sales_prices_id,
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

// Delete a sales price
crudsObj.deleteSalesPrice = (id) => {
  return new Promise((resolve, reject) => {
    pool.query(
      "DELETE FROM sales_prices WHERE sales_prices_id = ?",
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

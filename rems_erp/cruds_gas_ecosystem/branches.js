require("dotenv").config();
const pool = require("./poolfile");

let crudsObj = {};

crudsObj.postBranch = (
  branch_name,
  branch_location,
  branch_location_notes,
  branch_city,
  latitude,
  longitude,
  company_id,
  company_name,
  enrolled_on,
  enrolled_by,
  phone,
  email,
  sync_interval,
  branch_reorder_level_kgs,
  auto_branch_reorder_status,
  inventory_level,
  inventory_storage_capacity,
  rems_subscription_id,
  transactions_volume_limit_kgs,
  expiry_date
) => {
  return new Promise((resolve, reject) => {
    pool.query(
      "INSERT INTO branches(branch_name,branch_location, branch_location_notes, branch_city, latitude, longitude, company_id, company_name, enrolled_on, enrolled_by, phone, email, sync_interval, branch_reorder_level_kgs, auto_branch_reorder_status, inventory_level, inventory_storage_capacity, rems_subscription_id, transactions_volume_limit_kgs, expiry_date) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)",
      [
        branch_name,
        branch_location,
        branch_location_notes,
        branch_city,
        latitude,
        longitude,
        company_id,
        company_name,
        enrolled_on,
        enrolled_by,
        phone,
        email,
        sync_interval,
        branch_reorder_level_kgs,
        auto_branch_reorder_status,
        inventory_level,
        inventory_storage_capacity,
        rems_subscription_id,
        transactions_volume_limit_kgs,
        expiry_date,
      ],
      (err, result) => {
        if (err) {
          return reject(err);
        }
        return resolve({ statu: "200", message: "saving successful" });
      }
    );
  });
};

crudsObj.getBranches = () => {
  return new Promise((resolve, reject) => {
    pool.query("SELECT * FROM branches", (err, results) => {
      if (err) {
        return reject(err);
      }
      return resolve(results);
    });
  });
};

crudsObj.getBranchesByCompanyId = (company_id) => {
  return new Promise((resolve, reject) => {
    const query = `
            SELECT branch_id, branch_name, multi_sync_control_status 
            FROM branches 
            WHERE company_id = ?`;

    pool.query(query, [company_id], (err, results) => {
      if (err) {
        return reject(err);
      }
      // Log the multi_sync_control_status for each branch
      results.forEach((branch) => {
        console.log(
          `Branch ID: ${branch.branch_id}, Status: ${branch.multi_sync_control_status}`
        );
      });
      return resolve(results);
    });
  });
};



crudsObj.getBranchNameByBranchId = (branch_id) => {
  return new Promise((resolve, reject) => {
    pool.query(
      "SELECT branch_name FROM branches WHERE branch_id = ?",
      [branch_id],
      (err, results) => {
        console.log(branch_id);
        if (err) {
          return reject(err);
        }
        return resolve(results);
      }
    );
  });
};

crudsObj.getBranchStatusByBranchId = (branch_id) => {
  return new Promise((resolve, reject) => {
    pool.query(
      "SELECT multi_sync_control_status FROM branches WHERE branch_id = ?",
      [branch_id],
      (err, results) => {
        console.log(branch_id);
        if (err) {
          return reject(err);
        }
        return resolve(results);
      }
    );
  });
};

crudsObj.getBranchById = (branch_id) => {
  return new Promise((resolve, reject) => {
    pool.query(
      "SELECT * FROM branches WHERE branch_id = ?",
      [branch_id],
      (err, results) => {
        if (err) {
          return reject(err);
        }
        return resolve(results);
      }
    );
  });
};

crudsObj.updateBranch = (
  id,
  branch_name,
  branch_location,
  branch_location_notes,
  branch_city,
  latitude,
  longitude,
  company_id,
  company_name,
  enrolled_on,
  enrolled_by,
  phone,
  email,
  sync_interval,
  branch_reorder_level_kgs,
  auto_branch_reorder_status,
  inventory_level,
  inventory_storage_capacity,
  rems_subscription_id,
  transactions_volume_limit_kgs,
  expiry_date
) => {
  return new Promise((resolve, reject) => {
    pool.query(
      "UPDATE branches SET branch_name = ? ,branch_location = ? , branch_location_notes = ? , branch_city = ? , latitude = ? , longitude = ? , company_id = ? , company_name = ? , enrolled_on = ? , enrolled_by = ? , phone = ? , email = ? , sync_interval = ? , branch_reorder_level_kgs = ? , auto_branch_reorder_status = ? , inventory_level = ? , inventory_storage_capacity = ? , rems_subscription_id = ? , transactions_volume_limit_kgs = ? , expiry_date = ? WHERE branch_id = ?",
      [
        branch_name,
        branch_location,
        branch_location_notes,
        branch_city,
        latitude,
        longitude,
        company_id,
        company_name,
        enrolled_on,
        enrolled_by,
        phone,
        email,
        sync_interval,
        branch_reorder_level_kgs,
        auto_branch_reorder_status,
        inventory_level,
        inventory_storage_capacity,
        rems_subscription_id,
        transactions_volume_limit_kgs,
        expiry_date,
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

crudsObj.deleteBranch = (id) => {
  return new Promise((resolve, reject) => {
    pool.query(
      "DELETE FROM users WHERE branch_id = ?",
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

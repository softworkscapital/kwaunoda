require("dotenv").config();
const pool = require("./poolfile");

let crudsObj = {};

crudsObj.postBillingTarrif = (account_type, rate) => {
    return new Promise((resolve, reject) => {
      pool.query(
        `INSERT INTO billing_tarrifs (
          account_type,
          rate
        ) VALUES (?, ?)`,
        [account_type, rate],
        (err, result) => {
          if (err) {
            return reject(err);
          }
          return resolve({ status: "200", message: "saving successful", result });
        }
      );
    });
  };

crudsObj.getBillingTarrifs = () => {
  return new Promise((resolve, reject) => {
    pool.query("SELECT * FROM billing_tarrifs", (err, results) => {
      if (err) {
        return reject(err);
      }
      return resolve(results);
    });
  });
};





module.exports = crudsObj;

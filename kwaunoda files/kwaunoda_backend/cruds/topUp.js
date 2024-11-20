require("dotenv").config();

const pool = require("./poolfile");
let crudsObj = {};

//crud get TopUps all
crudsObj.getTopUp = () => {
  return new Promise((resolve, reject) => {
    pool.query(
      "SELECT * FROM top_up ORDER BY top_up_id DESC",
      (err, results) => {
        if (err) {
          return reject(err);
        }
        return resolve({ results });
      }
    );
  });
};

//crud get admin bal
crudsObj.getAdminBlance = () => {
  return new Promise((resolve, reject) => {
    pool.query(
      "SELECT total_balance, total_usage FROM top_up ORDER BY top_up_id DESC LIMIT 1",
      (err, results) => {
        if (err) {
          return reject(err);
        }
        return resolve({ results });
      }
    );
  });
};

//crud get top up by id
crudsObj.getTopUpById = (top_up_id) => {
  return new Promise((resolve, reject) => {
    pool.query(
      "SELECT * FROM top_up WHERE top_up_id =?",
      [top_up_id],
      (err, results) => {
        if (err) {
          return reject(err);
        }
        return resolve(results);
      }
    );
  });
};
//crud get top up by client_id
crudsObj.getTopUpByClientId = (client_profile_id) => {
  return new Promise((resolve, reject) => {
    pool.query(
      "SELECT * FROM top_up WHERE client_profile_id = ? ORDER BY top_up_id DESC;",
      [client_profile_id],
      (err, results) => {
        if (err) {
          return reject(err);
        }
        return resolve(results);
      }
    );
  });
};

// get last topUp by client profile id
crudsObj.getLastTopUpById = (client_profile_id) => {
  return new Promise((resolve, reject) => {
    pool.query(
      "SELECT balance FROM top_up WHERE client_profile_id =? ORDER BY top_up_id DESC LIMIT 1",
      [client_profile_id],
      (err, results) => {
        if (err) {
          return reject(err);
        }
        return resolve({ results });
      }
    );
  });
};

//crud post TopUp
crudsObj.postTopUp = (
  currency,
  exchange_rate,
  date,
  debit,
  credit,
  balance,
  description,
  client_profile_id
) => {
  return new Promise((resolve, reject) => {
    //Get Total Balance
    pool.query(
      "SELECT total_balance, total_usage FROM top_up ORDER BY top_up_id DESC LIMIT 1",
      (err, results) => {
        if (err) {
          return reject(err);
        }
        var getTotalBal = results[0].total_balance;
        var getTotalUsage = results[0].total_usage;
        var totalBal = parseFloat(getTotalBal) + parseFloat(debit);

        pool.query(
          "INSERT INTO top_up (currency,exchange_rate,date,debit,credit,balance,description,client_profile_id,total_balance,total_usage) VALUES (?,?,?,?,?,?,?,?,?,?)",
          [
            currency,
            exchange_rate,
            date,
            debit,
            credit,
            balance,
            description,
            client_profile_id,
            totalBal,
            getTotalUsage,
          ],
          (err, results) => {
            if (err) {
              return reject(err);
            }
            return resolve([{ status: "200", message: "saving sucessful" }]);
          }
        );
      }
    );
  });
};

//crud put TopUp
crudsObj.putTopUp = (
  top_up_id,
  currency,
  exchange_rate,
  amount,
  balance,
  description,
  client_profile_id
) => {
  return new Promise((resolve, reject) => {
    pool.query(
      "UPDATE top_up SET currency=?, exchange_rate=?, amount=?, balance=?,description=?, client_profile_id=? WHERE top_up_id=?",
      [
        currency,
        exchange_rate,
        amount,
        balance,
        description,
        client_profile_id,
        top_up_id,
      ],
      (err, results) => {
        if (err) {
          return reject(err);
        }
        return resolve({ status: "200", message: "saving sucessful" });
      }
    );
  });
};

//crud delete TopUps by id
crudsObj.deleteTopUpById = (top_up_id) => {
  return new Promise((resolve, reject) => {
    pool.query(
      "DELETE FROM top_up WHERE top_up_id =?",
      [top_up_id],
      (err, results) => {
        if (err) {
          return reject(err);
        }
        return resolve({ results });
      }
    );
  });
};
crudsObj.postCrTopUp = (cr, trip_id, client_profile_id, desc, trxn_code) => {
  return new Promise((resolve, reject) => {
    // First query to get the latest total balance, total usage, and escroll
    pool.query(
      "SELECT total_balance, total_usage, escroll FROM top_up ORDER BY top_up_id DESC LIMIT 1",
      (err, balanceUsageResults) => {
        if (err) {
          return reject(err);
        }

        // Check if any transactions exist for total balance and usage
        if (balanceUsageResults.length === 0) {
          return resolve([{ status: "404", message: "No available balance." }]);
        }

        const {
          total_balance: oldTotalBalance,
          total_usage: oldTotalUsage,
          escroll: oldEscroll,
        } = balanceUsageResults[0];

        // Second query to fetch the latest transaction details for the client
        pool.query(
          "SELECT * FROM top_up WHERE client_profile_id = ? ORDER BY top_up_id DESC LIMIT 1",
          [client_profile_id],
          (err, clientResults) => {
            if (err) {
              return reject(err);
            }

            // Check if any transactions exist for the client
            if (clientResults.length === 0) {
              return resolve([
                { status: "404", message: "No balance found for this client." },
              ]);
            }

            // Retrieve client-specific details
            const clientTransaction = clientResults[0];
            const clientBalance = parseFloat(clientTransaction.balance);

            // Calculate new balances
            const newClientBalance = clientBalance - cr; // Client's new balance
            const newTotalBalance = oldTotalBalance - cr; // Updated total balance
            const newEscroll = parseFloat(oldEscroll) + cr; // Updated escroll
            const currentDate = new Date()
              .toISOString()
              .slice(0, 19)
              .replace("T", " "); // Format date

            // Check if the new client balance is non-negative
            if (newClientBalance < 0) {
              return resolve([
                {
                  status: "400",
                  message: "Insufficient balance after withdrawal.",
                },
              ]);
            }

            // Insert new transaction
            pool.query(
              "INSERT INTO top_up (currency, exchange_rate, date, credit, debit, balance, description, client_profile_id, total_balance, total_usage, escroll, trip_id, trxn_code) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,?,?)",
              [
                "USD",
                1.0,
                currentDate,
                cr,
                0,
                newClientBalance,
                desc,
                client_profile_id,
                newTotalBalance,
                oldTotalUsage, // Keep oldTotalUsage as it is
                newEscroll,
                trip_id, // Updated total usage
                trxn_code, //
              ],
              (err, insertResults) => {
                if (err) {
                  return reject(err);
                }
                return resolve([
                  { status: "200", message: "Saving successful." },
                ]);
              }
            );
          }
        );
      }
    );
  });
};
crudsObj.postDrTopUp = (dr, trip_id, client_profile_id, desc, trxn_code) => {
  return new Promise((resolve, reject) => {
    // First query to get the latest total balance, total usage, and escroll
    pool.query(
      "SELECT total_balance, total_usage, escroll FROM top_up ORDER BY top_up_id DESC LIMIT 1",
      (err, balanceUsageResults) => {
        if (err) {
          return reject(err);
        }

        // Check if any transactions exist for total balance and usage
        if (balanceUsageResults.length === 0) {
          return resolve([{ status: "404", message: "No available balance." }]);
        }

        const {
          total_balance: oldTotalBalance,
          total_usage: oldTotalUsage,
          escroll: oldEscroll,
        } = balanceUsageResults[0];

        // Second query to fetch the latest transaction details for the client
        pool.query(
          "SELECT * FROM top_up WHERE client_profile_id = ? ORDER BY top_up_id DESC LIMIT 1",
          [client_profile_id],
          (err, clientResults) => {
            if (err) {
              return reject(err);
            }

            let clientBalance = 0; // Default to 0 if no previous records
            let initialClientRecord = false; // Flag to check if we are creating an initial record

            // Check if any transactions exist for the client
            if (clientResults.length > 0) {
              // Retrieve client-specific details
              const clientTransaction = clientResults[0];
              clientBalance = parseFloat(clientTransaction.balance);
            } else {
              // No previous transactions for the client, we will create an initial record
              initialClientRecord = true;
            }

            // Calculate new balances
            const usageIncrease = dr * 0.1;
            const dr_f = dr - usageIncrease;
            const newClientBalance = clientBalance + dr; // Update client balance
            const newTotalBalance = oldTotalBalance + dr; // Update total balance
            const newTotalUsage = oldTotalUsage; // Update total usage
            const newEscroll = parseFloat(oldEscroll) - dr; // Updated escroll decreases by dr
            const currentDate = new Date()
              .toISOString()
              .slice(0, 19)
              .replace("T", " "); // Format date

            // Check if the new escroll goes negative
            if (newEscroll < 0) {
              return resolve([
                {
                  status: "400",
                  message: "Insufficient escroll after withdrawal.",
                },
              ]);
            }

            // Prepare the insert query
            const insertQuery = `
                INSERT INTO top_up (currency, exchange_rate, date, credit, debit, balance, description, client_profile_id, total_balance, total_usage, escroll, trip_id, trxn_code)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,?,?)
              `;

            let insertValues;

            // Determine the values to insert based on whether it's an initial record
            if (initialClientRecord) {
              insertValues = [
                "USD",
                1.0,
                currentDate,
                0, // No credit in debit transaction
                dr,
                dr, // Initial balance is just the top-up amount
                desc,
                client_profile_id,
                newTotalBalance, // Updated total balance
                newTotalUsage, // Updated total usage
                newEscroll,
                trip_id, // Updated total usage
                trxn_code, //
              ];
            } else {
              insertValues = [
                "USD",
                1.0,
                currentDate,
                0, // No credit in debit transaction
                dr,
                newClientBalance, // Client's new balance
                desc,
                client_profile_id,
                newTotalBalance, // Updated total balance
                newTotalUsage, // Updated total usage
                newEscroll, // Updated escroll
                trip_id, // Updated total usage
                trxn_code, //
              ];
            }

            // Execute the insert query
            pool.query(insertQuery, insertValues, (err, insertResults) => {
              if (err) {
                return reject(err);
              }
              return resolve([
                { status: "200", message: "Saving successful." },
              ]);
            });

            pool.query(
              "INSERT INTO top_up (currency, exchange_rate, date, credit, debit, balance, description, client_profile_id, total_balance, total_usage, escroll, trip_id, trxn_code) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,?,?)",
              [
                "USD",
                1.0,
                currentDate,
                usageIncrease,
                0,
                newClientBalance - usageIncrease,
                "Service Commission",
                client_profile_id,
                newTotalBalance - usageIncrease,
                oldTotalUsage + usageIncrease, // Keep oldTotalUsage as it is
                newEscroll,
                trip_id, // Updated total usage
                "comm", //
              ],
              (err, insertResults) => {
                if (err) {
                  return reject(err);
                }
                return resolve([
                  { status: "200", message: "Saving successful." },
                ]);
              }
            );
          }
        );
      }
    );
  });
};
module.exports = crudsObj;

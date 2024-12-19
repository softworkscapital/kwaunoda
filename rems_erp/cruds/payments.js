require('dotenv').config();
const pool = require('./poolfile');

let crudsObj = {};

crudsObj.payments = () => {
    return new Promise((resolve, reject) => {
        pool.query('SELECT * FROM fin_acc_revenue_accounts', (err, results) => {
            if (err) {
                return reject(err);
            }
            return resolve(results);
        })
    })
};


module.exports = crudsObj;
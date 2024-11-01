require('dotenv').config();
const pool = require('./poolfile');

let crudsObj = {};

crudsObj.postCounter = (
    counter_offer_id,
    customerid,
    driver_id,
    trip_id,
    date_time,
    offer_value,
    counter_offer_value,
    status,
) => {
    return new Promise((resolve, reject) => {
        pool.query(
            `INSERT INTO counter_offer (
                customerid, driver_id, trip_id, date_time, offer_value, counter_offer_value, status
            ) VALUES ( ?, ?, ?, ?, ?, ?, ?)`,
            [
                counter_offer_id,
                customerid,
                driver_id,
                trip_id,
                date_time,
                offer_value,
                counter_offer_value,
                status,
            ],
            (err, result) => {
                if (err) {
                    return reject(err);
                }
                return resolve({ status: '200', message: 'saving successful' });
            }
        );
    });
};

crudsObj.getCounters = () => {
    return new Promise((resolve, reject) => {
        pool.query('SELECT * FROM counter_offer', (err, results) => {
            if (err) {
                return reject(err);
            }
            return resolve(results);
        });
    });
};

crudsObj.getCounterById = (counter_offer_id) => {
    return new Promise((resolve, reject) => {
        pool.query('SELECT * FROM counter_offer WHERE counter_offer_id = ?', [counter_offer_id], (err, results) => {
            if (err) {
                return reject(err);
            }
            return resolve(results);
        });
    });
};

crudsObj.updateCounter = (counter_offer_id, updatedValues) => {
    const {
        customerid,
        driver_id,
        trip_id,
        date_time,
        offer_value,
        counter_offer_value,
        status,
    } = updatedValues;

    return new Promise((resolve, reject) => {
        pool.query(
            `UPDATE counter_offer SET  
                customerid = ?, driver_id = ?, trip_id = ?, date_time = ?, 
                offer_value = ?, counter_offer_value = ?, status = ? 
            WHERE counter_offer_id = ?`,
            [
                customerid,
                driver_id,
                trip_id,
                date_time,
                offer_value,
                counter_offer_value,
                status,
                counter_offer_id, // Include counter_offer_id here
            ],
            (err, result) => {
                if (err) {
                    return reject(err);
                }
                return resolve({ status: '200', message: 'update successful' });
            }
        );
    });
};

crudsObj.deleteCounter = (counter_offer_id) => {
    return new Promise((resolve, reject) => {
        pool.query('DELETE FROM counter_offer WHERE counter_offer_id = ?', [counter_offer_id], (err, results) => {
            if (err) {
                return reject(err);
            }
            return resolve(results);
        });
    });
};

module.exports = crudsObj;

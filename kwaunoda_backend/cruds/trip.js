require('dotenv').config();
const pool = require('./poolfile');

let crudsObj = {};

crudsObj.postTrip = (
    driver_id,
    cust_id,
    order_start_time,
    start_date_time,
    status,
    deliveray_details,
    weight,
    delivery_contact_details,
    dest_location,
    origin_location,
    origin_location_lat,
    origin_location_long,
    destination_lat,
    destination_long,
    distance,
    delivery_cost_proposed,
    accepted_cost,
    payment_type,
    currency_id,
    currency_code,
    usd_rate,
    customer_comment,
    driver_comment,
    driver_stars
) => {
    return new Promise((resolve, reject) => {
        pool.query(
            `INSERT INTO trip (
             driver_id, cust_id, order_start_time, start_date_time, status, deliveray_details, weight, 
             delivery_contact_details, dest_location, origin_location, 
             origin_location_lat, origin_location_long, destination_lat, 
             destination_long, distance, delivery_cost_proposed, 
             accepted_cost, payment_type, currency_id, currency_code, usd_rate, customer_comment, driver_comment, driver_stars
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                driver_id,
                cust_id,
                order_start_time,
                start_date_time,
                status,
                deliveray_details,
                weight,
                delivery_contact_details,
                dest_location,
                origin_location,
                origin_location_lat,
                origin_location_long,
                destination_lat,
                destination_long,
                distance,
                delivery_cost_proposed,
                accepted_cost,
                payment_type,
                currency_id,
                currency_code,
                usd_rate,
                customer_comment,
                driver_comment,
                driver_stars
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


crudsObj.getTrips = () => {
    return new Promise((resolve, reject) => {
        pool.query('SELECT * FROM trip', (err, results) => {
            if (err) {
                return reject(err);
            }
            return resolve(results);
        });
    });
};

crudsObj.getTripById = (trip_id) => {
    return new Promise((resolve, reject) => {
        pool.query('SELECT * FROM trip WHERE trip_id = ?', [trip_id], (err, results) => {
            if (err) {
                return reject(err);
            }
            return resolve(results);
        });
    });
};

crudsObj.getTripByStatus = () => {
    return new Promise((resolve, reject) => {
        pool.query('SELECT * FROM trip WHERE status = "Pending" OR status = "In Transit"', (err, results) => {
            if (err) {
                return reject(err);
            }
            return resolve(results);
        });
    });
};

crudsObj.updateTrip = (trip_id, updatedValues) => {
    const {
        driver_id,
        cust_id,
        order_start_time,
        start_date_time,
        status,
        deliveray_details,
        weight,
        delivery_contact_details,
        dest_location,
        origin_location,
        origin_location_lat,
        origin_location_long,
        destination_lat,
        destination_long,
        distance,
        delivery_cost_proposed,
        accepted_cost,
        payment_type,
        currency_id,
        currency_code,
        usd_rate,
        customer_comment,
        driver_comment,
        driver_stars
    } = updatedValues;

    return new Promise((resolve, reject) => {
        pool.query(
            `UPDATE trip SET 
                driver_id = ?, cust_id = ?, order_start_time = ?, start_date_time = ?, status = ?, 
                deliveray_details = ?, weight = ?, delivery_contact_details = ?, 
                dest_location = ?, origin_location = ?, 
                origin_location_lat = ?, origin_location_long = ?, 
                destination_lat = ?, destination_long = ?, 
                distance = ?, delivery_cost_proposed = ?, 
                accepted_cost = ?, payment_type = ?, 
                currency_id = ?, currency_code = ?,
                usd_rate = ?, customer_comment = ?, 
                driver_comment = ?, driver_stars = ? 
            WHERE trip_id = ?`,
            [
                driver_id,
                cust_id,
                order_start_time,
                start_date_time,
                status,
                deliveray_details,
                weight,
                delivery_contact_details,
                dest_location,
                origin_location,
                origin_location_lat,
                origin_location_long,
                destination_lat,
                destination_long,
                distance,
                delivery_cost_proposed,
                accepted_cost,
                payment_type,
                currency_id,
                currency_code,
                usd_rate,
                customer_comment,
                driver_comment,
                driver_stars,
                trip_id // This is the value for WHERE clause
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

crudsObj.deleteTrip = (id) => {
    return new Promise((resolve, reject) => {
        pool.query('DELETE FROM trip WHERE trip_id= ?', [id], (err, results) => {
            if (err) {
                return reject(err);
            }
            return resolve(results);
        });
    });
};

module.exports = crudsObj;

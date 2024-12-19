require('dotenv').config();
const pool = require('../cruds_gas_ecosystem/poolfile');

let crudsObj = {};

crudsObj.postMkt_place_payment = (
    product_id,
    buyer_company_id,
    buyer_branch_id,
    buyer_user_id,
    seller_company_id,
    seller_branch_id,
    seller_user_id,
    datefor,
    timefor,
    description,
    volume_purchased,
    total_amount_paid,
    currency,
    cost_per_unit,
    metric_measurement,
    location,
    transport_rate,
    product_type
) => {
    return new Promise((resolve, reject) => {
        pool.query(
            `INSERT INTO mkt_place_payments (
                product_id,
                buyer_company_id,
                buyer_branch_id,
                buyer_user_id,
                seller_company_id,
                seller_branch_id,
                seller_user_id,
                datefor,
                timefor,
                description,
                volume_purchased,
                total_amount_paid,
                currency,
                cost_per_unit,
                metric_measurement,
                location,
                transport_rate,
                product_type
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                product_id,
                buyer_company_id,
                buyer_branch_id,
                buyer_user_id,
                seller_company_id,
                seller_branch_id,
                seller_user_id,
                datefor,
                timefor,
                description,
                volume_purchased,
                total_amount_paid,
                currency,
                cost_per_unit,
                metric_measurement,
                location,
                transport_rate,
                product_type
            ],
            (err, result) => {
                if (err) {
                    return reject(err);
                }
                resolve({ status: '200', message: 'Saving successful', result });
            }
        );
    });
};

crudsObj.getMkt_place_payments = () => {
    return new Promise((resolve, reject) => {
        pool.query('SELECT * FROM mkt_place_payments', (err, results) => {
            if (err) {
                return reject(err);
            }
            return resolve(results);
        });
    });
};

crudsObj.getMkt_place_paymentById = (mkt_place_payment_id) => {
    return new Promise((resolve, reject) => {
        pool.query('SELECT * FROM mkt_place_payments WHERE mkt_place_payment_id = ?', [mkt_place_payment_id], (err, results) => {
            if (err) {
                return reject(err);
            }
            return resolve(results);
        });
    });
};

crudsObj.updateMkt_place_payment = (
    mkt_place_payment_id,
    product_id,
    buyer_company_id,
    buyer_branch_id,
    buyer_user_id,
    seller_company_id,
    seller_branch_id,
    seller_user_id,
    datefor,
    timefor,
    description,
    volume_purchased,
    total_amount_paid,
    currency,
    cost_per_unit,
    metric_measurement,
    location,
    transport_rate,
    product_type
) => {
    return new Promise((resolve, reject) => {
        pool.query(
            `UPDATE mkt_place_payments SET 
                product_id = ?,
                buyer_company_id = ?,
                buyer_branch_id = ?,
                buyer_user_id = ?,
                seller_company_id = ?,
                seller_branch_id = ?,
                seller_user_id = ?,
                datefor = ?,
                timefor = ?,
                description = ?,
                volume_purchased = ?,
                total_amount_paid = ?,
                currency = ?,
                cost_per_unit = ?,
                metric_measurement = ?,
                location = ?,
                transport_rate = ?,
                product_type = ?
            WHERE mkt_place_payment_id = ?`,
            [
                product_id,
                buyer_company_id,
                buyer_branch_id,
                buyer_user_id,
                seller_company_id,
                seller_branch_id,
                seller_user_id,
                datefor,
                timefor,
                description,
                volume_purchased,
                total_amount_paid,
                currency,
                cost_per_unit,
                metric_measurement,
                location,
                transport_rate,
                product_type,
                mkt_place_payment_id
            ],
            (err, result) => {
                if (err) {
                    console.error('Error updating payment:', err);
                    return reject(err);
                }
                if (result.affectedRows === 0) {
                    return resolve({ status: '404', message: 'Payment not found or no changes made' });
                }
                return resolve({ status: '200', message: 'Update successful', result });
            }
        );
    });
};

crudsObj.deleteMkt_place_payment = (id) => {
    return new Promise((resolve, reject) => {
        pool.query('DELETE FROM mkt_place_payments WHERE mkt_place_payment_id = ?', [id], (err, results) => {
            if (err) {
                return reject(err);
            }
            return resolve(results);
        });
    });
};

module.exports = crudsObj;
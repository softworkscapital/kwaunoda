require('dotenv').config();
const pool = require('./poolfile');

let crudsObj = {};

crudsObj.postSaleRecord = (company_id, branch_id, datetime, sale_list_item_id, amnt_paid, currency, receipt_total, amount_paid, amount_change, rate_to_usd, receipt_total_usd_euquivalance, syncid) => {
    return new Promise((resolve, reject) => {
        pool.query('INSERT INTO sale_records( company_id, branch_id, datetime, sale_list_item_id,	amnt_paid,	currency, receipt_total, amount_paid, amount_change, rate_to_usd, receipt_total_usd_euquivalance, syncid) VALUES (?,?,?,?,?,?,?,?,?,?,?,?)', [company_id, branch_id, datetime, sale_list_item_id, amnt_paid, currency, receipt_total, amount_paid, amount_change, rate_to_usd, receipt_total_usd_euquivalance, syncid], (err, result) => {
            if (err) {
                return reject(err);
            }
            return resolve({ status: '200', message: 'saving successful' });
        })
    })
};

crudsObj.getSaleRecords = () => {
    return new Promise((resolve, reject) => {
        pool.query('SELECT * FROM sale_records', (err, results) => {
            if (err) {
                return reject(err);
            }
            return resolve(results);
        })
    })
};

// getClentById
crudsObj.getSaleRecordById = (id) => {
    return new Promise((resolve, reject) => {
        pool.query('SELECT * FROM sale_records WHERE sale_records_id = ?', [id], (err, results) => {
            if (err) {
                return reject(err);
            }
            return resolve(results);
        })
    })
};

crudsObj.updateSaleRecord = (sale_records_id, company_id, branch_id, datetime, sale_list_item_id, amnt_paid, currency, receipt_total, amount_paid, amount_change, rate_to_usd, receipt_total_usd_euquivalance, syncid) => {
    return new Promise((resolve, reject) => {
        pool.query(
            'UPDATE sale_records SET company_id = ?, branch_id = ?, datetime = ?, sale_list_item_id = ?, amnt_paid = ?,	currency = ?, receipt_total = ?, amount_paid = ?, amount_change = ?, rate_to_usd = ?, receipt_total_usd_euquivalance = ?, syncid = ? WHERE sale_records_id = ?',
            [company_id, branch_id, datetime, sale_list_item_id, amnt_paid, currency, receipt_total, amount_paid, amount_change, rate_to_usd, receipt_total_usd_euquivalance, syncid, sale_records_id],
            (err, result) => {
                if (err) {
                    return reject(err);
                }
                return resolve({ status: '200', message: 'update successful' });
            }
        );
    });
};

crudsObj.deleteSaleRecord = (id) => {
    return new Promise((resolve, reject) => {
        pool.query('DELETE FROM sale_records WHERE sale_records_id = ?', [id], (err, results) => {
            if (err) {
                return reject(err);
            }
            return resolve(results);
        })
    })
};

module.exports = crudsObj;
require('dotenv').config();
const pool = require('./poolfile');

let crudsObj = {};

crudsObj.postCostCenter = (costCenterName, costCenterSummary) => {
    return new Promise((resolve, reject) => {
        pool.query('INSERT INTO fin_acc_account_cost_center(cost_center_name, cost_center_summary) VALUES (?,?)', [ costCenterName, costCenterSummary], (err, result) => {
            if (err) {
                return reject(err);
            }
            return resolve({ statu: '200', message: 'saving successful' });
        })
    })
};

crudsObj.getCostCenters = () => {
    return new Promise((resolve, reject) => {
        pool.query('SELECT * FROM fin_acc_account_cost_center', (err, results) => {
            if (err) {
                return reject(err);
            }
            return resolve(results);
        })
    })
};

crudsObj.getCostCenterById = (id) => {
    return new Promise((resolve, reject) => {
        pool.query('SELECT * FROM fin_acc_account_cost_center WHERE fin_acc_account_cost_centers_id = ?', [id], (err, results) => {
            if (err) {
                return reject(err);
            }
            return resolve(results);
        })
    })
};

crudsObj.updateCostCenter = (costCenterId, costCenterName, costCenterSummary) => {
    return new Promise((resolve, reject) => {
        pool.query(
            'UPDATE fin_acc_account_cost_center SET cost_center_name = ?, cost_center_summary = ? WHERE fin_acc_account_cost_centers_id = ?',
            [ costCenterName, costCenterSummary, costCenterId],
            (err, result) => {
                if (err) {
                    return reject(err);
                }
                console.log(costCenterId)
                console.log(costCenterName)
                console.log(costCenterSummary)
                return resolve({ status: '200', message: 'update successful' });
            }
        );
    });
};

crudsObj.deleteCostCenter = (id) => {
    return new Promise((resolve, reject) => {
        pool.query('DELETE FROM fin_acc_account_cost_center WHERE fin_acc_account_cost_centers_id = ?', [id], (err, results) => {
            if (err) {
                return reject(err);
            }
            return resolve(results);
        })
    })
};

module.exports = crudsObj;
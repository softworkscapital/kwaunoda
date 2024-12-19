require('dotenv').config();
const pool = require('./poolfile');

let crudsObj = {};

crudsObj.postProject = ( projectCode, projectName, projectSummary, createdOn, createdBy) => {
    return new Promise((resolve, reject) => {
        pool.query('INSERT INTO fin_acc_account_project(project_code, project_name, project_summary, project_created_on, project_created_by) VALUES (?,?,?,?,?)', [ projectCode, projectName, projectSummary, createdOn, createdBy ], (err, result) => {
            if (err) {
                return reject(err);
            }
            return resolve({ statu: '200', message: 'saving successful' });
        })
    })
};

crudsObj.getProjects = () => {
    return new Promise((resolve, reject) => {
        pool.query('SELECT * FROM fin_acc_account_project ORDER BY fin_acc_account_project_id DESC', (err, results) => {
            if (err) {
                return reject(err);
            }
            return resolve(results);
        })
    })
};

crudsObj.getProjectById = (id) => {
    return new Promise((resolve, reject) => {
        pool.query('SELECT * FROM fin_acc_account_project WHERE fin_acc_account_project_id = ?', [id], (err, results) => {
            if (err) {
                return reject(err);
            }
            return resolve(results);
        })
    })
};

crudsObj.getProjectByName = (name) => {
    return new Promise((resolve, reject) => {
        pool.query('SELECT * FROM fin_acc_account_project WHERE index_acc_name= ?', [name], (err, results) => {
            if (err) {
                return reject(err);
            }
            return resolve(results);
        })
    })
};

crudsObj.updateProject = (id, indexAccId, indexAccName, dualTransAccName, dualTransAccNameId, accountMapId, accountLink, datePaid, dateFor, accountDescription, costCenter, debitCash, creditCash, debitBank, creditBank, paymentMode, accountCurrency, rateToUSD, rateOnValue, accountValue, requestBy, isConfirmed, isAuthorized, isCommitted, transactionReference, flag, commnent, accountName) => {
    return new Promise((resolve, reject) => {
        pool.query(
            'UPDATE fin_acc_account_project SET index_acc_name = ?, index_acc_name_id = ?, dual_trans_acc_name_id = ?, dual_trans_acc_name = ?, fin_acc_account_map_id = ?, link = ?, datepaid = ?, datefor = ?, description = ?, cost_center = ?, debit_cash = ?, credit_cash = ?, debit_bank = ?, credit_bank = ?, pmode = ?, currency = ?, rate_to_usd = ?, rate_on_value = ?, value = ?, requester = ?, confirmed = ?, authorized = ?, comitted = ?, txn_reference = ?, flag = ?, comment = ?, acc_name = ? WHERE fin_acc_account_project_id = ?',
            [ indexAccId, indexAccName, dualTransAccName, dualTransAccNameId, accountMapId, accountLink, datePaid, dateFor, accountDescription, costCenter, debitCash, creditCash, debitBank, creditBank, paymentMode, accountCurrency, rateToUSD, rateOnValue, accountValue, requestBy, isConfirmed, isAuthorized, isCommitted, transactionReference, flag, commnent, accountName, id],
            (err, result) => {
                if (err) {
                    return reject(err);
                }
                return resolve({ status: '200', message: 'update successful' });
            }
        );
    });
};

crudsObj.deleteProject = (id) => {
    return new Promise((resolve, reject) => {
        pool.query('DELETE FROM fin_acc_account_project WHERE fin_acc_account_project_id = ?', [id], (err, results) => {
            if (err) {
                return reject(err);
            }
            return resolve(results);
        })
    })
};

module.exports = crudsObj;
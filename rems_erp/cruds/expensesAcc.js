require('dotenv').config();
const pool = require('./poolfile');

let crudsObj = {};

crudsObj.postExpensesAcc = (fin_acc_account_map_id, index_acc_name_id, index_acc_name, dual_trans_acc_name_id, dual_trans_acc_name, datepaid, datefor, description, cost_center, link, currency, rate_to_usd, value, debit, credit, pmode, requester, confirmed, authorized, comitted, txn_reference, flag, comment) => {
    return new Promise((resolve, reject) => {
        pool.query('INSERT INTO fin_acc_admin_expenses_accounts(fin_acc_account_map_id, index_acc_name_id, index_acc_name, dual_trans_acc_name_id, dual_trans_acc_name, datepaid, datefor, description, cost_center, link, currency, rate_to_usd, value, debit, credit, pmode, requester, confirmed, authorized, comitted, txn_reference, flag, comment) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)', [ fin_acc_account_map_id, index_acc_name_id, index_acc_name, dual_trans_acc_name_id, dual_trans_acc_name, datepaid, datefor, description, cost_center, link, currency, rate_to_usd, value, debit, credit, pmode, requester, confirmed, authorized, comitted, txn_reference, flag, comment], (err, result) => {
            if (err) {
                return reject(err);
            }
            return resolve({ statu: '200', message: 'saving successful' });
        })
    })
};

crudsObj.getExpensesAccs = () => {
    return new Promise((resolve, reject) => {
        pool.query('SELECT * FROM fin_acc_admin_expenses_accounts', (err, results) => {
            if (err) {
                return reject(err);
            }
            return resolve(results);
        })
    })
};

crudsObj.getExpensesHistory = () => {
    return new Promise((resolve, reject) => {
        pool.query('SELECT * FROM fin_acc_admin_expenses_accounts ORDER BY fin_acc_admin_expenses_accounts_id DESC LIMIT 3;', (err, results) => {
            if (err) {
                return reject(err);
            }
            return resolve(results);
        })
    })
};

crudsObj.getExpensesAccs2 = () => {
    return new Promise((resolve, reject) => {
        pool.query('SELECT *, SUM(debit) AS total_debit FROM fin_acc_admin_expenses_accounts', (err, results) => {
            if (err) {
                return reject(err);
            }
            return resolve(results);
        });
    });
};

crudsObj.getExpensesAccById = (id) => {
    return new Promise((resolve, reject) => {
        pool.query('SELECT * FROM fin_acc_admin_expenses_accounts WHERE fin_acc_admin_expenses_accounts_id = ?', [id], (err, results) => {
            if (err) {
                return reject(err);
            }
            return resolve(results);
        })
    })
};

crudsObj.getExpensesAccByName = (name) => {
    return new Promise((resolve, reject) => {
        pool.query('SELECT * FROM fin_acc_admin_expenses_accounts WHERE fin_acc_admin_expenses_accounts_id = ?', [name], (err, results) => {
            if (err) {
                return reject(err);
            }
            return resolve(results);
        })
    })
};

crudsObj.getExpensesAccByIndexName = (name) => {
    return new Promise((resolve, reject) => {
        pool.query('SELECT * FROM fin_acc_admin_expenses_accounts WHERE index_acc_name = ?', [name], (err, results) => {
            if (err) {
                return reject(err);
            }
            return resolve(results);
        })
    })
};

crudsObj.updateExpensesAcc = (id, fin_acc_account_map_id, index_acc_name_id, index_acc_name, dual_trans_acc_name_id, dual_trans_acc_name, datepaid, datefor, description, cost_center, link, currency, rate_to_usd, value, debit, credit, pmode, requester, confirmed, authorized, comitted, txn_reference, flag, comment) => {
    return new Promise((resolve, reject) => {
        pool.query(
            'UPDATE fin_acc_admin_expenses_accounts SET fin_acc_account_map_id = ?, index_acc_name_id = ?, index_acc_name = ?, dual_trans_acc_name_id = ?, dual_trans_acc_name = ?, datepaid = ?, datefor = ?, description = ?, cost_center = ?, link = ?, currency = ?, rate_to_usd = ?, value = ?, debit = ?, credit = ?, pmode = ?, requester = ?, confirmed = ?, authorized = ?, comitted = ?, txn_reference = ?, flag = ?, comment = ? WHERE fin_acc_admin_expenses_accounts_id = ?',
            [ fin_acc_account_map_id, index_acc_name_id, index_acc_name, dual_trans_acc_name_id, dual_trans_acc_name, datepaid, datefor, description, cost_center, link, currency, rate_to_usd, value, debit, credit, pmode, requester, confirmed, authorized, comitted, txn_reference, flag, comment, id],
            (err, result) => {
                if (err) {
                    return reject(err);
                }
                return resolve({ status: '200', message: 'update successful' });
            }
        );
    });
};

crudsObj.deleteExpensesAcc = (id) => {
    return new Promise((resolve, reject) => {
        pool.query('DELETE FROM fin_acc_admin_expenses_accounts WHERE fin_acc_admin_expenses_accounts_id = ?', [id], (err, results) => {
            if (err) {
                return reject(err);
            }
            return resolve(results);
        })
    })
};

module.exports = crudsObj;
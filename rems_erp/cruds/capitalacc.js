require('dotenv').config();
const pool = require('./poolfile');

let crudsObj = {};

crudsObj.postCapitalAcc = (data) => {
    return new Promise((resolve, reject) => {
        pool.query(
            `INSERT INTO fin_acc_capital_accounts (
                acc_name, datepaid, datefor, description, 
                cost_center, map, debit_cash, credit_cash, debit_bank, credit_bank, 
                pmode, requester, confirmed, authorized, committed, txn_reference, flag, comment
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                data.acc_name,
                data.datepaid,
                data.datefor,
                data.description,
                data.cost_center,
                data.map,
                data.debit_cash,
                data.credit_cash,
                data.debit_bank,
                data.credit_bank,
                data.pmode,
                data.requester,
                data.confirmed,
                data.authorized,
                data.committed,
                data.txn_reference,
                data.flag,
                data.comment
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

crudsObj.getCapitalAccs = () => {
    return new Promise((resolve, reject) => {
        pool.query('SELECT * FROM fin_acc_capital_accounts', (err, results) => {
            if (err) {
                return reject(err);
            }
            return resolve(results);
        });
    });
};

crudsObj.getCapitalAccById = (id) => {
    return new Promise((resolve, reject) => {
        pool.query('SELECT * FROM fin_acc_capital_accounts WHERE fin_acc_capital_accountss_id = ?', [id], (err, results) => {
            if (err) {
                return reject(err);
            }
            return resolve(results);
        });
    });
};

crudsObj.updateCapitalAcc = (costCenterId, data) => {
    return new Promise((resolve, reject) => {
        pool.query(
            `UPDATE fin_acc_capital_accounts SET 
                fin_acc_bank_and_cash_accounts_id = ?, acc_name = ?, datepaid = ?, datefor = ?, 
                description = ?, cost_center = ?, map = ?, debit_cash = ?, credit_cash = ?, 
                debit_bank = ?, credit_bank = ?, pmode = ?, requester = ?, confirmed = ?, 
                authorized = ?, committed = ?, txn_reference = ?, flag = ?, comment = ? 
            WHERE fin_acc_capital_accountss_id = ?`,
            [
                data.fin_acc_bank_and_cash_accounts_id,
                data.acc_name,
                data.datepaid,
                data.datefor,
                data.description,
                data.cost_center,
                data.map,
                data.debit_cash,
                data.credit_cash,
                data.debit_bank,
                data.credit_bank,
                data.pmode,
                data.requester,
                data.confirmed,
                data.authorized,
                data.committed,
                data.txn_reference,
                data.flag,
                data.comment,
                costCenterId
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

crudsObj.deleteCapitalAcc = (id) => {
    return new Promise((resolve, reject) => {
        pool.query('DELETE FROM fin_acc_capital_accounts WHERE fin_acc_capital_accountss_id = ?', [id], (err, results) => {
            if (err) {
                return reject(err);
            }
            return resolve(results);
        });
    });
};

module.exports = crudsObj;
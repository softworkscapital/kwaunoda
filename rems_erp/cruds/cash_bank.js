require('dotenv').config();
const pool = require('./poolfile');

let crudsObj = {};

crudsObj.postCashBank = (indexAccId, indexAccName, dualTransAccName, dualTransAccNameId, accountMapId, accountLink, datePaid, dateFor, accountDescription, costCenter, debitCash, creditCash, debitBank, creditBank, paymentMode, accountCurrency, rateToUSD, rateOnValue, accountValue, requestBy, isConfirmed, isAuthorized, isCommitted, transactionReference, flag, commnent, accountName) => {
    return new Promise((resolve, reject) => {
        pool.query('INSERT INTO fin_acc_bank_and_cash_accounts(index_acc_name, index_acc_name_id, dual_trans_acc_name_id, dual_trans_acc_name, fin_acc_account_map_id, link, datepaid, datefor, description, cost_center, debit_cash, credit_cash, debit_bank, credit_bank, pmode, currency, rate_to_usd, rate_on_value, value, requester, confirmed, authorized, comitted, txn_reference, flag, comment, acc_name) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)', [ indexAccId, indexAccName, dualTransAccName, dualTransAccNameId, accountMapId, accountLink, datePaid, dateFor, accountDescription, costCenter, debitCash, creditCash, debitBank, creditBank, paymentMode, accountCurrency, rateToUSD, rateOnValue, accountValue, requestBy, isConfirmed, isAuthorized, isCommitted, transactionReference, flag, commnent, accountName], (err, result) => {
            if (err) {
                return reject(err);
            }
            return resolve({ statu: '200', message: 'saving successful' });
        })
    })
};

crudsObj.getCashBanks = () => {
    return new Promise((resolve, reject) => {
        pool.query('SELECT * FROM fin_acc_bank_and_cash_accounts ORDER BY fin_acc_account_map_id DESC', (err, results) => {
            if (err) {
                return reject(err);
            }
            return resolve(results);
        })
    })
};

crudsObj.getCashBankById = (id) => {
    return new Promise((resolve, reject) => {
        pool.query('SELECT * FROM fin_acc_bank_and_cash_accounts WHERE fin_acc_bank_and_cash_accounts_id = ?', [id], (err, results) => {
            if (err) {
                return reject(err);
            }
            return resolve(results);
        })
    })
};

crudsObj.getCashBankByName = (name) => {
    return new Promise((resolve, reject) => {
        pool.query('SELECT * FROM fin_acc_bank_and_cash_accounts WHERE index_acc_name= ?', [name], (err, results) => {
            if (err) {
                return reject(err);
            }
            return resolve(results);
        })
    })
};

crudsObj.updateCashBank = (id, indexAccId, indexAccName, dualTransAccName, dualTransAccNameId, accountMapId, accountLink, datePaid, dateFor, accountDescription, costCenter, debitCash, creditCash, debitBank, creditBank, paymentMode, accountCurrency, rateToUSD, rateOnValue, accountValue, requestBy, isConfirmed, isAuthorized, isCommitted, transactionReference, flag, commnent, accountName) => {
    return new Promise((resolve, reject) => {
        pool.query(
            'UPDATE fin_acc_bank_and_cash_accounts SET index_acc_name = ?, index_acc_name_id = ?, dual_trans_acc_name_id = ?, dual_trans_acc_name = ?, fin_acc_account_map_id = ?, link = ?, datepaid = ?, datefor = ?, description = ?, cost_center = ?, debit_cash = ?, credit_cash = ?, debit_bank = ?, credit_bank = ?, pmode = ?, currency = ?, rate_to_usd = ?, rate_on_value = ?, value = ?, requester = ?, confirmed = ?, authorized = ?, comitted = ?, txn_reference = ?, flag = ?, comment = ?, acc_name = ? WHERE fin_acc_bank_and_cash_accounts_id = ?',
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

crudsObj.deleteCashBank = (id) => {
    return new Promise((resolve, reject) => {
        pool.query('DELETE FROM fin_acc_bank_and_cash_accounts WHERE fin_acc_bank_and_cash_accounts_id = ?', [id], (err, results) => {
            if (err) {
                return reject(err);
            }
            return resolve(results);
        })
    })
};

module.exports = crudsObj;
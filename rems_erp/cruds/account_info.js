require('dotenv').config();
const pool = require('./poolfile');

let crudsObj = {};

crudsObj.postAccountInfo = (classifier, accountClass, accountCype, accountFolio, explanation) => {
    return new Promise((resolve, reject) => {
        pool.query('INSERT INTO fin_acc_account_info(classifier, fin_acc_account_class, fin_acc_account_type, fin_acc_account_folio, Explanation) VALUES (?,?,?,?,?)', [ classifier, accountClass, accountCype, accountFolio, explanation], (err, result) => {
            if (err) {
                return reject(err);
            }
            return resolve({ statu: '200', message: 'saving successful' });
        })
    })
};

crudsObj.getAccountInfos = () => {
    return new Promise((resolve, reject) => {
        pool.query('SELECT * FROM fin_acc_account_info', (err, results) => {
            if (err) {
                return reject(err);
            }
            return resolve(results);
        })
    })
};

crudsObj.getAccountInfoById = (id) => {
    return new Promise((resolve, reject) => {
        pool.query('SELECT * FROM fin_acc_account_info WHERE fin_acc_account_info_id = ?', [id], (err, results) => {
            if (err) {
                return reject(err);
            }
            return resolve(results);
        })
    })
};

crudsObj.getAccountInfoByAccType = (name) => {
    return new Promise((resolve, reject) => {
        pool.query('SELECT * FROM fin_acc_account_info WHERE fin_acc_account_type = ?', [name], (err, results) => {
            if (err) {
                return reject(err);
            }
            return resolve(results);
        })
    })
};

crudsObj.updateAccountInfo = (id, classifier, accountClass, accountType, accountFolio, explanation) => {
    return new Promise((resolve, reject) => {
        pool.query(
            'UPDATE fin_acc_account_info SET classifier = ?, fin_acc_account_class = ?, fin_acc_account_type = ?, fin_acc_account_folio = ?, Explanation = ?  WHERE fin_acc_account_info_id = ?',
            [ classifier, accountClass, accountType, accountFolio, explanation, id],
            (err, result) => {
                if (err) {
                    return reject(err);
                }
                return resolve({ status: '200', message: 'update successful' });
            }
        );
    });
};

crudsObj.deleteAccountInfo = (id) => {
    return new Promise((resolve, reject) => {
        pool.query('DELETE FROM fin_acc_account_info WHERE fin_acc_account_info_id = ?', [id], (err, results) => {
            if (err) {
                return reject(err);
            }
            return resolve(results);
        })
    })
};

module.exports = crudsObj;
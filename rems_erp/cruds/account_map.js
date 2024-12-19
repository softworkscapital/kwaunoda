require('dotenv').config();
const pool = require('./poolfile');

let crudsObj = {};

crudsObj.postAccountMap = ( accountInfoId, accountProjectId, createdOn, accountName, createdBy, isAuthorized, accountCurrency, balance) => {
    console.log('CRUD: ',accountProjectId)
    return new Promise((resolve, reject) => {
        pool.query('INSERT INTO fin_acc_account_map(fin_acc_account_info_id, fin_acc_account_project_id, created_on, acc_account_name, created_by, authorized, currency, balance ) VALUES (?,?,?,?,?,?,?,?)', [ accountInfoId, accountProjectId, createdOn, accountName, createdBy, isAuthorized, accountCurrency, balance], (err, result) => {
            if (err) {
                return reject(err);
            }
            return resolve({ statu: '200', message: 'saving successful' });
        })
    })
};

crudsObj.getAccountMaps = () => {
    return new Promise((resolve, reject) => {
        pool.query('SELECT * FROM fin_acc_account_map', (err, results) => {
            if (err) {
                return reject(err);
            }
            return resolve(results);
        })
    })
};

crudsObj.getAccountMapById = (id) => {
    return new Promise((resolve, reject) => {
        pool.query('SELECT * FROM fin_acc_account_map WHERE fin_acc_account_map_id = ?', [id], (err, results) => {
            if (err) {
                return reject(err);
            }
            return resolve(results);
        })
    })
};
crudsObj.getAccountMapsInfoById = (id) => {
    return new Promise((resolve, reject) => {
        pool.query('SELECT * FROM fin_acc_account_map WHERE fin_acc_account_info_id = ?', [id], (err, results) => {
            if (err) {
                return reject(err);
            }
            return resolve(results);
        })
    })
};
crudsObj.getAccountMapsInfo = () => {
    return new Promise((resolve, reject) => {
        // pool.query('SELECT fin_acc_account_map.*, fin_acc_account_info.classifier, fin_acc_account_info.fin_acc_account_class, fin_acc_account_info.fin_acc_account_type, fin_acc_account_info.fin_acc_account_folio, fin_acc_account_info.Explanation FROM fin_acc_account_map INNER JOIN fin_acc_account_info ON fin_acc_account_map.fin_acc_account_info_id = fin_acc_account_info.fin_acc_account_info_id', (err, results) => {
        pool.query('SELECT fin_acc_account_map.*, fin_acc_account_info.classifier, fin_acc_account_info.fin_acc_account_class, fin_acc_account_info.fin_acc_account_type, fin_acc_account_info.fin_acc_account_folio, fin_acc_account_info.Explanation FROM fin_acc_account_map INNER JOIN fin_acc_account_info ON fin_acc_account_map.fin_acc_account_info_id = fin_acc_account_info.fin_acc_account_info_id WHERE fin_acc_account_info.fin_acc_account_type = "Cash & Bank"', (err, results) => {
            if (err) {
                return reject(err);
            }
            return resolve(results);
        })
    })
};
crudsObj.getAccountMapsInfoAll = () => {
    return new Promise((resolve, reject) => {
        pool.query('SELECT fin_acc_account_map.*, fin_acc_account_info.classifier, fin_acc_account_info.fin_acc_account_class, fin_acc_account_info.fin_acc_account_type, fin_acc_account_info.fin_acc_account_folio, fin_acc_account_info.Explanation FROM fin_acc_account_map INNER JOIN fin_acc_account_info ON fin_acc_account_map.fin_acc_account_info_id = fin_acc_account_info.fin_acc_account_info_id', (err, results) => {
            if (err) {
                return reject(err);
            }
            return resolve(results);
        })
    })
};

crudsObj.getAccountMapsInfo2 = (name) => {
    return new Promise((resolve, reject) => {
        pool.query('SELECT fin_acc_account_map.*, fin_acc_account_info.classifier, fin_acc_account_info.fin_acc_account_class, fin_acc_account_info.fin_acc_account_type, fin_acc_account_info.fin_acc_account_folio, fin_acc_account_info.Explanation FROM fin_acc_account_map INNER JOIN fin_acc_account_info ON fin_acc_account_map.fin_acc_account_info_id = fin_acc_account_info.fin_acc_account_info_id WHERE fin_acc_account_info.fin_acc_account_class = ?',[name], (err, results) => {
            if (err) {
                return reject(err);
            }
            return resolve(results);
        })
    })
};

crudsObj.getAccountMapsInfo3 = () => {
    return new Promise((resolve, reject) => {
        pool.query('SELECT fin_acc_account_map.*, fin_acc_account_info.classifier, fin_acc_account_info.fin_acc_account_class, fin_acc_account_info.fin_acc_account_type, fin_acc_account_info.fin_acc_account_folio, fin_acc_account_info.Explanation FROM fin_acc_account_map INNER JOIN fin_acc_account_info ON fin_acc_account_map.fin_acc_account_info_id = fin_acc_account_info.fin_acc_account_info_id WHERE fin_acc_account_info.fin_acc_account_type = "Cash & Bank"', (err, results) => {
            if (err) {
                return reject(err);
            }
            return resolve(results);
        })
    })
};

crudsObj.getAccountMapsInfo4 = (name) => {
    return new Promise((resolve, reject) => {
        pool.query('SELECT * FROM fin_acc_account_map WHERE acc_account_name = ?', [name],(err, results) => {
            if (err) {
                return reject(err);
            }
            return resolve(results);
        })
    })
};

crudsObj.updateAccountMap = (id, accountMapId, accountInfoId, accountProjectId, createdOn, accountName, createdBy, isAuthorized, accountCurrency) => {
    return new Promise((resolve, reject) => {
        pool.query('UPDATE fin_acc_account_map SET fin_acc_account_info_id = ?, fin_acc_account_info_id = ?, fin_acc_account_project_id = ?, created_on = ?, acc_account_name = ?, created_by = ?, authorized = ?, currency = ?  WHERE fin_acc_account_map_id = ?',[accountMapId, accountInfoId, accountProjectId, createdOn, accountName, createdBy, isAuthorized, accountCurrency, id], (err, result) => {
                if (err) {
                    return reject(err);
                }
                return resolve({ status: '200', message: 'update successful' });
            }
        );
    });
};

crudsObj.deleteAccountMap = (id) => {
    return new Promise((resolve, reject) => {
        pool.query('DELETE FROM fin_acc_account_map WHERE fin_acc_account_map_id = ?', [id], (err, results) => {
            if (err) {
                return reject(err);
            }
            return resolve(results);
        })
    })
};

module.exports = crudsObj;
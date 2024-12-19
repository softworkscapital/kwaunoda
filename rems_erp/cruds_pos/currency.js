require('dotenv').config();
const pool = require('./poolfile');

let crudsObj = {};

crudsObj.postCurrency = (company_id, branch_id, code, description, rate_vs_usd, date, comitted_by)=>{

    return new Promise((resolve, reject)=>{
        pool.query('INSERT INTO currency(company_id, branch_id, code, description, rate_vs_usd, date, comitted_by) VALUES (?,?,?,?,?,?,?)',[company_id, branch_id, code, description, rate_vs_usd, date, comitted_by], (err, result)=>{
            if(err){
                return reject(err);
            }
            return resolve({statu:'200', message: 'saving successful'});
        })
    })
};
crudsObj.getCurrency = ()=>{
    return new Promise((resolve, reject)=>{
        pool.query('SELECT * FROM currency', (err, results)=>{
            if(err){
                return reject(err);
            }
            return resolve(results);
        })
    })
};

crudsObj.getCurrencyById = (id) => {
    return new Promise((resolve, reject)=>{
        pool.query('SELECT * FROM currency WHERE currency_id = ?',[id], (err, results)=>{
            if(err){
                return reject(err);
            }
            return resolve(results);
        })
    })
  };

  crudsObj.updateCurrency = (id,company_id, branch_id, code, description, rate_vs_usd, date, comitted_by) => {
    return new Promise((resolve, reject) => {
      pool.query(
        'UPDATE currency SET company_id = ?, branch_id = ?, code = ?, description = ?, rate_vs_usd = ?, date = ?, comitted_by = ? WHERE currency_id = ?',
        [company_id, branch_id, code, description, rate_vs_usd, date, comitted_by, id],
        (err, result) => {
          if (err) {
            return reject(err);
          }
          return resolve({ status: '200', message: 'update successful' });
        }
      );
    });
  };

  crudsObj.deleteCurrency = (id) => {
    return new Promise((resolve, reject)=>{
        pool.query('DELETE FROM currency WHERE currency_id = ?',[id], (err, results)=>{
            if(err){
                return reject(err);
            }
            return resolve(results);
        })
    })
  };


module.exports = crudsObj;
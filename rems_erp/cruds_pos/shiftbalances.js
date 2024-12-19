require('dotenv').config();
const pool = require('./poolfile');

let crudsObj = {};

crudsObj.postShiftBalances = (company_id,branch_id, shift_id, currency_id, currency_code, rate_to_usd, open_balance, debit, credit, close_balance,  syncid)=>{
    return new Promise((resolve, reject)=>{
        pool.query('INSERT INTO shift_balances(company_id,branch_id, shift_id, currency_id, currency_code, rate_to_usd, open_balance, debit, credit, close_balance, syncid) VALUES (?,?,?,?,?,?,?,?,?,?,?)',[company_id,branch_id, shift_id, currency_id, currency_code, rate_to_usd, open_balance, debit, credit, close_balance,  syncid], (err, result)=>{
            if(err){
                return reject(err);
            }
            return resolve({status:'200', message: 'saving successful'});
        })
    })
};

crudsObj.getShiftBalances = ()=>{
    return new Promise((resolve, reject)=>{
        pool.query('SELECT * FROM shift_balances', (err, results)=>{
            if(err){
                return reject(err);
            }
            return resolve(results);
        })
    })
};

crudsObj.getShiftBalancesById = (shift_balances_id ) => {
    return new Promise((resolve, reject)=>{
        pool.query('SELECT * FROM shift_balances WHERE shift_balances_id   = ?',[shift_balances_id  ], (err, results)=>{
            if(err){
                return reject(err);
            }
            return resolve(results);
        })
    })
  };

  crudsObj.updateShiftBalances = (id, company_id,branch_id,currency_id, currency_code, rate_to_usd, open_balance, debit, credit, close_balance, syncid) => {
    return new Promise((resolve, reject) => {
      pool.query(
        'UPDATE shift_balances SET company_id = ? ,branch_id = ? , currency_id = ? , currency_code = ? , rate_to_usd = ? , open_balance = ? , debit = ? , credit = ? , close_balance = ?  , syncid = ?',
        [ company_id,branch_id,currency_id, currency_code, rate_to_usd, open_balance, debit, credit, close_balance, syncid, id],
        (err, result) => {
          if (err) {
            return reject(err);
          }
          return resolve({ status: '200', message: 'update successful' });
        }
      );
    });
  };

  crudsObj.deleteShiftBalances = (id) => {
    return new Promise((resolve, reject)=>{
        pool.query('DELETE FROM shift_balances WHERE shift_balances_id   = ?',[id], (err, results)=>{
            if(err){
                return reject(err);
            }
            return resolve(results);
        })
    })
  };

module.exports = crudsObj;
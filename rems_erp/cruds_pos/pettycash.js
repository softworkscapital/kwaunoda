require('dotenv').config();
const pool = require('./poolfile');

let crudsObj = {};

crudsObj.postPettyCash = (company_id, branch_id, datepaid,description,
    amnt_paid, currency, usd_value,amount_paid,  rate_to_usd, syncid)=>{

    return new Promise((resolve, reject)=>{
        pool.query('INSERT INTO petty_cash (company_id, branch_id, datefor,description, amnt_paid, currency, usd_value,amount_paid,  rate_to_usd, syncid) VALUES (?,?,?,?,?,?,?,?,?,?)',[company_id, branch_id, datepaid,description,
            amnt_paid, currency, usd_value,amount_paid,  rate_to_usd, syncid], (err, result)=>{
            if(err){
                return reject(err);
            }
            return resolve({status:'200', message: 'saving successful'});
        })
    })
};
crudsObj.getPettyCash = ()=>{
    return new Promise((resolve, reject)=>{
        pool.query('SELECT * FROM petty_cash ', (err, results)=>{
            if(err){
                return reject(err);
            }
            return resolve(results);
        })
    })
};

crudsObj.getPettyCashById = (petty_cash_id) => {
    return new Promise((resolve, reject)=>{
        pool.query('SELECT * FROM petty_cash  WHERE sale_records_id = ?',[petty_cash_id], (err, results)=>{
            if(err){
                return reject(err);
            }
            return resolve(results);
        })
    })
  };

  crudsObj.updatePettyCash = (petty_cash_id,company_id, branch_id, datepaid,description, amnt_paid, currency, usd_value,amount_paid,  rate_to_usd, syncid) => {
    return new Promise((resolve, reject) => {
      pool.query(
    
        'UPDATE petty_cash  SET company_id = ?,branch_id = ?,datepaid = ?,description = ?,amnt_paid = ?,currency = ?,usd_value = ?,amount_paid = ?, rate_to_usd = ?, syncid = ? WHERE petty_cash_id=?',
        [company_id, branch_id, datepaid,description, amnt_paid, currency, usd_value,amount_paid,  rate_to_usd, syncid,petty_cash_id],
        (err, result) => {
          if (err) {
            return reject(err);
          }
          return resolve({ status: '200', message: 'update successful' });
        }
      );
    });
  };

  crudsObj.deletePettyCash = (id) => {
    return new Promise((resolve, reject)=>{
        pool.query('DELETE FROM petty_cash  WHERE petty_cash_id = ?',[id], (err, results)=>{
            if(err){
                return reject(err);
            }
            return resolve(results);
        })
    })
  };


module.exports = crudsObj;
require('dotenv').config();
const pool = require('./poolfile');

let crudsObj = {};

crudsObj.postSalesPrice = (company_id, branch_id, price_description, item, rate_code, price, changed_by, changed_on, status)=>{

    return new Promise((resolve, reject)=>{
        pool.query('INSERT INTO sales_prices(company_id, branch_id, price_description, item, rate_code, price, changed_by, changed_on, status) VALUES (?,?,?,?,?,?,?,?,?)',[company_id, branch_id, price_description, item, rate_code, price, changed_by, changed_on, status], (err, result)=>{
            if(err){
                return reject(err);
            }
            return resolve({statu:'200', message: 'saving successful'});
        })
    })
};
crudsObj.getSalesPrice = ()=>{
    return new Promise((resolve, reject)=>{
        pool.query('SELECT * FROM sales_prices', (err, results)=>{
            if(err){
                return reject(err);
            }
            return resolve(results);
        })
    })
};

crudsObj.getSalesPriceById = (id) => {
    return new Promise((resolve, reject)=>{
        pool.query('SELECT * FROM sales_prices WHERE sales_prices_id = ?',[id], (err, results)=>{
            if(err){
                return reject(err);
            }
            return resolve(results);
        })
    })
  };

  crudsObj.updateSalesPrice = (id, company_id, branch_id, price_description, item, rate_code, price, changed_by, changed_on, status) => {
    return new Promise((resolve, reject) => {
      pool.query(
        'UPDATE sales_prices SET company_id = ?, branch_id = ?, price_description = ?, item = ?, rate_code = ?, price = ?, changed_by = ?, changed_on = ?, status = ? WHERE sales_prices_id = ?',
        [company_id, branch_id, price_description, item, rate_code, price, changed_by, changed_on, status, id],
        (err, result) => {
          if (err) {
            return reject(err);
          }
          return resolve({ status: '200', message: 'update successful' });
        }
      );
    });
  };

  crudsObj.deleteSalesPrice = (id) => {
    return new Promise((resolve, reject)=>{
        pool.query('DELETE FROM sales_prices WHERE sales_prices_id = ?',[id], (err, results)=>{
            if(err){
                return reject(err);
            }
            return resolve(results);
        })
    })
  };


module.exports = crudsObj;
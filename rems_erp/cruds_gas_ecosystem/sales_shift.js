require('dotenv').config();
const pool = require('../cruds_gas_ecosystem/poolfile');

let crudsObj = {};


crudsObj.getSalesShift = ()=>{
    return new Promise((resolve, reject)=>{
        pool.query('SELECT * FROM sales_shifts', (err, results)=>{
            if(err){
                return reject(err);
            }
            return resolve(results);
        })
    })
};

crudsObj.getSalesShiftById = (id, company_id) => {
    return new Promise((resolve, reject)=>{
        pool.query('SELECT * FROM sales_shifts WHERE (branch_id = ? AND company_id = ? AND shift_status = "CLOSED") ORDER BY sales_shifts_id DESC',[id, company_id], (err, results)=>{
            if(err){
                return reject(err);
            }
            return resolve(results);
        })
    })
  };

crudsObj.getSalesShiftByCo = (id) => {
    return new Promise((resolve, reject)=>{
      pool.query( 'SELECT * FROM sales_shifts WHERE (company_id = ? AND shift_status = "CLOSED") ORDER BY sales_shifts_id DESC', [id], (err, results)=>{
        if(err){
                return reject(err);
            }
            return resolve(results);
        })
    })
  };


crudsObj.getSalesShiftByCompanyId = (company_id) => {//not used has error needs deleting
    return new Promise((resolve, reject)=>{
        pool.query( 'SELECT * FROM sales_shifts WHERE (company_id = ? AND shift_status = "CLOSED") ', [company_id], (err, results)=>{
          console.log('fetched'); 
          if(err){
                return reject(err);
            }
            return resolve(results);
        })
    })
  };

  crudsObj.updateSalesShift = (id,company_id, branch_id, code, description, rate_vs_usd, date, comitted_by) => {
    return new Promise((resolve, reject) => {
      pool.query(
        'UPDATE sales_shifts SET company_id = ?, branch_id = ?, code = ?, description = ?, rate_vs_usd = ?, date = ?, comitted_by = ? WHERE sales_shifts_id = ?',
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

  crudsObj.deleteSalesShift = (id) => {
    return new Promise((resolve, reject)=>{
        pool.query('DELETE FROM sales_shifts WHERE sales_shifts_id = ?',[id], (err, results)=>{
            if(err){
                return reject(err);
            }
            return resolve(results);
        })
    })
  };


module.exports = crudsObj;

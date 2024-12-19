require('dotenv').config();
const pool = require('./poolfile');

let crudsObj = {};

crudsObj.postInvetoryMgt = (company_id,branch_id, sale_records_id, product_id, date_time, qty_purchased, qty_sold, qty_balance, product_value_cost, product_value_selling_price, unit_cost, selling_price,pic1, pic2, pic3, syncid)=>{
    return new Promise((resolve, reject)=>{
        pool.query('INSERT INTO inventory_mgt(company_id,branch_id, sale_records_id, product_id, date_time, qty_purchased, qty_sold, qty_balance, product_value_cost, product_value_selling_price, unit_cost, selling_price,pic1, pic2, pic3, syncid) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)',[company_id,branch_id, sale_records_id, product_id, date_time, qty_purchased, qty_sold, qty_balance, product_value_cost, product_value_selling_price, unit_cost, selling_price,pic1, pic2, pic3, syncid], (err, result)=>{
            if(err){
                return reject(err);
            }
            return resolve({status:'200', message: 'saving successful'});
        })
    })
};

crudsObj.getInvetoryMgt = ()=>{
    return new Promise((resolve, reject)=>{
        pool.query('SELECT * FROM inventory_mgt', (err, results)=>{
            if(err){
                return reject(err);
            }
            return resolve(results);
        })
    })
};

crudsObj.getInvetoryMgtById = (id) => {
    return new Promise((resolve, reject)=>{
        pool.query('SELECT * FROM inventory_mgt WHERE inventory_mgt_id  = ?',[id ], (err, results)=>{
            if(err){
                return reject(err);
            }
            return resolve(results);
        })
    })
  };

crudsObj.getInvetoryMgtByProductId = () => {
    return new Promise((resolve, reject)=>{
        pool.query('SELECT inventory_mgt.*, products_definition.product_name FROM inventory_mgt INNER JOIN products_definition ON inventory_mgt.product_id = products_definition.product_id', (err, results)=>{
            if(err){
                return reject(err);
            }
            return resolve(results);
        })
    })
  };

  crudsObj.updateInvetoryMgt = (id, company_id,branch_id, sale_records_id, product_id, date_time, qty_purchased, qty_sold, qty_balance, product_value_cost, product_value_selling_price, unit_cost, selling_price, pic1, pic2, pic3, syncid) => {
    console.log(unit_cost);
    return new Promise((resolve, reject) => {
      pool.query(
        'UPDATE inventory_mgt SET company_id = ? ,branch_id = ? , sale_records_id = ? , product_id = ? , date_time = ? , qty_purchased = ? , qty_sold = ? , qty_balance = ? , product_value_cost = ? , product_value_selling_price = ? , unit_cost = ? , selling_price = ? ,pic1 = ?, pic2 = ?, pic3 = ?, syncid = ? WHERE inventory_mgt_id = ?',
        [company_id,branch_id, sale_records_id, product_id, date_time, qty_purchased, qty_sold, qty_balance, product_value_cost, product_value_selling_price, unit_cost, selling_price, syncid, id],
        (err, result) => {
          if (err) {
            return reject(err);
          }
          return resolve({ status: '200', message: 'update successful' });
        }
      );
    });
  };

  crudsObj.deleteInvetoryMgt = (id) => {
    return new Promise((resolve, reject)=>{
        pool.query('DELETE FROM inventory_mgt WHERE inventory_mgt_id  = ?',[id], (err, results)=>{
            if(err){
                return reject(err);
            }
            return resolve(results);
        })
    })
  };

module.exports = crudsObj;
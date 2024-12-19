require('dotenv').config();
const pool = require('./poolfile');

let crudsObj = {};

crudsObj.postSaleList = (sale_records_id, product_id, quantity, unit_cost, selling_price)=>{

    return new Promise((resolve, reject)=>{
        console.log("product added to list "+product_id);
        pool.query('INSERT INTO sale_list_item (sale_records_id, product_id, quantity, unit_cost, selling_price) VALUES (?,?,?,?,?)',[sale_records_id, product_id, quantity, unit_cost, selling_price], (err, result)=>{
            if(err){
                return reject(err);
            }
            return resolve({status:'200', message: 'saving successful'});
        })
    })
};
crudsObj.getSaleList = ()=>{
    return new Promise((resolve, reject)=>{
        pool.query('SELECT * FROM sale_list_item', (err, results)=>{
            if(err){
                return reject(err);
            }
            return resolve(results);
        })
    })
};

crudsObj.getSaleListById = (list_item_id) => {
    return new Promise((resolve, reject)=>{
        pool.query('SELECT * FROM sale_list_item WHERE list_item_id = ?',[list_item_id], (err, results)=>{
            if(err){
                return reject(err);
            }
            return resolve(results);
        })
    })
  };

  crudsObj.updateSaleList = (list_item_id,sale_records_id, product_id, quantity, unit_cost, selling_price) => {
    return new Promise((resolve, reject) => {
      pool.query(
        'UPDATE sale_list_item SET sale_records_id = ?, product_id = ?,quantity = ?,unit_cost = ?,selling_price = ? WHERE list_item_id=?'

        [sale_records_id, product_id, quantity, unit_cost, selling_price, list_item_id],
        (err, result) => {
          if (err) {
            return reject(err);
          }
          return resolve({ status: '200', message: 'update successful' });
        }
      );
    });
  };

  crudsObj.deleteSaleList = (id) => {
    return new Promise((resolve, reject)=>{
        pool.query('DELETE FROM sale_list_item WHERE list_item_id = ?',[id], (err, results)=>{
            if(err){
                return reject(err);
            }
            return resolve(results);
        })
    })
  };


module.exports = crudsObj;
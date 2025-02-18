require('dotenv').config();
const pool = require('./poolfile');

let crudsObj = {};
crudsObj.postProductDefinition = ( 
    product_id,
    product_code,
    company_id,
    branch_id,
    product_brand,
    product_name,
    product_type,
    category,
    sub_category,
    sub_sub_category,
    unit_of_measure,
    unit_size,
    description_notes,
    sub_notes,
    sold_units_count,
    rating,
    rating_count,
    discount_rate,
    promo_time_left,
    color,
    popularity,
    shipping_days,
    condition,
    reviews_count,
    views_count,
    likes_count,
    uploaded_product_image_ref,
    syncid
) => {
    return new Promise((resolve, reject) => {
        pool.query(
            `INSERT INTO products_definition (
                product_code,
                company_id,
                branch_id,
                product_brand,
                product_name,
                product_type,
                category,
                sub_category,
                sub_sub_category,
                unit_of_measure,
                unit_size,
                description_notes,
                sub_notes,
                sold_units_count,
                rating,
                rating_count,
                discount_rate,
                promo_time_left,
                color,
                popularity,
                shipping_days,
                   \`condition\`, 
                reviews_count,
                views_count,
                likes_count,
                uploaded_product_image_ref,
                syncid
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,?)`,
            [
                product_code,
                company_id,
                branch_id,
                product_brand,
                product_name,
                product_type,
                category,
                sub_category,
                sub_sub_category,
                unit_of_measure,
                unit_size,
                description_notes,
                sub_notes,
                sold_units_count,
                rating,
                rating_count,
                discount_rate,
                promo_time_left,
                color,
                popularity,
                shipping_days,
                condition,
                reviews_count,
                views_count,
                likes_count,
                uploaded_product_image_ref,
                syncid
            ],
            (err, result) => {
                if (err) {
                    return reject(err);
                }
                return resolve({ status: '200', message: 'Saving successful' });
            }
        );
    });
};



crudsObj.getProductDefinitions = ()=>{
    return new Promise((resolve, reject)=>{
        pool.query('SELECT * FROM products_definition', (err, results)=>{
            if(err){
                return reject(err);
            }
            return resolve(results);
        })
    })
};

crudsObj.getFullProductDefinitions = ()=>{
    return new Promise((resolve, reject)=>{
        pool.query('SELECT products_definition.*, inventory_mgt.selling_price, inventory_mgt.unit_cost, inventory_mgt.qty_balance FROM products_definition INNER JOIN inventory_mgt ON products_definition.product_id = inventory_mgt.product_id', (err, results)=>{
            if(err){
                return reject(err);
            }
            return resolve(results);
        })
    })
};



// getClentById
crudsObj.getProductDefinitionById = (id) => {
    return new Promise((resolve, reject)=>{
        pool.query('SELECT * FROM products_definition WHERE product_id = ?',[id], (err, results)=>{
            if(err){
                return reject(err);
            }
            return resolve(results);
        })
    })
  };

  crudsObj.updateProductDefinition = (product_id, company_id, branch_id, product_name, unit_of_measure, unit_size, syncid) => {
    return new Promise((resolve, reject) => {
      pool.query(
        'UPDATE products_definition SET company_id = ?, branch_id = ?, product_name = ?, unit_of_measure = ?, unit_size = ?, syncid = ? WHERE product_id = ?',
        [company_id, branch_id, product_name, unit_of_measure, unit_size, syncid, product_id],
        (err, result) => {
          if (err) {
            return reject(err);
          }
          return resolve({ status: '200', message: 'update successful' });
        }
      );
    });
  };

  crudsObj.deleteProductDefinition = (id) => {
    return new Promise((resolve, reject)=>{
        pool.query('DELETE FROM products_definition WHERE product_id = ?',[id], (err, results)=>{
            if(err){
                return reject(err);
            }
            return resolve(results);
        })
    })
  };

  module.exports=crudsObj;
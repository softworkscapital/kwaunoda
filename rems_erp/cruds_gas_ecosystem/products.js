require('dotenv').config();
const pool = require('../cruds_gas_ecosystem/poolfile');

let crudsObj = {};

crudsObj.postProduct = (
    product_id,
    user_id,
    company_id,
    branch_id,
    product_type,
    description,
    location,
    date,
    time,
    unit_cost,
    volume,
    metric_measurement,
    payment_using,
    payment_when,
    transport_rate,
    total_cost,
    customer_user_id,
    customer_branch_id,
    customer_company_id,
    customer_purchased_amount
) => {
    return new Promise((resolve, reject) => {
        pool.query(
            `INSERT INTO products (
                user_id,
                company_id,
                branch_id,
                product_type,
                description,
                location,
                date,
                time,
                unit_cost,
                volume,
                metric_measurement,
                payment_using,
                payment_when,
                transport_rate,
                total_cost,
                customer_user_id,
                customer_branch_id,
                customer_company_id,
                customer_purchased_amount
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,?)`,
            [
                user_id,
                company_id,
                branch_id,
                product_type,
                description,
                location,
                date,
                time,
                unit_cost,
                volume,
                metric_measurement,
                payment_using,
                payment_when,
                transport_rate,
                total_cost,
                customer_user_id,
                customer_branch_id,
                customer_company_id,
                customer_purchased_amount	
            ],
            (err, result) => {
                if (err) {
                    return reject(err);
                }
                return resolve({ status: '200', message: 'saving successful', result });
            }
        );
    });
};

crudsObj.getProducts = () => {
    return new Promise((resolve, reject) => {
        pool.query('SELECT * FROM products', (err, results) => {
            if (err) {
                return reject(err);
            }
            return resolve(results);
        });
    });
};





crudsObj.getProductsExcludingCompany = (companyId) => {
    return new Promise((resolve, reject) => {
        // SQL query to fetch products not belonging to the specified company
        const query = `
            SELECT * FROM products
            WHERE company_id != ?
        `;

        pool.query(query, [companyId], (err, results) => {
            if (err) {
                return reject(err);
            }
            return resolve(results);
        });
    });
};





crudsObj.getProductById = (product_id) => {
    return new Promise((resolve, reject) => {
        pool.query('SELECT * FROM products WHERE product_id = ?', [product_id], (err, results) => {
            if (err) {
                return reject(err);
            }
            return resolve(results);
        });
    });
};

crudsObj.getProductByEmail = (email) => {
    return new Promise((resolve, reject) => {
        pool.query('SELECT * FROM products WHERE email = ?', [email], (err, results) => {
            if (err) {
                return reject(err);
            }
            return resolve(results);
        });
    });
};



crudsObj.updateProduct = (
    product_id, // Add product_id as a parameter
    user_id,
    company_id,
    branch_id,
    product_type,
    description,
    location,
    date,
    time,
    unit_cost,
    volume,
    metric_measurement,
    payment_using,
    payment_when,
    transport_rate,
    total_cost,
    customer_user_id,
    customer_branch_id,
    customer_company_id,
    customer_purchased_amount
) => {
    return new Promise((resolve, reject) => {
        // SQL query to update product details
        pool.query(
            `UPDATE products SET 
                user_id =?,
                company_id =?,
                branch_id =?,
                product_type =?,
                description =?,
                location =?,
                date =?,
                time =?,
                unit_cost =?,
                volume =?,
                metric_measurement =?,
                payment_using =?,
                payment_when =?,
                transport_rate =?,
                total_cost =?,
                customer_user_id =?,
                customer_branch_id =?,
                customer_company_id =?,
                customer_purchased_amount =?
            WHERE product_id = ?`,
            [
                user_id,
                company_id,
                branch_id,
                product_type,
                description,
                location,
                date,
                time,
                unit_cost,
                volume,
                metric_measurement,
                payment_using,
                payment_when,
                transport_rate,
                total_cost,
                customer_user_id,
                customer_branch_id,
                customer_company_id,
                customer_purchased_amount,
                product_id // Ensure this is at the end
            ],
            (err, result) => {
                if (err) {
                    console.error('Error updating product:', err);
                    return reject(err);
                }
                if (result.affectedRows === 0) {
                    return resolve({ status: '404', message: 'Product not found or no changes made' });
                }
                return resolve({ status: '200', message: 'Update successful', result });
            }
        );
    });
};
crudsObj.deleteProduct = (id) => {
    return new Promise((resolve, reject) => {
        pool.query('DELETE FROM products WHERE product_id = ?', [id], (err, results) => {
            if (err) {
                return reject(err);
            }
            return resolve(results);
        });
    });
};

module.exports = crudsObj;

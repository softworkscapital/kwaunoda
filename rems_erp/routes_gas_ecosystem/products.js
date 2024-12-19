const express = require('express');
const   productRouter = express.Router();
const productsDbOperations = require('../cruds_gas_ecosystem/products');


productRouter.post('/', async (req, res, next) => {
    try {
        let postedValues = req.body;
        let {
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
        } = postedValues;

        let results = await productsDbOperations.postProduct(
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
        );
        res.json(results);
    } catch (e) {
        console.log(e);
        res.sendStatus(500);
    }
});


  productRouter.get('/', async (req, res, next) => {
    try {
        let results = await   productsDbOperations.getProducts();
        res.json(results);
    } catch (e) {
        console.log(e);
        res.sendStatus(500);
    }
});





productRouter.get('/exclude-company', async (req, res, next) => {
    try {
        const companyId = req.query.companyId; // Get companyId from query parameters
        if (!companyId) {
            return res.status(400).json({ error: 'Company ID is required' });
        }
        let results = await productsDbOperations.getProductsExcludingCompany(companyId);
        res.json(results);
    } catch (e) {
        console.log(e);
        res.sendStatus(500);
    }
});



  productRouter.get('/:id', async (req, res, next) => {
    try {
        let product_id = req.params.id;
        let result = await   productsDbOperations.getProductById(product_id);
        res.json(result);
    } catch (e) {
        console.log(e);
        res.sendStatus(500);
    }
});



productRouter.put('/:id', async (req, res, next) => {
    try {
        const product_id = req.params.id; // Extract the record ID from the URL
        const postedValues = req.body; // Get the request body

        // Extract values from the request body
        const {
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
        } = postedValues;

        // Call the database operation to update the record
        let results = await productsDbOperations.updateProduct(
            product_id, // Pass product_id as the first parameter
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
        );

        // Send the response back to the client
        res.json(results);
    } catch (e) {
        console.error("Error:", e); // Log the error for debugging
        res.sendStatus(500); // Send a 500 response for server error
    }
});


  productRouter.delete('/:id', async (req, res, next) => {
    try {
        let id = req.params.id;
        let result = await   productsDbOperations.deleteProduct(id);
        res.json(result);
    } catch (e) {
        console.log(e);
        res.sendStatus(500);
    }
});

module.exports =  productRouter;

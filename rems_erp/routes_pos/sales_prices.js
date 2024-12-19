const express = require('express');
const salesPricesRouter = express.Router();
const salespriceDbOperations = require('../cruds_pos/sales_prices');

salesPricesRouter.post('/', async (req, res, next) => {
    try {
        let postedValues = req.body;
        let company_id = postedValues.company_id;
        let branch_id = postedValues.branch_id;
        let price_description = postedValues.price_description;
        let item = postedValues.item;
        let rate_code = postedValues.rate_code;
        let price = postedValues.price;
        let changed_by = postedValues.changed_by;
        let changed_on = postedValues.changed_on;
        let status = postedValues.status;

        let results = await salespriceDbOperations.postSalesPrice(company_id, branch_id, price_description, item, rate_code, price, changed_by, changed_on, status);
        res.json(results);
    } catch (e) {
        console.log(e);
        res.sendStatus(500);
    }
})

salesPricesRouter.get('/', async (req, res, next) => {
    try {
        let results = await salespriceDbOperations.getSalesPrice();
        res.json(results);
    } catch (e) {
        console.log(e);
        res.sendStatus(500);
    }
});

salesPricesRouter.get('/:id', async (req, res, next) => {
    try {
        let client_id = req.params.id;
        let result = await salespriceDbOperations.getSalesPriceById(client_id);
        res.json(result);
    } catch (e) {
        console.log(e);
        res.sendStatus(500);
    }
});

salesPricesRouter.put('/:id', async (req, res, next) => {
    try {
        let sales_prices_id = req.params.id;
        let updatedValues = req.body;
        let company_id = updatedValues.company_id;
        let branch_id = updatedValues.branch_id;
        let price_description = updatedValues.price_description;
        let item = updatedValues.item;
        let rate_code = updatedValues.rate_code;
        let price = updatedValues.price;
        let changed_by = updatedValues.changed_by;
        let changed_on = updatedValues.changed_on;
        let status = updatedValues.status;

        let result = await salespriceDbOperations.updateSalesPrice(
            sales_prices_id,
            company_id,
            branch_id,
            price_description,
            item,
            rate_code,
            price,
            changed_by,
            changed_on,
            status
        );
        res.json(result);
    } catch (e) {
        console.log(e);
        res.sendStatus(500);
    }
});

salesPricesRouter.delete('/:id', async (req, res, next) => {
    try {
        let id = req.params.id;
        let result = await salespriceDbOperations.deleteSalesPrice(id);
        res.json(result);
    } catch (e) {
        console.log(e);
        res.sendStatus(500);
    }
});

module.exports = salesPricesRouter;
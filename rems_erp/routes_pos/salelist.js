const express = require('express');
const saleListRouter = express.Router();
const saleListDbOperations = require('../cruds_pos/salelist');

saleListRouter.post('/', async (req, res, next) => {
    try {
        let postedValues = req.body;
        let sale_records_id = postedValues.sale_records_id;
        let product_id = postedValues.product_id;
        let quantity = postedValues.quantity;
        let unit_cost = postedValues.unit_cost;
        let selling_price = postedValues.selling_price;

        console.log("rrr" + sale_records_id);
        let results = await saleListDbOperations.postSaleList(sale_records_id, product_id, quantity, unit_cost, selling_price);
        res.json(results);
    } catch (e) {
        console.log(e);
        res.sendStatus(500);
    }
})

saleListRouter.get('/', async (req, res, next) => {
    try {
        let results = await saleListDbOperations.getSaleList();
        res.json(results);
    } catch (e) {
        console.log(e);
        res.sendStatus(500);
    }
});

saleListRouter.get('/:id', async (req, res, next) => {
    try {
        let list_item_id = req.params.id;
        let result = await saleListDbOperations.getSaleListById(list_item_id);
        res.json(result);
    } catch (e) {
        console.log(e);
        res.sendStatus(500);
    }
});

saleListRouter.put('/:id', async (req, res, next) => {
    try {
        //let salelistid = req.params.id;
        let updatedValues = req.body;
        let sale_records_id = updatedValues.sale_records_id;
        let product_id = updatedValues.product_id;
        let quantity = updatedValues.quantity;
        let unit_cost = updatedValues.unit_cost;
        let selling_price = updatedValues.selling_price;

        let result = await saleListDbOperations.updateSaleList(
            //salelistId,
            sale_records_id,
            product_id,
            quantity,
            unit_cost,
            selling_price
        );
        res.json(result);
    } catch (e) {
        console.log(e);
        res.sendStatus(500);
    }
});

saleListRouter.delete('/:id', async (req, res, next) => {
    try {
        let id = req.params.id;
        let result = await saleListDbOperations.deleteSaleList(id);
        res.json(result);
    } catch (e) {
        console.log(e);
        res.sendStatus(500);
    }
});

module.exports = saleListRouter;
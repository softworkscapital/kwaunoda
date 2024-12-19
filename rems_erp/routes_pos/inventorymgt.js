const express = require('express');
const inventoryMgtRouter = express.Router();
const inventoryMgtDbOperations = require('../cruds_pos/inventorymgt');

inventoryMgtRouter.post('/', async (req, res, next) => {
    try {
        let postedValues = req.body;
        let company_id = postedValues.company_id;
        let branch_id = postedValues.branch_id;
        let sale_records_id = postedValues.sale_records_id;
        let branch_location_notes = postedValues.branch_location_notes;
        let product_id = postedValues.product_id;
        let date_time = postedValues.date_time;
        let qty_purchased = postedValues.qty_purchased;
        let qty_sold = postedValues.qty_sold;
        let qty_balance = postedValues.qty_balance;
        let product_value_cost = postedValues.product_value_cost;
        let product_value_selling_price = postedValues.product_value_selling_price;
        let unit_cost = postedValues.unit_cost;
        let selling_price = postedValues.selling_price;
        let pic1 = postedValues.pic1;
        let pic2 = postedValues.pic2;
        let pic3 = postedValues.pic3;
        let syncid = postedValues.syncid;

        let results = await inventoryMgtDbOperations.postInvetoryMgt(company_id, branch_id, sale_records_id, product_id, date_time, qty_purchased, qty_sold, qty_balance, product_value_cost, product_value_selling_price, unit_cost, selling_price, pic1, pic2, pic3, syncid);
        res.json(results);
    } catch (e) {
        console.log(e);
        res.sendStatus(500);
    }
});

inventoryMgtRouter.get('/', async (req, res, next) => {
    try {
        let results = await inventoryMgtDbOperations.getInvetoryMgt();
        res.json(results);
    } catch (e) {
        console.log(e);
        res.sendStatus(500);
    }
});

inventoryMgtRouter.get('/:id', async (req, res, next) => {
    try {
        let inventory_mgt_id = req.params.id;
        let result = await inventoryMgtDbOperations.getInvetoryMgtById(inventory_mgt_id);
        res.json(result);
    } catch (e) {
        console.log(e);
        res.sendStatus(500);
    }
});

inventoryMgtRouter.get('/inventory/products', async (req, res, next) => {
    try {
        let result = await inventoryMgtDbOperations.getInvetoryMgtByProductId();
        res.json(result);
    } catch (e) {
        console.log(e);
        res.sendStatus(500);
    }
});

inventoryMgtRouter.put('/:id', async (req, res, next) => {
    try {
        let inventory_mgt_id = req.params.id;
        let postedValues = req.body;
        let company_id = postedValues.company_id;
        let branch_id = postedValues.branch_id;
        let branch_location_notes = postedValues.branch_location_notes;
        let product_id = postedValues.product_id;
        let date_time = postedValues.date_time;
        let qty_purchased = postedValues.qty_purchased;
        let qty_sold = postedValues.qty_sold;
        let qty_balance = postedValues.qty_balance;
        let product_value_cost = postedValues.product_value_cost;
        let product_value_selling_price = postedValues.product_value_selling_price;
        let unit_cost = postedValues.unit_cost;
        let selling_price = postedValues.selling_price;
        let pic1 = postedValues.pic1;
        let pic2 = postedValues.pic2;
        let pic3 = postedValues.pic3;
        let syncid = postedValues.syncid;

        console.log(unit_cost);

        let result = await inventoryMgtDbOperations.updateInvetoryMgt(
            inventory_mgt_id,
            company_id,
            branch_id,
            branch_location_notes,
            product_id,
            date_time,
            qty_purchased,
            qty_sold, qty_balance, product_value_cost, product_value_selling_price, selling_price, unit_cost,pic1, pic2, pic3,  syncid
        );
        res.json(result);
    } catch (e) {
        console.log(e);
        res.sendStatus(500);
    }
});

inventoryMgtRouter.delete('/:id', async (req, res, next) => {
    try {
        let id = req.params.id;
        let result = await inventoryMgtDbOperations.deleteInvetoryMgt(id);
        res.json(result);
    } catch (e) {
        console.log(e);
        res.sendStatus(500);
    }
});

module.exports = inventoryMgtRouter;

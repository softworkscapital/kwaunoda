const express = require('express');
const saleRecordRouter = express.Router();
const saleRecordDbOperations = require('../cruds_pos/sale_records');

saleRecordRouter.post('/', async (req, res, next) => {
    try {
        let postedValues = req.body;
        let company_id = postedValues.company_id;
        let branch_id = postedValues.branch_id;
        let datetime = postedValues.datetime;
        let sale_list_item_id = postedValues.sale_list_item_id;
        let amnt_paid = postedValues.amnt_paid;
        let currency = postedValues.currency;
        let receipt_total = postedValues.receipt_total;
        let amount_paid = postedValues.amount_paid;
        let amount_change = postedValues.amount_change;
        let rate_to_usd = postedValues.rate_to_usd;
        let receipt_total_usd_euquivalance = postedValues.receipt_total_usd_euquivalance;
        let syncid = postedValues.syncid;

        let results = await saleRecordDbOperations.postSaleRecord(company_id, branch_id, datetime, sale_list_item_id, amnt_paid,	currency, receipt_total, amount_paid, amount_change, rate_to_usd, receipt_total_usd_euquivalance, syncid);
        res.json(results);
    } catch (e) {
        console.log(e);
        res.sendStatus(500);
    }
})

saleRecordRouter.get('/', async (req, res, next) => {
    try {
        let results = await saleRecordDbOperations.getSaleRecords();
        res.json(results);
    } catch (e) {
        console.log(e);
        res.sendStatus(500);
    }
});

saleRecordRouter.get('/:id', async (req, res, next) => {
    try {
        let client_id = req.params.id;
        let result = await saleRecordDbOperations.getSaleRecordById(client_id);
        res.json(result);
    } catch (e) {
        console.log(e);
        res.sendStatus(500);
    }
});

saleRecordRouter.put('/:id', async (req, res, next) => {
    try {
        let sale_records_id = req.params.id;
        let updatedValues = req.body;
        let company_id = updatedValues.company_id;
        let branch_id = updatedValues.branch_id;
        let datetime = updatedValues.datetime;
        let sale_list_item_id = updatedValues.sale_list_item_id;
        let amnt_paid = updatedValues.amnt_paid;
        let currency = updatedValues.currency;
        let receipt_total = updatedValues.receipt_total;
        let amount_paid = updatedValues.amount_paid;
        let amount_change = updatedValues.amount_change;
        let rate_to_usd = updatedValues.rate_to_usd;
        let receipt_total_usd_euquivalance = updatedValues.receipt_total_usd_euquivalance;
        let syncid = updatedValues.syncid;

        let result = await saleRecordDbOperations.updateSaleRecord(
            sale_records_id, company_id, branch_id, datetime, sale_list_item_id, amnt_paid,	currency, receipt_total, amount_paid, amount_change, rate_to_usd, receipt_total_usd_euquivalance, syncid
        );
        res.json(result);
    } catch (e) {
        console.log(e);
        res.sendStatus(500);
    }
});

saleRecordRouter.delete('/:id', async (req, res, next) => {
    try {
        let id = req.params.id;
        let result = await saleRecordDbOperations.deleteSaleRecord(id);
        res.json(result);
    } catch (e) {
        console.log(e);
        res.sendStatus(500);
    }
});

module.exports = saleRecordRouter;
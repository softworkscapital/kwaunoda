const express = require('express');
const  BillingTarrifRouter = express.Router();
const  BillingTarrifsDbOperations = require('../cruds/billing_tarrifs');

BillingTarrifRouter.post('/', async (req, res, next) => {
    try {
        console.log('Request Body:', req.body); // Log the request body

        const { account_type, rate } = req.body;

        let results = await BillingTarrifsDbOperations.postBillingTarrif(
            account_type,
            rate
        );
        res.json(results);
    } catch (e) {
        console.log(e);
        res.sendStatus(500);
    }
});

BillingTarrifRouter.get('/', async (req, res, next) => {
    try {
        let results = await  BillingTarrifsDbOperations.getBillingTarrifs();
        res.json(results);
    } catch (e) {
        console.log(e);
        res.sendStatus(500);
    }
});










module.exports = BillingTarrifRouter;

const express = require('express');
const pettyCashRouter = express.Router();
const pettyCashDbOperations = require('../cruds_pos/pettycash');

pettyCashRouter.post('/', async (req, res, next) => {
    try {


        let postedValues = req.body;
        let petty_cash_id = postedValues.petty_cash_id;
        let company_id = postedValues.company_id;
        let branch_id = postedValues.branch_id;
        let datepaid = postedValues.datepaid;
        let description = postedValues.description;
        let amnt_paid = postedValues.amnt_paid;
        let currency = postedValues.currency;
        let amount_paid = postedValues.amount_paid;
        let usd_value = postedValues.usd_value;
        let rate_to_usd = postedValues.rate_to_usd;
        let syncid = postedValues.syncid;

        console.log("pettycash expense added" + description + amount_paid + currency);

        let results = await pettyCashDbOperations.postPettyCash(petty_cash_id, company_id, branch_id, datepaid,description,
            amnt_paid, currency, usd_value,amount_paid,  rate_to_usd, syncid
        );
        res.json(results);
    } catch (e) {
        console.log(e);
        res.sendStatus(500);
    }
})

pettyCashRouter.get('/', async (req, res, next) => {
    try {
        let results = await pettyCashDbOperations.getPettyCash();
        res.json(results);
    } catch (e) {
        console.log(e);
        res.sendStatus(500);
    }
});

pettyCashRouter.get('/:id', async (req, res, next) => {
    try {
        let petty_cash_id = req.params.id;
        let result = await pettyCashDbOperations.getPettyCashById(petty_cash_id);
        res.json(result);
    } catch (e) {
        console.log(e);
        res.sendStatus(500);
    }
});

pettyCashRouter.put('/:id', async (req, res, next) => {
    try {
      //let userId = req.params.id;
      let updatedValues = req.body;
      let petty_cash_id = updatedValues.petty_cash_id;
      let company_id = updatedValues.company_id;
      let branch_id = updatedValues.branch_id;
      let datepaid = updatedValues.datepaid;
      let description = updatedValues.description;
      let amnt_paid = updatedValues.amnt_paid;
      let currency = updatedValues.currency;
      let amount_paid = updatedValues.amount_paid;
      let usd_value = updatedValues.usd_value;
      let rate_to_usd = updatedValues.rate_to_usd;
      let syncid = updatedValues.syncid;
  
      let result = await pettyCashDbOperations.updatePettyCash(
        petty_cash_id, 
        company_id, 
        branch_id, 
        datepaid,
        description,
        amnt_paid,
        currency,
        usd_value,
        amount_paid, 
        rate_to_usd,
        syncid
      );
      res.json(result);
    } catch (e) {
      console.log(e);
      res.sendStatus(500);
    }
  });

pettyCashRouter.delete('/:id', async (req, res, next) => {
    try {
        let id = req.params.id;
        let result = await pettyCashDbOperations.deletePettyCash(id);
        res.json(result);
    } catch (e) {
        console.log(e);
        res.sendStatus(500);
    }
});

module.exports = pettyCashRouter;
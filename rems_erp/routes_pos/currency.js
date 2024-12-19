const express = require('express');
const currencyRouter = express.Router();
const usersDbOperations = require('../cruds_pos/currency');

currencyRouter.post('/', async (req, res, next) => {
    try {
        let postedValues = req.body;
        let company_id = postedValues.company_id;
        let branch_id = postedValues.branch_id;
        let code = postedValues.code;
        let description = postedValues.description;
        let rate_vs_usd = postedValues.rate_vs_usd;
        let date = postedValues.date;
        let comitted_by = postedValues.comitted_by;
        let results = await usersDbOperations.postCurrency(company_id, branch_id, code, description, rate_vs_usd, date, comitted_by);
        res.json(results);
    } catch (e) {
        console.log(e);
        res.sendStatus(500);
    }
})

currencyRouter.get('/', async (req, res, next) => {
    try {
        let results = await usersDbOperations.getCurrency();
        res.json(results);
    } catch (e) {
        console.log(e);
        res.sendStatus(500);
    }
});

currencyRouter.get('/:id', async (req, res, next) => {
    try {
        let id = req.params.id;
        let result = await usersDbOperations.getCurrencyById(id);
        res.json(result);
    } catch (e) {
        console.log(e);
        res.sendStatus(500);
    }
});

currencyRouter.put('/:id', async (req, res, next) => {
    try {
      let id = req.params.id;
      let updatedValues = req.body;
      let company_id = updatedValues.company_id;
      let branch_id = updatedValues.branch_id;
      let code = updatedValues.code;
      let description = updatedValues.description;
      let rate_vs_usd = updatedValues.rate_vs_usd;
      let date = updatedValues.date;
      let comitted_by = updatedValues.comitted_by;
  
      let result = await usersDbOperations.updateCurrency(
        id,
        company_id,
        branch_id,
        code,
        description,
        rate_vs_usd,
        date,
        comitted_by
      );
      res.json(result);
    } catch (e) {
      console.log(e);
      res.sendStatus(500);
    }
  });

currencyRouter.delete('/:id', async (req, res, next) => {
    try {
        let id = req.params.id;
        let result = await usersDbOperations.deleteCurrency(id);
        res.json(result);
    } catch (e) {
        console.log(e);
        res.sendStatus(500);
    }
});

module.exports = currencyRouter;
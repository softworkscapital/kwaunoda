const express = require('express');
const shiftBalancesRouter = express.Router();
const shiftBalancesDbOperations = require('../cruds_pos/shiftbalances');

shiftBalancesRouter.post('/', async (req, res, next) => {
    try {
        let postedValues = req.body;
        let company_id = postedValues.company_id;
        let branch_id = postedValues.branch_id;
        let shift_id = postedValues.shift_id;
        let currency_id = postedValues.currency_id;
        let currency_code = postedValues.currency_code;
        let rate_to_usd = postedValues.rate_to_usd;
        let open_balance = postedValues.open_balance;
        let debit = postedValues.debit;
        let credit = postedValues.credit;
        let close_balance = postedValues.close_balance;
        let syncid = postedValues.syncid;

        let results = await shiftBalancesDbOperations.postShiftBalances(company_id, branch_id, shift_id, currency_id, currency_code, rate_to_usd, open_balance, debit, credit, close_balance, syncid);
        res.json(results);
    } catch (e) {
        console.log(e);
        res.sendStatus(500);
    }
});

shiftBalancesRouter.get('/', async (req, res, next) => {
    try {
        let results = await shiftBalancesDbOperations.getShiftBalances();
        res.json(results);
    } catch (e) {
        console.log(e);
        res.sendStatus(500);
    }
});

shiftBalancesRouter.get('/:id', async (req, res, next) => {
    try {
        let shift_balances_id  = req.params.id;
        let result = await shiftBalancesDbOperations.getShiftBalancesById(shift_balances_id );
        res.json(result);
    } catch (e) {
        console.log(e);
        res.sendStatus(500);
    }
});

shiftBalancesRouter.put('/:id', async (req, res, next) => {
    try {
        let shift_balances_id = req.params.id;
        let postedValues = req.body;
        let company_id = postedValues.company_id;
        let branch_id = postedValues.branch_id;
        let shift_id = postedValues.shift_id;
        let currency_id = postedValues.currency_id;
        let currency_code = postedValues.currency_code;
        let rate_to_usd = postedValues.rate_to_usd;
        let open_balance = postedValues.open_balance;
        let debit = postedValues.debit;
        let credit = postedValues.credit;
        let close_balance = postedValues.close_balance;
        let syncid = postedValues.syncid;

        let result = await shiftBalancesDbOperations.updateShiftBalances(
            shift_balances_id,
            company_id,
            branch_id,
            shift_id,
            currency_id,
            rate_to_usd,
            open_balance,
            debit, credit, close_balance, syncid
        );
        res.json(result);
    } catch (e) {
        console.log(e);
        res.sendStatus(500);
    }
});

shiftBalancesRouter.delete('/:id', async (req, res, next) => {
    try {
        let id = req.params.id;
        let result = await shiftBalancesDbOperations.deleteShiftBalances(id);
        res.json(result);
    } catch (e) {
        console.log(e);
        res.sendStatus(500);
    }
});

module.exports = shiftBalancesRouter;

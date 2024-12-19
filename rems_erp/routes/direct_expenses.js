const express = require('express');
const directExpensesRouter = express.Router();
const directExpensesDbOperations = require('../cruds/direct_expenses');

directExpensesRouter.post('/', async (req, res, next) => {
    try {
        let postedValues = req.body;
        // let fin_acc_admin_expenses_accounts_id = postedValues.fin_acc_admin_expenses_accounts_id;
        let fin_acc_account_map_id = postedValues.fin_acc_account_map_id;
        let index_acc_name_id = postedValues.index_acc_name_id;
        let index_acc_name = postedValues.index_acc_name;
        let dual_trans_acc_name_id = postedValues.dual_trans_acc_name_id;
        let dual_trans_acc_name = postedValues.dual_trans_acc_name;
        let datepaid = postedValues.datepaid;
        let datefor = postedValues.datefor;
        let description = postedValues.description;
        let cost_center = postedValues.cost_center;
        let link = postedValues.link;
        let currency = postedValues.currency;
        let rate_to_usd = postedValues.rate_to_usd;
        let value = postedValues.value;
        let debit = postedValues.debit;
        let credit = postedValues.credit;
        let pmode = postedValues.pmode;
        let requester = postedValues.requester;
        let confirmed = postedValues.confirmed;
        let authorized = postedValues.authorized;
        let comitted = postedValues.comitted;
        let txn_reference = postedValues.txn_reference;
        let flag = postedValues.flag;
        let comment = postedValues.comment;
        let results = await directExpensesDbOperations.postExpensesAcc(
            fin_acc_account_map_id, index_acc_name_id, index_acc_name, dual_trans_acc_name_id, dual_trans_acc_name, datepaid, datefor, description, cost_center, link, currency, rate_to_usd, value, debit, credit, pmode, requester, confirmed, authorized, comitted, txn_reference, flag, comment
        );
        res.json(results);
    } catch (e) {
        console.log(e);
        res.sendStatus(500);
    }
})

directExpensesRouter.get('/', async (req, res, next) => {
    try {
        let results = await directExpensesDbOperations.getExpensesAccs();
        res.json(results);
    } catch (e) {
        console.log(e);
        res.sendStatus(500);
    }
});

directExpensesRouter.get('/get/acc/limit', async (req, res, next) => {
    try {
        let results = await directExpensesDbOperations.getExpensesHistory();
        res.json(results);
    } catch (e) {
        console.log(e);
        res.sendStatus(500);
    }
});

directExpensesRouter.get('/:id', async (req, res, next) => {
    try {
        let id = req.params.id;
        let result = await directExpensesDbOperations.getExpensesAccById(id);
        res.json(result);
    } catch (e) {
        console.log(e);
        res.sendStatus(500);
    }
});

directExpensesRouter.get('/acc/:name', async (req, res, next) => {
    try {
        let name = req.params.name;
        let result = await directExpensesDbOperations.getExpensesAccByName(name);
        res.json(result);
    } catch (e) {
        console.log(e);
        res.sendStatus(500);
    }
});

directExpensesRouter.get('/acc/index/:name', async (req, res, next) => {
    try {
        let name = req.params.name;
        let result = await directExpensesDbOperations.getExpensesAccByIndexName(name);
        res.json(result);
    } catch (e) {
        console.log(e);
        res.sendStatus(500);
    }
});

directExpensesRouter.get('/aaccBal/name', async (req, res, next) => {
    try {
        let results = await directExpensesDbOperations.getExpensesAccs2();
        res.json(results);
    } catch (e) {
        console.log(e);
        res.sendStatus(500);
    }
});

directExpensesRouter.put('/:id', async (req, res, next) => {
    try {
        let updatedValues = req.body;
        let id = req.params.id;
        let fin_acc_account_map_id = updatedValues.fin_acc_account_map_id;
        let index_acc_name_id = updatedValues.index_acc_name_id;
        let index_acc_name = updatedValues.index_acc_name;
        let dual_trans_acc_name_id = updatedValues.dual_trans_acc_name_id;
        let dual_trans_acc_name = updatedValues.dual_trans_acc_name;
        let datepaid = updatedValues.datepaid;
        let datefor = updatedValues.datefor;
        let description = updatedValues.description;
        let cost_center = updatedValues.cost_center;
        let link = updatedValues.link;
        let currency = updatedValues.currency;
        let rate_to_usd = updatedValues.rate_to_usd;
        let value = updatedValues.value;
        let debit = updatedValues.debit;
        let credit = updatedValues.credit;
        let pmode = updatedValues.pmode;
        let requester = updatedValues.requester;
        let confirmed = updatedValues.confirmed;
        let authorized = updatedValues.authorized;
        let comitted = updatedValues.comitted;
        let txn_reference = updatedValues.txn_reference;
        let flag = updatedValues.flag;
        let comment = updatedValues.comment;

        let result = await directExpensesDbOperations.updateExpensesAcc(
            id, fin_acc_account_map_id, index_acc_name_id, index_acc_name, dual_trans_acc_name_id, dual_trans_acc_name, datepaid, datefor, description, cost_center, link, currency, rate_to_usd, value, debit, credit, pmode, requester, confirmed, authorized, comitted, txn_reference, flag, comment
        );
        res.json(result);
    } catch (e) {
        console.log(e);
        res.sendStatus(500);
    }
});

directExpensesRouter.delete('/:id', async (req, res, next) => {
    try {
        let id = req.params.id;
        let result = await directExpensesDbOperations.deleteExpensesAcc(id);
        res.json(result);
    } catch (e) {
        console.log(e);
        res.sendStatus(500);
    }
});

module.exports = directExpensesRouter;
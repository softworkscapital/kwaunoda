const express = require('express');
const accountLinkingRouter = express.Router();
const accountLinkingDbOperations = require('../cruds/account_linking');

accountLinkingRouter.post('/', async (req, res, next) => {
    try {
        let postedValues = req.body;
        let debitAccMapId = postedValues.debitAccMapId;
        let creditAccMapId = postedValues.creditAccMapId;
        let debitTransactionId = postedValues.debitTransactionId;
        let creditTransactionId = postedValues.creditTransactionId;
        // let value = postedValues.value;
        let linkedOn = postedValues.linkedOn;
        let linkedBy = postedValues.linkedBy;
        // e
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
        let creditBalance = postedValues.creditBalance;
        let debitBalance = postedValues.debitBalance;

        console.log(postedValues.confirmed)

        let results = await accountLinkingDbOperations.postAccountLinking(
            // debitAccMapId, creditAccMapId, debitTransactionId, creditTransactionId, value, linkedOn, linkedBy
            debitAccMapId, creditAccMapId, debitTransactionId, creditTransactionId, value, linkedOn, linkedBy, fin_acc_account_map_id, index_acc_name_id, index_acc_name, dual_trans_acc_name_id, dual_trans_acc_name, datepaid, datefor, description, cost_center, link, currency, rate_to_usd, debit, credit, pmode, requester, confirmed, authorized, comitted, txn_reference, flag, comment, creditBalance, debitBalance
        );
        res.json(results);
    } catch (e) {
        console.log(e);
        res.sendStatus(500);
    }
})
accountLinkingRouter.post('/postdirect', async (req, res, next) => {
    try {
        let postedValues = req.body;
        let debitAccMapId = postedValues.debitAccMapId;
        let creditAccMapId = postedValues.creditAccMapId;
        let debitTransactionId = postedValues.debitTransactionId;
        let creditTransactionId = postedValues.creditTransactionId;
        // let value = postedValues.value;
        let linkedOn = postedValues.linkedOn;
        let linkedBy = postedValues.linkedBy;
        // e
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
        let creditBalance = postedValues.creditBalance;
        let debitBalance = postedValues.debitBalance;

        console.log(postedValues.confirmed)

        let results = await accountLinkingDbOperations.postAccountLinking2(
            // debitAccMapId, creditAccMapId, debitTransactionId, creditTransactionId, value, linkedOn, linkedBy
            debitAccMapId, creditAccMapId, debitTransactionId, creditTransactionId, value, linkedOn, linkedBy, fin_acc_account_map_id, index_acc_name_id, index_acc_name, dual_trans_acc_name_id, dual_trans_acc_name, datepaid, datefor, description, cost_center, link, currency, rate_to_usd, debit, credit, pmode, requester, confirmed, authorized, comitted, txn_reference, flag, comment, creditBalance, debitBalance
        );
        res.json(results);
    } catch (e) {
        console.log(e);
        res.sendStatus(500);
    }
})

accountLinkingRouter.post('/post/income', async (req, res, next) => {
    try {
        let postedValues = req.body;
        let debitAccMapId = postedValues.debitAccMapId;
        let creditAccMapId = postedValues.creditAccMapId;
        let debitTransactionId = postedValues.debitTransactionId;
        let creditTransactionId = postedValues.creditTransactionId;
        // let value = postedValues.value;
        let linkedOn = postedValues.linkedOn;
        let linkedBy = postedValues.linkedBy;
        // e
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
        let creditBalance = postedValues.creditBalance;
        let debitBalance = postedValues.debitBalance;

        console.log(postedValues.confirmed)

        let results = await accountLinkingDbOperations.postAccountLinking3(
            // debitAccMapId, creditAccMapId, debitTransactionId, creditTransactionId, value, linkedOn, linkedBy
            debitAccMapId, creditAccMapId, debitTransactionId, creditTransactionId, value, linkedOn, linkedBy, fin_acc_account_map_id, index_acc_name_id, index_acc_name, dual_trans_acc_name_id, dual_trans_acc_name, datepaid, datefor, description, cost_center, link, currency, rate_to_usd, debit, credit, pmode, requester, confirmed, authorized, comitted, txn_reference, flag, comment, creditBalance, debitBalance
        );
        res.json(results);
    } catch (e) {
        console.log(e);
        res.sendStatus(500);
    }
})

accountLinkingRouter.get('/', async (req, res, next) => {
    try {
        let results = await accountLinkingDbOperations.getAccountLinkings();
        res.json(results);
    } catch (e) {
        console.log(e);
        res.sendStatus(500);
    }
});

accountLinkingRouter.get('/:id', async (req, res, next) => {
    try {
        let id = req.params.id;
        let result = await accountLinkingDbOperations.getAccountLinkingById(id);
        res.json(result);
    } catch (e) {
        console.log(e);
        res.sendStatus(500);
    }
});

accountLinkingRouter.put('/:id', async (req, res, next) => {
    try {
        let updatedValues = req.body;
        let id = req.params.id;
        let debitAccMapId = updatedValues.debitAccMapId;
        let creditAccMapId = updatedValues.creditAccMapId;
        let debitTransactionId = updatedValues.debitTransactionId;
        let creditTransactionId = updatedValues.creditTransactionId;
        let value = updatedValues.value;
        let linkedOn = updatedValues.linkedOn;
        let linkedBy = updatedValues.linkedBy;

        let result = await accountLinkingDbOperations.updateAccountLinking(
            id, debitAccMapId, creditAccMapId, debitTransactionId, creditTransactionId, value, linkedOn, linkedBy
        );
        res.json(result);
    } catch (e) {
        console.log(e);
        res.sendStatus(500);
    }
});

accountLinkingRouter.delete('/:id', async (req, res, next) => {
    try {
        let id = req.params.id;
        let result = await accountLinkingDbOperations.deleteAccountLinking(id);
        res.json(result);
    } catch (e) {
        console.log(e);
        res.sendStatus(500);
    }
});

module.exports = accountLinkingRouter;
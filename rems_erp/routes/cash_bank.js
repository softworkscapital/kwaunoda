const express = require('express');
const cashBankRouter = express.Router();
const cashBankDbOperations = require('../cruds/cash_bank');

cashBankRouter.post('/', async (req, res, next) => {
    try {
        let postedValues = req.body;
        let indexAccId = postedValues.index_acc_name_id;
        let indexAccName = postedValues.index_acc_name;
        let dualTransAccName = postedValues.dual_trans_acc_name;
        let dualTransAccNameId = postedValues.dual_trans_acc_name_id;
        let accountMapId = postedValues.fin_acc_account_map_id;
        let accountLink = postedValues.link;
        let datePaid = postedValues.datepaid;
        let dateFor = postedValues.datefor;
        let accountDescription = postedValues.description;
        let costCenter = postedValues.cost_center;
        let debitCash = postedValues.debit_cash;
        let creditCash = postedValues.credit_cash;
        let debitBank = postedValues.debit_bank;
        let creditBank = postedValues.credit_bank;
        let paymentMode = postedValues.pmode;
        let accountCurrency = postedValues.currency;
        let rateToUSD = postedValues.rate_to_usd;
        let rateOnValue = postedValues.rate_on_value;
        let accountValue = postedValues.value;
        let requestBy = postedValues.requester;
        let isConfirmed = postedValues.confirmed;
        let isAuthorized = postedValues.authorized;
        let isCommitted = postedValues.comitted;
        let transactionReference = postedValues.txn_reference;
        let flag = postedValues.flag;
        let commnent = postedValues.comment;
        let accountName = postedValues.acc_name; 
        let results = await cashBankDbOperations.postCashBank(
            indexAccId, indexAccName, dualTransAccName, dualTransAccNameId, accountMapId, accountLink, datePaid, dateFor, accountDescription, costCenter, debitCash, creditCash, debitBank, creditBank, paymentMode, accountCurrency, rateToUSD, rateOnValue, accountValue, requestBy, isConfirmed, isAuthorized, isCommitted, transactionReference, flag, commnent, accountName
        );
        res.json(results);
    } catch (e) {
        console.log(e);
        res.sendStatus(500);
    }
})

cashBankRouter.get('/', async (req, res, next) => {
    try {
        let results = await cashBankDbOperations.getCashBanks();
        res.json(results);
    } catch (e) {
        console.log(e);
        res.sendStatus(500);
    }
});

cashBankRouter.get('/:id', async (req, res, next) => {
    try {
        let id = req.params.id;
        let result = await cashBankDbOperations.getCashBankById(id);
        res.json(result);
    } catch (e) {
        console.log(e);
        res.sendStatus(500);
    }
});

cashBankRouter.get('/acc/:name', async (req, res, next) => {
    try {
        let name = req.params.name;
        let result = await cashBankDbOperations.getCashBankByName(name);
        res.json(result);
    } catch (e) {
        console.log(e);
        res.sendStatus(500);
    }
});

cashBankRouter.put('/:id', async (req, res, next) => {
    try {
        let updatedValues = req.body;
        let id = req.params.id;
        let indexAccId = updatedValues.index_acc_name_id;
        let indexAccName = updatedValues.index_acc_name;
        let dualTransAccName = updatedValues.dual_trans_acc_name;
        let dualTransAccNameId = updatedValues.dual_trans_acc_name_id;
        let accountMapId = updatedValues.fin_acc_account_map_id;
        let accountLink = updatedValues.link;
        let datePaid = updatedValues.datepaid;
        let dateFor = updatedValues.datefor;
        let accountDescription = updatedValues.description;
        let costCenter = updatedValues.cost_center;
        let debitCash = updatedValues.debit_cash;
        let creditCash = updatedValues.credit_cash;
        let debitBank = updatedValues.debit_bank;
        let creditBank = updatedValues.credit_bank;
        let paymentMode = updatedValues.pmode;
        let accountCurrency = updatedValues.currency;
        let rateToUSD = updatedValues.rate_to_usd;
        let rateOnValue = updatedValues.rate_on_value;
        let accountValue = updatedValues.value;
        let requestBy = updatedValues.requester;
        let isConfirmed = updatedValues.confirmed;
        let isAuthorized = updatedValues.authorized;
        let isCommitted = updatedValues.comitted;
        let transactionReference = updatedValues.txn_reference;
        let flag = updatedValues.flag;
        let commnent = updatedValues.comment;
        let accountName = updatedValues.acc_name;
        let result = await cashBankDbOperations.updateCashBank(
            id, indexAccId, indexAccName, dualTransAccName, dualTransAccNameId, accountMapId, accountLink, datePaid, dateFor, accountDescription, costCenter, debitCash, creditCash, debitBank, creditBank, paymentMode, accountCurrency, rateToUSD, rateOnValue, accountValue, requestBy, isConfirmed, isAuthorized, isCommitted, transactionReference, flag, commnent, accountName
        );
        res.json(result);
    } catch (e) {
        console.log(e);
        res.sendStatus(500);
    }
});

cashBankRouter.delete('/:id', async (req, res, next) => {
    try {
        let id = req.params.id;
        let result = await cashBankDbOperations.deleteCashBank(id);
        res.json(result);
    } catch (e) {
        console.log(e);
        res.sendStatus(500);
    }
});

module.exports = cashBankRouter;
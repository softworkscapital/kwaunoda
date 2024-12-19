const express = require('express');
const capitalAccRouter = express.Router();
const capitalAccDbOperations = require('../cruds/capitalacc');

capitalAccRouter.post('/', async (req, res, next) => {
    try {
        let postedValues = req.body;
        let results = await capitalAccDbOperations.postCapitalAcc({
            fin_acc_bank_and_cash_accounts_id: postedValues.fin_acc_bank_and_cash_accounts_id,
            acc_name: postedValues.acc_name,
            datepaid: postedValues.datepaid,
            datefor: postedValues.datefor,
            description: postedValues.description,
            cost_center: postedValues.cost_center,
            map: postedValues.map,
            debit_cash: postedValues.debit_cash,
            credit_cash: postedValues.credit_cash,
            debit_bank: postedValues.debit_bank,
            credit_bank: postedValues.credit_bank,
            pmode: postedValues.pmode,
            requester: postedValues.requester,
            confirmed: postedValues.confirmed,
            authorized: postedValues.authorized,
            committed: postedValues.committed,
            txn_reference: postedValues.txn_reference,
            flag: postedValues.flag,
            comment: postedValues.comment
        });
        res.json(results);
    } catch (e) {
        console.log(e);
        res.sendStatus(500);
    }
});

capitalAccRouter.get('/', async (req, res, next) => {
    try {
        let results = await capitalAccDbOperations.getCapitalAccs();
        res.json(results);
    } catch (e) {
        console.log(e);
        res.sendStatus(500);
    }
});

capitalAccRouter.get('/:id', async (req, res, next) => {
    try {
        let id = req.params.id;
        let result = await capitalAccDbOperations.getCapitalAccById(id);
        res.json(result);
    } catch (e) {
        console.log(e);
        res.sendStatus(500);
    }
});

capitalAccRouter.put('/:id', async (req, res, next) => {
    try {
        let updatedValues = req.body;
        let costCenterId = req.params.id;

        let result = await capitalAccDbOperations.updateCapitalAcc(costCenterId, {
            fin_acc_bank_and_cash_accounts_id: updatedValues.fin_acc_bank_and_cash_accounts_id,
            acc_name: updatedValues.acc_name,
            datepaid: updatedValues.datepaid,
            datefor: updatedValues.datefor,
            description: updatedValues.description,
            cost_center: updatedValues.cost_center,
            map: updatedValues.map,
            debit_cash: updatedValues.debit_cash,
            credit_cash: updatedValues.credit_cash,
            debit_bank: updatedValues.debit_bank,
            credit_bank: updatedValues.credit_bank,
            pmode: updatedValues.pmode,
            requester: updatedValues.requester,
            confirmed: updatedValues.confirmed,
            authorized: updatedValues.authorized,
            committed: updatedValues.committed,
            txn_reference: updatedValues.txn_reference,
            flag: updatedValues.flag,
            comment: updatedValues.comment
        });
        res.json(result);
    } catch (e) {
        console.log(e);
        res.sendStatus(500);
    }
});

capitalAccRouter.delete('/:id', async (req, res, next) => {
    try {
        let id = req.params.id;
        let result = await capitalAccDbOperations.deleteCapitalAcc(id);
        res.json(result);
    } catch (e) {
        console.log(e);
        res.sendStatus(500);
    }
});

module.exports = capitalAccRouter;

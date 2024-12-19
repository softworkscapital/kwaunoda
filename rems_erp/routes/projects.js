const express = require('express');
const projectRouter = express.Router();
const projectDbOperations = require('../cruds/projects');

projectRouter.post('/', async (req, res, next) => {

    try {
        let postedValues = req.body;
        let projectCode = postedValues.projectCode;
        let projectName = postedValues.projectName;
        let projectSummary = postedValues.projectSummary;
        let createdOn = postedValues.createdOn;
        let createdBy = postedValues.createdBy;
       
        let results = await projectDbOperations.postProject(
            projectCode, projectName, projectSummary, createdOn, createdBy
        );
        res.json(results);
    } catch (e) {
        console.log(e);
        res.sendStatus(500);
    }
})

projectRouter.get('/', async (req, res, next) => {
    try {
        let results = await projectDbOperations.getProjects();
        res.json(results);
    } catch (e) {
        console.log(e);
        res.sendStatus(500);
    }
});

projectRouter.get('/:id', async (req, res, next) => {
    try {
        let id = req.params.id;
        let result = await projectDbOperations.getProjectById(id);
        res.json(result);
    } catch (e) {
        console.log(e);
        res.sendStatus(500);
    }
});

projectRouter.get('/acc/:name', async (req, res, next) => {
    try {
        let name = req.params.name;
        let result = await projectDbOperations.getProjectByName(name);
        res.json(result);
    } catch (e) {
        console.log(e);
        res.sendStatus(500);
    }
});

projectRouter.put('/:id', async (req, res, next) => {
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
        let result = await projectDbOperations.updateProject(
            id, indexAccId, indexAccName, dualTransAccName, dualTransAccNameId, accountMapId, accountLink, datePaid, dateFor, accountDescription, costCenter, debitCash, creditCash, debitBank, creditBank, paymentMode, accountCurrency, rateToUSD, rateOnValue, accountValue, requestBy, isConfirmed, isAuthorized, isCommitted, transactionReference, flag, commnent, accountName
        );
        res.json(result);
    } catch (e) {
        console.log(e);
        res.sendStatus(500);
    }
});

projectRouter.delete('/:id', async (req, res, next) => {
    try {
        let id = req.params.id;
        let result = await projectDbOperations.deleteProject(id);
        res.json(result);
    } catch (e) {
        console.log(e);
        res.sendStatus(500);
    }
});

module.exports = projectRouter;
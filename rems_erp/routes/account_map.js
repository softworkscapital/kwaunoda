const express = require('express');
const   accountMapRouter = express.Router();
const accountMapDbOperations = require('../cruds/account_map');

accountMapRouter.post('/', async (req, res, next) => {
    try {
        let postedValues = req.body;
        let accountInfoId = postedValues.fin_acc_account_info_id;
        let accountProjectId = postedValues.fin_acc_account_project_id;
        let createdOn = postedValues.created_on;
        let accountName = postedValues.acc_account_name;
        let createdBy = postedValues.created_by;
        let isAuthorized = postedValues.authorized;
        let accountCurrency = postedValues.currency; 
        let balance = postedValues.balance; 

        let results = await accountMapDbOperations.postAccountMap(
            accountInfoId, accountProjectId, createdOn, accountName, createdBy, isAuthorized, accountCurrency, balance
        );
        res.json(results);
    } catch (e) {
        console.log(e);
        res.sendStatus(500);
    }
})

accountMapRouter.get('/', async (req, res, next) => {
    try {
        let results = await accountMapDbOperations.getAccountMaps();
        res.json(results);
    } catch (e) {
        console.log(e);
        res.sendStatus(500);
    }
});

accountMapRouter.get('/:id', async (req, res, next) => {
    try {
        let id = req.params.id;
        let result = await accountMapDbOperations.getAccountMapById(id);
        res.json(result);
    } catch (e) {
        console.log(e);
        res.sendStatus(500);
    }
});

accountMapRouter.get('/acc/maps', async (req, res, next) => {
    try {
        let results = await accountMapDbOperations.getAccountMapsInfo();
        res.json(results);
    } catch (e) {
        console.log(e);
        res.sendStatus(500);
    }
});
accountMapRouter.get('/acc/maps/info/:id', async (req, res, next) => {
    try {
        let id = req.params.id;
        let results = await accountMapDbOperations.getAccountMapsInfoById(id);
        res.json(results);
    } catch (e) {
        console.log(e);
        res.sendStatus(500);
    }
});

accountMapRouter.get('/acc/maps/all', async (req, res, next) => {
    try {
        let results = await accountMapDbOperations.getAccountMapsInfoAll();
        res.json(results);
    } catch (e) {
        console.log(e);
        res.sendStatus(500);
    }
});

accountMapRouter.get('/acc/maps/index/exp/:name', async (req, res, next) => {
    try {
        let name = req.params.name
        let results = await accountMapDbOperations.getAccountMapsInfo2(name);
        res.json(results);
    } catch (e) {
        console.log(e);
        res.sendStatus(500);
    }
});

accountMapRouter.get('/acc/maps/index/info', async (req, res, next) => {
    try {
        let results = await accountMapDbOperations.getAccountMapsInfo3();
        res.json(results);
    } catch (e) {
        console.log(e);
        res.sendStatus(500);
    }
});

accountMapRouter.get('/acc/maps/acc/name/:name', async (req, res, next) => {
    try {
        let name = req.params.name;
        let results = await accountMapDbOperations.getAccountMapsInfo4(name);
        res.json(results);
    } catch (e) {
        console.log(e);
        res.sendStatus(500);
    }
});

accountMapRouter.put('/:id', async (req, res, next) => {
    try {
        let updatedValues = req.body;
        let id = req.params.id;
        let accountInfoId = updatedValues.fin_acc_account_info_id;
        let accountProjectId = updatedValues.fin_acc_account_project_id;
        let createdOn = updatedValues.created_on;
        let accountName = updatedValues.acc_account_name;
        let createdBy = updatedValues.created_by;
        let isAuthorized = updatedValues.authorized;
        let accountCurrency = updatedValues.currency;

        let result = await accountMapDbOperations.updateAccountMap(
            id, accountInfoId, accountProjectId, createdOn, accountName, createdBy, isAuthorized, accountCurrency
        );
        res.json(result);
    } catch (e) {
        console.log(e);
        res.sendStatus(500);
    }
});

accountMapRouter.delete('/:id', async (req, res, next) => {
    try {
        let id = req.params.id;
        let result = await accountMapDbOperations.deleteAccountMap(id);
        res.json(result);
    } catch (e) {
        console.log(e);
        res.sendStatus(500);
    }
});

module.exports = accountMapRouter;
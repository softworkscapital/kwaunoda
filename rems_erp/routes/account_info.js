const express = require('express');
const accountInfoRouter = express.Router();
const accountInfoDbOperations = require('../cruds/account_info');

accountInfoRouter.post('/', async (req, res, next) => {
    try {
        let postedValues = req.body;
        let classifier = postedValues.classifier;
        let accountClass = postedValues.accountClass;
        let accountCype = postedValues.accountCype;
        let accountFolio = postedValues.accountFolio;
        let explanation = postedValues.explanation;

        console.log('Posted data: ',classifier, accountClass, accountClass);

        let results = await accountInfoDbOperations.postAccountInfo(
            classifier, accountClass, accountCype, accountFolio, explanation
        );
        res.json(results);
    } catch (e) {
        console.log(e);
        res.sendStatus(500);
    }
})

accountInfoRouter.get('/', async (req, res, next) => {
    try {
        let results = await accountInfoDbOperations.getAccountInfos();
        res.json(results);
    } catch (e) {
        console.log(e);
        res.sendStatus(500);
    }
});

accountInfoRouter.get('/:id', async (req, res, next) => {
    try {
        let id = req.params.id;
        let result = await accountInfoDbOperations.getAccountInfoById(id);
        res.json(result);
    } catch (e) {
        console.log(e);
        res.sendStatus(500);
    }
});

accountInfoRouter.get('/type/:name', async (req, res, next) => {
    try {
        let name = req.params.name;
        let result = await accountInfoDbOperations.getAccountInfoByAccType(name);
        res.json(result);
    } catch (e) {
        console.log(e);
        res.sendStatus(500);
    }
});

accountInfoRouter.put('/:id', async (req, res, next) => {
    try {
        let updatedValues = req.body;
        let id = req.params.id;
        let classifier = updatedValues.classifier;
        let accountClass = updatedValues.accountClass;
        let accountType = updatedValues.accountType;
        let accountFolio = updatedValues.accountFolio;
        let explanation = updatedValues.explanation;

        let result = await accountInfoDbOperations.updateAccountInfo(
            id, classifier, accountClass, accountType, accountFolio, explanation
        );
        res.json(result);
    } catch (e) {
        console.log(e);
        res.sendStatus(500);
    }
});

accountInfoRouter.delete('/:id', async (req, res, next) => {
    try {
        let id = req.params.id;
        let result = await accountInfoDbOperations.deleteAccountInfo(id);
        res.json(result);
    } catch (e) {
        console.log(e);
        res.sendStatus(500);
    }
});

module.exports = accountInfoRouter;
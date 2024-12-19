const express = require('express');
const costCenterRouter = express.Router();
const costCenterDbOperations = require('../cruds/cost_center');

costCenterRouter.post('/', async (req, res, next) => {
    try {
        let postedValues = req.body;
        let costCenterName = postedValues.costCenterName;
        let costCenterSummary = postedValues.costCenterSummary;
        let results = await costCenterDbOperations.postCostCenter(
            costCenterName, costCenterSummary
        );
        res.json(results);
    } catch (e) {
        console.log(e);
        res.sendStatus(500);
    }
})

costCenterRouter.get('/', async (req, res, next) => {
    try {
        let results = await costCenterDbOperations.getCostCenters();
        res.json(results);
    } catch (e) {
        console.log(e);
        res.sendStatus(500);
    }
});

costCenterRouter.get('/:id', async (req, res, next) => {
    try {
        let id = req.params.id;
        let result = await costCenterDbOperations.getCostCenterById(id);
        res.json(result);
    } catch (e) {
        console.log(e);
        res.sendStatus(500);
    }
});

costCenterRouter.put('/:id', async (req, res, next) => {
    try {
        let updatedValues = req.body;
        let costCenterId = req.params.id;
        let costCenterName = updatedValues.costCenterName;
        let costCenterSummary = updatedValues.costCenterSummary;

        let result = await costCenterDbOperations.updateCostCenter(
            costCenterId, costCenterName, costCenterSummary
        );
        res.json(result);
    } catch (e) {
        console.log(e);
        res.sendStatus(500);
    }
});

costCenterRouter.delete('/:id', async (req, res, next) => {
    try {
        let id = req.params.id;
        let result = await costCenterDbOperations.deleteCostCenter(id);
        res.json(result);
    } catch (e) {
        console.log(e);
        res.sendStatus(500);
    }
});

module.exports = costCenterRouter;
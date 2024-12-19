const express = require('express');
const shiftRouter = express.Router();
const shiftDbOperations = require('../cruds_pos/shift');

shiftRouter.post('/', async (req, res, next) => {
    try {
        let postedValues = req.body;
        let company_id = postedValues.company_id;
        let branch_id = postedValues.branch_id;
        let operator_id = postedValues.operator_id;
        let date_time_open = postedValues.date_time_open;
        let date_time_close = postedValues.date_time_close;
        let shift_comment = postedValues.shift_comment;
        let syncid = postedValues.syncid;

        let results = await shiftDbOperations.postShift(company_id, branch_id, operator_id, date_time_open, date_time_close, shift_comment, syncid);
        res.json(results);
    } catch (e) {
        console.log(e);
        res.sendStatus(500);
    }
});

shiftRouter.get('/', async (req, res, next) => {
    try {
        let results = await shiftDbOperations.getShift();
        res.json(results);
    } catch (e) {
        console.log(e);
        res.sendStatus(500);
    }
});

shiftRouter.get('/:id', async (req, res, next) => {
    try {
        let shift_id = req.params.id;
        let result = await shiftDbOperations.getShiftById(shift_id);
        res.json(result);
    } catch (e) {
        console.log(e);
        res.sendStatus(500);
    }
});

shiftRouter.put('/:id', async (req, res, next) => {
    try {
        let shift_id = req.params.id;
        let postedValues = req.body;
        let company_id = postedValues.company_id;
        let branch_id = postedValues.branch_id;
        let operator_id = postedValues.operator_id;
        let date_time_open = postedValues.date_time_open;
        let date_time_close = postedValues.date_time_close;
        let shift_comment = postedValues.shift_comment;
        let syncid = postedValues.syncid;

        let result = await shiftDbOperations.updateShift(
            shift_id,
            company_id,
            branch_id,
            operator_id,
            date_time_open,
            date_time_close,
            shift_comment,
            syncid
        );
        res.json(result);
    } catch (e) {
        console.log(e);
        res.sendStatus(500);
    }
});

shiftRouter.delete('/:id', async (req, res, next) => {
    try {
        let id = req.params.id;
        let result = await shiftDbOperations.deleteShift(id);
        res.json(result);
    } catch (e) {
        console.log(e);
        res.sendStatus(500);
    }
});

module.exports = shiftRouter;

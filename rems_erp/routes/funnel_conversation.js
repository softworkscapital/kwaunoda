const express = require('express');
const funnelConRouter = express.Router();
const funnelConDbOperations = require('../cruds/funnel_conversation');

funnelConRouter.post('/', async (req, res, next) => { // 					
    try {
        let postedValues = req.body;
        let prospect_id = postedValues.prospect_id;
        let msg = postedValues.msg;
        let msg_date = postedValues.msg_date;
        let msg_time = postedValues.msg_time;
        let nxtFollowup = postedValues.nxtFollowup;

        let results = await funnelConDbOperations.postFunnelCon(prospect_id, msg, msg_date, msg_time, nxtFollowup);
        res.json(results);
    } catch (e) {
        console.log(e);
        res.sendStatus(500);
    }
})

funnelConRouter.post('/post', async (req, res, next) => { // 					
    try {
        let postedValues = req.body;
        let prospect_id = postedValues.prospect_id;
        let user_id = postedValues.user_id;
        let msg = postedValues.msg;
        let nxtFollowup = postedValues.nxtFollowup;
        let funnel_stage = postedValues.funnel_stage;

        let results = await funnelConDbOperations.postFunnelCon2(prospect_id, user_id, msg, nxtFollowup, funnel_stage);
        res.json(results);
    } catch (e) {
        console.log(e);
        res.sendStatus(500);
    }
})

funnelConRouter.get('/', async (req, res, next) => {
    try {
        let results = await funnelConDbOperations.getFunnelCons();
        res.json(results);
    } catch (e) {
        console.log(e);
        res.sendStatus(500);
    }
});

funnelConRouter.get('/funcon', async (req, res, next) => {
    try {
        let results = await funnelConDbOperations.getFunnelConsJoin();
        res.json(results);
    } catch (e) {
        console.log(e);
        res.sendStatus(500);
    }
});

// Get by user  getFunnelConsJoin2
funnelConRouter.get('/funcon/:id', async (req, res, next) => {
    try {
        let id = req.params.id;
        let results = await funnelConDbOperations.getFunnelConsJoin2(id);
        res.json(results);
    } catch (e) {
        console.log(e);
        res.sendStatus(500);
    }
});

// Get by user  getFunnelConsJoin2
funnelConRouter.get('/funcon/date/:id', async (req, res, next) => {
    try {
        let id = req.params.id;
        let results = await funnelConDbOperations.getFunnelConsJoin3(id);
        res.json(results);
    } catch (e) {
        console.log(e);
        res.sendStatus(500);
    }
});

funnelConRouter.get('/funcon/byid/:id', async (req, res, next) => {
    try {
        let id = req.params.id;
        let results = await funnelConDbOperations.getFunnelConsById(id);
        res.json(results);
    } catch (e) {
        console.log(e);
        res.sendStatus(500);
    }
});

funnelConRouter.put('/:id', async (req, res, next) => {
    try {
        let id = req.params.id;
        let updatedValues = req.body;
        let prospect_id = updatedValues.prospect_id;
        let msg = updatedValues.msg;
        let msg_date = updatedValues.msg_date;
        let msg_time = updatedValues.msg_time;
        let next_follow_up = updatedValues.next_follow_up;

        let result = await funnelConDbOperations.updateFunnelCon(
            id, prospect_id, msg, msg_date, msg_time, next_follow_up
        );
        res.json(result);
    } catch (e) {
        console.log(e);
        res.sendStatus(500);
    }
});

funnelConRouter.delete('/:id', async (req, res, next) => {
    try {
        let id = req.params.id;
        let result = await funnelConDbOperations.deleteFunnelCon(id);
        res.json(result);
    } catch (e) {
        console.log(e);
        res.sendStatus(500);
    }
});

module.exports = funnelConRouter;
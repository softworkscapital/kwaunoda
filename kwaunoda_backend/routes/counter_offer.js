const express = require('express');
const userRouter = express.Router();
const usersDbOperations = require('../cruds/counter_offer');

userRouter.post('/', async (req, res, next) => {
    try {
        let postedValues = req.body;
        let customerid = postedValues.customerid;
        let driver_id = postedValues.driver_id;
        let trip_id = postedValues.trip_id;
        let date_time= postedValues.date_time;
        let offer_value = postedValues.offer_value;
        let counter_offer_value = postedValues.counter_offer_value;
        let status = postedValues.status;
        

        console.log(postedValues);

        let results = await usersDbOperations.postCounter(
            customerid,
            driver_id,
            trip_id,
            date_time,
            offer_value,
            counter_offer_value,
            status);
        res.json(results);
    } catch (e) {
        console.log(e);
        res.sendStatus(500);
    }
})



userRouter.get('/', async (req, res, next) => {
    try {
        let results = await usersDbOperations.getCounters();
        res.json(results);
    } catch (e) {
        console.log(e);
        res.sendStatus(500);
    }
});

userRouter.get('/:counter_offer_id', async (req, res, next) => {
    try {
        let counter_offer_id = req.params.counter_offer_id;
        let result = await usersDbOperations.getCounterById(counter_offer_id);
        res.json(result);
    } catch (e) {
        console.log(e);
        res.sendStatus(500);
    }
});





//Update OTP
userRouter.put('/updateCounter/:counter_offer_id', async (req, res, next) => {
    try {
        let counter_offer_id = req.params.counter_offer_id;
        let postedValues = req.body;

        let result = await usersDbOperations.updateCounter(counter_offer_id,postedValues);
        res.json(result);
    } catch (e) {
        console.log(e);
        res.sendStatus(500);
    }
});

//Update OTP


userRouter.delete('/:counter_offer_id', async (req, res, next) => {
    try {
        let counter_offer_id = req.params.counter_offer_id;
        let result = await usersDbOperations.deleteCounter(counter_offer_id);
        res.json(result);
    } catch (e) {
        console.log(e);
        res.sendStatus(500);
    }
});

module.exports = userRouter;
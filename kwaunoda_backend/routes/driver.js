const express = require('express');
const DriverRouter = express.Router();
const DriverDbOperations = require('../cruds/driver_details');

DriverRouter.post('/', async (req, res, next) => {
    try {
        let postedValues = req.body;
        let {
            ecnumber,
            account_type,
            signed_on,
            username,
            name,
            surname,
            idnumber,
            sex,
            dob,
            address,
            house_number_and_street_name,
            surbub,
            city,
            country,
            lat_cordinates,
            long_cordinates,
            phone,
            plate,
            email,
            password,
            employer,
            workindustry,
            workaddress,
            workphone,
            workphone2,
            nok1name,
            nok1surname,
            nok1relationship,
            nok1phone,
            nok2name,
            nok2surname,
            nok2relationship,
            nok2phone,
            rating,
            credit_bar_rule_exception,
            membershipstatus,
            defaultsubs,
            sendmail,
            sendsms,
            product_code,
            cost_price,
            selling_price,
            payment_style,
            profilePic
        } = postedValues;

        let results = await DriverDbOperations.postDriver(
            ecnumber,
            account_type,
            signed_on,
            username,
            name,
            surname,
            idnumber,
            sex,
            dob,
            address,
            house_number_and_street_name,
            surbub,
            city,
            country,
            lat_cordinates,
            long_cordinates,
            phone,
            plate,
            email,
            password,
            employer,
            workindustry,
            workaddress,
            workphone,
            workphone2,
            nok1name,
            nok1surname,
            nok1relationship,
            nok1phone,
            nok2name,
            nok2surname,
            nok2relationship,
            nok2phone,
            rating,
            credit_bar_rule_exception,
            membershipstatus,
            defaultsubs,
            sendmail,
            sendsms,
            product_code,
            cost_price,
            selling_price,
            payment_style,
            profilePic
           
        );
        res.json(results);
    } catch (e) {
        console.log(e);
        res.sendStatus(500);
    }
});

DriverRouter.get('/', async (req, res, next) => {
    try {
        let results = await DriverDbOperations.getDrivers();
        res.json(results);
    } catch (e) {
        console.log(e);
        res.sendStatus(500);
    }
});

DriverRouter.get('/:driver_id', async (req, res, next) => {
    try {
        let driver_id = req.params.driver_id;
        let result = await DriverDbOperations.getDriverById(driver_id);
        res.json(result);
    } catch (e) {
        console.log(e);
        res.sendStatus(500);
    }
});

DriverRouter.put('/:id', async (req, res, next) => {
    try {
        let driver_id = req.params.id;
        let updatedValues = req.body;

        let results = await DriverDbOperations.updateDriver(driver_id, updatedValues);
        res.json(results);
    } catch (e) {
        console.log(e);
        res.sendStatus(500);
    }
});

DriverRouter.put('/:id', async (req, res, next) => {
    try {
        let driver_id = req.params.id;
        let updatedValues = req.body;

        let results = await DriverDbOperations.updateDriver(driver_id, updatedValues);
        res.json(results);
    } catch (e) {
        console.log(e);
        res.sendStatus(500);
    }
});

DriverRouter.delete('/:id', async (req, res, next) => {
    try {
        let driver_id = req.params.id;
        let result = await DriverDbOperationsDbOperations.deleteDriver(driver_id);
        res.json(result);
    } catch (e) {
        console.log(e);
        res.sendStatus(500);
    }
});

module.exports = DriverRouter;

const express = require('express');
const CustomerRouter = express.Router();
const CustomersDbOperations = require('../cruds_pos/customer_details');

CustomerRouter.post('/', async (req, res, next) => {
    try {
        let postedValues = req.body;
        let {
            customerid,
            ecnumber,
            account_type,
            account_category,
            signed_on,
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
            phoneno1,
            phoneno2,
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
            creditstanding,
            membershipstatus,
            defaultsubs,
            sendmail,
            sendsms,
            product_code,
            cost_price,
            selling_price,
            payment_style,
            bp_number,
            vat_number
        } = postedValues;

        let results = await CustomersDbOperations.postCustomer(
            customerid,
            ecnumber,
            account_type,
            account_category,
            signed_on,
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
            phoneno1,
            phoneno2,
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
            creditstanding,
            membershipstatus,
            defaultsubs,
            sendmail,
            sendsms,
            product_code,
            cost_price,
            selling_price,
            payment_style,
            bp_number,
            vat_number
        );
        res.json(results);
    } catch (e) {
        console.log(e);
        res.sendStatus(500);
    }
});

CustomerRouter.get('/', async (req, res, next) => {
    try {
        let results = await CustomersDbOperations.getCustomers();
        res.json(results);
    } catch (e) {
        console.log(e);
        res.sendStatus(500);
    }
});

CustomerRouter.get('/:id', async (req, res, next) => {
    try {
        let customer_id = req.params.id;
        let result = await CustomersDbOperations.getCustomerById(customer_id);
        res.json(result);
    } catch (e) {
        console.log(e);
        res.sendStatus(500);
    }
});

CustomerRouter.put('/:id', async (req, res, next) => {
    try {
        let customer_id = req.params.id;
        let updatedValues = req.body;

        let results = await CustomersDbOperations.updateCustomer(customer_id, updatedValues);
        res.json(results);
    } catch (e) {
        console.log(e);
        res.sendStatus(500);
    }
});

CustomerRouter.delete('/:id', async (req, res, next) => {
    try {
        let id = req.params.id;
        let result = await CustomersDbOperations.deleteCustomer(id);
        res.json(result);
    } catch (e) {
        console.log(e);
        res.sendStatus(500);
    }
});

module.exports = CustomerRouter;

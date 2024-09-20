const express = require('express');
const tripRouter = express.Router();
const tripDbOperations = require('../cruds/trip');
const { updateOTPStatus } = require('../cruds/users');

tripRouter.post('/', async (req, res, next) => {
    try {
        let postedValues = req.body;
        let driver_id = postedValues.driver_id;
        let cust_id = postedValues.cust_id;
        let order_start_time = postedValues.order_start_time;
        let start_date_time = postedValues.start_date_time;
        let status = postedValues.status;
        let deliveray_details = postedValues.deliveray_details;
        let weight = postedValues.weight;
        let delivery_contact_details = postedValues.delivery_contact_details;
        let dest_location = postedValues.dest_location;
        let origin_location = postedValues.origin_location;
        let origin_location_lat = postedValues.origin_location_lat;
        let origin_location_long = postedValues.origin_location_long;
        let destination_lat = postedValues.destination_lat;
        let destination_long = postedValues.destination_long;
        let distance = postedValues.distance;
        let delivery_cost_proposed = postedValues.delivery_cost_proposed;
        let accepted_cost = postedValues.accepted_cost;
        let payment_type = postedValues.payment_type;
        let currency_id = postedValues.currency_id;
        let currency_code = postedValues.urrency_code;
        let usd_rate = postedValues.usd_rate;
        let customer_comment = postedValues.customer_comment;
        let driver_comment = postedValues.driver_comment;
        let driver_stars = postedValues.driver_stars;
        

        console.log(status);

        let results = await tripDbOperations.postTrip(driver_id,cust_id,order_start_time,start_date_time,status,deliveray_details,weight,delivery_contact_details,dest_location,origin_location,origin_location_lat,origin_location_long,destination_lat,destination_long,distance,delivery_cost_proposed,accepted_cost,payment_type,currency_id,currency_code,usd_rate,customer_comment,driver_comment,driver_stars);
        res.json(results);
    } catch (e) {
        console.log(e);
        res.sendStatus(500);
    }
})


tripRouter.get('/', async (req, res, next) => {
    try {
        let results = await tripDbOperations.getTrips();
        res.json(results);
    } catch (e) {
        console.log(e);
        res.sendStatus(500);
    }
});

tripRouter.get('/status/', async (req, res, next) => {
    try {
        let results = await tripDbOperations.getTripByStatus();
        res.json(results);
    } catch (e) {
        console.log(e);
        res.sendStatus(500);
    }
});

tripRouter.get('/:id', async (req, res, next) => {
    try {
        let id = req.params.id;
        let result = await tripDbOperations.getTripById(id);
        res.json(result);
    } catch (e) {
        console.log(e);
        res.sendStatus(500);
    }
});



tripRouter.put('/:id', async (req, res, next) => {
    try {
      let trip_id = req.params.id;
      let updatedValues = req.body;

      let result = await tripDbOperations.updateTrip(trip_id,updateOTPStatus);
      res.json(result);
    } catch (e) {
      console.log(e);
      res.sendStatus(500);
    }
  });

tripRouter.delete('/:id', async (req, res, next) => {
    try {
        let id = req.params.id;
        let result = await tripDbOperations.deleteTrip(id);
        res.json(result);
    } catch (e) {
        console.log(e);
        res.sendStatus(500);
    }
});

module.exports = tripRouter;
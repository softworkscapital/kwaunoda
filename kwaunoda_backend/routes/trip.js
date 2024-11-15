const express = require("express");
const tripRouter = express.Router();
const tripDbOperations = require("../cruds/trip");

tripRouter.post("/", async (req, res, next) => {
  try {
    let postedValues = req.body;
    let driver_id = postedValues.driver_id;
    let cust_id = postedValues.cust_id;
    let request_start_datetime = postedValues.request_start_datetime;
    let order_start_datetime = postedValues.order_start_datetime;
    let order_end_datetime = postedValues.order_end_datetime;
    let status = postedValues.status;
    let deliveray_details = postedValues.deliveray_details;
    let delivery_notes = postedValues.delivery_notes;
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
    let paying_when = postedValues.paying_when;
    let payment_type = postedValues.payment_type;
    let currency_id = postedValues.currency_id;
    let currency_code = postedValues.urrency_code;
    let usd_rate = postedValues.usd_rate;
    let customer_comment = postedValues.customer_comment;
    let driver_comment = postedValues.driver_comment;
    let driver_stars = postedValues.driver_stars;
    let customer_stars = postedValues.customer_stars;

    console.log(status);

    let results = await tripDbOperations.postTrip(
      driver_id,
      cust_id,
      request_start_datetime,
      order_start_datetime,
      order_end_datetime,
      status,
      deliveray_details,
      delivery_notes,
      weight,
      delivery_contact_details,
      dest_location,
      origin_location,
      origin_location_lat,
      origin_location_long,
      destination_lat,
      destination_long,
      distance,
      delivery_cost_proposed,
      accepted_cost,
      paying_when,
      payment_type,
      currency_id,
      currency_code,
      usd_rate,
      customer_comment,
      driver_comment,
      driver_stars,
      customer_stars
    );
    res.json(results);
  } catch (e) {
    console.log(e);
    res.sendStatus(500);
  }
});

tripRouter.get("/", async (req, res, next) => {
  try {
    let results = await tripDbOperations.getTrips();
    res.json(results);
  } catch (e) {
    console.log(e);
    res.sendStatus(500);
  }
});


tripRouter.get("/getlasttwentyfeedback", async (req, res, next) => {
  try {
    let results = await tripDbOperations.getLast20Trips();
    res.json(results);
  } catch (e) {
    console.log(e);
    res.sendStatus(500);
  }
});

tripRouter.get("/driver_id/status", async (req, res, next) => {
  const { driver_id, status } = req.query; // Extract parameters from the query

  if (!driver_id || !status) {
    return res
      .status(400)
      .json({ error: "Driver ID and status are required." });
  }

  try {
    let results = await tripDbOperations.getNumberofTrips(driver_id, status);
    res.json({ tripCount: results }); // Return the count in a JSON response
  } catch (e) {
    console.log(e);
    res.sendStatus(500);
  }
});
tripRouter.put("/updateStatusAndDriver/:id", async (req, res, next) => {
  try {
    const trip_id = req.params.id; // Get trip_id from URL parameters
    const { driver_id, status } = req.body; // Get driver_id and status from request body

    // Validate the input
    if (!driver_id || !status) {
      return res.status(400).json({ error: "Driver ID and status are required." });
    }

    // Call the updateStatusAndDriver function
    const result = await tripDbOperations.updateStatusAndDriver(trip_id, driver_id, status);

    // Send the result back to the client
    res.json(result);
  } catch (e) {
    console.log(e);
    res.sendStatus(500); // Send a 500 Internal Server Error status
  }
});
tripRouter.get("/tripsbystatus/:status", async (req, res, next) => {
  try {
    let status = req.params.status
    let results = await tripDbOperations.getTripToDash(status);
    res.json(results);
  } catch (e) {
    console.log(e);
    res.sendStatus(500);
  }
});

tripRouter.get("/byStatus/driver_id/status", async (req, res, next) => {
  const { driver_id, status } = req.query; // Extract parameters from the query
  if (!driver_id || !status) {
    return res
      .status(400)
      .json({ error: "Driver ID and status are required." });
  }
  try {
    // Fetch trips with the given driver_id and status
    let results = await tripDbOperations.getTripByDriverAndStatus(driver_id, status);

    // Check if any results were found
    if (results.length === 0) {
      return res.status(404).json({ message: "No trips found." });
    }
    res.json(results); // Return the list of trips in a JSON response
  } catch (e) {
    console.error(e);
    res.sendStatus(500); // Send a 500 error if something goes wrong
  }
});



tripRouter.get("/byStatus/customer/:cust_id/:status", async (req, res, next) => {
  const { cust_id, status } = req.params; // Extract parameters from the query
  if (!cust_id || !status) {
    return res
      .status(400)
      .json({ error: "Driver ID and status are required." });
  }
  try {
    // Fetch trips with the given driver_id and status
    let results = await tripDbOperations.getTripByCustomerIdAndStatus(cust_id, status);

    // Check if any results were found
    if (results.length === 0) {
      return res.status(404).json({ message: "No trips found." });
    }
    res.json(results); // Return the list of trips in a JSON response
  } catch (e) {
    console.error(e);
    res.sendStatus(500); // Send a 500 error if something goes wrong
  }
});



tripRouter.get("/driver/notify/", async (req, res, next) => {
  try {
    let results = await tripDbOperations.getTripByStatusToDriver();
    res.json(results);
  } catch (e) {
    console.log(e);
    res.sendStatus(500);
  }
});

tripRouter.get("/driver/notify/:id", async (req, res, next) => {
  try {
    let driver_id = req.params.id;
    let results = await tripDbOperations.getTripByStatusToDriverEnd(driver_id);
    res.json(results);
  } catch (e) {
    console.log(e);
    res.sendStatus(500);
  }
});

tripRouter.get("/customer/notify/:id", async (req, res, next) => {
  try {
    let cust_id = req.params.id;
    let results = await tripDbOperations.getTripByStatusToCustomer(cust_id);
    res.json(results);
  } catch (e) {
    console.log(e);
    res.sendStatus(500);
  }
});

tripRouter.get("/:id", async (req, res, next) => {
  try {
    let id = req.params.id;
    let result = await tripDbOperations.getTripById(id);
    res.json(result);
  } catch (e) {
    console.log(e);
    res.sendStatus(500);
  }
});

tripRouter.put("/:id", async (req, res, next) => {
  try {
    let trip_id = req.params.id;
    let updatedValues = req.body;

    let result = await tripDbOperations.updateTrip(trip_id, updatedValues);
    res.json(result);
  } catch (e) {
    console.log(e);
    res.sendStatus(500);
  }
});

//#########################
tripRouter.get('/mylastTwentyTripsById/:customer_id/:driver_id', async (req, res, next) => {
    try {
        let customer_id = req.params.customer_id;
        let driver_id = req.params.driver_id;
        let result = await tripDbOperations.getMylastTwentyTripsById(customer_id,driver_id);
        res.json(result);
    } catch (e) {
        console.log(e);
        res.sendStatus(500);
    }
});


tripRouter.put("/customerComment/:id", async (req, res, next) => {
  try {
    const trip_id = req.params.id; // Get trip_id from URL parameters
    const updatedValues = req.body; // Get updated values from request body

    // Call the updateCustomerComment function
    const result = await tripDbOperations.updateCustomerComment(
      trip_id,
      updatedValues
    );

    // Send the result back to the client
    res.json(result);
  } catch (e) {
    console.log(e);
    res.sendStatus(500); // Send a 500 Internal Server Error status
  }
});

tripRouter.put("/driverComment/:id", async (req, res, next) => {
  try {
    const trip_id = req.params.id; // Get trip_id from URL parameters
    const updatedValues = req.body; // Get updated values from request body

    // Call the updateDriverComment function with updatedValues
    const result = await tripDbOperations.updateDriverComment(
      trip_id,
      updatedValues
    );

    // Send the result back to the client
    res.json(result);
  } catch (e) {
    console.log(e);
    res.sendStatus(500); // Send a 500 Internal Server Error status
  }
});

tripRouter.delete("/:id", async (req, res, next) => {
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

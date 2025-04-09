const express = require("express");
const VehicleRouter = express.Router();
const VehicleDbOperations = require("../cruds/vehicles");

// Route to create a new driver
VehicleRouter.post("/", async (req, res, next) => {
  try {
    let postedValues = req.body;
    let {
        number_plate,
        driver_id,
        vehicle_make,
        vehicle_model,
        colour,
        vehicle_license_image,
        vehicle_image1,
        vehicle_image2,
        vehicle_image3,
        vehicle_category,
        vehicle_year,
        vehicle_count,
        vehicle_type	
    } = postedValues;

    let results = await VehicleDbOperations.postVehicle(
        number_plate,
        driver_id,
        vehicle_make,
        vehicle_model,
        colour,
        vehicle_license_image,
        vehicle_image1,
        vehicle_image2,
        vehicle_image3,
        vehicle_category,
        vehicle_year,
        vehicle_count	,
        vehicle_type
    );
    res.json(results);
  } catch (e) {
    console.log(e);
    res.sendStatus(500);
  }
});       

// Route to get all drivers
VehicleRouter.get("/", async (req, res, next) => {
  try {
    let results = await VehicleDbOperations.getVehicles();
    res.json(results);
  } catch (e) {
    console.log(e);
    res.sendStatus(500);
  }
});

// Route to get a driver by ID
VehicleRouter.get("/:driver_id", async (req, res, next) => {
  try {
    let number_plate = req.params.number_plate;
    let result = await VehicleDbOperations.getVehicleById(number_plate);
    res.json(result);
  } catch (e) {
    console.log(e);
    res.sendStatus(500);
  }
});


VehicleRouter.get("/getvehiclesbydriverid/:driver_id", async (req, res, next) => {
  try {
    let driver_id = req.params.driver_id; // Use driver_id instead of number_plate
    let result = await VehicleDbOperations.getVehicleByDriverId(driver_id);
    res.json(result);
  } catch (e) {
    console.log(e);
    res.sendStatus(500);
  }
});


// Route to update a driver's details
VehicleRouter.put("/:id", async (req, res, next) => {
  try {
    let number_plate = req.params.id;
    let updatedValues = req.body;

    let results = await VehicleDbOperations.updateVehicle(
        number_plate,
      updatedValues
    );
    res.json(results);
  } catch (e) {
    console.log(e);
    res.sendStatus(500);
  }
});


// Route to delete a driver
VehicleRouter.delete("/:id", async (req, res, next) => {
  try {
    let number_plate = req.params.id;
    let result = await VehicleDbOperations.deleteVehicle(number_plate);
    res.json(result);
  } catch (e) {
    console.log(e);
    res.sendStatus(500);
  }
});


module.exports = VehicleRouter;

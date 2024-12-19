const express = require("express");
const salesPriceRouter = express.Router();
const salesPricesDbOperations = require("../cruds_gas_ecosystem/sales_prices");

// Post a new sales price
salesPriceRouter.post("/", async (req, res, next) => {
  try {
    let postedValues = req.body;
    let {
      sales_prices_id, // Ensure this is correctly included if necessary
      item,
      price,
      changed_by,
      changed_on,
      branch_id,
      company_id,
      sync_date_time,
      sync_id,
      sync_status,
    } = postedValues;

    let results = await salesPricesDbOperations.postSalesPrice(
      sales_prices_id,
      item,
      price,
      changed_by,
      changed_on,
      branch_id,
      company_id,
      sync_date_time,
      sync_id,
      sync_status
    );
    res.json(results);
  } catch (e) {
    console.log(e);
    res.sendStatus(500);
  }
});

// Get all sales prices
salesPriceRouter.get("/", async (req, res, next) => {
  try {
    let results = await salesPricesDbOperations.getSalesPrices();
    res.json(results);
  } catch (e) {
    console.log(e);
    res.sendStatus(500);
  }
});

// Get sales price by ID
salesPriceRouter.get("/:id", async (req, res, next) => {
  try {
    let id = req.params.id;
    let result = await salesPricesDbOperations.getSalesPricesById(id);
    res.json(result);
  } catch (e) {
    console.log(e);
    res.sendStatus(500);
  }
});

salesPriceRouter.get(
  "/branchid/:branch_id/companyid/:company_id",
  async (req, res, next) => {
    try {
      const branch_id = req.params.branch_id;
      const company_id = req.params.company_id;

      console.log(
        "Received branch_id:",
        branch_id,
        "and company_id:",
        company_id
      );

      let results = await salesPricesDbOperations.getSalesPricesByBranchCompany(
        branch_id,
        company_id
      );

      // Check if results are found
      if (results && results.length > 0) {
        res.json(results); // Return the array of results
      } else {
        res.status(404).json({
          message: "No sales prices found for the given branch and company.",
        });
      }
    } catch (e) {
      console.error("Error fetching sales prices:", e); // Log the error
      res.sendStatus(500); // Internal Server Error
    }
  }
);

salesPriceRouter.get(
  "/lastprice/branchid/:branch_id/companyid/:company_id",
  async (req, res, next) => {
    try {
      const branch_id = req.params.branch_id;
      const company_id = req.params.company_id;

      console.log(
        "Received branch_id:",
        branch_id,
        "and company_id:",
        company_id
      );

      let results =
        await salesPricesDbOperations.getSalesPricesLastPriceByBranchCompany(
          branch_id,
          company_id
        );

      // Check if results are found
      if (results && results.length > 0) {
        res.json(results); // Return the array of results
      } else {
        res.status(404).json({
          message: "No sales prices found for the given branch and company.",
        });
      }
    } catch (e) {
      console.error("Error fetching sales prices:", e); // Log the error
      res.sendStatus(500); // Internal Server Error
    }
  }
);

// Update a sales price
salesPriceRouter.put("/:id", async (req, res, next) => {
  try {
    let updatedValues = req.body;
    let id = req.params.id;

    let {
      item,
      price,
      changed_by,
      changed_on,
      branch_id,
      company_id,
      sync_id,
    } = updatedValues;

    let result = await salesPricesDbOperations.updateSalesPrice(
      id, // Use the id from params
      item,
      price,
      changed_by,
      changed_on,
      branch_id,
      company_id,
      sync_id
    );
    res.json(result);
  } catch (e) {
    console.log(e);
    res.sendStatus(500);
  }
});

// Delete a sales price
salesPriceRouter.delete("/:id", async (req, res, next) => {
  try {
    let id = req.params.id;
    let result = await salesPricesDbOperations.deleteSalesPrice(id);
    res.json(result);
  } catch (e) {
    console.log(e);
    res.sendStatus(500);
  }
});

module.exports = salesPriceRouter;

const express = require("express");
const topUpRouter = express.Router();
const topUpsDbOperations = require("../cruds/topUp");

// Placeholder for authenticateToken function
const authenticateToken = (req, res, next) => {
  // Implement your authentication logic here if needed
  next(); // Call next() to proceed to the route handler
};

// Get topUps all
topUpRouter.get("/", authenticateToken, async (req, res, next) => {
  try {
    let results = await topUpsDbOperations.getTopUp();
    res.json(results);
  } catch (e) {
    console.log(e);
    res.sendStatus(500);
  }
});

// Get Admin Balance all
topUpRouter.get("/adminBal", authenticateToken, async (req, res, next) => {
  try {
    let results = await topUpsDbOperations.getAdminBlance();
    res.json(results);
  } catch (e) {
    console.log(e);
    res.sendStatus(500);
  }
});

// Get topUps by id
topUpRouter.get("/:top_up_id", authenticateToken, async (req, res, next) => {
  try {
    let top_up_id = req.params.top_up_id;
    let results = await topUpsDbOperations.getTopUpById(top_up_id);
    res.json(results);
  } catch (e) {
    console.log(e);
    res.sendStatus(500);
  }
});

// Get topUps by client_profile_id
topUpRouter.get(
  "/topup/:client_profile_id",
  authenticateToken,
  async (req, res, next) => {
    try {
      let client_profile_id = req.params.client_profile_id;
      let results = await topUpsDbOperations.getTopUpByClientId(
        client_profile_id
      );
      res.json(results);
    } catch (e) {
      console.log(e);
      res.sendStatus(500);
    }
  }
);

// Get last topup by client_profile_id
topUpRouter.get("/lasttopup/:client_profile_id", async (req, res, next) => {
  try {
    let client_profile_id = req.params.client_profile_id;
    let results = await topUpsDbOperations.getLastTopUpById(client_profile_id);
    res.json(results);
  } catch (e) {
    console.log(e);
    res.sendStatus(500);
  }
});

// Post topUp
topUpRouter.post("/", authenticateToken, async (req, res, next) => {
  try {
    let postedValues = req.body;
    let {
      currency,
      exchange_rate,
      date,
      debit,
      credit,
      balance,
      description,
      client_profile_id,
    } = postedValues;

    console.log(req.body);

    let results = await topUpsDbOperations.postTopUp(
      currency,
      exchange_rate,
      date,
      debit,
      credit,
      balance,
      description,
      client_profile_id
    );
    res.json(results);
  } catch (e) {
    console.log(e);
    res.sendStatus(500);
  }
});

// Update topUp by id
topUpRouter.put("/:id", authenticateToken, async (req, res, next) => {
  try {
    let top_up_id = req.params.id;
    let postedValues = req.body;
    let {
      currency,
      exchange_rate,
      amount,
      balance,
      description,
      client_profile_id,
    } = postedValues;

    let results = await topUpsDbOperations.putTopUp(
      top_up_id,
      currency,
      exchange_rate,
      amount,
      balance,
      description,
      client_profile_id
    );
    res.json(results);
  } catch (e) {
    console.log(e);
    res.sendStatus(500);
  }
});

// Delete topUp by id
topUpRouter.delete("/:top_up_id", authenticateToken, async (req, res, next) => {
  try {
    let top_up_id = req.params.top_up_id;
    let results = await topUpsDbOperations.deleteTopUpById(top_up_id);
    res.json(results);
  } catch (e) {
    console.log(e);
    res.sendStatus(500);
  }
});
topUpRouter.post("/topupcr", authenticateToken, async (req, res, next) => {
  try {
    // Extract data from the request body
    const { cr, trip_id, client_profile_id, desc, trxn_code } = req.body;

    // Validate request data

    
    // Call the postCrTopUp function with the extracted data
    let results = await topUpsDbOperations.postCrTopUp(
      cr,
      trip_id,
      client_profile_id,
      desc,
      trxn_code
    );

    // Send back the resultss
    res.json(results);
  } catch (e) {
    console.error(e);
    res.sendStatus(500);
  }
});

topUpRouter.post("/topupdr", authenticateToken, async (req, res, next) => {
  const { dr, trip_id, client_profile_id, desc, trxn_code } = req.body;

  if (!dr || !trip_id || !client_profile_id || !desc || !trxn_code) {
    return res
      .status(400)
      .json({ status: "400", message: "Missing required fields." });
  }

  try {
    const result = await topUpsDbOperations.postDrTopUp(
      dr,
      trip_id,
      client_profile_id,
      desc,
      trxn_code
    );
    res.status(result[0].status).json(result[0]);
  } catch (error) {
    console.error("Error in top-up:", error);
    res.status(500).json({ status: "500", message: "Internal server error." });
  }
});
module.exports = topUpRouter;

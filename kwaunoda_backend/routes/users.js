const express = require("express");
const userRouter = express.Router();
const usersDbOperations = require("../cruds/users"); // Adjust the path accordingly

// Create a new user
userRouter.post("/", async (req, res, next) => {
  try {
    const postedValues = req.body; // Get the posted data

    // Destructure the required fields from the posted values
    const {
      userid,
      username,
      password,
      role,
      email,
      notify,
      activesession,
      addproperty,
      editproperty,
      approverequests,
      delivery,
      status,
      employee_id,
      company_id,
      branch_id,
      sync_status,
      last_logged_account,
      driver_id,
      customerid,
      otp,
    } = postedValues;

    // Call the DB operation to insert the user
    const results = await usersDbOperations.postUser(
      userid,
      username,
      password,
      role,
      email,
      notify,
      activesession,
      addproperty,
      editproperty,
      approverequests,
      delivery,
      status,
      employee_id,
      company_id,
      branch_id,
      sync_status,
      last_logged_account,
      driver_id,
      customerid,
      otp
    );

    // Respond with the results
    res.json(results);
  } catch (e) {
    console.log(e);
    res.sendStatus(500); // Send a 500 status code in case of an error
  }
});

// Get Last Inserted User ID
userRouter.get("/last-inserted-id", async (req, res, next) => {
  try {
    const lastId = await usersDbOperations.getLastInsertedUserId(); // Fetching last inserted user ID
    res.json({ lastInsertedId: lastId });
  } catch (e) {
    console.log(e);
    res.sendStatus(500); // Send a 500 status code in case of an error
  }
});

// Get All Users
userRouter.get("/", async (req, res, next) => {
  try {
    const users = await usersDbOperations.getUsers(); // Fetch all users
    res.json(users); // Respond with users
  } catch (e) {
    console.log(e);
    res.sendStatus(500); // Send a 500 status code in case of an error
  }
});

// Get User by ID
userRouter.get("/:id", async (req, res, next) => {
  try {
    const userId = req.params.id; // Extract user ID from parameters
    const user = await usersDbOperations.getUserById(userId); // Fetch user by ID

    // Check if user was found
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user); // Respond with user details
  } catch (e) {
    console.log(e);
    res.sendStatus(500); // Send a 500 status code in case of an error
  }
});

//Get User By User Credentials
userRouter.get("/:email/:password", async (req, res, next) => {
  try {
    let email = req.params.email;
    let password = req.params.password;
    let result = await usersDbOperations.getUserByCred(email, password);
    res.json(result);
  } catch (e) {
    console.log(e);
    res.sendStatus(500);
  }
});


// Update User by ID
userRouter.put("/:id", async (req, res, next) => {
  try {
    const userId = req.params.id; // Extract user ID from parameters
    const updatedValues = req.body; // Get updated values from the request body

    const results = await usersDbOperations.updateUser(userId, updatedValues); // Update user in DB
    res.json(results); // Respond with the updated user
  } catch (e) {
    console.log(e);
    res.sendStatus(500); // Send a 500 status code in case of an error
  }
});

// Delete User by ID
userRouter.delete("/:id", async (req, res, next) => {
  try {
    const userId = req.params.id; // Extract user ID from parameters
    await usersDbOperations.deleteUser(userId); // Delete user from DB
    res.sendStatus(204); // Respond with no content status
  } catch (e) {
    console.log(e);
    res.sendStatus(500); // Send a 500 status code in case of an error
  }
});

module.exports = userRouter; // Export the userRouter
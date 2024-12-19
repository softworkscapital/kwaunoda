const express = require("express");
const userRouter = express.Router();
const usersDbOperations = require("../cruds/users"); // Adjust the path accordingly

// Create a new user
userRouter.post("/", async (req, res, next) => {
  try {
    const postedValues = req.body; // Get the posted data

    // Destructure the required fields from the posted values
    const {
      userId,
      username,
      password,
      role,
      email,
      notify,
      activeSession,
      addProperty,
      editProperty,
      approveRequests,
      delivery,
      status,
      employeeId,
      companyId,
      branchId,
      syncStatus,
      last_logged_account,
      driverId,
      customerId,
      otp,
      signed_on,
    } = postedValues;

    // Create the user object
    const userToInsert = {
      userId,
      username,
      password,
      role,
      email,
      notify,
      activeSession,
      addProperty,
      editProperty,
      approveRequests,
      delivery,
      status,
      employeeId,
      companyId,
      branchId,
      syncStatus,
      last_logged_account,
      driverId,
      customerId,
      otp,
      signed_on,
    };

    // Call the DB operation to insert the user
    const results = await usersDbOperations.postUser(userToInsert);

    // Respond with the results
    res.json(results);
  } catch (error) {
    console.error(error);
    res.sendStatus(500); // Send a 500 status code in case of an error
  }
});

// Get All Users
userRouter.get("/last_user_id", async (req, res, next) => {
  try {
    const users = await usersDbOperations.getLastUser(); // Fetch all users
    res.json(users); // Respond with users
  } catch (error) {
    console.error(error);
    res.sendStatus(500); // Send a 500 status code in case of an error
  }
});

// Get All Users
userRouter.get("/", async (req, res, next) => {
  try {
    const users = await usersDbOperations.getUsers(); // Fetch all users
    res.json(users); // Respond with users
  } catch (error) {
    console.error(error);
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
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user); // Respond with user details
  } catch (error) {
    console.error(error);
    res.sendStatus(500); // Send a 500 status code in case of an error
  }
});

// Get User By Credentials
userRouter.get("/login/:email/:password", async (req, res, next) => {
  try {
    const email = req.params.email;
    const password = req.params.password;
    const result = await usersDbOperations.getUserByCred(email, password);
    res.json(result);
  } catch (error) {
    console.error(error);
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
  } catch (error) {
    console.error(error);
    res.sendStatus(500); // Send a 500 status code in case of an error
  }
});

//update user Status
userRouter.put("/update_status/:id", async (req, res, next) => {
  try {
    let userid = req.params.id;
    let updatedValues = req.body;

    let results = await usersDbOperations.updateUserStatus(
      userid,
      updatedValues
    );
    res.json(results);
  } catch (e) {
    console.log(e);
    res.sendStatus(500);
  }
});

// Delete User by ID
userRouter.delete("/:id", async (req, res, next) => {
  try {
    const userId = req.params.id; // Extract user ID from parameters
    await usersDbOperations.deleteUser(userId); // Delete user from DB
    res.sendStatus(204); // Respond with no content status
  } catch (error) {
    console.error(error);
    res.sendStatus(500); // Send a 500 status code in case of an error
  }
});

module.exports = userRouter; // Export the userRouter

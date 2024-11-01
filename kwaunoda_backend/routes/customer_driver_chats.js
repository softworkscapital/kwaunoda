const express = require('express');
const  CustomerDriverChatRouter = express.Router();
const  CustomerDriverChatsDbOperations = require('../cruds/customer_driver_chats');

CustomerDriverChatRouter.post('/', async (req, res, next) => {
    try {
        let postedValues = req.body;
        let {
            customer_driver_chat_id,
            date_chat,
            time_chat,
            trip_id,
            driver_id,
            customerid,
            message
            } = postedValues;

            let results = await  CustomerDriverChatsDbOperations.postCustomerDriverChat(
                customer_driver_chat_id,
                date_chat,
                time_chat,
                trip_id,
                driver_id,
                customerid,
                message
        );
        res.json(results);
    } catch (e) {
        console.log(e);
        res.sendStatus(500);
    }
});

CustomerDriverChatRouter.get('/', async (req, res, next) => {
    try {
        let results = await  CustomerDriverChatsDbOperations.getCustomerDriverChats();
        res.json(results);
    } catch (e) {
        console.log(e);
        res.sendStatus(500);
    }
});

CustomerDriverChatRouter.get('/customer-driver-chats/:trip_id', async (req, res) => {
    const trip_id = req.params.trip_id;

    try {
        const results = await CustomerDriverChatsDbOperations.getCustomerDriverChatsByTripId(trip_id);
        return res.status(200).json({
            status: "200",
            message: "Retrieved customer driver chats successfully",
            data: results,
        });
    } catch (error) {
        console.error("Error retrieving customer driver chats:", error);
        return res.status(500).json({
            status: "500",
            message: "Internal Server Error",
            error: error.message,
        });
    }
});

CustomerDriverChatRouter.get('/:id', async (req, res, next) => {
    try {
        let hr_attendance_id = req.params.id;
        let result = await  CustomerDriverChatsDbOperations.getCustomerDriverChatById(hr_attendance_id);
        res.json(result);
    } catch (e) {
        console.log(e);
        res.sendStatus(500);
    }
});


CustomerDriverChatRouter.put('/:customer_driver_chat_id', async (req, res) => {
    const customer_driver_chat_id = req.params.customer_driver_chat_id;
    const updatedValues = req.body;
  
    try {
      const result = await CustomerDriverChatsDbOperations.updateCustomerDriverChat(customer_driver_chat_id, updatedValues);
      return res.status(result.status).json(result);
    } catch (error) {
      console.error("Error updating customer driver chat:", error);
      return res.status(500).json({
        status: "500",
        message: "Internal Server Error",
        error: error.message,
      });
    }
  });


CustomerDriverChatRouter.delete('/:id', async (req, res, next) => {
    try {
        let id = req.params.id;
        let result = await  CustomerDriverChatsDbOperations.deleteCustomerDriverChat(id);
        res.json(result);
    } catch (e) {
        console.log(e);
        res.sendStatus(500);
    }
});

module.exports = CustomerDriverChatRouter;

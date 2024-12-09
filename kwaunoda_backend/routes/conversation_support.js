const express = require('express');
const  ConversationSupportRouter = express.Router();
const  ConversationSupportsDbOperations = require('../cruds/conversation_support');

ConversationSupportRouter.post('/', async (req, res, next) => {
    try {
        let postedValues = req.body;
        let {
            conversation_support_id,
            customer_id,
            customer_name,
            phone1,
            phone2,
            email,
            surname,
            company,
            product,
            conversation_stage,
            person_assigned,
            expiry_date_time,
            priority_level	

            } = postedValues;

            let results = await  ConversationSupportsDbOperations.postConversationSupport(
                conversation_support_id,
                customer_id,
                customer_name,
                phone1,
                phone2,
                email,
                surname,
                company,
                product,
                conversation_stage,
                person_assigned,
                expiry_date_time,
                priority_level	

        );
        res.json(results);
    } catch (e) {
        console.log(e);
        res.sendStatus(500);
    }
});

ConversationSupportRouter.get('/', async (req, res, next) => {
    try {
        let results = await  ConversationSupportsDbOperations.getConversationSupports();
        res.json(results);
    } catch (e) {
        console.log(e);
        res.sendStatus(500);
    }
});

ConversationSupportRouter.put('/:customer_admin_chat_id', async (req, res) => {
    const customer_admin_chat_id = req.params.customer_admin_chat_id; // Ensure this matches the route
    const updatedValues = req.body;

    try {
        const result = await ConversationSupportsDbOperations.updateConversationSupport(customer_admin_chat_id, updatedValues);
        return res.status(result.status).json(result);
    } catch (error) {
        console.error("Error updating customer admin chat:", error);
        return res.status(500).json({
            status: "500",
            message: "Internal Server Error",
            error: error.message,
        });
    }
});


ConversationSupportRouter.delete('/:id', async (req, res, next) => {
    try {
        let id = req.params.id;
        let result = await  ConversationSupportsDbOperations.deleteConversationSupport(id);
        res.json(result);
    } catch (e) {
        console.log(e);
        res.sendStatus(500);
    }
});

module.exports = ConversationSupportRouter;

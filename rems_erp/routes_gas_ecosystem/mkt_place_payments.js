const express = require('express');
const   mkt_place_paymentRouter = express.Router();
const mkt_place_paymentsDbOperations = require('../cruds_gas_ecosystem/mkt_place_payments');
mkt_place_paymentRouter.post('/', async (req, res, next) => {
    try {
        // Destructure values from the request body
        const {
            product_id,
            buyer_company_id,
            buyer_branch_id,
            buyer_user_id,
            seller_company_id,
            seller_branch_id,
            seller_user_id,
            datefor,
            timefor,
            description,
            volume_purchased,
            total_amount_paid,
            currency,
            cost_per_unit,
            metric_measurement,
            location,
            transport_rate,
            product_type
        } = req.body;

        // Call the function to post the product data
        const results = await mkt_place_paymentsDbOperations.postMkt_place_payment(
            product_id,           // Matches database field
            buyer_company_id,     // Matches database field
            buyer_branch_id,      // Matches database field
            buyer_user_id,        // Matches database field
            seller_company_id,    // Matches database field
            seller_branch_id,     // Matches database field
            seller_user_id,       // Matches database field
            datefor,              // Matches database field
            timefor,              // Matches database field
            description,          // Matches database field
            volume_purchased,     // Matches database field
            total_amount_paid,    // Matches database field
            currency,             // Matches database field
            cost_per_unit,        // Matches database field
            metric_measurement,   // Matches database field
            location,             // Matches database field
            transport_rate,       // Matches database field
            product_type          // Matches database field
        );

        // Send the results back to the client
        res.status(201).json(results); // Use 201 for created resource
    } catch (e) {
        console.error(e); // Log the error for debugging
        res.sendStatus(500); // Send a generic server error
    }
});

mkt_place_paymentRouter.get('/', async (req, res, next) => {
    try {
        let results = await   mkt_place_paymentsDbOperations.getMkt_place_payments();
        res.json(results);
    } catch (e) {
        console.log(e);
        res.sendStatus(500);
    }
});

mkt_place_paymentRouter.get('/:id', async (req, res, next) => {
    try {
        let mkt_place_payment_id = req.params.id;
        let result = await   mkt_place_paymentsDbOperations.getMkt_place_paymentById(mkt_place_payment_id);
        res.json(result);
    } catch (e) {
        console.log(e);
        res.sendStatus(500);
    }
});

// mkt_place_paymentRouter.get('/', async (req, res, next) => {
//     try {
//         const { company_id, user_id } = req.query; // Get company_id and user_id from query parameters

//         // Validate that both parameters are provided
//         if (!company_id || !user_id) {
//             return res.status(400).json({ message: 'company_id and user_id are required' });
//         }

//         // Call the function to get products by company_id and user_id
//         let result = await mkt_place_pymentsDbOperations.getProductsByCompanyAndUser(company_id, user_id);
//         res.json(result);
//     } catch (e) {
//         console.log(e);
//         res.sendStatus(500);
//     }
// });

//   mkt_place_paymentRouter.get('/login/:email', async (req, res, next) => {
//     try {
//         let email = req.params.email;
//         let result = await   mkt_place_pymentsDbOperations.getMemberByEmail(email);
//         res.json(result);
//     } catch (e) {
//         console.log(e);
//         res.sendStatus(500);
//     }
// });

mkt_place_paymentRouter.put('/:id', async (req, res, next) => {
    try {
        const mkt_place_payment_id = req.params.id; // Extract the record ID from the URL
        const postedValues = req.body; // Get the request body

        // Extract values from the request body
        const {
            product_id,
            buyer_company_id,
            buyer_branch_id,
            buyer_user_id,
            seller_company_id,
            seller_branch_id,
            seller_user_id,
            datefor,
            timefor,
            description,
            volume_purchased,
            total_amount_paid,
            currency,
            cost_per_unit,
            metric_measurement,
            location,
            transport_rate,
            product_type
        } = postedValues;

        // Call the database operation to update the record
        const results = await mkt_place_paymentsDbOperations.updateMkt_place_payment(
            mkt_place_payment_id, // Pass the ID as the first parameter
            product_id,
            buyer_company_id,
            buyer_branch_id,
            buyer_user_id,
            seller_company_id,
            seller_branch_id,
            seller_user_id,
            datefor,
            timefor,
            description,
            volume_purchased,
            total_amount_paid,
            currency,
            cost_per_unit,
            metric_measurement,
            location,
            transport_rate,
            product_type
        );

        // Send the response back to the client
        res.status(200).json(results); // Use status 200 for successful updates
    } catch (e) {
        console.error("Error:", e); // Log the error for debugging
        res.sendStatus(500); // Send a 500 response for server error
    }
});
mkt_place_paymentRouter.delete('/:id', async (req, res, next) => {
    try {
        let id = req.params.id;
        let result = await   mkt_place_paymentsDbOperations.deleteMkt_place_payment(id);
        res.json(result);
    } catch (e) {
        console.log(e);
        res.sendStatus(500);
    }
});

module.exports =  mkt_place_paymentRouter;

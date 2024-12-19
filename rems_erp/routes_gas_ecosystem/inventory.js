const express = require('express');
const InventoryRouter = express.Router();
const InventoryDbOperations = require('../cruds_gas_ecosystem/inventory');

InventoryRouter.post('/', async (req, res, next) => {
    try {
        let postedValues = req.body;
        let lpg_inventory_stock_sheets_id = postedValues.lpg_inventory_stock_sheets_id;
        let date_rec = postedValues.date_rec; 
        let time_rec = postedValues.time_rec;
        let  branch = postedValues.branch;
        let opening_inventory = postedValues.opening_inventory;
        let added_inventory = postedValues.added_inventory;
        let closing_inventory = postedValues.closing_inventory;
        let sold_inventory = postedValues.sold_inventory;
        let dispatched_inventory = postedValues.dispatched_inventory;
        let cost_per_unit = postedValues.cost_per_unit;
        let last_in_unit_price = postedValues.last_in_unit_price;
        let comment = postedValues.comment;
        let username = postedValues.username;
        let confirmed = postedValues.confirmed;
        let sales_shifts_id = postedValues.sales_shifts_id;
        let company_id = postedValues.company_id;
        let branch_id = postedValues.branch_id;
        let sync_id = postedValues.sync_id;

        console.log(username);

        let results = await InventoryDbOperations.postInventory(lpg_inventory_stock_sheets_id,
            date_rec,
            time_rec,
            branch,
            opening_inventory,
            added_inventory,
            closing_inventory,
            sold_inventory,
            dispatched_inventory, 
            cost_per_unit,
            last_in_unit_price,
            comment,
            username,
            confirmed,
            sales_shifts_id,
            company_id,
            branch_id,
            sync_id);
        res.json(results);
    } catch (e) {
        console.log(e);
        res.sendStatus(500);
    }
})


// Get inventory by branch ID
InventoryRouter.get('/branch/:branch_id', async (req, res, next) => {
    try {
        const branchId = req.params.branch_id;  // Extract branch ID from request parameters
        const results = await InventoryDbOperations.getInventoryByBranchId(branchId);  // Call the DB operation
        res.json(results);  // Respond with the results
    } catch (e) {
        console.log(e);
        res.sendStatus(500);  // Send a 500 status code in case of an error
    }
});

InventoryRouter.get('/company/:company_id', async (req, res, next) => {
    try {
        const companyId = req.params.company_id;  // Extract branch ID from request parameters
        const results = await InventoryDbOperations.getInventoryByCompanyId(companyId);  // Call the DB operation
        res.json(results);  // Respond with the results
    } catch (e) {
        console.log(e);
        res.sendStatus(500);  // Send a 500 status code in case of an error
    }
});


InventoryRouter.put('/:id', async (req, res, next) => {
    try {
        let inventoryId = req.params.id; // Get the inventory ID from the URL parameter
        let updatedValues = req.body; // Get the updated values from the request body

        // Call the update method with the inventory ID and updated values
        let results = await InventoryDbOperations.updateInventory(inventoryId, updatedValues);
        
        res.json(results); // Respond with the results of the update
    } catch (e) {
        console.log(e);
        res.sendStatus(500); // Send a 500 status code in case of an error
    }
});

InventoryRouter.get('/lastClose/:id', async (req, res, next) => {
    try {
        const branch_Id = req.params.id;  // Extract inventory ID from request parameters
        const results = await InventoryDbOperations.getLastCloseInventoryByBranchId(branch_Id);  // Call the DB operation
        
        // Check if results were returned
        if (results.length === 0) {
            return res.status(404).json({ message: 'last Close Inventory not found' });
        }

        res.json(results[0]);  // Respond with the first result (assuming it's an object)
    } catch (e) {
        console.log(e);
        res.sendStatus(500);  // Send a 500 status code in case of an error
    }
});





module.exports = InventoryRouter;
const express = require('express');
const branchesRouter = express.Router();
const branchDbOperations = require('../cruds_gas_ecosystem/branches');

branchesRouter.post('/', async (req, res, next) => {
    try {
        let postedValues = req.body;
        let branch_name = postedValues.branch_name;
        let branch_location = postedValues.branch_location;
        let branch_location_notes = postedValues.branch_location_notes;
        let branch_city = postedValues.branch_city;
        let latitude = postedValues.latitude;
        let longitude = postedValues.longitude;
        let company_id = postedValues.company_id;
        let company_name = postedValues.company_name;
        let enrolled_on = postedValues.enrolled_on;
        let enrolled_by = postedValues.enrolled_by;
        let phone = postedValues.phone;
        let email = postedValues.email;
        let sync_interval = postedValues.sync_interval;
        let branch_reorder_level_kgs = postedValues.branch_reorder_level_kgs;
        let auto_branch_reorder_status = postedValues.auto_branch_reorder_status;
        let inventory_level = postedValues.inventory_level;
        let inventory_storage_capacity = postedValues.inventory_storage_capacity;
        let rems_subscription_id = postedValues.rems_subscription_id;
        let transactions_volume_limit_kgs = postedValues.transactions_volume_limit_kgs;
        let expiry_date = postedValues.expiry_date;

        let results = await branchDbOperations.postBranch(branch_name,branch_location, branch_location_notes, branch_city, latitude, longitude, company_id, company_name, enrolled_on, enrolled_by, phone, email, sync_interval, branch_reorder_level_kgs, auto_branch_reorder_status, inventory_level, inventory_storage_capacity, rems_subscription_id, transactions_volume_limit_kgs, expiry_date);
        res.json(results);
    } catch (e) {
        console.log(e);
        res.sendStatus(500);
    }
});

branchesRouter.get('/', async (req, res, next) => {
    try {
        let results = await branchDbOperations.getBranches();
        res.json(results);
    } catch (e) {
        console.log(e);
        res.sendStatus(500);
    }
});

branchesRouter.get('/:branchid', async (req, res, next) => {
    try {
        let branch_id = req.params.id;
        let result = await branchDbOperations.getBranchById(branch_id);
        res.json(result);
    } catch (e) {
        console.log(e);
        res.sendStatus(500);
    }
});
branchesRouter.get('/company/:company_id', async (req, res, next) => {
    try {
        let company_id = req.params.company_id;
        let result = await branchDbOperations.getBranchesByCompanyId(company_id);
        res.json(result);
    } catch (e) {
        console.log(e);
        res.sendStatus(500);
    }
});


branchesRouter.get('/branchname/:branch_id', async (req, res, next) => {
    try {
        let branch_id = req.params.branch_id;
        let result = await branchDbOperations.getBranchNameByBranchId(branch_id);
        res.json(result);
    } catch (e) {
        console.log(e);
        res.sendStatus(500);
    }
});

branchesRouter.get('/branchstatus/:branch_id', async (req, res, next) => {
    try {
        let branch_id = req.params.branch_id;
        let result = await branchDbOperations.getBranchStatusByBranchId(branch_id);
        res.json(result);
    } catch (e) {
        console.log(e);
        res.sendStatus(500);
    }
});

branchesRouter.put('/:id', async (req, res, next) => {
    try {
      let branch_id = req.params.id;
      let updatedValues = req.body;
      let branch_name = updatedValues.branch_name;
      let branch_location = updatedValues.branch_location;
      let branch_location_notes = updatedValues.branch_location_notes;
      let branch_city = updatedValues.branch_city;
      let latitude = updatedValues.latitude;
      let longitude = updatedValues.longitude;
      let company_id = updatedValues.company_id;
      let company_name = updatedValues.company_name;
      let  enrolled_on = updatedValues. enrolled_on;
      let enrolled_by = updatedValues.enrolled_by;
      let phone = updatedValues.phone;
      let email = updatedValues.email;
      let sync_interval = updatedValues.sync_interval;
      let branch_reorder_level_kgs = updatedValues.branch_reorder_level_kgs;
      let auto_branch_reorder_status = updatedValues.auto_branch_reorder_status;
      let inventory_level = updatedValues.inventory_level;
      let inventory_storage_capacity = updatedValues.inventory_storage_capacity;
      let rems_subscription_id = updatedValues.rems_subscription_id;
      let transactions_volume_limit_kgs = updatedValues.transactions_volume_limit_kgs;
      let expiry_date = updatedValues.expiry_date;
  
      let result = await branchDbOperations.updateBranch(
        branch_id,
        branch_name,
        branch_location, 
        branch_location_notes, 
        branch_city, 
        latitude, 
        longitude, 
        company_id, company_name, enrolled_on, enrolled_by, phone, email, sync_interval, branch_reorder_level_kgs, auto_branch_reorder_status, inventory_level, inventory_storage_capacity, rems_subscription_id, transactions_volume_limit_kgs, expiry_date
      );
      res.json(result);
    } catch (e) {
      console.log(e);
      res.sendStatus(500);
    }
  });

branchesRouter.delete('/:id', async (req, res, next) => {
    try {
        let id = req.params.id;
        let result = await branchDbOperations.deleteBranch(id);
        res.json(result);
    } catch (e) {
        console.log(e);
        res.sendStatus(500);
    }
});

module.exports = branchesRouter;

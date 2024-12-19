const express = require('express');
const productDefinitionRouter = express.Router();
const productDefinitionDbOperations = require('../cruds_pos/product_definition');

productDefinitionRouter.post('/', async (req, res, next) => {  
    			
    
    try {
        let postedValues = req.body;
        let company_id = postedValues.company_id;
        let branch_id = postedValues.branch_id;
        let product_name = postedValues.product_name;
        let unit_of_measure = postedValues.unit_of_measure;
        let unit_size = postedValues.unit_size;
        let syncid = postedValues.syncid;

        let results = await productDefinitionDbOperations.postProductDefinition(
            company_id, branch_id, product_name, unit_of_measure, unit_size, syncid);
        res.json(results);
    } catch (e) {
        console.log(e);
        res.sendStatus(500);
    }
})

productDefinitionRouter.get('/', async (req, res, next) => {
    try {
        let results = await productDefinitionDbOperations.getProductDefinitions();
        res.json(results);
    } catch (e) {
        console.log(e);
        res.sendStatus(500);
    }
});

productDefinitionRouter.get('/full_products_definations', async (req, res, next) => {
    try {
        let results = await productDefinitionDbOperations.getFullProductDefinitions();
        res.json(results);
    } catch (e) {
        console.log(e);
        res.sendStatus(500);
    }
});

productDefinitionRouter.get('/:id', async (req, res, next) => {
    try {
        let client_id = req.params.id;
        let result = await productDefinitionDbOperations.getProductDefinitionById(client_id);
        res.json(result);
    } catch (e) {
        console.log(e);
        res.sendStatus(500);
    }
});

productDefinitionRouter.put('/:id', async (req, res, next) => {
    try {
        let product_id = req.params.id;
        let updatedValues = req.body;
        let company_id = updatedValues.company_id;
        let branch_id = updatedValues.branch_id;
        let product_name = updatedValues.product_name;
        let unit_of_measure = updatedValues.unit_of_measure;
        let unit_size = updatedValues.unit_size;
        let syncid = updatedValues.syncid;

        let result = await productDefinitionDbOperations.updateProductDefinition(
            product_id, company_id, branch_id, product_name, unit_of_measure, unit_size, syncid
        );
        res.json(result);
    } catch (e) {
        console.log(e);
        res.sendStatus(500);
    }
});

productDefinitionRouter.delete('/:id', async (req, res, next) => {
    try {
        let id = req.params.id;
        let result = await productDefinitionDbOperations.deleteProductDefinition(id);
        res.json(result);
    } catch (e) {
        console.log(e);
        res.sendStatus(500);
    }
});

module.exports = productDefinitionRouter;
const express = require('express');
const productDefinitionRouter = express.Router();
const productDefinitionDbOperations = require('../cruds_pos/product_definition');

productDefinitionRouter.post('/', async (req, res, next) => {
    try {
        let postedValues = req.body;

        let product_id = postedValues.product_id; 
        let product_code = postedValues.product_code; 
        let company_id = postedValues.company_id;
        let branch_id = postedValues.branch_id;
        let product_brand = postedValues.product_brand; 
        let product_name = postedValues.product_name;
        let product_type = postedValues.product_type;
        let category = postedValues.category; 
        let sub_category = postedValues.sub_category; 
        let sub_sub_category = postedValues.sub_sub_category; 
        let unit_of_measure = postedValues.unit_of_measure;
        let unit_size = postedValues.unit_size;
        let description_notes = postedValues.description_notes; 
        let sub_notes = postedValues.sub_notes; 
        let sold_units_count = postedValues.sold_units_count; 
        let rating = postedValues.rating; 
        let rating_count = postedValues.rating_count; 
        let discount_rate = postedValues.discount_rate; 
        let promo_time_left = postedValues.promo_time_left; 
        let color = postedValues.color;
        let popularity = postedValues.popularity;
        let shipping_days = postedValues.shipping_days; 
        let condition = postedValues.condition; 
        let reviews_count = postedValues.reviews_count; 
        let views_count = postedValues.views_count; 
        let likes_count = postedValues.likes_count; 
        let uploaded_product_image_ref = postedValues.uploaded_product_image_ref; 
        let syncid = postedValues.syncid;


        let results = await productDefinitionDbOperations.postProductDefinition(
            product_id,
            product_code,
            company_id,
            branch_id,
            product_brand,
            product_name,
            product_type,
            category,
            sub_category,
            sub_sub_category,
            unit_of_measure,
            unit_size,
            description_notes,
            sub_notes,
            sold_units_count,
            rating,
            rating_count,
            discount_rate,
            promo_time_left,
            color,
            popularity,
            shipping_days,
            condition,
            reviews_count,
            views_count,
            likes_count,
            uploaded_product_image_ref,
            syncid
        );

        res.json(results);
    } catch (e) {
        console.log(e);
        res.sendStatus(500);
    }
});

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
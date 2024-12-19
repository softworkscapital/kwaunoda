const express = require('express');
const prospectsRouter = express.Router();
const prospectsDbOperations = require('../cruds/prospect_details');

prospectsRouter.post('/', async (req, res, next) => { 							

    try {
        let postedValues = req.body;
        let prospect_name = postedValues.prospect_name;
        let prospect_surname = postedValues.prospect_surname;
        let company = postedValues.company;
        let product = postedValues.product;
        let category = postedValues.category;
        let user_id = postedValues.user_id;
        let phone1 = postedValues.phone1;
        let phone2 = postedValues.phone2;
        let email = postedValues.email;
        let funnel_stage = postedValues.funnel_stage;
        let message = postedValues.message;
        let nxtFollowUp = postedValues.nxtFollowup;

        let results = await prospectsDbOperations.postProspect(prospect_name, prospect_surname, company, product, category, user_id, phone1, phone2, email, funnel_stage, message, nxtFollowUp);
        res.json(results);
    } catch (e) {
        console.log(e);
        res.sendStatus(500);
    }
})

prospectsRouter.get('/', async (req, res, next) => {
    try {
        let results = await prospectsDbOperations.getProspects();
        res.json(results);
    } catch (e) {
        console.log(e);
        res.sendStatus(500);
    }
});
prospectsRouter.get('/:id', async (req, res, next) => {
    try {
        let id = req.params.id;
        let results = await prospectsDbOperations.getProspectsById(id);
        res.json(results);
    } catch (e) {
        console.log(e);
        res.sendStatus(500);
    }
});

// Get Prospects by funnel level
prospectsRouter.get('/stage/:stage', async (req, res, next) => {
    try {
        let stage = req.params.stage;
        let results = await prospectsDbOperations.getProspectsByFunnel(stage);
        res.json(results);
    } catch (e) {
        console.log(e);
        res.sendStatus(500);
    }
});

// Get Prospects by Full Name
prospectsRouter.get('/name/:name/:surname', async (req, res, next) => {
    try {
        let name = req.params.name;
        let surname = req.params.surname;
        let results = await prospectsDbOperations.getProspectsByNameSurname(name, surname);
        res.json(results);
    } catch (e) {
        console.log(e);
        res.sendStatus(500);
    }
});

//get prospects by the userID
prospectsRouter.get('/prospects/user/userid/:userid', async (req, res, next) => {
    try {
        let userid = req.params.userid;
        let results = await prospectsDbOperations.getProspectsByUserId(userid);
        res.json(results);
    } catch (e) {
        console.log(e);
        res.sendStatus(500);
    }
});

prospectsRouter.put('/:id', async (req, res, next) => {
    try {
        let id = req.params.id;
        let updatedValues = req.body;
        let prospect_name = updatedValues.prospect_name;
        let prospect_surname = updatedValues.prospect_surname;
        let company = updatedValues.company;
        let product = updatedValues.product;
        let username = updatedValues.username;
        let phone1 = updatedValues.phone1;
        let phone2 = updatedValues.phone2;
        let email = updatedValues.email;
        let funnel_stage = updatedValues.funnel_stage;

        let result = await prospectsDbOperations.updateProspect(
            id, prospect_name, prospect_surname, company, product, username, phone1, phone2, email, funnel_stage
        );
        res.json(result);
    } catch (e) {
        console.log(e);
        res.sendStatus(500);
    }
});

prospectsRouter.put('/updatestage/:id', async (req, res, next) => {
    try {
        let id = req.params.id;
        let updatedValues = req.body;
        let funnel_stage = updatedValues.funnel_stage;

        let result = await prospectsDbOperations.updateProspectStatus(
            id, funnel_stage
        );
        res.json(result);
    } catch (e) {
        console.log(e);
        res.sendStatus(500);
    }
});

prospectsRouter.delete('/:id', async (req, res, next) => {
    try {
        let id = req.params.id;
        let result = await prospectsDbOperations.deleteProspect(id);
        res.json(result);
    } catch (e) {
        console.log(e);
        res.sendStatus(500);
    }
});

module.exports = prospectsRouter;
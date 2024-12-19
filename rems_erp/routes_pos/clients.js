const express = require('express');
const clientRouter = express.Router();
const clientsDbOperations = require('../cruds_pos/clients');

clientRouter.post('/', async (req, res, next) => {
    try {
        let postedValues = req.body;
        let client_name = postedValues.client_name;
        let client_database_name = postedValues.client_database_name;
        let client_key = postedValues.client_key;
        let date = postedValues.date;
        let time = postedValues.time;
        let status = postedValues.status;

        let results = await clientsDbOperations.postClient(client_name, client_database_name, client_key, date, time, status);
        res.json(results);
    } catch (e) {
        console.log(e);
        res.sendStatus(500);
    }
})

clientRouter.get('/', async (req, res, next) => {
    try {
        let results = await clientsDbOperations.getClients();
        res.json(results);
    } catch (e) {
        console.log(e);
        res.sendStatus(500);
    }
});

clientRouter.get('/:id', async (req, res, next) => {
    try {
        let client_id = req.params.id;
        let result = await clientsDbOperations.getClientById(client_id);
        res.json(result);
    } catch (e) {
        console.log(e);
        res.sendStatus(500);
    }
});

clientRouter.put('/:id', async (req, res, next) => {
    try {
        let client_id = req.params.id;
        let updatedValues = req.body;
        let client_name = updatedValues.client_name;
        let client_database_name = updatedValues.client_database_name;
        let client_key = updatedValues.client_key;
        let date = updatedValues.date;
        let time = updatedValues.time;
        let status = updatedValues.status;

        let result = await clientsDbOperations.updateClient(
            client_id,
            client_name,
            client_database_name,
            client_key,
            date,
            time,
            status
        );
        res.json(result);
    } catch (e) {
        console.log(e);
        res.sendStatus(500);
    }
});

clientRouter.delete('/:id', async (req, res, next) => {
    try {
        let id = req.params.id;
        let result = await clientsDbOperations.deleteClient(id);
        res.json(result);
    } catch (e) {
        console.log(e);
        res.sendStatus(500);
    }
});

module.exports = clientRouter;
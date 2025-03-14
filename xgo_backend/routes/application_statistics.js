const express = require('express');
const  StatisticRouter = express.Router();
const  StatisticsDbOperations = require('../cruds/application_statistics');

StatisticRouter.post('/', async (req, res, next) => {
    try {
        const postedValues = req.body;
        const {
            application_statistic_id,
            datefor,
            kms_billed,
            customers_count,
            drivers_count,
            trips_count,
            trips_per_customer,
            billed_amount_usd,
            average_trip_rate_usd,
            mode_rate_usd,
            average_billed,
            new_customer_count,
            new_drivers_count,
            complaints_count,
            total_rating_count,
            ave_rating_count,
            driver_open_balance,
            driver_top_up,
            driver_billed_charges,
            driver_withdrawals,
            driver_escrow,
            driver_promo,
            driver_deductions,
            driver_additions,
            driver_close_balance,
            customer_open_balance,
            customer_to_up,
            customer_billed_charges,
            customer_withdrawals,
            customer_escrow,
            customer_promo,
            customer_deduction,
            customer_additions,
            customer_close_balance,
            company_open_balance,
            company_income_from_charges,
            company_promotions,
            company_withdraws_out,
            company_close_balance
        } = postedValues;

        const results = await StatisticsDbOperations.postStatistic(
            application_statistic_id,
            datefor,
            kms_billed,
            customers_count,
            drivers_count,
            trips_count,
            trips_per_customer,
            billed_amount_usd,
            average_trip_rate_usd,
            mode_rate_usd,
            average_billed,
            new_customer_count,
            new_drivers_count,
            complaints_count,
            total_rating_count,
            ave_rating_count,
            driver_open_balance,
            driver_top_up,
            driver_billed_charges,
            driver_withdrawals,
            driver_escrow,
            driver_promo,
            driver_deductions,
            driver_additions,
            driver_close_balance,
            customer_open_balance,
            customer_to_up,
            customer_billed_charges,
            customer_withdrawals,
            customer_escrow,
            customer_promo,
            customer_deduction,
            customer_additions,
            customer_close_balance,
            company_open_balance,
            company_income_from_charges,
            company_promotions,
            company_withdraws_out,
            company_close_balance
        );

        res.json(results);
    } catch (e) {
        console.error(e);
        res.sendStatus(500);
    }
});

StatisticRouter.get('/get_last_statistic', async (req, res, next) => {
    try {
        let results = await  StatisticsDbOperations.getStatistics();
        res.json(results);
    } catch (e) {
        console.log(e);
        res.sendStatus(500);
    }
});



StatisticRouter.get('/get_app_stats_by_dates/:date_from/:date_to', async (req, res, next) => {
    try {
        let dateFrom = req.params.date_from;
        let dateTo = req.params.date_to;
        let results = await  StatisticsDbOperations.getStatisticsByDateRange(dateFrom, dateTo);
        res.json(results);
    } catch (e) {
        console.log(e);
        res.sendStatus(500);
    }
});





StatisticRouter.get('/:id', async (req, res, next) => {
    try {
        let application_statistic_id = req.params.id;
        let result = await StatisticsDbOperations.getStatisticById(application_statistic_id);
        res.json(result);
    } catch (e) {
        console.log(e);
        res.sendStatus(500);
    }
});


StatisticRouter.put('/:application_statistic_id', async (req, res) => {
    const application_statistic_id = req.params.application_statistic_id; // Ensure this matches the route
    const updatedValues = req.body;

    // Validate application_statistic_id
    if (!application_statistic_id) {
        return res.status(400).json({
            status: "400",
            message: "application_statistic_id is required.",
        });
    }

    try {
        const result = await StatisticsDbOperations.updateStatistic(application_statistic_id, updatedValues);
        return res.status(result.status).json(result);
    } catch (error) {
        console.error("Error updating statistic:", error);
        return res.status(500).json({
            status: "500",
            message: "Internal Server Error",
            error: error.message,
        });
    }
});


  StatisticRouter.delete('/:id', async (req, res, next) => {
    try {
        let id = req.params.id;
        let result = await  StatisticsDbOperations.deleteStatistic(id);
        res.json(result);
    } catch (e) {
        console.log(e);
        res.sendStatus(500);
    }
});

module.exports = StatisticRouter;

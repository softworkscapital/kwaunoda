const express = require('express');
const saleshiftRouter = express.Router();

const saleshistDbOperations = require('../cruds_gas_ecosystem/sales_shift');

saleshiftRouter.post('/', async (req, res, next) => {
    try {
        let postedValues = req.body;
        let sales_project_name = postedValues.sales_project_name;
        let branch = postedValues.branch;
        let operator = postedValues.operator;
        let operator_id = postedValues.operator_id;
        let shift_close_date = postedValues.shift_close_date;
        let shift_close_time = postedValues.shift_close_time;
        let shift_open_date = postedValues.shift_open_date;
        let shift_open_time = postedValues.shift_open_time;
        let opening_inventory = postedValues.opening_inventory;
        let closing_inventory = postedValues.closing_inventory;
        let sold_inventory = postedValues.sold_inventory;
        let total_transactions = postedValues.total_transactions;
        let sales_cash_wholesale = postedValues.sales_cash_wholesale;
        let sales_cash_retail = postedValues.sales_cash_retail;
        let sales_credit_wholesale = postedValues.sales_credit_wholesale;
        let sales_credit_retail = postedValues.sales_credit_retail;
        let sales_cash_tot_cas = postedValues.sales_cash_tot_cas;
        let sales_cash_tot_zar = postedValues.sales_cash_tot_zar;
        let sales_cash_tot_eco = postedValues.sales_cash_tot_eco;
        let sales_cash_tot_usd = postedValues.sales_cash_tot_usd;
        let sales_cash_tot_zpt = postedValues.sales_cash_tot_zpt;
        let sales_credit_tot_cas = postedValues.sales_credit_tot_cas;
        let sales_credit_tot_eco = postedValues.sales_credit_tot_eco;
        let sales_credit_tot_usd = postedValues.sales_credit_tot_usd;
        let sales_credit_tot_zpt = postedValues.sales_credit_tot_zpt;
        let sales_credit_tot_zar = postedValues.sales_credit_tot_zar;
        let recorded_cas = postedValues.recorded_cas;
        let recorded_eco = postedValues.recorded_eco;
        let recorded_usd = postedValues.recorded_usd;
        let recorded_zpt = postedValues.recorded_zpt;
        let recorded_zar = postedValues.recorded_zar;
        let tendered_cas = postedValues.tendered_cas;
        let tendered_eco = postedValues.tendered_eco;
        let tendered_usd = postedValues.tendered_usd;
        let tendered_zpt = postedValues.tendered_zpt;
        let tendered_zar = postedValues.tendered_zar;
        let overbanking_cas = postedValues.overbanking_cas;
        let overbanking_eco = postedValues.overbanking_eco;
        let overbanking_usd = postedValues.overbanking_usd;
        let overbanking_zpt = postedValues.overbanking_zpt;
        let overbanking_zar = postedValues.overbanking_zar;
        let overbanking_charged_acc_cas = postedValues.overbanking_charged_acc_cas;
        let overbanking_charged_acc_eco = postedValues.overbanking_charged_acc_eco;
        let overbanking_charged_acc_usd = postedValues.overbanking_charged_acc_usd;
        let overbanking_charged_acc_zpt = postedValues.overbanking_charged_acc_zpt;
        let overbanking_charged_acc_zar = postedValues.overbanking_charged_acc_zar;
        let comment_operator = postedValues.comment_operator;
        let comment_supervisor = postedValues.comment_supervisor;
        let rate_usd = postedValues.rate_usd;
        let confirmed = postedValues.confirmed;
        let authorized = postedValues.authorized;
        let reason_if_declined = postedValues.reason_if_declined;
        let shift_status = postedValues.shift_status;
        let pettycash_cas = postedValues.pettycash_cas;
        let pettycash_eco = postedValues.pettycash_eco;
        let pettycash_usd = postedValues.pettycash_usd;
        let pettycash_bnk = postedValues.pettycash_bnk;
        let pettycash_zar = postedValues.pettycash_zar;
        let bd_uncollected_inventory = postedValues.bd_uncollected_inventory;
        let cd_uncollected_inventory = postedValues.cd_uncollected_inventory;
        let new_sales_cash_today_kgs = postedValues.new_sales_cash_today_kgs;
        let new_sales_credit_today_kgs = postedValues.new_sales_credit_today_kgs;
        let collected_today_kgs = postedValues.collected_today_kgs;
        let collected_net_movement = postedValues.collected_net_movement;
        let inv_adj_end_of_day_variance = postedValues.inv_adj_end_of_day_variance;
        let inv_adj_transfare = postedValues.inv_adj_transfare;
        let inv_adj_wieght_bridge_variance = postedValues.inv_adj_wieght_bridge_variance;
        let inv_adj_physical_count_variance = postedValues.inv_adj_physical_count_variance;
        let inv_adj_inventory_purchases = postedValues.inv_adj_inventory_purchases;
        let inv_adj_total_adjustments = postedValues.inv_adj_total_adjustments;
        let physical_inventory_open = postedValues.physical_inventory_open;
        let physical_inventory_closing = postedValues.physical_inventory_closing;
        let available_inventory_opening = postedValues.available_inventory_opening;
        let available_inventory_closing = postedValues.available_inventory_closing;
        let inventory_dispatched_system = postedValues.inventory_dispatched_system;
        let inventory_dispatched_scales = postedValues.inventory_dispatched_scales;
        let customer_accs_bd = postedValues.customer_accs_bd;
        let customer_accs_cd = postedValues.customer_accs_cd;
        let customer_accs_deposits = postedValues.customer_accs_deposits;
        let customer_accs_withdrawals = postedValues.customer_accs_withdrawals;
        let customer_acc_deposit_cas = postedValues.customer_acc_deposit_cas;
        let customer_acc_deposit_eco = postedValues.customer_acc_deposit_eco;
        let customer_acc_deposit_usd = postedValues.customer_acc_deposit_usd;
        let customer_acc_deposit_zpt = postedValues.customer_acc_deposit_zpt;
        let customer_acc_deposit_zar = postedValues.customer_acc_deposit_zar;
        let customer_acc_refunds_cas = postedValues.customer_acc_refunds_cas;
        let customer_acc_refunds_eco = postedValues.customer_acc_refunds_eco;
        let customer_acc_refunds_usd = postedValues.customer_acc_refunds_usd;
        let customer_acc_refunds_zpt = postedValues.customer_acc_refunds_zpt;
        let customer_acc_refunds_zar = postedValues.customer_acc_refunds_zar;
        let credit_notes_issued_cas = postedValues.credit_notes_issued_cas;
        let credit_notes_issued_eco = postedValues.credit_notes_issued_eco;
        let credit_notes_issued_usd = postedValues.credit_notes_issued_usd;
        let credit_notes_issued_zpt = postedValues.credit_notes_issued_zpt;
        let credit_notes_issued_zar = postedValues.credit_notes_issued_zar;
        let credit_notes_issued_tot_usd_value = postedValues.credit_notes_issued_tot_usd_value;
        let credit_notes_redeemed_cas = postedValues.credit_notes_redeemed_cas;
        let credit_notes_redeemed_eco = postedValues.credit_notes_redeemed_eco;
        let credit_notes_redeemed_usd = postedValues.credit_notes_redeemed_usd;
        let credit_notes_redeemed_zpt = postedValues.credit_notes_redeemed_zpt;
        let credit_notes_redeemed_zar = postedValues.credit_notes_redeemed_zar;
        let credit_notes_redeemed_tot_usd_value = postedValues.credit_notes_redeemed_tot_usd_value;
        let inventory_sales_cash_tot_cas = postedValues.inventory_sales_cash_tot_cas;
        let inventory_sales_cash_tot_eco = postedValues.inventory_sales_cash_tot_eco;
        let inventory_sales_cash_tot_usd = postedValues.inventory_sales_cash_tot_usd;
        let inventory_sales_cash_tot_zpt = postedValues.inventory_sales_cash_tot_zpt;
        let inventory_sales_cash_tot_zar = postedValues.inventory_sales_cash_tot_zar;
        let inventory_sales_credit_tot_cas = postedValues.inventory_sales_credit_tot_cas;
        let inventory_sales_credit_tot_eco = postedValues.inventory_sales_credit_tot_eco;
        let inventory_sales_credit_tot_usd = postedValues.inventory_sales_credit_tot_usd;
        let inventory_sales_credit_tot_zpt = postedValues.inventory_sales_credit_tot_zpt;
        let inventory_sales_credit_tot_zar = postedValues.inventory_sales_credit_tot_zar;
        let inventory_undispatched_cas = postedValues.inventory_undispatched_cas;
        let inventory_undispatched_eco = postedValues.inventory_undispatched_eco;
        let inventory_undispatched_usd = postedValues.inventory_undispatched_usd;
        let inventory_undispatched_zpt = postedValues.inventory_undispatched_zpt;
        let inventory_undispatched_zar = postedValues.inventory_undispatched_zar;
        let meter_reading_open1 = postedValues.meter_reading_open1;
        let meter_reading_cummulative1 = postedValues.meter_reading_cummulative1;
        let meter_reading_close1 = postedValues.meter_reading_close1;
        let meter_reading_open2 = postedValues.meter_reading_open2;
        let meter_reading_cummulative2 = postedValues.meter_reading_cummulative2;
        let meter_reading_close2 = postedValues.meter_reading_close2;
        let meter_reading_open3 = postedValues.meter_reading_open3;
        let meter_reading_cummulative3 = postedValues.meter_reading_cummulative3;
        let meter_reading_close3 = postedValues.meter_reading_close3;
        let meter_resseted = postedValues.meter_resseted;
        let meter_resseted_by = postedValues.meter_resseted_by;
        let transfared_to_finance = postedValues.transfared_to_finance;
        let company_id = postedValues.company_id;
        let company_name = postedValues.company_name;
        let branch_name = postedValues.branch_name;
        let branch_id = postedValues.branch_id;
        let syncid = postedValues.syncid;

        let results = await saleshistDbOperations.postSalesShift(
            sales_project_name, branch, operator, operator_id, shift_close_date, shift_close_time, shift_open_date, shift_open_time, opening_inventory, closing_inventory, sold_inventory, total_transactions, sales_cash_wholesale, sales_cash_retail, sales_credit_wholesale, sales_credit_retail, sales_cash_tot_cas, sales_cash_tot_zar, sales_cash_tot_eco, sales_cash_tot_usd, sales_cash_tot_zpt, sales_credit_tot_cas, sales_credit_tot_eco, sales_credit_tot_usd, sales_credit_tot_zpt, sales_credit_tot_zar, recorded_cas, recorded_eco, recorded_usd, recorded_zpt, recorded_zar, tendered_cas, tendered_eco, tendered_usd, tendered_zpt, tendered_zar, overbanking_cas, overbanking_eco, overbanking_usd, overbanking_zpt, overbanking_zar, overbanking_charged_acc_cas, overbanking_charged_acc_eco, overbanking_charged_acc_usd, overbanking_charged_acc_zpt, overbanking_charged_acc_zar, comment_operator, comment_supervisor, rate_usd, confirmed, authorized, reason_if_declined, shift_status, pettycash_cas, pettycash_eco, pettycash_usd, pettycash_bnk, pettycash_zar, bd_uncollected_inventory, cd_uncollected_inventory, new_sales_cash_today_kgs, new_sales_credit_today_kgs, collected_today_kgs, collected_net_movement, inv_adj_end_of_day_variance, inv_adj_transfare, inv_adj_wieght_bridge_variance, inv_adj_physical_count_variance, inv_adj_inventory_purchases, inv_adj_total_adjustments, physical_inventory_open, physical_inventory_closing, available_inventory_opening, available_inventory_closing, inventory_dispatched_system, inventory_dispatched_scales, customer_accs_bd, customer_accs_cd, customer_accs_deposits, customer_accs_withdrawals, customer_acc_deposit_cas, customer_acc_deposit_eco, customer_acc_deposit_usd, customer_acc_deposit_zpt, customer_acc_deposit_zar, customer_acc_refunds_cas, customer_acc_refunds_eco, customer_acc_refunds_usd, customer_acc_refunds_zpt, customer_acc_refunds_zar, credit_notes_issued_cas, credit_notes_issued_eco, credit_notes_issued_usd, credit_notes_issued_zpt, credit_notes_issued_zar, credit_notes_issued_tot_usd_value, credit_notes_redeemed_cas, credit_notes_redeemed_eco, credit_notes_redeemed_usd, credit_notes_redeemed_zpt, credit_notes_redeemed_zar, credit_notes_redeemed_tot_usd_value, inventory_sales_cash_tot_cas, inventory_sales_cash_tot_eco, inventory_sales_cash_tot_usd, inventory_sales_cash_tot_zpt, inventory_sales_cash_tot_zar, inventory_sales_credit_tot_cas, inventory_sales_credit_tot_eco, inventory_sales_credit_tot_usd, inventory_sales_credit_tot_zpt, inventory_sales_credit_tot_zar, inventory_undispatched_cas, inventory_undispatched_eco, inventory_undispatched_usd, inventory_undispatched_zpt, inventory_undispatched_zar, meter_reading_open1, meter_reading_cummulative1, meter_reading_close1, meter_reading_open2, meter_reading_cummulative2, meter_reading_close2, meter_reading_open3, meter_reading_cummulative3, meter_reading_close3, meter_resseted, meter_resseted_by, transfared_to_finance,company_id,company_name,branch_name,branch_id,syncid
        );
        res.json(results);
    } catch (e) {
        console.log(e);
        res.sendStatus(500);
    }
})

saleshiftRouter.get('/', async (req, res, next) => {
    try {
        let results = await saleshistDbOperations.getSalesShift();
        res.json(results);
    } catch (e) {
        console.log(e);
        res.sendStatus(500);
    }
});


saleshiftRouter.get('/co/:id', async (req, res, next) => {
    try {
        let id = req.params.id;
        
        let results = await saleshistDbOperations.getSalesShiftByCo(id);
        res.json(results);
    } catch (e) {
        console.log(e);
        res.sendStatus(500);
    }
});

saleshiftRouter.get('/:id/:company_id', async (req, res, next) => {
    try {
        let id = req.params.id;
        company_id = req.params.company_id;
        let result = await saleshistDbOperations.getSalesShiftById(id, company_id);
        res.json(result);
    } catch (e) {
        console.log(e);
        res.sendStatus(500);
    }
});



saleshiftRouter.get('/company/:company_id', async (req, res, next) => {
    try {
        company_id = req.params.company_id;
        let result = await saleshistDbOperations.getSalesShiftByCompanyId(company_id);
        res.json(result);
    } catch (e) {
        console.log(e);
        res.sendStatus(500);
    }
});



saleshiftRouter.put('/:id', async (req, res, next) => {
    try {
        let sales_shifts_id = req.params.id;
        let updatedValues = req.body;
        let sales_project_name = updatedValues.sales_project_name;
        let branch = updatedValues.branch;
        let operator = updatedValues.operator;
        let operator_id = updatedValues.operator_id;
        let shift_close_date = updatedValues.shift_close_date;
        let shift_close_time = updatedValues.shift_close_time;
        let shift_open_date = updatedValues.shift_open_date;
        let shift_open_time = updatedValues.shift_open_time;
        let opening_inventory = updatedValues.opening_inventory;
        let closing_inventory = updatedValues.closing_inventory;
        let sold_inventory = updatedValues.sold_inventory;
        let total_transactions = updatedValues.total_transactions;
        let sales_cash_wholesale = updatedValues.sales_cash_wholesale;
        let sales_cash_retail = updatedValues.sales_cash_retail;
        let sales_credit_wholesale = updatedValues.sales_credit_wholesale;
        let sales_credit_retail = updatedValues.sales_credit_retail;
        let sales_cash_tot_cas = updatedValues.sales_cash_tot_cas;
        let sales_cash_tot_zar = updatedValues.sales_cash_tot_zar;
        let sales_cash_tot_eco = updatedValues.sales_cash_tot_eco;
        let sales_cash_tot_usd = updatedValues.sales_cash_tot_usd;
        let sales_cash_tot_zpt = updatedValues.sales_cash_tot_zpt;
        let sales_credit_tot_cas = updatedValues.sales_credit_tot_cas;
        let sales_credit_tot_eco = updatedValues.sales_credit_tot_eco;
        let sales_credit_tot_usd = updatedValues.sales_credit_tot_usd;
        let sales_credit_tot_zpt = updatedValues.sales_credit_tot_zpt;
        let sales_credit_tot_zar = updatedValues.sales_credit_tot_zar;
        let recorded_cas = updatedValues.recorded_cas;
        let recorded_eco = updatedValues.recorded_eco;
        let recorded_usd = updatedValues.recorded_usd;
        let recorded_zpt = updatedValues.recorded_zpt;
        let recorded_zar = updatedValues.recorded_zar;
        let tendered_cas = updatedValues.tendered_cas;
        let tendered_eco = updatedValues.tendered_eco;
        let tendered_usd = updatedValues.tendered_usd;
        let tendered_zpt = updatedValues.tendered_zpt;
        let tendered_zar = updatedValues.tendered_zar;
        let overbanking_cas = updatedValues.overbanking_cas;
        let overbanking_eco = updatedValues.overbanking_eco;
        let overbanking_usd = updatedValues.overbanking_usd;
        let overbanking_zpt = updatedValues.overbanking_zpt;
        let overbanking_zar = updatedValues.overbanking_zar;
        let overbanking_charged_acc_cas = updatedValues.overbanking_charged_acc_cas;
        let overbanking_charged_acc_eco = updatedValues.overbanking_charged_acc_eco;
        let overbanking_charged_acc_usd = updatedValues.overbanking_charged_acc_usd;
        let overbanking_charged_acc_zpt = updatedValues.overbanking_charged_acc_zpt;
        let overbanking_charged_acc_zar = updatedValues.overbanking_charged_acc_zar;
        let comment_operator = updatedValues.comment_operator;
        let comment_supervisor = updatedValues.comment_supervisor;
        let rate_usd = updatedValues.rate_usd;
        let confirmed = updatedValues.confirmed;
        let authorized = updatedValues.authorized;
        let reason_if_declined = updatedValues.reason_if_declined;
        let shift_status = updatedValues.shift_status;
        let pettycash_cas = updatedValues.pettycash_cas;
        let pettycash_eco = updatedValues.pettycash_eco;
        let pettycash_usd = updatedValues.pettycash_usd;
        let pettycash_bnk = updatedValues.pettycash_bnk;
        let pettycash_zar = updatedValues.pettycash_zar;
        let bd_uncollected_inventory = updatedValues.bd_uncollected_inventory;
        let cd_uncollected_inventory = updatedValues.cd_uncollected_inventory;
        let new_sales_cash_today_kgs = updatedValues.new_sales_cash_today_kgs;
        let new_sales_credit_today_kgs = updatedValues.new_sales_credit_today_kgs;
        let collected_today_kgs = updatedValues.collected_today_kgs;
        let collected_net_movement = updatedValues.collected_net_movement;
        let inv_adj_end_of_day_variance = updatedValues.inv_adj_end_of_day_variance;
        let inv_adj_transfare = updatedValues.inv_adj_transfare;
        let inv_adj_wieght_bridge_variance = updatedValues.inv_adj_wieght_bridge_variance;
        let inv_adj_physical_count_variance = updatedValues.inv_adj_physical_count_variance;
        let inv_adj_inventory_purchases = updatedValues.inv_adj_inventory_purchases;
        let inv_adj_total_adjustments = updatedValues.inv_adj_total_adjustments;
        let physical_inventory_open = updatedValues.physical_inventory_open;
        let physical_inventory_closing = updatedValues.physical_inventory_closing;
        let available_inventory_opening = updatedValues.available_inventory_opening;
        let available_inventory_closing = updatedValues.available_inventory_closing;
        let inventory_dispatched_system = updatedValues.inventory_dispatched_system;
        let inventory_dispatched_scales = updatedValues.inventory_dispatched_scales;
        let customer_accs_bd = updatedValues.customer_accs_bd;
        let customer_accs_cd = updatedValues.customer_accs_cd;
        let customer_accs_deposits = updatedValues.customer_accs_deposits;
        let customer_accs_withdrawals = updatedValues.customer_accs_withdrawals;
        let customer_acc_deposit_cas = updatedValues.customer_acc_deposit_cas;
        let customer_acc_deposit_eco = updatedValues.customer_acc_deposit_eco;
        let customer_acc_deposit_usd = updatedValues.customer_acc_deposit_usd;
        let customer_acc_deposit_zpt = updatedValues.customer_acc_deposit_zpt;
        let customer_acc_deposit_zar = updatedValues.customer_acc_deposit_zar;
        let customer_acc_refunds_cas = updatedValues.customer_acc_refunds_cas;
        let customer_acc_refunds_eco = updatedValues.customer_acc_refunds_eco;
        let customer_acc_refunds_usd = updatedValues.customer_acc_refunds_usd;
        let customer_acc_refunds_zpt = updatedValues.customer_acc_refunds_zpt;
        let customer_acc_refunds_zar = updatedValues.customer_acc_refunds_zar;
        let credit_notes_issued_cas = updatedValues.credit_notes_issued_cas;
        let credit_notes_issued_eco = updatedValues.credit_notes_issued_eco;
        let credit_notes_issued_usd = updatedValues.credit_notes_issued_usd;
        let credit_notes_issued_zpt = updatedValues.credit_notes_issued_zpt;
        let credit_notes_issued_zar = updatedValues.credit_notes_issued_zar;
        let credit_notes_issued_tot_usd_value = updatedValues.credit_notes_issued_tot_usd_value;
        let credit_notes_redeemed_cas = updatedValues.credit_notes_redeemed_cas;
        let credit_notes_redeemed_eco = updatedValues.credit_notes_redeemed_eco;
        let credit_notes_redeemed_usd = updatedValues.credit_notes_redeemed_usd;
        let credit_notes_redeemed_zpt = updatedValues.credit_notes_redeemed_zpt;
        let credit_notes_redeemed_zar = updatedValues.credit_notes_redeemed_zar;
        let credit_notes_redeemed_tot_usd_value = updatedValues.credit_notes_redeemed_tot_usd_value;
        let inventory_sales_cash_tot_cas = updatedValues.inventory_sales_cash_tot_cas;
        let inventory_sales_cash_tot_eco = updatedValues.inventory_sales_cash_tot_eco;
        let inventory_sales_cash_tot_usd = updatedValues.inventory_sales_cash_tot_usd;
        let inventory_sales_cash_tot_zpt = updatedValues.inventory_sales_cash_tot_zpt;
        let inventory_sales_cash_tot_zar = updatedValues.inventory_sales_cash_tot_zar;
        let inventory_sales_credit_tot_cas = updatedValues.inventory_sales_credit_tot_cas;
        let inventory_sales_credit_tot_eco = updatedValues.inventory_sales_credit_tot_eco;
        let inventory_sales_credit_tot_usd = updatedValues.inventory_sales_credit_tot_usd;
        let inventory_sales_credit_tot_zpt = updatedValues.inventory_sales_credit_tot_zpt;
        let inventory_sales_credit_tot_zar = updatedValues.inventory_sales_credit_tot_zar;
        let inventory_undispatched_cas = updatedValues.inventory_undispatched_cas;
        let inventory_undispatched_eco = updatedValues.inventory_undispatched_eco;
        let inventory_undispatched_usd = updatedValues.inventory_undispatched_usd;
        let inventory_undispatched_zpt = updatedValues.inventory_undispatched_zpt;
        let inventory_undispatched_zar = updatedValues.inventory_undispatched_zar;
        let meter_reading_open1 = updatedValues.meter_reading_open1;
        let meter_reading_cummulative1 = updatedValues.meter_reading_cummulative1;
        let meter_reading_close1 = updatedValues.meter_reading_close1;
        let meter_reading_open2 = updatedValues.meter_reading_open2;
        let meter_reading_cummulative2 = updatedValues.meter_reading_cummulative2;
        let meter_reading_close2 = updatedValues.meter_reading_close2;
        let meter_reading_open3 = updatedValues.meter_reading_open3;
        let meter_reading_cummulative3 = updatedValues.meter_reading_cummulative3;
        let meter_reading_close3 = updatedValues.meter_reading_close3;
        let meter_resseted = updatedValues.meter_resseted;
        let meter_resseted_by = updatedValues.meter_resseted_by;
        let transfared_to_finance = updatedValues.transfared_to_finance;
        let company_id = updatedValues.company_id;
        let company_name = updatedValues.company_name;
        let branch_name = updatedValues.branch_name;
        let branch_id = updatedValues.branch_id;
        let syncid = updatedValues.syncid;
  
      let result = await saleshistDbOperations.updateSalesShift(
        sales_shifts_id, sales_project_name, branch, operator, operator_id, shift_close_date, shift_close_time, shift_open_date, shift_open_time, opening_inventory, closing_inventory, sold_inventory, total_transactions, sales_cash_wholesale, sales_cash_retail, sales_credit_wholesale, sales_credit_retail, sales_cash_tot_cas, sales_cash_tot_zar, sales_cash_tot_eco, sales_cash_tot_usd, sales_cash_tot_zpt, sales_credit_tot_cas, sales_credit_tot_eco, sales_credit_tot_usd, sales_credit_tot_zpt, sales_credit_tot_zar, recorded_cas, recorded_eco, recorded_usd, recorded_zpt, recorded_zar, tendered_cas, tendered_eco, tendered_usd, tendered_zpt, tendered_zar, overbanking_cas, overbanking_eco, overbanking_usd, overbanking_zpt, overbanking_zar, overbanking_charged_acc_cas, overbanking_charged_acc_eco, overbanking_charged_acc_usd, overbanking_charged_acc_zpt, overbanking_charged_acc_zar, comment_operator, comment_supervisor, rate_usd, confirmed, authorized, reason_if_declined, shift_status, pettycash_cas, pettycash_eco, pettycash_usd, pettycash_bnk, pettycash_zar, bd_uncollected_inventory, cd_uncollected_inventory, new_sales_cash_today_kgs, new_sales_credit_today_kgs, collected_today_kgs, collected_net_movement, inv_adj_end_of_day_variance, inv_adj_transfare, inv_adj_wieght_bridge_variance, inv_adj_physical_count_variance, inv_adj_inventory_purchases, inv_adj_total_adjustments, physical_inventory_open, physical_inventory_closing, available_inventory_opening, available_inventory_closing, inventory_dispatched_system, inventory_dispatched_scales, customer_accs_bd, customer_accs_cd, customer_accs_deposits, customer_accs_withdrawals, customer_acc_deposit_cas, customer_acc_deposit_eco, customer_acc_deposit_usd, customer_acc_deposit_zpt, customer_acc_deposit_zar, customer_acc_refunds_cas, customer_acc_refunds_eco, customer_acc_refunds_usd, customer_acc_refunds_zpt, customer_acc_refunds_zar, credit_notes_issued_cas, credit_notes_issued_eco, credit_notes_issued_usd, credit_notes_issued_zpt, credit_notes_issued_zar, credit_notes_issued_tot_usd_value, credit_notes_redeemed_cas, credit_notes_redeemed_eco, credit_notes_redeemed_usd, credit_notes_redeemed_zpt, credit_notes_redeemed_zar, credit_notes_redeemed_tot_usd_value, inventory_sales_cash_tot_cas, inventory_sales_cash_tot_eco, inventory_sales_cash_tot_usd, inventory_sales_cash_tot_zpt, inventory_sales_cash_tot_zar, inventory_sales_credit_tot_cas, inventory_sales_credit_tot_eco, inventory_sales_credit_tot_usd, inventory_sales_credit_tot_zpt, inventory_sales_credit_tot_zar, inventory_undispatched_cas, inventory_undispatched_eco, inventory_undispatched_usd, inventory_undispatched_zpt, inventory_undispatched_zar, meter_reading_open1, meter_reading_cummulative1, meter_reading_close1, meter_reading_open2, meter_reading_cummulative2, meter_reading_close2, meter_reading_open3, meter_reading_cummulative3, meter_reading_close3, meter_resseted, meter_resseted_by, transfared_to_finance,company_id,company_name,branch_name,branch_id,syncid
      );
      res.json(result);
    } catch (e) {
      console.log(e);
      res.sendStatus(500);
    }
  });

saleshiftRouter.delete('/:id', async (req, res, next) => {
    try {
        let id = req.params.id;
        let result = await saleshistDbOperations.deleteSalesShift(id);
        res.json(result);
    } catch (e) {
        console.log(e);
        res.sendStatus(500);
    }
});

module.exports = saleshiftRouter;
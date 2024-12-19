require('dotenv').config();
// const pool = require('../cruds_gas_ecosystem/poolfile');
const pool = require('../cruds/poolfile');

let crudsObj = {};

crudsObj.postSalesShift = (sales_shifts_id, sales_project_name, branch, operator, operator_id, shift_close_date, shift_close_time, shift_open_date, shift_open_time, opening_inventory, closing_inventory, sold_inventory, total_transactions, sales_cash_wholesale, sales_cash_retail, sales_credit_wholesale, sales_credit_retail, sales_cash_tot_cas, sales_cash_tot_zar, sales_cash_tot_eco, sales_cash_tot_usd, sales_cash_tot_zpt, sales_credit_tot_cas, sales_credit_tot_eco, sales_credit_tot_usd, sales_credit_tot_zpt, sales_credit_tot_zar, recorded_cas, recorded_eco, recorded_usd, recorded_zpt, recorded_zar, tendered_cas, tendered_eco, tendered_usd, tendered_zpt, tendered_zar, overbanking_cas, overbanking_eco, overbanking_usd, overbanking_zpt, overbanking_zar, overbanking_charged_acc_cas, overbanking_charged_acc_eco, overbanking_charged_acc_usd, overbanking_charged_acc_zpt, overbanking_charged_acc_zar, comment_operator, comment_supervisor, rate_usd, confirmed, authorized, reason_if_declined, shift_status, pettycash_cas, pettycash_eco, pettycash_usd, pettycash_bnk, pettycash_zar, bd_uncollected_inventory, cd_uncollected_inventory, new_sales_cash_today_kgs, new_sales_credit_today_kgs, collected_today_kgs, collected_net_movement, inv_adj_end_of_day_variance, inv_adj_transfare, inv_adj_wieght_bridge_variance, inv_adj_physical_count_variance, inv_adj_inventory_purchases, inv_adj_total_adjustments, physical_inventory_open, physical_inventory_closing, available_inventory_opening, available_inventory_closing, inventory_dispatched_system, inventory_dispatched_scales, customer_accs_bd, customer_accs_cd, customer_accs_deposits, customer_accs_withdrawals, customer_acc_deposit_cas, customer_acc_deposit_eco, customer_acc_deposit_usd, customer_acc_deposit_zpt, customer_acc_deposit_zar, customer_acc_refunds_cas, customer_acc_refunds_eco, customer_acc_refunds_usd, customer_acc_refunds_zpt, customer_acc_refunds_zar, credit_notes_issued_cas, credit_notes_issued_eco, credit_notes_issued_usd, credit_notes_issued_zpt, credit_notes_issued_zar, credit_notes_issued_tot_usd_value, credit_notes_redeemed_cas, credit_notes_redeemed_eco, credit_notes_redeemed_usd, credit_notes_redeemed_zpt, credit_notes_redeemed_zar, credit_notes_redeemed_tot_usd_value, inventory_sales_cash_tot_cas, inventory_sales_cash_tot_eco, inventory_sales_cash_tot_usd, inventory_sales_cash_tot_zpt, inventory_sales_cash_tot_zar, inventory_sales_credit_tot_cas, inventory_sales_credit_tot_eco, inventory_sales_credit_tot_usd, inventory_sales_credit_tot_zpt, inventory_sales_credit_tot_zar, inventory_undispatched_cas, inventory_undispatched_eco, inventory_undispatched_usd, inventory_undispatched_zpt, inventory_undispatched_zar, meter_reading_open1, meter_reading_cummulative1, meter_reading_close1, meter_reading_open2, meter_reading_cummulative2, meter_reading_close2, meter_reading_open3, meter_reading_cummulative3, meter_reading_close3, meter_resseted, meter_resseted_by, transfared_to_finance,company_id,company_name,branch_name,branch_id,
    syncid)=>{
    return new Promise((resolve, reject)=>{
        pool.query('INSERT INTO sales_shifts(sales_project_name, branch, operator, operator_id, shift_close_date, shift_close_time, shift_open_date, shift_open_time, opening_inventory, closing_inventory, sold_inventory, total_transactions, sales_cash_wholesale, sales_cash_retail, sales_credit_wholesale, sales_credit_retail, sales_cash_tot_cas, sales_cash_tot_zar, sales_cash_tot_eco, sales_cash_tot_usd, sales_cash_tot_zpt, sales_credit_tot_cas, sales_credit_tot_eco, sales_credit_tot_usd, sales_credit_tot_zpt, sales_credit_tot_zar, recorded_cas, recorded_eco, recorded_usd, recorded_zpt, recorded_zar, tendered_cas, tendered_eco, tendered_usd, tendered_zpt, tendered_zar, overbanking_cas, overbanking_eco, overbanking_usd, overbanking_zpt, overbanking_zar, overbanking_charged_acc_cas, overbanking_charged_acc_eco, overbanking_charged_acc_usd, overbanking_charged_acc_zpt, overbanking_charged_acc_zar, comment_operator, comment_supervisor, rate_usd, confirmed, authorized, reason_if_declined, shift_status, pettycash_cas, pettycash_eco, pettycash_usd, pettycash_bnk, pettycash_zar, bd_uncollected_inventory, cd_uncollected_inventory, new_sales_cash_today_kgs, new_sales_credit_today_kgs, collected_today_kgs, collected_net_movement, inv_adj_end_of_day_variance, inv_adj_transfare, inv_adj_wieght_bridge_variance, inv_adj_physical_count_variance, inv_adj_inventory_purchases, inv_adj_total_adjustments, physical_inventory_open, physical_inventory_closing, available_inventory_opening, available_inventory_closing, inventory_dispatched_system, inventory_dispatched_scales, customer_accs_bd, customer_accs_cd, customer_accs_deposits, customer_accs_withdrawals, customer_acc_deposit_cas, customer_acc_deposit_eco, customer_acc_deposit_usd, customer_acc_deposit_zpt, customer_acc_deposit_zar, customer_acc_refunds_cas, customer_acc_refunds_eco, customer_acc_refunds_usd, customer_acc_refunds_zpt, customer_acc_refunds_zar, credit_notes_issued_cas, credit_notes_issued_eco, credit_notes_issued_usd, credit_notes_issued_zpt, credit_notes_issued_zar, credit_notes_issued_tot_usd_value, credit_notes_redeemed_cas, credit_notes_redeemed_eco, credit_notes_redeemed_usd, credit_notes_redeemed_zpt, credit_notes_redeemed_zar, credit_notes_redeemed_tot_usd_value, inventory_sales_cash_tot_cas, inventory_sales_cash_tot_eco, inventory_sales_cash_tot_usd, inventory_sales_cash_tot_zpt, inventory_sales_cash_tot_zar, inventory_sales_credit_tot_cas, inventory_sales_credit_tot_eco, inventory_sales_credit_tot_usd, inventory_sales_credit_tot_zpt, inventory_sales_credit_tot_zar, inventory_undispatched_cas, inventory_undispatched_eco, inventory_undispatched_usd, inventory_undispatched_zpt, inventory_undispatched_zar, meter_reading_open1, meter_reading_cummulative1, meter_reading_close1, meter_reading_open2, meter_reading_cummulative2, meter_reading_close2, meter_reading_open3, meter_reading_cummulative3, meter_reading_close3, meter_resseted, meter_resseted_by, transfared_to_finance,company_id,company_name,branch_name,branch_id,syncid) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)',[sales_shifts_id, sales_project_name, branch, operator, operator_id, shift_close_date, shift_close_time, shift_open_date, shift_open_time, opening_inventory, closing_inventory, sold_inventory, total_transactions, sales_cash_wholesale, sales_cash_retail, sales_credit_wholesale, sales_credit_retail, sales_cash_tot_cas, sales_cash_tot_zar, sales_cash_tot_eco, sales_cash_tot_usd, sales_cash_tot_zpt, sales_credit_tot_cas, sales_credit_tot_eco, sales_credit_tot_usd, sales_credit_tot_zpt, sales_credit_tot_zar, recorded_cas, recorded_eco, recorded_usd, recorded_zpt, recorded_zar, tendered_cas, tendered_eco, tendered_usd, tendered_zpt, tendered_zar, overbanking_cas, overbanking_eco, overbanking_usd, overbanking_zpt, overbanking_zar, overbanking_charged_acc_cas, overbanking_charged_acc_eco, overbanking_charged_acc_usd, overbanking_charged_acc_zpt, overbanking_charged_acc_zar, comment_operator, comment_supervisor, rate_usd, confirmed, authorized, reason_if_declined, shift_status, pettycash_cas, pettycash_eco, pettycash_usd, pettycash_bnk, pettycash_zar, bd_uncollected_inventory, cd_uncollected_inventory, new_sales_cash_today_kgs, new_sales_credit_today_kgs, collected_today_kgs, collected_net_movement, inv_adj_end_of_day_variance, inv_adj_transfare, inv_adj_wieght_bridge_variance, inv_adj_physical_count_variance, inv_adj_inventory_purchases, inv_adj_total_adjustments, physical_inventory_open, physical_inventory_closing, available_inventory_opening, available_inventory_closing, inventory_dispatched_system, inventory_dispatched_scales, customer_accs_bd, customer_accs_cd, customer_accs_deposits, customer_accs_withdrawals, customer_acc_deposit_cas, customer_acc_deposit_eco, customer_acc_deposit_usd, customer_acc_deposit_zpt, customer_acc_deposit_zar, customer_acc_refunds_cas, customer_acc_refunds_eco, customer_acc_refunds_usd, customer_acc_refunds_zpt, customer_acc_refunds_zar, credit_notes_issued_cas, credit_notes_issued_eco, credit_notes_issued_usd, credit_notes_issued_zpt, credit_notes_issued_zar, credit_notes_issued_tot_usd_value, credit_notes_redeemed_cas, credit_notes_redeemed_eco, credit_notes_redeemed_usd, credit_notes_redeemed_zpt, credit_notes_redeemed_zar, credit_notes_redeemed_tot_usd_value, inventory_sales_cash_tot_cas, inventory_sales_cash_tot_eco, inventory_sales_cash_tot_usd, inventory_sales_cash_tot_zpt, inventory_sales_cash_tot_zar, inventory_sales_credit_tot_cas, inventory_sales_credit_tot_eco, inventory_sales_credit_tot_usd, inventory_sales_credit_tot_zpt, inventory_sales_credit_tot_zar, inventory_undispatched_cas, inventory_undispatched_eco, inventory_undispatched_usd, inventory_undispatched_zpt, inventory_undispatched_zar, meter_reading_open1, meter_reading_cummulative1, meter_reading_close1, meter_reading_open2, meter_reading_cummulative2, meter_reading_close2, meter_reading_open3, meter_reading_cummulative3, meter_reading_close3, meter_resseted, meter_resseted_by, transfared_to_finance,company_id,company_name,branch_name,branch_id,syncid], (err, result)=>{
            if(err){
                return reject(err);
            }
            return resolve({statu:'200', message: 'saving successful'});
        })
    })
};
crudsObj.getSalesShift = ()=>{
    return new Promise((resolve, reject)=>{
        pool.query('SELECT * FROM sales_shifts', (err, results)=>{
            if(err){
                return reject(err);
            }
            return resolve(results);
        })
    })
};

crudsObj.getSalesShiftById = (id, company_id) => {
    return new Promise((resolve, reject)=>{
        pool.query('SELECT * FROM sales_shifts WHERE (branch_id = ? AND company_id = ? AND shift_status = "CLOSED") ORDER BY sales_shifts_id',[id, company_id], (err, results)=>{
            if(err){
                return reject(err);
            }
            return resolve(results);
        })
    })
  };

  crudsObj.updateSalesShift = (id,company_id, branch_id, code, description, rate_vs_usd, date, comitted_by) => {
    return new Promise((resolve, reject) => {
      pool.query(
        'UPDATE sales_shifts SET company_id = ?, branch_id = ?, code = ?, description = ?, rate_vs_usd = ?, date = ?, comitted_by = ? WHERE sales_shifts_id = ?',
        [company_id, branch_id, code, description, rate_vs_usd, date, comitted_by, id],
        (err, result) => {
          if (err) {
            return reject(err);
          }
          return resolve({ status: '200', message: 'update successful' });
        }
      );
    });
  };

  crudsObj.deleteSalesShift = (id) => {
    return new Promise((resolve, reject)=>{
        pool.query('DELETE FROM sales_shifts WHERE sales_shifts_id = ?',[id], (err, results)=>{
            if(err){
                return reject(err);
            }
            return resolve(results);
        })
    })
  };


module.exports = crudsObj;

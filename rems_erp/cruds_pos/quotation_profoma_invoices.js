require('dotenv').config();
const pool = require('../cruds_pos/poolfile');

let crudsObj = {};

// Updated postQuotationProformaInvoice function
crudsObj.postQuotationProformaInvoice = (
    propertyid,
    project,
    product_id,
    product_name,
    daterec,
    timerec,
    datefor,
    description,
    quantity,
    combined_receipt_total_quantity,
    amntrec,
    amntrec_credit,
    interest,
    principal,
    deposit,
    balance,
    receipt_ref_dispatch_locked,
    feesdue,
    username,
    confirmed_by,
    authorized_by,
    branch,
    dispatch_status,
    dispatch_by,
    dispatch_date,
    dispatch_time,
    dispatched_quantity,
    undispatched_quantity_remaining,
    undispatched_inventory_release_date,
    dispatch_sales_shift_id,
    sales_shifts_id,
    folio,
    pmode,
    currency,
    price,
    usd_price,
    usd_cost_per_unit,
    credit_repayment_currency_price,
    ref,
    vat_rate_charged,
    vat_invoice_no,
    discount_requisition_id,
    discount_amount,
    discount_cost,
    monthsbehind,
    movementafterpayment,
    suspencebal,
    suspencedr,
    suspencecr,
    suspencenarration,
    marketing_media_sale_origin,
    marketing_loyalty_structure_id,
    customerid,
    comment,
    sync_status
) => {
    return new Promise((resolve, reject) => {
        pool.query(
            `INSERT INTO quotation_proforma_invoices (
                propertyid, project, product_id, product_name, daterec, timerec, 
                datefor, description, quantity, combined_receipt_total_quantity, 
                amntrec, amntrec_credit, interest, principal, deposit, balance, 
                receipt_ref_dispatch_locked, feesdue, username, confirmed_by, 
                authorized_by, branch, dispatch_status, dispatch_by, 
                dispatch_date, dispatch_time, dispatched_quantity, 
                undispatched_quantity_remaining, undispatched_inventory_release_date, 
                dispatch_sales_shift_id, sales_shifts_id, folio, pmode, 
                currency, price, usd_price, usd_cost_per_unit, 
                credit_repayment_currency_price, ref, vat_rate_charged, 
                vat_invoice_no, discount_requisition_id, discount_amount, 
                discount_cost, monthsbehind, movementafterpayment, 
                suspencebal, suspencedr, suspencecr, suspencenarration, rx
                marketing_media_sale_origin, marketing_loyalty_structure_id, 
                customerid, comment, sync_status) 
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,?,?,?,?,?,?,?,?,?,?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                propertyid, project, product_id, product_name, daterec, timerec,
                datefor, description, quantity, combined_receipt_total_quantity,
                amntrec, amntrec_credit, interest, principal, deposit, balance,
                receipt_ref_dispatch_locked, feesdue, username, confirmed_by,
                authorized_by, branch, dispatch_status, dispatch_by,
                dispatch_date, dispatch_time, dispatched_quantity,
                undispatched_quantity_remaining, undispatched_inventory_release_date,
                dispatch_sales_shift_id, sales_shifts_id, folio, pmode,
                currency, price, usd_price, usd_cost_per_unit,
                credit_repayment_currency_price, ref, vat_rate_charged,
                vat_invoice_no, discount_requisition_id, discount_amount,
                discount_cost, monthsbehind, movementafterpayment,
                suspencebal, suspencedr, suspencecr, suspencenarration,
                marketing_media_sale_origin, marketing_loyalty_structure_id,
                customerid, comment, sync_status
            ],
            (err, result) => {
                if (err) {
                    return reject(err);
                }
                return resolve({ status: '200', message: 'Saving successful' });
            }
        );
    });
};

// Update other methods similarly...

crudsObj.getQuotationProformaInvoices = () => {
    return new Promise((resolve, reject) => {
        pool.query('SELECT SUM(amntrec) AS total_sales FROM quotation_proforma_invoices', (err, results) => {
            if (err) {
                return reject(err);
            }
            return resolve(results);
        });
    });
};

// Example for getting by ID
crudsObj.getQuotationProformaInvoiceById = (id) => {
    return new Promise((resolve, reject) => {
        pool.query('SELECT * FROM quotation_proforma_invoices WHERE quotation_proforma_invoice_id = ?', [id], (err, results) => {
            if (err) {
                return reject(err);
            }
            return resolve(results);
        });
    });
};

// Update other methods as needed...

module.exports = crudsObj;
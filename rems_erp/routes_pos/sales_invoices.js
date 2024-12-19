const express = require('express');
const salesInvoiceRouter = express.Router();
const salesInvoiceDbOperations = require('../cruds_pos/sales_invoices');

salesInvoiceRouter.post('/', async (req, res, next) => {
    try {
        let postedValues = req.body;
        let {
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
        } = postedValues;

        let results = await salesInvoiceDbOperations.postSalesInvoice(
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
        );

        res.json(results);
    } catch (e) {
        console.log(e);
        res.sendStatus(500);
    }
});




salesInvoiceRouter.get('/', async (req, res, next) => {
    try {
        let results = await salesInvoiceDbOperations.getSalesInvoices();
        res.json(results);
    } catch (e) {
        console.log(e);
        res.sendStatus(500);
    }
});

salesInvoiceRouter.get('/total/sales', async (req, res, next) => {
    try {
        let results = await salesInvoiceDbOperations.getSalesInvoicesTotalSales();
        res.json(results);
    } catch (e) {
        console.log(e);
        res.sendStatus(500);
    }
});

salesInvoiceRouter.get('/branchesonline/company/:company_id', async (req, res, next) => {
    try {
        let company_id = req.params.company_id;
        let results = await salesInvoiceDbOperations.getSalesInvoicesBranchesOnlineByCompanyId(company_id);
        res.json(results);
    } catch (e) {
        console.log(e);
        res.sendStatus(500);
    }
});

salesInvoiceRouter.get('/branch/:branch_id/:company_id', async (req, res, next) => {
    try {
        let branch_id = req.params.branch_id;
        let company_id = req.params.company_id;
        let results = await salesInvoiceDbOperations.getSalesInvoicesByBranch(branch_id, company_id);
        res.json(results);
    } catch (e) {
        console.log(e);
        res.sendStatus(500);
    }
});

salesInvoiceRouter.get('/:id', async (req, res, next) => {
    try {
        let id = req.params.id;
        let result = await salesInvoiceDbOperations.getSalesInvoiceById(id);
        res.json(result);
    } catch (e) {
        console.log(e);
        res.sendStatus(500);
    }
});

salesInvoiceRouter.put('/:id', async (req, res, next) => {
    try {
        let updatedValues = req.body;
        let id = req.params.id;

        // Extracting new columns
        let {
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
        } = updatedValues;

        let result = await salesInvoiceDbOperations.updateSalesInvoice(
            id, propertyid, project, product_id, product_name,
            daterec, timerec, datefor, description, quantity,
            combined_receipt_total_quantity, amntrec, amntrec_credit,
            interest, principal, deposit, balance,
            receipt_ref_dispatch_locked, feesdue, username,
            confirmed_by, authorized_by, branch, dispatch_status,
            dispatch_by, dispatch_date, dispatch_time, dispatched_quantity,
            undispatched_quantity_remaining, undispatched_inventory_release_date,
            dispatch_sales_shift_id, sales_shifts_id, folio,
            pmode, currency, price, usd_price,
            usd_cost_per_unit, credit_repayment_currency_price,
            ref, vat_rate_charged, vat_invoice_no,
            discount_requisition_id, discount_amount, discount_cost,
            monthsbehind, movementafterpayment, suspencebal,
            suspencedr, suspencecr, suspencenarration,
            marketing_media_sale_origin, marketing_loyalty_structure_id,
            customerid, comment, sync_status
        );
        res.json(result);
    } catch (e) {
        console.log(e);
        res.sendStatus(500);
    }
});

salesInvoiceRouter.delete('/:id', async (req, res, next) => {
    try {
        let id = req.params.id;
        let result = await salesInvoiceDbOperations.deleteSalesInvoice(id);
        res.json(result);
    } catch (e) {
        console.log(e);
        res.sendStatus(500);
    }
});

module.exports = salesInvoiceRouter;
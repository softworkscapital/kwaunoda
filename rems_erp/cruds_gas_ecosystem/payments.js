require('dotenv').config();
const pool = require('../cruds_gas_ecosystem/poolfile');

let crudsObj = {};

// Updated postPayment function
crudsObj.postPayment = (
    company_id,
    company_name,
    branch_id,
    branch_name,
    propertyid,
    project,
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
    dispatch_sales_shift_id,
    sales_shifts_id,
    folio,
    pmode,
    currency,
    price,
    rate_to_usd,
    ref,
    monthsbehind,
    movementafterpayment,
    suspencenarration,
    suspencedr,
    suspencecr,
    suspencebal,
    marketing_media_sale_origin,
    marketing_loyalty_structure_id,
    customerid,
    comment,
    scale,
    sync_status,
    sync_date_time,
    syncid
) => {
    return new Promise((resolve, reject) => {
        pool.query(
            `INSERT INTO payments (
                company_id, company_name, branch_id, branch_name, propertyid, project, 
                daterec, timerec, datefor, description, quantity, combined_receipt_total_quantity, 
                amntrec, amntrec_credit, interest, principal, deposit, balance, feesdue, 
                username, confirmed_by, authorized_by, branch, dispatch_status, dispatch_by, 
                dispatch_date, dispatch_time, dispatched_quantity, undispatched_quantity_remaining, 
                dispatch_sales_shift_id, sales_shifts_id, folio, pmode, currency, price, 
                rate_to_usd, ref, monthsbehind, movementafterpayment, suspencenarration, 
                suspencedr, suspencecr, suspencebal, marketing_media_sale_origin, 
                marketing_loyalty_structure_id, customerid, comment, scale, sync_status, 
                sync_date_time, syncid) 
                VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,
            [
                company_id, company_name, branch_id, branch_name, propertyid, project,
                daterec, timerec, datefor, description, quantity, combined_receipt_total_quantity,
                amntrec, amntrec_credit, interest, principal, deposit, balance, feesdue,
                username, confirmed_by, authorized_by, branch, dispatch_status, dispatch_by,
                dispatch_date, dispatch_time, dispatched_quantity, undispatched_quantity_remaining,
                dispatch_sales_shift_id, sales_shifts_id, folio, pmode, currency, price,
                rate_to_usd, ref, monthsbehind, movementafterpayment, suspencenarration,
                suspencedr, suspencecr, suspencebal, marketing_media_sale_origin,
                marketing_loyalty_structure_id, customerid, comment, scale, sync_status,
                sync_date_time, syncid
            ],
            (err, result) => {
                if (err) {
                    return reject(err);
                }
                return resolve({ status: '200', message: 'saving successful' });
            }
        );
    });
};

crudsObj.getPaymentsTotalSales = () => {
    return new Promise((resolve, reject) => {
        pool.query('SELECT SUM(amntrec) AS total_sales FROM payments', (err, results) => {
            if (err) {
                return reject(err);
            }
            return resolve(results);
        });
    });
};
// crudsObj.getPayments = () => {
//     return new Promise((resolve, reject) => {
//         pool.query('SELECT * FROM payments', (err, results) => {
//             if (err) {
//                 return reject(err);
//             }
//             return resolve(results);
//         });
//     });
// };


crudsObj.getPaymentsBranchesOnlineByCompanyId= (company_id) => {
    const today = getTodayDate();
    return new Promise((resolve, reject) => {
        pool.query(`SELECT DISTINCT branch_id FROM payments WHERE (daterec = ? AND company_id = ?)`, [today, company_id ], (err, results) => {
            if (err) {
                return reject(err);
            }
            return resolve(results);
        });
    });
};



crudsObj.getPaymentsByBranch = (branch_id, company_id) => {
    const today = getTodayDate();
    return new Promise((resolve, reject) => {
        pool.query(`SELECT SUM(amntrec) AS amnt, SUM(amntrec_credit) AS amnt_credit, COUNT(customerid) AS transaction, SUM(quantity) AS quantity, sales_shifts_id, username, branch_id, company_id FROM payments WHERE (daterec = ? AND branch_id = ? AND company_id = ?)`, [today, branch_id, company_id ], (err, results) => {
            if (err) {
                return reject(err);
            }
            return resolve(results);
        });
    });
};

crudsObj.getPaymentsSales = () => {
    const today = getTodayDate();
    return new Promise((resolve, reject) => {
        pool.query(`SELECT *, SUM(amntrec) AS total_sales FROM payments`, (err, results) => {
            if (err) {
                return reject(err);
            }
            return resolve(results);
        });
    });
};

// crudsObj.getPayments = () => {
//     return new Promise((resolve, reject) => {
//         pool.query('SELECT * FROM payments', (err, results) => {
//             if (err) {
//                 return reject(err);
//             }
//             return resolve(results);
//         });
//     });
// };

crudsObj.getPaymentById = (id) => {
    return new Promise((resolve, reject) => {
        pool.query('SELECT * FROM payments WHERE payid = ?', [id], (err, results) => {
            if (err) {
                return reject(err);
            }
            return resolve(results);
        });
    });
};

crudsObj.updatePayment = (
    id,
    payid,
    company_id,
    company_name,
    branch_id,
    branch_name,
    propertyid,
    project,
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
    dispatch_sales_shift_id,
    sales_shifts_id,
    folio,
    pmode,
    currency,
    price,
    rate_to_usd,
    ref,
    monthsbehind,
    movementafterpayment,
    suspencenarration,
    suspencedr,
    suspencecr,
    suspencebal,
    marketing_media_sale_origin,
    marketing_loyalty_structure_id,
    customerid,
    comment,
    scale,
    sync_status,
    sync_date_time,
    syncid
) => {
    return new Promise((resolve, reject) => {
        pool.query(
            `UPDATE payments SET 
                payid = ?, company_id = ?, company_name = ?, branch_id = ?, branch_name = ?, 
                propertyid = ?, project = ?, daterec = ?, timerec = ?, datefor = ?, 
                description = ?, quantity = ?, combined_receipt_total_quantity = ?, 
                amntrec = ?, amntrec_credit = ?, interest = ?, principal = ?, 
                deposit = ?, balance = ?, feesdue = ?, username = ?, 
                confirmed_by = ?, authorized_by = ?, branch = ?, 
                dispatch_status = ?, dispatch_by = ?, dispatch_date = ?, 
                dispatch_time = ?, dispatched_quantity = ?, 
                undispatched_quantity_remaining = ?, dispatch_sales_shift_id = ?, 
                sales_shifts_id = ?, folio = ?, pmode = ?, currency = ?, 
                price = ?, rate_to_usd = ?, ref = ?, monthsbehind = ?, 
                movementafterpayment = ?, suspencenarration = ?, 
                suspencedr = ?, suspencecr = ?, suspencebal = ?, 
                marketing_media_sale_origin = ?, 
                marketing_loyalty_structure_id = ?, customerid = ?, 
                comment = ?, scale = ?, sync_status = ?, 
                sync_date_time = ?, syncid = ? 
            WHERE payid = ?`,
            [
                payid, company_id, company_name, branch_id, branch_name, propertyid, project,
                daterec, timerec, datefor, description, quantity, combined_receipt_total_quantity,
                amntrec, amntrec_credit, interest, principal, deposit, balance, feesdue,
                username, confirmed_by, authorized_by, branch, dispatch_status, dispatch_by,
                dispatch_date, dispatch_time, dispatched_quantity, undispatched_quantity_remaining,
                dispatch_sales_shift_id, sales_shifts_id, folio, pmode, currency, price,
                rate_to_usd, ref, monthsbehind, movementafterpayment, suspencenarration,
                suspencedr, suspencecr, suspencebal, marketing_media_sale_origin,
                marketing_loyalty_structure_id, customerid, comment, scale, sync_status,
                sync_date_time, syncid, id
            ],
            (err, result) => {
                if (err) {
                    return reject(err);
                }
                return resolve({ status: '200', message: 'update successful' });
            }
        );
    });
};

crudsObj.deletePayment = (id) => {
    return new Promise((resolve, reject) => {
        pool.query('DELETE FROM payments WHERE payid = ?', [id], (err, results) => {
            if (err) {
                return reject(err);
            }
            return resolve(results);
        });
    });
};

const getTodayDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0]; 
};

module.exports = crudsObj;

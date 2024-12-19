require('dotenv').config();
const pool = require('./poolfile');

let crudsObj = {};

crudsObj.postInventory = (
    lpg_inventory_stock_sheets_id,
    date_rec,
    time_rec,
    branch,
    opening_inventory,
    added_inventory,
    closing_inventory,
    sold_inventory,
    dispatched_inventory, 
    cost_per_unit,
    last_in_unit_price,
    comment,
    username,
    confirmed,
    sales_shifts_id,
    company_id,
    branch_id,
    sync_id
) => {
    return new Promise((resolve, reject) => {
        pool.query(
            `INSERT INTO lpg_inventory_stock_sheets (
                 lpg_inventory_stock_sheets_id,
                 date_rec,
                 time_rec,
                 branch,
                 opening_inventory,
                 added_inventory,
                 closing_inventory,
                 sold_inventory,
                 dispatched_inventory, 
                 cost_per_unit,
                 last_in_unit_price,
                 comment,
                 username,
                 confirmed,
                 sales_shifts_id,
                 company_id,
                 branch_id,
                 sync_id
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                lpg_inventory_stock_sheets_id,
                date_rec,
                time_rec,
                branch,
                opening_inventory,
                added_inventory,
                closing_inventory,
                sold_inventory,
                dispatched_inventory, 
                cost_per_unit,
                last_in_unit_price,
                comment,
                username,
                confirmed,
                sales_shifts_id,
                company_id,
                branch_id,
                sync_id
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

crudsObj.getInventoryByCompanyId = (company_id) => {
    return new Promise((resolve, reject) => {
        pool.query('SELECT * FROM lpg_inventory_stock_sheets WHERE company_id = ? ORDER BY lpg_inventory_stock_sheets_id DESC', [company_id], (err, results) => {
            if (err) {
                return reject(err);
            }
            return resolve(results);
        });
    });
};

crudsObj.getInventoryByBranchId = (branch_id) => {
    return new Promise((resolve, reject) => {
        pool.query('SELECT * FROM lpg_inventory_stock_sheets WHERE branch_id = ? ORDER BY lpg_inventory_stock_sheets_id DESC', [branch_id], (err, results) => {
            if (err) {
                return reject(err);
            }
            return resolve(results);
        });
    });
};

crudsObj.updateInventory = (lpg_inventory_stock_sheets_id, updatedValues) => {
    return new Promise((resolve, reject) => {
        const {
            date_rec,
            time_rec,
            branch,
            opening_inventory,
            added_inventory,
            closing_inventory,
            sold_inventory,
            dispatched_inventory, 
            cost_per_unit,
            last_in_unit_price,
            comment,
            username,
            confirmed,
            sales_shifts_id,
            company_id,
            branch_id,
            sync_id,
        } = updatedValues;

        pool.query(
            `UPDATE lpg_inventory_stock_sheets SET 
                date_rec = ?, 
                time_rec = ?, 
                branch = ?, 
                opening_inventory = ?, 
                added_inventory = ?, 
                closing_inventory = ?, 
                sold_inventory = ?, 
                dispatched_inventory = ?, 
                cost_per_unit = ?, 
                last_in_unit_price = ?, 
                comment = ?, 
                username = ?, 
                confirmed = ?, 
                sales_shifts_id = ?, 
                company_id = ?, 
                branch_id = ?, 
                sync_id = ? 
            WHERE lpg_inventory_stock_sheets_id = ?`,
            [
                date_rec,
                time_rec,
                branch,
                opening_inventory,
                added_inventory,
                closing_inventory,
                sold_inventory,
                dispatched_inventory, 
                cost_per_unit,
                last_in_unit_price,
                comment,
                username,
                confirmed,
                sales_shifts_id,
                company_id,
                branch_id,
                sync_id,
                lpg_inventory_stock_sheets_id
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

crudsObj.deleteInventory = (lpg_inventory_stock_sheets_id) => {
    return new Promise((resolve, reject) => {
        pool.query('DELETE FROM lpg_inventory_stock_sheets WHERE lpg_inventory_stock_sheets_id = ?', [lpg_inventory_stock_sheets_id], (err, results) => {
            if (err) {
                return reject(err);
            }
            return resolve(results);
        });
    });
};



crudsObj.getLastCloseInventoryByBranchId = (branch_id) => {
    return new Promise((resolve, reject) => {
        pool.query('SELECT closing_inventory FROM lpg_inventory_stock_sheets WHERE branch_id = ? ORDER BY lpg_inventory_stock_sheets_id DESC LIMIT 1;', [branch_id], (err, results) => {
            if (err) {
                return reject(err);
            }
            return resolve(results);
        });
    });
};





module.exports = crudsObj; // Export the entire object
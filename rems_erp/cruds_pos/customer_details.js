require('dotenv').config();
const pool = require('./poolfile');

let crudsObj = {};

crudsObj.postCustomer = (
    customerid,
    ecnumber,
    account_type,
    account_category,
    signed_on,
    name,
    surname,
    idnumber,
    sex,
    dob,
    address,
    house_number_and_street_name,
    surbub,
    city,
    country,
    lat_cordinates,
    long_cordinates,
    phoneno1,
    phoneno2,
    email,
    password,
    employer,
    workindustry,
    workaddress,
    workphone,
    workphone2,
    nok1name,
    nok1surname,
    nok1relationship,
    nok1phone,
    nok2name,
    nok2surname,
    nok2relationship,
    nok2phone,
    creditstanding,
    membershipstatus,
    defaultsubs,
    sendmail,
    sendsms,
    product_code,
    cost_price,
    selling_price,
    payment_style,
    bp_number,
    vat_number
) => {
    return new Promise((resolve, reject) => {
        pool.query(
            `INSERT INTO customer_details (
                ecnumber, account_type, account_category, signed_on, name, surname, idnumber, sex, dob, 
                address, house_number_and_street_name, surbub, city, country, lat_cordinates, long_cordinates, 
                phoneno1, phoneno2, email, password, employer, workindustry, workaddress, workphone, workphone2, 
                nok1name, nok1surname, nok1relationship, nok1phone, nok2name, nok2surname, nok2relationship, nok2phone, 
                creditstanding, membershipstatus, defaultsubs, sendmail, sendsms, product_code, cost_price, 
                selling_price, payment_style, bp_number, vat_number
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                ecnumber,
                account_type,
                account_category,
                signed_on,
                name,
                surname,
                idnumber,
                sex,
                dob,
                address,
                house_number_and_street_name,
                surbub,
                city,
                country,
                lat_cordinates,
                long_cordinates,
                phoneno1,
                phoneno2,
                email,
                password,
                employer,
                workindustry,
                workaddress,
                workphone,
                workphone2,
                nok1name,
                nok1surname,
                nok1relationship,
                nok1phone,
                nok2name,
                nok2surname,
                nok2relationship,
                nok2phone,
                creditstanding,
                membershipstatus,
                defaultsubs,
                sendmail,
                sendsms,
                product_code,
                cost_price,
                selling_price,
                payment_style,
                bp_number,
                vat_number
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

crudsObj.getCustomers = () => {
    return new Promise((resolve, reject) => {
        pool.query('SELECT * FROM customer_details', (err, results) => {
            if (err) {
                return reject(err);
            }
            return resolve(results);
        });
    });
};

crudsObj.getCustomerById = (customer_id) => {
    return new Promise((resolve, reject) => {
        pool.query('SELECT * FROM customer_details WHERE customerid = ?', [customer_id], (err, results) => {
            if (err) {
                return reject(err);
            }
            return resolve(results);
        });
    });
};

crudsObj.updateCustomer = (customer_id, updatedValues) => {
    const {
        ecnumber,
        account_type,
        account_category,
        signed_on,
        name,
        surname,
        idnumber,
        sex,
        dob,
        address,
        house_number_and_street_name,
        surbub,
        city,
        country,
        lat_cordinates,
        long_cordinates,
        phoneno1,
        phoneno2,
        email,
        password,
        employer,
        workindustry,
        workaddress,
        workphone,
        workphone2,
        nok1name,
        nok1surname,
        nok1relationship,
        nok1phone,
        nok2name,
        nok2surname,
        nok2relationship,
        nok2phone,
        creditstanding,
        membershipstatus,
        defaultsubs,
        sendmail,
        sendsms,
        product_code,
        cost_price,
        selling_price,
        payment_style,
        bp_number,
        vat_number
    } = updatedValues;

    return new Promise((resolve, reject) => {
        pool.query(
            `UPDATE customer_details SET 
                ecnumber = ?, account_type = ?, account_category = ?, signed_on = ?, name = ?, surname = ?, 
                idnumber = ?, sex = ?, dob = ?, address = ?, house_number_and_street_name = ?, 
                surbub = ?, city = ?, country = ?, lat_cordinates = ?, long_cordinates = ?, 
                phoneno1 = ?, phoneno2 = ?, email = ?, password = ?, employer = ?, 
                workindustry = ?, workaddress = ?, workphone = ?, workphone2 = ?, 
                nok1name = ?, nok1surname = ?, nok1relationship = ?, nok1phone = ?, 
                nok2name = ?, nok2surname = ?, nok2relationship = ?, nok2phone = ?, 
                creditstanding = ?, membershipstatus = ?, defaultsubs = ?, sendmail = ?, 
                sendsms = ?, product_code = ?, cost_price = ?, selling_price = ?, 
                payment_style = ?, bp_number = ?, vat_number = ? 
            WHERE customerid = ?`,
            [
                ecnumber,
                account_type,
                account_category,
                signed_on,
                name,
                surname,
                idnumber,
                sex,
                dob,
                address,
                house_number_and_street_name,
                surbub,
                city,
                country,
                lat_cordinates,
                long_cordinates,
                phoneno1,
                phoneno2,
                email,
                password,
                employer,
                workindustry,
                workaddress,
                workphone,
                workphone2,
                nok1name,
                nok1surname,
                nok1relationship,
                nok1phone,
                nok2name,
                nok2surname,
                nok2relationship,
                nok2phone,
                creditstanding,
                membershipstatus,
                defaultsubs,
                sendmail,
                sendsms,
                product_code,
                cost_price,
                selling_price,
                payment_style,
                bp_number,
                vat_number,
                customer_id
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

crudsObj.deleteCustomer = (id) => {
    return new Promise((resolve, reject) => {
        pool.query('DELETE FROM customer_details WHERE customerid = ?', [id], (err, results) => {
            if (err) {
                return reject(err);
            }
            return resolve(results);
        });
    });
};

module.exports = crudsObj;

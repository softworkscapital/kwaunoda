require('dotenv').config();
const pool = require('./poolfile');

let crudsObj = {};

crudsObj.postDriver = (
    ecnumber,
    account_type,
    signed_on,
    username,
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
    phone,
    plate,
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
    rating,
    credit_bar_rule_exception,
    membershipstatus,
    defaultsubs,
    sendmail,
    sendsms,
    product_code,
    cost_price,
    selling_price,
    payment_style,
    profilePic
) => {
    return new Promise((resolve, reject) => {
        pool.query(
            `INSERT INTO driver_details (
        ecnumber, account_type, signed_on, username, name, surname, idnumber, sex, dob, 
        address, house_number_and_street_name, surbub, city, country, lat_cordinates, long_cordinates, 
        phone, plate, email, password, employer, workindustry, workaddress, workphone, workphone2, 
        nok1name, nok1surname, nok1relationship, nok1phone, nok2name, nok2surname, nok2relationship, nok2phone, 
        rating, credit_bar_rule_exception, membershipstatus, defaultsubs, sendmail, sendsms, product_code, cost_price, 
        selling_price, payment_style, profilePic
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
        ecnumber,
        account_type,
        signed_on,
        username,
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
        phone,
        plate,
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
        rating,
        credit_bar_rule_exception,
        membershipstatus,
        defaultsubs,
        sendmail,
        sendsms,
        product_code,
        cost_price,
        selling_price,
        payment_style,
        profilePic
    ],
    (err, result) => {
        if (err) {
            return reject(err);
        }
        return resolve({ status: '200', message: 'saving successful', result });
    }
        );
        
    });
};

crudsObj.getDrivers = () => {
    return new Promise((resolve, reject) => {
        pool.query('SELECT * FROM driver_details', (err, results) => {
            if (err) {
                return reject(err);
            }
            return resolve(results);
        });
    });
};

crudsObj.getDriverById = (driver_id) => {
    return new Promise((resolve, reject) => {
        pool.query('SELECT * FROM driver_details WHERE driver_id = ?', [driver_id], (err, results) => {
            if (err) {
                return reject(err);
            }
            return resolve(results);
        });
    });
};


crudsObj.getDriverByEmail = (driver_email) => {
    return new Promise((resolve, reject) => {
        pool.query('SELECT * FROM driver_details WHERE email = ?', [driver_email], (err, results) => {
            if (err) {
                return reject(err);
            }
            return resolve(results);
        });
    });
};


crudsObj.updateDriver = (driverid, updatedValues) => {
    const {
        ecnumber,
        account_type,
        signed_on,
        username,
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
        phone,
        plate,
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
        rating,
        credit_bar_rule_exception,
        membershipstatus,
        defaultsubs,
        sendmail,
        sendsms,
        product_code,
        cost_price,
        selling_price,
        payment_style,
        profilePic
    } = updatedValues;

    return new Promise((resolve, reject) => {
        pool.query(
            `UPDATE driver_details SET 
                ecnumber = ?, account_type = ?, signed_on = ?, username = ?, name = ?, surname = ?, 
                idnumber = ?, sex = ?, dob = ?, address = ?, house_number_and_street_name = ?, 
                surbub = ?, city = ?, country = ?, lat_cordinates = ?, long_cordinates = ?, 
                phone = ?, plate = ?, email = ?, password = ?, employer = ?, 
                workindustry = ?, workaddress = ?, workphone = ?, workphone2 = ?, 
                nok1name = ?, nok1surname = ?, nok1relationship = ?, nok1phone = ?, 
                nok2name = ?, nok2surname = ?, nok2relationship = ?, nok2phone = ?, rating = ?, 
                credit_bar_rule_exception = ?, membershipstatus = ?, defaultsubs = ?, sendmail = ?, 
                sendsms = ?, product_code = ?, cost_price = ?, selling_price = ?, 
                payment_style = ?, profilePic = ?
            WHERE driver_id = ?`,
            [
                ecnumber,
                account_type,
                signed_on,
                username,
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
                phone,
                plate,
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
                rating,
                credit_bar_rule_exception,
                membershipstatus,
                defaultsubs,
                sendmail,
                sendsms,
                product_code,
                cost_price,
                selling_price,
                payment_style,
                profilePic,
                driverid
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

crudsObj.deleteDriver = (id) => {
    return new Promise((resolve, reject) => {
        pool.query('DELETE FROM driver_details WHERE driverid = ?', [id], (err, results) => {
            if (err) {
                return reject(err);
            }
            return resolve(results);
        });
    });
};

module.exports = crudsObj;

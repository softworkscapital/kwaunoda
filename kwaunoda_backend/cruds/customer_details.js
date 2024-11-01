require('dotenv').config();
const pool = require('./poolfile');

let crudsObj = {};

crudsObj.postCustomer = (
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
    phone,
    username,
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
    profilePic // The URL of the uploaded image
) => {
    return new Promise((resolve, reject) => {
        pool.query(
            `INSERT INTO customer_details (
                ecnumber, account_type, account_category, signed_on, name, surname, idnumber, sex, dob, 
                address, house_number_and_street_name, surbub, city, country, lat_cordinates, long_cordinates, 
                phone, username, email, password, employer, workindustry, workaddress, workphone, workphone2, 
                nok1name, nok1surname, nok1relationship, nok1phone, nok2name, nok2surname, nok2relationship, nok2phone, 
                creditstanding, membershipstatus, defaultsubs, sendmail, sendsms, product_code, cost_price, 
                selling_price, payment_style, bp_number, vat_number, profilePic
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
                phone,
                username,
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

crudsObj.getCustomerByEmail = (email) => {
    return new Promise((resolve, reject) => {
        pool.query('SELECT * FROM customer_details WHERE email = ?', [email], (err, results) => {
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
        accountType,
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
        phone,
        username,
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
        profilePic
    } = updatedValues;

    return new Promise((resolve, reject) => {
        pool.query(
            `UPDATE customer_details SET 
                ecnumber = ?, account_type = ?, account_category = ?, signed_on = ?, name = ?, surname = ?, 
                idnumber = ?, sex = ?, dob = ?, address = ?, house_number_and_street_name = ?, 
                surbub = ?, city = ?, country = ?, lat_cordinates = ?, long_cordinates = ?, 
                phone = ?, username = ?, email = ?, password = ?, employer = ?, 
                workindustry = ?, workaddress = ?, workphone = ?, workphone2 = ?, 
                nok1name = ?, nok1surname = ?, nok1relationship = ?, nok1phone = ?, 
                nok2name = ?, nok2surname = ?, nok2relationship = ?, nok2phone = ?, 
                creditstanding = ?, membershipstatus = ?, defaultsubs = ?, sendmail = ?, 
                sendsms = ?, product_code = ?, cost_price = ?, selling_price = ?, 
                payment_style = ?, bp_number = ?, vat_number = ?, profilePic = ?
            WHERE customerid = ?`,
            [
                ecnumber,
                accountType,
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
                phone,
                username,
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
                customer_id,
                profilePic
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

  //customer crud
  crudsObj.getCustomerByStatus = (status) => {
    return new Promise((resolve, reject) => {
        pool.query('SELECT * FROM customer_details WHERE membershipstatus = ?', [status], (err, results) => {
            if (err) {
                return reject(err);
            }
            return resolve(results);
        });
    });
};


  //customer crud
  crudsObj.updateCustomerStatus = (customerid, updatedValues) => {
    const { membershipstatus } = updatedValues; // Only extract membershipstatus
  
    return new Promise((resolve, reject) => {
      pool.query(
        `UPDATE driver_details SET 
          membershipstatus = ?
        WHERE driver_id = ?`,
        [membershipstatus, customerid], // Only pass the necessary parameters
        (err, result) => {
          if (err) {
            return reject(err);
          }
          return resolve({ status: "200", message: "Update successful" });
        }
      );
    });
  };



module.exports = crudsObj;

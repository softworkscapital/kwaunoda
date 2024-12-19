require('dotenv').config();
const pool = require('./poolfile');

let crudsObj = {};

crudsObj.postClient = ( client_name, client_database_name, client_key, date, time, status)=>{
    return new Promise((resolve, reject)=>{
        pool.query('INSERT INTO clients(client_name, client_database_name, client_key, date, time, status) VALUES (?,?,?,?,?,?)',[client_name, client_database_name, client_key, date, time, status], (err, result)=>{
            if(err){
                return reject(err);
            }
            return resolve({statu:'200', message: 'saving successful'});
        })
    })
};

crudsObj.getClients = ()=>{
    return new Promise((resolve, reject)=>{
        pool.query('SELECT * FROM clients', (err, results)=>{
            if(err){
                return reject(err);
            }
            return resolve(results);
        })
    })
};

// getClentById
crudsObj.getClientById = (client_id) => {
    return new Promise((resolve, reject)=>{
        pool.query('SELECT * FROM clients WHERE client_id = ?',[client_id], (err, results)=>{
            if(err){
                return reject(err);
            }
            return resolve(results);
        })
    })
  };

  crudsObj.updateClient = (client_id, client_name, client_database_name, client_key, date, time, status) => {
    return new Promise((resolve, reject) => {
      pool.query(
        'UPDATE clients SET client_name = ?, client_database_name = ?, client_key = ?, date = ?, time = ?, status = ? WHERE client_id = ?',
        [client_name, client_database_name, client_key, date, time, status, client_id],
        (err, result) => {
          if (err) {
            return reject(err);
          }
          return resolve({ status: '200', message: 'update successful' });
        }
      );
    });
  };

  crudsObj.deleteClient = (id) => {
    return new Promise((resolve, reject)=>{
        pool.query('DELETE FROM clients WHERE client_id = ?',[id], (err, results)=>{
            if(err){
                return reject(err);
            }
            return resolve(results);
        })
    })
  };

  module.exports=crudsObj;
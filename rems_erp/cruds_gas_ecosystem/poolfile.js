const mysql = require('mysql');

const pool = mysql.createPool({
    // host: process.env.DBHOSTGASECO,
    // // port: process.env.DBPORTGASECO,
    // user: process.env.DBUSERGASECO,
    // password: 'qDe&1#Hb',
    // database: process.env.DATABASEGASECO,
    // connectionLimit: process.env.CONLIMIT,


    host: process.env.DBHOSTGASECO,
    // port: process.env.DBPORTGASECO,
    user: process.env.DBUSERGASECO,
    password: 'qDe&1#Hb',
    database: process.env.DATABASEGASECO,
    connectionLimit: process.env.CONLIMIT,
 })

module.exports = pool;
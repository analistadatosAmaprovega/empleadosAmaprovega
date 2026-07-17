// const mysql = require('mysql2');
// require('dotenv').config();

// const pool = mysql.createPool({
//     host: process.env.DB_HOST,
//     user: process.env.DB_USER,
//     password: process.env.DB_PASSWORD,
//     database: process.env.DB_NAME,
//     connectionLimit: 5
// });



// // Exportar con soporte de Promesas (importante para usar async/await)
// module.exports = pool.promise();









const mysql = require("mysql2");
const { Pool } = require("pg");

require("dotenv").config();

// MariaDB
const mariadb = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    connectionLimit: 5
}).promise();

// PostgreSQL
const postgres = new Pool({
    host: "localhost",
    port: 5432,
    database: "amaprovegaPG",
    user: "postgres",
    password: "123456789"
});

module.exports = {
    mariadb,
    postgres
};
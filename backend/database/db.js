
const mysql = require("mysql2");
const { Pool } = require("pg");

console.log({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});


// MariaDB
const mariadb = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    connectionLimit: 5
}).promise();


// 
// PostgreSQL
//
// solo si esta en local
// const postgres = new Pool({
//     host: process.env.PG_HOST,
//     port: Number(process.env.PG_PORT),
//     database: process.env.PG_DATABASE,
//     user: process.env.PG_USER,
//     password: String(process.env.PG_PASSWORD),
//        ssl: process.env.NODE_ENV === "production" 
//         ? { rejectUnauthorized: false } 
//         : false
// });



// Si esta en produccion
// const postgres = new Pool({
//     connectionString: process.env.DATABASE_URL,
//     ssl: process.env.NODE_ENV === "production" 
//         ? { rejectUnauthorized: false } 
//         : false
// });



const isProduction = process.env.NODE_ENV === 'production';


const postgres = process.env.DATABASE_URL
  ? new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: isProduction
        ? { rejectUnauthorized: false }
        : false,
    })
  : new Pool({
      host: process.env.PG_HOST,
      port: Number(process.env.PG_PORT),
      database: process.env.PG_DATABASE,
      user: process.env.PG_USER,
      password: String(process.env.PG_PASSWORD),
      ssl: isProduction
        ? { rejectUnauthorized: false }
        : false,
    });


module.exports = {
    mariadb,
    postgres
};
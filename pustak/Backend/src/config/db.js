// pool class import

const { Pool } = require('pg');

// dotenv import

require('dotenv').config();


// creating new connection

const pool = new Pool({
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: process.env.DB_NAME,
});


// test

pool.connect()
    .then(()=> console.log('OK!'))
    .catch((err)=> console.error('Error :', err.stack));

// export

module.exports = pool;



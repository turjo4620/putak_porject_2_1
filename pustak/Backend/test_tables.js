require('dotenv').config();
const { Pool } = require('pg');
const pool = new Pool({
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: process.env.DB_NAME,
});

// List all tables in the database
pool.query(`
    SELECT table_name 
    FROM information_schema.tables 
    WHERE table_schema = 'public' 
    ORDER BY table_name
`)
.then(r => {
    console.log('ALL TABLES:');
    r.rows.forEach(row => console.log(' -', row.table_name));
    pool.end();
})
.catch(e => { console.error('ERROR:', e.message); pool.end(); });

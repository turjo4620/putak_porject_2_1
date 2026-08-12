require('dotenv').config();
const { Pool } = require('pg');
const pool = new Pool({
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: process.env.DB_NAME,
});

// Check books table columns
pool.query(`
    SELECT column_name, data_type 
    FROM information_schema.columns 
    WHERE table_name = 'books' AND table_schema = 'public'
    ORDER BY ordinal_position
`)
.then(r => {
    console.log('BOOKS COLUMNS:');
    r.rows.forEach(row => console.log(' -', row.column_name, ':', row.data_type));
    return pool.query(`SELECT COUNT(*) FROM books`);
})
.then(r => {
    console.log('Total books:', r.rows[0].count);
    // Check if books have a category column
    return pool.query(`SELECT DISTINCT category FROM books LIMIT 10`);
})
.then(r => {
    console.log('Sample book categories:', r.rows);
    pool.end();
})
.catch(e => { console.error('ERROR:', e.message); pool.end(); });

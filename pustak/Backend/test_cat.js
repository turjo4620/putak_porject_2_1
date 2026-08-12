require('dotenv').config();
const { Pool } = require('pg');
const pool = new Pool({
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: process.env.DB_NAME,
});
console.log('DB config:', { user: process.env.DB_USER, host: process.env.DB_HOST, port: process.env.DB_PORT, database: process.env.DB_NAME });

const query = `
    SELECT 
        categories.category_id, 
        categories.category_name, 
        COUNT(book_category.book_id) AS count
    FROM categories
    LEFT JOIN book_category ON categories.category_id = book_category.category_id
    GROUP BY categories.category_id
    ORDER BY categories.category_id ASC
    LIMIT 5
`;
pool.query(query)
  .then(r => { console.log('ROWS:', JSON.stringify(r.rows, null, 2)); pool.end(); })
  .catch(e => { console.error('QUERY ERROR:', e.message, e.stack); pool.end(); });

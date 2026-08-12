require('dotenv').config();
const { Pool } = require('pg');
const pool = new Pool({
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: process.env.DB_NAME,
});

async function run() {
    const client = await pool.connect();
    try {
        await client.query('BEGIN');

        // Step 1: Create the book_category table
        console.log('Creating book_category table...');
        await client.query(`
            CREATE TABLE IF NOT EXISTS book_category (
                book_id     INT NOT NULL,
                category_id INT NOT NULL,
                PRIMARY KEY (book_id, category_id),
                FOREIGN KEY (book_id) REFERENCES books(id) ON DELETE CASCADE,
                FOREIGN KEY (category_id) REFERENCES categories(category_id) ON DELETE CASCADE
            )
        `);
        console.log('Table created.');

        // Step 2: Populate book_category by matching books.category text to categories.category_name
        // The books.category column has trailing junk like "3 Ratings | No Review TK. 119 TK. 135"
        // We clean it by extracting only the part that matches a known category name.
        // Strategy: join where the books.category STARTS WITH the category_name
        console.log('Populating book_category from books.category column...');
        const insertResult = await client.query(`
            INSERT INTO book_category (book_id, category_id)
            SELECT DISTINCT b.id, c.category_id
            FROM books b
            JOIN categories c
              ON TRIM(b.category) = c.category_name
              OR TRIM(b.category) LIKE (c.category_name || ' %')
            WHERE b.category IS NOT NULL
            ON CONFLICT DO NOTHING
        `);
        console.log(`Inserted ${insertResult.rowCount} book-category mappings.`);

        await client.query('COMMIT');
        console.log('Done!');

        // Verify
        const verify = await pool.query(`
            SELECT c.category_name, COUNT(bc.book_id) as book_count
            FROM categories c
            LEFT JOIN book_category bc ON c.category_id = bc.category_id
            GROUP BY c.category_id, c.category_name
            HAVING COUNT(bc.book_id) > 0
            ORDER BY book_count DESC
            LIMIT 20
        `);
        console.log('\nTop 20 categories by book count:');
        verify.rows.forEach(r => console.log(`  ${r.category_name}: ${r.book_count} books`));

    } catch (e) {
        await client.query('ROLLBACK');
        console.error('ERROR:', e.message);
    } finally {
        client.release();
        pool.end();
    }
}

run();

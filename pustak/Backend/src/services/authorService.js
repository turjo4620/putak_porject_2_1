const pool = require('../config/db');

const getAllAuthors = async () => {
    const query = `
        SELECT 
            authors.author_id, 
            authors.name, 
            authors.photo_url, 
            COUNT(book_author.book_id) AS count
        FROM authors
        LEFT JOIN book_author ON authors.author_id = book_author.author_id
        GROUP BY authors.author_id
        ORDER BY count DESC
    `;
    const result = await pool.query(query);
    return result.rows;
};
const getAuthorByID = async (id) => {
    const result = await pool.query(
        'SELECT * FROM authors WHERE author_id = $1', [id]
    );
    return result.rows[0];
};

module.exports = { 
    getAllAuthors,
    getAuthorByID 
};
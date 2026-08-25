const pool = require('../config/db');

const getAllAuthors = async (searchTerm = '') => {
    let query = `
        SELECT 
            authors.author_id, 
            authors.name, 
            authors.bio,
            authors.photo_url, 
            COUNT(book_author.book_id) AS count
        FROM authors
        LEFT JOIN book_author ON authors.author_id = book_author.author_id
    `;
    
    const params = [];
    if (searchTerm) {
        query += ` WHERE authors.name ILIKE $1`;
        params.push(`%${searchTerm}%`);
    }
    
    query += ` GROUP BY authors.author_id ORDER BY count DESC`;
    
    const result = await pool.query(query, params);
    return result.rows;
};

const getAuthorByID = async (id) => {
    const result = await pool.query(
        'SELECT * FROM authors WHERE author_id = $1', [id]
    );
    return result.rows[0];
};

const createAuthor = async (authorData) => {
    const { name, bio, photo_url } = authorData;
    const query = `
        INSERT INTO authors (name, bio, photo_url)
        VALUES ($1, $2, $3)
        RETURNING *
    `;
    const result = await pool.query(query, [name, bio || null, photo_url || null]);
    return result.rows[0];
};

const updateAuthor = async (id, authorData) => {
    const { name, bio, photo_url } = authorData;
    const query = `
        UPDATE authors
        SET name = $1, bio = $2, photo_url = $3
        WHERE author_id = $4
        RETURNING *
    `;
    const result = await pool.query(query, [name, bio || null, photo_url || null, id]);
    return result.rows[0];
};

const deleteAuthor = async (id) => {
    const query = 'DELETE FROM authors WHERE author_id = $1 RETURNING *';
    const result = await pool.query(query, [id]);
    return result.rows[0];
};

module.exports = { 
    getAllAuthors,
    getAuthorByID,
    createAuthor,
    updateAuthor,
    deleteAuthor
};
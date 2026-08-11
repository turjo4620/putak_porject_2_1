const pool = require('../config/db');

const getAllCategories = async () => {
    // query
    const query = `
        SELECT 
            categories.category_id, 
            categories.category_name, 
            COUNT(book_category.book_id) AS count
        FROM categories
        LEFT JOIN book_category ON categories.category_id = book_category.category_id
        GROUP BY categories.category_id
        ORDER BY categories.category_id ASC
    `;
    // execute
    const result = await pool.query(query);
    return result.rows;
};

const getCategoryByID = async (id) => {
    // query
    const result = await pool.query(
        'SELECT * FROM categories WHERE category_id = $1', [id]
    );
    return result.rows[0];
};

module.exports = { 
    getAllCategories,
    getCategoryByID 
};

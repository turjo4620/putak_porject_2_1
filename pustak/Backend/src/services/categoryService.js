const pool = require('../config/db');

const getAllCategories = async (searchTerm = '') => {
    let query = `
        SELECT 
            categories.category_id, 
            categories.category_name, 
            COUNT(book_category.book_id) AS count
        FROM categories
        LEFT JOIN book_category ON categories.category_id = book_category.category_id
    `;
    
    const params = [];
    if (searchTerm) {
        query += ` WHERE categories.category_name ILIKE $1`;
        params.push(`%${searchTerm}%`);
    }
    
    query += ` GROUP BY categories.category_id ORDER BY categories.category_id ASC`;
    
    const result = await pool.query(query, params);
    return result.rows;
};

const getCategoryByID = async (id) => {
    const result = await pool.query(
        'SELECT * FROM categories WHERE category_id = $1', [id]
    );
    return result.rows[0];
};

const createCategory = async (categoryData) => {
    const { category_name } = categoryData;
    const query = `
        INSERT INTO categories (category_name)
        VALUES ($1)
        RETURNING *
    `;
    const result = await pool.query(query, [category_name]);
    return result.rows[0];
};

const updateCategory = async (id, categoryData) => {
    const { category_name } = categoryData;
    const query = `
        UPDATE categories
        SET category_name = $1
        WHERE category_id = $2
        RETURNING *
    `;
    const result = await pool.query(query, [category_name, id]);
    return result.rows[0];
};

const deleteCategory = async (id) => {
    const query = 'DELETE FROM categories WHERE category_id = $1 RETURNING *';
    const result = await pool.query(query, [id]);
    return result.rows[0];
};

module.exports = { 
    getAllCategories,
    getCategoryByID,
    createCategory,
    updateCategory,
    deleteCategory
};

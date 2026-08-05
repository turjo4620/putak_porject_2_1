const pool = require('../config/db');

const getAllBooks = async() =>{
    const result = pool.query(
        'SELECT * FROM books ORDER BY book_id ASC'
    );
    return result;
}

module.exports = { 
    getAllBooks 
};


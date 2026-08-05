const pool = require('../config/db');

const getAllAuthors = async () => {
    const result = await pool.query(
        'SELECT * FROM authors ORDER BY author_id ASC'
    );
    return result.rows;
};



const getAuthorByID = async(id) =>{
    const result = await pool.query(
        'SELECT * FROM authors WHERE author_id = $1', [id]
    );
    // specific row needed
    return result.rows[0]; 

}

module.exports = { 
    getAllAuthors,
    getAuthorByID };
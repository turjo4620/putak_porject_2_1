const pool = require('../config/db');

const getBooks = async (req, res) => {
  try {
    // Pagination
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const offset = (page - 1) * limit;

    // Query
    const query = `
      SELECT books.id, books.book_name, books.cover_image_url, books.price, authors.name AS author 
      FROM books 
      JOIN book_author ON books.id = book_author.book_id
      JOIN authors ON book_author.author_id = authors.author_id
      ORDER BY books.id ASC 
      LIMIT $1 OFFSET $2
    `;
    
    // Execute
    const { rows } = await pool.query(query, [limit, offset]);

    // Count
    const countQuery = 'SELECT COUNT(*) FROM books';
    const countResult = await pool.query(countQuery);
    const totalBooks = parseInt(countResult.rows[0].count);

    // Response
    res.status(200).json({
      data: rows,
      total: totalBooks,
      currentPage: page,
      totalPages: Math.ceil(totalBooks / limit)
    });

  } catch (error) {
    // Error
    console.error(error.message);
    res.status(500).json({ error: "Error" });
  }
};

const searchBooks = async (req, res) => {
  try {
    // Pagination
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const offset = (page - 1) * limit;

    // Term (trim removes any hidden spaces)
const searchTerm = req.query.q ? req.query.q.trim() : '';
    const searchPattern = `%${searchTerm.split(/\s+/).join('%')}%`;

    // Query (Changed ILIKE to LIKE for Bengali text support)
    const query = `
      SELECT books.id, books.book_name, books.cover_image_url, books.price, authors.name AS author
      FROM books
      JOIN book_author ON books.id = book_author.book_id
      JOIN authors ON book_author.author_id = authors.author_id
      WHERE books.book_name LIKE $1 OR authors.name LIKE $1
      ORDER BY books.id ASC
      LIMIT $2 OFFSET $3
    `;

    // Execute Books
    const { rows } = await pool.query(query, [searchPattern, limit, offset]);

    // Query for Total Count (Changed ILIKE to LIKE here too)
    const countQuery = `
      SELECT COUNT(*) 
      FROM books
      JOIN book_author ON books.id = book_author.book_id
      JOIN authors ON book_author.author_id = authors.author_id
      WHERE books.book_name LIKE $1 OR authors.name LIKE $1
    `;
    
    // Execute Count
    const countResult = await pool.query(countQuery, [searchPattern]);
    const totalBooks = parseInt(countResult.rows[0].count);

    // Response
    res.status(200).json({
      data: rows,
      total: totalBooks,
      currentPage: page,
      totalPages: Math.ceil(totalBooks / limit)
    });

  } catch (error) {
    // Error
    console.error(error.message);
    res.status(500).json({ error: "Error" });
  }
};

const getBooksByAuthor = async (req, res) => {
  try {
    const authorId = parseInt(req.params.id);
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const offset = (page - 1) * limit;

    // 1. Get the exact author's name first
    const authorQuery = `SELECT name FROM authors WHERE author_id = $1`;
    const authorResult = await pool.query(authorQuery, [authorId]);
    
    if (authorResult.rows.length === 0) {
      return res.status(404).json({ error: "Author not found" });
    }
    const authorName = authorResult.rows[0].name;

    // 2. Get their books
    const bookQuery = `
      SELECT books.id, books.book_name, books.cover_image_url, books.price, authors.name AS author
      FROM books
      JOIN book_author ON books.id = book_author.book_id
      JOIN authors ON book_author.author_id = authors.author_id
      WHERE authors.author_id = $1
      ORDER BY books.id ASC
      LIMIT $2 OFFSET $3
    `;
    const { rows } = await pool.query(bookQuery, [authorId, limit, offset]);

    // 3. Get total count
    const countQuery = `SELECT COUNT(*) FROM book_author WHERE author_id = $1`;
    const countResult = await pool.query(countQuery, [authorId]);
    const totalBooks = parseInt(countResult.rows[0].count);

    // 4. Send it all back
    res.status(200).json({
      authorName: authorName,
      data: rows,
      total: totalBooks,
      currentPage: page,
      totalPages: Math.ceil(totalBooks / limit)
    });

  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "Error" });
  }
};

module.exports = {
    getBooks,
    searchBooks,
    getBooksByAuthor
}
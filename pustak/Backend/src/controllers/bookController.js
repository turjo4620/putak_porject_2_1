const pool = require('../config/db');

const getBooks = async (req, res) => {
  try {
    // Pagination
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const offset = (page - 1) * limit;

    // Query (Added discount_price and discount_percentage)
    const query = `
      SELECT 
        books.id, 
        books.book_name, 
        books.cover_image_url, 
        books.price, 
        books.discount_price,
        books.discount_percentage,
        authors.name AS author 
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

    // Query (Added discount columns & kept LIKE for Bengali)
    const query = `
      SELECT 
        books.id, 
        books.book_name, 
        books.cover_image_url, 
        books.price, 
        books.discount_price,
        books.discount_percentage,
        authors.name AS author
      FROM books
      JOIN book_author ON books.id = book_author.book_id
      JOIN authors ON book_author.author_id = authors.author_id
      WHERE books.book_name LIKE $1 OR authors.name LIKE $1
      ORDER BY books.id ASC
      LIMIT $2 OFFSET $3
    `;

    // Execute Books
    const { rows } = await pool.query(query, [searchPattern, limit, offset]);

    // Query for Total Count
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

    // 2. Get their books (MAGIC ORDER BY statement + discount columns)
    const bookQuery = `
      SELECT 
        books.id, 
        books.book_name, 
        books.cover_image_url, 
        books.price, 
        books.discount_price,
        books.discount_percentage,
        authors.name AS author
      FROM books
      JOIN book_author ON books.id = book_author.book_id
      JOIN authors ON book_author.author_id = authors.author_id
      WHERE authors.author_id = $1
      ORDER BY 
        CASE 
          WHEN books.book_name LIKE '%কালেকশন%' THEN 1
          WHEN books.book_name LIKE '%বক্সসেট%' THEN 1
          WHEN books.book_name LIKE '%প্যাকেজ%' THEN 1
          WHEN books.book_name LIKE '%সমগ্র%' THEN 1
          WHEN books.book_name LIKE '%রচনাবলি%' THEN 1
          WHEN books.book_name LIKE '%টি বই%' THEN 1
          ELSE 0 
        END ASC,
        books.id ASC
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

const getBooksByPublication = async (req, res) => {
  try {
    const publicationId = parseInt(req.params.id);
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const offset = (page - 1) * limit;

    const publicationQuery = `SELECT title FROM publications WHERE publication_id = $1`;
    const publicationResult = await pool.query(publicationQuery, [publicationId]);

    if (publicationResult.rows.length === 0) {
      return res.status(404).json({ error: "Publication not found" });
    }
    const publicationName = publicationResult.rows[0].title;

    const bookQuery = `
      SELECT
        books.id,
        books.book_name,
        books.cover_image_url,
        books.price,
        books.discount_price,
        books.discount_percentage,
        MIN(authors.name) AS author
      FROM books
      JOIN book_publication_create ON books.id = book_publication_create.book_id
      LEFT JOIN book_author ON books.id = book_author.book_id
      LEFT JOIN authors ON book_author.author_id = authors.author_id
      WHERE book_publication_create.publication_id = $1
      GROUP BY books.id
      ORDER BY 
        CASE 
          WHEN books.book_name LIKE '%কালেকশন%' THEN 1
          WHEN books.book_name LIKE '%বক্সসেট%' THEN 1
          WHEN books.book_name LIKE '%প্যাকেজ%' THEN 1
          WHEN books.book_name LIKE '%সমগ্র%' THEN 1
          WHEN books.book_name LIKE '%রচনাবলি%' THEN 1
          WHEN books.book_name LIKE '%টি বই%' THEN 1
          ELSE 0 
        END ASC,
        books.id ASC
      LIMIT $2 OFFSET $3
    `;

    const { rows } = await pool.query(bookQuery, [publicationId, limit, offset]);
    const countQuery = `SELECT COUNT(*) FROM book_publication_create WHERE publication_id = $1`;
    const countResult = await pool.query(countQuery, [publicationId]);
    const totalBooks = parseInt(countResult.rows[0].count);

    res.status(200).json({
      publicationName,
      data: rows,
      total: totalBooks,
      currentPage: page,
      totalPages: Math.ceil(totalBooks / limit),
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "Error" });
  }
};

const getBookById = async (req, res) => {
  try {
    const bookId = parseInt(req.params.id);

    // Fetching ALL the columns from your specific schema!
    const query = `
      SELECT 
        books.id, 
        books.book_name, 
        books.cover_image_url, 
        books.price, 
        books.discount_price,
        books.discount_percentage,
        books.publisher,
        books.category,
        books.isbn,
        books.language,
        books.num_pages,
        books.edition,
        books.rating,
        books.num_reviews,
        books.availability,
        books.description,
        authors.name AS author
      FROM books
      LEFT JOIN book_author ON books.id = book_author.book_id
      LEFT JOIN authors ON book_author.author_id = authors.author_id
      WHERE books.id = $1
    `;
    
    const { rows } = await pool.query(query, [bookId]);

    if (rows.length === 0) {
      return res.status(404).json({ error: "Book not found" });
    }

    res.status(200).json(rows[0]);

  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "Error fetching book" });
  }
};

module.exports = {
    getBooks,
    searchBooks,
    getBooksByAuthor,
    getBooksByPublication,
    getBookById
}
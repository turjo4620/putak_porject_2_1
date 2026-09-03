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
      LEFT JOIN book_author ON books.id = book_author.book_id
      LEFT JOIN authors ON book_author.author_id = authors.author_id
      WHERE books.publication_id = $1
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
    const countQuery = `SELECT COUNT(*) FROM books WHERE publication_id = $1`;
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

const getBooksByCategory = async (req, res) => {
  try {
    const categoryId = parseInt(req.params.id);
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const offset = (page - 1) * limit;

    // Validate the category exists
    const categoryQuery = `SELECT category_name FROM categories WHERE category_id = $1`;
    const categoryResult = await pool.query(categoryQuery, [categoryId]);

    if (categoryResult.rows.length === 0) {
      return res.status(404).json({ error: "Category not found" });
    }
    const categoryName = categoryResult.rows[0].category_name;

    // Get books in this category
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
      JOIN book_category ON books.id = book_category.book_id
      LEFT JOIN book_author ON books.id = book_author.book_id
      LEFT JOIN authors ON book_author.author_id = authors.author_id
      WHERE book_category.category_id = $1
      GROUP BY books.id
      ORDER BY books.id ASC
      LIMIT $2 OFFSET $3
    `;
    const { rows } = await pool.query(bookQuery, [categoryId, limit, offset]);

    // Total count
    const countQuery = `SELECT COUNT(*) FROM book_category WHERE category_id = $1`;
    const countResult = await pool.query(countQuery, [categoryId]);
    const totalBooks = parseInt(countResult.rows[0].count);

    res.status(200).json({
      categoryName,
      data: rows,
      total: totalBooks,
      currentPage: page,
      totalPages: Math.ceil(totalBooks / limit),
    });

  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "Error fetching books by category" });
  }
};

const getBookById = async (req, res) => {
  try {
    const bookId = parseInt(req.params.id);

    // Get book details
    const bookQuery = `
      SELECT 
        books.id, 
        books.book_name, 
        books.cover_image_url, 
        books.price, 
        books.discount_price,
        books.discount_percentage,
        books.isbn,
        books.language,
        books.num_pages,
        books.edition,
        books.rating,
        books.num_reviews,
        books.availability,
        books.description
      FROM books
      WHERE books.id = $1
    `;
    
    const bookResult = await pool.query(bookQuery, [bookId]);

    if (bookResult.rows.length === 0) {
      return res.status(404).json({ error: "Book not found" });
    }

    const book = bookResult.rows[0];

    // Get authors
    const authorsQuery = `
      SELECT authors.author_id, authors.name, authors.photo_url
      FROM authors
      JOIN book_author ON authors.author_id = book_author.author_id
      WHERE book_author.book_id = $1
    `;
    const authorsResult = await pool.query(authorsQuery, [bookId]);

    // Get publications
    const publicationsQuery = `
      SELECT publications.publication_id, publications.title, publications.cover_image_url
      FROM publications
      WHERE publications.publication_id = (
        SELECT publication_id FROM books WHERE id = $1
      )
    `;
    const publicationsResult = await pool.query(publicationsQuery, [bookId]);

    // Get categories
    const categoriesQuery = `
      SELECT categories.category_id, categories.category_name
      FROM categories
      JOIN book_category ON categories.category_id = book_category.category_id
      WHERE book_category.book_id = $1
    `;
    const categoriesResult = await pool.query(categoriesQuery, [bookId]);

    // Combine all data
    const response = {
      ...book,
      authors: authorsResult.rows,
      author: authorsResult.rows.length > 0 ? authorsResult.rows[0].name : null,
      publications: publicationsResult.rows,
      categories: categoriesResult.rows
    };

    res.status(200).json(response);

  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "Error fetching book" });
  }
};

const getBestsellers = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 20;

    // Query to get books ordered by number of sales
    // Count how many times each book appears in order_items (via book_copy)
    const query = `
      SELECT 
        b.id, 
        b.book_name, 
        b.cover_image_url, 
        b.price, 
        b.discount_price,
        b.discount_percentage,
        MIN(a.name) AS author,
        COUNT(oi.order_item_id) AS sales_count
      FROM books b
      LEFT JOIN book_copy bc ON b.id = bc.book_id
      LEFT JOIN order_item oi ON bc.copy_id = oi.copy_id
      LEFT JOIN book_author ba ON b.id = ba.book_id
      LEFT JOIN authors a ON ba.author_id = a.author_id
      GROUP BY b.id, b.book_name, b.cover_image_url, b.price, b.discount_price, b.discount_percentage
      ORDER BY sales_count DESC, b.id ASC
      LIMIT $1
    `;
    
    const { rows } = await pool.query(query, [limit]);

    res.status(200).json({
      data: rows,
      total: rows.length
    });

  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "Error fetching bestsellers" });
  }
};

module.exports = {
    getBooks,
    searchBooks,
    getBooksByAuthor,
    getBooksByPublication,
    getBooksByCategory,
    getBookById,
    getBestsellers
}
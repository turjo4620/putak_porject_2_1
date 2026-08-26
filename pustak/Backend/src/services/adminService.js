const pool = require('../config/db');

class AdminService {
  // ============= DASHBOARD STATS =============
  async getDashboardStats() {
    const queries = [
      pool.query('SELECT COUNT(*) as total FROM books'),
      pool.query('SELECT COUNT(*) as total FROM users WHERE status = $1', ['Active']),
      pool.query('SELECT COUNT(*) as total FROM authors'),
      pool.query('SELECT COUNT(*) as total FROM orders'),
      pool.query('SELECT COUNT(*) as total FROM reviews'),
      pool.query('SELECT SUM(total_amount) as revenue FROM orders WHERE status = $1', ['Delivered']),
      pool.query(`SELECT COUNT(*) as pending FROM orders WHERE status = 'Pending'`),
      pool.query(`
        SELECT COUNT(*) as low_stock FROM (
          SELECT book_id, COUNT(*) FILTER (WHERE status = 'in_stock') as stock
          FROM book_copy
          GROUP BY book_id
          HAVING COUNT(*) FILTER (WHERE status = 'in_stock') < 10
            AND COUNT(*) FILTER (WHERE status = 'in_stock') > 0
        ) sub
      `),
      pool.query(`
        SELECT COUNT(*) as out_of_stock FROM (
          SELECT b.id
          FROM books b
          LEFT JOIN book_copy bc ON b.id = bc.book_id AND bc.status = 'in_stock'
          GROUP BY b.id
          HAVING COUNT(bc.copy_id) = 0
        ) sub
      `)
    ];

    const results = await Promise.all(queries);

    return {
      totalBooks:      parseInt(results[0].rows[0].total),
      totalUsers:      parseInt(results[1].rows[0].total),
      totalAuthors:    parseInt(results[2].rows[0].total),
      totalOrders:     parseInt(results[3].rows[0].total),
      totalReviews:    parseInt(results[4].rows[0].total),
      totalRevenue:    parseFloat(results[5].rows[0].revenue || 0),
      pendingOrders:   parseInt(results[6].rows[0].pending),
      lowStockBooks:   parseInt(results[7].rows[0].low_stock),
      outOfStockBooks: parseInt(results[8].rows[0].out_of_stock)
    };
  }

  async getRecentActivities(limit = 10) {
    const result = await pool.query(`
      SELECT 
        'order' as type,
        order_id as id,
        order_number as reference,
        status,
        order_date as created_at,
        user_id
      FROM orders
      ORDER BY order_date DESC
      LIMIT $1
    `, [limit]);
    return result.rows;
  }

  // ============= BOOK MANAGEMENT =============
  async getAllBooks(page = 1, limit = 20, filters = {}) {
    const offset = (page - 1) * limit;
    let whereConditions = [];
    let queryParams = [];
    let paramIndex = 1;

    if (filters.search) {
      whereConditions.push(`(b.book_name ILIKE $${paramIndex} OR b.isbn ILIKE $${paramIndex})`);
      queryParams.push(`%${filters.search}%`);
      paramIndex++;
    }
    if (filters.category_id) {
      whereConditions.push(`bc.category_id = $${paramIndex}`);
      queryParams.push(filters.category_id);
      paramIndex++;
    }
    if (filters.availability) {
      whereConditions.push(`b.availability = $${paramIndex}`);
      queryParams.push(filters.availability);
      paramIndex++;
    }

    const whereClause = whereConditions.length > 0 ? `WHERE ${whereConditions.join(' AND ')}` : '';

    const query = `
      SELECT 
        b.*,
        COALESCE(
          json_agg(DISTINCT jsonb_build_object('author_id', a.author_id, 'name', a.name))
          FILTER (WHERE a.author_id IS NOT NULL), '[]'
        ) as authors,
        COALESCE(
          json_agg(DISTINCT jsonb_build_object('category_id', c.category_id, 'category_name', c.category_name))
          FILTER (WHERE c.category_id IS NOT NULL), '[]'
        ) as categories,
        COUNT(cop.copy_id) FILTER (WHERE cop.status = 'in_stock') as total_stock
      FROM books b
      LEFT JOIN book_author ba ON b.id = ba.book_id
      LEFT JOIN authors a ON ba.author_id = a.author_id
      LEFT JOIN book_category bc ON b.id = bc.book_id
      LEFT JOIN categories c ON bc.category_id = c.category_id
      LEFT JOIN book_copy cop ON b.id = cop.book_id
      ${whereClause}
      GROUP BY b.id
      ORDER BY b.id DESC
      LIMIT $${paramIndex} OFFSET $${paramIndex + 1}
    `;
    queryParams.push(limit, offset);

    const countQuery = `
      SELECT COUNT(DISTINCT b.id) as total
      FROM books b
      LEFT JOIN book_category bc ON b.id = bc.book_id
      ${whereClause}
    `;

    const [booksResult, countResult] = await Promise.all([
      pool.query(query, queryParams),
      pool.query(countQuery, queryParams.slice(0, -2))
    ]);

    return {
      books:      booksResult.rows,
      total:      parseInt(countResult.rows[0].total),
      page,
      totalPages: Math.ceil(countResult.rows[0].total / limit)
    };
  }

  async getBookById(bookId) {
    const result = await pool.query(`
      SELECT 
        b.*,
        COALESCE(
          json_agg(DISTINCT jsonb_build_object('author_id', a.author_id, 'name', a.name, 'bio', a.bio, 'photo_url', a.photo_url))
          FILTER (WHERE a.author_id IS NOT NULL), '[]'
        ) as authors,
        COALESCE(
          json_agg(DISTINCT jsonb_build_object('publication_id', p.publication_id, 'title', p.title))
          FILTER (WHERE p.publication_id IS NOT NULL), '[]'
        ) as publications,
        COALESCE(
          json_agg(DISTINCT jsonb_build_object('category_id', c.category_id, 'category_name', c.category_name))
          FILTER (WHERE c.category_id IS NOT NULL), '[]'
        ) as categories,
        COUNT(cop.copy_id) FILTER (WHERE cop.status = 'in_stock') as total_stock
      FROM books b
      LEFT JOIN book_author ba ON b.id = ba.book_id
      LEFT JOIN authors a ON ba.author_id = a.author_id
      LEFT JOIN book_publication_create bpc ON b.id = bpc.book_id
      LEFT JOIN publications p ON bpc.publication_id = p.publication_id
      LEFT JOIN book_category bc ON b.id = bc.book_id
      LEFT JOIN categories c ON bc.category_id = c.category_id
      LEFT JOIN book_copy cop ON b.id = cop.book_id
      WHERE b.id = $1
      GROUP BY b.id
    `, [bookId]);
    return result.rows[0];
  }

  async createBook(bookData) {
    const client = await pool.connect();
    try {
      await client.query('BEGIN');

      const bookResult = await client.query(`
        INSERT INTO books (
          id, book_name, cover_image_url, isbn, language,
          num_pages, edition, price, discount_price,
          availability, description
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
        RETURNING *
      `, [
        bookData.id,
        bookData.book_name,
        bookData.cover_image_url || null,
        bookData.isbn || null,
        bookData.language || 'Bengali',
        bookData.num_pages || null,
        bookData.edition || null,
        bookData.price,
        bookData.discount_price || null,
        bookData.availability || 'In Stock',
        bookData.description || null
      ]);
      const book = bookResult.rows[0];

      if (bookData.author_ids && bookData.author_ids.length > 0) {
        for (const authorId of bookData.author_ids) {
          await client.query(
            'INSERT INTO book_author (book_id, author_id) VALUES ($1, $2)',
            [book.id, authorId]
          );
        }
      }

      if (bookData.publication_ids && bookData.publication_ids.length > 0) {
        for (const publicationId of bookData.publication_ids) {
          await client.query(
            'INSERT INTO book_publication_create (book_id, publication_id) VALUES ($1, $2)',
            [book.id, publicationId]
          );
        }
      }

      if (bookData.category_ids && bookData.category_ids.length > 0) {
        for (const categoryId of bookData.category_ids) {
          await client.query(
            'INSERT INTO book_category (book_id, category_id) VALUES ($1, $2)',
            [book.id, categoryId]
          );
        }
      }

      // Create book_copy rows for stock
      if (bookData.stock_quantity && bookData.stock_quantity > 0) {
        for (let i = 0; i < bookData.stock_quantity; i++) {
          await client.query(
            `INSERT INTO book_copy (book_id, status, condition) VALUES ($1, 'in_stock', 'new')`,
            [book.id]
          );
        }
      }

      await client.query('COMMIT');
      return book;
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  async updateBook(bookId, bookData) {
    const client = await pool.connect();
    try {
      await client.query('BEGIN');

      const updateFields = [];
      const updateValues = [];
      let paramIndex = 1;

      const allowedFields = [
        'book_name', 'cover_image_url', 'isbn', 'language',
        'num_pages', 'edition', 'price', 'discount_price',
        'availability', 'description'
      ];

      allowedFields.forEach(field => {
        if (bookData[field] !== undefined) {
          updateFields.push(`${field} = $${paramIndex}`);
          updateValues.push(bookData[field]);
          paramIndex++;
        }
      });

      if (updateFields.length > 0) {
        updateValues.push(bookId);
        await client.query(`
          UPDATE books SET ${updateFields.join(', ')}
          WHERE id = $${paramIndex}
          RETURNING *
        `, updateValues);
      }

      if (bookData.author_ids) {
        await client.query('DELETE FROM book_author WHERE book_id = $1', [bookId]);
        for (const authorId of bookData.author_ids) {
          await client.query('INSERT INTO book_author (book_id, author_id) VALUES ($1, $2)', [bookId, authorId]);
        }
      }

      if (bookData.publication_ids) {
        await client.query('DELETE FROM book_publication_create WHERE book_id = $1', [bookId]);
        for (const publicationId of bookData.publication_ids) {
          await client.query('INSERT INTO book_publication_create (book_id, publication_id) VALUES ($1, $2)', [bookId, publicationId]);
        }
      }

      if (bookData.category_ids) {
        await client.query('DELETE FROM book_category WHERE book_id = $1', [bookId]);
        for (const categoryId of bookData.category_ids) {
          await client.query('INSERT INTO book_category (book_id, category_id) VALUES ($1, $2)', [bookId, categoryId]);
        }
      }

      if (bookData.stock_quantity !== undefined) {
        await this.updateBookStock(bookId, parseInt(bookData.stock_quantity));
      }

      await client.query('COMMIT');
      return await this.getBookById(bookId);
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  async deleteBook(bookId) {
    await pool.query('DELETE FROM books WHERE id = $1', [bookId]);
  }

  async updateBookStock(bookId, quantity) {
    const client = await pool.connect();
    try {
      await client.query('BEGIN');

      const currentRes = await client.query(
        `SELECT COUNT(*)::int as current FROM book_copy WHERE book_id = $1 AND status = 'in_stock'`,
        [bookId]
      );
      const current = currentRes.rows[0].current;

      if (quantity > current) {
        for (let i = 0; i < quantity - current; i++) {
          await client.query(
            `INSERT INTO book_copy (book_id, status, condition) VALUES ($1, 'in_stock', 'new')`,
            [bookId]
          );
        }
      } else if (quantity < current) {
        await client.query(
          `UPDATE book_copy SET status = 'unavailable'
           WHERE copy_id IN (
             SELECT copy_id FROM book_copy
             WHERE book_id = $1 AND status = 'in_stock'
             ORDER BY copy_id DESC
             LIMIT $2
           )`,
          [bookId, current - quantity]
        );
      }

      await client.query('COMMIT');
      return { book_id: bookId, available_stock: quantity };
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  // ============= USER MANAGEMENT =============
  async getAllUsers(page = 1, limit = 20, filters = {}) {
    const offset = (page - 1) * limit;
    let whereConditions = ['1=1'];
    let queryParams = [];
    let paramIndex = 1;

    if (filters.search) {
      whereConditions.push(`(name ILIKE $${paramIndex} OR email ILIKE $${paramIndex})`);
      queryParams.push(`%${filters.search}%`);
      paramIndex++;
    }
    if (filters.status) {
      whereConditions.push(`status = $${paramIndex}`);
      queryParams.push(filters.status);
      paramIndex++;
    }

    const whereClause = whereConditions.join(' AND ');
    const query = `
      SELECT 
        user_id, name, email, phone_number, status, last_login,
        (SELECT COUNT(*) FROM orders WHERE user_id = users.user_id) as total_orders,
        (SELECT COUNT(*) FROM reviews WHERE user_id = users.user_id) as total_reviews
      FROM users
      WHERE ${whereClause}
      ORDER BY user_id DESC
      LIMIT $${paramIndex} OFFSET $${paramIndex + 1}
    `;
    queryParams.push(limit, offset);

    const [usersResult, countResult] = await Promise.all([
      pool.query(query, queryParams),
      pool.query(`SELECT COUNT(*) as total FROM users WHERE ${whereClause}`, queryParams.slice(0, -2))
    ]);

    return {
      users:      usersResult.rows,
      total:      parseInt(countResult.rows[0].total),
      page,
      totalPages: Math.ceil(countResult.rows[0].total / limit)
    };
  }

  async getUserDetails(userId) {
    const result = await pool.query(`
      SELECT 
        u.*,
        (SELECT COUNT(*) FROM orders WHERE user_id = u.user_id) as total_orders,
        (SELECT COUNT(*) FROM reviews WHERE user_id = u.user_id) as total_reviews,
        (SELECT SUM(total_amount) FROM orders WHERE user_id = u.user_id AND status = 'Delivered') as total_spent
      FROM users u
      WHERE u.user_id = $1
    `, [userId]);

    if (result.rows.length === 0) throw new Error('User not found');
    return result.rows[0];
  }

  async updateUserStatus(userId, status) {
    const result = await pool.query(
      `UPDATE users SET status = $1 WHERE user_id = $2 RETURNING *`,
      [status, userId]
    );
    return result.rows[0];
  }

  // ============= ORDER MANAGEMENT =============
  async getAllOrders(page = 1, limit = 20, filters = {}) {
    const offset = (page - 1) * limit;
    let whereConditions = ['1=1'];
    let queryParams = [];
    let paramIndex = 1;

    if (filters.status) {
      whereConditions.push(`o.status = $${paramIndex}`);
      queryParams.push(filters.status);
      paramIndex++;
    }
    if (filters.search) {
      whereConditions.push(`(o.order_number ILIKE $${paramIndex} OR u.name ILIKE $${paramIndex})`);
      queryParams.push(`%${filters.search}%`);
      paramIndex++;
    }

    const whereClause = whereConditions.join(' AND ');
    const query = `
      SELECT 
        o.*,
        u.name as user_name,
        u.email as user_email,
        (SELECT COUNT(*) FROM order_item WHERE order_id = o.order_id) as item_count
      FROM orders o
      JOIN users u ON o.user_id = u.user_id
      WHERE ${whereClause}
      ORDER BY o.order_date DESC
      LIMIT $${paramIndex} OFFSET $${paramIndex + 1}
    `;
    queryParams.push(limit, offset);

    const [ordersResult, countResult] = await Promise.all([
      pool.query(query, queryParams),
      pool.query(
        `SELECT COUNT(*) as total FROM orders o JOIN users u ON o.user_id = u.user_id WHERE ${whereClause}`,
        queryParams.slice(0, -2)
      )
    ]);

    return {
      orders:     ordersResult.rows,
      total:      parseInt(countResult.rows[0].total),
      page,
      totalPages: Math.ceil(countResult.rows[0].total / limit)
    };
  }

  async getOrderDetails(orderId) {
    const orderResult = await pool.query(`
      SELECT 
        o.*,
        u.name as user_name,
        u.email as user_email,
        u.phone_number as user_phone,
        a.street_address,
        a.city,
        a.postal_code,
        a.country
      FROM orders o
      JOIN users u ON o.user_id = u.user_id
      LEFT JOIN addresses a ON o.address_id = a.address_id
      WHERE o.order_id = $1
    `, [orderId]);

    if (orderResult.rows.length === 0) throw new Error('Order not found');

    const itemsResult = await pool.query(`
      SELECT 
        oi.*,
        b.book_name,
        b.cover_image_url
      FROM order_item oi
      JOIN book_copy bc ON oi.copy_id = bc.copy_id
      JOIN books b ON bc.book_id = b.id
      WHERE oi.order_id = $1
    `, [orderId]);

    const deliveryResult = await pool.query(`SELECT * FROM deliveries WHERE order_id = $1`, [orderId]);
    const paymentResult  = await pool.query(`SELECT * FROM payments WHERE order_id = $1`, [orderId]);

    return {
      order:    orderResult.rows[0],
      items:    itemsResult.rows,
      delivery: deliveryResult.rows[0] || null,
      payment:  paymentResult.rows[0] || null
    };
  }

  async updateOrderStatus(orderId, status) {
    const result = await pool.query(
      `UPDATE orders SET status = $1, updated_at = CURRENT_TIMESTAMP WHERE order_id = $2 RETURNING *`,
      [status, orderId]
    );
    return result.rows[0];
  }

  // ============= REVIEW MANAGEMENT =============
  async getAllReviews(page = 1, limit = 20, filters = {}) {
    const offset = (page - 1) * limit;
    let whereConditions = ['1=1'];
    let queryParams = [];
    let paramIndex = 1;

    if (filters.book_id) {
      whereConditions.push(`r.book_id = $${paramIndex}`);
      queryParams.push(filters.book_id);
      paramIndex++;
    }
    if (filters.is_hidden !== undefined) {
      whereConditions.push(`r.is_hidden = $${paramIndex}`);
      queryParams.push(filters.is_hidden);
      paramIndex++;
    }

    const whereClause = whereConditions.join(' AND ');
    const query = `
      SELECT r.*, u.name as user_name, b.book_name
      FROM reviews r
      JOIN users u ON r.user_id = u.user_id
      JOIN books b ON r.book_id = b.id
      WHERE ${whereClause}
      ORDER BY r.created_at DESC
      LIMIT $${paramIndex} OFFSET $${paramIndex + 1}
    `;
    queryParams.push(limit, offset);

    const [reviewsResult, countResult] = await Promise.all([
      pool.query(query, queryParams),
      pool.query(`SELECT COUNT(*) as total FROM reviews r WHERE ${whereClause}`, queryParams.slice(0, -2))
    ]);

    return {
      reviews:    reviewsResult.rows,
      total:      parseInt(countResult.rows[0].total),
      page,
      totalPages: Math.ceil(countResult.rows[0].total / limit)
    };
  }

  async toggleReviewVisibility(reviewId) {
    const result = await pool.query(
      `UPDATE reviews SET is_hidden = NOT is_hidden WHERE review_id = $1 RETURNING *`,
      [reviewId]
    );
    return result.rows[0];
  }

  async deleteReview(reviewId) {
    await pool.query('DELETE FROM reviews WHERE review_id = $1', [reviewId]);
  }

  // ============= ANALYTICS =============
  async getSalesAnalytics(startDate, endDate) {
    const result = await pool.query(`
      SELECT 
        DATE(order_date) as date,
        COUNT(*) as order_count,
        SUM(total_amount) as revenue
      FROM orders
      WHERE order_date BETWEEN $1 AND $2
        AND status NOT IN ('Cancelled', 'Returned')
      GROUP BY DATE(order_date)
      ORDER BY date DESC
    `, [startDate, endDate]);
    return result.rows;
  }

  async getBestSellingBooks(limit = 10) {
    const result = await pool.query(`
      SELECT 
        b.id,
        b.book_name,
        b.cover_image_url,
        b.price,
        COUNT(oi.order_item_id) as total_sold,
        SUM(oi.price_sold) as revenue
      FROM books b
      JOIN book_copy bc ON b.id = bc.book_id
      JOIN order_item oi ON bc.copy_id = oi.copy_id
      JOIN orders o ON oi.order_id = o.order_id
      WHERE o.status NOT IN ('Cancelled', 'Returned')
      GROUP BY b.id, b.book_name, b.cover_image_url, b.price
      ORDER BY total_sold DESC
      LIMIT $1
    `, [limit]);
    return result.rows;
  }

  async getPopularCategories() {
    const result = await pool.query(`
      SELECT 
        c.category_id,
        c.category_name,
        COUNT(DISTINCT bc.book_id) as book_count,
        COUNT(oi.order_item_id) as order_count
      FROM categories c
      LEFT JOIN book_category bc ON c.category_id = bc.category_id
      LEFT JOIN book_copy cop ON bc.book_id = cop.book_id
      LEFT JOIN order_item oi ON cop.copy_id = oi.copy_id
      GROUP BY c.category_id, c.category_name
      ORDER BY order_count DESC
      LIMIT 10
    `);
    return result.rows;
  }

  async getLowStockBooks() {
    const result = await pool.query(`
      SELECT 
        b.id,
        b.book_name,
        b.cover_image_url,
        COUNT(bc.copy_id) FILTER (WHERE bc.status = 'in_stock') as total_stock
      FROM books b
      JOIN book_copy bc ON b.id = bc.book_id
      GROUP BY b.id, b.book_name, b.cover_image_url
      HAVING COUNT(bc.copy_id) FILTER (WHERE bc.status = 'in_stock') < 10
         AND COUNT(bc.copy_id) FILTER (WHERE bc.status = 'in_stock') > 0
      ORDER BY total_stock ASC
    `);
    return result.rows;
  }

  async getOutOfStockBooks() {
    const result = await pool.query(`
      SELECT b.id, b.book_name, b.cover_image_url
      FROM books b
      LEFT JOIN book_copy bc ON b.id = bc.book_id AND bc.status = 'in_stock'
      GROUP BY b.id, b.book_name, b.cover_image_url
      HAVING COUNT(bc.copy_id) = 0
      ORDER BY b.book_name
    `);
    return result.rows;
  }
}

module.exports = new AdminService();

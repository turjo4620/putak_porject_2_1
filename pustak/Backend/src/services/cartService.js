// services/cartService.js
const pool = require('../config/db');

async function getOrCreateCart(userId) {
  const existing = await pool.query('SELECT * FROM cart WHERE user_id = $1', [userId]);
  if (existing.rows.length) return existing.rows[0];

  const created = await pool.query(
    'INSERT INTO cart (user_id) VALUES ($1) RETURNING *',
    [userId]
  );
  return created.rows[0];
}

// How many un-sold physical copies exist for a book right now.
async function getAvailableStock(bookId) {
  const res = await pool.query(
    `SELECT COUNT(*)::int AS count FROM book_copy WHERE book_id = $1 AND status = 'in_stock'`,
    [bookId]
  );
  return res.rows[0].count;
}

async function getCartWithItems(userId) {
  const cart = await getOrCreateCart(userId);
  const items = await pool.query(
    `SELECT ci.cart_item_id, ci.book_id, ci.quantity, ci.locked_price,
            b.book_name, b.cover_image_url, b.authors, b.price, b.discount_price
     FROM cart_item ci
     JOIN books b ON b.id = ci.book_id
     WHERE ci.cart_id = $1
     ORDER BY ci.cart_item_id`,
    [cart.cart_id]
  );
  return { cart, items: items.rows };
}

async function addItem(userId, bookId, quantity = 1) {
  const cart = await getOrCreateCart(userId);

  const bookRes = await pool.query(
    'SELECT id, price, discount_price FROM books WHERE id = $1',
    [bookId]
  );
  if (!bookRes.rows.length) {
    throw { status: 404, message: 'বই খুঁজে পাওয়া যায়নি' };
  }
  const book = bookRes.rows[0];
  const price = book.discount_price ?? book.price;

  const existingRes = await pool.query(
    'SELECT quantity FROM cart_item WHERE cart_id = $1 AND book_id = $2',
    [cart.cart_id, bookId]
  );
  const currentQty = existingRes.rows[0]?.quantity || 0;
  const desiredQty = currentQty + quantity;

  const stock = await getAvailableStock(bookId);
  if (desiredQty > stock) {
    throw {
      status: 409,
      message: stock > 0
        ? `দুঃখিত, এই মুহূর্তে মাত্র ${stock}টি কপি স্টকে আছে`
        : 'দুঃখিত, এই বইটি এখন স্টকে নেই',
    };
  }

  const result = await pool.query(
    `INSERT INTO cart_item (cart_id, book_id, quantity, locked_price)
     VALUES ($1, $2, $3, $4)
     ON CONFLICT (cart_id, book_id)
     DO UPDATE SET quantity = cart_item.quantity + EXCLUDED.quantity
     RETURNING *`,
    [cart.cart_id, bookId, quantity, price]
  );

  await pool.query(
    'UPDATE cart SET updated_at = CURRENT_TIMESTAMP WHERE cart_id = $1',
    [cart.cart_id]
  );

  return result.rows[0];
}

async function setItemQuantity(userId, cartItemId, quantity) {
  const cart = await getOrCreateCart(userId);

  if (quantity <= 0) {
    await pool.query(
      'DELETE FROM cart_item WHERE cart_item_id = $1 AND cart_id = $2',
      [cartItemId, cart.cart_id]
    );
    return null;
  }

  const itemRes = await pool.query(
    'SELECT book_id FROM cart_item WHERE cart_item_id = $1 AND cart_id = $2',
    [cartItemId, cart.cart_id]
  );
  if (!itemRes.rows.length) {
    throw { status: 404, message: 'কার্ট আইটেম খুঁজে পাওয়া যায়নি' };
  }
  const bookId = itemRes.rows[0].book_id;

  const stock = await getAvailableStock(bookId);
  if (quantity > stock) {
    throw {
      status: 409,
      message: `দুঃখিত, এই মুহূর্তে মাত্র ${stock}টি কপি স্টকে আছে`,
    };
  }

  const result = await pool.query(
    `UPDATE cart_item SET quantity = $1
     WHERE cart_item_id = $2 AND cart_id = $3
     RETURNING *`,
    [quantity, cartItemId, cart.cart_id]
  );

  return result.rows[0];
}

async function removeItem(userId, cartItemId) {
  const cart = await getOrCreateCart(userId);
  await pool.query(
    'DELETE FROM cart_item WHERE cart_item_id = $1 AND cart_id = $2',
    [cartItemId, cart.cart_id]
  );
}

async function clearCart(userId) {
  const cart = await getOrCreateCart(userId);
  await pool.query('DELETE FROM cart_item WHERE cart_id = $1', [cart.cart_id]);
}

module.exports = {
  getOrCreateCart,
  getCartWithItems,
  getAvailableStock,
  addItem,
  setItemQuantity,
  removeItem,
  clearCart,
};

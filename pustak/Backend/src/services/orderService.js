// services/orderService.js
//
// IMPORTANT: your ORDER_ITEM table references a specific BOOK_COPY
// (copy_id), where each BOOK_COPY row is one serialized physical unit.
// So placing an order for 3x the same book means reserving 3 separate
// BOOK_COPY rows and inserting 3 order_item rows (one per unit).
//
// This requires book_copy to actually have 'in_stock' rows for a book
// before it can be ordered — see sql/003_seed_book_copies_optional.sql
// if you need test inventory.

const pool = require('../config/db');
const cartService = require('./cartService');

function generateOrderNumber() {
  return 'PB' + Date.now().toString(36).toUpperCase() + Math.floor(Math.random() * 1000);
}

async function placeOrderFromCart(userId, addressId) {
  const { cart, items } = await cartService.getCartWithItems(userId);
  if (!items.length) {
    throw { status: 400, message: 'কার্ট খালি, অর্ডার দেওয়া যাবে না' };
  }

  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    // Step 1: for every cart line, lock and reserve that many physical
    // copies. FOR UPDATE SKIP LOCKED means two concurrent checkouts can't
    // grab the same copy. If any book is short on stock, the whole order
    // fails (nothing is partially reserved).
    const reservations = [];
    for (const it of items) {
      const copiesRes = await client.query(
        `SELECT copy_id FROM book_copy
         WHERE book_id = $1 AND status = 'in_stock'
         ORDER BY copy_id
         LIMIT $2
         FOR UPDATE SKIP LOCKED`,
        [it.book_id, it.quantity]
      );

      if (copiesRes.rows.length < it.quantity) {
        throw {
          status: 409,
          message: `"${it.book_name}" বইয়ের পর্যাপ্ত স্টক নেই (আছে ${copiesRes.rows.length}, দরকার ${it.quantity})`,
        };
      }

      // Use current price from book (discount_price if available, otherwise regular price)
      const pricePerUnit = it.discount_price ?? it.price;
      
      reservations.push({
        copyIds: copiesRes.rows.map((r) => r.copy_id),
        pricePerUnit: pricePerUnit,
      });
    }

    // Step 2: create the order
    const totalAmount = items.reduce(
      (sum, it) => sum + Number(it.discount_price ?? it.price) * it.quantity,
      0
    );
    const orderNumber = generateOrderNumber();

    const orderRes = await client.query(
      `INSERT INTO orders (user_id, address_id, order_number, total_amount, status)
       VALUES ($1, $2, $3, $4, 'Pending')
       RETURNING *`,
      [userId, addressId || null, orderNumber, totalAmount]
    );
    const order = orderRes.rows[0];

    // Step 3: one order_item per physical copy, mark each copy sold
    for (const r of reservations) {
      for (const copyId of r.copyIds) {
        const price = r.pricePerUnit;
        await client.query(
          `INSERT INTO order_items (order_id, copy_id, unit_price, subtotal)
           VALUES ($1, $2, $3, $4)`,
          [order.order_id, copyId, price, price]
        );
        await client.query(
          `UPDATE book_copy SET status = 'sold' WHERE copy_id = $1`,
          [copyId]
        );
      }
    }

    // Step 4: empty the cart
    await client.query('DELETE FROM cart_item WHERE cart_id = $1', [cart.cart_id]);

    await client.query('COMMIT');
    return order;
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
}

async function getOrderById(userId, orderId) {
  const orderRes = await pool.query(
    'SELECT * FROM orders WHERE order_id = $1 AND user_id = $2',
    [orderId, userId]
  );
  if (!orderRes.rows.length) {
    throw { status: 404, message: 'অর্ডার খুঁজে পাওয়া যায়নি' };
  }

  const itemsRes = await pool.query(
    `SELECT b.id AS book_id, b.book_name, b.cover_image_url,
            MIN(a.name) AS author,
            COUNT(*)::int AS quantity,
            SUM(oi.subtotal)::numeric(10,2) AS line_total
     FROM order_items oi
     JOIN book_copy bc ON bc.copy_id = oi.copy_id
     JOIN books b ON b.id = bc.book_id
     LEFT JOIN book_author ba ON b.id = ba.book_id
     LEFT JOIN authors a ON ba.author_id = a.author_id
     WHERE oi.order_id = $1
     GROUP BY b.id, b.book_name, b.cover_image_url`,
    [orderId]
  );

  return { order: orderRes.rows[0], items: itemsRes.rows };
}

async function listOrders(userId) {
  const res = await pool.query(
    'SELECT * FROM orders WHERE user_id = $1 ORDER BY order_date DESC',
    [userId]
  );
  return res.rows;
}

// Returns delivery / tracking info for a single order.
// If no delivery row exists yet, returns null so the frontend can show a
// "not dispatched yet" state without crashing.
async function getTrackingInfo(userId, orderId) {
  // verify ownership first
  const orderRes = await pool.query(
    'SELECT order_id, order_number, status FROM orders WHERE order_id = $1 AND user_id = $2',
    [orderId, userId]
  );
  if (!orderRes.rows.length) {
    throw { status: 404, message: 'অর্ডার খুঁজে পাওয়া যায়নি' };
  }

  const deliveryRes = await pool.query(
    `SELECT delivery_id, tracking_no, delivered_via,
            dispatch_date, est_date, delivered_at, status
     FROM deliveries
     WHERE order_id = $1`,
    [orderId]
  );

  return {
    order: orderRes.rows[0],
    delivery: deliveryRes.rows[0] || null,
  };
}

module.exports = { placeOrderFromCart, getOrderById, listOrders, getTrackingInfo };

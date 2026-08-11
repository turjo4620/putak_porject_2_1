// services/paymentService.js
const pool = require('../config/db');

async function createPayment(userId, orderId, data) {
  const orderRes = await pool.query(
    'SELECT * FROM orders WHERE order_id = $1 AND user_id = $2',
    [orderId, userId]
  );
  if (!orderRes.rows.length) {
    throw { status: 404, message: 'অর্ডার খুঁজে পাওয়া যায়নি' };
  }
  const order = orderRes.rows[0];

  const {
    method,          // 'card' | 'mfs' | 'cod'
    mobileNo,
    providerName,
    cardLast4,
    cardBrand,
    bankName,
    collectedBy,
  } = data;

  if (!['card', 'mfs', 'cod'].includes(method)) {
    throw { status: 400, message: 'অবৈধ পেমেন্ট পদ্ধতি' };
  }

  const status = method === 'cod' ? 'pending' : 'completed';

  const result = await pool.query(
    `INSERT INTO payment (
       order_id, amount, method, payment_status,
       sender_mobile_no, provider_name,
       card_last4, card_brand, bank_name,
       collected_by, collection_date
     ) VALUES (
       $1, $2, $3, $4,
       $5, $6,
       $7, $8, $9,
       $10, CASE WHEN $3 = 'cod' THEN CURRENT_TIMESTAMP ELSE NULL END
     )
     RETURNING *`,
    [
      orderId,
      order.total_amount,
      method,
      status,
      mobileNo || null,
      providerName || null,
      cardLast4 || null,
      cardBrand || null,
      bankName || null,
      collectedBy || null,
    ]
  );

  await pool.query(
    `UPDATE orders SET status = $1 WHERE order_id = $2`,
    [method === 'cod' ? 'Confirmed' : 'Paid', orderId]
  );

  return result.rows[0];
}

module.exports = { createPayment };

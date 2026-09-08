const pool = require('../config/db');

/**
 * Validate a coupon code against an order subtotal.
 * Returns { coupon, discount_amount } on success.
 * Throws { status, message } on any validation failure.
 *
 * Columns used (all real, no extras assumed):
 *   coupon_id, code, description, discount_value, discount_type,
 *   status (varchar 'Active'/'Inactive'),
 *   usage_limit, times_used,
 *   min_order_amount, max_order_amount,
 *   start_date, end_date
 */
async function validateCoupon(code, orderSubtotal) {
  const result = await pool.query(
    `SELECT * FROM coupons WHERE UPPER(code) = UPPER($1)`,
    [code.trim()]
  );

  if (!result.rows.length) {
    throw { status: 404, message: 'কুপন কোডটি সঠিক নয়' };
  }

  const coupon = result.rows[0];

  // ── Active / Inactive ────────────────────────────────────────
  if (coupon.status !== 'Active') {
    throw { status: 400, message: 'এই কুপনটি আর সক্রিয় নেই' };
  }

  // ── Date window ──────────────────────────────────────────────
  const now = new Date();
  if (coupon.start_date && new Date(coupon.start_date) > now) {
    throw { status: 400, message: 'এই কুপনের মেয়াদ এখনও শুরু হয়নি' };
  }
  if (coupon.end_date && new Date(coupon.end_date) < now) {
    throw { status: 400, message: 'এই কুপনের মেয়াদ শেষ হয়ে গেছে' };
  }

  // ── Global usage limit ────────────────────────────────────────
  if (
    coupon.usage_limit !== null &&
    coupon.usage_limit !== undefined &&
    Number(coupon.times_used) >= Number(coupon.usage_limit)
  ) {
    throw { status: 400, message: 'এই কুপনের ব্যবহার সীমা শেষ হয়ে গেছে' };
  }

  // ── Min order ─────────────────────────────────────────────────
  if (
    coupon.min_order_amount !== null &&
    coupon.min_order_amount !== undefined &&
    orderSubtotal < Number(coupon.min_order_amount)
  ) {
    throw {
      status: 400,
      message: `এই কুপন ব্যবহারের জন্য ন্যূনতম অর্ডার ৳${coupon.min_order_amount} হতে হবে`,
    };
  }

  // ── Max order ─────────────────────────────────────────────────
  if (
    coupon.max_order_amount !== null &&
    coupon.max_order_amount !== undefined &&
    orderSubtotal > Number(coupon.max_order_amount)
  ) {
    throw {
      status: 400,
      message: `এই কুপন সর্বোচ্চ ৳${coupon.max_order_amount} অর্ডারে প্রযোজ্য`,
    };
  }

  // ── Calculate discount ────────────────────────────────────────
  let discount;
  const discountType = (coupon.discount_type || 'flat').toLowerCase();

  if (discountType === 'percentage') {
    discount = (orderSubtotal * Number(coupon.discount_value)) / 100;
  } else {
    // flat amount
    discount = Number(coupon.discount_value);
  }

  // Never exceed the order subtotal
  discount = Math.min(discount, orderSubtotal);

  return {
    coupon,
    discount_amount: parseFloat(discount.toFixed(2)),
  };
}

/**
 * Increment times_used — call after a successful order placement.
 * Pass a pool client (inside a transaction) or the pool itself.
 */
async function incrementUsage(clientOrPool, couponId) {
  await clientOrPool.query(
    `UPDATE coupons
     SET times_used = COALESCE(times_used, 0) + 1
     WHERE coupon_id = $1`,
    [couponId]
  );
}

module.exports = { validateCoupon, incrementUsage };

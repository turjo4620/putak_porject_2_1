const pool = require('../config/db');

/**
 * Validate a coupon code against an order subtotal.
 * Returns the coupon row + calculated discount_amount on success.
 * Throws { status, message } on any validation failure.
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

  if (coupon.status !== 'Active') {
    throw { status: 400, message: 'এই কুপনটি আর সক্রিয় নেই' };
  }

  const now = new Date();
  if (coupon.start_date && new Date(coupon.start_date) > now) {
    throw { status: 400, message: 'এই কুপনের মেয়াদ এখনও শুরু হয়নি' };
  }
  if (coupon.end_date && new Date(coupon.end_date) < now) {
    throw { status: 400, message: 'এই কুপনের মেয়াদ শেষ হয়ে গেছে' };
  }

  if (coupon.usage_limit !== null && coupon.times_used >= coupon.usage_limit) {
    throw { status: 400, message: 'এই কুপনের ব্যবহার সীমা শেষ হয়ে গেছে' };
  }

  if (coupon.min_order_amount !== null && orderSubtotal < Number(coupon.min_order_amount)) {
    throw {
      status: 400,
      message: `এই কুপন ব্যবহারের জন্য ন্যূনতম অর্ডার ৳${coupon.min_order_amount} হতে হবে`,
    };
  }

  if (coupon.max_order_amount !== null && orderSubtotal > Number(coupon.max_order_amount)) {
    throw {
      status: 400,
      message: `এই কুপন সর্বোচ্চ ৳${coupon.max_order_amount} অর্ডারে প্রযোজ্য`,
    };
  }

  // Calculate discount
  const discount = Math.min(Number(coupon.discount_value), orderSubtotal);

  return {
    coupon,
    discount_amount: parseFloat(discount.toFixed(2)),
  };
}

/**
 * Increment usage counter — call inside the order transaction after commit.
 */
async function incrementUsage(client, couponId) {
  await client.query(
    `UPDATE coupons SET times_used = times_used + 1 WHERE coupon_id = $1`,
    [couponId]
  );
}

module.exports = { validateCoupon, incrementUsage };

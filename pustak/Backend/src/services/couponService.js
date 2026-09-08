const pool = require('../config/db');

/**
 * Validate a coupon code against an order subtotal (and optionally a userId
 * for per-user limit checking). Returns { coupon, discount_amount } on success.
 * Throws { status, message } on any validation failure.
 */
async function validateCoupon(code, orderSubtotal, userId = null) {
  const result = await pool.query(
    `SELECT * FROM coupons WHERE UPPER(code) = UPPER($1)`,
    [code.trim()]
  );

  if (!result.rows.length) {
    throw { status: 404, message: 'কুপন কোডটি সঠিক নয়' };
  }

  const coupon = result.rows[0];

  // ── Active flag ──────────────────────────────────────────────
  // Support both legacy `status` column and new `is_active` boolean
  const isActive = coupon.is_active !== undefined
    ? coupon.is_active
    : coupon.status === 'Active';

  if (!isActive) {
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
  const timesUsed = Number(coupon.times_used) || 0;
  if (coupon.usage_limit !== null && timesUsed >= Number(coupon.usage_limit)) {
    throw { status: 400, message: 'এই কুপনের ব্যবহার সীমা শেষ হয়ে গেছে' };
  }

  // ── Per-user limit ─────────────────────────────────────────────
  if (userId && coupon.per_user_limit) {
    const usageResult = await pool.query(
      `SELECT COUNT(*) AS cnt
       FROM orders
       WHERE user_id = $1 AND coupon_code = $2`,
      [userId, coupon.code]
    );
    const userUsage = Number(usageResult.rows[0]?.cnt) || 0;
    if (userUsage >= Number(coupon.per_user_limit)) {
      throw {
        status: 400,
        message: `এই কুপনটি আপনি সর্বোচ্চ ${coupon.per_user_limit} বার ব্যবহার করতে পারবেন`,
      };
    }
  }

  // ── Min order ─────────────────────────────────────────────────
  if (coupon.min_order_amount !== null && orderSubtotal < Number(coupon.min_order_amount)) {
    throw {
      status: 400,
      message: `এই কুপন ব্যবহারের জন্য ন্যূনতম অর্ডার ৳${coupon.min_order_amount} হতে হবে`,
    };
  }

  // ── Max order cap ─────────────────────────────────────────────
  if (coupon.max_order_amount !== null && orderSubtotal > Number(coupon.max_order_amount)) {
    throw {
      status: 400,
      message: `এই কুপন সর্বোচ্চ ৳${coupon.max_order_amount} অর্ডারে প্রযোজ্য`,
    };
  }

  // ── Calculate discount ────────────────────────────────────────
  let discount;
  const discountType = coupon.discount_type || 'flat';

  if (discountType === 'percentage') {
    discount = (orderSubtotal * Number(coupon.discount_value)) / 100;
    // Apply max_discount cap if set
    if (coupon.max_discount) {
      discount = Math.min(discount, Number(coupon.max_discount));
    }
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
 * Increment usage counter — call inside the order transaction after commit.
 */
async function incrementUsage(client, couponId) {
  await client.query(
    `UPDATE coupons SET times_used = COALESCE(times_used, 0) + 1 WHERE coupon_id = $1`,
    [couponId]
  );
}

module.exports = { validateCoupon, incrementUsage };

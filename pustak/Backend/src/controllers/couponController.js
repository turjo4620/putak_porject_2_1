const pool = require('../config/db');
const couponService = require('../services/couponService');

// ─────────────────────────────────────────────────────────────────────────────
// PUBLIC  POST /api/coupons/validate
// Used by CheckoutPage to verify a code before placing the order.
// ─────────────────────────────────────────────────────────────────────────────
const validateCoupon = async (req, res) => {
  try {
    const { code, orderSubtotal, userId } = req.body;

    if (!code) {
      return res.status(400).json({ success: false, message: 'কুপন কোড দিন' });
    }

    const { coupon, discount_amount } = await couponService.validateCoupon(
      code,
      Number(orderSubtotal) || 0,
      userId || null
    );

    return res.status(200).json({
      success: true,
      discount_amount,
      coupon: {
        coupon_id:      coupon.coupon_id,
        code:           coupon.code,
        description:    coupon.description,
        discount_value: coupon.discount_value,
        discount_type:  coupon.discount_type,
      },
    });
  } catch (err) {
    const status = err.status || 500;
    return res.status(status).json({ success: false, message: err.message || 'Server Error' });
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// ADMIN  GET /api/coupons/admin
// Returns all coupons with usage stats.
// ─────────────────────────────────────────────────────────────────────────────
const getAllCoupons = async (req, res) => {
  try {
    const { search, status } = req.query;

    let query = `
      SELECT
        coupon_id            AS id,
        code,
        description,
        discount_type,
        discount_value,
        max_discount,
        min_order_amount,
        max_order_amount,
        usage_limit,
        per_user_limit,
        times_used           AS usage_count,
        start_date,
        end_date,
        is_active,
        created_at
      FROM coupons
      WHERE 1=1
    `;
    const params = [];

    if (search) {
      params.push(`%${search}%`);
      query += ` AND (UPPER(code) LIKE UPPER($${params.length}) OR description ILIKE $${params.length})`;
    }

    if (status && status !== 'all') {
      if (status === 'active') {
        query += ` AND is_active = true AND (end_date IS NULL OR end_date >= NOW()) AND (start_date IS NULL OR start_date <= NOW())`;
      } else if (status === 'inactive') {
        query += ` AND is_active = false`;
      } else if (status === 'expired') {
        query += ` AND end_date IS NOT NULL AND end_date < NOW()`;
      }
    }

    query += ` ORDER BY created_at DESC`;

    const result = await pool.query(query, params);
    return res.json(result.rows);
  } catch (err) {
    console.error('getAllCoupons error:', err);
    return res.status(500).json({ message: 'Failed to fetch coupons' });
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// ADMIN  POST /api/coupons/admin
// Create a new coupon.
// ─────────────────────────────────────────────────────────────────────────────
const createCoupon = async (req, res) => {
  try {
    const {
      code, description,
      discount_type, discount_value, max_discount,
      min_order_amount, max_order_amount,
      usage_limit, per_user_limit,
      start_date, end_date,
      is_active,
    } = req.body;

    if (!code || !discount_value) {
      return res.status(400).json({ message: 'code and discount_value are required' });
    }

    // Check duplicate
    const dup = await pool.query(
      `SELECT coupon_id FROM coupons WHERE UPPER(code) = UPPER($1)`,
      [code.trim()]
    );
    if (dup.rows.length) {
      return res.status(409).json({ message: `Coupon code "${code.toUpperCase()}" already exists` });
    }

    const result = await pool.query(
      `INSERT INTO coupons
         (code, description, discount_type, discount_value, max_discount,
          min_order_amount, max_order_amount,
          usage_limit, per_user_limit, times_used,
          start_date, end_date, is_active)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,0,$10,$11,$12)
       RETURNING
         coupon_id AS id, code, description,
         discount_type, discount_value, max_discount,
         min_order_amount, max_order_amount,
         usage_limit, per_user_limit, times_used AS usage_count,
         start_date, end_date, is_active, created_at`,
      [
        code.trim().toUpperCase(),
        description    || null,
        discount_type  || 'flat',
        Number(discount_value),
        max_discount         ? Number(max_discount)         : null,
        min_order_amount     ? Number(min_order_amount)     : 0,
        max_order_amount     ? Number(max_order_amount)     : null,
        usage_limit          ? Number(usage_limit)          : null,
        per_user_limit       ? Number(per_user_limit)       : 1,
        start_date  || null,
        end_date    || null,
        is_active !== false,
      ]
    );

    return res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('createCoupon error:', err);
    return res.status(500).json({ message: err.message || 'Failed to create coupon' });
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// ADMIN  PUT /api/coupons/admin/:id
// Update an existing coupon.
// ─────────────────────────────────────────────────────────────────────────────
const updateCoupon = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      code, description,
      discount_type, discount_value, max_discount,
      min_order_amount, max_order_amount,
      usage_limit, per_user_limit,
      start_date, end_date,
      is_active,
    } = req.body;

    // Check code uniqueness (excluding this record)
    if (code) {
      const dup = await pool.query(
        `SELECT coupon_id FROM coupons WHERE UPPER(code) = UPPER($1) AND coupon_id != $2`,
        [code.trim(), id]
      );
      if (dup.rows.length) {
        return res.status(409).json({ message: `Coupon code "${code.toUpperCase()}" already exists` });
      }
    }

    const result = await pool.query(
      `UPDATE coupons SET
         code              = COALESCE(UPPER($1), code),
         description       = $2,
         discount_type     = COALESCE($3, discount_type),
         discount_value    = COALESCE($4, discount_value),
         max_discount      = $5,
         min_order_amount  = COALESCE($6, min_order_amount),
         max_order_amount  = $7,
         usage_limit       = $8,
         per_user_limit    = COALESCE($9, per_user_limit),
         start_date        = $10,
         end_date          = $11,
         is_active         = COALESCE($12, is_active)
       WHERE coupon_id = $13
       RETURNING
         coupon_id AS id, code, description,
         discount_type, discount_value, max_discount,
         min_order_amount, max_order_amount,
         usage_limit, per_user_limit, times_used AS usage_count,
         start_date, end_date, is_active, created_at`,
      [
        code             ? code.trim().toUpperCase() : null,
        description      ?? null,
        discount_type    || null,
        discount_value   ? Number(discount_value)    : null,
        max_discount     ? Number(max_discount)       : null,
        min_order_amount ? Number(min_order_amount)   : null,
        max_order_amount ? Number(max_order_amount)   : null,
        usage_limit      ? Number(usage_limit)        : null,
        per_user_limit   ? Number(per_user_limit)     : null,
        start_date       || null,
        end_date         || null,
        is_active !== undefined ? is_active : null,
        id,
      ]
    );

    if (!result.rows.length) {
      return res.status(404).json({ message: 'Coupon not found' });
    }

    return res.json(result.rows[0]);
  } catch (err) {
    console.error('updateCoupon error:', err);
    return res.status(500).json({ message: err.message || 'Failed to update coupon' });
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// ADMIN  DELETE /api/coupons/admin/:id
// Hard-delete a coupon.
// ─────────────────────────────────────────────────────────────────────────────
const deleteCoupon = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      `DELETE FROM coupons WHERE coupon_id = $1 RETURNING coupon_id`,
      [id]
    );
    if (!result.rows.length) {
      return res.status(404).json({ message: 'Coupon not found' });
    }
    return res.status(204).send();
  } catch (err) {
    console.error('deleteCoupon error:', err);
    return res.status(500).json({ message: 'Failed to delete coupon' });
  }
};

module.exports = { validateCoupon, getAllCoupons, createCoupon, updateCoupon, deleteCoupon };

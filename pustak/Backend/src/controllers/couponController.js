const couponService = require('../services/couponService');

/**
 * POST /api/coupons/validate
 * Body: { code, orderSubtotal }
 * Returns: { valid: true, discount_amount, coupon: { code, description, discount_value } }
 */
const validateCoupon = async (req, res) => {
  try {
    const { code, orderSubtotal } = req.body;

    if (!code) {
      return res.status(400).json({ success: false, message: 'কুপন কোড দিন' });
    }

    const { coupon, discount_amount } = await couponService.validateCoupon(
      code,
      Number(orderSubtotal) || 0
    );

    return res.status(200).json({
      success: true,
      discount_amount,
      coupon: {
        coupon_id:      coupon.coupon_id,
        code:           coupon.code,
        description:    coupon.description,
        discount_value: coupon.discount_value,
      },
    });
  } catch (err) {
    const status = err.status || 500;
    return res.status(status).json({ success: false, message: err.message || 'Server Error' });
  }
};

module.exports = { validateCoupon };

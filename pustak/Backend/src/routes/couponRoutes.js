const express = require('express');
const router = express.Router();
const {
  validateCoupon,
  getAllCoupons,
  createCoupon,
  updateCoupon,
  deleteCoupon,
} = require('../controllers/couponController');
const { verifyAdmin } = require('../middlewares/adminAuth');

// ── Public route (used by checkout) ─────────────────────────────────────
// POST /api/coupons/validate
router.post('/validate', validateCoupon);

// ── Admin CRUD (protected) ───────────────────────────────────────────────
// GET    /api/coupons/admin      — list all coupons
// POST   /api/coupons/admin      — create coupon
// PUT    /api/coupons/admin/:id  — update coupon
// DELETE /api/coupons/admin/:id  — delete coupon
router.get   ('/admin',     verifyAdmin, getAllCoupons);
router.post  ('/admin',     verifyAdmin, createCoupon);
router.put   ('/admin/:id', verifyAdmin, updateCoupon);
router.delete('/admin/:id', verifyAdmin, deleteCoupon);

module.exports = router;

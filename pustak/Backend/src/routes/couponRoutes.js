const express = require('express');
const router = express.Router();
const { validateCoupon } = require('../controllers/couponController');

// POST /api/coupons/validate
router.post('/validate', validateCoupon);

module.exports = router;

// routes/paymentRoutes.js
const express = require('express');
const router = express.Router();
const { requireAuth } = require('../middlewares/auth');
const paymentController = require('../controllers/paymentController');

router.use(requireAuth);

// POST /api/payments/:orderId  -> body: { method, ...method-specific fields }
router.post('/:orderId', paymentController.pay);

module.exports = router;

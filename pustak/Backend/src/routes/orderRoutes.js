// routes/orderRoutes.js
const express = require('express');
const router = express.Router();
const { requireAuth } = require('../middlewares/auth');
const orderController = require('../controllers/orderController');

router.use(requireAuth);

// POST /api/orders            -> body: { addressId? } | places order from cart
router.post('/', orderController.placeOrder);

// GET  /api/orders            -> list current user's orders
router.get('/', orderController.getOrders);

// GET  /api/orders/:orderId   -> { order, items } | used by PaymentPage
router.get('/:orderId', orderController.getOrder);

module.exports = router;

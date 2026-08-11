// routes/cartRoutes.js
const express = require('express');
const router = express.Router();
const { requireAuth } = require('../middlewares/auth');
const cartController = require('../controllers/cartController');

router.use(requireAuth);

// GET    /api/cart              -> { cart, items: [...] }
router.get('/', cartController.getCart);

// POST   /api/cart/items        -> body: { bookId, quantity? } | add / increment
router.post('/items', cartController.addToCart);

// PATCH  /api/cart/items/:id    -> body: { quantity } | set exact quantity (+/- from frontend)
router.patch('/items/:cartItemId', cartController.updateQuantity);

// DELETE /api/cart/items/:id    -> remove line item
router.delete('/items/:cartItemId', cartController.deleteItem);

module.exports = router;

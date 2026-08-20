// routes/wishlistRoutes.js
const express = require('express');
const router = express.Router();
const { requireAuth } = require('../middlewares/auth');
const wishlistController = require('../controllers/wishlistController');

router.use(requireAuth);

// GET    /api/wishlist              -> { wishlist, items: [...] }
router.get('/', wishlistController.getWishlist);

// POST   /api/wishlist/items        -> body: { bookId } | toggle (add if absent, remove if present)
router.post('/items', wishlistController.toggleWishlist);

// DELETE /api/wishlist/items/:id    -> remove a specific item by wishlist_item_id
router.delete('/items/:wishlistItemId', wishlistController.deleteItem);

module.exports = router;

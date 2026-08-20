// controllers/wishlistController.js
const wishlistService = require('../services/wishlistService');

async function getWishlist(req, res, next) {
  try {
    const data = await wishlistService.getWishlistWithItems(req.userId);
    res.json(data);
  } catch (err) {
    next(err);
  }
}

async function toggleWishlist(req, res, next) {
  try {
    const { bookId } = req.body;
    if (!bookId) return res.status(400).json({ message: 'bookId প্রয়োজন' });
    const result = await wishlistService.toggleItem(req.userId, bookId);
    res.status(result.action === 'added' ? 201 : 200).json(result);
  } catch (err) {
    next(err);
  }
}

async function deleteItem(req, res, next) {
  try {
    await wishlistService.removeItem(req.userId, req.params.wishlistItemId);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
}

module.exports = { getWishlist, toggleWishlist, deleteItem };

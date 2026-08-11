// controllers/cartController.js
const cartService = require('../services/cartService');

async function getCart(req, res, next) {
  try {
    const data = await cartService.getCartWithItems(req.userId);
    res.json(data);
  } catch (err) {
    next(err);
  }
}

async function addToCart(req, res, next) {
  try {
    const { bookId, quantity } = req.body;
    if (!bookId) {
      return res.status(400).json({ message: 'bookId প্রয়োজন' });
    }
    const qty = Number.isInteger(quantity) && quantity > 0 ? quantity : 1;
    const item = await cartService.addItem(req.userId, bookId, qty);
    res.status(201).json(item);
  } catch (err) {
    next(err);
  }
}

async function updateQuantity(req, res, next) {
  try {
    const { cartItemId } = req.params;
    const { quantity } = req.body;
    if (typeof quantity !== 'number') {
      return res.status(400).json({ message: 'quantity (সংখ্যা) প্রয়োজন' });
    }
    const item = await cartService.setItemQuantity(req.userId, cartItemId, quantity);
    res.json(item); // null when quantity <= 0 (item was deleted)
  } catch (err) {
    next(err);
  }
}

async function deleteItem(req, res, next) {
  try {
    await cartService.removeItem(req.userId, req.params.cartItemId);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
}

module.exports = { getCart, addToCart, updateQuantity, deleteItem };

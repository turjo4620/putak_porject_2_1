// controllers/orderController.js
const orderService = require('../services/orderService');

async function placeOrder(req, res, next) {
  try {
    const { addressId } = req.body; // optional for now (address_id is nullable)
    const order = await orderService.placeOrderFromCart(req.userId, addressId);
    res.status(201).json(order);
  } catch (err) {
    next(err);
  }
}

async function getOrder(req, res, next) {
  try {
    const data = await orderService.getOrderById(req.userId, req.params.orderId);
    res.json(data);
  } catch (err) {
    next(err);
  }
}

async function getOrders(req, res, next) {
  try {
    const orders = await orderService.listOrders(req.userId);
    res.json(orders);
  } catch (err) {
    next(err);
  }
}

module.exports = { placeOrder, getOrder, getOrders };

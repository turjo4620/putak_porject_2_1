// controllers/paymentController.js
const paymentService = require('../services/paymentService');

async function pay(req, res, next) {
  try {
    const { orderId } = req.params;
    const payment = await paymentService.createPayment(req.userId, orderId, req.body);
    res.status(201).json(payment);
  } catch (err) {
    next(err);
  }
}

module.exports = { pay };

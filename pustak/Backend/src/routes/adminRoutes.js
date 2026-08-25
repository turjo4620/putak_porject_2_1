const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { verifyAdmin } = require('../middlewares/adminAuth');

// Apply admin authentication to all routes
router.use(verifyAdmin);

// ============= DASHBOARD =============
router.get('/dashboard', adminController.getDashboard);

// ============= BOOK MANAGEMENT =============
router.get('/books', adminController.getAllBooks);
router.get('/books/:id', adminController.getBookById);
router.post('/books', adminController.createBook);
router.put('/books/:id', adminController.updateBook);
router.delete('/books/:id', adminController.deleteBook);
router.patch('/books/:id/stock', adminController.updateBookStock);

// ============= USER MANAGEMENT =============
router.get('/users', adminController.getAllUsers);
router.get('/users/:id', adminController.getUserDetails);
router.patch('/users/:id/status', adminController.updateUserStatus);

// ============= ORDER MANAGEMENT =============
router.get('/orders', adminController.getAllOrders);
router.get('/orders/:id', adminController.getOrderDetails);
router.patch('/orders/:id/status', adminController.updateOrderStatus);

// ============= REVIEW MANAGEMENT =============
router.get('/reviews', adminController.getAllReviews);
router.patch('/reviews/:id/visibility', adminController.toggleReviewVisibility);
router.delete('/reviews/:id', adminController.deleteReview);

// ============= ANALYTICS =============
router.get('/analytics', adminController.getAnalytics);
router.get('/analytics/bestsellers', adminController.getBestSellers);
router.get('/analytics/low-stock', adminController.getLowStockBooks);

module.exports = router;

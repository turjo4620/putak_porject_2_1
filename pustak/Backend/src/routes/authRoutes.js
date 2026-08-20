const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { requireAuth } = require('../middlewares/auth');

router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.get('/me', requireAuth, authController.getMe);

module.exports = router;
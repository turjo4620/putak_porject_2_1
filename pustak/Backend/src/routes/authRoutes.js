const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Public auth endpoints for the client application.
router.post('/signup', authController.signup);
router.post('/login', authController.login);

module.exports = router;
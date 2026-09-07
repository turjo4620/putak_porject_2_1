const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { requireAuth } = require('../middlewares/auth');

router.post('/signup',          authController.signup);
router.post('/login',           authController.login);
router.post('/admin/login',     authController.adminLogin);
router.get('/me',               requireAuth, authController.getMe);
router.patch('/me',             requireAuth, authController.updateMe);
router.post('/change-password', requireAuth, authController.changePassword);
router.delete('/me',            requireAuth, authController.deleteMe);

module.exports = router;

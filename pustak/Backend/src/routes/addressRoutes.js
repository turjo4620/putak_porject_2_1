const express = require('express');
const router  = express.Router();
const { requireAuth } = require('../middlewares/auth');
const addressController = require('../controllers/addressController');

router.use(requireAuth);

router.get('/',           addressController.getAddresses);
router.post('/',          addressController.createAddress);
router.patch('/:id/default', addressController.setDefault);
router.delete('/:id',     addressController.deleteAddress);

module.exports = router;

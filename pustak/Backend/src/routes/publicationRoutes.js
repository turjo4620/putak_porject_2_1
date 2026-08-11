const express = require('express');
const router = express.Router();
const publicationController = require('../controllers/publicationController');

router.get('/', publicationController.getPublications);
router.get('/:id', publicationController.getPublication);

module.exports = router;

const express = require('express');
const router = express.Router();
const authorController = require('../controllers/authorController');

router.get('/', authorController.getAuthors);
router.get('/:id', authorController.getAuthor);

module.exports = router;
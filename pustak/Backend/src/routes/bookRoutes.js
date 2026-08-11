const express = require('express');
const router = express.Router();

// Import
const { getBooks, searchBooks, getBooksByAuthor, getBooksByPublication, getBookById } = require('../controllers/bookController');

// Search
router.get('/search', searchBooks);

router.get('/author/:id', getBooksByAuthor);
router.get('/publication/:id', getBooksByPublication);

// All
router.get('/', getBooks);

router.get('/:id', getBookById);
// Export
module.exports = router;
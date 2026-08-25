const express = require('express');
const router = express.Router();

// Import
const { getBooks, searchBooks, getBooksByAuthor, getBooksByPublication, getBooksByCategory, getBookById, getBestsellers } = require('../controllers/bookController');

// Search
router.get('/search', searchBooks);

// Bestsellers
router.get('/bestsellers', getBestsellers);

router.get('/author/:id', getBooksByAuthor);
router.get('/publication/:id', getBooksByPublication);
router.get('/category/:id', getBooksByCategory);

// All
router.get('/', getBooks);

router.get('/:id', getBookById);
// Export
module.exports = router;
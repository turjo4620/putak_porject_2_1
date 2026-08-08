const express = require('express');
const router = express.Router();

// Import
// Import
const { getBooks, searchBooks, getBooksByAuthor, getBookById } = require('../controllers/bookController');


// Search
router.get('/search', searchBooks);

router.get('/author/:id', getBooksByAuthor);

// All
router.get('/', getBooks);


router.get('/:id', getBookById);
// Export
module.exports = router;
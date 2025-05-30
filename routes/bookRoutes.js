const express = require('express');

const { addBook, getBooks, getBookById, searchBooks } = require('../controllers/bookController');
const {submitReview} = require('../controllers/reviewController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.route('/')
    .post(protect, addBook)
    .get(getBooks);

router.route('/:id')
    .get(getBookById);

router.post('/:id/reviews', protect, submitReview);

module.exports = router;
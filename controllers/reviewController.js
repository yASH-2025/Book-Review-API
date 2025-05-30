const Review = require('../models/Review');
const Book = require('../models/Book');

const submitReview =  async (req, res) => {
    const { rating, comment } = req.body;
    const bookId = req.params.id; // get book id from req params
    const userId = req.user._id; // get user from authenticated request

    const book = await Book.findById(bookId);
    if(!book){
        return res.status(404).json({ message: 'Book Not found'});
    }

    const alreadyReviewed = await Review.findOne({
        book: bookId,
        user: userId,
    });

    if(alreadyReviewed) {
        return res.status(400).json({ message: 'You have already reviewed this book'});
    }

    const review = await Review.create({
        book: bookId,
        user: userId,
        rating,
        comment,
    });

    if(review) {
        res.status(201).json({ message: 'Review added successfully', review});
    } else {
        res.status(400).json({ message: 'Invalid review data'});
    }
};

const updateReview = async (req, res) => {
    const { rating, comment } = req.body;
    const reviewId = req.params.id;
    const userId = req.user._id;

    const review = await Review.findById(reviewId);
    if(review) {
        if(review.user.toString() !== userId.toString()) {
            return res.status(403).json({ message: 'Not authorized to update this review'});
        }

        review.rating = rating || review.rating;
        review.comment = comment || review.comment;
        const updatedReview = await review.save();
        res.json({ message: 'Review updated successfully', updatedReview });
    } else {
        res.status(404).json({ message: 'Review not found'});
    }
};

const deleteReview = async (req, res) => {
    const reviewId = req.params.id;
    const userId = req.user._id;
    const review = await Review.findById(reviewId);

    if(review) {
        if(review.user.toString() !== userId.toString()) {
            return res.status(403).json({ message: 'Not authorized to delete this review'});
        }

        await review.deleteOne();
        res.status(204).json({ message: 'Review deleted successfully'});
    } else {
        res.status(404).json({ message: 'Review not found'});
    }
};

module.exports = { submitReview, updateReview, deleteReview };
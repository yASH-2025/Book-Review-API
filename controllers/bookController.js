const Book = require('../models/Book');
const Review = require('../models/Review');

const addBook = async (req, res) => {
    const { title, author, genre } = req.body;
    const book = await Book.create({
        title,
        author,
        genre,
        user: req.user._id,
    });

    if(book) {
        res.status(201).json(book);
    } else {
        res.status(400).json({ message: 'Invalid book data'});
    }
};

const getBooks = async (req, res) => {
    const pageSize = parseInt(req.query.limit) || 10;
    const page = parseInt(req.query.page) || 1;
    const keyword = req.query.keyword ? req.query.keyword.toLowerCase() : '';
    const genre = req.query.genre ? req.query.genre.toLowerCase() : '';
    const author = req.query.author ? req.query.author.toLowerCase(): '';

    let query = {};

    //keyword search for title or author
    if (keyword) {
        query.$or = [
            { title: { $regex: keyword, $options: 'i' } },
            { author: { $regex: keyword, $options: 'i' } },
        ];
    }

    //filters for genre and author
    if(genre) {
        query.genre = {$regex: genre, $options: 'i'};
    }
    if(author) {
        query.author = {$regex: author, $options: 'i'};
    }

    const count = await Book.countDocuments(query);
    const books = await Book.find(query)
        .limit(pageSize)
        .skip(pageSize * (page - 1))
        .populate('user', 'username');

    res.json({
        books,
        page,
        pages: Math.ceil(count / pageSize),
        totalBooks: count,
    });
};

const getBookById = async (req, res) => {
    const book = await Book.findByID(req.params.id).populate('user', 'username');

    if(book) {
        const pageSize = parseInt(req.query.reviewLimit) || 5;
        const page = parseInt(req.query.reviewLimit) || 1;
        const reviewsCount = await Review.countDocuments({ book: book._id});
        const reviews = await Review.find({book: book._id})
            .limit(pageSize)
            .skip(pageSize * (page - 1))
            .populate('user', 'username');

        let averageRating = 0;
        if (reviews.length > 0) {
            const totalRating = reviews.reduce((acc, review) => acc + review.rating, 0);
            averageRating = (totalRating / reviews.length).toFixed(1);
        }

        res.json({
            ...books.toObject(),
            reviews,
            averageRating: parseFloat(averageRating),
            reviewPage: page,
            reviewPages: Math.ceil(reviewsCount / pageSize),
            totalReviews: reviewsCount,
        });
    } else {
        res.status(400).json({ message: 'book not found'});
    }
};

const searchBooks = async (req, res) => {
    const keyword = req.query.q ? req.query.q.toLowerCase() : '';
    if(!keyword) {
        return res.status(400).json({message: 'Please provide a search query (q).'});
    }

    const query = {
        $or : [
            { title: { $regex: keyword, $options: 'i' } },
            { author: { $regex: keyword, $options: 'i' } },
        ],
    };

    const book = await Book.find(query).populate('user', 'username');
    res.json(books);
};

module.exports = { addBook, getBooks, getBookById, searchBooks };
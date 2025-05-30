const mongoose = require('mongoose');

const bookSchema = mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true,
        },
        author: {
            type: String,
            required: true,
            trim: true,
        },
        genre: {
            type: String,
            required: true,
            trim: true,
        },
        user: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'User',
        },
    },
    {
        timestamps: true,
        toJSON: {virtuals: true},
        toObject: {virtuals: true}, 
    }
);

bookSchema.virtual('averageRating', {
    ref: 'Review',
    localField: '_id',
    foreignField: 'book',
    justOne: false,
    
    get: function (reviews) {
        if(reviews && reviews.length > 0) {
            const totalRating = reviews.reduce((acc, review) => acc + review.rating, 0);
            return (totalRating / reviews.length).toFixed(1);
        }
        return 0;
    },
});

const Book = mongoose.model('Book', bookSchema);

module.exports = Book;
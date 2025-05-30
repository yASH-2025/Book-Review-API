const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const bookRoutes = require('./routes/bookRoutes');
const reviewRoutes = require('./routes/reviewRoutes');
const { searchBooks } = require('./controllers/bookController');

dotenv.config();
connectDB();

const app = express();
app.use(express.json());

app.get('/', (req, res) => {
    res.send('Book Review API is running ....');
});

console.log('Type of authRoutes:', typeof authRoutes);
console.log('Type of bookRoutes:', typeof bookRoutes);
console.log('Type of reviewRoutes:', typeof reviewRoutes);

app.use('/api', authRoutes);
app.use('/api/books', bookRoutes);
app.use('/api/reviews', reviewRoutes);

app.get('/api/search', searchBooks);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
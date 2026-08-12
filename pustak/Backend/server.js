const express = require('express');
const cors = require('cors');
require('dotenv').config();

const pool = require('./src/config/db');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Base route
app.get('/', (req, res) => {
    res.json({ message: 'Welcome to the API!' });
});

// Database test route
app.get('/api/test-db', async (req, res) => {
    try {
        const result = await pool.query('SELECT current_database(), now()');
        res.json({
            success: true,
            message: 'Database connection is working!',
            data: result.rows[0]
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ success: false, error: 'Database connection failed' });
    }
});

const authorRoutes = require('./src/routes/authorRoutes');
const bookRoutes = require('./src/routes/bookRoutes');
const authRoutes = require('./src/routes/authRoutes');
const publicationRoutes = require('./src/routes/publicationRoutes');
const categoryRoutes = require('./src/routes/categoryRoutes');

const cartRoutes = require("./src/routes/cartRoutes");
const orderRoutes = require("./src/routes/orderRoutes");
const paymentRoutes = require("./src/routes/paymentRoutes");

app.use("/api/cart", cartRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/payments", paymentRoutes);

app.use('/api/auth', authRoutes);
app.use('/api/authors', authorRoutes);
app.use('/api/books', bookRoutes);
app.use('/api/publications', publicationRoutes);
app.use('/api/categories', categoryRoutes);

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
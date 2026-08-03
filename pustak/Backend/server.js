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
    res.json({ message: "Welcome to the E-commerce API!" });
});

// Database test route
app.get('/api/test-db', async (req, res) => {
    try {
        const result = await pool.query('SELECT current_database(), now()');
        res.json({ 
            success: true, 
            message: "Database connection is working!", 
            data: result.rows[0] 
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ success: false, error: "Database connection failed" });
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
const jwt = require('jsonwebtoken');
const authService = require('../services/authService');

const createToken = (user) => {
    const secret = process.env.JWT_SECRET || 'dev-auth-secret';
    return jwt.sign(
        { sub: user.id, name: user.name, email: user.email },
        secret,
        { expiresIn: '7d' }
    );
};

const signup = async (req, res) => {
    try {
        const user = await authService.signupUser(req.body.name, req.body.email, req.body.password);
        const token = createToken(user);

        return res.status(201).json({
            success: true,
            message: 'Account created successfully. Welcome to Puştak!',
            token,
            user
        });
    } catch (error) {
        console.error('Signup error:', error.message);
        const status = error.status || 500;
        return res.status(status).json({
            success: false,
            message: error.message || 'Unable to create your account right now.'
        });
    }
};

const login = async (req, res) => {
    try {
        const user = await authService.loginUser(req.body.email, req.body.password);
        const token = createToken(user);

        return res.status(200).json({
            success: true,
            message: 'Signed in successfully.',
            token,
            user
        });
    } catch (error) {
        console.error('Login error:', error.message);
        const status = error.status || 500;
        return res.status(status).json({
            success: false,
            message: error.message || 'Unable to sign you in right now.'
        });
    }
};

const getMe = async (req, res) => {
    try {
        const pool = require('../config/db');
        const result = await pool.query(
            'SELECT user_id, name, email, phone_number FROM users WHERE user_id = $1',
            [req.userId]
        );
        if (!result.rows.length) {
            return res.status(404).json({ message: 'ব্যবহারকারী পাওয়া যায়নি' });
        }
        res.json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ message: 'প্রোফাইল লোড করা যায়নি' });
    }
};

module.exports = {
    signup,
    login,
    getMe
};
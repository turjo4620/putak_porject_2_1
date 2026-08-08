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
        // Validate and create the account, then immediately issue a signed token for the new user.
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
        // Only read from the database during login; no rows are created here.
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

module.exports = {
    signup,
    login
};

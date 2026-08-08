const pool = require('../config/db');
const bcrypt = require('bcryptjs');

const createAuthError = (message, code, status) => {
    const error = new Error(message);
    error.code = code;
    error.status = status;
    return error;
};

const ensureUsersTable = async () => {
    await pool.query(`
        CREATE TABLE IF NOT EXISTS users (
            user_id SERIAL PRIMARY KEY,
            name VARCHAR(100) NOT NULL,
            email VARCHAR(255) UNIQUE NOT NULL,
            password_hash VARCHAR(255) NOT NULL,
            created_at TIMESTAMPTZ DEFAULT NOW()
        );
    `);
};

const normalizeSignupInput = (name, email, password) => {
    const cleanName = typeof name === 'string' ? name.trim() : '';
    const cleanEmail = typeof email === 'string' ? email.trim().toLowerCase() : '';
    const cleanPassword = typeof password === 'string' ? password : '';

    if (!cleanName || !cleanEmail || !cleanPassword.trim()) {
        throw createAuthError('Please fill in every field.', 'EMPTY_FIELDS', 400);
    }

    if (cleanName.length > 100) {
        throw createAuthError('Name cannot exceed 100 characters.', 'INVALID_NAME', 400);
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(cleanEmail)) {
        throw createAuthError('Please enter a valid email address.', 'INVALID_EMAIL', 400);
    }

    if (cleanPassword.length < 8) {
        throw createAuthError('Password must be at least 8 characters long.', 'WEAK_PASSWORD', 400);
    }

    return { name: cleanName, email: cleanEmail, password: cleanPassword };
};

const signupUser = async (name, email, password) => {
    await ensureUsersTable();

    const normalizedInput = normalizeSignupInput(name, email, password);
    const existingUser = await pool.query('SELECT user_id FROM users WHERE email = $1', [normalizedInput.email]);

    if (existingUser.rowCount > 0) {
        throw createAuthError('An account with this email already exists.', 'DUPLICATE_EMAIL', 409);
    }

    const passwordHash = await bcrypt.hash(normalizedInput.password, 12);
    const result = await pool.query(
        'INSERT INTO users (name, email, password_hash) VALUES ($1, $2, $3) RETURNING user_id, name, email',
        [normalizedInput.name, normalizedInput.email, passwordHash]
    );

    const newUser = result.rows[0];
    return { id: newUser.user_id, name: newUser.name, email: newUser.email };
};

const loginUser = async (email, password) => {
    await ensureUsersTable();

    const cleanEmail = typeof email === 'string' ? email.trim().toLowerCase() : '';
    const cleanPassword = typeof password === 'string' ? password : '';

    if (!cleanEmail || !cleanPassword.trim()) {
        throw createAuthError('Please fill in every field.', 'EMPTY_FIELDS', 400);
    }

    const result = await pool.query(
        'SELECT user_id, name, email, password_hash FROM users WHERE email = $1',
        [cleanEmail]
    );

    const user = result.rows[0];
    if (!user) {
        throw createAuthError('We could not find an account with that email.', 'INVALID_CREDENTIALS', 401);
    }

    const isValidPassword = await bcrypt.compare(cleanPassword, user.password_hash);
    if (!isValidPassword) {
        throw createAuthError('The password you entered is incorrect.', 'INVALID_CREDENTIALS', 401);
    }

    return { id: user.user_id, name: user.name, email: user.email };
};

module.exports = {
    signupUser,
    loginUser
};
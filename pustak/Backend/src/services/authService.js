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
            user_id INT PRIMARY KEY,
            name VARCHAR(100) NOT NULL,
            email VARCHAR(255) UNIQUE NOT NULL,
            phone_number VARCHAR(20),
            password_hash VARCHAR(255) NOT NULL,
            status VARCHAR(20) DEFAULT 'Active',
            last_login TIMESTAMP
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
    const normalizedInput = normalizeSignupInput(name, email, password);
    await ensureUsersTable();

    const existingUser = await pool.query('SELECT user_id FROM users WHERE email = $1', [normalizedInput.email]);
    if (existingUser.rowCount > 0) {
        throw createAuthError('An account with this email already exists.', 'DUPLICATE_EMAIL', 409);
    }

    const passwordHash = await bcrypt.hash(normalizedInput.password, 12);
    const userId = Math.floor(Date.now() / 1000);
    const result = await pool.query(
        'INSERT INTO users (user_id, name, email, password_hash, status) VALUES ($1, $2, $3, $4, $5) RETURNING user_id AS id, name, email',
        [userId, normalizedInput.name, normalizedInput.email, passwordHash, 'Active']
    );

    return result.rows[0];
};

const loginUser = async (email, password) => {
    const cleanEmail = typeof email === 'string' ? email.trim().toLowerCase() : '';
    const cleanPassword = typeof password === 'string' ? password : '';

    if (!cleanEmail || !cleanPassword.trim()) {
        throw createAuthError('Please fill in every field.', 'EMPTY_FIELDS', 400);
    }

    await ensureUsersTable();

    const result = await pool.query(
        'SELECT user_id AS id, name, email, password_hash FROM users WHERE email = $1',
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

    await pool.query('UPDATE users SET last_login = NOW() WHERE user_id = $1', [user.id]);

    return { id: user.id, name: user.name, email: user.email };
};

module.exports = {
    signupUser,
    loginUser
};

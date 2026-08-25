const pool = require('../config/db');
const bcrypt = require('bcryptjs');

const createAuthError = (message, code, status) => {
    const error = new Error(message);
    error.code = code;
    error.status = status;
    return error;
};

// Users table already exists with role field instead of is_admin
// No need to create table

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

const signupUser = async (name, email, password, isAdmin = false) => {
    const normalizedInput = normalizeSignupInput(name, email, password);

    const existingUser = await pool.query('SELECT user_id FROM users WHERE email = $1', [normalizedInput.email]);
    if (existingUser.rowCount > 0) {
        throw createAuthError('An account with this email already exists.', 'DUPLICATE_EMAIL', 409);
    }

    const passwordHash = await bcrypt.hash(normalizedInput.password, 12);
    const userId = Math.floor(Date.now() / 1000);
    const role = isAdmin ? 'admin' : 'customer';
    
    // Insert into users table
    const result = await pool.query(
        'INSERT INTO users (user_id, name, email, password_hash, status, role) VALUES ($1, $2, $3, $4, $5, $6) RETURNING user_id AS id, name, email, role',
        [userId, normalizedInput.name, normalizedInput.email, passwordHash, 'Active', role]
    );

    const user = result.rows[0];

    // Insert into appropriate child table
    if (isAdmin) {
        await pool.query(
            'INSERT INTO admin (user_id, admin_level, department) VALUES ($1, NULL, NULL)',
            [userId]
        );
    } else {
        await pool.query(
            'INSERT INTO customer (user_id, newsletter_opt_in) VALUES ($1, FALSE)',
            [userId]
        );
    }

    return user;
};

const loginUser = async (email, password, expectedRole = null) => {
    const cleanEmail = typeof email === 'string' ? email.trim().toLowerCase() : '';
    const cleanPassword = typeof password === 'string' ? password : '';

    if (!cleanEmail || !cleanPassword.trim()) {
        throw createAuthError('Please fill in every field.', 'EMPTY_FIELDS', 400);
    }

    const result = await pool.query(
        'SELECT user_id AS id, name, email, password_hash, role, status FROM users WHERE email = $1',
        [cleanEmail]
    );

    const user = result.rows[0];
    if (!user) {
        throw createAuthError('We could not find an account with that email.', 'INVALID_CREDENTIALS', 401);
    }

    // Check if user account is active
    if (user.status !== 'Active') {
        throw createAuthError('Your account is not active. Please contact support.', 'INACTIVE_ACCOUNT', 403);
    }

    // Verify role matches expected role (customer or admin)
    if (expectedRole && user.role !== expectedRole) {
        const roleLabel = expectedRole === 'admin' ? 'Admin' : 'Customer';
        throw createAuthError(`This account is not registered as ${roleLabel}. Please use the correct login type.`, 'ROLE_MISMATCH', 403);
    }

    const isValidPassword = await bcrypt.compare(cleanPassword, user.password_hash);
    if (!isValidPassword) {
        throw createAuthError('The password you entered is incorrect.', 'INVALID_CREDENTIALS', 401);
    }

    await pool.query('UPDATE users SET last_login = NOW() WHERE user_id = $1', [user.id]);

    return { id: user.id, name: user.name, email: user.email, role: user.role };
};

module.exports = {
    signupUser,
    loginUser
};

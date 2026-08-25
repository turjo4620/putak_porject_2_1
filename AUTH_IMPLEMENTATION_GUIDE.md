# Authentication Implementation Guide

## Overview
This document explains the role-based authentication system for the Pustak bookstore application, supporting both **Customer** and **Admin** login with proper role validation.

## Database Schema

### Users Table
```sql
CREATE TABLE users (
    user_id BIGINT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone_number VARCHAR(20),
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL DEFAULT 'customer',  -- 'customer' or 'admin'
    status VARCHAR(50) NOT NULL DEFAULT 'Active',
    last_login TIMESTAMP
);
```

### Customer Table (Child table for customers)
```sql
CREATE TABLE customer (
    user_id BIGINT PRIMARY KEY,
    newsletter_opt_in BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);
```

### Admin Table (Child table for admins)
```sql
CREATE TABLE admin (
    user_id BIGINT PRIMARY KEY,
    admin_level VARCHAR(50),
    department VARCHAR(100),
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);
```

## Backend API Endpoints

### 1. Customer Signup
**Endpoint:** `POST /api/auth/signup`

**Request Body:**
```json
{
  "name": "Customer Name",
  "email": "customer@example.com",
  "password": "password123",
  "is_admin": false
}
```

**Response:**
```json
{
  "success": true,
  "message": "Account created successfully. Welcome to Puştak!",
  "token": "jwt_token_here",
  "user": {
    "id": 1786484073,
    "name": "Customer Name",
    "email": "customer@example.com",
    "role": "customer"
  }
}
```

### 2. Customer Login
**Endpoint:** `POST /api/auth/login`

**Request Body:**
```json
{
  "email": "customer@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Signed in successfully.",
  "token": "jwt_token_here",
  "user": {
    "id": 1786484073,
    "name": "Customer Name",
    "email": "customer@example.com",
    "role": "customer"
  }
}
```

### 3. Admin Login
**Endpoint:** `POST /api/auth/admin/login`

**Request Body:**
```json
{
  "email": "admin@example.com",
  "password": "admin123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Admin signed in successfully.",
  "token": "jwt_token_here",
  "user": {
    "id": 1786484073,
    "name": "Admin Name",
    "email": "admin@example.com",
    "role": "admin"
  }
}
```

### 4. Get Current User
**Endpoint:** `GET /api/auth/me`

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "user_id": 1786484073,
  "name": "User Name",
  "email": "user@example.com",
  "phone_number": "01712345678",
  "role": "customer"
}
```

## Authentication Flow

### Customer Login Flow
1. User selects "Customer" from dropdown on login page
2. Frontend sends POST to `/api/auth/login`
3. Backend validates credentials and checks `role = 'customer'`
4. If valid, returns JWT token with role information
5. Frontend stores token and redirects to home page

### Admin Login Flow
1. User selects "Admin" from dropdown on login page
2. Frontend sends POST to `/api/auth/admin/login`
3. Backend validates credentials and checks `role = 'admin'`
4. If valid, returns JWT token with role information
5. Frontend stores token and redirects to `/admin/dashboard`

### Role Validation
- **Customer endpoint** (`/api/auth/login`): Only allows users with `role = 'customer'`
- **Admin endpoint** (`/api/auth/admin/login`): Only allows users with `role = 'admin'`
- If a customer tries to login via admin endpoint, they get: `"This account is not registered as Admin. Please use the correct login type."`
- If an admin tries to login via customer endpoint, they get: `"This account is not registered as Customer. Please use the correct login type."`

## JWT Token Structure
```javascript
{
  "sub": 1786484073,           // user_id
  "name": "User Name",
  "email": "user@example.com",
  "role": "customer",          // or "admin"
  "exp": 1234567890            // expiration (7 days)
}
```

## Middleware

### `requireAuth`
- Validates JWT token
- Extracts user ID and role
- Used for any authenticated endpoint

### `requireAdmin`
- Validates JWT token
- Extracts user ID and role
- **Verifies role is 'admin'**
- Returns 403 Forbidden if not admin
- Used for admin-only endpoints

**Example Usage:**
```javascript
const { requireAuth, requireAdmin } = require('../middlewares/auth');

// Any authenticated user can access
router.get('/profile', requireAuth, getProfile);

// Only admins can access
router.get('/admin/users', requireAdmin, getAllUsers);
```

## Frontend Implementation

### Login Page (`LoginPage.jsx`)
- Dropdown to select "Customer" or "Admin"
- Calls appropriate endpoint based on selection:
  - Customer → `/api/auth/login`
  - Admin → `/api/auth/admin/login`
- Shows helpful hint based on account type
- Redirects to appropriate page after login

### Register Page (`RegisterPage.jsx`)
- Dropdown to select account type
- Sends `is_admin: false` for Customer
- Sends `is_admin: true` for Admin
- Backend creates entry in appropriate child table

## Test Data

### Customer Account
- **Email:** `rahim.ahmed1@example.com`
- **Password:** `password123` (you need to check actual password)
- **Role:** customer

### Admin Account
- **Email:** `sarkerturjo2022@gmail.com`
- **Password:** (check your database)
- **Role:** admin

## Testing

### Using the Test Script
```bash
cd pustak/Backend
node test_auth.js
```

This will test:
- ✓ Customer login
- ✓ Admin login
- ✓ Role mismatch validation
- ✓ Customer signup

### Manual Testing with curl

**Customer Login:**
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"rahim.ahmed1@example.com","password":"password123"}'
```

**Admin Login:**
```bash
curl -X POST http://localhost:5000/api/auth/admin/login \
  -H "Content-Type: application/json" \
  -d '{"email":"sarkerturjo2022@gmail.com","password":"your_password"}'
```

## Security Features

1. **Password Hashing:** bcrypt with 12 rounds
2. **Role Validation:** Enforced at login and in middleware
3. **Status Check:** Only 'Active' accounts can login
4. **JWT Expiration:** 7 days
5. **Input Sanitization:** Email trimmed and lowercased
6. **Error Messages:** Generic messages to prevent user enumeration

## Error Codes

| Code | Message | Status |
|------|---------|--------|
| EMPTY_FIELDS | Please fill in every field | 400 |
| INVALID_EMAIL | Please enter a valid email address | 400 |
| WEAK_PASSWORD | Password must be at least 8 characters | 400 |
| DUPLICATE_EMAIL | Account with this email already exists | 409 |
| INVALID_CREDENTIALS | Wrong email or password | 401 |
| ROLE_MISMATCH | Account not registered as selected type | 403 |
| INACTIVE_ACCOUNT | Account is not active | 403 |

## Files Modified

### Backend
1. `src/services/authService.js` - Updated to use role field and child tables
2. `src/controllers/authController.js` - Added adminLogin function and role in JWT
3. `src/routes/authRoutes.js` - Added admin login route
4. `src/middlewares/auth.js` - Added requireAdmin middleware and role extraction

### Frontend
1. `src/pages/LoginPage.jsx` - Changed to dropdown, dynamic endpoint selection
2. `src/pages/RegisterPage.jsx` - Already had dropdown for account type

## Next Steps

1. **Update Admin Routes:** Apply `requireAdmin` middleware to all admin endpoints
2. **Password Reset:** You'll need to know the actual passwords or reset them
3. **Frontend Role Check:** Add role-based UI rendering
4. **Admin Dashboard:** Ensure only admins can access `/admin/*` routes

## Generating Password Hash

To create a password hash for testing:
```bash
node pustak/Backend/generate_admin_hash.js
```

Or use this Node.js code:
```javascript
const bcrypt = require('bcryptjs');
const password = 'your_password';
bcrypt.hash(password, 12).then(hash => console.log(hash));
```

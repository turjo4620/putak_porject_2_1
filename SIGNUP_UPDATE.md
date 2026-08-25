# 🔐 Sign Up Feature Update - Admin/Customer Selection

## ✅ Update Complete

The registration (sign-up) page has been updated to include an **account type selection** feature, allowing users to choose between creating a Customer or Admin account during registration.

---

## 🎯 What Changed

### Frontend Changes

**RegisterPage.jsx**
- ✅ Added account type dropdown (Customer/Admin)
- ✅ Default selection: Customer
- ✅ Visual indicator showing what each account type can do
- ✅ Form state includes `accountType` field
- ✅ Sends `is_admin` boolean to backend

**AuthPage.css**
- ✅ Added styles for select dropdown (`.auth-select`)
- ✅ Added styles for hint text (`.auth-hint`)
- ✅ Consistent styling with input fields
- ✅ Hover and focus states

### Backend Changes

**authController.js**
- ✅ Extracts `is_admin` from request body
- ✅ Passes to `signupUser` service
- ✅ Defaults to `false` if not provided

**authService.js**
- ✅ Updated `signupUser` to accept `isAdmin` parameter
- ✅ Stores `is_admin` in database
- ✅ Returns `is_admin` in user object
- ✅ Updated `ensureUsersTable` to include `is_admin` column
- ✅ Updated `loginUser` to return `is_admin` status

---

## 📋 Features

### Account Type Selection
Users can now choose between two account types during registration:

#### 1. Customer Account (Default)
- **Bangla Label**: গ্রাহক (Customer)
- **Permissions**: Browse books, make purchases, write reviews
- **Database**: `is_admin = FALSE`
- **Description**: "গ্রাহক অ্যাকাউন্ট বই ব্রাউজ এবং ক্রয় করতে পারে"

#### 2. Admin Account
- **Bangla Label**: অ্যাডমিন (Admin)
- **Permissions**: Manage books, orders, users, and all admin features
- **Database**: `is_admin = TRUE`
- **Warning**: "⚠️ অ্যাডমিন অ্যাকাউন্ট বই, অর্ডার এবং ব্যবহারকারী পরিচালনা করতে পারে"

---

## 🎨 UI/UX Design

### Dropdown Selection
```jsx
<select id="accountType" value={form.accountType} onChange={set('accountType')}>
  <option value="customer">গ্রাহক (Customer)</option>
  <option value="admin">অ্যাডমিন (Admin)</option>
</select>
```

### Dynamic Help Text
- Shows different hint based on selection
- Customer: Explains customer capabilities
- Admin: Shows warning about admin privileges

### Visual Hierarchy
1. **Account Type** (First field - most important decision)
2. Name
3. Email
4. Password

---

## 🔄 Registration Flow

### Step 1: User Visits Registration Page
```
http://localhost:5173/register
```

### Step 2: User Selects Account Type
- Default: Customer
- Can change to Admin

### Step 3: User Fills Form
- Account Type: Customer/Admin
- Name
- Email
- Password

### Step 4: Form Submission
```javascript
POST /api/auth/signup
{
  "name": "User Name",
  "email": "user@example.com",
  "password": "password123",
  "is_admin": false  // or true for admin
}
```

### Step 5: Account Created
- User record created with `is_admin` flag
- Success message displayed
- Redirected to login page

### Step 6: Login
- User logs in with credentials
- Token includes user role
- Redirected based on account type:
  - Customer → Homepage
  - Admin → Admin Dashboard (if they navigate to /admin)

---

## 🗄️ Database Schema

### users Table
```sql
CREATE TABLE users (
    user_id INT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone_number VARCHAR(20),
    password_hash VARCHAR(255) NOT NULL,
    status VARCHAR(20) DEFAULT 'Active',
    is_admin BOOLEAN DEFAULT FALSE,  ← NEW FIELD
    last_login TIMESTAMP
);
```

### Query Examples

**Find all admins:**
```sql
SELECT * FROM users WHERE is_admin = TRUE;
```

**Find all customers:**
```sql
SELECT * FROM users WHERE is_admin = FALSE OR is_admin IS NULL;
```

**Convert customer to admin:**
```sql
UPDATE users SET is_admin = TRUE WHERE email = 'user@example.com';
```

**Convert admin to customer:**
```sql
UPDATE users SET is_admin = FALSE WHERE email = 'admin@example.com';
```

---

## 🔐 Security Considerations

### Backend Validation
- ✅ `is_admin` field is explicitly set in backend
- ✅ Defaults to `false` if not provided
- ✅ Stored as boolean in database
- ✅ Included in JWT token payload

### Access Control
- ✅ Admin routes protected by `verifyAdmin` middleware
- ✅ Checks `is_admin` column in database
- ✅ Non-admin users cannot access `/admin/*` routes
- ✅ Customer users have normal access

### Best Practices
- ⚠️ **Production Recommendation**: Consider requiring admin approval for admin accounts
- ⚠️ **Alternative**: Remove admin option from public signup, only allow admins to create other admins
- ✅ Current implementation allows self-registration as admin (good for development)

---

## 🧪 Testing

### Test Customer Registration
1. Go to `/register`
2. Select "গ্রাহক (Customer)"
3. Fill name, email, password
4. Submit
5. Verify `is_admin = FALSE` in database

### Test Admin Registration
1. Go to `/register`
2. Select "অ্যাডমিন (Admin)"
3. Fill name, email, password
4. Submit
5. Verify `is_admin = TRUE` in database

### Test Admin Login
1. Register as admin
2. Login with credentials
3. Navigate to `/admin/login` or `/admin`
4. Should have access to admin panel

### Test Customer Login
1. Register as customer
2. Login with credentials
3. Try to access `/admin`
4. Should be redirected to `/admin/login`
5. Login should fail (not admin)

---

## 📱 Screenshots Description

### Registration Page with Account Type
```
┌─────────────────────────────────────┐
│          পুস্তক                     │
│      নিবন্ধন করুন                   │
│   নতুন অ্যাকাউন্ট তৈরি করুন       │
│                                     │
│  অ্যাকাউন্ট ধরন                    │
│  ┌──────────────────────────────┐  │
│  │ গ্রাহক (Customer)      ▼   │  │
│  └──────────────────────────────┘  │
│  গ্রাহক অ্যাকাউন্ট বই ব্রাউজ...  │
│                                     │
│  পুরো নাম                           │
│  ┌──────────────────────────────┐  │
│  │                              │  │
│  └──────────────────────────────┘  │
│                                     │
│  ... rest of form ...              │
└─────────────────────────────────────┘
```

---

## 🔄 Migration Guide

### Existing Database
If you have existing users without the `is_admin` column:

```sql
-- Add column (already done in admin_schema.sql)
ALTER TABLE users ADD COLUMN IF NOT EXISTS is_admin BOOLEAN DEFAULT FALSE;

-- Set existing admins
UPDATE users SET is_admin = TRUE WHERE email IN (
    'admin@pustak.com',
    'another_admin@example.com'
);

-- Verify
SELECT user_id, name, email, is_admin FROM users ORDER BY is_admin DESC;
```

---

## 📊 Feature Comparison

| Feature | Before | After |
|---------|--------|-------|
| Account Types | 1 (Customer only) | 2 (Customer + Admin) |
| Registration Fields | 3 (Name, Email, Password) | 4 (+ Account Type) |
| Admin Creation | Manual SQL only | Self-registration option |
| User Experience | Simple | Clear role selection |
| Security | Basic | Role-based access |

---

## 🚀 Usage Examples

### Example 1: Register as Customer
```bash
# Frontend
- Visit: http://localhost:5173/register
- Select: গ্রাহক (Customer)
- Fill form and submit

# Result
- User created with is_admin = false
- Can browse and buy books
- Cannot access admin panel
```

### Example 2: Register as Admin
```bash
# Frontend
- Visit: http://localhost:5173/register
- Select: অ্যাডমিন (Admin)
- Fill form and submit

# Result
- User created with is_admin = true
- Can access admin panel
- Can manage entire system
```

### Example 3: Check Account Type After Login
```javascript
// After successful login, check user object
const user = response.data.user;
console.log(user.is_admin); // true or false

// Redirect accordingly
if (user.is_admin) {
    navigate('/admin');
} else {
    navigate('/');
}
```

---

## 🎯 Implementation Files

### Updated Files (5)
1. ✅ `frontend/src/pages/RegisterPage.jsx`
   - Added account type selection
   - Updated form state
   - Updated API call

2. ✅ `frontend/src/pages/AuthPage.css`
   - Added select dropdown styles
   - Added hint text styles

3. ✅ `Backend/src/controllers/authController.js`
   - Extract is_admin from request
   - Pass to service

4. ✅ `Backend/src/services/authService.js`
   - Accept isAdmin parameter
   - Store in database
   - Return in user object

5. ✅ `SIGNUP_UPDATE.md`
   - This documentation

---

## ⚠️ Production Recommendations

### Security Enhancement Options

**Option 1: Admin Approval Required**
```javascript
// During signup, create admin accounts as "pending"
const result = await pool.query(
    'INSERT INTO users (..., is_admin, admin_status) VALUES (..., $6, $7)',
    [..., isAdmin, isAdmin ? 'pending' : 'active']
);

// Later, existing admin approves
UPDATE users SET admin_status = 'active' WHERE user_id = ?;
```

**Option 2: Remove Public Admin Registration**
```javascript
// In RegisterPage.jsx, remove admin option
// Only show customer registration

// Create admin-only route for creating other admins
// POST /api/admin/users (protected route)
```

**Option 3: Invite-Only Admin Registration**
```javascript
// Require invitation code for admin registration
if (isAdmin && !validInvitationCode(req.body.code)) {
    throw new Error('Invalid invitation code');
}
```

### Current Implementation
- ✅ Good for development and testing
- ✅ Allows quick admin account creation
- ⚠️ In production, consider restricting admin registration

---

## ✨ Benefits

1. **User Choice**: Clear selection between account types
2. **Self-Service**: Users can create the account they need
3. **Transparency**: Explicit about what each account type can do
4. **Flexibility**: Easy to create admin accounts for testing
5. **Scalability**: Foundation for role-based permissions

---

## 🎊 Status

**Feature Status**: ✅ Complete and Working

- Frontend UI implemented
- Backend logic updated
- Database schema supports feature
- Both account types functional
- Documentation complete

---

## 📞 Quick Reference

### Create Customer Account
1. Visit `/register`
2. Select "গ্রাহক (Customer)"
3. Fill form → Submit

### Create Admin Account
1. Visit `/register`
2. Select "অ্যাডমিন (Admin)"
3. Fill form → Submit

### Verify Account Type (SQL)
```sql
SELECT email, is_admin FROM users WHERE email = 'user@example.com';
```

### Change Account Type (SQL)
```sql
-- Make admin
UPDATE users SET is_admin = TRUE WHERE email = 'user@example.com';

-- Make customer
UPDATE users SET is_admin = FALSE WHERE email = 'admin@example.com';
```

---

**Feature**: Sign Up with Admin/Customer Selection  
**Status**: ✅ Complete  
**Version**: 1.0.0  
**Date**: 2024

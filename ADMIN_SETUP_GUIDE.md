# Pustak Admin Panel - Complete Setup Guide

## Prerequisites
- Node.js and npm installed
- PostgreSQL database running
- Pustak database already created with basic schema

## Step-by-Step Setup

### Step 1: Generate Admin Password Hash

1. Navigate to the backend directory:
```bash
cd pustak/Backend
```

2. Run the password hash generator:
```bash
node generate_admin_hash.js
```

3. Copy the generated SQL INSERT statement (you'll need this in Step 3)

### Step 2: Update Database Schema

Run the admin setup SQL script. You have two options:

**Option A: Using psql command line**
```bash
psql -U your_username -d your_database -f setup_admin.sql
```

**Option B: Using pgAdmin or any PostgreSQL client**
1. Open your PostgreSQL client
2. Open the file `setup_admin.sql`
3. Replace the placeholder password hash with the one generated in Step 1
4. Execute the script

### Step 3: Create Admin User

**Method 1: Insert new admin user**

Use the INSERT statement generated in Step 1. The default admin will have:
- Email: admin@pustak.com
- Password: admin123
- User ID: 999999

**Method 2: Make existing user an admin**

If you want to make an existing user an admin:

```sql
UPDATE users 
SET is_admin = TRUE 
WHERE email = 'your_existing_email@example.com';
```

### Step 4: Verify Database Setup

Run this query to check if everything is set up correctly:

```sql
-- Check admin users
SELECT user_id, name, email, is_admin, status 
FROM users 
WHERE is_admin = TRUE;

-- Check tables exist
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN (
    'reviews', 
    'book_copies', 
    'book_category', 
    'admin_activity_log',
    'homepage_banners',
    'featured_books',
    'discounts'
);
```

### Step 5: Start Backend Server

1. Navigate to backend directory:
```bash
cd pustak/Backend
```

2. Install dependencies (if not already done):
```bash
npm install
```

3. Start the server:
```bash
npm start
```

or for development with auto-reload:
```bash
npm run dev
```

The server should start on `http://localhost:5000`

### Step 6: Start Frontend

1. Open a new terminal and navigate to frontend directory:
```bash
cd pustak/frontend
```

2. Install dependencies (if not already done):
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The frontend should start on `http://localhost:5173`

### Step 7: Access Admin Panel

1. Open your browser and navigate to:
```
http://localhost:5173/admin/login
```

2. Login with admin credentials:
   - **Email:** admin@pustak.com
   - **Password:** admin123

3. You should be redirected to the admin dashboard!

## Testing the Admin Panel

### Test Dashboard
- Verify all statistics are displayed
- Check recent activities section
- Ensure quick stats show correct data

### Test Book Management
1. Go to "Books" section
2. Try searching for a book
3. Try filtering by category
4. Click "Add New Book" and create a test book
5. Edit an existing book
6. Update stock quantity

### Test User Management
1. Go to "Users" section
2. Search for a user
3. View user details
4. Try blocking/unblocking a user

### Test Order Management
1. Go to "Orders" section
2. Filter by order status
3. Click on an order to view details
4. Update order status

### Test Review Management
1. Go to "Reviews" section
2. Toggle review visibility
3. Try deleting a review

### Test Analytics
1. Go to "Analytics" section
2. Change date range
3. View best sellers
4. Check low stock alerts

## Troubleshooting

### Problem: Cannot login - "Invalid credentials"
**Solution:**
- Verify the admin user exists in database
- Check the password hash is correct
- Ensure `is_admin = TRUE` for the user

### Problem: "Access denied. Admin privileges required"
**Solution:**
```sql
UPDATE users 
SET is_admin = TRUE 
WHERE email = 'your_email@example.com';
```

### Problem: Backend server won't start
**Solution:**
- Check if port 5000 is available
- Verify `.env` file has correct database credentials
- Check PostgreSQL is running

### Problem: Frontend shows CORS errors
**Solution:**
- Ensure backend server is running
- Check CORS is enabled in `server.js` (already configured)
- Verify backend URL in frontend API calls

### Problem: "Failed to fetch" errors in admin panel
**Solution:**
- Verify backend server is running on port 5000
- Check browser console for specific errors
- Verify database connection is working

### Problem: Tables not found
**Solution:**
Run the setup script again:
```bash
psql -U your_username -d your_database -f setup_admin.sql
```

### Problem: No data showing in dashboard
**Solution:**
- Ensure you have books, users, and orders in database
- Check browser console for errors
- Verify API endpoints are working:
  - Open `http://localhost:5000/api/admin/dashboard` in browser
  - You should see JSON data (after logging in)

## Security Recommendations

### 1. Change Default Password
After first login, create a new admin user with a strong password and delete the default one:

```sql
-- Create new admin
INSERT INTO users (name, email, password_hash, is_admin, status)
VALUES ('Your Name', 'your@email.com', 'new_bcrypt_hash', TRUE, 'Active');

-- Delete default admin
DELETE FROM users WHERE user_id = 999999;
```

### 2. Use Environment Variables
Store sensitive data in `.env` file:
```
JWT_SECRET=your_very_long_random_secret_key_here
DATABASE_URL=postgresql://user:password@localhost:5432/pustak
```

### 3. Enable HTTPS in Production
Use a reverse proxy like Nginx with SSL certificates

### 4. Implement Rate Limiting
Add rate limiting to prevent brute force attacks on login

### 5. Regular Backups
Set up automated database backups:
```bash
pg_dump -U your_username your_database > backup_$(date +%Y%m%d).sql
```

## Additional Configuration

### Customize Admin User
```sql
UPDATE users 
SET 
    name = 'Your Name',
    email = 'your@email.com',
    phone_number = 'your_phone'
WHERE user_id = 999999;
```

### Add Multiple Admins
```sql
UPDATE users 
SET is_admin = TRUE 
WHERE user_id IN (1, 2, 3); -- Replace with actual user IDs
```

### View Admin Activity Logs (Future Feature)
```sql
SELECT * FROM admin_activity_log 
ORDER BY created_at DESC 
LIMIT 50;
```

## Next Steps

After setup is complete, you can:

1. **Add Sample Data**
   - Create test books with stock
   - Add sample reviews
   - Create test orders

2. **Customize Admin Panel**
   - Modify colors in `admin.css`
   - Add your logo
   - Customize dashboard widgets

3. **Extend Functionality**
   - Add author management page
   - Add publication management page
   - Add category management page
   - Implement discount management
   - Add homepage content management

## Support

If you encounter any issues:

1. Check the console logs (browser and server)
2. Verify all dependencies are installed
3. Ensure database schema is up to date
4. Check API endpoints are accessible
5. Review the error messages carefully

## Quick Reference

### Default Admin Credentials
- **Email:** admin@pustak.com
- **Password:** admin123
- ⚠️ **Change after first login!**

### Admin URLs
- Login: `http://localhost:5173/admin/login`
- Dashboard: `http://localhost:5173/admin`
- Books: `http://localhost:5173/admin/books`
- Users: `http://localhost:5173/admin/users`
- Orders: `http://localhost:5173/admin/orders`
- Reviews: `http://localhost:5173/admin/reviews`
- Analytics: `http://localhost:5173/admin/analytics`

### API Endpoints
Base URL: `http://localhost:5000/api/admin`

All endpoints require admin authentication token in header:
```
Authorization: Bearer <token>
```

## Conclusion

Your Pustak Admin Panel is now ready to use! You have a fully functional admin system to manage your online bookstore.

For more details, refer to `ADMIN_PANEL_README.md`

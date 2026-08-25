# Quick Start: Admin Panel

## TL;DR - Fast Fix

```bash
# 1. Clear browser
localStorage.clear()  # In browser console (F12)

# 2. Restart backend
cd pustak/backend
npm start

# 3. Restart frontend
cd pustak/frontend
npm run dev

# 4. Login
http://localhost:5173/admin/login
Email: admin@pustak.com
Password: admin123
```

## What Was Fixed

✅ Admin login page routing  
✅ Dashboard "page not found" issue  
✅ Authentication flow  
✅ Error handling and logging  

## Files Changed

- `vite.config.js` - Added `historyApiFallback: true`
- `App.jsx` - Simplified admin routes
- `AdminLayout.jsx` - Added auth check
- `AdminLogin.jsx` - Added debug logging
- `AdminDashboard.jsx` - Better error handling

## How to Test

1. **Clear browser data**: `localStorage.clear()` in console
2. **Start backend**: `cd pustak/backend && npm start`
3. **Start frontend**: `cd pustak/frontend && npm run dev`
4. **Go to**: `http://localhost:5173/admin/login`
5. **Login**: admin@pustak.com / admin123
6. **Should see**: Admin dashboard with sidebar

## Expected Console Output

```
Attempting login with: admin@pustak.com
Response status: 200
Token saved successfully: true
Navigating to /admin
AdminLayout - Checking token: exists
Dashboard API response status: 200
Dashboard data received
```

## If Still Not Working

### Check #1: Backend Running?
```bash
curl http://localhost:5000/api/test-db
```
Should return database connection success.

### Check #2: Admin User Exists?
```sql
SELECT email, is_admin FROM users WHERE email = 'admin@pustak.com';
```
Should show `is_admin = true`

### Check #3: Token Saved?
```javascript
// In browser console
console.log(localStorage.getItem('adminToken'))
```
Should show a JWT token, not `null`

### Check #4: Console Errors?
Open F12 and look for red errors. If you see any, check:
- All files in `src/pages/admin/` exist
- No import errors
- No syntax errors

## Admin Features Available

After login, you can access:

- 📊 **Dashboard** - `/admin`
- 📚 **Books** - `/admin/books`
- ✍️ **Authors** - `/admin/authors`
- 📖 **Publications** - `/admin/publications`
- 🏷️ **Categories** - `/admin/categories`
- 👥 **Users** - `/admin/users`
- 🛒 **Orders** - `/admin/orders`
- ⭐ **Reviews** - `/admin/reviews`
- 📈 **Analytics** - `/admin/analytics`

## Need More Details?

See: `ADMIN_COMPLETE_FIX_GUIDE.md`

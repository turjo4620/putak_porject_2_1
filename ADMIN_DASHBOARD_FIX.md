# Admin Dashboard "Page Not Found" Fix

## Problem
After logging in with admin credentials, instead of showing the dashboard, the app displays:
**"পৃষ্ঠাটি পাওয়া যায়নি"** (Page not found)

## Root Cause
The issue was with the ProtectedRoute wrapper interfering with React Router's nested routing. When wrapped incorrectly, the route wasn't matching properly and fell through to the catch-all 404 route.

## Solution Applied

### 1. Moved Authentication Check to AdminLayout
Instead of wrapping the route with ProtectedRoute, we moved the authentication logic directly into the AdminLayout component. This ensures:
- The route matches correctly
- Authentication is checked when the component mounts
- Better control over redirect behavior

**Updated: `AdminLayout.jsx`**
```javascript
useEffect(() => {
  const token = localStorage.getItem('adminToken');
  if (!token) {
    navigate('/admin/login', { replace: true });
  }
}, [navigate]);
```

### 2. Simplified Route Structure
**Updated: `App.jsx`**
```javascript
<Route path="/admin/login" element={<AdminLogin />} />
<Route path="/admin" element={<AdminLayout />}>
  <Route index element={<AdminDashboard />} />
  {/* other admin routes */}
</Route>
```

### 3. Enhanced Login Debugging
Added console logs to track the login flow:
- Login attempt
- Response status
- Token saving
- Navigation

## How to Test

### Step 1: Clear Everything
```bash
# Clear localStorage in browser console (F12)
localStorage.clear()
```

### Step 2: Restart Dev Server
```bash
cd pustak/frontend
npm run dev
```

### Step 3: Test Login Flow

1. Navigate to: `http://localhost:5173/admin/login`
2. Open browser console (F12) to see debug logs
3. Login with:
   - **Email**: `admin@pustak.com`
   - **Password**: `admin123`

### Step 4: Verify Console Logs
You should see:
```
Attempting login with: admin@pustak.com
Response status: 200
Login response: { user: {...}, hasToken: true }
Saving token to localStorage
Token saved successfully: true
Navigating to /admin
AdminLayout - Checking token: exists
Token found, admin layout loaded
```

### Step 5: Check Dashboard
After login, you should see:
- ✅ Admin sidebar on the left
- ✅ Dashboard with stats cards
- ✅ URL: `http://localhost:5173/admin`
- ✅ No "page not found" message

## Debug Checklist

If you still see "page not found":

### Check 1: Token is Saved
Open browser console (F12) and run:
```javascript
localStorage.getItem('adminToken')
```
Should return a JWT token string, not `null`

### Check 2: Check Console Logs
Look for these logs in order:
1. ✅ "Attempting login with: admin@pustak.com"
2. ✅ "Token saved successfully: true"
3. ✅ "Navigating to /admin"
4. ✅ "AdminLayout - Checking token: exists"

If any step is missing, that's where the issue is.

### Check 3: Backend is Running
Make sure your backend is running on port 5000:
```bash
cd pustak/backend
npm start
```

Test the login endpoint:
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@pustak.com","password":"admin123"}'
```

Should return: `{ token: "...", user: { is_admin: true, ... } }`

### Check 4: Admin User Exists in Database
Run this SQL query:
```sql
SELECT user_id, email, is_admin FROM users WHERE email = 'admin@pustak.com';
```

Should return a user with `is_admin = true`

### Check 5: Route Order
Make sure in `App.jsx`, the admin routes come BEFORE the catch-all `*` route:
```javascript
{/* Admin routes */}
<Route path="/admin/login" element={<AdminLogin />} />
<Route path="/admin" element={<AdminLayout />}>
  <Route index element={<AdminDashboard />} />
</Route>

{/* Catch-all MUST be last */}
<Route path="*" element={<NotFoundPage />} />
```

## Expected Flow

### Successful Login Flow:
1. User submits login form
2. API call to `/api/auth/login`
3. Response contains token and user data
4. Check `user.is_admin === true`
5. Save token to `localStorage`
6. Navigate to `/admin`
7. AdminLayout mounts
8. Check for token in localStorage
9. Token exists → Render layout + dashboard
10. ✅ User sees admin dashboard

### Failed Authentication Flow:
1. User navigates to `/admin` without token
2. AdminLayout mounts
3. Check for token in localStorage
4. Token missing → Redirect to `/admin/login`
5. User sees login page

## Common Issues and Solutions

### Issue 1: Redirects back to login immediately after login
**Cause**: Token not being saved to localStorage
**Solution**: Check browser console for errors during token save

### Issue 2: "Access denied. Admin privileges required"
**Cause**: User exists but `is_admin` is false
**Solution**: Update database:
```sql
UPDATE users SET is_admin = true WHERE email = 'admin@pustak.com';
```

### Issue 3: Network error during login
**Cause**: Backend not running or wrong port
**Solution**: Start backend on port 5000

### Issue 4: Page refreshes but loses auth
**Cause**: localStorage being cleared or token has wrong key
**Solution**: Verify key name is exactly `'adminToken'` in both login and layout

## Files Modified

1. ✅ `pustak/frontend/src/pages/admin/AdminLayout.jsx` - Added auth check
2. ✅ `pustak/frontend/src/pages/admin/AdminLogin.jsx` - Added debug logging
3. ✅ `pustak/frontend/src/App.jsx` - Simplified route structure
4. ✅ `pustak/frontend/src/components/ProtectedRoute.jsx` - Enhanced with logging (optional now)

## Testing Commands

### Clear localStorage and test:
```javascript
// In browser console (F12)
localStorage.clear()
location.href = '/admin/login'
```

### Check current token:
```javascript
// In browser console
console.log('Token:', localStorage.getItem('adminToken'))
```

### Manual navigation test:
```javascript
// In browser console - should redirect to login if no token
location.href = '/admin'
```

## Success Indicators

After applying the fix, you should see:

✅ Login page loads at `/admin/login`  
✅ Can submit login form with admin credentials  
✅ Console shows successful login logs  
✅ Automatically redirects to `/admin`  
✅ Admin dashboard loads with sidebar  
✅ Stats cards display  
✅ Can navigate between admin sections  
✅ Refresh works without losing authentication  
✅ Logout redirects back to login  

If all indicators are ✅, the fix is successful!

# Pustak Admin Panel - Quick Reference Card

## 🚀 Quick Setup (5 Minutes)

```bash
# 1. Generate admin password hash
cd pustak/Backend
node generate_admin_hash.js

# 2. Run database setup (copy the generated hash first)
psql -U postgres -d pustak -f setup_admin.sql

# 3. Start backend (Terminal 1)
cd pustak/Backend
npm start

# 4. Start frontend (Terminal 2)
cd pustak/frontend
npm run dev

# 5. Access admin panel
# Open browser: http://localhost:5173/admin/login
# Login: admin@pustak.com / admin123
```

## 📁 Project Structure

```
pustak/
├── Backend/
│   ├── src/
│   │   ├── controllers/adminController.js    ← Admin handlers
│   │   ├── services/adminService.js          ← Admin logic
│   │   ├── routes/adminRoutes.js             ← Admin routes
│   │   └── middlewares/adminAuth.js          ← Auth middleware
│   ├── server.js                             ← (Updated)
│   └── generate_admin_hash.js                ← Password tool
│
├── frontend/
│   ├── src/
│   │   ├── pages/admin/                      ← All admin pages
│   │   │   ├── AdminLogin.jsx
│   │   │   ├── AdminLayout.jsx
│   │   │   ├── AdminDashboard.jsx
│   │   │   ├── AdminBooks.jsx
│   │   │   ├── AdminUsers.jsx
│   │   │   ├── AdminOrders.jsx
│   │   │   ├── AdminReviews.jsx
│   │   │   └── AdminAnalytics.jsx
│   │   ├── styles/admin.css                  ← Admin styles
│   │   └── App.jsx                           ← (Updated)
│
├── database/
│   └── schema/admin_schema.sql               ← Schema updates
│
├── setup_admin.sql                           ← Setup script
├── ADMIN_PANEL_README.md                     ← Full docs
├── ADMIN_SETUP_GUIDE.md                      ← Setup guide
└── ADMIN_FEATURES.md                         ← Features list
```

## 🔑 Default Credentials

```
Email:    admin@pustak.com
Password: admin123
⚠️ CHANGE AFTER FIRST LOGIN!
```

## 🌐 URLs

```
Frontend:  http://localhost:5173
Backend:   http://localhost:5000

Admin Login:     /admin/login
Admin Dashboard: /admin
Books:           /admin/books
Users:           /admin/users
Orders:          /admin/orders
Reviews:         /admin/reviews
Analytics:       /admin/analytics
```

## 🔗 API Endpoints

```
Base URL: http://localhost:5000/api/admin
Auth Header: Authorization: Bearer <token>

Dashboard:
  GET    /dashboard

Books:
  GET    /books
  GET    /books/:id
  POST   /books
  PUT    /books/:id
  DELETE /books/:id
  PATCH  /books/:id/stock

Users:
  GET    /users
  GET    /users/:id
  PATCH  /users/:id/status

Orders:
  GET    /orders
  GET    /orders/:id
  PATCH  /orders/:id/status

Reviews:
  GET    /reviews
  PATCH  /reviews/:id/visibility
  DELETE /reviews/:id

Analytics:
  GET    /analytics
  GET    /analytics/bestsellers
  GET    /analytics/low-stock
```

## 💾 Key Database Tables

```sql
-- Admin user column
users.is_admin (BOOLEAN)

-- New tables
reviews
book_copies
book_category
addresses
admin_activity_log
homepage_banners
featured_books
discounts
```

## 🔨 Common SQL Commands

```sql
-- Make user admin
UPDATE users SET is_admin = TRUE WHERE email = 'user@example.com';

-- Check admin users
SELECT user_id, name, email, is_admin FROM users WHERE is_admin = TRUE;

-- View admin logs
SELECT * FROM admin_activity_log ORDER BY created_at DESC LIMIT 50;

-- Get book stock
SELECT b.book_name, SUM(bc.available_stock) as stock
FROM books b
LEFT JOIN book_copies bc ON b.id = bc.book_id
GROUP BY b.id, b.book_name;

-- Get order statistics
SELECT status, COUNT(*) FROM orders GROUP BY status;
```

## 🎨 CSS Classes Reference

```css
/* Layout */
.admin-layout
.admin-sidebar
.admin-main

/* Pages */
.admin-page
.admin-header
.admin-dashboard

/* Components */
.stat-card
.admin-table
.admin-filters
.search-box
.modal-overlay
.modal-content

/* Status Badges */
.status-badge.success    /* Green */
.status-badge.danger     /* Red */
.status-badge.warning    /* Orange */
.status-badge.info       /* Blue */
.status-badge.primary    /* Light Blue */

/* Buttons */
.btn-primary
.btn-secondary
.btn-danger
.btn-success
.btn-icon

/* Forms */
.form-group
.form-row
.checkbox-group
```

## 🐛 Troubleshooting

### Can't Login
```sql
-- Check admin status
SELECT email, is_admin FROM users WHERE email = 'admin@pustak.com';

-- Set admin
UPDATE users SET is_admin = TRUE WHERE email = 'admin@pustak.com';
```

### Missing Tables
```bash
psql -U postgres -d pustak -f setup_admin.sql
```

### CORS Error
```javascript
// In server.js (already configured)
app.use(cors());
```

### Port Already in Use
```bash
# Kill process on port 5000
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Or use different port in .env
PORT=5001
```

## 🔐 Security Checklist

```
✅ Change default admin password
✅ Use strong JWT secret
✅ Enable HTTPS in production
✅ Implement rate limiting
✅ Regular database backups
✅ Monitor admin activity logs
✅ Use environment variables
✅ Keep dependencies updated
```

## 📝 Creating a New Admin

```javascript
// Using bcrypt in Node.js
const bcrypt = require('bcrypt');
const password = 'your_secure_password';
bcrypt.hash(password, 10, (err, hash) => {
  console.log('Hash:', hash);
});
```

```sql
-- Insert new admin
INSERT INTO users (name, email, password_hash, is_admin, status)
VALUES ('Admin Name', 'admin@example.com', 'bcrypt_hash_here', TRUE, 'Active');
```

## 🧪 Testing Checklist

```
Dashboard:
  ☐ Statistics display correctly
  ☐ Recent activities show
  ☐ Quick stats update

Books:
  ☐ Search works
  ☐ Filters work
  ☐ Can add book
  ☐ Can edit book
  ☐ Can delete book
  ☐ Stock updates

Users:
  ☐ User list loads
  ☐ Search works
  ☐ Can view details
  ☐ Can block/unblock

Orders:
  ☐ Order list loads
  ☐ Can view details
  ☐ Status updates

Reviews:
  ☐ Review list loads
  ☐ Can hide/show
  ☐ Can delete

Analytics:
  ☐ Date range works
  ☐ Best sellers show
  ☐ Low stock alerts
```

## 💡 Pro Tips

```
1. Use browser DevTools (F12) to debug
2. Check Network tab for API errors
3. Console tab shows JavaScript errors
4. Keep terminal logs visible
5. Test with different browsers
6. Use incognito for clean testing
7. Clear localStorage if auth issues
8. Backup database before bulk operations
```

## 🆘 Emergency Commands

```bash
# Stop all Node processes
taskkill /F /IM node.exe

# Restart PostgreSQL
net stop postgresql-x64-XX
net start postgresql-x64-XX

# Clear npm cache
npm cache clean --force

# Reinstall dependencies
rm -rf node_modules
npm install

# Reset to last commit
git reset --hard HEAD
```

## 📞 Support Resources

```
Documentation:     ADMIN_PANEL_README.md
Setup Guide:       ADMIN_SETUP_GUIDE.md
Features List:     ADMIN_FEATURES.md
Database Setup:    setup_admin.sql
```

## 🎯 Quick Feature Guide

```
Need to...                 Go to...
─────────────────────────  ─────────────────────
View statistics            Dashboard
Add/edit books             Books
Manage inventory           Books → Stock
Handle customers           Users
Process orders             Orders
Moderate reviews           Reviews
View sales reports         Analytics
Check low stock            Analytics → Low Stock
Find best sellers          Analytics → Best Sellers
Update order status        Orders → View Details
Block a user               Users → View Details
Hide a review              Reviews → Hide button
```

---

**Remember**: Always backup your database before making bulk changes!

**Need Help?** Check the full documentation in `ADMIN_PANEL_README.md`

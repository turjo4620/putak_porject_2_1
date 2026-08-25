# Pustak Admin Panel Documentation

## Overview
The Pustak Admin Panel is a comprehensive management system for the online bookstore. It provides administrators with full control over books, users, orders, reviews, and analytics.

## Features Implemented

### ✅ Dashboard
- Total counts: Books, Users, Authors, Orders, Reviews
- Revenue statistics
- Pending orders count
- Low stock and out-of-stock alerts
- Recent activity feed
- Quick stats overview

### ✅ Book Management
- View all books with pagination
- Search by title or ISBN
- Filter by category and availability status
- Add new books with complete information:
  - Title, ISBN, Cover Image
  - Authors (multiple selection)
  - Publications (multiple selection)
  - Categories (multiple selection)
  - Price, Discount Price
  - Language, Pages, Edition
  - Stock quantity management
  - Availability status
  - Description
- Edit existing books
- Delete books
- Update stock levels
- View stock status (in stock, low stock, out of stock)

### ✅ User Management
- View all registered users
- Search by name or email
- Filter by status (Active/Blocked)
- View user details:
  - Personal information
  - Order history
  - Review count
  - Total spending
  - Last login time
- Block/Unblock users
- View user activity statistics

### ✅ Order Management
- View all orders with pagination
- Search by order number or customer name
- Filter by order status
- View detailed order information:
  - Customer details
  - Shipping address
  - Order items with quantities
  - Total amount
  - Payment information
  - Delivery tracking
- Update order status:
  - Pending
  - Confirmed
  - Processing
  - Shipped
  - Delivered
  - Cancelled
  - Returned

### ✅ Review Management
- View all customer reviews
- Filter reviews by book or visibility status
- View review details:
  - Rating (1-5 stars)
  - Review text
  - Customer name
  - Book name
  - Date posted
- Hide/Show reviews (toggle visibility)
- Delete inappropriate reviews

### ✅ Analytics & Reports
- Date range selection for custom reports
- Sales analytics:
  - Total revenue
  - Order counts
  - Daily sales trends
- Best-selling books:
  - Total units sold
  - Order count
  - Revenue generated
- Popular categories:
  - Book count per category
  - Order count per category
- Inventory alerts:
  - Low stock books (< 10 units)
  - Out of stock books

## Database Setup

1. **Run the admin schema SQL file:**
```bash
psql -U your_username -d your_database -f database/schema/admin_schema.sql
```

This will:
- Add `is_admin` column to users table
- Create `reviews` table (if not exists)
- Create `book_copies` table (if not exists)
- Create `book_category` table (if not exists)
- Create `addresses` table (if not exists)
- Create `admin_activity_log` table
- Create `homepage_banners` table
- Create `featured_books` table
- Create `discounts` table
- Insert default admin user

2. **Default Admin Credentials:**
```
Email: admin@pustak.com
Password: admin123
```

⚠️ **IMPORTANT:** Change the default password after first login!

## Backend Setup

The admin routes are already integrated into the backend server. The following files have been added:

### New Files:
- `src/services/adminService.js` - Admin business logic
- `src/controllers/adminController.js` - Admin request handlers
- `src/routes/adminRoutes.js` - Admin API routes
- `src/middlewares/adminAuth.js` - Admin authentication middleware

### Updated Files:
- `server.js` - Admin routes registered

### API Endpoints:

#### Dashboard
- `GET /api/admin/dashboard` - Get dashboard statistics

#### Books
- `GET /api/admin/books` - Get all books (with filters)
- `GET /api/admin/books/:id` - Get book by ID
- `POST /api/admin/books` - Create new book
- `PUT /api/admin/books/:id` - Update book
- `DELETE /api/admin/books/:id` - Delete book
- `PATCH /api/admin/books/:id/stock` - Update stock

#### Users
- `GET /api/admin/users` - Get all users (with filters)
- `GET /api/admin/users/:id` - Get user details
- `PATCH /api/admin/users/:id/status` - Update user status

#### Orders
- `GET /api/admin/orders` - Get all orders (with filters)
- `GET /api/admin/orders/:id` - Get order details
- `PATCH /api/admin/orders/:id/status` - Update order status

#### Reviews
- `GET /api/admin/reviews` - Get all reviews (with filters)
- `PATCH /api/admin/reviews/:id/visibility` - Toggle review visibility
- `DELETE /api/admin/reviews/:id` - Delete review

#### Analytics
- `GET /api/admin/analytics` - Get analytics data
- `GET /api/admin/analytics/bestsellers` - Get best-selling books
- `GET /api/admin/analytics/low-stock` - Get low stock books

## Frontend Setup

### New Files Created:
- `src/pages/admin/AdminLogin.jsx` - Admin login page
- `src/pages/admin/AdminLayout.jsx` - Admin panel layout with sidebar
- `src/pages/admin/AdminDashboard.jsx` - Dashboard page
- `src/pages/admin/AdminBooks.jsx` - Book management page
- `src/pages/admin/AdminUsers.jsx` - User management page
- `src/pages/admin/AdminOrders.jsx` - Order management page
- `src/pages/admin/AdminReviews.jsx` - Review management page
- `src/pages/admin/AdminAnalytics.jsx` - Analytics page
- `src/styles/admin.css` - Complete admin panel styles

### Updated Files:
- `src/App.jsx` - Admin routes added

### Routes:
- `/admin/login` - Admin login page
- `/admin` - Admin dashboard
- `/admin/books` - Book management
- `/admin/users` - User management
- `/admin/orders` - Order management
- `/admin/reviews` - Review management
- `/admin/analytics` - Analytics & reports

## How to Use

### 1. Start the Backend
```bash
cd pustak/Backend
npm install
npm start
```

### 2. Start the Frontend
```bash
cd pustak/frontend
npm install
npm run dev
```

### 3. Access Admin Panel
1. Navigate to `http://localhost:5173/admin/login`
2. Login with default credentials:
   - Email: `admin@pustak.com`
   - Password: `admin123`
3. You'll be redirected to the admin dashboard

### 4. Making a User Admin
To grant admin privileges to an existing user:

```sql
UPDATE users 
SET is_admin = TRUE 
WHERE email = 'user@example.com';
```

## Security Notes

1. **Authentication:** All admin routes are protected by the `verifyAdmin` middleware
2. **Token-based:** Uses JWT tokens stored in localStorage
3. **Role-based:** Only users with `is_admin = TRUE` can access admin panel
4. **Change Default Password:** After first login, update the default admin password

## Additional Features to Implement (Future)

The following features can be added based on requirements:

1. **Author Management Page**
   - Add, edit, delete authors
   - Manage author photos and biographies

2. **Publication Management Page**
   - Add, edit, delete publishers
   - Manage publisher information

3. **Category Management Page**
   - Add, edit, delete categories
   - Support for subcategories
   - Organize category hierarchy

4. **Discount Management**
   - Create and manage discounts
   - Apply discounts to books or categories
   - Set discount dates and limits

5. **Homepage Content Management**
   - Manage homepage banners
   - Select featured books
   - Configure new arrivals and bestseller sections

6. **Settings Page**
   - Admin profile management
   - System configuration
   - Email templates
   - Payment gateway settings

7. **Activity Logs**
   - Track all admin actions
   - View change history
   - Audit trail

## Styling

The admin panel uses a modern, clean design with:
- Responsive layout
- Sidebar navigation
- Color-coded status badges
- Modal dialogs
- Data tables with sorting and pagination
- Search and filter capabilities
- Clean typography using system fonts

### Color Scheme:
- Primary: Blue (#3b82f6)
- Success: Green (#10b981)
- Warning: Orange (#f97316)
- Danger: Red (#ef4444)
- Background: Light gray (#f5f7fa)
- Sidebar: Dark slate (#1e293b)

## Troubleshooting

### Issue: Cannot login to admin panel
**Solution:** Ensure the user has `is_admin = TRUE` in the database

### Issue: 401 Unauthorized errors
**Solution:** Check that the JWT token is valid and hasn't expired

### Issue: Database errors
**Solution:** Verify all required tables exist by running the admin_schema.sql file

### Issue: CORS errors
**Solution:** Ensure CORS is enabled in server.js (already configured)

## Support

For issues or questions:
1. Check the console for error messages
2. Verify database schema is up to date
3. Ensure all dependencies are installed
4. Check API endpoints are accessible

## License

This admin panel is part of the Pustak project.

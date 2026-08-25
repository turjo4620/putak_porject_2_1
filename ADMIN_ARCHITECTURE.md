# Pustak Admin Panel - Architecture Overview

## 🏗️ System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         ADMIN PANEL                              │
│                    http://localhost:5173/admin                   │
└─────────────────────────────────────────────────────────────────┘
                              │
                              │ HTTP/REST API
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                      BACKEND SERVER                              │
│                    http://localhost:5000                         │
│                                                                   │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐          │
│  │   Routes     │→ │ Controllers  │→ │  Services    │          │
│  │ adminRoutes  │  │adminController│  │adminService  │          │
│  └──────────────┘  └──────────────┘  └──────────────┘          │
│         ↑                                      │                 │
│  ┌──────────────┐                             ▼                 │
│  │ Middlewares  │                    ┌──────────────┐          │
│  │  adminAuth   │                    │  PostgreSQL  │          │
│  └──────────────┘                    │   Database   │          │
│                                       └──────────────┘          │
└─────────────────────────────────────────────────────────────────┘
```

## 📊 Component Hierarchy

```
AdminLayout (Sidebar + Main Area)
│
├── AdminDashboard
│   ├── Stats Cards (8)
│   ├── Recent Activities
│   └── Quick Stats
│
├── AdminBooks
│   ├── Search & Filters
│   ├── Books Table
│   ├── Pagination
│   └── BookModal (Create/Edit)
│
├── AdminUsers
│   ├── Search & Filters
│   ├── Users Table
│   ├── Pagination
│   └── User Details Modal
│
├── AdminOrders
│   ├── Search & Filters
│   ├── Orders Table
│   ├── Pagination
│   └── Order Details Modal
│       ├── Customer Info
│       ├── Shipping Address
│       ├── Order Items
│       ├── Payment Info
│       └── Status Update
│
├── AdminReviews
│   ├── Reviews Table
│   ├── Pagination
│   └── Actions (Hide/Show/Delete)
│
└── AdminAnalytics
    ├── Date Range Filter
    ├── Summary Cards (4)
    ├── Best Selling Books
    ├── Popular Categories
    ├── Low Stock Alert
    └── Out of Stock Books
```

## 🔄 Data Flow

### Authentication Flow
```
1. User enters credentials in AdminLogin
   ↓
2. POST /api/auth/login
   ↓
3. Backend validates credentials
   ↓
4. Check is_admin = TRUE
   ↓
5. Generate JWT token
   ↓
6. Return token to frontend
   ↓
7. Store in localStorage
   ↓
8. Redirect to /admin
   ↓
9. All subsequent requests include token in Authorization header
```

### Data Fetching Flow
```
1. Component mounts (useEffect)
   ↓
2. Fetch data with GET request
   ↓
3. Include Authorization header
   ↓
4. Backend verifyAdmin middleware
   ↓
5. Controller handles request
   ↓
6. Service queries database
   ↓
7. Return data as JSON
   ↓
8. Component updates state
   ↓
9. UI re-renders with data
```

### Update Flow
```
1. User clicks edit/update button
   ↓
2. Modal opens with current data
   ↓
3. User modifies fields
   ↓
4. Submit form
   ↓
5. PUT/PATCH request to backend
   ↓
6. Backend validates
   ↓
7. Service updates database
   ↓
8. Return updated data
   ↓
9. Refresh list/close modal
   ↓
10. Show success message
```

## 🗂️ Database Schema

```
┌─────────────┐
│    users    │───────┐
│────────────│       │
│ user_id PK │       │
│ name       │       │
│ email      │       │
│ is_admin   │←──────┼─── Admin access control
│ status     │       │
└─────────────┘       │
                      │
┌─────────────┐       │
│    books    │       │
│────────────│       │
│ id PK       │       │
│ book_name   │       │
│ isbn        │       │
│ price       │       │
│ discount_pr │       │
└─────────────┘       │
      │               │
      │               │
┌─────────────┐       │
│book_copies  │       │
│────────────│       │
│ copy_id PK  │       │
│ book_id FK  │       │
│ avail_stock │←──────┼─── Stock management
└─────────────┘       │
      │               │
      │               │
┌─────────────┐       │
│   orders    │       │
│────────────│       │
│ order_id PK │       │
│ user_id FK  │───────┤
│ status      │       │
│ total_amt   │       │
└─────────────┘       │
      │               │
      │               │
┌─────────────┐       │
│order_items  │       │
│────────────│       │
│ order_it PK │       │
│ order_id FK │       │
│ copy_id FK  │       │
│ quantity    │       │
└─────────────┘       │
                      │
┌─────────────┐       │
│   reviews   │       │
│────────────│       │
│ review_id PK│       │
│ user_id FK  │───────┤
│ book_id FK  │       │
│ rating      │       │
│ is_hidden   │←──────┼─── Review moderation
└─────────────┘       │
                      │
┌─────────────┐       │
│admin_activ  │       │
│────────────│       │
│ log_id PK   │       │
│ admin_id FK │───────┘
│ action      │
│ resource    │
└─────────────┘
```

## 🔐 Security Layers

```
Layer 1: Login Authentication
         ├── Email/Password validation
         └── JWT token generation

Layer 2: Admin Role Check
         ├── is_admin column verification
         └── Reject non-admin users

Layer 3: Token Verification
         ├── Middleware: verifyAdmin
         ├── Check token validity
         └── Check token expiration

Layer 4: API Route Protection
         ├── All /api/admin/* routes protected
         └── Require valid admin token

Layer 5: Database Constraints
         ├── Foreign key constraints
         ├── Cascade deletes
         └── Data integrity checks
```

## 📡 API Request Cycle

```
Frontend Component
        │
        │ fetch('/api/admin/books', {
        │   headers: { 'Authorization': 'Bearer <token>' }
        │ })
        ▼
Express Router (/api/admin)
        │
        │ app.use('/api/admin', adminRoutes)
        ▼
Admin Middleware
        │
        │ verifyAdmin()
        │ ├── Extract token
        │ ├── Verify JWT
        │ └── Check is_admin
        ▼
Admin Controller
        │
        │ adminController.getAllBooks()
        │ ├── Parse query params
        │ └── Call service
        ▼
Admin Service
        │
        │ adminService.getAllBooks()
        │ ├── Build SQL query
        │ ├── Execute query
        │ └── Format results
        ▼
PostgreSQL Database
        │
        │ SELECT * FROM books...
        ▼
Return Response
        │
        │ res.json({ books, total, page })
        ▼
Frontend Component
        │
        │ setBooks(data.books)
        │ setTotalPages(data.totalPages)
        ▼
UI Update (React re-render)
```

## 🎨 Frontend State Management

```
AdminBooks Component
├── State
│   ├── books: []              ← Book list
│   ├── loading: true          ← Loading indicator
│   ├── page: 1                ← Current page
│   ├── totalPages: 1          ← Total pages
│   ├── searchTerm: ''         ← Search input
│   ├── filters: {}            ← Active filters
│   ├── showModal: false       ← Modal visibility
│   └── editingBook: null      ← Book being edited
│
├── Effects
│   └── useEffect([page, searchTerm, filters])
│       └── fetchBooks()       ← Auto-refetch on change
│
└── Actions
    ├── handleSearch()         ← Update searchTerm
    ├── handleFilter()         ← Update filters
    ├── handleCreate()         ← Open modal (create mode)
    ├── handleEdit()           ← Open modal (edit mode)
    ├── handleDelete()         ← Delete with confirmation
    └── handleSubmit()         ← Save changes
```

## 📦 Module Dependencies

### Backend
```
express         → Web framework
cors            → Cross-origin requests
bcrypt          → Password hashing
jsonwebtoken    → JWT authentication
pg              → PostgreSQL client
dotenv          → Environment variables
```

### Frontend
```
react           → UI library
react-dom       → React rendering
react-router    → Routing
lucide-react    → Icons
vite            → Build tool
```

## 🔄 Request/Response Examples

### Login Request
```javascript
POST /api/auth/login
Body: {
  "email": "admin@pustak.com",
  "password": "admin123"
}

Response: {
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "user_id": 999999,
    "name": "Admin User",
    "email": "admin@pustak.com",
    "is_admin": true
  }
}
```

### Get Books Request
```javascript
GET /api/admin/books?page=1&limit=20&search=harry
Headers: {
  "Authorization": "Bearer <token>"
}

Response: {
  "books": [
    {
      "id": 1,
      "book_name": "Harry Potter",
      "isbn": "978-...",
      "price": 599.00,
      "authors": [{"author_id": 1, "name": "J.K. Rowling"}],
      "categories": [{"category_id": 5, "category_name": "Fiction"}],
      "total_stock": 45
    }
  ],
  "total": 100,
  "page": 1,
  "totalPages": 5
}
```

### Update Order Status
```javascript
PATCH /api/admin/orders/123/status
Headers: {
  "Authorization": "Bearer <token>"
}
Body: {
  "status": "Shipped"
}

Response: {
  "order_id": 123,
  "status": "Shipped",
  "updated_at": "2024-01-15T10:30:00Z"
}
```

## 🎯 Performance Considerations

```
Database Level:
├── Indexes on foreign keys
├── Pagination for large datasets
├── Efficient JOIN queries
└── Connection pooling

Backend Level:
├── Middleware caching
├── Query optimization
├── Batch operations
└── Error handling

Frontend Level:
├── Lazy loading
├── Debounced search
├── Conditional rendering
└── Optimistic updates
```

## 🧪 Testing Strategy

```
Unit Tests:
├── Service functions
├── Controller handlers
├── Utility functions
└── Validation logic

Integration Tests:
├── API endpoints
├── Database operations
├── Authentication flow
└── CRUD operations

E2E Tests:
├── Login flow
├── Book management
├── Order processing
└── User actions
```

---

This architecture provides a solid, scalable foundation for the Pustak admin panel with clear separation of concerns and maintainable code structure.

-- Add admin column to users table
ALTER TABLE users ADD COLUMN IF NOT EXISTS is_admin BOOLEAN DEFAULT FALSE;

-- Create reviews table (if not exists)
CREATE TABLE IF NOT EXISTS reviews (
    review_id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    book_id INTEGER NOT NULL REFERENCES books(id) ON DELETE CASCADE,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    review_text TEXT,
    review_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_hidden BOOLEAN DEFAULT FALSE,
    UNIQUE(user_id, book_id)
);

CREATE INDEX IF NOT EXISTS idx_reviews_book_id ON reviews(book_id);
CREATE INDEX IF NOT EXISTS idx_reviews_user_id ON reviews(user_id);

-- Create book_copies table (if not exists)
CREATE TABLE IF NOT EXISTS book_copies (
    copy_id SERIAL PRIMARY KEY,
    book_id INTEGER NOT NULL REFERENCES books(id) ON DELETE CASCADE,
    available_stock INTEGER NOT NULL DEFAULT 0,
    condition VARCHAR(50) DEFAULT 'New'
);

CREATE INDEX IF NOT EXISTS idx_book_copies_book_id ON book_copies(book_id);

-- Create book_category table (if not exists)
CREATE TABLE IF NOT EXISTS book_category (
    book_id INTEGER NOT NULL REFERENCES books(id) ON DELETE CASCADE,
    category_id INTEGER NOT NULL REFERENCES categories(category_id) ON DELETE CASCADE,
    PRIMARY KEY (book_id, category_id)
);

-- Create addresses table (if not exists)
CREATE TABLE IF NOT EXISTS addresses (
    address_id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    street_address TEXT,
    city VARCHAR(100),
    postal_code VARCHAR(20),
    country VARCHAR(100),
    is_default BOOLEAN DEFAULT FALSE
);

CREATE INDEX IF NOT EXISTS idx_addresses_user_id ON addresses(user_id);

-- Create admin_activity_log table
CREATE TABLE IF NOT EXISTS admin_activity_log (
    log_id SERIAL PRIMARY KEY,
    admin_id INTEGER NOT NULL REFERENCES users(user_id),
    action VARCHAR(100) NOT NULL,
    resource_type VARCHAR(50),
    resource_id INTEGER,
    details TEXT,
    ip_address VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_admin_log_admin_id ON admin_activity_log(admin_id);
CREATE INDEX IF NOT EXISTS idx_admin_log_created_at ON admin_activity_log(created_at);

-- Create homepage_banners table for content management
CREATE TABLE IF NOT EXISTS homepage_banners (
    banner_id SERIAL PRIMARY KEY,
    title VARCHAR(200),
    subtitle TEXT,
    image_url TEXT NOT NULL,
    link_url TEXT,
    display_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    start_date TIMESTAMP,
    end_date TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create featured_books table
CREATE TABLE IF NOT EXISTS featured_books (
    featured_id SERIAL PRIMARY KEY,
    book_id INTEGER NOT NULL REFERENCES books(id) ON DELETE CASCADE,
    section VARCHAR(50) NOT NULL, -- 'featured', 'bestseller', 'new-arrival', 'promotional'
    display_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    start_date TIMESTAMP,
    end_date TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_featured_books_section ON featured_books(section);
CREATE INDEX IF NOT EXISTS idx_featured_books_active ON featured_books(is_active);

-- Create discounts table (enhanced version of coupons)
CREATE TABLE IF NOT EXISTS discounts (
    discount_id SERIAL PRIMARY KEY,
    discount_name VARCHAR(200) NOT NULL,
    discount_type VARCHAR(50) NOT NULL, -- 'percentage', 'fixed'
    discount_value DECIMAL(10, 2) NOT NULL,
    applies_to VARCHAR(50), -- 'all', 'category', 'book'
    target_id INTEGER, -- category_id or book_id
    min_purchase_amount DECIMAL(10, 2),
    max_discount_amount DECIMAL(10, 2),
    start_date TIMESTAMP,
    end_date TIMESTAMP,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_discounts_active ON discounts(is_active);
CREATE INDEX IF NOT EXISTS idx_discounts_dates ON discounts(start_date, end_date);

-- Insert a default admin user (password: admin123 - hashed with bcrypt)
-- Password should be changed after first login
-- Run: node generate_admin_hash.js to get the correct hash
-- INSERT INTO users (user_id, name, email, phone_number, password_hash, status, is_admin)
-- VALUES (
--     999999,
--     'Admin User',
--     'admin@pustak.com',
--     '0000000000',
--     'REPLACE_WITH_GENERATED_HASH',
--     'Active',
--     TRUE
-- )
-- ON CONFLICT (user_id) DO NOTHING;

-- Grant admin privileges to existing user (example - update as needed)
-- UPDATE users SET is_admin = TRUE WHERE email = 'youremail@example.com';

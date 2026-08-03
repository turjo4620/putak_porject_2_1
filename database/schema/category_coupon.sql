CREATE TABLE categories (
    category_id SERIAL PRIMARY KEY,
    category_name VARCHAR(100) NOT NULL
);

CREATE TABLE coupons (
    coupon_id SERIAL PRIMARY KEY,
    code VARCHAR(50) UNIQUE NOT NULL,
    description TEXT,
    discount_value DECIMAL(10, 2) NOT NULL,
    status VARCHAR(20) DEFAULT 'Active',
    usage_limit INTEGER,
    min_order_amount DECIMAL(10, 2),
    max_order_amount DECIMAL(10, 2),
    start_date TIMESTAMP,
    end_date TIMESTAMP
);
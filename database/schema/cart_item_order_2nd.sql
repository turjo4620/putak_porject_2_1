CREATE TABLE cart_items (
    cart_item_id SERIAL PRIMARY KEY,
    cart_id INTEGER NOT NULL REFERENCES carts(cart_id) ON DELETE CASCADE,
    book_id INTEGER NOT NULL REFERENCES books(book_id),
    quantity INTEGER DEFAULT 1,
    locked_mrp DECIMAL(10, 2),
    locked_discounted_price DECIMAL(10, 2)
);

CREATE TABLE orders (
    order_id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(user_id),
    address_id INTEGER REFERENCES addresses(address_id),
    coupon_id INTEGER REFERENCES coupons(coupon_id),
    order_number VARCHAR(50) UNIQUE NOT NULL,
    total_amount DECIMAL(10, 2) NOT NULL,
    order_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(50) DEFAULT 'Pending'
);
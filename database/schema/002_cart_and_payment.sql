-- ============================================================
-- Drop existing tables
-- ============================================================

DROP TABLE IF EXISTS cart_item CASCADE;
DROP TABLE IF EXISTS cart CASCADE;
DROP TABLE IF EXISTS payment CASCADE;


-- ============================================================
-- Adds: cart, cart_item, payment
-- Does NOT touch: books, users, orders, book_copy, order_item,
-- return, refund
-- ============================================================


-- One active cart per user
CREATE TABLE IF NOT EXISTS cart (
    cart_id BIGSERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL UNIQUE
        REFERENCES users(user_id) ON DELETE CASCADE,
    status VARCHAR(50) NOT NULL DEFAULT 'active',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);


-- Cart lines are by BOOK, not by a specific physical copy
-- locked_price freezes the price shown when it was added
CREATE TABLE IF NOT EXISTS cart_item (
    cart_item_id BIGSERIAL PRIMARY KEY,
    cart_id BIGINT NOT NULL
        REFERENCES cart(cart_id) ON DELETE CASCADE,
    book_id INTEGER NOT NULL
        REFERENCES books(id) ON DELETE CASCADE,
    quantity INTEGER NOT NULL DEFAULT 1
        CHECK (quantity > 0),
    locked_price NUMERIC(10,2) NOT NULL,

    UNIQUE (cart_id, book_id)
);


-- ============================================================
-- Indexes
-- ============================================================

CREATE INDEX IF NOT EXISTS idx_cart_item_cart_id
    ON cart_item(cart_id);

CREATE INDEX IF NOT EXISTS idx_payment_order_id
    ON payment(order_id);
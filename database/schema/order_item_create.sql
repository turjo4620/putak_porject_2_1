-- ============================================================
-- Order items table schema
-- This table stores individual items in each order
-- Each row represents one physical book copy in an order
-- ============================================================

DROP TABLE IF EXISTS order_item CASCADE;

CREATE TABLE order_item (
    order_item_id SERIAL PRIMARY KEY,
    order_id INTEGER NOT NULL REFERENCES orders(order_id) ON DELETE CASCADE,
    copy_id INTEGER NOT NULL REFERENCES book_copies(copy_id),
    price_sold DECIMAL(10, 2) NOT NULL,
    quantity INTEGER NOT NULL DEFAULT 1
);

-- Create index for faster queries
CREATE INDEX idx_order_item_order_id ON order_item(order_id);
CREATE INDEX idx_order_item_copy_id ON order_item(copy_id);

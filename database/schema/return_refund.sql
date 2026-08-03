CREATE TABLE returns (
    return_id SERIAL PRIMARY KEY,
    order_item_id INTEGER NOT NULL REFERENCES order_items(order_item_id),
    request_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    reason TEXT,
    status VARCHAR(50) DEFAULT 'Requested',
    quantity INTEGER DEFAULT 1,
    approved_at TIMESTAMP
);

CREATE TABLE refunds (
    refund_id SERIAL PRIMARY KEY,
    return_id INTEGER NOT NULL REFERENCES returns(return_id),
    payment_id INTEGER REFERENCES payments(payment_id),
    amount DECIMAL(10, 2) NOT NULL,
    status VARCHAR(50) DEFAULT 'Pending'
);
CREATE TABLE mfs_payments (
    payment_id INTEGER PRIMARY KEY REFERENCES payments(payment_id) ON DELETE CASCADE,
    sender_mobile_no VARCHAR(20),
    provider_name VARCHAR(50)
);

CREATE TABLE card_payments (
    payment_id INTEGER PRIMARY KEY REFERENCES payments(payment_id) ON DELETE CASCADE,
    card_last_4_digits CHAR(4),
    bank_name VARCHAR(100),
    card_brand VARCHAR(50)
);

CREATE TABLE cash_on_deliveries (
    payment_id INTEGER PRIMARY KEY REFERENCES payments(payment_id) ON DELETE CASCADE,
    collected_by VARCHAR(100),
    collection_date TIMESTAMP
);
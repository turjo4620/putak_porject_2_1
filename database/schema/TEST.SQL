SELECT * FROM USERS
WHERE user_id = 1;

SELECT * FROM orders
WHERE order_id = 1;



SELECT * FROM cart;

SELECT * FROM cart_item;


SELECT * FROM order_item
WHERE order_item_id = 1;

SELECT * FROM books
WHERE id = 1;

-- ALTER TABLE cart_item
-- DROP COLUMN locked_price;

-- ALTER TABLE order_item DROP COLUMN quantity;


SELECT * FROM deliveries;



SELECT * FROM payments
WHERE payment_id = 1;

SELECT * FROM mfs_payments;

-- CREATE TABLE courier (
--     courier_id SERIAL PRIMARY KEY,
--     name VARCHAR(100) UNIQUE NOT NULL
-- );
-- INSERT INTO courier (name) VALUES ('Pathao'), ('RedX'), ('Sundarban');
-- -- Add the new Foreign Key column
-- ALTER TABLE deliveries
-- ADD COLUMN courier_id INTEGER REFERENCES courier(courier_id);
 
-- -- Drop the old 3NF-violating text column
-- ALTER TABLE deliveries
-- DROP COLUMN courier_name;

SELECT * FROM deliveries;

SELECT * FROM RETURN;

SELECT * FROM refund;


-- -- Fix the RETURN table
-- ALTER TABLE return 
-- DROP COLUMN user_id, 
-- DROP COLUMN copy_id, 
-- DROP COLUMN refund_status;

-- -- Fix the REFUND table
-- ALTER TABLE refund 
-- DROP COLUMN original_amount;


-- ALTER TABLE return ADD COLUMN approved_at TIMESTAMPTZ;




SELECT* FROM books WHERE id = 1;
SELECT* FROM authors WHERE author_id = 1;
SELECT* FROM publications WHERE publication_id = 1;
SELECT* FROM categories WHERE category_id = 1;
SELECT* FROM book_author WHERE book_id = 1;
SELECT* FROM book_publication_create WHERE book_id = 1;
SELECT* FROM book_category WHERE book_id = 1;

-- ALTER TABLE books
-- DROP COLUMN authors,
-- DROP COLUMN publisher,
-- DROP COLUMN category,
-- DROP COLUMN discount_percentage;

SELECT * FROM addresses
WHERE address_id = 1;

SELECT * FROM reviews;


CREATE TABLE admin (
    admin_id SERIAL PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    role VARCHAR(50) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    phone_number VARCHAR(20),
    status VARCHAR(50) NOT NULL DEFAULT 'Active'
);
 

 CREATE TABLE admin_activity_log (
    log_id SERIAL PRIMARY KEY,
    admin_id INT NOT NULL REFERENCES admin(admin_id),
    action VARCHAR(100) NOT NULL,
    entity_type VARCHAR(50) NOT NULL,
    entity_id INT NOT NULL,
    details JSONB,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);
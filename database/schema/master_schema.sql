-- ================================================================
-- PUSTAK — MASTER SCHEMA
-- E-Commerce Bookstore  |  PostgreSQL
--
-- Execution order is top-to-bottom.
-- Run once on a clean database; use migrations for incremental
-- changes on an existing live database.
--
-- Sections:
--   1. Extensions & Helpers
--   2. User Domain      (users, customer, admin, addresses)
--   3. Catalogue Domain (authors, publications, categories,
--                        books, book_copy, junction tables)
--   4. Shopping Domain  (cart, cart_item, wishlist, wishlist_item)
--   5. Order Domain     (coupons, orders, order_items)
--   6. Payment Domain   (payments + ISA subtypes)
--   7. Logistics Domain (couriers, deliveries)
--   8. Post-Purchase    (reviews, returns, refunds,
--                        admin_activity_log)
--   9. Triggers
-- ================================================================


-- ================================================================
-- SECTION 1 — Extensions & Helpers
-- ================================================================

-- pgcrypto is useful for gen_random_uuid() if needed later
-- CREATE EXTENSION IF NOT EXISTS pgcrypto;


-- ================================================================
-- SECTION 2 — User Domain
-- ================================================================

-- ----------------------------------------------------------------
-- 2a. Core user table  (supertype of ISA hierarchy)
-- ----------------------------------------------------------------
CREATE TABLE IF NOT EXISTS users (
    user_id       BIGINT        PRIMARY KEY,
    name          VARCHAR(255)  NOT NULL,
    email         VARCHAR(255)  NOT NULL UNIQUE,
    phone_number  VARCHAR(20),
    password_hash VARCHAR(255)  NOT NULL,
    role          VARCHAR(50)   NOT NULL DEFAULT 'customer'
                                CHECK (role IN ('customer', 'admin')),
    status        VARCHAR(50)   NOT NULL DEFAULT 'Active'
                                CHECK (status IN ('Active', 'Inactive', 'Banned')),
    created_at    TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    last_login    TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_users_email  ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role   ON users(role);

-- ----------------------------------------------------------------
-- 2b. CUSTOMER  ISA → users
--     Relationship: USER OWNS (customer profile)
-- ----------------------------------------------------------------
CREATE TABLE IF NOT EXISTS customer (
    user_id             BIGINT  PRIMARY KEY
        REFERENCES users(user_id) ON DELETE CASCADE,
    newsletter_opt_in   BOOLEAN NOT NULL DEFAULT FALSE
);

-- ----------------------------------------------------------------
-- 2c. ADMIN  ISA → users
--     Relationship: ADMIN CREATES coupons, ADMIN PROCESSES returns
-- ----------------------------------------------------------------
CREATE TABLE IF NOT EXISTS admin (
    user_id        BIGINT       PRIMARY KEY
        REFERENCES users(user_id) ON DELETE CASCADE,
    admin_level    VARCHAR(50),
    department     VARCHAR(100)
);

-- ----------------------------------------------------------------
-- 2d. ADDRESSES
--     Relationship: USER HAS [1:N] ADDRESS
--                   ORDER SHIPS_TO [N:1] ADDRESS
-- ----------------------------------------------------------------
CREATE TABLE IF NOT EXISTS addresses (
    address_id      BIGSERIAL    PRIMARY KEY,
    user_id         BIGINT       NOT NULL
        REFERENCES users(user_id) ON DELETE CASCADE,
    label           VARCHAR(50)  DEFAULT 'Home',   -- 'Home','Work','Other'
    street_address  TEXT         NOT NULL,
    city            VARCHAR(100) NOT NULL,
    postal_code     VARCHAR(20),
    country         VARCHAR(100) NOT NULL DEFAULT 'Bangladesh',
    is_default      BOOLEAN      NOT NULL DEFAULT FALSE,
    created_at      TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_addresses_user_id ON addresses(user_id);


-- ================================================================
-- SECTION 3 — Catalogue Domain
-- ================================================================

-- ----------------------------------------------------------------
-- 3a. AUTHORS
--     Relationship: BOOK WRITTEN_BY [M:N] AUTHOR  → book_author
-- ----------------------------------------------------------------
CREATE TABLE IF NOT EXISTS authors (
    author_id  BIGSERIAL    PRIMARY KEY,
    name       VARCHAR(150) NOT NULL,
    bio        TEXT,
    photo_url  VARCHAR(255)
);

-- ----------------------------------------------------------------
-- 3b. PUBLICATIONS  (Publishers)
--     Relationship: BOOK PUBLISHED_BY [M:N] PUBLICATION
--                   → publication_book
-- ----------------------------------------------------------------
CREATE TABLE IF NOT EXISTS publications (
    publication_id  BIGSERIAL    PRIMARY KEY,
    title           VARCHAR(150) NOT NULL,  -- publisher name
    bio             TEXT,
    cover_image_url VARCHAR(255)
);

-- ----------------------------------------------------------------
-- 3c. CATEGORIES
--     Relationship: BOOK BELONGS_TO [M:N] CATEGORY  → book_category
-- ----------------------------------------------------------------
CREATE TABLE IF NOT EXISTS categories (
    category_id   BIGSERIAL    PRIMARY KEY,
    category_name VARCHAR(100) NOT NULL UNIQUE
);

-- ----------------------------------------------------------------
-- 3d. BOOKS  (conceptual title — NOT a physical object)
-- ----------------------------------------------------------------
CREATE TABLE IF NOT EXISTS books (
    id                   BIGSERIAL      PRIMARY KEY,
    book_name            TEXT           NOT NULL,
    isbn                 VARCHAR(20),
    language             VARCHAR(50),
    num_pages            INTEGER        CHECK (num_pages > 0),
    edition              VARCHAR(50),
    price                NUMERIC(10,2)  CHECK (price >= 0),
    discount_price       NUMERIC(10,2)  CHECK (discount_price >= 0),
    discount_percentage  VARCHAR(20),           -- derived; managed by trigger
    rating               NUMERIC(4,2)           -- derived; managed by trigger
                         CHECK (rating >= 0 AND rating <= 5),
    num_reviews          INTEGER        NOT NULL DEFAULT 0,
    availability         VARCHAR(30)    NOT NULL DEFAULT 'Out of Stock'
                         CHECK (availability IN ('In Stock','Out of Stock','Pre-Order')),
    description          TEXT,
    cover_image_url      TEXT,
    initial_stock        INTEGER        DEFAULT 0,  -- transient; zeroed after trigger
    created_at           TIMESTAMP      NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_books_isbn         ON books(isbn);
CREATE INDEX IF NOT EXISTS idx_books_availability ON books(availability);

-- ----------------------------------------------------------------
-- 3e. BOOK_COPY  (Weak Entity — a physical, shippable copy)
--     Partial key: (book_id, copy_id)
--     Relationship: BOOK HAS_COPIES [1:N] BOOK_COPY
-- ----------------------------------------------------------------
CREATE TABLE IF NOT EXISTS book_copy (
    copy_id    BIGSERIAL    PRIMARY KEY,
    book_id    BIGINT       NOT NULL
        REFERENCES books(id) ON DELETE CASCADE,
    barcode    VARCHAR(100) UNIQUE,                 -- physical barcode label
    condition  VARCHAR(50)  NOT NULL DEFAULT 'new'
               CHECK (condition IN ('new','good','fair','damaged')),
    status     VARCHAR(50)  NOT NULL DEFAULT 'in_stock'
               CHECK (status IN ('in_stock','reserved','sold','returned')),
    created_at TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_book_copy_book_id ON book_copy(book_id);
CREATE INDEX IF NOT EXISTS idx_book_copy_status  ON book_copy(status);

-- ----------------------------------------------------------------
-- 3f. Junction tables (M:N decompositions)
-- ----------------------------------------------------------------

-- BOOK  ← book_author →  AUTHOR
CREATE TABLE IF NOT EXISTS book_author (
    book_id   BIGINT NOT NULL REFERENCES books(id)       ON DELETE CASCADE,
    author_id BIGINT NOT NULL REFERENCES authors(author_id) ON DELETE CASCADE,
    PRIMARY KEY (book_id, author_id)
);

-- BOOK  ← publication_book →  PUBLICATION
CREATE TABLE IF NOT EXISTS publication_book (
    publication_id BIGINT NOT NULL REFERENCES publications(publication_id) ON DELETE CASCADE,
    book_id        BIGINT NOT NULL REFERENCES books(id)                    ON DELETE CASCADE,
    PRIMARY KEY (publication_id, book_id)
);

-- BOOK  ← book_category →  CATEGORY
CREATE TABLE IF NOT EXISTS book_category (
    book_id     BIGINT NOT NULL REFERENCES books(id)           ON DELETE CASCADE,
    category_id BIGINT NOT NULL REFERENCES categories(category_id) ON DELETE CASCADE,
    PRIMARY KEY (book_id, category_id)
);


-- ================================================================
-- SECTION 4 — Shopping Domain
-- ================================================================

-- ----------------------------------------------------------------
-- 4a. CART
--     Relationship: USER OWNS [1:1] CART
-- ----------------------------------------------------------------
CREATE TABLE IF NOT EXISTS cart (
    cart_id    BIGSERIAL   PRIMARY KEY,
    user_id    BIGINT      NOT NULL UNIQUE
        REFERENCES users(user_id) ON DELETE CASCADE,
    status     VARCHAR(50) NOT NULL DEFAULT 'active'
               CHECK (status IN ('active','checked_out','abandoned')),
    created_at TIMESTAMP   NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP   NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- ----------------------------------------------------------------
-- 4b. CART_ITEM  (Weak Entity, owner: CART)
--     Relationship: CART HAS [1:N] CART_ITEM
--                   CART_ITEM REFERENCES [N:1] BOOK   ← title intent only
-- ----------------------------------------------------------------
CREATE TABLE IF NOT EXISTS cart_item (
    cart_item_id BIGSERIAL     PRIMARY KEY,
    cart_id      BIGINT        NOT NULL
        REFERENCES cart(cart_id) ON DELETE CASCADE,
    book_id      BIGINT        NOT NULL
        REFERENCES books(id) ON DELETE CASCADE,
    quantity     INTEGER       NOT NULL DEFAULT 1 CHECK (quantity > 0),
    locked_price NUMERIC(10,2) NOT NULL,           -- price at time of add
    added_at     TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (cart_id, book_id)
);

CREATE INDEX IF NOT EXISTS idx_cart_item_cart_id ON cart_item(cart_id);

-- ----------------------------------------------------------------
-- 4c. WISHLIST
--     Relationship: USER OWNS [1:1] WISHLIST
-- ----------------------------------------------------------------
CREATE TABLE IF NOT EXISTS wishlist (
    wishlist_id BIGSERIAL  PRIMARY KEY,
    user_id     BIGINT     NOT NULL UNIQUE
        REFERENCES users(user_id) ON DELETE CASCADE,
    created_at  TIMESTAMP  NOT NULL DEFAULT NOW()
);

-- ----------------------------------------------------------------
-- 4d. WISHLIST_ITEM  (Weak Entity, owner: WISHLIST)
-- ----------------------------------------------------------------
CREATE TABLE IF NOT EXISTS wishlist_item (
    wishlist_item_id BIGSERIAL  PRIMARY KEY,
    wishlist_id      BIGINT     NOT NULL
        REFERENCES wishlist(wishlist_id) ON DELETE CASCADE,
    book_id          BIGINT     NOT NULL
        REFERENCES books(id) ON DELETE CASCADE,
    added_at         TIMESTAMP  NOT NULL DEFAULT NOW(),
    UNIQUE (wishlist_id, book_id)
);


-- ================================================================
-- SECTION 5 — Order Domain
-- ================================================================

-- ----------------------------------------------------------------
-- 5a. COUPONS
--     Relationship: ADMIN CREATES [1:N] COUPON
--                   COUPON APPLIES_TO [1:N] ORDER
-- ----------------------------------------------------------------
CREATE TABLE IF NOT EXISTS coupons (
    coupon_id         BIGSERIAL      PRIMARY KEY,
    created_by        BIGINT         REFERENCES users(user_id) ON DELETE SET NULL,
    code              VARCHAR(50)    NOT NULL UNIQUE,
    description       TEXT,
    discount_type     VARCHAR(20)    NOT NULL DEFAULT 'percentage'
                      CHECK (discount_type IN ('percentage','fixed')),
    discount_value    NUMERIC(10,2)  NOT NULL CHECK (discount_value > 0),
    min_order_amount  NUMERIC(10,2),
    max_order_amount  NUMERIC(10,2),
    usage_limit       INTEGER,
    times_used        INTEGER        NOT NULL DEFAULT 0,
    start_date        TIMESTAMP,
    end_date          TIMESTAMP,
    status            VARCHAR(20)    NOT NULL DEFAULT 'Active'
                      CHECK (status IN ('Active','Inactive','Expired'))
);

CREATE INDEX IF NOT EXISTS idx_coupons_code   ON coupons(code);
CREATE INDEX IF NOT EXISTS idx_coupons_status ON coupons(status);

-- ----------------------------------------------------------------
-- 5b. ORDERS
--     Relationships:
--       USER PLACES [1:N] ORDER
--       CART GENERATES [1:1] ORDER       (cart_id column)
--       COUPON APPLIES_TO [1:N] ORDER    (coupon_id column)
--       ORDER SHIPS_TO [N:1] ADDRESS
-- ----------------------------------------------------------------
CREATE TABLE IF NOT EXISTS orders (
    order_id        BIGSERIAL      PRIMARY KEY,
    user_id         BIGINT         NOT NULL
        REFERENCES users(user_id) ON DELETE RESTRICT,
    address_id      BIGINT
        REFERENCES addresses(address_id) ON DELETE SET NULL,
    cart_id         BIGINT
        REFERENCES cart(cart_id) ON DELETE SET NULL,    -- traceability
    coupon_id       BIGINT
        REFERENCES coupons(coupon_id) ON DELETE SET NULL,
    order_number    VARCHAR(50)    NOT NULL UNIQUE,
    original_amount NUMERIC(10,2)  NOT NULL,            -- before discount
    discount_amount NUMERIC(10,2)  NOT NULL DEFAULT 0,
    total_amount    NUMERIC(10,2)  NOT NULL,            -- final charged amount
    status          VARCHAR(50)    NOT NULL DEFAULT 'Pending'
                    CHECK (status IN (
                        'Pending','Confirmed','Processing',
                        'Shipped','Delivered','Cancelled','Refunded'
                    )),
    order_date      TIMESTAMP      NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMP      NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_orders_user_id      ON orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_order_number ON orders(order_number);
CREATE INDEX IF NOT EXISTS idx_orders_status       ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_cart_id      ON orders(cart_id);

-- ----------------------------------------------------------------
-- 5c. ORDER_ITEMS  (Weak Entity, owner: ORDER)
--     Relationship: ORDER HAS [1:N] ORDER_ITEM
--                   ORDER_ITEM MAPS_TO [N:1] BOOK_COPY  ← exact copy lock-in
--
--     IMPORTANT: copy_id has a UNIQUE constraint.
--     One physical copy can only ever appear in one order line.
--     If a customer orders 3 copies → 3 rows, 3 distinct copy_ids.
-- ----------------------------------------------------------------
CREATE TABLE IF NOT EXISTS order_items (
    order_item_id BIGSERIAL     PRIMARY KEY,
    order_id      BIGINT        NOT NULL
        REFERENCES orders(order_id) ON DELETE CASCADE,
    copy_id       BIGINT        NOT NULL UNIQUE   -- inventory lock-in
        REFERENCES book_copy(copy_id) ON DELETE RESTRICT,
    unit_price    NUMERIC(10,2) NOT NULL,         -- price at time of sale
    subtotal      NUMERIC(10,2) NOT NULL          -- = unit_price (qty always 1)
);

CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_order_items_copy_id  ON order_items(copy_id);


-- ================================================================
-- SECTION 6 — Payment Domain  (ISA hierarchy)
-- ================================================================

-- ----------------------------------------------------------------
-- 6a. PAYMENTS  (Supertype)
--     Relationship: ORDER RECEIVES [1:1] PAYMENT
-- ----------------------------------------------------------------
CREATE TABLE IF NOT EXISTS payments (
    payment_id     BIGSERIAL      PRIMARY KEY,
    order_id       BIGINT         NOT NULL UNIQUE
        REFERENCES orders(order_id) ON DELETE RESTRICT,
    amount         NUMERIC(10,2)  NOT NULL CHECK (amount > 0),
    payment_date   TIMESTAMP      NOT NULL DEFAULT CURRENT_TIMESTAMP,
    payment_status VARCHAR(50)    NOT NULL DEFAULT 'Pending'
                   CHECK (payment_status IN ('Pending','Completed','Failed','Refunded')),
    payment_method VARCHAR(50)    NOT NULL
                   CHECK (payment_method IN ('card','mfs','cash_on_delivery'))
);

CREATE INDEX IF NOT EXISTS idx_payments_order_id ON payments(order_id);
CREATE INDEX IF NOT EXISTS idx_payments_status   ON payments(payment_status);

-- ----------------------------------------------------------------
-- 6b. CARD_PAYMENT  (Subtype — ISA → PAYMENT)
-- ----------------------------------------------------------------
CREATE TABLE IF NOT EXISTS card_payments (
    payment_id        BIGINT      PRIMARY KEY
        REFERENCES payments(payment_id) ON DELETE CASCADE,
    card_last_4_digits CHAR(4),
    bank_name         VARCHAR(100),
    card_brand        VARCHAR(50)     -- 'Visa','MasterCard','Amex', etc.
);

-- ----------------------------------------------------------------
-- 6c. MFS_PAYMENT  (Subtype — ISA → PAYMENT)
--     MFS = Mobile Financial Service (bKash, Nagad, Rocket, etc.)
-- ----------------------------------------------------------------
CREATE TABLE IF NOT EXISTS mfs_payments (
    payment_id       BIGINT      PRIMARY KEY
        REFERENCES payments(payment_id) ON DELETE CASCADE,
    sender_mobile_no VARCHAR(20),
    provider_name    VARCHAR(50)  -- 'bKash','Nagad','Rocket', etc.
);

-- ----------------------------------------------------------------
-- 6d. CASH_ON_DELIVERY  (Subtype — ISA → PAYMENT)
-- ----------------------------------------------------------------
CREATE TABLE IF NOT EXISTS cash_on_deliveries (
    payment_id      BIGINT    PRIMARY KEY
        REFERENCES payments(payment_id) ON DELETE CASCADE,
    collected_by    VARCHAR(100),   -- courier/agent name who collected
    collection_date TIMESTAMP
);


-- ================================================================
-- SECTION 7 — Logistics Domain
-- ================================================================

-- ----------------------------------------------------------------
-- 7a. COURIERS
-- ----------------------------------------------------------------
CREATE TABLE IF NOT EXISTS couriers (
    courier_id BIGSERIAL    PRIMARY KEY,
    name       VARCHAR(100) NOT NULL UNIQUE
);

-- ----------------------------------------------------------------
-- 7b. DELIVERIES
--     Relationships:
--       ORDER SCHEDULED_FOR [1:1] DELIVERY
--       DELIVERY HANDLED_BY [N:1] COURIER
-- ----------------------------------------------------------------
CREATE TABLE IF NOT EXISTS deliveries (
    delivery_id   BIGSERIAL    PRIMARY KEY,
    order_id      BIGINT       NOT NULL UNIQUE
        REFERENCES orders(order_id) ON DELETE CASCADE,
    courier_id    BIGINT
        REFERENCES couriers(courier_id) ON DELETE SET NULL,
    tracking_no   VARCHAR(100),
    dispatch_date TIMESTAMP,
    est_date      TIMESTAMP,
    delivered_at  TIMESTAMP,
    status        VARCHAR(50)  NOT NULL DEFAULT 'Pending'
                  CHECK (status IN (
                      'Pending','Dispatched','In Transit',
                      'Out for Delivery','Delivered','Failed'
                  ))
);

CREATE INDEX IF NOT EXISTS idx_deliveries_order_id   ON deliveries(order_id);
CREATE INDEX IF NOT EXISTS idx_deliveries_courier_id ON deliveries(courier_id);
CREATE INDEX IF NOT EXISTS idx_deliveries_status     ON deliveries(status);


-- ================================================================
-- SECTION 8 — Post-Purchase Domain
-- ================================================================

-- ----------------------------------------------------------------
-- 8a. REVIEWS
--     Relationship: USER WRITES [1:N] REVIEW
--                   REVIEW ABOUT [N:1] BOOK
-- ----------------------------------------------------------------
CREATE TABLE IF NOT EXISTS reviews (
    review_id   BIGSERIAL  PRIMARY KEY,
    user_id     BIGINT     NOT NULL
        REFERENCES users(user_id) ON DELETE CASCADE,
    book_id     BIGINT     NOT NULL
        REFERENCES books(id) ON DELETE CASCADE,
    rating      INTEGER    NOT NULL CHECK (rating BETWEEN 1 AND 5),
    review_text TEXT,
    review_date TIMESTAMP  NOT NULL DEFAULT CURRENT_TIMESTAMP,
    is_hidden   BOOLEAN    NOT NULL DEFAULT FALSE,
    UNIQUE (user_id, book_id)   -- one review per user per book
);

CREATE INDEX IF NOT EXISTS idx_reviews_book_id ON reviews(book_id);
CREATE INDEX IF NOT EXISTS idx_reviews_user_id ON reviews(user_id);

-- ----------------------------------------------------------------
-- 8b. RETURNS
--     Relationship: ORDER_ITEM INITIATES [1:1] RETURN
--                   RETURN PROCESSED_BY [N:1] ADMIN
-- ----------------------------------------------------------------
CREATE TABLE IF NOT EXISTS returns (
    return_id      BIGSERIAL   PRIMARY KEY,
    order_item_id  BIGINT      NOT NULL UNIQUE    -- one return per order line
        REFERENCES order_items(order_item_id) ON DELETE RESTRICT,
    processed_by   BIGINT                         -- admin user_id
        REFERENCES users(user_id) ON DELETE SET NULL,
    reason         TEXT,
    status         VARCHAR(50) NOT NULL DEFAULT 'Requested'
                   CHECK (status IN (
                       'Requested','Approved','Rejected',
                       'Received','Completed'
                   )),
    request_date   TIMESTAMP   NOT NULL DEFAULT CURRENT_TIMESTAMP,
    approved_at    TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_returns_order_item_id ON returns(order_item_id);
CREATE INDEX IF NOT EXISTS idx_returns_status        ON returns(status);

-- ----------------------------------------------------------------
-- 8c. REFUNDS
--     Relationship: RETURN GENERATES [1:1] REFUND
--                   REFUND LINKED_TO [N:1] PAYMENT
-- ----------------------------------------------------------------
CREATE TABLE IF NOT EXISTS refunds (
    refund_id    BIGSERIAL      PRIMARY KEY,
    return_id    BIGINT         NOT NULL UNIQUE
        REFERENCES returns(return_id) ON DELETE RESTRICT,
    payment_id   BIGINT
        REFERENCES payments(payment_id) ON DELETE SET NULL,
    amount       NUMERIC(10,2)  NOT NULL CHECK (amount > 0),
    status       VARCHAR(50)    NOT NULL DEFAULT 'Pending'
                 CHECK (status IN ('Pending','Processed','Failed')),
    processed_at TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_refunds_return_id  ON refunds(return_id);
CREATE INDEX IF NOT EXISTS idx_refunds_payment_id ON refunds(payment_id);

-- ----------------------------------------------------------------
-- 8d. ADMIN_ACTIVITY_LOG
--     Relationship: ADMIN LOGS all administrative actions
-- ----------------------------------------------------------------
CREATE TABLE IF NOT EXISTS admin_activity_log (
    log_id        BIGSERIAL   PRIMARY KEY,
    admin_id      BIGINT      NOT NULL
        REFERENCES users(user_id) ON DELETE RESTRICT,
    action        VARCHAR(100) NOT NULL,
    entity_type   VARCHAR(50),
    entity_id     BIGINT,
    details       JSONB,
    ip_address    VARCHAR(50),
    created_at    TIMESTAMPTZ  NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_admin_log_admin_id   ON admin_activity_log(admin_id);
CREATE INDEX IF NOT EXISTS idx_admin_log_created_at ON admin_activity_log(created_at);
CREATE INDEX IF NOT EXISTS idx_admin_log_entity     ON admin_activity_log(entity_type, entity_id);


-- ================================================================
-- SECTION 9 — Triggers
-- ================================================================

-- ----------------------------------------------------------------
-- T1: Auto-calculate discount_percentage on books
-- ----------------------------------------------------------------
CREATE OR REPLACE FUNCTION fn_calc_discount_percentage()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.price IS NOT NULL AND NEW.price > 0
       AND NEW.discount_price IS NOT NULL
       AND NEW.discount_price < NEW.price
    THEN
        NEW.discount_percentage :=
            ROUND(((NEW.price - NEW.discount_price) / NEW.price * 100)::NUMERIC, 0)::VARCHAR
            || '% Off';
    ELSE
        NEW.discount_percentage := NULL;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_calc_discount_percentage ON books;
CREATE TRIGGER trg_calc_discount_percentage
    BEFORE INSERT OR UPDATE OF price, discount_price
    ON books
    FOR EACH ROW
    EXECUTE FUNCTION fn_calc_discount_percentage();

-- ----------------------------------------------------------------
-- T2: Auto-sync books.availability from book_copy stock count
-- ----------------------------------------------------------------
CREATE OR REPLACE FUNCTION fn_sync_book_availability()
RETURNS TRIGGER AS $$
DECLARE
    v_book_id   BIGINT;
    v_stock_cnt INT;
BEGIN
    v_book_id := CASE WHEN TG_OP = 'DELETE' THEN OLD.book_id ELSE NEW.book_id END;

    SELECT COUNT(*) INTO v_stock_cnt
    FROM book_copy
    WHERE book_id = v_book_id AND status = 'in_stock';

    UPDATE books
    SET availability = CASE WHEN v_stock_cnt > 0 THEN 'In Stock' ELSE 'Out of Stock' END
    WHERE id = v_book_id
      AND availability <> 'Pre-Order';   -- never override Pre-Order manually

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_sync_book_availability ON book_copy;
CREATE TRIGGER trg_sync_book_availability
    AFTER INSERT OR UPDATE OF status OR DELETE
    ON book_copy
    FOR EACH ROW
    EXECUTE FUNCTION fn_sync_book_availability();

-- ----------------------------------------------------------------
-- T3: Auto-create initial book_copy rows from books.initial_stock
-- ----------------------------------------------------------------
CREATE OR REPLACE FUNCTION fn_create_initial_book_copies()
RETURNS TRIGGER AS $$
DECLARE
    i INT;
BEGIN
    IF NEW.initial_stock IS NOT NULL AND NEW.initial_stock > 0 THEN
        FOR i IN 1..NEW.initial_stock LOOP
            INSERT INTO book_copy (book_id, status, condition)
            VALUES (NEW.id, 'in_stock', 'new');
        END LOOP;
    END IF;
    UPDATE books SET initial_stock = NULL WHERE id = NEW.id;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_create_initial_book_copies ON books;
CREATE TRIGGER trg_create_initial_book_copies
    AFTER INSERT
    ON books
    FOR EACH ROW
    EXECUTE FUNCTION fn_create_initial_book_copies();

-- ----------------------------------------------------------------
-- T4: Auto-update books.rating and books.num_reviews from reviews
-- ----------------------------------------------------------------
CREATE OR REPLACE FUNCTION fn_sync_book_rating()
RETURNS TRIGGER AS $$
DECLARE
    v_book_id   BIGINT;
    v_avg_rating NUMERIC(4,2);
    v_cnt        INTEGER;
BEGIN
    v_book_id := CASE WHEN TG_OP = 'DELETE' THEN OLD.book_id ELSE NEW.book_id END;

    SELECT ROUND(AVG(rating)::NUMERIC, 2), COUNT(*)
    INTO v_avg_rating, v_cnt
    FROM reviews
    WHERE book_id = v_book_id AND is_hidden = FALSE;

    UPDATE books
    SET rating      = v_avg_rating,
        num_reviews = v_cnt
    WHERE id = v_book_id;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_sync_book_rating ON reviews;
CREATE TRIGGER trg_sync_book_rating
    AFTER INSERT OR UPDATE OF rating, is_hidden OR DELETE
    ON reviews
    FOR EACH ROW
    EXECUTE FUNCTION fn_sync_book_rating();

-- ----------------------------------------------------------------
-- T5: Mark book_copy status → 'reserved' when added to an order_item
--     and back to 'in_stock' if the order_item is deleted
-- ----------------------------------------------------------------
CREATE OR REPLACE FUNCTION fn_reserve_book_copy()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        UPDATE book_copy SET status = 'reserved' WHERE copy_id = NEW.copy_id;
    ELSIF TG_OP = 'DELETE' THEN
        UPDATE book_copy SET status = 'in_stock'  WHERE copy_id = OLD.copy_id;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_reserve_book_copy ON order_items;
CREATE TRIGGER trg_reserve_book_copy
    AFTER INSERT OR DELETE
    ON order_items
    FOR EACH ROW
    EXECUTE FUNCTION fn_reserve_book_copy();

-- ----------------------------------------------------------------
-- T6: Mark book_copy status → 'sold' when order is Delivered,
--     and update order.updated_at timestamp automatically
-- ----------------------------------------------------------------
CREATE OR REPLACE FUNCTION fn_mark_copies_sold()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.status = 'Delivered' AND OLD.status <> 'Delivered' THEN
        UPDATE book_copy
        SET status = 'sold'
        WHERE copy_id IN (
            SELECT copy_id FROM order_items WHERE order_id = NEW.order_id
        );
    END IF;
    NEW.updated_at := CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_mark_copies_sold ON orders;
CREATE TRIGGER trg_mark_copies_sold
    BEFORE UPDATE OF status
    ON orders
    FOR EACH ROW
    EXECUTE FUNCTION fn_mark_copies_sold();

-- ================================================================
-- END OF MASTER SCHEMA
-- ================================================================

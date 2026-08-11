CREATE TABLE books (
    id                   SERIAL PRIMARY KEY,
    book_name            TEXT NOT NULL,
    cover_image_url      TEXT,
    authors              TEXT,
    publisher            TEXT,
    category             TEXT,
    isbn                 VARCHAR(20),
    language             VARCHAR(50),
    num_pages            INTEGER,
    edition              TEXT,
    price                NUMERIC(10, 2),
    discount_price       NUMERIC(10, 2),
    discount_percentage  VARCHAR(20),
    rating               NUMERIC(4, 2),
    num_reviews          INTEGER,
    availability         VARCHAR(30),
    description          TEXT
);

-- ALTER TABLE books
-- ALTER COLUMN edition TYPE VARCHAR(20);

-- ALTER TABLE books
-- ALTER COLUMN format TYPE CHAR(20)

-- -- ALTER TABLE books
-- -- ALTER COLUMN edition TYPE VARCHAR(50);

-- ALTER TABLE books
-- ALTER COLUMN lan_guage TYPE CHAR(20);







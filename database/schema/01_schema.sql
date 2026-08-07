-- ============================================================
-- Schema: authors, publications (publishers), books, and the
-- two junction tables book_author and publication_book.
--
-- 'publications' stores PUBLISHERS (title = publisher name),
-- mirroring the authors table structure (name/bio/photo_url).
-- 'books' stores the actual book records (title = book name);
-- this table wasn't in the supplied images but is required so
-- book_author and publication_book have a book_id to point to.
-- ============================================================

DROP TABLE IF EXISTS book_author CASCADE;
DROP TABLE IF EXISTS publication_book CASCADE;
DROP TABLE IF EXISTS publications CASCADE;
DROP TABLE IF EXISTS authors CASCADE;

CREATE TABLE authors (
    author_id   SERIAL PRIMARY KEY,
    name        VARCHAR(150) NOT NULL,
    bio         TEXT,
    photo_url   VARCHAR(255)
);

CREATE TABLE publications (
    publication_id  SERIAL PRIMARY KEY,
    title           VARCHAR(150) NOT NULL,   -- publisher name
    bio             TEXT,
    cover_image_url VARCHAR(255)
);



CREATE TABLE book_author (
    book_id   INTEGER NOT NULL,
    author_id INTEGER NOT NULL,
    PRIMARY KEY (book_id, author_id),
    CONSTRAINT fk_book_author_book
        FOREIGN KEY (book_id) REFERENCES books(id) ON DELETE CASCADE,
    CONSTRAINT fk_book_author_author
        FOREIGN KEY (author_id) REFERENCES authors(author_id) ON DELETE CASCADE
);

CREATE TABLE publication_book (
    publication_id INTEGER NOT NULL,
    book_id        INTEGER NOT NULL,
    PRIMARY KEY (publication_id, book_id),
    CONSTRAINT fk_pub_book_publication
        FOREIGN KEY (publication_id) REFERENCES publications(publication_id) ON DELETE CASCADE,
    CONSTRAINT fk_pub_book_book
        FOREIGN KEY (book_id) REFERENCES books(id) ON DELETE CASCADE
);

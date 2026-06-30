

CREATE TABLE book_publication_create (
    book_id INT REFERENCES books(book_id),
    publication_id INT REFERENCES publications(publication_id),
    PRIMARY KEY (book_id, publication_id)
);
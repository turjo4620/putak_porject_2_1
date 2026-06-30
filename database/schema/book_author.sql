-- CREATE TABLE book_author (
--     book_id INT,
--     author_id INT,
--     PRIMARY KEY (book_id, author_id),
--     FOREIGN KEY (book_id) REFERENCES books(book_id) ON DELETE CASCADE,
--     FOREIGN KEY (author_id) REFERENCES authors(author_id) ON DELETE CASCADE
-- );

-- SELECT b.title, a.name
-- FROM books AS b
-- INNER JOIN book_author AS ba
--     ON b.book_id = ba.book_id
-- INNER JOIN authors AS a
--     ON ba.author_id = a.author_id;

select name,
count(*) as author_count
from authors
group by name
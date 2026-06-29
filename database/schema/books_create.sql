CREATE TABLE books(
	book_id SERIAL PRIMARY KEY,
	isbn VARCHAR(15) UNIQUE NOT NULL,
	title VARCHAR(250) NOT NULL,
	edition INT NOT NULL,
	lan_guage VARCHAR(50),
	format CHAR(20),
	stock INT NOT NULL,
	description VARCHAR(1000)
	
);

-- -- ALTER TABLE books
-- -- ALTER COLUMN edition TYPE VARCHAR(20);

-- ALTER TABLE books
-- ALTER COLUMN format TYPE CHAR(20)

-- -- ALTER TABLE books
-- -- ALTER COLUMN edition TYPE VARCHAR(50);

-- ALTER TABLE books
-- ALTER COLUMN lan_guage TYPE CHAR(20);




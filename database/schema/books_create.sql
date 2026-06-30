CREATE TABLE books(
	book_id INT PRIMARY KEY,
	isbn VARCHAR(15) UNIQUE NOT NULL,
	title VARCHAR(250) NOT NULL,
	edition VARCHAR(20) NOT NULL,
	lan_guage CHAR(50),
	format CHAR(20),
	stock INT NOT NULL,
	description VARCHAR(1000),
	cover_image_url CHAR(250),
	mrp INT NOT NULL,
	discounted_price INT
	
);

-- ALTER TABLE books
-- ALTER COLUMN edition TYPE VARCHAR(20);

-- ALTER TABLE books
-- ALTER COLUMN format TYPE CHAR(20)

-- -- ALTER TABLE books
-- -- ALTER COLUMN edition TYPE VARCHAR(50);

-- ALTER TABLE books
-- ALTER COLUMN lan_guage TYPE CHAR(20);







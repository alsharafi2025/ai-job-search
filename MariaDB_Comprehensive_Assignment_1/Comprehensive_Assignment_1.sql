-- =====================================================================
-- Comprehensive Assignment 1 - MariaDB Setup and SQL Fundamentals
-- Sections 3 to 8, grouped by the figure each block produces.
--
-- How to use it in the MariaDB Command Prompt:
--   1. Log in with:  mysql -u root -p
--   2. Run the blocks IN ORDER, one figure at a time. Each block changes
--      the data that the next one uses, so skipping or repeating a block
--      will change the results.
--   3. After each block, press Win + Shift + S and drag a rectangle around
--      the statement and its result, then paste it over the matching
--      figure in Comprehensive_Assignment_1.docx.
--
-- Type straight quotes (' and "), never the curly quotes that appear in
-- the course guide; the server rejects curly quotes.
--
-- To start again from scratch, run this line first (it deletes Demo):
--   DROP DATABASE IF EXISTS Demo;
-- =====================================================================

-- ---------------------------------------------------------------------
-- Section 3: Create a Database and Tables
-- ---------------------------------------------------------------------
-- Figure 3.1
CREATE DATABASE Demo;

-- Figure 3.2
SHOW DATABASES;

-- ---------------------------------------------------------------------
-- Section 4: Selecting a Database
-- ---------------------------------------------------------------------
-- Figure 4.1
USE Demo;
SELECT DATABASE();

-- ---------------------------------------------------------------------
-- Section 5: Creating a Table
-- ---------------------------------------------------------------------
-- Figure 5.1
CREATE TABLE Book(
id INT NOT NULL AUTO_INCREMENT,
name VARCHAR(100) NOT NULL,
PRIMARY KEY (id));

-- Figure 5.2
CREATE TABLE Price(
id INT NOT NULL AUTO_INCREMENT,
price float NOT NULL,
PRIMARY KEY (id));

-- ---------------------------------------------------------------------
-- Section 6: Showing Tables
-- ---------------------------------------------------------------------
-- Figure 6.1
SHOW TABLES;

-- ---------------------------------------------------------------------
-- Section 7: Showing Table Structure
-- ---------------------------------------------------------------------
-- Figure 7.1
DESC Book;

-- Figure 7.2
DESC Price;

-- ---------------------------------------------------------------------
-- Section 8: CRUD and Clauses
-- ---------------------------------------------------------------------
-- Figure 8.1  (a. INSERT)
INSERT INTO book
(id, name)
VALUES(1, 'MariaDB Book');
INSERT INTO price
(id, price)
VALUES(1, 200);

-- Figure 8.2  (b. SELECT)
SELECT * from book;
SELECT * from price;

-- Figure 8.3  (c. Inserting Multiple Records)
INSERT INTO book
(id, name)
VALUES
(2,'MariaDB Book2'),
(3,'MariaDB Book3'),
(4,'MariaDB Book4'),
(5,'MariaDB Book5');
SELECT * FROM book;

-- Figure 8.4  (c. Inserting Multiple Records)
INSERT INTO price
(id, price)
VALUES
(2, 250),
(3, 220),
(4, 190),
(5, 300);
SELECT * FROM price;

-- Figure 8.5  (d. UPDATE)
UPDATE price
SET price = 250
WHERE id = 1;
SELECT * FROM price;

-- Figure 8.6  (d. UPDATE)
UPDATE book
SET name = "MariaDB Book1"
WHERE id = 1;
SELECT * FROM book;

-- Figure 8.7  (d. UPDATE)
UPDATE price
SET id = 6,
price = 280
WHERE id = 5;
SELECT * FROM price;

-- Figure 8.8  (e. DELETE)
DELETE FROM price
WHERE id = 6;
SELECT * FROM price;

-- Figure 8.9  (f. WHERE)
SELECT *
FROM price
WHERE price < 250;

-- Figure 8.10  (f. WHERE)
SELECT *
FROM price
WHERE id > 3
AND price < 250;
SELECT *
FROM price
WHERE id > 3
OR price < 250;

-- Figure 8.11  (g. LIKE, the % wildcard)
SELECT name
FROM book
WHERE name LIKE 'M%';
SELECT name
FROM book
WHERE name LIKE '%4';
SELECT name
FROM book
WHERE name LIKE '%DB%';

-- Figure 8.12  (g. LIKE, the _ wildcard)
SELECT *
FROM price
WHERE price LIKE '1_0';
SELECT *
FROM price
WHERE price LIKE '_2_';

-- Figure 8.13  (g. NOT LIKE)
SELECT *
FROM price
WHERE price NOT LIKE '2%';

-- Figure 8.14  (h. ORDER BY, default order)
-- The guide prints this pattern as '2%.'; the period is a typo.
SELECT * FROM price
WHERE price LIKE '2%'
ORDER BY price;

-- Figure 8.15  (h. ORDER BY ... DESC)
SELECT * FROM price
WHERE price LIKE '2%'
ORDER BY price DESC;

-- Figure 8.16  (h. ORDER BY ... ASC)
SELECT * FROM price
WHERE price LIKE '2%'
ORDER BY price ASC;

-- Figure 8.17  (i. DISTINCT)
SELECT price FROM Price;
SELECT DISTINCT price FROM Price;

-- Figure 8.18  (j. FROM)
SELECT * FROM price;
SELECT price FROM Price;

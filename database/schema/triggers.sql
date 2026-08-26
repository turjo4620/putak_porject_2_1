CREATE OR REPLACE FUNCTION fn_calc_discount_percentage()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.price IS NOT NULL AND NEW.price > 0
     AND NEW.discount_price IS NOT NULL AND NEW.discount_price < NEW.price
  THEN
    NEW.discount_percentage :=
      ROUND(((NEW.price - NEW.discount_price) / NEW.price * 100)::NUMERIC, 0)::VARCHAR || '% Off';
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


-- -------------------------------------------------------------
-- TRIGGER 2: Auto-sync books.availability whenever a book_copy
--            row is inserted, updated, or deleted.
--
--   in_stock count > 0  → 'In Stock'
--   in_stock count = 0  → 'Out of Stock'
--   (Pre-Order is set manually and NOT overridden here)
-- -------------------------------------------------------------

CREATE OR REPLACE FUNCTION fn_sync_book_availability()
RETURNS TRIGGER AS $$
DECLARE
  v_book_id   BIGINT;
  v_stock_cnt INT;
BEGIN
  -- Determine which book_id changed
  IF TG_OP = 'DELETE' THEN
    v_book_id := OLD.book_id;
  ELSE
    v_book_id := NEW.book_id;
  END IF;

  -- Count remaining in_stock copies
  SELECT COUNT(*) INTO v_stock_cnt
  FROM book_copy
  WHERE book_id = v_book_id AND status = 'in_stock';

  -- Only flip between In Stock / Out of Stock.
  -- Leave Pre-Order books alone.
  UPDATE books
  SET availability =
    CASE
      WHEN v_stock_cnt > 0 THEN 'In Stock'
      ELSE 'Out of Stock'
    END
  WHERE id = v_book_id
    AND availability <> 'Pre-Order';   -- don't override Pre-Order

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_sync_book_availability ON book_copy;
CREATE TRIGGER trg_sync_book_availability
  AFTER INSERT OR UPDATE OF status OR DELETE
  ON book_copy
  FOR EACH ROW
  EXECUTE FUNCTION fn_sync_book_availability();


-- -------------------------------------------------------------
-- TRIGGER 3: On INSERT into books, automatically create
--            book_copy rows equal to the value stored in the
--            helper column  `initial_stock`  (INT, nullable).
--
--   The admin sends  initial_stock  as part of the INSERT.
--   After the trigger fires it is no longer needed — the
--   column is only a carrier, not permanent storage.
--
--   Step 1:  Add the helper column (safe to run multiple times)
-- -------------------------------------------------------------

ALTER TABLE books
  ADD COLUMN IF NOT EXISTS initial_stock INT DEFAULT 0;

-- Trigger function
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

  -- Nullify the carrier column so it doesn't show up in queries
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

-- ================================================================
-- MIGRATION: Sync live DB with what the backend expects
--
-- Problems found:
--   1. `coupons`  is missing:  times_used, discount_type
--   2. `orders`   is missing:  coupon_id, discount_amount, original_amount
--
-- Safe to run multiple times (IF NOT EXISTS guards throughout).
-- ================================================================

-- ----------------------------------------------------------------
-- 1. Fix `coupons` table
-- ----------------------------------------------------------------

-- times_used: read by couponService.validateCoupon(),
--             written by couponService.incrementUsage()
ALTER TABLE coupons
  ADD COLUMN IF NOT EXISTS times_used    INTEGER       NOT NULL DEFAULT 0;

-- discount_type: not used by current service but part of schema design
ALTER TABLE coupons
  ADD COLUMN IF NOT EXISTS discount_type VARCHAR(20)   NOT NULL DEFAULT 'fixed'
      CHECK (discount_type IN ('percentage', 'fixed'));

-- ----------------------------------------------------------------
-- 2. Fix `orders` table
-- ----------------------------------------------------------------

ALTER TABLE orders
  ADD COLUMN IF NOT EXISTS coupon_id       INTEGER
      REFERENCES coupons(coupon_id) ON DELETE SET NULL,

  ADD COLUMN IF NOT EXISTS discount_amount DECIMAL(10,2)
      NOT NULL DEFAULT 0,

  ADD COLUMN IF NOT EXISTS original_amount DECIMAL(10,2);

-- Back-fill original_amount for any existing orders
-- (no discount existed before, so original = total)
UPDATE orders
SET original_amount = total_amount
WHERE original_amount IS NULL;

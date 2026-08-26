-- =============================================================
-- Migration: wire coupons into orders
-- Run once against your database.
-- =============================================================

-- Add coupon tracking columns to orders
ALTER TABLE orders
  ADD COLUMN IF NOT EXISTS coupon_id      INTEGER REFERENCES coupons(coupon_id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS discount_amount DECIMAL(10,2) NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS original_amount DECIMAL(10,2);

-- Track how many times each coupon has been used
ALTER TABLE coupons
  ADD COLUMN IF NOT EXISTS times_used INTEGER NOT NULL DEFAULT 0;

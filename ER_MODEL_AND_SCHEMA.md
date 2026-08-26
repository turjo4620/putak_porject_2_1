# Pustak — Complete ER Model & SQL Schema Design

## 1. Entity-Relationship Overview

### Notation used
- **Bold** → Entity
- *Italic* → Weak Entity (existence depends on a parent)
- `RELATIONSHIP` → Relationship name (verb phrase)
- `[cardinality]` → e.g. `[1:N]`, `[M:N]`
- `{attr}` → Key attribute (underlined in a diagram)
- `(attr)` → Derived attribute
- `<<ISA>>` → Specialisation / Inheritance

---

## 2. Entity Catalogue

### 2.1 User Domain

| Entity | Key | Notable Attributes |
|--------|-----|--------------------|
| **USER** | `{user_id}` | name, email, phone_number, password_hash, role, status, last_login |
| **CUSTOMER** *(ISA → USER)* | `{user_id}` | newsletter_opt_in |
| **ADMIN** *(ISA → USER)* | `{user_id}` | admin_level, department |
| **ADDRESS** | `{address_id}` | street_address, city, postal_code, country, is_default |

### 2.2 Catalogue Domain

| Entity | Key | Notable Attributes |
|--------|-----|--------------------|
| **BOOK** | `{book_id}` | book_name, isbn, language, num_pages, edition, price, discount_price, (discount_percentage), (rating), availability, description, cover_image_url |
| ***BOOK_COPY*** *(weak, owner: BOOK)* | `{copy_id}` | barcode, condition, status |
| **AUTHOR** | `{author_id}` | name, bio, photo_url |
| **PUBLICATION** | `{publication_id}` | title (publisher name), bio, cover_image_url |
| **CATEGORY** | `{category_id}` | category_name |

### 2.3 Shopping Domain

| Entity | Key | Notable Attributes |
|--------|-----|--------------------|
| **CART** | `{cart_id}` | status, created_at, updated_at |
| ***CART_ITEM*** *(weak, owner: CART)* | `{cart_item_id}` | quantity, locked_price |
| **WISHLIST** | `{wishlist_id}` | created_at |
| ***WISHLIST_ITEM*** *(weak, owner: WISHLIST)* | `{wishlist_item_id}` | added_at |

### 2.4 Order Domain

| Entity | Key | Notable Attributes |
|--------|-----|--------------------|
| **ORDER** | `{order_id}` | order_number, total_amount, original_amount, discount_amount, status, order_date |
| ***ORDER_ITEM*** *(weak, owner: ORDER)* | `{order_item_id}` | unit_price, subtotal |
| **COUPON** | `{coupon_id}` | code, description, discount_value, discount_type, usage_limit, times_used, min_order_amount, max_order_amount, start_date, end_date, status |

### 2.5 Payment Domain (ISA Hierarchy)

| Entity | Key | Notable Attributes |
|--------|-----|--------------------|
| **PAYMENT** *(supertype)* | `{payment_id}` | amount, payment_date, payment_status |
| **CARD_PAYMENT** *(ISA → PAYMENT)* | `{payment_id}` | card_last_4_digits, bank_name, card_brand |
| **MFS_PAYMENT** *(ISA → PAYMENT)* | `{payment_id}` | sender_mobile_no, provider_name |
| **CASH_ON_DELIVERY** *(ISA → PAYMENT)* | `{payment_id}` | collected_by, collection_date |

### 2.6 Logistics Domain

| Entity | Key | Notable Attributes |
|--------|-----|--------------------|
| **COURIER** | `{courier_id}` | name |
| **DELIVERY** | `{delivery_id}` | tracking_no, dispatch_date, est_date, delivered_at, status |

### 2.7 Post-Purchase Domain

| Entity | Key | Notable Attributes |
|--------|-----|--------------------|
| **REVIEW** | `{review_id}` | rating, review_text, review_date, is_hidden |
| **RETURN** | `{return_id}` | reason, status, quantity, request_date, approved_at |
| **REFUND** | `{refund_id}` | amount, status, processed_at |
| **ADMIN_ACTIVITY_LOG** | `{log_id}` | action, entity_type, entity_id, details, created_at |

---

## 3. Relationship Catalogue

```
USER ──OWNS──► CART                         [1:1]
  CART ──HAS──► CART_ITEM                   [1:N]
    CART_ITEM ──REFERENCES──► BOOK          [N:1]   ← title preference only

USER ──OWNS──► WISHLIST                     [1:1]
  WISHLIST ──CONTAINS──► WISHLIST_ITEM      [1:N]
    WISHLIST_ITEM ──REFERENCES──► BOOK      [N:1]

USER ──PLACES──► ORDER                      [1:N]
USER ──HAS──► ADDRESS                       [1:N]
ORDER ──SHIPS_TO──► ADDRESS                 [N:1]

CART ──GENERATES──► ORDER                   [1:1]  (cart_id stored on order)
COUPON ──APPLIES_TO──► ORDER                [1:N]  (created by ADMIN)
ADMIN ──CREATES──► COUPON                   [1:N]

ORDER ──HAS──► ORDER_ITEM                   [1:N]
  ORDER_ITEM ──MAPS_TO──► BOOK_COPY         [N:1]   ← exact physical copy locked

BOOK ──HAS_COPIES──► BOOK_COPY             [1:N]  (weak entity)

ORDER ──RECEIVES──► PAYMENT                 [1:1]
  PAYMENT <<ISA>>
    ├─ CARD_PAYMENT
    ├─ MFS_PAYMENT
    └─ CASH_ON_DELIVERY

ORDER ──SCHEDULED_FOR──► DELIVERY           [1:1]
DELIVERY ──HANDLED_BY──► COURIER            [N:1]

USER ──WRITES──► REVIEW                     [1:N]
REVIEW ──ABOUT──► BOOK                      [N:1]

ORDER_ITEM ──INITIATES──► RETURN            [1:1]
RETURN ──PROCESSED_BY──► ADMIN              [N:1]
RETURN ──GENERATES──► REFUND                [1:1]
REFUND ──LINKED_TO──► PAYMENT               [N:1]

BOOK ──WRITTEN_BY──► AUTHOR                 [M:N]  via book_author
BOOK ──PUBLISHED_BY──► PUBLICATION          [M:N]  via publication_book
BOOK ──BELONGS_TO──► CATEGORY               [M:N]  via book_category
```

---

## 4. ISA Hierarchies

### 4.1 USER ISA
```
         USER
        /    \
  CUSTOMER  ADMIN
```
- Total, disjoint (role column acts as discriminator)
- CUSTOMER extends with: newsletter_opt_in
- ADMIN extends with: admin_level, department

### 4.2 PAYMENT ISA
```
          PAYMENT
         /   |   \
  CARD_PAYMENT  MFS_PAYMENT  CASH_ON_DELIVERY
```
- Total, disjoint (exactly one subtype per payment)
- Implemented via shared-PK approach (payment_id FK on each subtype)

---

## 5. Key Design Decisions

1. **CART_ITEM → BOOK** (not BOOK_COPY)  
   The cart stores intent. No physical copy is reserved until the order is placed. This allows books to appear in carts even when specific copies haven't been assigned yet.

2. **ORDER_ITEM → BOOK_COPY** (not BOOK)  
   Once an order is confirmed, a specific physical copy (with its own barcode) is locked in. This is the inventory reservation step. No two ORDER_ITEMs can reference the same BOOK_COPY (UNIQUE constraint on copy_id in order_items).

3. **BOOK_COPY is a Weak Entity**  
   A copy cannot exist without its parent BOOK. Its full identifier is `(book_id, copy_id)`.

4. **Payment ISA uses Shared-PK (Table-per-Subtype)**  
   The base `payments` table holds common attributes. Each subtype table (`card_payments`, `mfs_payments`, `cash_on_deliveries`) shares the same PK via FK. This enforces exactly one subtype per payment row at the DB level.

5. **Coupon is linked to ORDER, created by ADMIN**  
   The `orders` table holds `coupon_id`, `original_amount`, and `discount_amount` to create an immutable financial record — even if the coupon is later deactivated.

6. **RETURN links to ORDER_ITEM, not ORDER**  
   Returns are item-level, reflecting a physical defect in a specific BOOK_COPY. An admin must process it, which generates a REFUND linked back to the original PAYMENT.

---

## 6. Consolidated Entity Attribute Detail

### BOOK
| Column | Type | Notes |
|--------|------|-------|
| id (book_id) | BIGSERIAL PK | |
| book_name | TEXT NOT NULL | |
| isbn | VARCHAR(20) | |
| language | VARCHAR(50) | |
| num_pages | INTEGER | |
| edition | VARCHAR(50) | |
| price | NUMERIC(10,2) | list price |
| discount_price | NUMERIC(10,2) | |
| discount_percentage | VARCHAR(20) | *derived by trigger* |
| rating | NUMERIC(4,2) | *derived by trigger on reviews* |
| num_reviews | INTEGER | *derived* |
| availability | VARCHAR(30) | 'In Stock' / 'Out of Stock' / 'Pre-Order' — *managed by trigger* |
| description | TEXT | |
| cover_image_url | TEXT | |
| initial_stock | INTEGER | *transient helper column, nulled after trigger* |

### BOOK_COPY (Weak Entity)
| Column | Type | Notes |
|--------|------|-------|
| copy_id | BIGSERIAL PK | |
| book_id | BIGINT FK → books.id | partial key |
| barcode | VARCHAR(100) UNIQUE | physical barcode |
| condition | VARCHAR(50) | 'new', 'good', 'fair', 'damaged' |
| status | VARCHAR(50) | 'in_stock', 'reserved', 'sold', 'returned' |
| created_at | TIMESTAMP | |

### ORDER
| Column | Type | Notes |
|--------|------|-------|
| order_id | BIGSERIAL PK | |
| user_id | BIGINT FK → users | |
| address_id | INTEGER FK → addresses | |
| cart_id | BIGINT FK → cart | traceability: which cart generated this |
| coupon_id | INTEGER FK → coupons | nullable |
| order_number | VARCHAR(50) UNIQUE | |
| original_amount | NUMERIC(10,2) | before discount |
| discount_amount | NUMERIC(10,2) DEFAULT 0 | |
| total_amount | NUMERIC(10,2) | final charged |
| status | VARCHAR(50) | 'Pending','Confirmed','Shipped','Delivered','Cancelled' |
| order_date | TIMESTAMP | |
| updated_at | TIMESTAMP | |

### ORDER_ITEM
| Column | Type | Notes |
|--------|------|-------|
| order_item_id | BIGSERIAL PK | |
| order_id | BIGINT FK → orders | |
| copy_id | BIGINT FK → book_copy UNIQUE | one copy per order item |
| unit_price | NUMERIC(10,2) | price at time of sale |
| subtotal | NUMERIC(10,2) | (always 1 copy per row — quantity removed) |

> **Note on quantity:** Since each ORDER_ITEM maps to exactly one BOOK_COPY (a unique barcode), quantity is always 1. Ordering 3 copies of the same book = 3 ORDER_ITEM rows, each pointing to a distinct BOOK_COPY.


---

## 7. Migration Note — Naming Inconsistency

Several older schema files use **`book_copies`** (plural) while the active triggers and `master_schema.sql` correctly use **`book_copy`** (singular, matching the ER naming convention). The following files reference the old name and should **not** be run against the live database — they are superseded by `master_schema.sql`:

| File | Issue |
|------|-------|
| `admin_schema.sql` | Creates `book_copies` (old design) |
| `order_item_create.sql` | FK references `book_copies` |
| `orderItem_delivery_payment_3rd.sql` | FK references `book_copies` |
| `database/schema.sql` | FK references `book_copies` |
| `setup_admin.sql` | Creates `book_copies` (old design) |

**Canonical table name: `book_copy`** — as used in `master_schema.sql` and `triggers.sql`.

---

## 8. File to Use

**`database/schema/master_schema.sql`** is the single source of truth.  
Run it on a clean database. All other individual schema files are drafts / history.

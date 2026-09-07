# Requirements Document

## Introduction

This feature adds a comprehensive filtering, sorting, and book card UI enhancement system to the Pustak bookstore's list pages (BestSellersPage, NewArrivalsPage, and similar list pages). The system enables users to narrow down book results by genre, author, publisher, price range, and availability, sort results by multiple criteria, and view book cards with improved visual consistency and Bengali numeral formatting. The implementation spans the React frontend (filter sidebar, sort dropdown, active filter chips, pagination, empty states, enhanced BookCard) and the Node.js backend API (new query parameters on existing book endpoints).

---

## Glossary

- **Filter_Sidebar**: The left-panel UI component on desktop viewports that contains all filter controls (category, author, publisher, price range, availability).
- **Filter_Drawer**: The full-height slide-over panel or bottom sheet shown on mobile viewports, containing the same controls as the Filter_Sidebar.
- **Sort_Dropdown**: The `<select>` element positioned above the book grid that controls the ordering of displayed results.
- **Filter_Chip**: A tag rendered above the book grid representing a single active filter, including a removal (✕) button.
- **BookCard**: The existing `src/components/BookCard.jsx` component that renders a single book's cover, title, author, price, rating, badge, discount, and wishlist/cart actions.
- **List_Page**: Any page using the `.list-page` layout and `<BookCard>` grid — currently BestSellersPage and NewArrivalsPage.
- **Books_API**: The Node.js backend running at `http://localhost:5000`, exposing book listing endpoints.
- **Bengali_Numeral_Formatter**: A pure utility function that converts ASCII digit strings to their Bengali Unicode equivalents (০–৯).
- **Price_Range_Slider**: A dual-handle slider input component for selecting a minimum and maximum price in Taka (৳).
- **Active_Filter_State**: The in-memory React state object holding currently selected sort key, categories, authors, publishers, price range, and in-stock toggle.
- **Pagination_Controls**: The set of numbered page buttons and previous/next arrows rendered below the book grid.

---

## Requirements

### Requirement 1: Sorting

**User Story:** As a shopper, I want to sort book lists by popularity, recency, price, or discount, so that I can find the most relevant books quickly.

#### Acceptance Criteria

1. THE List_Page SHALL render a Sort_Dropdown above the book grid, aligned to the top-right of the content area.
2. THE Sort_Dropdown SHALL offer the following options in order: জনপ্রিয়তা (popularity), নতুন প্রকাশিত (newest), মূল্য: কম থেকে বেশি (price ascending), মূল্য: বেশি থেকে কম (price descending), সর্বোচ্চ ছাড় (highest discount).
3. WHEN the user selects a Sort_Dropdown option, THE List_Page SHALL update the Active_Filter_State sort key and re-fetch books from the Books_API with the new `sort` query parameter.
4. WHEN the Books_API receives a `sort` query parameter with value `popularity`, THE Books_API SHALL return books ordered by total sales count descending.
5. WHEN the Books_API receives a `sort` query parameter with value `newest`, THE Books_API SHALL return books ordered by publication date descending.
6. WHEN the Books_API receives a `sort` query parameter with value `price_asc`, THE Books_API SHALL return books ordered by price ascending.
7. WHEN the Books_API receives a `sort` query parameter with value `price_desc`, THE Books_API SHALL return books ordered by price descending.
8. WHEN the Books_API receives a `sort` query parameter with value `discount`, THE Books_API SHALL return books ordered by discount percentage descending.
9. WHEN no `sort` parameter is provided, THE Books_API SHALL default to `popularity` ordering.

---

### Requirement 2: Category / Genre Filtering

**User Story:** As a shopper, I want to filter books by genre or category, so that I can browse only the topics I am interested in.

#### Acceptance Criteria

1. THE Filter_Sidebar SHALL display a বিষয়/ক্যাটাগরি section containing a checkbox list of available categories (উপন্যাস, কবিতা, গল্প, ইতিহাস, সায়েন্স ফিকশন, and others present in the database).
2. THE Filter_Sidebar SHALL display the number of available books beside each category label as a count badge.
3. WHEN the user checks one or more category checkboxes, THE List_Page SHALL add those category values to the Active_Filter_State and re-fetch books from the Books_API with the `category` query parameter.
4. WHEN the user unchecks a category checkbox, THE List_Page SHALL remove that category from the Active_Filter_State and re-fetch books.
5. WHEN multiple categories are selected, THE Books_API SHALL return books that belong to any one of the selected categories (OR logic).
6. THE Books_API SHALL accept a `category` query parameter as a comma-separated list of category names and filter results accordingly.

---

### Requirement 3: Author Filtering

**User Story:** As a shopper, I want to filter books by author, so that I can find all works by my favourite writers.

#### Acceptance Criteria

1. THE Filter_Sidebar SHALL display a লেখক section containing a checkbox list of authors present in the current result set.
2. THE Filter_Sidebar SHALL display an inline text input above the author list, with placeholder "লেখক খুঁজুন...", that filters the visible author checkboxes client-side as the user types.
3. WHEN the user checks one or more author checkboxes, THE List_Page SHALL add those author names to the Active_Filter_State and re-fetch books from the Books_API with the `author` query parameter.
4. WHEN the user unchecks an author checkbox, THE List_Page SHALL remove that author name from the Active_Filter_State and re-fetch books.
5. WHEN multiple authors are selected, THE Books_API SHALL return books written by any one of the selected authors (OR logic).
6. THE Books_API SHALL accept an `author` query parameter as a comma-separated list of author names and filter results accordingly.

---

### Requirement 4: Publisher Filtering

**User Story:** As a shopper, I want to filter books by publisher, so that I can find titles from a specific publishing house.

#### Acceptance Criteria

1. THE Filter_Sidebar SHALL display a প্রকাশক section containing a multi-select checkbox list of publishers present in the current result set.
2. WHEN the user checks one or more publisher checkboxes, THE List_Page SHALL add those publisher names to the Active_Filter_State and re-fetch books from the Books_API with the `publisher` query parameter.
3. WHEN the user unchecks a publisher checkbox, THE List_Page SHALL remove that publisher name from the Active_Filter_State and re-fetch books.
4. WHEN multiple publishers are selected, THE Books_API SHALL return books published by any one of the selected publishers (OR logic).
5. THE Books_API SHALL accept a `publisher` query parameter as a comma-separated list of publisher names and filter results accordingly.

---

### Requirement 5: Price Range Filtering

**User Story:** As a shopper, I want to filter books within a price range, so that I can find books that fit my budget.

#### Acceptance Criteria

1. THE Filter_Sidebar SHALL display a মূল্য পরিসীমা section containing a Price_Range_Slider with two handles for minimum and maximum price, denominated in Taka (৳).
2. THE Filter_Sidebar SHALL display numeric input fields alongside the Price_Range_Slider that show the current minimum and maximum price values and allow direct keyboard entry.
3. WHEN the user adjusts the Price_Range_Slider or enters values in the numeric inputs, THE List_Page SHALL update the Active_Filter_State price range and re-fetch books from the Books_API with the `priceMin` and `priceMax` query parameters.
4. IF the user enters a minimum price value greater than the current maximum price value, THEN THE Filter_Sidebar SHALL clamp the minimum price to equal the maximum price value.
5. IF the user enters a maximum price value less than the current minimum price value, THEN THE Filter_Sidebar SHALL clamp the maximum price to equal the minimum price value.
6. THE Books_API SHALL accept `priceMin` and `priceMax` query parameters and return only books whose price falls within the inclusive range [priceMin, priceMax].
7. WHEN only `priceMin` is provided, THE Books_API SHALL return books with price greater than or equal to priceMin.
8. WHEN only `priceMax` is provided, THE Books_API SHALL return books with price less than or equal to priceMax.

---

### Requirement 6: Availability (In-Stock) Filtering

**User Story:** As a shopper, I want to show only in-stock books, so that I do not waste time on unavailable titles.

#### Acceptance Criteria

1. THE Filter_Sidebar SHALL display a স্টক স্ট্যাটাস section containing a toggle or checkbox labelled "শুধু ইন-স্টক বই".
2. WHEN the user enables the in-stock toggle, THE List_Page SHALL set the Active_Filter_State inStock flag to true and re-fetch books from the Books_API with `inStock=true`.
3. WHEN the user disables the in-stock toggle, THE List_Page SHALL set the Active_Filter_State inStock flag to false and re-fetch books without the inStock parameter.
4. WHEN `inStock=true` is received, THE Books_API SHALL return only books that have at least one copy in stock.

---

### Requirement 7: Mobile Filter Drawer

**User Story:** As a mobile shopper, I want a dedicated filter interface that doesn't obscure the book grid until I request it, so that I can browse comfortably on small screens.

#### Acceptance Criteria

1. WHILE the viewport width is 860px or less, THE List_Page SHALL hide the Filter_Sidebar and render a "ফিল্টার ও সর্ট" button in a sticky bar at the top or bottom of the screen.
2. WHEN the user taps the "ফিল্টার ও সর্ট" button, THE List_Page SHALL open the Filter_Drawer with all filter and sort controls.
3. WHILE the Filter_Drawer is open, THE Filter_Drawer SHALL occupy the full viewport height and prevent background scroll.
4. THE Filter_Drawer SHALL contain a close button that dismisses it without applying changes if the user has not tapped an apply action.
5. THE Filter_Drawer SHALL contain an "প্রয়োগ করুন" (Apply) button that closes the drawer and applies the selected filters.
6. WHILE the viewport width is greater than 860px, THE List_Page SHALL hide the "ফিল্টার ও সর্ট" sticky button and display the Filter_Sidebar inline.

---

### Requirement 8: Active Filter Chips

**User Story:** As a shopper, I want to see my active filters displayed as removable chips above the book grid, so that I can understand and quickly modify my current filter state.

#### Acceptance Criteria

1. WHEN at least one filter is active in the Active_Filter_State, THE List_Page SHALL render a row of Filter_Chips above the book grid.
2. THE List_Page SHALL render one Filter_Chip per active filter value (one chip per selected category, per selected author, per selected publisher, one chip for the price range if set, one chip for in-stock if enabled).
3. WHEN the user clicks the ✕ button on a Filter_Chip, THE List_Page SHALL remove that filter from the Active_Filter_State and re-fetch books.
4. WHEN at least one filter is active, THE List_Page SHALL render a "সব মুছুন" text action beside the chips.
5. WHEN the user clicks "সব মুছুন", THE List_Page SHALL reset all values in the Active_Filter_State to their defaults and re-fetch books.
6. WHEN no filters are active, THE List_Page SHALL not render the Filter_Chip row or the "সব মুছুন" action.

---

### Requirement 9: Pagination

**User Story:** As a shopper, I want paginated results instead of a single 50-item dump, so that pages load faster and I can navigate large catalogues easily.

#### Acceptance Criteria

1. THE Books_API SHALL accept `page` and `limit` query parameters on the bestsellers and new-arrivals endpoints.
2. THE Books_API SHALL return a response envelope containing `data` (array of books), `total` (total matching books count), `currentPage`, and `totalPages`.
3. THE List_Page SHALL render Pagination_Controls below the book grid showing page numbers and previous/next navigation arrows.
4. WHEN the user clicks a page number button in the Pagination_Controls, THE List_Page SHALL update the current page in state and re-fetch books with the new `page` value while preserving all active filters and the active sort key.
5. WHEN the current page is 1, THE List_Page SHALL render the previous arrow button in a disabled state.
6. WHEN the current page equals `totalPages`, THE List_Page SHALL render the next arrow button in a disabled state.
7. THE Pagination_Controls SHALL display page numbers using Bengali numerals (e.g., ১, ২, ৩).
8. WHEN filters or sort change, THE List_Page SHALL reset to page 1 before re-fetching.

---

### Requirement 10: Empty State

**User Story:** As a shopper, I want a clear message when no books match my filters, so that I know the combination is empty and can easily reset.

#### Acceptance Criteria

1. WHEN the Books_API returns an empty `data` array for a filtered request, THE List_Page SHALL replace the book grid with an empty-state view.
2. THE empty-state view SHALL display an illustrative icon, the message "কোনো বই পাওয়া যায়নি", and a "ফিল্টার রিসেট করুন" button.
3. WHEN the user clicks "ফিল্টার রিসেট করুন", THE List_Page SHALL reset the Active_Filter_State to defaults and re-fetch books.

---

### Requirement 11: BookCard Cover Aspect Ratio

**User Story:** As a shopper, I want all book covers to be uniform in size, so that the grid looks visually consistent regardless of original image dimensions.

#### Acceptance Criteria

1. THE BookCard SHALL wrap every cover image in a container with a fixed 2:3 aspect ratio.
2. THE BookCard SHALL render cover images with `object-fit: cover` so differing source image dimensions do not misalign card rows.

---

### Requirement 12: BookCard Rating Display

**User Story:** As a shopper, I want to see ratings only when a book has been reviewed, so that unrated books don't show misleading empty stars.

#### Acceptance Criteria

1. WHEN a book has a rating of 0 and a review count of 0, THE BookCard SHALL not render the star rating row.
2. WHEN a book has a rating greater than 0 or a review count greater than 0, THE BookCard SHALL render the star row with gold filled stars proportional to the rating value.
3. WHEN a book has a rating of 0 and a review count of 0, THE BookCard SHALL render a subtle "নতুন" badge in place of the star row to indicate it is a new or unrated release.

---

### Requirement 13: BookCard Typography

**User Story:** As a shopper, I want book titles and author names to be clearly legible and neatly truncated, so that the grid remains tidy at all card sizes.

#### Acceptance Criteria

1. THE BookCard SHALL truncate the book title at 2 lines maximum using CSS line-clamp, appending an ellipsis for overflow text.
2. THE BookCard SHALL render the author name at a minimum font size of 0.85rem.

---

### Requirement 14: Bengali Numeral Formatting

**User Story:** As a Bengali-language shopper, I want all prices and discount percentages displayed in Bengali numerals, so that the UI is fully consistent with the language of the application.

#### Acceptance Criteria

1. THE Bengali_Numeral_Formatter SHALL convert every ASCII digit character (0–9) in a given string to its Bengali Unicode counterpart (০–৯).
2. THE BookCard SHALL apply THE Bengali_Numeral_Formatter to the displayed price value, producing output such as "৳৮৫" instead of "৳85".
3. THE BookCard SHALL apply THE Bengali_Numeral_Formatter to the displayed original price value when a strikethrough price is shown.
4. THE BookCard SHALL apply THE Bengali_Numeral_Formatter to the displayed discount percentage label (e.g., "-২০%" instead of "-20%").
5. THE BookCard SHALL not append trailing ".00" decimal zeros to whole-number prices.
6. THE Pagination_Controls SHALL apply THE Bengali_Numeral_Formatter to all rendered page numbers.

---

### Requirement 15: BookCard Hover State Refinements

**User Story:** As a shopper, I want the card hover overlay to look polished with action buttons that don't bleed to the card edges and a clearly visible wishlist icon, so that the interaction feels intentional and accessible.

#### Acceptance Criteria

1. THE BookCard overlay action buttons SHALL have sufficient padding so that no button border touches the card edge.
2. THE BookCard SHALL render the wishlist Heart icon in the top-right corner of the cover image at all times (not only on hover), with full opacity when the book is wishlisted and reduced opacity when it is not.
3. WHEN the user clicks the wishlist Heart icon on THE BookCard, THE BookCard SHALL call toggleWish without navigating away.

---

### Requirement 16: Navigation & Page Header Refinements

**User Story:** As a shopper, I want consistent visual hierarchy in breadcrumbs, page titles, and the navigation bar, so that pages feel polished and easy to scan.

#### Acceptance Criteria

1. THE List_Page header SHALL apply a vertical margin of at least 8px between the breadcrumb line and the page heading.
2. THE List_Page subtitle text SHALL use a color value with contrast ratio of at least 4.5:1 against the page background, per WCAG AA guidelines.
3. WHILE a top navigation link corresponds to the current route, THE List_Page navigation component SHALL apply consistent vertical padding and font weight to distinguish the active link from inactive links.

---

### Requirement 17: Backend API Filter Parameter Support

**User Story:** As a developer, I want the Books_API to accept all filter and sort parameters in a single request, so that the frontend can retrieve precisely filtered and sorted pages of books efficiently.

#### Acceptance Criteria

1. THE Books_API `/api/books/bestsellers` endpoint SHALL accept the query parameters: `sort`, `category`, `author`, `publisher`, `priceMin`, `priceMax`, `inStock`, `page`, and `limit`.
2. THE Books_API SHALL apply all provided filter parameters together using AND logic across different filter types (e.g., a request with both `category=উপন্যাস` and `author=হুমায়ূন আহমেদ` returns only novels by that author).
3. THE Books_API SHALL return a `200 OK` response with the standard envelope (`data`, `total`, `currentPage`, `totalPages`) for all valid filter combinations, including combinations that yield zero results.
4. IF THE Books_API receives a `priceMin` or `priceMax` value that is not a non-negative number, THEN THE Books_API SHALL return a `400 Bad Request` response with a descriptive error message.
5. IF THE Books_API receives a `page` value less than 1 or a `limit` value less than 1, THEN THE Books_API SHALL return a `400 Bad Request` response with a descriptive error message.
6. THE Books_API `/api/books/new-arrivals` endpoint SHALL accept the same set of query parameters as the bestsellers endpoint.

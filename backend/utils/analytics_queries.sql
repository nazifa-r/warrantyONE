-- =====================================================================
-- WarrantyOne — Analytics Queries for MySQL Workbench
-- =====================================================================
-- Run these directly against the warrantyone_db database (the one
-- created by utils/schema.sql). Each block is self-contained — select
-- the block you want and run it (Ctrl+Enter / the lightning-bolt icon
-- for the statement your cursor is in).
--
-- These are the exact same queries used in
-- backend/controllers/analyticsController.js — this file just lets
-- you demo them straight from Workbench without running the API.
-- =====================================================================

USE warrantyone_db;


-- =====================================================================
-- 1. JOIN  (INNER JOIN)
-- Every registered product joined across category, brand, and the
-- customer who owns it.
-- =====================================================================
SELECT
    p.product_id, p.product_name, p.serial_number,
    cat.category_name, b.brand_name,
    u.full_name AS customer_name, u.email AS customer_email,
    p.purchase_date, p.purchase_price
FROM products p
INNER JOIN categories cat ON cat.category_id = p.category_id
INNER JOIN brands b       ON b.brand_id = p.brand_id
INNER JOIN customers c    ON c.customer_id = p.customer_id
INNER JOIN users u        ON u.user_id = c.user_id
ORDER BY p.created_at DESC;


-- =====================================================================
-- 2. LEFT JOIN
-- Every customer, including ones who haven't registered a product yet
-- (product_count = 0). An INNER JOIN would silently drop them.
-- =====================================================================
SELECT
    u.full_name AS customer_name, u.email,
    COUNT(p.product_id) AS product_count
FROM customers c
INNER JOIN users u ON u.user_id = c.user_id
LEFT JOIN products p ON p.customer_id = c.customer_id
GROUP BY c.customer_id, u.full_name, u.email
ORDER BY product_count DESC;


-- =====================================================================
-- 3. UNION
-- One combined "needs attention" list: products with a warranty
-- expiring within 30 days, UNIONed with products under an open repair.
-- =====================================================================
SELECT p.product_id, p.product_name, p.serial_number,
       'Expiring Warranty' AS reason, w.end_date AS relevant_date
FROM products p
INNER JOIN warranties w ON w.product_id = p.product_id
WHERE w.status = 'Active'
  AND w.end_date BETWEEN CURDATE() AND DATE_ADD(CURDATE(), INTERVAL 30 DAY)

UNION

SELECT p.product_id, p.product_name, p.serial_number,
       'Pending Repair' AS reason, DATE(r.request_date) AS relevant_date
FROM products p
INNER JOIN repairs r ON r.product_id = p.product_id
WHERE r.status IN ('Pending', 'In_Progress')

ORDER BY relevant_date ASC;


-- =====================================================================
-- 4. INTERSECT
-- Customers who BOTH hold a paid plan (Extended/Premium) AND have
-- filed at least one repair. Requires MySQL 8.0.31+.
-- =====================================================================
SELECT DISTINCT p.customer_id
FROM products p
INNER JOIN warranties w ON w.product_id = p.product_id
WHERE w.plan_name IN ('Extended', 'Premium')

INTERSECT

SELECT DISTINCT p.customer_id
FROM products p
INNER JOIN repairs r ON r.product_id = p.product_id;

-- To see names instead of just customer_id, wrap the above as a
-- subquery and join back to users:
--
-- SELECT c.customer_id, u.full_name, u.email
-- FROM customers c
-- INNER JOIN users u ON u.user_id = c.user_id
-- WHERE c.customer_id IN (
--     SELECT DISTINCT p.customer_id
--     FROM products p
--     INNER JOIN warranties w ON w.product_id = p.product_id
--     WHERE w.plan_name IN ('Extended', 'Premium')
--     INTERSECT
--     SELECT DISTINCT p.customer_id
--     FROM products p
--     INNER JOIN repairs r ON r.product_id = p.product_id
-- );

-- Pre-8.0.31 MySQL/MariaDB fallback (same result, no INTERSECT keyword):
-- SELECT DISTINCT p.customer_id
-- FROM products p
-- INNER JOIN warranties w ON w.product_id = p.product_id
-- WHERE w.plan_name IN ('Extended', 'Premium')
--   AND p.customer_id IN (
--       SELECT DISTINCT p2.customer_id
--       FROM products p2
--       INNER JOIN repairs r ON r.product_id = p2.product_id
--   );


-- =====================================================================
-- 5. EXCEPT  (set difference)
-- Registered products that have NEVER had a repair filed —
-- "all products" minus "products that appear in repairs".
-- Requires MySQL 8.0.31+.
-- =====================================================================
SELECT product_id FROM products

EXCEPT

SELECT DISTINCT product_id FROM repairs;

-- To see full product details instead of just product_id:
--
-- SELECT p.product_id, p.product_name, p.serial_number,
--        cat.category_name, b.brand_name, u.full_name AS customer_name
-- FROM products p
-- LEFT JOIN categories cat ON cat.category_id = p.category_id
-- LEFT JOIN brands b ON b.brand_id = p.brand_id
-- LEFT JOIN customers c ON c.customer_id = p.customer_id
-- LEFT JOIN users u ON u.user_id = c.user_id
-- WHERE p.product_id IN (
--     SELECT product_id FROM products
--     EXCEPT
--     SELECT DISTINCT product_id FROM repairs
-- );

-- Pre-8.0.31 MySQL/MariaDB fallback (same result, no EXCEPT keyword):
-- SELECT p.product_id
-- FROM products p
-- LEFT JOIN repairs r ON r.product_id = p.product_id
-- WHERE r.repair_id IS NULL;


-- =====================================================================
-- 6. GROUP BY + aggregate functions
-- Products grouped by category, with COUNT / SUM / AVG per group.
-- =====================================================================
SELECT
    cat.category_name,
    COUNT(p.product_id) AS product_count,
    COALESCE(SUM(p.purchase_price), 0) AS total_value,
    COALESCE(AVG(p.purchase_price), 0) AS avg_price
FROM categories cat
LEFT JOIN products p ON p.category_id = cat.category_id
GROUP BY cat.category_id, cat.category_name
ORDER BY product_count DESC;


-- =====================================================================
-- 7. AGGREGATE with a condition (HAVING + conditional COUNT)
-- Groups products by customer, then keeps only groups whose total
-- spend exceeds a threshold. HAVING filters on the aggregate itself
-- (a plain WHERE can't reference SUM()). Also demonstrates conditional
-- aggregation: COUNT(CASE WHEN ... THEN ... END) counts only the rows
-- matching a condition, within a single GROUP BY pass.
-- =====================================================================
SELECT
    u.full_name AS customer_name, u.email,
    COUNT(DISTINCT p.product_id) AS product_count,
    SUM(p.purchase_price) AS total_spent,
    COUNT(DISTINCT CASE WHEN r.status = 'Pending' THEN r.repair_id END) AS pending_repairs
FROM customers c
INNER JOIN users u ON u.user_id = c.user_id
INNER JOIN products p ON p.customer_id = c.customer_id
LEFT JOIN repairs r ON r.product_id = p.product_id
GROUP BY c.customer_id, u.full_name, u.email
HAVING SUM(p.purchase_price) > 50000   -- threshold in BDT
ORDER BY total_spent DESC;


-- =====================================================================
-- 8a. SUBQUERY (plain / non-correlated)
-- Products priced above the average price across ALL products.
-- The subquery is computed once, independent of the outer row.
-- =====================================================================
SELECT p.product_id, p.product_name, p.serial_number, p.purchase_price,
       cat.category_name, b.brand_name, u.full_name AS customer_name
FROM products p
LEFT JOIN categories cat ON cat.category_id = p.category_id
LEFT JOIN brands b ON b.brand_id = p.brand_id
LEFT JOIN customers c ON c.customer_id = p.customer_id
LEFT JOIN users u ON u.user_id = c.user_id
WHERE p.purchase_price > (
    SELECT AVG(purchase_price) FROM products
)
ORDER BY p.purchase_price DESC;


-- =====================================================================
-- 8b. SUBQUERY (correlated)
-- Products priced above the average price within their OWN category.
-- This subquery references p.category_id from the outer query, so it
-- gets re-evaluated for every outer row — that's what makes it
-- "correlated" rather than a plain subquery like 8a.
-- =====================================================================
SELECT p.product_id, p.product_name, p.purchase_price, cat.category_name
FROM products p
INNER JOIN categories cat ON cat.category_id = p.category_id
WHERE p.purchase_price > (
    SELECT AVG(p2.purchase_price)
    FROM products p2
    WHERE p2.category_id = p.category_id
)
ORDER BY cat.category_name, p.purchase_price DESC;

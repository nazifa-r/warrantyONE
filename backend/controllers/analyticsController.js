const pool = require('../config/db');

// ─────────────────────────────────────────────────────────────────────
// WarrantyOne analytics — demonstrates the four core relational-algebra
// operations (JOIN, UNION, INTERSECT, EXCEPT/DIFFERENCE) plus GROUP BY,
// conditional aggregation, and subqueries, against the actual project
// schema. All routes are Admin/Retailer only (protect + authorize
// applied in routes/analyticsRoutes.js).
//
// A note on the `u.role = 'Customer'` filters below: the `customers`
// table row is created once at registration and never removed, even
// if that user's role is later changed (e.g. promoted to Admin). Any
// query that joins customers -> users to label someone as "the
// customer" needs to also check their CURRENT role, or a promoted
// account can keep showing up in customer-facing reports.
//
// INTERSECT / EXCEPT use native MySQL syntax, which requires
// MySQL 8.0.31+. If you're on an older MySQL/MariaDB, each function
// below has a commented-out portable equivalent (INNER JOIN / LEFT
// JOIN ... IS NULL) you can swap in — same result set, older syntax.
// ─────────────────────────────────────────────────────────────────────

// GET /api/analytics/product-ownership  (INNER JOIN)
// Every registered product joined across category, brand, and the
// customer who owns it — the base "who owns what" report.
const productOwnershipReport = async (req, res, next) => {
  try {
    const [rows] = await pool.query(`
      SELECT
        p.product_id, p.product_name, p.serial_number,
        cat.category_name, b.brand_name,
        u.full_name AS customer_name, u.email AS customer_email,
        p.purchase_date, p.purchase_price
      FROM products p
      INNER JOIN categories cat ON cat.category_id = p.category_id
      INNER JOIN brands b ON b.brand_id = p.brand_id
      INNER JOIN customers c ON c.customer_id = p.customer_id
      INNER JOIN users u ON u.user_id = c.user_id
      WHERE u.role = 'Customer'
      ORDER BY p.created_at DESC
    `);
    res.json({ success: true, operation: 'JOIN', data: rows });
  } catch (err) {
    next(err);
  }
};

// GET /api/analytics/customer-product-counts  (LEFT JOIN)
// Every customer, including ones who haven't registered a product yet
// (product_count = 0) — an INNER JOIN would silently drop them.
const customerProductCounts = async (req, res, next) => {
  try {
    const [rows] = await pool.query(`
      SELECT
        u.full_name AS customer_name, u.email,
        COUNT(p.product_id) AS product_count
      FROM customers c
      INNER JOIN users u ON u.user_id = c.user_id
      LEFT JOIN products p ON p.customer_id = c.customer_id
      WHERE u.role = 'Customer'
      GROUP BY c.customer_id, u.full_name, u.email
      ORDER BY product_count DESC
    `);
    res.json({ success: true, operation: 'LEFT JOIN', data: rows });
  } catch (err) {
    next(err);
  }
};

// GET /api/analytics/attention-needed  (UNION)
// One combined "needs attention" list: products with a warranty
// expiring within 30 days, UNIONed with products that currently have
// an open repair ticket. Both branches are shaped identically
// (same column count/order) so UNION can stack them.
const attentionNeededReport = async (req, res, next) => {
  try {
    const [rows] = await pool.query(`
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

      ORDER BY relevant_date ASC
    `);
    res.json({ success: true, operation: 'UNION', data: rows });
  } catch (err) {
    next(err);
  }
};

// GET /api/analytics/engaged-premium-customers  (INTERSECT)
// Customers who BOTH hold a paid plan (Extended/Premium) AND have
// filed at least one repair — i.e. paying customers actually using
// support. Two independent customer_id sets, intersected.
const engagedPremiumCustomers = async (req, res, next) => {
  try {
    const [rows] = await pool.query(`
      SELECT DISTINCT p.customer_id
      FROM products p
      INNER JOIN warranties w ON w.product_id = p.product_id
      WHERE w.plan_name IN ('Extended', 'Premium')

      INTERSECT

      SELECT DISTINCT p.customer_id
      FROM products p
      INNER JOIN repairs r ON r.product_id = p.product_id

      /* Pre-8.0.31 MySQL/MariaDB fallback (same result, no INTERSECT):
      SELECT DISTINCT p.customer_id
      FROM products p
      INNER JOIN warranties w ON w.product_id = p.product_id
      WHERE w.plan_name IN ('Extended', 'Premium')
        AND p.customer_id IN (
          SELECT DISTINCT p2.customer_id
          FROM products p2
          INNER JOIN repairs r ON r.product_id = p2.product_id
        )
      */
    `);

    const customerIds = rows.map((r) => r.customer_id);
    if (customerIds.length === 0) {
      return res.json({ success: true, operation: 'INTERSECT', data: [] });
    }

    const placeholders = customerIds.map(() => '?').join(',');
    const [customers] = await pool.query(
      `SELECT c.customer_id, u.full_name AS customer_name, u.email
       FROM customers c
       INNER JOIN users u ON u.user_id = c.user_id
       WHERE c.customer_id IN (${placeholders})
         AND u.role = 'Customer'`,
      customerIds
    );

    res.json({ success: true, operation: 'INTERSECT', data: customers });
  } catch (err) {
    next(err);
  }
};

// GET /api/analytics/trouble-free-products  (EXCEPT / set difference)
// Registered products that have NEVER had a repair filed —
// "all products" minus "products that appear in repairs".
const troubleFreeProducts = async (req, res, next) => {
  try {
    const [rows] = await pool.query(`
      SELECT product_id FROM products

      EXCEPT

      SELECT DISTINCT product_id FROM repairs

      /* Pre-8.0.31 MySQL/MariaDB fallback (same result, no EXCEPT):
      SELECT p.product_id
      FROM products p
      LEFT JOIN repairs r ON r.product_id = p.product_id
      WHERE r.repair_id IS NULL
      */
    `);

    const productIds = rows.map((r) => r.product_id);
    if (productIds.length === 0) {
      return res.json({ success: true, operation: 'EXCEPT', data: [] });
    }

    const placeholders = productIds.map(() => '?').join(',');
    const [products] = await pool.query(
      `SELECT p.product_id, p.product_name, p.serial_number,
              cat.category_name, b.brand_name, u.full_name AS customer_name
       FROM products p
       LEFT JOIN categories cat ON cat.category_id = p.category_id
       LEFT JOIN brands b ON b.brand_id = p.brand_id
       LEFT JOIN customers c ON c.customer_id = p.customer_id
       LEFT JOIN users u ON u.user_id = c.user_id AND u.role = 'Customer'
       WHERE p.product_id IN (${placeholders})`,
      productIds
    );

    res.json({ success: true, operation: 'EXCEPT', data: products });
  } catch (err) {
    next(err);
  }
};

// GET /api/analytics/category-summary  (GROUP BY + aggregate functions)
// One row per category: how many products are registered in it, and
// the total/average purchase price across those products.
const categorySummary = async (req, res, next) => {
  try {
    const [rows] = await pool.query(`
      SELECT
        cat.category_name,
        COUNT(p.product_id) AS product_count,
        COALESCE(SUM(p.purchase_price), 0) AS total_value,
        COALESCE(AVG(p.purchase_price), 0) AS avg_price
      FROM categories cat
      LEFT JOIN products p ON p.category_id = cat.category_id
      GROUP BY cat.category_id, cat.category_name
      ORDER BY product_count DESC
    `);
    res.json({ success: true, operation: 'GROUP BY', data: rows });
  } catch (err) {
    next(err);
  }
};

// GET /api/analytics/high-value-customers  (aggregate WITH a condition)
// Groups products by customer, then keeps only the groups whose total
// spend clears a threshold — HAVING filters on the aggregate itself,
// which a plain WHERE can't do. Also throws in a conditional aggregate
// (COUNT(CASE WHEN ...)) to count just the pending repairs per group.
const HIGH_VALUE_THRESHOLD = 50000; // BDT — adjust as needed

const highValueCustomers = async (req, res, next) => {
  try {
    const [rows] = await pool.query(
      `
      SELECT
        u.full_name AS customer_name, u.email,
        COUNT(DISTINCT p.product_id) AS product_count,
        SUM(p.purchase_price) AS total_spent,
        COUNT(DISTINCT CASE WHEN r.status = 'Pending' THEN r.repair_id END) AS pending_repairs
      FROM customers c
      INNER JOIN users u ON u.user_id = c.user_id
      INNER JOIN products p ON p.customer_id = c.customer_id
      LEFT JOIN repairs r ON r.product_id = p.product_id
      WHERE u.role = 'Customer'
      GROUP BY c.customer_id, u.full_name, u.email
      HAVING SUM(p.purchase_price) > ?
      ORDER BY total_spent DESC
      `,
      [HIGH_VALUE_THRESHOLD]
    );
    res.json({ success: true, operation: 'AGGREGATE + HAVING', threshold: HIGH_VALUE_THRESHOLD, data: rows });
  } catch (err) {
    next(err);
  }
};

// GET /api/analytics/above-average-products  (SUBQUERY)
// Two variants side by side:
//  - overall: products priced above the average price across ALL
//    products (plain scalar subquery, computed once).
//  - byCategory: products priced above the average price within their
//    OWN category (correlated subquery — recomputed per outer row,
//    since it references p.category_id from the outer query).
const aboveAveragePriceProducts = async (req, res, next) => {
  try {
    const [overall] = await pool.query(`
      SELECT p.product_id, p.product_name, p.serial_number, p.purchase_price,
             cat.category_name, b.brand_name, u.full_name AS customer_name
      FROM products p
      LEFT JOIN categories cat ON cat.category_id = p.category_id
      LEFT JOIN brands b ON b.brand_id = p.brand_id
      LEFT JOIN customers c ON c.customer_id = p.customer_id
      LEFT JOIN users u ON u.user_id = c.user_id AND u.role = 'Customer'
      WHERE p.purchase_price > (
        SELECT AVG(purchase_price) FROM products
      )
      ORDER BY p.purchase_price DESC
    `);

    const [byCategory] = await pool.query(`
      SELECT p.product_id, p.product_name, p.purchase_price, cat.category_name
      FROM products p
      INNER JOIN categories cat ON cat.category_id = p.category_id
      WHERE p.purchase_price > (
        SELECT AVG(p2.purchase_price)
        FROM products p2
        WHERE p2.category_id = p.category_id
      )
      ORDER BY cat.category_name, p.purchase_price DESC
    `);

    res.json({
      success: true,
      operation: 'SUBQUERY',
      data: { overall, byCategory },
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  productOwnershipReport,
  customerProductCounts,
  attentionNeededReport,
  engagedPremiumCustomers,
  troubleFreeProducts,
  categorySummary,
  highValueCustomers,
  aboveAveragePriceProducts,
};

const pool = require('../config/db');
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
       WHERE c.customer_id IN (${placeholders})`,
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
       LEFT JOIN users u ON u.user_id = c.user_id
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
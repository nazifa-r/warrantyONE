const pool = require('../config/db');

// Shared query fragment: product joined with category/brand names,
// plus warranties[] and repairs[] aggregated as JSON arrays — this
// matches exactly what MyProductsPage / ProductDetailPage / the
// customer dashboard read off each product object.
// MySQL's JSON_ARRAYAGG doesn't support ORDER BY directly, so each
// list is built from a pre-sorted derived table.
const PRODUCT_SELECT = `
  SELECT
    p.product_id, p.customer_id, p.category_id, p.brand_id,
    p.product_name, p.model_number, p.serial_number,
    p.purchase_date, p.purchase_price, p.is_active,
    p.created_at, p.updated_at,
    cat.category_name, b.brand_name,
    cust.customer_id AS owner_customer_id,
    u.full_name AS customer_name,
    (SELECT JSON_ARRAYAGG(JSON_OBJECT(
        'warranty_id', wt.warranty_id, 'product_id', wt.product_id, 'plan_id', wt.plan_id,
        'plan_name', wt.plan_name, 'start_date', wt.start_date, 'end_date', wt.end_date,
        'status', wt.status, 'created_at', wt.created_at
      ))
     FROM (SELECT * FROM warranties w WHERE w.product_id = p.product_id ORDER BY w.end_date DESC) wt
    ) AS warranties,
    (SELECT JSON_ARRAYAGG(JSON_OBJECT(
        'repair_id', rt.repair_id, 'product_id', rt.product_id, 'issue_type', rt.issue_type,
        'issue_description', rt.issue_description, 'request_date', rt.request_date,
        'status', rt.status, 'updated_at', rt.updated_at
      ))
     FROM (SELECT * FROM repairs r WHERE r.product_id = p.product_id ORDER BY r.request_date DESC) rt
    ) AS repairs
  FROM products p
  LEFT JOIN categories cat ON cat.category_id = p.category_id
  LEFT JOIN brands b ON b.brand_id = p.brand_id
  LEFT JOIN customers cust ON cust.customer_id = p.customer_id
  LEFT JOIN users u ON u.user_id = cust.user_id
`;

// JSON_ARRAYAGG returns NULL (not []) when there are no rows to
// aggregate — normalize that here so the frontend's `.length`/`.find`
// calls on product.warranties / product.repairs never blow up.
const normalizeProduct = (product) => ({
  ...product,
  warranties: product.warranties || [],
  repairs: product.repairs || [],
});

// GET /api/products
// Customers see only their own products; Retailer/Technician/Admin see all.
const getAllProducts = async (req, res, next) => {
  try {
    let query = PRODUCT_SELECT;
    const params = [];

    if (req.user.role === 'Customer') {
      query += ` WHERE p.customer_id = ?`;
      params.push(req.user.customer_id);
    }

    query += ` ORDER BY p.created_at DESC`;

    const [rows] = await pool.query(query, params);
    res.json({ success: true, data: rows.map(normalizeProduct) });
  } catch (err) {
    next(err);
  }
};

// GET /api/products/:id
const getProductById = async (req, res, next) => {
  try {
    const [rows] = await pool.query(`${PRODUCT_SELECT} WHERE p.product_id = ?`, [req.params.id]);
    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }
    const product = normalizeProduct(rows[0]);
    if (req.user.role === 'Customer' && product.customer_id !== req.user.customer_id) {
      return res.status(403).json({ success: false, message: 'Not authorized to view this product' });
    }
    res.json({ success: true, data: product });
  } catch (err) {
    next(err);
  }
};

// GET /api/products/serial/:serial
const getProductBySerial = async (req, res, next) => {
  try {
    const [rows] = await pool.query(`${PRODUCT_SELECT} WHERE p.serial_number = ?`, [req.params.serial]);
    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }
    const product = normalizeProduct(rows[0]);
    if (req.user.role === 'Customer' && product.customer_id !== req.user.customer_id) {
      return res.status(403).json({ success: false, message: 'Not authorized to view this product' });
    }
    res.json({ success: true, data: product });
  } catch (err) {
    next(err);
  }
};

// GET /api/products/brands
const getBrands = async (req, res, next) => {
  try {
    const [rows] = await pool.query('SELECT * FROM brands ORDER BY brand_name');
    res.json({ success: true, data: rows });
  } catch (err) {
    next(err);
  }
};

// GET /api/products/categories
const getCategories = async (req, res, next) => {
  try {
    const [rows] = await pool.query('SELECT * FROM categories ORDER BY category_name');
    res.json({ success: true, data: rows });
  } catch (err) {
    next(err);
  }
};

// POST /api/products
// RegisterProductPage sends product fields + optional `plan`
// (standard/extended/premium) which we turn into a warranty row.
const createProduct = async (req, res, next) => {
  const conn = await pool.getConnection();
  try {
    const {
      product_name, category_id, brand_id, model_number,
      serial_number, purchase_date, purchase_price, plan,
    } = req.body;

    if (!product_name || !serial_number || !purchase_date) {
      return res.status(400).json({ success: false, message: 'Missing required product fields' });
    }

    // Customers can only register products for themselves.
    const customerId = req.user.role === 'Customer' ? req.user.customer_id : req.body.customer_id;
    if (!customerId) {
      return res.status(400).json({ success: false, message: 'Customer information is missing' });
    }

    await conn.beginTransaction();

    const [productResult] = await conn.execute(
      `INSERT INTO products
         (customer_id, category_id, brand_id, product_name, model_number, serial_number, purchase_date, purchase_price)
       VALUES (?,?,?,?,?,?,?,?)`,
      [customerId, category_id || null, brand_id || null, product_name, model_number || null,
       serial_number, purchase_date, purchase_price || null]
    );
    const productId = productResult.insertId;

    // Look up the chosen plan (defaults to Standard) and create the warranty.
    const planName = plan ? plan.charAt(0).toUpperCase() + plan.slice(1) : 'Standard';
    const [planRows] = await conn.execute(
      'SELECT * FROM warranty_plans WHERE plan_name = ?',
      [planName]
    );
    const warrantyPlan = planRows[0];

    if (warrantyPlan) {
      await conn.execute(
        `INSERT INTO warranties (product_id, plan_id, plan_name, start_date, end_date, status)
         VALUES (?, ?, ?, ?, DATE_ADD(?, INTERVAL ? MONTH), 'Active')`,
        [productId, warrantyPlan.plan_id, warrantyPlan.plan_name, purchase_date, purchase_date, warrantyPlan.duration_months]
      );
    }

    await conn.commit();

    const [full] = await pool.query(`${PRODUCT_SELECT} WHERE p.product_id = ?`, [productId]);
    res.status(201).json({ success: true, data: normalizeProduct(full[0]) });
  } catch (err) {
    await conn.rollback();
    next(err);
  } finally {
    conn.release();
  }
};

// PUT /api/products/:id
const updateProduct = async (req, res, next) => {
  try {
    const [existing] = await pool.execute('SELECT * FROM products WHERE product_id = ?', [req.params.id]);
    if (existing.length === 0) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }
    const current = existing[0];

    if (req.user.role === 'Customer' && current.customer_id !== req.user.customer_id) {
      return res.status(403).json({ success: false, message: 'Not authorized to edit this product' });
    }

    const {
      product_name = current.product_name,
      category_id = current.category_id,
      brand_id = current.brand_id,
      model_number = current.model_number,
      serial_number = current.serial_number,
      purchase_date = current.purchase_date,
      purchase_price = current.purchase_price,
      is_active = current.is_active,
    } = req.body;

    await pool.execute(
      `UPDATE products SET
         product_name = ?, category_id = ?, brand_id = ?, model_number = ?,
         serial_number = ?, purchase_date = ?, purchase_price = ?, is_active = ?
       WHERE product_id = ?`,
      [product_name, category_id, brand_id, model_number, serial_number,
       purchase_date, purchase_price, is_active, req.params.id]
    );

    const [full] = await pool.query(`${PRODUCT_SELECT} WHERE p.product_id = ?`, [req.params.id]);
    res.json({ success: true, data: normalizeProduct(full[0]) });
  } catch (err) {
    next(err);
  }
};

// DELETE /api/products/:id
const deleteProduct = async (req, res, next) => {
  try {
    const [existing] = await pool.execute('SELECT * FROM products WHERE product_id = ?', [req.params.id]);
    if (existing.length === 0) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }
    if (req.user.role === 'Customer' && existing[0].customer_id !== req.user.customer_id) {
      return res.status(403).json({ success: false, message: 'Not authorized to delete this product' });
    }

    await pool.execute('DELETE FROM products WHERE product_id = ?', [req.params.id]);
    res.json({ success: true, message: 'Product deleted successfully' });
  } catch (err) {
    next(err);
  }
};

// GET /api/products/:id/warranties
const getProductWarranties = async (req, res, next) => {
  try {
    const [rows] = await pool.execute(
      'SELECT * FROM warranties WHERE product_id = ? ORDER BY end_date DESC',
      [req.params.id]
    );
    res.json({ success: true, data: rows });
  } catch (err) {
    next(err);
  }
};

// GET /api/products/:id/repairs
const getProductRepairs = async (req, res, next) => {
  try {
    const [rows] = await pool.execute(
      'SELECT * FROM repairs WHERE product_id = ? ORDER BY request_date DESC',
      [req.params.id]
    );
    res.json({ success: true, data: rows });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getAllProducts, getProductById, getProductBySerial,
  createProduct, updateProduct, deleteProduct,
  getBrands, getCategories, getProductWarranties, getProductRepairs,
};

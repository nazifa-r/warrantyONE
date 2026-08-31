const pool = require('../config/db');

// GET /api/repairs  — customer's own repairs (joined with product info)
const getAllRepairs = async (req, res, next) => {
  try {
    let query = `
      SELECT r.*, p.product_name, p.serial_number, p.customer_id
      FROM repairs r
      JOIN products p ON p.product_id = r.product_id
    `;
    const params = [];
    if (req.user.role === 'Customer') {
      query += ' WHERE p.customer_id = ?';
      params.push(req.user.customer_id);
    }
    query += ' ORDER BY r.request_date DESC';

    const [rows] = await pool.query(query, params);
    res.json({ success: true, data: rows });
  } catch (err) {
    next(err);
  }
};

// POST /api/repairs  — request a repair for a product
const createRepair = async (req, res, next) => {
  try {
    const { product_id, issue_type, issue_description } = req.body;
    if (!product_id || !issue_type) {
      return res.status(400).json({ success: false, message: 'product_id and issue_type are required' });
    }

    const [productRows] = await pool.execute('SELECT customer_id FROM products WHERE product_id = ?', [product_id]);
    if (productRows.length === 0) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }
    if (req.user.role === 'Customer' && productRows[0].customer_id !== req.user.customer_id) {
      return res.status(403).json({ success: false, message: 'Not authorized to request a repair for this product' });
    }

    const [result] = await pool.execute(
      `INSERT INTO repairs (product_id, issue_type, issue_description, status)
       VALUES (?, ?, ?, 'Pending')`,
      [product_id, issue_type, issue_description || null]
    );
    const [rows] = await pool.execute('SELECT * FROM repairs WHERE repair_id = ?', [result.insertId]);
    res.status(201).json({ success: true, data: rows[0] });
  } catch (err) {
    next(err);
  }
};

// PUT /api/repairs/:id/status  (Technician/Admin)
const updateRepairStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const valid = ['Pending', 'In_Progress', 'Completed', 'Cancelled'];
    if (!valid.includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status' });
    }
    const [result] = await pool.execute(
      `UPDATE repairs SET status = ? WHERE repair_id = ?`,
      [status, req.params.id]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'Repair not found' });
    }
    const [rows] = await pool.execute('SELECT * FROM repairs WHERE repair_id = ?', [req.params.id]);
    res.json({ success: true, data: rows[0] });
  } catch (err) {
    next(err);
  }
};

// GET /api/repairs/:id  — a single repair (joined with product info)
const getRepairById = async (req, res, next) => {
  try {
    const [rows] = await pool.execute(
      `SELECT r.*, p.product_name, p.serial_number, p.customer_id
       FROM repairs r
       JOIN products p ON p.product_id = r.product_id
       WHERE r.repair_id = ?`,
      [req.params.id]
    );
    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Repair request not found' });
    }
    const repair = rows[0];
    if (req.user.role === 'Customer' && repair.customer_id !== req.user.customer_id) {
      return res.status(403).json({ success: false, message: 'Not authorized to view this repair request' });
    }
    res.json({ success: true, data: repair });
  } catch (err) {
    next(err);
  }
};

// PUT /api/repairs/:id  — edit issue_type/issue_description
// Customers can only edit their own repair while it's still Pending
// (once a technician has picked it up, the details are locked).
// Technician/Admin can edit at any status.
const updateRepair = async (req, res, next) => {
  try {
    const [existing] = await pool.execute(
      `SELECT r.*, p.customer_id
       FROM repairs r
       JOIN products p ON p.product_id = r.product_id
       WHERE r.repair_id = ?`,
      [req.params.id]
    );
    if (existing.length === 0) {
      return res.status(404).json({ success: false, message: 'Repair request not found' });
    }
    const current = existing[0];

    if (req.user.role === 'Customer') {
      if (current.customer_id !== req.user.customer_id) {
        return res.status(403).json({ success: false, message: 'Not authorized to edit this repair request' });
      }
      if (current.status !== 'Pending') {
        return res.status(400).json({ success: false, message: 'Only pending repair requests can be edited' });
      }
    }

    const {
      issue_type = current.issue_type,
      issue_description = current.issue_description,
    } = req.body;

    if (!issue_type) {
      return res.status(400).json({ success: false, message: 'issue_type is required' });
    }

    await pool.execute(
      `UPDATE repairs SET issue_type = ?, issue_description = ? WHERE repair_id = ?`,
      [issue_type, issue_description || null, req.params.id]
    );
    const [rows] = await pool.execute('SELECT * FROM repairs WHERE repair_id = ?', [req.params.id]);
    res.json({ success: true, data: rows[0] });
  } catch (err) {
    next(err);
  }
};

// PUT /api/repairs/:id/cancel  — customer self-service cancel
// Customers can only cancel their own repair while it's still
// Pending. Technician/Admin can cancel at any status.
const cancelRepair = async (req, res, next) => {
  try {
    const [existing] = await pool.execute(
      `SELECT r.*, p.customer_id
       FROM repairs r
       JOIN products p ON p.product_id = r.product_id
       WHERE r.repair_id = ?`,
      [req.params.id]
    );
    if (existing.length === 0) {
      return res.status(404).json({ success: false, message: 'Repair request not found' });
    }
    const current = existing[0];

    if (req.user.role === 'Customer') {
      if (current.customer_id !== req.user.customer_id) {
        return res.status(403).json({ success: false, message: 'Not authorized to cancel this repair request' });
      }
      if (current.status !== 'Pending') {
        return res.status(400).json({ success: false, message: 'Only pending repair requests can be cancelled' });
      }
    }

    await pool.execute(`UPDATE repairs SET status = 'Cancelled' WHERE repair_id = ?`, [req.params.id]);
    const [rows] = await pool.execute('SELECT * FROM repairs WHERE repair_id = ?', [req.params.id]);
    res.json({ success: true, data: rows[0] });
  } catch (err) {
    next(err);
  }
};

module.exports = { getAllRepairs, createRepair, updateRepairStatus, getRepairById, updateRepair, cancelRepair };

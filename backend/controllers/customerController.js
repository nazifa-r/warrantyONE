const pool = require('../config/db');

const CUSTOMER_SELECT = `
  SELECT c.customer_id, c.address, c.created_at,
         u.user_id, u.full_name, u.email, u.phone
  FROM customers c
  JOIN users u ON u.user_id = c.user_id
`;

// GET /api/customers  (Admin/Retailer only — enforced in routes)
const getAllCustomers = async (req, res, next) => {
  try {
    const [rows] = await pool.query(`${CUSTOMER_SELECT} ORDER BY c.created_at DESC`);
    res.json({ success: true, data: rows });
  } catch (err) {
    next(err);
  }
};

// GET /api/customers/:id
const getCustomerById = async (req, res, next) => {
  try {
    const [rows] = await pool.query(`${CUSTOMER_SELECT} WHERE c.customer_id = ?`, [req.params.id]);
    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Customer not found' });
    }
    res.json({ success: true, data: rows[0] });
  } catch (err) {
    next(err);
  }
};

// POST /api/customers  — attach an address to the current user's customer record
const createCustomer = async (req, res, next) => {
  try {
    const { address } = req.body;
    await pool.execute(
      `UPDATE customers SET address = ? WHERE customer_id = ?`,
      [address || null, req.user.customer_id]
    );
    const [rows] = await pool.query(`${CUSTOMER_SELECT} WHERE c.customer_id = ?`, [req.user.customer_id]);
    res.status(201).json({ success: true, data: rows[0] });
  } catch (err) {
    next(err);
  }
};

// PUT /api/customers/:id
const updateCustomer = async (req, res, next) => {
  try {
    if (req.user.role === 'Customer' && Number(req.params.id) !== req.user.customer_id) {
      return res.status(403).json({ success: false, message: 'Not authorized to edit this customer' });
    }
    const { address } = req.body;
    const [result] = await pool.execute(
      `UPDATE customers SET address = ? WHERE customer_id = ?`,
      [address || null, req.params.id]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'Customer not found' });
    }
    const [rows] = await pool.query(`${CUSTOMER_SELECT} WHERE c.customer_id = ?`, [req.params.id]);
    res.json({ success: true, data: rows[0] });
  } catch (err) {
    next(err);
  }
};

module.exports = { getAllCustomers, getCustomerById, createCustomer, updateCustomer };

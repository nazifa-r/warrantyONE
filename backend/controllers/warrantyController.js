const pool = require('../config/db');

// GET /api/warranties/plans
const getPlans = async (req, res, next) => {
  try {
    const [rows] = await pool.query('SELECT * FROM warranty_plans ORDER BY duration_months');
    res.json({ success: true, data: rows });
  } catch (err) {
    next(err);
  }
};

// GET /api/warranties/plans/:id
const getPlanById = async (req, res, next) => {
  try {
    const [rows] = await pool.execute('SELECT * FROM warranty_plans WHERE plan_id = ?', [req.params.id]);
    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Plan not found' });
    }
    res.json({ success: true, data: rows[0] });
  } catch (err) {
    next(err);
  }
};

// POST /api/warranties/plans  (Admin only)
const createPlan = async (req, res, next) => {
  try {
    const { plan_name, duration_months, price, description } = req.body;
    if (!plan_name || !duration_months) {
      return res.status(400).json({ success: false, message: 'plan_name and duration_months are required' });
    }
    const [result] = await pool.execute(
      `INSERT INTO warranty_plans (plan_name, duration_months, price, description)
       VALUES (?,?,?,?)`,
      [plan_name, duration_months, price || 0, description || null]
    );
    const [rows] = await pool.execute('SELECT * FROM warranty_plans WHERE plan_id = ?', [result.insertId]);
    res.status(201).json({ success: true, data: rows[0] });
  } catch (err) {
    next(err);
  }
};

// PUT /api/warranties/plans/:id  (Admin only)
const updatePlan = async (req, res, next) => {
  try {
    const [existing] = await pool.execute('SELECT * FROM warranty_plans WHERE plan_id = ?', [req.params.id]);
    if (existing.length === 0) {
      return res.status(404).json({ success: false, message: 'Plan not found' });
    }
    const current = existing[0];
    const {
      plan_name = current.plan_name,
      duration_months = current.duration_months,
      price = current.price,
      description = current.description,
    } = req.body;

    await pool.execute(
      `UPDATE warranty_plans SET plan_name=?, duration_months=?, price=?, description=?
       WHERE plan_id=?`,
      [plan_name, duration_months, price, description, req.params.id]
    );
    const [rows] = await pool.execute('SELECT * FROM warranty_plans WHERE plan_id = ?', [req.params.id]);
    res.json({ success: true, data: rows[0] });
  } catch (err) {
    next(err);
  }
};

// DELETE /api/warranties/plans/:id  (Admin only)
const deletePlan = async (req, res, next) => {
  try {
    const [result] = await pool.execute('DELETE FROM warranty_plans WHERE plan_id = ?', [req.params.id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'Plan not found' });
    }
    res.json({ success: true, message: 'Plan deleted successfully' });
  } catch (err) {
    next(err);
  }
};

module.exports = { getPlans, getPlanById, createPlan, updatePlan, deletePlan };

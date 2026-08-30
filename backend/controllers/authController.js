const pool = require('../config/db');
const { generateToken, hashPassword, comparePassword } = require('../utils/authUtils');

// POST /api/auth/register
// Frontend sends: { full_name, email, password, phone, role }
// Frontend expects: response.data.data.{ user, token }
const register = async (req, res, next) => {
  const conn = await pool.getConnection();
  try {
    const { full_name, email, password, phone, role } = req.body;

    if (!full_name || !email || !password || !role) {
      return res.status(400).json({ success: false, message: 'Please provide all required fields' });
    }

    const validRoles = ['Customer', 'Retailer', 'Technician', 'Admin'];
    if (!validRoles.includes(role)) {
      return res.status(400).json({ success: false, message: 'Invalid role' });
    }

    const [existing] = await conn.execute('SELECT user_id FROM users WHERE email = ?', [email]);
    if (existing.length > 0) {
      return res.status(409).json({ success: false, message: 'An account with this email already exists' });
    }

    const passwordHash = await hashPassword(password);

    await conn.beginTransaction();

    const [userResult] = await conn.execute(
      `INSERT INTO users (full_name, email, password_hash, phone, role)
       VALUES (?, ?, ?, ?, ?)`,
      [full_name, email, passwordHash, phone || null, role]
    );
    const userId = userResult.insertId;

    let customerId = null;
    // Customers get a linked customers row so product ownership works
    if (role === 'Customer') {
      const [custResult] = await conn.execute(
        `INSERT INTO customers (user_id) VALUES (?)`,
        [userId]
      );
      customerId = custResult.insertId;
    }

    await conn.commit();

    const [rows] = await conn.execute(
      'SELECT user_id, full_name, email, phone, role, created_at FROM users WHERE user_id = ?',
      [userId]
    );
    const user = rows[0];
    if (customerId) user.customer_id = customerId;

    const token = generateToken(user.user_id);

    res.status(201).json({
      success: true,
      data: { user, token },
    });
  } catch (err) {
    await conn.rollback();
    next(err);
  } finally {
    conn.release();
  }
};

// POST /api/auth/login
// Frontend sends: { email, password }
// Frontend expects: response.data.data.{ user, token }
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide email and password' });
    }

    const [rows] = await pool.execute(
      `SELECT u.user_id, u.full_name, u.email, u.phone, u.role, u.password_hash, u.created_at,
              c.customer_id
       FROM users u
       LEFT JOIN customers c ON c.user_id = u.user_id
       WHERE u.email = ?`,
      [email]
    );

    if (rows.length === 0) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    const user = rows[0];
    const isMatch = await comparePassword(password, user.password_hash);

    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    delete user.password_hash;
    const token = generateToken(user.user_id);

    res.json({
      success: true,
      data: { user, token },
    });
  } catch (err) {
    next(err);
  }
};

// GET /api/auth/me
// Frontend expects: response.data.data = user
const getMe = async (req, res) => {
  res.json({ success: true, data: req.user });
};

// POST /api/auth/logout
// Stateless JWT — frontend already clears localStorage; this just
// gives it a clean endpoint to call.
const logout = async (req, res) => {
  res.json({ success: true, message: 'Logged out successfully' });
};

module.exports = { register, login, getMe, logout };

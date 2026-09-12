const jwt = require('jsonwebtoken');
const pool = require('../config/db');

// Verifies the Bearer token the frontend's axios interceptor attaches,
// and loads the current user (with customer_id if role = Customer)
// onto req.user. On failure, sends 401 — the frontend's response
// interceptor already handles 401 by clearing localStorage and
// redirecting to /login.
const protect = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ success: false, message: 'Not authorized, no token' });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const [rows] = await pool.execute(
      `SELECT u.user_id, u.full_name, u.email, u.phone, u.role, u.created_at,
              c.customer_id
       FROM users u
       LEFT JOIN customers c ON c.user_id = u.user_id
       WHERE u.user_id = ?`,
      [decoded.user_id]
    );

    if (rows.length === 0) {
      return res.status(401).json({ success: false, message: 'User no longer exists' });
    }

    req.user = rows[0];
    next();
  } catch (err) {
    return res.status(401).json({ success: false, message: 'Not authorized, token failed' });
  }
};

// Restrict a route to specific roles, e.g. authorize('Admin', 'Retailer')
const authorize = (...roles) => (req, res, next) => {
  if (!req.user || !roles.map(r => r.toLowerCase()).includes(req.user.role.toLowerCase())) {
    return res.status(403).json({ success: false, message: 'Not authorized for this action' });
  }
  next();
};

module.exports = { protect, authorize };

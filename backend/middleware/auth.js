const jwt = require('jsonwebtoken');
const { query } = require('../config/db');
const { sendError } = require('../utils/responseHandler');

const protect = async (req, res, next) => {
  let token;
  
  // Check for token in headers
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }
  
  if (!token) {
    return sendError(res, 'Not authorized, no token', 401);
  }
  
  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Get user from database
    const users = await query(
      'SELECT user_id, full_name, email, phone, role FROM Users WHERE user_id = ?',
      [decoded.user_id]
    );
    
    if (!users || users.length === 0) {
      return sendError(res, 'User not found', 401);
    }
    
    req.user = users[0];
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return sendError(res, 'Invalid token', 401);
    }
    if (error.name === 'TokenExpiredError') {
      return sendError(res, 'Token expired', 401);
    }
    return sendError(res, 'Not authorized', 401);
  }
};

// Role-based authorization
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return sendError(res, 'Not authorized', 401);
    }
    
    if (!roles.includes(req.user.role)) {
      return sendError(res, `Role ${req.user.role} is not authorized to access this resource`, 403);
    }
    
    next();
  };
};

module.exports = {
  protect,
  authorize
};
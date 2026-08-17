const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { sendSuccess, sendError } = require('../utils/responseHandler');

// Placeholder routes - we'll implement these later
router.post('/register', (req, res) => {
  sendSuccess(res, null, 'Register endpoint - to be implemented');
});

router.post('/login', (req, res) => {
  sendSuccess(res, null, 'Login endpoint - to be implemented');
});

router.get('/me', protect, (req, res) => {
  sendSuccess(res, req.user, 'User profile retrieved');
});

router.post('/logout', (req, res) => {
  sendSuccess(res, null, 'Logged out successfully');
});

module.exports = router;
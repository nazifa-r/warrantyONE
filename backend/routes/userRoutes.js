const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const { sendSuccess } = require('../utils/responseHandler');

// Get all users (Admin only)
router.get('/', protect, authorize('Admin'), (req, res) => {
  sendSuccess(res, [], 'Users list - to be implemented');
});

// Get user by ID
router.get('/:id', protect, (req, res) => {
  sendSuccess(res, null, 'User details - to be implemented');
});

// Update user
router.put('/:id', protect, (req, res) => {
  sendSuccess(res, null, 'User updated - to be implemented');
});

// Delete user (Admin only)
router.delete('/:id', protect, authorize('Admin'), (req, res) => {
  sendSuccess(res, null, 'User deleted - to be implemented');
});

module.exports = router;
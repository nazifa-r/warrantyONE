const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const { sendSuccess } = require('../utils/responseHandler');

// Get all customers (Admin/Retailer only)
router.get('/', protect, authorize('Admin', 'Retailer'), (req, res) => {
  sendSuccess(res, [], 'Customers list - to be implemented');
});

// Get customer profile
router.get('/profile', protect, (req, res) => {
  sendSuccess(res, null, 'Customer profile - to be implemented');
});

// Get customer by ID
router.get('/:id', protect, (req, res) => {
  sendSuccess(res, null, 'Customer details - to be implemented');
});

// Create customer profile
router.post('/', protect, (req, res) => {
  sendSuccess(res, null, 'Customer created - to be implemented');
});

// Update customer
router.put('/:id', protect, (req, res) => {
  sendSuccess(res, null, 'Customer updated - to be implemented');
});

module.exports = router;
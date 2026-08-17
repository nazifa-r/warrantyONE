const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const { sendSuccess } = require('../utils/responseHandler');

// Get all payments (Admin only)
router.get('/', protect, authorize('Admin'), (req, res) => {
  sendSuccess(res, [], 'Payments list - to be implemented');
});

// Get payment by ID
router.get('/:id', protect, (req, res) => {
  sendSuccess(res, null, 'Payment details - to be implemented');
});

// Create payment
router.post('/', protect, (req, res) => {
  sendSuccess(res, null, 'Payment created - to be implemented');
});

// Update payment status
router.put('/:id/status', protect, authorize('Admin'), (req, res) => {
  sendSuccess(res, null, 'Payment status updated - to be implemented');
});

// Get customer payments
router.get('/customer/:customerId', protect, (req, res) => {
  sendSuccess(res, [], 'Customer payments - to be implemented');
});

// Get payments by invoice
router.get('/invoice/:invoiceId', protect, (req, res) => {
  sendSuccess(res, [], 'Invoice payments - to be implemented');
});

module.exports = router;
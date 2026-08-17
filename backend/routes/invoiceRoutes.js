const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const { sendSuccess } = require('../utils/responseHandler');

// Get all invoices (Admin/Retailer only)
router.get('/', protect, authorize('Admin', 'Retailer'), (req, res) => {
  sendSuccess(res, [], 'Invoices list - to be implemented');
});

// Get invoice by ID
router.get('/:id', protect, (req, res) => {
  sendSuccess(res, null, 'Invoice details - to be implemented');
});

// Create invoice
router.post('/', protect, (req, res) => {
  sendSuccess(res, null, 'Invoice created - to be implemented');
});

// Update invoice
router.put('/:id', protect, authorize('Admin'), (req, res) => {
  sendSuccess(res, null, 'Invoice updated - to be implemented');
});

// Get customer invoices
router.get('/customer/:customerId', protect, (req, res) => {
  sendSuccess(res, [], 'Customer invoices - to be implemented');
});

// Get invoices by repair
router.get('/repair/:repairId', protect, (req, res) => {
  sendSuccess(res, [], 'Repair invoices - to be implemented');
});

module.exports = router;
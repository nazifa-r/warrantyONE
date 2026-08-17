const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const { sendSuccess } = require('../utils/responseHandler');

// Get all repairs (Admin/Retailer only)
router.get('/', protect, authorize('Admin', 'Retailer'), (req, res) => {
  sendSuccess(res, [], 'Repairs list - to be implemented');
});

// Get repair by ID
router.get('/:id', protect, (req, res) => {
  sendSuccess(res, null, 'Repair details - to be implemented');
});

// Create repair request
router.post('/', protect, (req, res) => {
  sendSuccess(res, null, 'Repair request created - to be implemented');
});

// Update repair (Technician only)
router.put('/:id', protect, authorize('Technician', 'Admin'), (req, res) => {
  sendSuccess(res, null, 'Repair updated - to be implemented');
});

// Assign technician (Admin only)
router.put('/:id/assign', protect, authorize('Admin'), (req, res) => {
  sendSuccess(res, null, 'Technician assigned - to be implemented');
});

// Update repair status
router.put('/:id/status', protect, authorize('Technician', 'Admin'), (req, res) => {
  sendSuccess(res, null, 'Repair status updated - to be implemented');
});

// Get customer repairs
router.get('/customer/:customerId', protect, (req, res) => {
  sendSuccess(res, [], 'Customer repairs - to be implemented');
});

// Get technician repairs
router.get('/technician/:technicianId', protect, authorize('Technician', 'Admin'), (req, res) => {
  sendSuccess(res, [], 'Technician repairs - to be implemented');
});

module.exports = router;
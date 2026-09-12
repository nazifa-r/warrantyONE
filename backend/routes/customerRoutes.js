const express = require('express');
const router = express.Router();
const {
  getAllCustomers, getCustomerById, createCustomer, updateCustomer,
} = require('../controllers/customerController');
const { protect, authorize } = require('../middleware/auth');

router.use(protect);

router.get('/', authorize('Admin', 'Retailer'), getAllCustomers);
router.get('/:id', getCustomerById);
router.post('/', createCustomer);
router.put('/:id', updateCustomer);

module.exports = router;

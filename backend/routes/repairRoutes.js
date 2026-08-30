const express = require('express');
const router = express.Router();
const { getAllRepairs, createRepair, updateRepairStatus } = require('../controllers/repairController');
const { protect, authorize } = require('../middleware/auth');

router.use(protect);

router.get('/', getAllRepairs);
router.post('/', createRepair);
router.put('/:id/status', authorize('Technician', 'Admin'), updateRepairStatus);

module.exports = router;

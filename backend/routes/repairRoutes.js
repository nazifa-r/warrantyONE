const express = require('express');
const router = express.Router();
const {
  getAllRepairs, createRepair, updateRepairStatus,
  getRepairById, updateRepair, cancelRepair,
} = require('../controllers/repairController');
const { protect, authorize } = require('../middleware/auth');

router.use(protect);

router.get('/', getAllRepairs);
router.post('/', createRepair);
router.get('/:id', getRepairById);
router.put('/:id', updateRepair);
router.put('/:id/cancel', cancelRepair);
router.put('/:id/status', authorize('Technician', 'Admin'), updateRepairStatus);

module.exports = router;

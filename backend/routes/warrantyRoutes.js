const express = require('express');
const router = express.Router();
const {
  getPlans, getPlanById, createPlan, updatePlan, deletePlan,
} = require('../controllers/warrantyController');
const { protect, authorize } = require('../middleware/auth');

router.get('/plans', getPlans);
router.get('/plans/:id', getPlanById);

router.post('/plans', protect, authorize('Admin'), createPlan);
router.put('/plans/:id', protect, authorize('Admin'), updatePlan);
router.delete('/plans/:id', protect, authorize('Admin'), deletePlan);

module.exports = router;

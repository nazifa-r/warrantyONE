const express = require('express');
const router = express.Router();
const {
  productOwnershipReport,
  customerProductCounts,
  attentionNeededReport,
  engagedPremiumCustomers,
  troubleFreeProducts,
  categorySummary,
  highValueCustomers,
  aboveAveragePriceProducts,
} = require('../controllers/analyticsController');
const { protect, authorize } = require('../middleware/auth');

// Reporting endpoints — Admin/Retailer only.
router.use(protect, authorize('Admin', 'Retailer'));

router.get('/product-ownership', productOwnershipReport);         // JOIN
router.get('/customer-product-counts', customerProductCounts);    // LEFT JOIN
router.get('/attention-needed', attentionNeededReport);           // UNION
router.get('/engaged-premium-customers', engagedPremiumCustomers);// INTERSECT
router.get('/trouble-free-products', troubleFreeProducts);        // EXCEPT
router.get('/category-summary', categorySummary);                 // GROUP BY + aggregates
router.get('/high-value-customers', highValueCustomers);          // aggregate + HAVING
router.get('/above-average-products', aboveAveragePriceProducts); // SUBQUERY

module.exports = router;

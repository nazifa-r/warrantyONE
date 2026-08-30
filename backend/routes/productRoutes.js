const express = require('express');
const router = express.Router();
const {
  getAllProducts, getProductById, getProductBySerial,
  createProduct, updateProduct, deleteProduct,
  getBrands, getCategories, getProductWarranties, getProductRepairs,
} = require('../controllers/productController');
const { protect } = require('../middleware/auth');

router.use(protect); // every product route requires a logged-in user

// Static/reference paths first — must precede '/:id'
router.get('/brands', getBrands);
router.get('/categories', getCategories);
router.get('/serial/:serial', getProductBySerial);

router.get('/', getAllProducts);
router.post('/', createProduct);
router.get('/:id', getProductById);
router.put('/:id', updateProduct);
router.delete('/:id', deleteProduct);
router.get('/:id/warranties', getProductWarranties);
router.get('/:id/repairs', getProductRepairs);

module.exports = router;

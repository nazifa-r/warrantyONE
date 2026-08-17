const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const { validate } = require('../middleware/validation');
const {
    getProducts,
    getProductById,
    getProductBySerial,
    createProduct,
    updateProduct,
    deleteProduct,
    getProductWarranty,
    getProductRepairs,
    getBrands,
    getCategories
} = require('../controllers/productController');

// Public routes (for dropdown data)
router.get('/brands', getBrands);
router.get('/categories', getCategories);

// Protected routes
router.get('/', protect, getProducts);
router.get('/serial/:serial', protect, getProductBySerial);
router.get('/:id', protect, getProductById);
router.get('/:id/warranties', protect, getProductWarranty);
router.get('/:id/repairs', protect, getProductRepairs);
router.post('/', protect, validate('product'), createProduct);
router.put('/:id', protect, validate('product'), updateProduct);
// DELETE - Removed authorize('Admin')
router.delete('/:id', protect, deleteProduct);

module.exports = router;
const Product = require('../models/Product');
const { sendSuccess, sendError } = require('../utils/responseHandler');

// Get all products for a customer
const getProducts = async (req, res) => {
    try {
        const customerId = req.query.customerId;
        const products = await Product.getAllProducts(customerId);
        sendSuccess(res, products, 'Products retrieved successfully');
    } catch (error) {
        console.error('Get products error:', error);
        sendError(res, 'Failed to retrieve products', 500);
    }
};

// Get a single product by ID
const getProductById = async (req, res) => {
    try {
        const { id } = req.params;
        const product = await Product.getProductById(id);
        
        if (!product) {
            return sendError(res, 'Product not found', 404);
        }
        
        sendSuccess(res, product, 'Product retrieved successfully');
    } catch (error) {
        console.error('Get product error:', error);
        sendError(res, 'Failed to retrieve product', 500);
    }
};

// Get product by serial number
const getProductBySerial = async (req, res) => {
    try {
        const { serial } = req.params;
        const product = await Product.getProductBySerial(serial);
        
        if (!product) {
            return sendError(res, 'Product not found', 404);
        }
        
        sendSuccess(res, product, 'Product retrieved successfully');
    } catch (error) {
        console.error('Get product by serial error:', error);
        sendError(res, 'Failed to retrieve product', 500);
    }
};

// Create a new product
const createProduct = async (req, res) => {
    try {
        const productData = req.body;
        
        // Check if serial number already exists
        const existingProduct = await Product.getProductBySerial(productData.serial_number);
        if (existingProduct) {
            return sendError(res, 'Serial number already registered', 409);
        }
        
        const productId = await Product.createProduct(productData);
        const newProduct = await Product.getProductById(productId);
        
        sendSuccess(res, newProduct, 'Product registered successfully', 201);
    } catch (error) {
        console.error('Create product error:', error);
        sendError(res, 'Failed to register product', 500);
    }
};

// Update a product
const updateProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const productData = req.body;
        const userId = req.user.user_id;
        const userRole = req.user.role;
        
        // Check if product exists
        const existingProduct = await Product.getProductById(id);
        if (!existingProduct) {
            return sendError(res, 'Product not found', 404);
        }
        
        // Get the customer_id associated with this user
        const customer = await require('../models/Customer').getCustomerByUserId(userId);
        const customerId = customer?.customer_id || null;
        
        console.log('Update - User ID:', userId);
        console.log('Update - Customer ID:', customerId);
        console.log('Update - Product Owner ID:', existingProduct.customer_id);
        console.log('Update - User Role:', userRole);
        
        // Check if user is authorized to update this product
        const isAdmin = userRole === 'Admin';
        const isOwner = existingProduct.customer_id === customerId;
        
        if (!isAdmin && !isOwner) {
            return sendError(res, 'You are not authorized to update this product', 403);
        }
        
        // Check if serial number is being changed and if it already exists
        if (productData.serial_number && productData.serial_number !== existingProduct.serial_number) {
            const duplicateProduct = await Product.getProductBySerial(productData.serial_number);
            if (duplicateProduct) {
                return sendError(res, 'Serial number already registered to another product', 409);
            }
        }
        
        await Product.updateProduct(id, productData);
        const updatedProduct = await Product.getProductById(id);
        
        sendSuccess(res, updatedProduct, 'Product updated successfully');
    } catch (error) {
        console.error('Update product error:', error);
        sendError(res, 'Failed to update product', 500);
    }
};

// Delete a product
const deleteProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.user_id;
        const userRole = req.user.role;
        
        console.log('Delete - User ID:', userId);
        console.log('Delete - User Role:', userRole);
        
        // Check if product exists
        const existingProduct = await Product.getProductById(id);
        if (!existingProduct) {
            return sendError(res, 'Product not found', 404);
        }
        
        // Get the customer_id associated with this user
        const Customer = require('../models/Customer');
        const customer = await Customer.getCustomerByUserId(userId);
        const customerId = customer?.customer_id || null;
        
        console.log('Delete - Customer ID:', customerId);
        console.log('Delete - Product Owner ID:', existingProduct.customer_id);
        
        // Check if user is authorized to delete this product
        const isAdmin = userRole === 'Admin';
        const isOwner = existingProduct.customer_id === customerId;
        
        console.log('Delete - Is Admin:', isAdmin);
        console.log('Delete - Is Owner:', isOwner);
        
        if (!isAdmin && !isOwner) {
            return sendError(res, 'You are not authorized to delete this product', 403);
        }
        
        await Product.deleteProduct(id);
        sendSuccess(res, null, 'Product deleted successfully');
    } catch (error) {
        console.error('Delete product error:', error);
        sendError(res, 'Failed to delete product', 500);
    }
};

// Get product warranty status
const getProductWarranty = async (req, res) => {
    try {
        const { id } = req.params;
        
        const product = await Product.getProductById(id);
        if (!product) {
            return sendError(res, 'Product not found', 404);
        }
        
        const warranties = await Product.getProductWarrantyStatus(id);
        sendSuccess(res, warranties, 'Product warranty status retrieved successfully');
    } catch (error) {
        console.error('Get product warranty error:', error);
        sendError(res, 'Failed to retrieve warranty status', 500);
    }
};

// Get product repairs
const getProductRepairs = async (req, res) => {
    try {
        const { id } = req.params;
        
        const product = await Product.getProductById(id);
        if (!product) {
            return sendError(res, 'Product not found', 404);
        }
        
        const repairs = await Product.getProductRepairs(id);
        sendSuccess(res, repairs, 'Product repairs retrieved successfully');
    } catch (error) {
        console.error('Get product repairs error:', error);
        sendError(res, 'Failed to retrieve repairs', 500);
    }
};

// Get all brands
const getBrands = async (req, res) => {
    try {
        const brands = await Product.getAllBrands();
        sendSuccess(res, brands, 'Brands retrieved successfully');
    } catch (error) {
        console.error('Get brands error:', error);
        sendError(res, 'Failed to retrieve brands', 500);
    }
};

// Get all categories
const getCategories = async (req, res) => {
    try {
        const categories = await Product.getAllCategories();
        sendSuccess(res, categories, 'Categories retrieved successfully');
    } catch (error) {
        console.error('Get categories error:', error);
        sendError(res, 'Failed to retrieve categories', 500);
    }
};

module.exports = {
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
};
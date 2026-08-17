const { query } = require('../config/db');

// Get all products with their details
const getAllProducts = async (customerId = null) => {
    let sql = `
        SELECT 
            p.product_id,
            p.product_name,
            p.model_number,
            p.serial_number,
            p.purchase_date,
            p.purchase_price,
            p.is_active,
            p.created_at,
            p.customer_id,
            b.brand_name,
            b.brand_id,
            c.category_name,
            c.category_id,
            cust.customer_id,
            u.full_name as customer_name,
            u.email as customer_email
        FROM Products p
        JOIN Brands b ON p.brand_id = b.brand_id
        JOIN Product_Categories c ON p.category_id = c.category_id
        JOIN Customers cust ON p.customer_id = cust.customer_id
        JOIN Users u ON cust.user_id = u.user_id
    `;
    
    const params = [];
    if (customerId) {
        sql += ' WHERE p.customer_id = ?';
        params.push(customerId);
    }
    
    sql += ' ORDER BY p.created_at DESC';
    
    return await query(sql, params);
};

// Get product by ID - UPDATED to include customer_id
const getProductById = async (productId) => {
    const sql = `
        SELECT 
            p.product_id,
            p.product_name,
            p.model_number,
            p.serial_number,
            p.purchase_date,
            p.purchase_price,
            p.is_active,
            p.created_at,
            p.customer_id,
            b.brand_name,
            b.brand_id,
            c.category_name,
            c.category_id,
            cust.customer_id,
            u.full_name as customer_name,
            u.email as customer_email
        FROM Products p
        JOIN Brands b ON p.brand_id = b.brand_id
        JOIN Product_Categories c ON p.category_id = c.category_id
        JOIN Customers cust ON p.customer_id = cust.customer_id
        JOIN Users u ON cust.user_id = u.user_id
        WHERE p.product_id = ?
    `;
    
    const results = await query(sql, [productId]);
    return results[0] || null;
};

// Get product by serial number
const getProductBySerial = async (serialNumber) => {
    const sql = `
        SELECT 
            p.product_id,
            p.product_name,
            p.model_number,
            p.serial_number,
            p.purchase_date,
            p.purchase_price,
            p.is_active,
            p.created_at,
            p.customer_id,
            b.brand_name,
            b.brand_id,
            c.category_name,
            c.category_id,
            cust.customer_id,
            u.full_name as customer_name,
            u.email as customer_email
        FROM Products p
        JOIN Brands b ON p.brand_id = b.brand_id
        JOIN Product_Categories c ON p.category_id = c.category_id
        JOIN Customers cust ON p.customer_id = cust.customer_id
        JOIN Users u ON cust.user_id = u.user_id
        WHERE p.serial_number = ?
    `;
    
    const results = await query(sql, [serialNumber]);
    return results[0] || null;
};

// Create a new product
const createProduct = async (productData) => {
    const {
        customer_id,
        brand_id,
        category_id,
        product_name,
        model_number,
        serial_number,
        purchase_date,
        purchase_price,
        is_active = true
    } = productData;

    const sql = `
        INSERT INTO Products (
            customer_id,
            brand_id,
            category_id,
            product_name,
            model_number,
            serial_number,
            purchase_date,
            purchase_price,
            is_active
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const result = await query(sql, [
        customer_id,
        brand_id,
        category_id,
        product_name,
        model_number,
        serial_number,
        purchase_date,
        purchase_price,
        is_active
    ]);

    return result.insertId;
};

// Update a product
const updateProduct = async (productId, productData) => {
    const {
        brand_id,
        category_id,
        product_name,
        model_number,
        serial_number,
        purchase_date,
        purchase_price,
        is_active
    } = productData;

    const sql = `
        UPDATE Products 
        SET 
            brand_id = ?,
            category_id = ?,
            product_name = ?,
            model_number = ?,
            serial_number = ?,
            purchase_date = ?,
            purchase_price = ?,
            is_active = ?
        WHERE product_id = ?
    `;

    await query(sql, [
        brand_id,
        category_id,
        product_name,
        model_number,
        serial_number,
        purchase_date,
        purchase_price,
        is_active,
        productId
    ]);

    return true;
};

// Delete a product
const deleteProduct = async (productId) => {
    const sql = 'DELETE FROM Products WHERE product_id = ?';
    await query(sql, [productId]);
    return true;
};

// Get product warranty status
const getProductWarrantyStatus = async (productId) => {
    const sql = `
        SELECT 
            pw.warranty_id,
            pw.start_date,
            pw.end_date,
            pw.status,
            pw.purchase_amount,
            wp.plan_name,
            wp.duration_months,
            wp.coverage_details
        FROM Product_Warranties pw
        JOIN Warranty_Plans wp ON pw.plan_id = wp.plan_id
        WHERE pw.product_id = ?
        ORDER BY pw.created_at DESC
    `;
    
    return await query(sql, [productId]);
};

// Get product repairs
const getProductRepairs = async (productId) => {
    const sql = `
        SELECT 
            rr.repair_id,
            rr.issue_type,
            rr.issue_description,
            rr.diagnosis,
            rr.repair_cost,
            rr.status,
            rr.request_date,
            rr.accepted_at,
            rr.started_at,
            rr.completed_at,
            rr.completion_notes,
            u.full_name as technician_name,
            u2.full_name as retailer_name
        FROM Repair_Requests rr
        LEFT JOIN Users u ON rr.technician_id = u.user_id
        LEFT JOIN Users u2 ON rr.retailer_id = u2.user_id
        WHERE rr.product_id = ?
        ORDER BY rr.request_date DESC
    `;
    
    return await query(sql, [productId]);
};

// Get brands
const getAllBrands = async () => {
    const sql = 'SELECT * FROM Brands ORDER BY brand_name';
    return await query(sql);
};

// Get categories
const getAllCategories = async () => {
    const sql = 'SELECT * FROM Product_Categories ORDER BY category_name';
    return await query(sql);
};

module.exports = {
    getAllProducts,
    getProductById,
    getProductBySerial,
    createProduct,
    updateProduct,
    deleteProduct,
    getProductWarrantyStatus,
    getProductRepairs,
    getAllBrands,
    getAllCategories
};
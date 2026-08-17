const { query } = require('../config/db');

// Get customer by user_id
const getCustomerByUserId = async (userId) => {
    const sql = 'SELECT * FROM Customers WHERE user_id = ?';
    const results = await query(sql, [userId]);
    return results[0] || null;
};

// Get customer by customer_id
const getCustomerById = async (customerId) => {
    const sql = 'SELECT * FROM Customers WHERE customer_id = ?';
    const results = await query(sql, [customerId]);
    return results[0] || null;
};

// Create a new customer
const createCustomer = async (customerData) => {
    const { user_id, address, date_of_birth } = customerData;
    const sql = `
        INSERT INTO Customers (user_id, address, date_of_birth)
        VALUES (?, ?, ?)
    `;
    const result = await query(sql, [user_id, address || null, date_of_birth || null]);
    return result.insertId;
};

// Update customer
const updateCustomer = async (customerId, customerData) => {
    const { address, date_of_birth } = customerData;
    const sql = `
        UPDATE Customers 
        SET address = ?, date_of_birth = ?
        WHERE customer_id = ?
    `;
    await query(sql, [address || null, date_of_birth || null, customerId]);
    return true;
};

module.exports = {
    getCustomerByUserId,
    getCustomerById,
    createCustomer,
    updateCustomer
};
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { query } = require('../config/db');
const { sendSuccess, sendError } = require('../utils/responseHandler');

// Generate JWT Token
const generateToken = (user) => {
    return jwt.sign(
        { 
            user_id: user.user_id, 
            email: user.email, 
            role: user.role 
        },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRE || '7d' }
    );
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const register = async (req, res) => {
    try {
        const { full_name, email, password, phone, role = 'Customer' } = req.body;

        // Check if user already exists
        const existingUsers = await query(
            'SELECT * FROM Users WHERE email = ?',
            [email]
        );

        if (existingUsers.length > 0) {
            return sendError(res, 'User already exists with this email', 409);
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Insert user
        const result = await query(
            `INSERT INTO Users (full_name, email, password_hash, phone, role) 
             VALUES (?, ?, ?, ?, ?)`,
            [full_name, email, hashedPassword, phone, role]
        );

        // Get the created user
        const newUser = await query(
            'SELECT user_id, full_name, email, phone, role, created_at FROM Users WHERE user_id = ?',
            [result.insertId]
        );

        // If role is Customer, create customer profile
        if (role === 'Customer') {
            await query(
                'INSERT INTO Customers (user_id) VALUES (?)',
                [result.insertId]
            );
        }

        // Generate token
        const token = generateToken(newUser[0]);

        return sendSuccess(res, {
            user: newUser[0],
            token
        }, 'User registered successfully', 201);

    } catch (error) {
        console.error('Registration error:', error);
        return sendError(res, 'Registration failed. Please try again.', 500);
    }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check if user exists
        const users = await query(
            'SELECT * FROM Users WHERE email = ?',
            [email]
        );

        if (users.length === 0) {
            return sendError(res, 'Invalid email or password', 401);
        }

        const user = users[0];

        // Check password
        const isPasswordValid = await bcrypt.compare(password, user.password_hash);
        if (!isPasswordValid) {
            return sendError(res, 'Invalid email or password', 401);
        }

        // Get customer_id if user is a customer
        let customer_id = null;
        if (user.role === 'Customer') {
            const customer = await query(
                'SELECT customer_id FROM Customers WHERE user_id = ?',
                [user.user_id]
            );
            if (customer.length > 0) {
                customer_id = customer[0].customer_id;
            }
        }

        // Remove password hash from response
        const { password_hash, ...userWithoutPassword } = user;

        // Generate token
        const token = generateToken(user);

        return sendSuccess(res, {
            user: {
                ...userWithoutPassword,
                customer_id
            },
            token
        }, 'Login successful');

    } catch (error) {
        console.error('Login error:', error);
        return sendError(res, 'Login failed. Please try again.', 500);
    }
};

// @desc    Get current user profile
// @route   GET /api/auth/me
// @access  Private
const getMe = async (req, res) => {
    try {
        const user = req.user;
        
        // Get customer_id if user is a customer
        let customer_id = null;
        if (user.role === 'Customer') {
            const customer = await query(
                'SELECT customer_id FROM Customers WHERE user_id = ?',
                [user.user_id]
            );
            if (customer.length > 0) {
                customer_id = customer[0].customer_id;
            }
        }

        return sendSuccess(res, {
            ...user,
            customer_id
        }, 'User profile retrieved');

    } catch (error) {
        console.error('Get profile error:', error);
        return sendError(res, 'Failed to get user profile', 500);
    }
};

// @desc    Logout user
// @route   POST /api/auth/logout
// @access  Private
const logout = async (req, res) => {
    try {
        // Since we're using JWT, logout is handled client-side
        // Just send a success response
        return sendSuccess(res, null, 'Logged out successfully');
    } catch (error) {
        console.error('Logout error:', error);
        return sendError(res, 'Logout failed', 500);
    }
};

module.exports = {
    register,
    login,
    getMe,
    logout
};
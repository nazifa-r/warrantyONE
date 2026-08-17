const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { 
    register, 
    login, 
    getMe, 
    logout 
} = require('../controllers/authController');

// Public routes
router.post('/register', register);  // POST - Register new user
router.post('/login', login);        // POST - Login user

// Protected routes
router.get('/me', protect, getMe);   // GET - Get current user profile
router.post('/logout', protect, logout); // POST - Logout user

module.exports = router;
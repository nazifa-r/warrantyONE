const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
const dotenv = require('dotenv');
const { errorHandler } = require('./middleware/errorHandler');

// Load environment variables
dotenv.config();

// Import routes
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const customerRoutes = require('./routes/customerRoutes');
const productRoutes = require('./routes/productRoutes');
const warrantyRoutes = require('./routes/warrantyRoutes');
const repairRoutes = require('./routes/repairRoutes');
const invoiceRoutes = require('./routes/invoiceRoutes');
const paymentRoutes = require('./routes/paymentRoutes');

// Import database connection
const { testConnection } = require('./config/db');

const app = express();

// ⚠️ IMPORTANT: Body parser middleware MUST come BEFORE routes
// Parse JSON bodies
app.use(express.json({ limit: '10mb' }));
// Parse URL-encoded bodies
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Rate limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    message: 'Too many requests from this IP, please try again later.',
    standardHeaders: true,
    legacyHeaders: false,
});

// CORS configuration
const corsOptions = {
    origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
    credentials: true,
    optionsSuccessStatus: 200
};

// Other middleware
app.use(helmet()); // Security headers
app.use(cors(corsOptions)); // Enable CORS with options
app.use(compression()); // Compress responses
app.use(morgan('dev')); // Logging
app.use('/api', limiter); // Apply rate limiting to all API routes

// API Routes (these come AFTER body parser middleware)
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/customers', customerRoutes);
app.use('/api/products', productRoutes);
app.use('/api/warranties', warrantyRoutes);
app.use('/api/repairs', repairRoutes);
app.use('/api/invoices', invoiceRoutes);
app.use('/api/payments', paymentRoutes);

// Health check route
app.get('/health', async (req, res) => {
    try {
        const dbConnected = await testConnection();
        res.status(200).json({
            status: 'OK',
            message: 'WarrantyOne API is running',
            database: dbConnected ? 'Connected' : 'Disconnected',
            timestamp: new Date().toISOString(),
            uptime: process.uptime(),
            environment: process.env.NODE_ENV || 'development'
        });
    } catch (error) {
        res.status(500).json({
            status: 'ERROR',
            message: 'Health check failed',
            error: error.message,
            timestamp: new Date().toISOString()
        });
    }
});

// Root route
app.get('/', (req, res) => {
    res.json({
        success: true,
        message: 'Welcome to WarrantyOne API',
        version: '1.0.0',
        documentation: '/api-docs',
        endpoints: {
            auth: {
                register: 'POST /api/auth/register',
                login: 'POST /api/auth/login',
                me: 'GET /api/auth/me',
                logout: 'POST /api/auth/logout'
            },
            users: {
                list: 'GET /api/users',
                details: 'GET /api/users/:id',
                update: 'PUT /api/users/:id',
                delete: 'DELETE /api/users/:id'
            },
            customers: {
                list: 'GET /api/customers',
                profile: 'GET /api/customers/profile',
                details: 'GET /api/customers/:id',
                create: 'POST /api/customers',
                update: 'PUT /api/customers/:id'
            },
            products: {
                list: 'GET /api/products',
                details: 'GET /api/products/:id',
                create: 'POST /api/products',
                update: 'PUT /api/products/:id',
                delete: 'DELETE /api/products/:id',
                warranties: 'GET /api/products/:id/warranties',
                repairs: 'GET /api/products/:id/repairs'
            },
            warranties: {
                plans: 'GET /api/warranties/plans',
                planDetails: 'GET /api/warranties/plans/:id',
                createPlan: 'POST /api/warranties/plans',
                updatePlan: 'PUT /api/warranties/plans/:id',
                deletePlan: 'DELETE /api/warranties/plans/:id',
                productWarranties: 'GET /api/warranties/product/:productId',
                createProductWarranty: 'POST /api/warranties/product',
                updateProductWarranty: 'PUT /api/warranties/product/:id'
            },
            repairs: {
                list: 'GET /api/repairs',
                details: 'GET /api/repairs/:id',
                create: 'POST /api/repairs',
                update: 'PUT /api/repairs/:id',
                assign: 'PUT /api/repairs/:id/assign',
                status: 'PUT /api/repairs/:id/status',
                customer: 'GET /api/repairs/customer/:customerId',
                technician: 'GET /api/repairs/technician/:technicianId'
            },
            invoices: {
                list: 'GET /api/invoices',
                details: 'GET /api/invoices/:id',
                create: 'POST /api/invoices',
                update: 'PUT /api/invoices/:id',
                customer: 'GET /api/invoices/customer/:customerId',
                repair: 'GET /api/invoices/repair/:repairId'
            },
            payments: {
                list: 'GET /api/payments',
                details: 'GET /api/payments/:id',
                create: 'POST /api/payments',
                status: 'PUT /api/payments/:id/status',
                customer: 'GET /api/payments/customer/:customerId',
                invoice: 'GET /api/payments/invoice/:invoiceId'
            }
        },
        health: 'GET /health',
        timestamp: new Date().toISOString()
    });
});

// Error handling middleware (should be last)
app.use(errorHandler);

// 404 handler
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: 'Route not found',
        path: req.originalUrl,
        method: req.method,
        timestamp: new Date().toISOString()
    });
});

// Start server
const PORT = process.env.PORT || 5000;

// Function to start server with database connection check
const startServer = async () => {
    try {
        // Test database connection
        await testConnection();

        app.listen(PORT, () => {
            console.log('\x1b[36m%s\x1b[0m', '═══════════════════════════════════════════════');
            console.log('\x1b[32m%s\x1b[0m', '🚀 WarrantyOne API Server Started Successfully');
            console.log('\x1b[36m%s\x1b[0m', '═══════════════════════════════════════════════');
            console.log(`\x1b[33m📡 Environment:\x1b[0m ${process.env.NODE_ENV || 'development'}`);
            console.log(`\x1b[33m🔗 API URL:\x1b[0m http://localhost:${PORT}/api`);
            console.log(`\x1b[33m💚 Health Check:\x1b[0m http://localhost:${PORT}/health`);
            console.log('\x1b[36m%s\x1b[0m', '═══════════════════════════════════════════════');
            console.log('\x1b[34m%s\x1b[0m', 'Press Ctrl+C to stop the server');
        });
    } catch (error) {
        console.error('\x1b[31m%s\x1b[0m', '❌ Failed to start server:');
        console.error('\x1b[31m%s\x1b[0m', error.message);
        console.log('\x1b[33m%s\x1b[0m', '⚠️  Please check your database configuration in .env file');
        process.exit(1);
    }
};

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
    console.error('\x1b[31m%s\x1b[0m', '💥 Uncaught Exception:');
    console.error(error);
    process.exit(1);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (error) => {
    console.error('\x1b[31m%s\x1b[0m', '💥 Unhandled Rejection:');
    console.error(error);
    process.exit(1);
});

// Start the server
startServer();

// Graceful shutdown
process.on('SIGTERM', () => {
    console.log('\x1b[33m%s\x1b[0m', '👋 SIGTERM received. Shutting down gracefully...');
    process.exit(0);
});

process.on('SIGINT', () => {
    console.log('\x1b[33m%s\x1b[0m', '👋 SIGINT received. Shutting down gracefully...');
    process.exit(0);
});

module.exports = app;
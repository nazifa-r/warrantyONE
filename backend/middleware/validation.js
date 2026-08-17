const Joi = require('joi');
const { sendError } = require('../utils/responseHandler');

// Validation schemas
const schemas = {
  // User registration
  register: Joi.object({
    full_name: Joi.string().min(2).max(100).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
    phone: Joi.string().pattern(/^[0-9+\-() ]+$/).required(),
    role: Joi.string().valid('Customer', 'Retailer', 'Technician', 'Admin').default('Customer')
  }),
  
  // User login
  login: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required()
  }),
  
  // Customer profile
  customer: Joi.object({
    address: Joi.string().max(255),
    date_of_birth: Joi.date()
  }),
  
  // Product registration
  product: Joi.object({
    customer_id: Joi.number().integer().required(),
    brand_id: Joi.number().integer().required(),
    category_id: Joi.number().integer().required(),
    product_name: Joi.string().max(100).required(),
    model_number: Joi.string().max(50).required(),
    serial_number: Joi.string().max(50).required(),
    purchase_date: Joi.date().required(),
    purchase_price: Joi.number().positive().required()
  }),
  
  // Warranty plan
  warrantyPlan: Joi.object({
    plan_name: Joi.string().max(100).required(),
    duration_months: Joi.number().integer().positive().required(),
    price: Joi.number().positive().required(),
    coverage_details: Joi.string()
  }),
  
  // Repair request
  repair: Joi.object({
    product_id: Joi.number().integer().required(),
    customer_id: Joi.number().integer().required(),
    retailer_id: Joi.number().integer(),
    technician_id: Joi.number().integer(),
    issue_type: Joi.string().max(100).required(),
    issue_description: Joi.string().required(),
    diagnosis: Joi.string(),
    repair_cost: Joi.number().positive()
  }),
  
  // Invoice
  invoice: Joi.object({
    customer_id: Joi.number().integer().required(),
    repair_id: Joi.number().integer(),
    invoice_type: Joi.string().valid('repair', 'warranty', 'service', 'other').required(),
    subtotal: Joi.number().positive().required(),
    tax: Joi.number().min(0),
    discount: Joi.number().min(0),
    total_amount: Joi.number().positive().required()
  }),
  
  // Payment
  payment: Joi.object({
    invoice_id: Joi.number().integer().required(),
    customer_id: Joi.number().integer().required(),
    amount: Joi.number().positive().required(),
    payment_method: Joi.string().valid('credit_card', 'debit_card', 'paypal', 'bank_transfer', 'cash').required(),
    transaction_reference: Joi.string().max(100)
  })
};

// Validation middleware
const validate = (schemaName) => {
  return (req, res, next) => {
    const schema = schemas[schemaName];
    if (!schema) {
      return sendError(res, 'Validation schema not found', 500);
    }
    
    const { error, value } = schema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true
    });
    
    if (error) {
      const errors = error.details.map(detail => detail.message);
      return sendError(res, 'Validation failed', 400, { errors });
    }
    
    req.body = value;
    next();
  };
};

module.exports = {
  validate,
  schemas
};
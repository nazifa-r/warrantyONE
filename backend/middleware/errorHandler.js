const { sendError } = require('../utils/responseHandler');

const errorHandler = (err, req, res, next) => {
  console.error('Error:', err.stack);
  
  // Default error
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Internal Server Error';
  
  // Handle specific errors
  if (err.code === 'ER_DUP_ENTRY') {
    statusCode = 409;
    message = 'Duplicate entry found';
  }
  
  if (err.code === 'ER_NO_REFERENCED_ROW_2') {
    statusCode = 400;
    message = 'Invalid foreign key reference';
  }
  
  if (err.name === 'ValidationError') {
    statusCode = 400;
    message = err.message;
  }
  
  return sendError(res, message, statusCode);
};

module.exports = {
  errorHandler
};
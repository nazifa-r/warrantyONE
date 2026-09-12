// Centralized error handler — keeps every response in the
// { success: false, message } shape the frontend expects.
const errorHandler = (err, req, res, next) => {
  console.error(err.stack);

  // MySQL duplicate entry (unique constraint violation)
  if (err.code === 'ER_DUP_ENTRY') {
    return res.status(409).json({
      success: false,
      message: 'A record with that value already exists.',
    });
  }

  // MySQL foreign key constraint failures
  if (err.code === 'ER_NO_REFERENCED_ROW' || err.code === 'ER_NO_REFERENCED_ROW_2' || err.code === 'ER_ROW_IS_REFERENCED_2') {
    return res.status(400).json({
      success: false,
      message: 'Related record not found (invalid reference).',
    });
  }

  // MySQL CHECK constraint failures (MySQL 8.0.16+)
  if (err.code === 'ER_CHECK_CONSTRAINT_VIOLATED') {
    return res.status(400).json({
      success: false,
      message: 'Invalid value for one of the fields provided.',
    });
  }

  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    success: false,
    message: err.message || 'Server error',
  });
};

const notFound = (req, res) => {
  res.status(404).json({ success: false, message: `Route ${req.originalUrl} not found` });
};

module.exports = { errorHandler, notFound };

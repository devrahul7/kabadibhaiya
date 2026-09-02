const errorHandler = (err, req, res, next) => {
  console.error(err.stack);
  const status = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';
  // Don't leak stack traces in production
  res.status(status).json({
    success: false,
    message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
};
module.exports = errorHandler;

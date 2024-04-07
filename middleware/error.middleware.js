const errorMiddleware = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.message = err.message || 'Something went Wrong';

  return res.status(err.statusCode).json({
    success: false,
    message: err.message,
    stack: err.stack,
  });
};

module.exports = errorMiddleware;

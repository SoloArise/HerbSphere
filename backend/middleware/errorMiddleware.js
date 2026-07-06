function notFound(req, res, next) {
  const error = new Error(`Route not found: ${req.originalUrl}`);
  error.statusCode = 404;
  next(error);
}

function errorHandler(err, req, res, next) {
  let statusCode = err.statusCode || 500;
  let message = err.message || "Server Error";

  // Mongoose bad ObjectId (CastError)
  if (err.name === "CastError") {
    statusCode = 400;
    message = `Resource not found with id of ${err.value} (Invalid ID format)`;
  }

  // Mongoose validation error
  if (err.name === "ValidationError") {
    statusCode = 400;
    message = Object.values(err.errors)
      .map((val) => val.message)
      .join(", ");
  }

  // Mongoose duplicate key error (code 11000)
  if (err.code === 11000) {
    statusCode = 400;
    const field = Object.keys(err.keyValue || {});
    message = `Duplicate field value entered for field: ${field.join(", ")}`;
  }

  // Log error for developers
  console.error(`Error [${err.name || "Error"}]:`, err.message);
  if (statusCode === 500) {
    console.error(err.stack);
  }

  res.status(statusCode).json({
    success: false,
    message: statusCode === 500 ? "Internal Server Error" : message,
  });
}

module.exports = {
  notFound,
  errorHandler,
};

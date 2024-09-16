//Unsupported (404) routes
const notFound = (req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  res.status(404);
  next(error);
};

//Middleware to handle Erros

const errorHandler = (error, req, res, next) => {
  if (res.headerSent) {
    return next(error);
  }

  res.status(res.statusCode || 500);
  res.json({
    message: error.message,
  });
};

module.exports = {
  notFound,
  errorHandler,
};

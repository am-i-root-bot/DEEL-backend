const isProduction = process.env.NODE_ENV === "production";

let errorHandler = function (err, _, res, _) {
  res.status(err.statusCode || 500);
  res.json({
    errors: {
      message: err.message,
      error: {},
    },
  });
};

// if not production add stack trace
if (!isProduction) {
  errorHandler = function (err, _, res, _) {
    res.status(err.statusCode || 500);

    res.json({
      errors: {
        message: err.message,
        stacktrace: err.stack,
        error: err,
      },
    });
  };
}

module.exports = errorHandler;

const { ZodError } = require("zod");
const { HttpError } = require("../utils/http-error");

function errorHandler(error, req, res, next) {
  if (error instanceof ZodError) {
    return res.status(400).json({
      success: false,
      message: "Validation failed.",
      errors: error.flatten()
    });
  }

  if (error instanceof HttpError) {
    return res.status(error.statusCode).json({
      success: false,
      message: error.message,
      details: error.details
    });
  }

  console.error(`[${req.requestId}]`, error);

  return res.status(500).json({
    success: false,
    message: "Internal server error."
  });
}

module.exports = { errorHandler };

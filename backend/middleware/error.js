import { errorResponse } from "../utils/apiResponse.js";

export const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;

  // Log error for developers
  if (process.env.NODE_ENV !== "production") {
    console.error("[API Error Handler]", err);
  }

  // Mongoose Bad ObjectId (CastError)
  if (err.name === "CastError") {
    const message = `Resource not found with id: ${err.value}`;
    return errorResponse(res, 404, message);
  }

  // Mongoose Duplicate Key (11000)
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    const message = `Duplicate value entered for '${field}'. Please use another value.`;
    return errorResponse(res, 400, message);
  }

  // Mongoose Validation Error
  if (err.name === "ValidationError") {
    const messages = Object.values(err.errors).map((val) => val.message);
    return errorResponse(res, 400, "Validation Error", messages);
  }

  // JWT Errors
  if (err.name === "JsonWebTokenError") {
    return errorResponse(res, 401, "Invalid session token. Please log in again.");
  }
  if (err.name === "TokenExpiredError") {
    return errorResponse(res, 401, "Session expired. Please log in again.");
  }

  // Default server error
  return errorResponse(
    res,
    error.statusCode || 500,
    error.message || "Internal Server Error"
  );
};

import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { errorResponse } from "../utils/apiResponse.js";

/**
 * Protect routes - Verifies JWT from httpOnly cookie or Authorization Bearer header
 */
export const protect = async (req, res, next) => {
  let token;

  // 1. Check httpOnly cookie
  if (req.cookies && req.cookies.token) {
    token = req.cookies.token;
  }
  // 2. Check Authorization header fallback (Bearer <token>)
  else if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return errorResponse(res, 401, "Not authorized to access this resource. Please log in.");
  }

  try {
    const secret = process.env.JWT_SECRET || "via_secret_jwt_key_streetwear_2026_identity_token_secure";
    const decoded = jwt.verify(token, secret);

    const user = await User.findById(decoded.id).select("-password");
    if (!user) {
      return errorResponse(res, 401, "User belonging to this token no longer exists.");
    }

    req.user = user;
    next();
  } catch (err) {
    return errorResponse(res, 401, "Invalid or expired session token. Please log in again.");
  }
};

/**
 * Admin Only Guard
 */
export const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    next();
  } else {
    return errorResponse(res, 403, "Access denied: Admin privileges required.");
  }
};

/**
 * Optional Auth - Attaches user if token is present, but doesn't block guests
 */
export const optionalAuth = async (req, res, next) => {
  let token;
  if (req.cookies && req.cookies.token) {
    token = req.cookies.token;
  } else if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (token) {
    try {
      const secret = process.env.JWT_SECRET || "via_secret_jwt_key_streetwear_2026_identity_token_secure";
      const decoded = jwt.verify(token, secret);
      req.user = await User.findById(decoded.id).select("-password");
    } catch (err) {
      // Ignore token errors for optional auth
    }
  }
  next();
};

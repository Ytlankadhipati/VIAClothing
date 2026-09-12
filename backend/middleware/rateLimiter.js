import rateLimit from "express-rate-limit";

// Auth limiter — strict limit for login/register/reset-password endpoints
// to prevent brute-force attacks on user credentials.
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 30, // Limit each IP to 30 auth requests per 15-minute window
  message: {
    success: false,
    message: "Too many authentication attempts from this IP, please try again after 15 minutes.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// General API limiter — production value: 600 requests per 10 minutes per IP.
// This was temporarily raised to 50000 for load testing (see git commit 69057b4)
// and has been reverted back to the production value below.
// Do NOT raise this for load testing without reverting before deploying.
export const apiLimiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 600, // Production value: 600 requests per 10-minute window
  message: {
    success: false,
    message: "Too many requests from this IP, please try again later.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

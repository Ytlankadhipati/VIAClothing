import express from "express";
import { body } from "express-validator";
import {
  register,
  login,
  logout,
  getMe,
  updateProfile,
  changePassword,
  forgotPassword,
  resetPassword,
  addAddress,
  deleteAddress,
  googleAuth,
  verifyEmailOtp,
  resendEmailOtp,
} from "../controllers/authController.js";
import { protect } from "../middleware/auth.js";
import { authLimiter, otpLimiter } from "../middleware/rateLimiter.js";
import { validate } from "../middleware/validate.js";

const router = express.Router();

// Validation chains
const registerValidations = [
  body("name")
    .trim()
    .notEmpty().withMessage("Name is required.")
    .isLength({ max: 100 }).withMessage("Name must be 100 characters or fewer."),
  body("email")
    .trim()
    .notEmpty().withMessage("Email is required.")
    .isEmail().withMessage("Please provide a valid email address.")
    .normalizeEmail(),
  body("password")
    .notEmpty().withMessage("Password is required.")
    .isLength({ min: 8 }).withMessage("Password must be at least 8 characters long."),
];

const loginValidations = [
  body("email")
    .trim()
    .notEmpty().withMessage("Email is required.")
    .isString().withMessage("Email must be a string."),
  body("password")
    .notEmpty().withMessage("Password is required.")
    .isString().withMessage("Password must be a string."),
];

router.post("/register", authLimiter, validate(registerValidations), register);
router.post("/login", authLimiter, validate(loginValidations), login);
router.post("/logout", logout);
router.get("/me", protect, getMe);
router.put("/profile", protect, updateProfile);
router.put("/change-password", protect, changePassword);
router.post("/forgot-password", authLimiter, forgotPassword);
router.post("/reset-password/:token", authLimiter, resetPassword);

// Google Sign-In & OTP Verification
router.post("/google", authLimiter, googleAuth);
router.post("/verify-otp", protect, authLimiter, verifyEmailOtp);
router.post("/resend-otp", protect, otpLimiter, resendEmailOtp);

// Addresses
router.post("/addresses", protect, addAddress);
router.delete("/addresses/:id", protect, deleteAddress);

export default router;

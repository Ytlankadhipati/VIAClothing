import express from "express";
import { body } from "express-validator";
import {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../controllers/productController.js";
import { getProductReviews, createReview } from "../controllers/reviewController.js";
import { protect, adminOnly } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";

const router = express.Router();

// Validation chains
const productValidations = [
  body("name")
    .trim()
    .notEmpty().withMessage("Product name is required.")
    .isString().withMessage("Product name must be a string."),
  body("price")
    .notEmpty().withMessage("Price is required.")
    .isNumeric().withMessage("Price must be a number.")
    .isFloat({ min: 0 }).withMessage("Price must be a non-negative number."),
  body("stock")
    .optional()
    .isInt({ min: 0 }).withMessage("Stock must be a non-negative integer."),
];

const reviewValidations = [
  body("rating")
    .notEmpty().withMessage("Rating is required.")
    .isFloat({ min: 1, max: 5 }).withMessage("Rating must be a number between 1 and 5."),
  body("title")
    .trim()
    .notEmpty().withMessage("Review title is required."),
  body("comment")
    .trim()
    .notEmpty().withMessage("Review comment is required."),
];

// Public routes
router.get("/", getProducts);
router.get("/:id", getProductById);
router.get("/:productId/reviews", getProductReviews);

// Authenticated review submission
router.post("/:productId/reviews", protect, validate(reviewValidations), createReview);

// Admin product CRUD
router.post("/", protect, adminOnly, validate(productValidations), createProduct);
router.put("/:id", protect, adminOnly, validate(productValidations), updateProduct);
router.delete("/:id", protect, adminOnly, deleteProduct);

export default router;

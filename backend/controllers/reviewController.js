import Review from "../models/Review.js";
import Order from "../models/Order.js";
import Product from "../models/Product.js";
import { successResponse, errorResponse } from "../utils/apiResponse.js";

/**
 * @desc    Get reviews for a product
 * @route   GET /api/products/:productId/reviews
 * @access  Public
 */
export const getProductReviews = async (req, res, next) => {
  try {
    const { productId } = req.params;
    const reviews = await Review.find({
      product: productId,
      approved: true,
    }).sort({ createdAt: -1 });

    return successResponse(res, 200, "Reviews retrieved.", { reviews });
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Submit a product review
 * @route   POST /api/products/:productId/reviews
 * @access  Private
 */
export const createReview = async (req, res, next) => {
  try {
    const { productId } = req.params;
    const { rating, title, comment, images } = req.body;

    if (!rating || !title || !comment) {
      return errorResponse(res, 400, "Please provide rating, title, and comment.");
    }

    const product = await Product.findById(productId);
    if (!product) {
      return errorResponse(res, 404, "Product not found.");
    }

    // Check if customer purchased this product
    const deliveredOrder = await Order.findOne({
      user: req.user._id,
      "items.product": productId,
    });

    const isVerified = !!deliveredOrder;

    // Check if user already reviewed
    const existingReview = await Review.findOne({
      user: req.user._id,
      product: productId,
    });

    if (existingReview) {
      existingReview.rating = rating;
      existingReview.title = title;
      existingReview.comment = comment;
      if (images) existingReview.images = images;
      existingReview.verifiedPurchase = isVerified;
      await existingReview.save();
      return successResponse(res, 200, "Review updated successfully!", {
        review: existingReview,
      });
    }

    const review = await Review.create({
      user: req.user._id,
      userName: req.user.name,
      product: productId,
      order: deliveredOrder ? deliveredOrder._id : null,
      rating: Number(rating),
      title,
      comment,
      images: images || [],
      verifiedPurchase: isVerified,
      approved: true,
    });

    return successResponse(res, 201, "Review submitted successfully!", { review });
  } catch (err) {
    next(err);
  }
};

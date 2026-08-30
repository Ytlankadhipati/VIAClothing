import Coupon from "../models/Coupon.js";
import Cart from "../models/Cart.js";
import { successResponse, errorResponse } from "../utils/apiResponse.js";

/**
 * @desc    Validate coupon code and compute discount
 * @route   POST /api/coupons/validate
 * @access  Public / Private
 */
export const validateCoupon = async (req, res, next) => {
  try {
    const { code, orderAmount } = req.body;

    if (!code) {
      return errorResponse(res, 400, "Please provide a coupon code.");
    }

    const coupon = await Coupon.findOne({
      code: code.trim().toUpperCase(),
      active: true,
    });

    if (!coupon) {
      return errorResponse(res, 404, "Invalid coupon code.");
    }

    const now = new Date();
    if (coupon.expiryDate && coupon.expiryDate < now) {
      return errorResponse(res, 400, "This coupon has expired.");
    }

    if (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit) {
      return errorResponse(res, 400, "This coupon usage limit has been reached.");
    }

    const amount = Number(orderAmount) || 0;
    if (amount < coupon.minimumOrderValue) {
      return errorResponse(
        res,
        400,
        `Minimum order value of ₹${coupon.minimumOrderValue} required for this coupon.`
      );
    }

    let discountAmount = 0;
    if (coupon.type === "percentage") {
      discountAmount = (amount * coupon.value) / 100;
      if (coupon.maximumDiscount && discountAmount > coupon.maximumDiscount) {
        discountAmount = coupon.maximumDiscount;
      }
    } else {
      discountAmount = Math.min(coupon.value, amount);
    }

    discountAmount = Math.round(discountAmount);

    return successResponse(res, 200, "Coupon applied successfully!", {
      coupon: {
        code: coupon.code,
        type: coupon.type,
        value: coupon.value,
        discountAmount,
      },
    });
  } catch (err) {
    next(err);
  }
};

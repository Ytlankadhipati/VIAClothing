import User from "../models/User.js";
import Product from "../models/Product.js";
import { successResponse, errorResponse } from "../utils/apiResponse.js";

export const getWishlist = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).populate("wishlist");
    return successResponse(res, 200, "Wishlist retrieved.", {
      wishlist: user.wishlist || [],
    });
  } catch (err) {
    next(err);
  }
};

export const toggleWishlist = async (req, res, next) => {
  try {
    const { productId } = req.params;
    const product = await Product.findById(productId);
    if (!product) {
      return errorResponse(res, 404, "Product not found.");
    }

    const user = await User.findById(req.user._id);
    const index = user.wishlist.indexOf(productId);

    let isWishlisted = false;
    if (index > -1) {
      user.wishlist.splice(index, 1);
    } else {
      user.wishlist.push(productId);
      isWishlisted = true;
    }

    await user.save();
    await user.populate("wishlist");

    return successResponse(
      res,
      200,
      isWishlisted ? "Added to wishlist." : "Removed from wishlist.",
      { wishlist: user.wishlist, isWishlisted }
    );
  } catch (err) {
    next(err);
  }
};

import Order from "../models/Order.js";
import Product from "../models/Product.js";
import { successResponse, errorResponse } from "../utils/apiResponse.js";

/**
 * @desc    Get all orders for the logged-in customer
 * @route   GET /api/orders
 * @access  Private
 */
export const getMyOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
    return successResponse(res, 200, "Orders retrieved.", { orders });
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Get single order details by ID
 * @route   GET /api/orders/:id
 * @access  Private
 */
export const getOrderById = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return errorResponse(res, 404, "Order not found.");
    }

    // Check authorization: must be the order owner or an admin
    if (order.user.toString() !== req.user._id.toString() && req.user.role !== "admin") {
      return errorResponse(res, 403, "Not authorized to view this order.");
    }

    return successResponse(res, 200, "Order details retrieved.", { order });
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Cancel order (if not already shipped)
 * @route   PUT /api/orders/:id/cancel
 * @access  Private
 */
export const cancelOrder = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return errorResponse(res, 404, "Order not found.");
    }

    if (order.user.toString() !== req.user._id.toString() && req.user.role !== "admin") {
      return errorResponse(res, 403, "Not authorized to cancel this order.");
    }

    if (["shipped", "out_for_delivery", "delivered"].includes(order.orderStatus)) {
      return errorResponse(
        res,
        400,
        "Cannot cancel an order that has already been shipped. Please contact support for an exchange or return."
      );
    }

    if (order.orderStatus === "cancelled") {
      return errorResponse(res, 400, "This order is already cancelled.");
    }

    // Restore stock atomically
    for (const item of order.items) {
      const product = await Product.findById(item.product);
      if (product) {
        if (product.variants && product.variants.length > 0) {
          const variantIndex = product.variants.findIndex((v) => v.size === item.size);
          if (variantIndex > -1) {
            product.variants[variantIndex].stock += item.quantity;
          }
        }
        product.stock += item.quantity;
        await product.save();
      }
    }

    order.orderStatus = "cancelled";
    order.timeline.push({
      status: "cancelled",
      timestamp: new Date(),
      note: "Order cancelled by customer. Inventory restored.",
    });

    await order.save();

    return successResponse(res, 200, "Order cancelled successfully.", { order });
  } catch (err) {
    next(err);
  }
};

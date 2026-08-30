import Order from "../models/Order.js";
import Product from "../models/Product.js";
import User from "../models/User.js";
import Coupon from "../models/Coupon.js";
import cloudinary from "../config/cloudinary.js";
import { successResponse, errorResponse } from "../utils/apiResponse.js";

/**
 * @desc    Get Admin Dashboard Analytics
 * @route   GET /api/admin/dashboard
 * @access  Private/Admin
 */
export const getDashboardStats = async (req, res, next) => {
  try {
    const totalOrders = await Order.countDocuments();
    const pendingOrders = await Order.countDocuments({
      orderStatus: { $in: ["pending", "confirmed", "processing"] },
    });
    const deliveredOrders = await Order.countDocuments({ orderStatus: "delivered" });
    const cancelledOrders = await Order.countDocuments({ orderStatus: "cancelled" });

    // Revenue calculation from paid orders
    const revenueStats = await Order.aggregate([
      { $match: { paymentStatus: "paid" } },
      { $group: { _id: null, totalRevenue: { $sum: "$total" } } },
    ]);
    const totalRevenue = revenueStats.length > 0 ? revenueStats[0].totalRevenue : 0;

    // Today's revenue
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);
    const todayRevenueStats = await Order.aggregate([
      { $match: { paymentStatus: "paid", createdAt: { $gte: startOfToday } } },
      { $group: { _id: null, todayRevenue: { $sum: "$total" } } },
    ]);
    const todayRevenue = todayRevenueStats.length > 0 ? todayRevenueStats[0].todayRevenue : 0;

    const totalCustomers = await User.countDocuments({ role: "customer" });
    const totalProducts = await Product.countDocuments();
    const lowStockProducts = await Product.countDocuments({ stock: { $lte: 10 } });

    // Recent 5 Orders
    const recentOrders = await Order.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .populate("user", "name email");

    // Category Sales breakdown
    const categoryBreakdown = await Product.aggregate([
      { $group: { _id: "$category", count: { $sum: 1 } } },
    ]);

    return successResponse(res, 200, "Dashboard analytics retrieved.", {
      metrics: {
        totalRevenue,
        todayRevenue,
        totalOrders,
        pendingOrders,
        deliveredOrders,
        cancelledOrders,
        totalCustomers,
        totalProducts,
        lowStockProducts,
      },
      recentOrders,
      categoryBreakdown,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Get all orders for admin with search and filter
 * @route   GET /api/admin/orders
 * @access  Private/Admin
 */
export const getAllOrders = async (req, res, next) => {
  try {
    const { status, paymentStatus, search, page = 1, limit = 50 } = req.query;
    const query = {};

    if (status && status !== "all") query.orderStatus = status;
    if (paymentStatus && paymentStatus !== "all") query.paymentStatus = paymentStatus;
    if (search) {
      query.$or = [
        { orderNumber: { $regex: search, $options: "i" } },
        { "shippingAddress.fullName": { $regex: search, $options: "i" } },
        { "shippingAddress.phone": { $regex: search, $options: "i" } },
      ];
    }

    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const skip = (pageNum - 1) * limitNum;

    const total = await Order.countDocuments(query);
    const orders = await Order.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum)
      .populate("user", "name email");

    return successResponse(res, 200, "Orders list retrieved.", {
      orders,
      pagination: {
        total,
        page: pageNum,
        pages: Math.ceil(total / limitNum),
      },
    });
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Update order status, tracking code, or carrier
 * @route   PUT /api/admin/orders/:id/status
 * @access  Private/Admin
 */
export const updateOrderStatus = async (req, res, next) => {
  try {
    const { orderStatus, paymentStatus, trackingNumber, carrier, note } = req.body;
    const order = await Order.findById(req.params.id);

    if (!order) {
      return errorResponse(res, 404, "Order not found.");
    }

    if (orderStatus) {
      order.orderStatus = orderStatus;
      order.timeline.push({
        status: orderStatus,
        timestamp: new Date(),
        note: note || `Order status updated to ${orderStatus} by Admin`,
      });
    }

    if (paymentStatus) order.paymentStatus = paymentStatus;
    if (trackingNumber !== undefined) order.trackingNumber = trackingNumber;
    if (carrier !== undefined) order.carrier = carrier;

    await order.save();

    return successResponse(res, 200, "Order status updated successfully.", { order });
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Get all registered customers
 * @route   GET /api/admin/customers
 * @access  Private/Admin
 */
export const getAllCustomers = async (req, res, next) => {
  try {
    const customers = await User.find({ role: "customer" })
      .select("-password")
      .sort({ createdAt: -1 });

    return successResponse(res, 200, "Customers list retrieved.", { customers });
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Get Inventory list with stock management
 * @route   GET /api/admin/inventory
 * @access  Private/Admin
 */
export const getInventory = async (req, res, next) => {
  try {
    const products = await Product.find()
      .select("name sku category stock lowStockThreshold variants images active")
      .sort({ stock: 1 });

    return successResponse(res, 200, "Inventory retrieved.", { products });
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Update stock for a product or variant
 * @route   PUT /api/admin/inventory/:id
 * @access  Private/Admin
 */
export const updateInventory = async (req, res, next) => {
  try {
    const { stock, variants } = req.body;
    const product = await Product.findById(req.params.id);

    if (!product) {
      return errorResponse(res, 404, "Product not found.");
    }

    if (variants && Array.isArray(variants)) {
      product.variants = variants;
      product.stock = variants.reduce((sum, v) => sum + (v.stock || 0), 0);
    } else if (stock !== undefined) {
      product.stock = Number(stock);
    }

    await product.save();

    return successResponse(res, 200, "Inventory updated successfully.", { product });
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Manage Coupons (List, Create, Update, Delete)
 */
export const getAdminCoupons = async (req, res, next) => {
  try {
    const coupons = await Coupon.find().sort({ createdAt: -1 });
    return successResponse(res, 200, "Coupons retrieved.", { coupons });
  } catch (err) {
    next(err);
  }
};

export const createAdminCoupon = async (req, res, next) => {
  try {
    const { code, type, value, minimumOrderValue, maximumDiscount, usageLimit, expiryDate } = req.body;
    const coupon = await Coupon.create({
      code: code.toUpperCase(),
      type: type || "percentage",
      value: Number(value),
      minimumOrderValue: Number(minimumOrderValue || 0),
      maximumDiscount: maximumDiscount ? Number(maximumDiscount) : null,
      usageLimit: Number(usageLimit || 1000),
      expiryDate: new Date(expiryDate || Date.now() + 30 * 24 * 60 * 60 * 1000),
    });
    return successResponse(res, 201, "Coupon created successfully.", { coupon });
  } catch (err) {
    next(err);
  }
};

export const deleteAdminCoupon = async (req, res, next) => {
  try {
    await Coupon.findByIdAndDelete(req.params.id);
    return successResponse(res, 200, "Coupon deleted.");
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Upload product image to Cloudinary (with dev data-url fallback)
 * @route   POST /api/admin/upload
 * @access  Private/Admin
 */
export const uploadImage = async (req, res, next) => {
  try {
    if (!req.file) {
      return errorResponse(res, 400, "No image file provided.");
    }

    // If Cloudinary credentials configured
    if (process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_KEY !== "dummy_key") {
      const b64 = Buffer.from(req.file.buffer).toString("base64");
      const dataURI = "data:" + req.file.mimetype + ";base64," + b64;
      const uploadRes = await cloudinary.uploader.upload(dataURI, {
        folder: "via_streetwear",
      });
      return successResponse(res, 200, "Image uploaded to Cloudinary.", {
        url: uploadRes.secure_url,
        publicId: uploadRes.public_id,
      });
    }

    // Fallback: Convert to Base64 data URL for instant zero-config dev preview
    const b64 = Buffer.from(req.file.buffer).toString("base64");
    const dataURI = `data:${req.file.mimetype};base64,${b64}`;
    return successResponse(res, 200, "Image processed (Dev Mode).", {
      url: dataURI,
    });
  } catch (err) {
    next(err);
  }
};

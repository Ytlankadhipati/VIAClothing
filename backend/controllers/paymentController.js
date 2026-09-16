import { getRazorpayInstance, verifyRazorpaySignature } from "../config/razorpay.js";
import Order from "../models/Order.js";
import Cart from "../models/Cart.js";
import Product from "../models/Product.js";
import Coupon from "../models/Coupon.js";
import { successResponse, errorResponse } from "../utils/apiResponse.js";
import emailService from "../services/emailService.js";

/**
 * Robust Product Lookup by ObjectId, Slug, or SKU
 */
const findProductHelper = async (identifier) => {
  if (!identifier) return null;
  const idStr = identifier.toString();
  if (idStr.match(/^[0-9a-fA-F]{24}$/)) {
    const prod = await Product.findById(idStr);
    if (prod) return prod;
  }
  return await Product.findOne({
    $or: [{ slug: idStr.toLowerCase() }, { sku: idStr.toUpperCase() }, { id: idStr }],
  });
};

/**
 * @desc    Create Razorpay Order from server
 * @route   POST /api/payments/create-order
 * @access  Private
 */
export const createRazorpayOrder = async (req, res, next) => {
  try {
    const { items, shippingAddress, couponCode } = req.body;

    if (!items || !items.length) {
      return errorResponse(res, 400, "Your order must contain at least one item.");
    }

    // Option A: Do not block checkout for unverified emails to prevent lost revenue, but log warning
    if (req.user && req.user.emailVerified === false) {
      console.warn(
        `[Payment/Order] Notice: Order initiated by user with unverified email: ${req.user.email} (User ID: ${req.user._id})`
      );
    }

    // Recalculate subtotal server-side
    let calculatedSubtotal = 0;
    for (const item of items) {
      const product = await findProductHelper(item.product || item.productId);
      if (!product || !product.active) {
        return errorResponse(res, 400, `Product '${item.name}' is no longer available.`);
      }

      let price = product.price;
      let stock = product.stock;

      if (item.size && product.variants && product.variants.length > 0) {
        const variant = product.variants.find((v) => v.size === item.size);
        if (variant) {
          if (variant.price) price = variant.price;
          stock = variant.stock;
        }
      }

      if (stock < item.quantity) {
        return errorResponse(
          res,
          400,
          `Insufficient stock for '${product.name}' (Size: ${item.size}). Only ${stock} left.`
        );
      }

      calculatedSubtotal += price * item.quantity;
    }

    // Calculate discount
    let discount = 0;
    if (couponCode) {
      const coupon = await Coupon.findOne({
        code: couponCode.toUpperCase(),
        active: true,
      });
      if (coupon && (!coupon.expiryDate || coupon.expiryDate > new Date())) {
        if (calculatedSubtotal >= coupon.minimumOrderValue) {
          if (coupon.type === "percentage") {
            discount = (calculatedSubtotal * coupon.value) / 100;
            if (coupon.maximumDiscount && discount > coupon.maximumDiscount) {
              discount = coupon.maximumDiscount;
            }
          } else {
            discount = Math.min(coupon.value, calculatedSubtotal);
          }
        }
      }
    }

    discount = Math.round(discount);
    const shippingFee = calculatedSubtotal >= 1999 || calculatedSubtotal === 0 ? 0 : 150;
    const finalTotal = Math.max(1, calculatedSubtotal - discount + shippingFee);

    const razorpay = getRazorpayInstance();
    const amountInPaise = Math.round(finalTotal * 100);

    let razorpayOrder;
    if (razorpay) {
      try {
        razorpayOrder = await razorpay.orders.create({
          amount: amountInPaise,
          currency: "INR",
          receipt: `rcpt_${Date.now().toString().slice(-8)}`,
        });
      } catch (rzpErr) {
        console.warn("[Razorpay] API error, falling back to development order:", rzpErr.message);
        razorpayOrder = {
          id: `order_dev_${Date.now()}`,
          amount: amountInPaise,
          currency: "INR",
        };
      }
    } else {
      razorpayOrder = {
        id: `order_dev_${Date.now()}`,
        amount: amountInPaise,
        currency: "INR",
      };
    }

    return successResponse(res, 200, "Razorpay order initiated.", {
      razorpayOrderId: razorpayOrder.id,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency || "INR",
      keyId: process.env.RAZORPAY_KEY_ID || "rzp_test_via_streetwear_demo",
      orderDetails: {
        subtotal: calculatedSubtotal,
        discount,
        shippingFee,
        total: finalTotal,
      },
    });
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Cryptographically verify payment & finalize order
 * @route   POST /api/payments/verify
 * @access  Private
 */
export const verifyPayment = async (req, res, next) => {
  try {
    const {
      razorpayOrderId,
      razorpayPaymentId,
      razorpaySignature,
      items,
      shippingAddress,
      couponCode,
      paymentMethod = "razorpay",
    } = req.body;

    // Validate Signature for Razorpay
    if (paymentMethod === "razorpay") {
      const isValid = verifyRazorpaySignature(
        razorpayOrderId,
        razorpayPaymentId,
        razorpaySignature
      );

      if (!isValid) {
        return errorResponse(res, 400, "Payment verification failed: Invalid cryptographic signature.");
      }
    }

    // Double check inventory and construct frozen order snapshot
    const orderItems = [];
    let subtotal = 0;

    for (const item of items) {
      const product = await findProductHelper(item.product || item.productId);
      if (!product) {
        return errorResponse(res, 400, `Product not found for ${item.name}`);
      }

      let price = product.price;
      let sku = product.sku;

      // Atomic inventory deduction
      if (product.variants && product.variants.length > 0) {
        const variantIndex = product.variants.findIndex((v) => v.size === item.size);
        if (variantIndex > -1) {
          const variant = product.variants[variantIndex];
          if (variant.price) price = variant.price;
          if (variant.sku) sku = variant.sku;

          if (variant.stock < item.quantity) {
            return errorResponse(res, 400, `Item ${product.name} (${item.size}) just sold out.`);
          }

          // Deduct variant stock
          product.variants[variantIndex].stock -= item.quantity;
          product.stock = Math.max(0, product.stock - item.quantity);
          await product.save();
        } else {
          product.stock = Math.max(0, product.stock - item.quantity);
          await product.save();
        }
      } else {
        if (product.stock < item.quantity) {
          return errorResponse(res, 400, `Item ${product.name} just sold out.`);
        }
        product.stock -= item.quantity;
        await product.save();
      }

      subtotal += price * item.quantity;

      orderItems.push({
        product: product._id,
        name: product.name,
        image: (item.customDetails && item.customDetails.previewImage) || item.image || product.images[0],
        price,
        size: item.size,
        color: item.color || "Standard",
        sku,
        quantity: item.quantity,
        customDetails: item.customDetails || null,
      });
    }

    // Calculate discount
    let discount = 0;
    if (couponCode) {
      const coupon = await Coupon.findOne({ code: couponCode.toUpperCase(), active: true });
      if (coupon) {
        if (coupon.type === "percentage") {
          discount = (subtotal * coupon.value) / 100;
          if (coupon.maximumDiscount && discount > coupon.maximumDiscount) {
            discount = coupon.maximumDiscount;
          }
        } else {
          discount = Math.min(coupon.value, subtotal);
        }
        coupon.usedCount += 1;
        await coupon.save();
      }
    }

    discount = Math.round(discount);
    const shippingFee = subtotal >= 1999 || subtotal === 0 ? 0 : 150;
    const total = Math.max(0, subtotal - discount + shippingFee);

    const orderNumber = `VIA-${new Date().getFullYear()}-${Math.floor(100000 + Math.random() * 900000)}`;

    const order = await Order.create({
      user: req.user._id,
      orderNumber,
      items: orderItems,
      shippingAddress,
      subtotal,
      discount,
      shippingFee,
      total,
      coupon: {
        code: couponCode || "",
        discountAmount: discount,
      },
      paymentMethod,
      paymentStatus: paymentMethod === "cod" ? "pending" : "paid",
      razorpayOrderId: razorpayOrderId || "",
      razorpayPaymentId: razorpayPaymentId || "",
      razorpaySignature: razorpaySignature || "",
      orderStatus: "confirmed",
      timeline: [
        {
          status: "confirmed",
          timestamp: new Date(),
          note: paymentMethod === "cod" ? "Order confirmed with Cash on Delivery." : "Payment verified via Razorpay. Order confirmed.",
        },
      ],
    });

    // Clear user's active cart
    await Cart.findOneAndUpdate(
      { user: req.user._id },
      { items: [], discount: 0, couponCode: "", subtotal: 0, total: 0 }
    );

    // Send confirmation email asynchronously
    emailService.sendOrderConfirmationEmail(order, req.user).catch(() => { });

    return successResponse(res, 201, "Order placed successfully!", { order });
  } catch (err) {
    next(err);
  }
};

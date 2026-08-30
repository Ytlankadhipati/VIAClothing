import Cart from "../models/Cart.js";
import Product from "../models/Product.js";
import { successResponse, errorResponse } from "../utils/apiResponse.js";

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
 * Helper to validate & sync product prices and stock in cart
 */
const syncCartWithProducts = async (cart) => {
  const validItems = [];

  for (const item of cart.items) {
    const product = await findProductHelper(item.product);
    if (!product || !product.active) continue;

    // Determine price and stock for specific variant or base product
    let currentPrice = product.price;
    let availableStock = product.stock;

    if (item.size && product.variants && product.variants.length > 0) {
      const variant = product.variants.find((v) => v.size === item.size);
      if (variant) {
        if (variant.price) currentPrice = variant.price;
        availableStock = variant.stock;
      }
    }

    if (availableStock <= 0) continue; // Out of stock items omitted or flagged

    const finalQuantity = Math.min(item.quantity, availableStock);

    validItems.push({
      product: product._id,
      name: product.name,
      size: item.size,
      color: item.color || "Standard",
      variantSku: item.variantSku || product.sku,
      image: item.image || product.images[0] || "/assets/via-logo.png",
      price: currentPrice,
      quantity: finalQuantity,
      subtotal: currentPrice * finalQuantity,
    });
  }

  cart.items = validItems;
  cart.recalculate();
  await cart.save();
  return cart;
};

/**
 * @desc    Get current user cart
 * @route   GET /api/cart
 * @access  Private
 */
export const getCart = async (req, res, next) => {
  try {
    let cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      cart = await Cart.create({ user: req.user._id, items: [] });
    }

    cart = await syncCartWithProducts(cart);
    return successResponse(res, 200, "Cart retrieved.", { cart });
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Add item to cart
 * @route   POST /api/cart/items
 * @access  Private
 */
export const addToCart = async (req, res, next) => {
  try {
    const { productId, size, color, quantity = 1, customDetails = null } = req.body;

    if (!productId || !size) {
      return errorResponse(res, 400, "Please provide product ID and size.");
    }

    const product = await findProductHelper(productId);
    if (!product || !product.active) {
      return errorResponse(res, 404, "Product is not available.");
    }

    // Verify variant stock
    let price = product.price;
    let availableStock = product.stock;
    let sku = product.sku;

    if (product.variants && product.variants.length > 0) {
      const variant = product.variants.find((v) => v.size === size);
      if (variant) {
        if (variant.price) price = variant.price;
        availableStock = variant.stock;
        if (variant.sku) sku = variant.sku;
      }
    }

    if (availableStock < quantity) {
      return errorResponse(
        res,
        400,
        `Only ${availableStock} units available for size ${size}.`
      );
    }

    let cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      cart = new Cart({ user: req.user._id, items: [] });
    }

    // Check if item with exact product and size already exists in cart
    const existingIndex = customDetails
      ? -1
      : cart.items.findIndex(
          (item) => item.product.toString() === product._id.toString() && item.size === size && !item.customDetails
        );

    if (existingIndex > -1) {
      const newQty = cart.items[existingIndex].quantity + quantity;
      if (newQty > availableStock) {
        return errorResponse(
          res,
          400,
          `Cannot add more. Maximum available stock is ${availableStock}.`
        );
      }
      cart.items[existingIndex].quantity = newQty;
      cart.items[existingIndex].subtotal = price * newQty;
    } else {
      cart.items.push({
        product: product._id,
        name: product.name,
        size,
        color: color || "Standard",
        variantSku: sku,
        image: (customDetails && customDetails.previewImage) || product.images[0] || "/assets/via-logo.png",
        price,
        quantity,
        subtotal: price * quantity,
        customDetails: customDetails || null,
      });
    }

    cart.recalculate();
    await cart.save();

    return successResponse(res, 200, "Item added to cart.", { cart });
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Update cart item quantity
 * @route   PUT /api/cart/items/:itemId
 * @access  Private
 */
export const updateCartItem = async (req, res, next) => {
  try {
    const { quantity } = req.body;
    if (!quantity || quantity < 1) {
      return errorResponse(res, 400, "Quantity must be at least 1.");
    }

    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      return errorResponse(res, 404, "Cart not found.");
    }

    const item = cart.items.id(req.params.itemId);
    if (!item) {
      return errorResponse(res, 404, "Item not found in cart.");
    }

    // Validate stock
    const product = await Product.findById(item.product);
    if (product) {
      let availableStock = product.stock;
      if (product.variants && product.variants.length > 0) {
        const variant = product.variants.find((v) => v.size === item.size);
        if (variant) availableStock = variant.stock;
      }

      if (quantity > availableStock) {
        return errorResponse(
          res,
          400,
          `Cannot increase quantity. Only ${availableStock} units in stock.`
        );
      }
    }

    item.quantity = quantity;
    item.subtotal = item.price * quantity;

    cart.recalculate();
    await cart.save();

    return successResponse(res, 200, "Cart updated.", { cart });
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Remove item from cart
 * @route   DELETE /api/cart/items/:itemId
 * @access  Private
 */
export const removeCartItem = async (req, res, next) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      return errorResponse(res, 404, "Cart not found.");
    }

    cart.items = cart.items.filter(
      (item) => item._id.toString() !== req.params.itemId
    );

    cart.recalculate();
    await cart.save();

    return successResponse(res, 200, "Item removed from cart.", { cart });
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Clear entire cart
 * @route   DELETE /api/cart
 * @access  Private
 */
export const clearCart = async (req, res, next) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id });
    if (cart) {
      cart.items = [];
      cart.discount = 0;
      cart.couponCode = "";
      cart.recalculate();
      await cart.save();
    }

    return successResponse(res, 200, "Cart cleared.", { cart });
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Merge guest cart items into authenticated user cart
 * @route   POST /api/cart/merge
 * @access  Private
 */
export const mergeGuestCart = async (req, res, next) => {
  try {
    const { guestItems = [] } = req.body;

    let cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      cart = new Cart({ user: req.user._id, items: [] });
    }

    for (const gItem of guestItems) {
      if (!gItem.productId || !gItem.size) continue;

      const product = await Product.findById(gItem.productId);
      if (!product || !product.active) continue;

      let price = product.price;
      let availableStock = product.stock;
      let sku = product.sku;

      if (product.variants && product.variants.length > 0) {
        const variant = product.variants.find((v) => v.size === gItem.size);
        if (variant) {
          if (variant.price) price = variant.price;
          availableStock = variant.stock;
          if (variant.sku) sku = variant.sku;
        }
      }

      if (availableStock <= 0) continue;

      const existingIndex = cart.items.findIndex(
        (i) =>
          i.product.toString() === gItem.productId && i.size === gItem.size
      );

      const qtyToAdd = Math.min(gItem.quantity || 1, availableStock);

      if (existingIndex > -1) {
        cart.items[existingIndex].quantity = Math.min(
          cart.items[existingIndex].quantity + qtyToAdd,
          availableStock
        );
        cart.items[existingIndex].subtotal =
          cart.items[existingIndex].price * cart.items[existingIndex].quantity;
      } else {
        cart.items.push({
          product: product._id,
          name: product.name,
          size: gItem.size,
          color: gItem.color || "Standard",
          variantSku: sku,
          image: product.images[0] || "/assets/via-logo.png",
          price,
          quantity: qtyToAdd,
          subtotal: price * qtyToAdd,
        });
      }
    }

    cart.recalculate();
    await cart.save();

    return successResponse(res, 200, "Guest cart merged successfully.", { cart });
  } catch (err) {
    next(err);
  }
};

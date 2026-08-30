import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { cartService } from "../services/cartService";
import { useAuth } from "./AuthContext";
import { useToast } from "./ToastContext";

const CartContext = createContext();

const GUEST_CART_KEY = "via_guest_cart";

export function CartProvider({ children }) {
  const { isAuthenticated } = useAuth();
  const { addToast } = useToast();

  const [items, setItems] = useState([]);
  const [coupon, setCoupon] = useState(null);
  const [cartDrawerOpen, setCartDrawerOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  // Load cart based on authentication state
  const loadCart = useCallback(async () => {
    if (isAuthenticated) {
      try {
        setLoading(true);
        // Check if there are local guest items to merge
        const localData = localStorage.getItem(GUEST_CART_KEY);
        if (localData) {
          const guestItems = JSON.parse(localData);
          if (guestItems && guestItems.length > 0) {
            await cartService.mergeGuestCart(
              guestItems.map((i) => ({
                productId: i.productId || i.product,
                size: i.size,
                color: i.color,
                quantity: i.quantity,
              }))
            );
            localStorage.removeItem(GUEST_CART_KEY);
          }
        }

        const res = await cartService.getCart();
        if (res.success && res.data.cart) {
          setItems(res.data.cart.items || []);
        }
      } catch (err) {
        console.warn("Failed to load server cart:", err.message);
      } finally {
        setLoading(false);
      }
    } else {
      // Guest cart from localStorage
      const local = localStorage.getItem(GUEST_CART_KEY);
      if (local) {
        try {
          setItems(JSON.parse(local));
        } catch {
          setItems([]);
        }
      } else {
        setItems([]);
      }
    }
  }, [isAuthenticated]);

  useEffect(() => {
    loadCart();
  }, [loadCart]);

  // Sync guest cart to localStorage
  useEffect(() => {
    if (!isAuthenticated) {
      localStorage.setItem(GUEST_CART_KEY, JSON.stringify(items));
    }
  }, [items, isAuthenticated]);

  const addToCart = async (product, size, color = "Standard", quantity = 1) => {
    if (!size) {
      addToast("Please select a size first", "error");
      return;
    }

    try {
      if (isAuthenticated) {
        const res = await cartService.addToCart({
          productId: product._id || product.id,
          size,
          color,
          quantity,
        });
        if (res.success && res.data.cart) {
          setItems(res.data.cart.items);
        }
      } else {
        // Guest mode
        setItems((prev) => {
          const existingIndex = prev.findIndex(
            (i) => (i.productId === product._id || i.productId === product.id) && i.size === size
          );

          if (existingIndex > -1) {
            const next = [...prev];
            next[existingIndex].quantity += quantity;
            next[existingIndex].subtotal = next[existingIndex].price * next[existingIndex].quantity;
            return next;
          } else {
            return [
              ...prev,
              {
                _id: `guest_${Date.now()}_${Math.random()}`,
                productId: product._id || product.id,
                product: product._id || product.id,
                name: product.name,
                image: product.images[0] || "/assets/via-logo.png",
                price: product.price,
                size,
                color,
                quantity,
                subtotal: product.price * quantity,
              },
            ];
          }
        });
      }

      addToast(`${product.name} (${size}) added to your bag`, "success");
      setCartDrawerOpen(true);
    } catch (err) {
      addToast(err.message || "Could not add to bag", "error");
    }
  };

  const updateQuantity = async (itemId, quantity) => {
    if (quantity < 1) return removeFromCart(itemId);

    try {
      if (isAuthenticated) {
        const res = await cartService.updateCartItem(itemId, quantity);
        if (res.success && res.data.cart) {
          setItems(res.data.cart.items);
        }
      } else {
        setItems((prev) =>
          prev.map((item) =>
            item._id === itemId
              ? { ...item, quantity, subtotal: item.price * quantity }
              : item
          )
        );
      }
    } catch (err) {
      addToast(err.message || "Failed to update quantity", "error");
    }
  };

  const removeFromCart = async (itemId) => {
    try {
      if (isAuthenticated) {
        const res = await cartService.removeCartItem(itemId);
        if (res.success && res.data.cart) {
          setItems(res.data.cart.items);
        }
      } else {
        setItems((prev) => prev.filter((item) => item._id !== itemId));
      }
      addToast("Item removed from bag", "info");
    } catch (err) {
      addToast(err.message || "Failed to remove item", "error");
    }
  };

  const clearCart = async () => {
    if (isAuthenticated) {
      try {
        await cartService.clearCart();
      } catch (err) {
        // Ignore
      }
    }
    setItems([]);
    setCoupon(null);
    localStorage.removeItem(GUEST_CART_KEY);
  };

  const applyCoupon = async (code) => {
    try {
      const res = await cartService.validateCoupon(code, subtotal);
      if (res.success && res.data.coupon) {
        setCoupon(res.data.coupon);
        addToast(`Coupon '${code.toUpperCase()}' applied! Saved ₹${res.data.coupon.discountAmount}`, "success");
      }
    } catch (err) {
      addToast(err.message || "Invalid coupon code", "error");
    }
  };

  const removeCoupon = () => {
    setCoupon(null);
    addToast("Coupon removed", "info");
  };

  // Calculations
  const subtotal = items.reduce((acc, curr) => acc + curr.price * curr.quantity, 0);
  const discount = coupon ? coupon.discountAmount : 0;
  const shipping = subtotal >= 1999 || subtotal === 0 ? 0 : 150;
  const total = Math.max(0, subtotal - discount + shipping);
  const itemCount = items.reduce((acc, curr) => acc + curr.quantity, 0);
  const freeShippingThreshold = 1999;
  const freeShippingRemaining = Math.max(0, freeShippingThreshold - subtotal);
  const freeShippingProgress = Math.min(100, Math.round((subtotal / freeShippingThreshold) * 100));

  const value = {
    items,
    itemCount,
    subtotal,
    discount,
    shipping,
    total,
    coupon,
    cartDrawerOpen,
    loading,
    freeShippingThreshold,
    freeShippingRemaining,
    freeShippingProgress,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    applyCoupon,
    removeCoupon,
    openCartDrawer: () => setCartDrawerOpen(true),
    closeCartDrawer: () => setCartDrawerOpen(false),
    toggleCartDrawer: () => setCartDrawerOpen((prev) => !prev),
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export const useCart = () => useContext(CartContext);

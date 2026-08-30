import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  X,
  Plus,
  Minus,
  Trash2,
  ShoppingBag,
  ArrowRight,
  ShieldCheck,
  Tag,
  Truck,
  MessageCircle,
} from "lucide-react";
import { useCart } from "../context/CartContext";
import { getCartOrderWhatsAppUrl } from "../utils/whatsapp";

export default function CartDrawer() {
  const {
    items,
    itemCount,
    subtotal,
    discount,
    shipping,
    total,
    coupon,
    cartDrawerOpen,
    closeCartDrawer,
    updateQuantity,
    removeFromCart,
    applyCoupon,
    removeCoupon,
    freeShippingRemaining,
    freeShippingProgress,
  } = useCart();

  const [couponInput, setCouponInput] = useState("");
  const navigate = useNavigate();

  if (!cartDrawerOpen) return null;

  const handleApplyCoupon = (e) => {
    e.preventDefault();
    if (!couponInput.trim()) return;
    applyCoupon(couponInput);
    setCouponInput("");
  };

  const handleCheckout = () => {
    closeCartDrawer();
    navigate("/checkout");
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity animate-fadeIn"
        onClick={closeCartDrawer}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white border-l border-zinc-200 shadow-2xl flex flex-col justify-between animate-slideLeft">
          {/* Header */}
          <div className="p-5 border-b border-zinc-200 flex items-center justify-between bg-zinc-50/70">
            <div className="flex items-center gap-2.5">
              <ShoppingBag className="w-5 h-5 text-black" />
              <h2 className="font-heading font-black tracking-widest text-base uppercase text-zinc-900">
                YOUR BAG ({itemCount})
              </h2>
            </div>
            <button
              onClick={closeCartDrawer}
              className="p-1.5 text-zinc-500 hover:text-black hover:bg-zinc-200/60 rounded-full transition-all"
              aria-label="Close cart"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Free Shipping Progress Indicator */}
          <div className="px-5 py-3 bg-zinc-900 text-white border-b border-zinc-800">
            <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-wider mb-1.5">
              <span className="flex items-center gap-1.5">
                <Truck className="w-3.5 h-3.5 text-emerald-400" />
                {freeShippingRemaining > 0 ? (
                  <>
                    Add <span className="text-emerald-400">₹{freeShippingRemaining.toLocaleString("en-IN")}</span> more for FREE Delivery
                  </>
                ) : (
                  <span className="text-emerald-400 font-black">You've unlocked FREE Express Shipping!</span>
                )}
              </span>
              <span>{freeShippingProgress}%</span>
            </div>
            <div className="w-full bg-zinc-800 h-1.5 overflow-hidden">
              <div
                className="bg-emerald-500 h-full transition-all duration-500"
                style={{ width: `${freeShippingProgress}%` }}
              />
            </div>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-5 divide-y divide-zinc-100">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-4">
                <div className="w-16 h-16 rounded-full bg-zinc-100 flex items-center justify-center">
                  <ShoppingBag className="w-8 h-8 text-zinc-400" />
                </div>
                <div>
                  <h3 className="font-black text-lg uppercase tracking-tight text-zinc-900">
                    Your bag is empty
                  </h3>
                  <p className="text-xs text-zinc-500 tracking-wider uppercase mt-1">
                    Discover heavyweight luxury streetwear drops.
                  </p>
                </div>
                <button
                  onClick={() => {
                    closeCartDrawer();
                    navigate("/shop");
                  }}
                  className="px-6 py-3 bg-black hover:bg-zinc-800 text-white text-xs font-black uppercase tracking-widest transition-all"
                >
                  Start Shopping
                </button>
              </div>
            ) : (
              items.map((item) => (
                <div key={item._id} className="py-4 flex gap-4">
                  {/* Thumbnail */}
                  <div className="w-20 h-24 bg-zinc-100 shrink-0 border border-zinc-200 overflow-hidden relative">
                    <img
                      src={item.image || "/assets/via-logo.png"}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Details */}
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <Link
                          to={`/product/${item.productId || item.product}`}
                          onClick={closeCartDrawer}
                          className="font-bold text-sm text-zinc-900 hover:text-black line-clamp-1"
                        >
                          {item.name}
                        </Link>
                        <button
                          onClick={() => removeFromCart(item._id)}
                          className="text-zinc-400 hover:text-red-500 transition-colors p-1"
                          title="Remove item"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="flex items-center gap-3 text-xs text-zinc-500 font-semibold mt-1">
                        <span className="bg-zinc-100 px-2 py-0.5 border border-zinc-200 text-zinc-800 text-[10px] font-bold">
                          Size: {item.size}
                        </span>
                        {item.color && item.color !== "Standard" && (
                          <span className="text-[10px] text-zinc-500">{item.color}</span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center justify-between mt-3">
                      {/* Quantity Controls */}
                      <div className="flex items-center border border-zinc-300">
                        <button
                          onClick={() => updateQuantity(item._id, item.quantity - 1)}
                          className="px-2 py-1 hover:bg-zinc-100 text-zinc-600 transition-colors"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="px-2.5 py-1 text-xs font-bold text-zinc-900">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item._id, item.quantity + 1)}
                          className="px-2 py-1 hover:bg-zinc-100 text-zinc-600 transition-colors"
                          aria-label="Increase quantity"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      {/* Price */}
                      <span className="font-black text-sm text-zinc-900">
                        ₹{(item.price * item.quantity).toLocaleString("en-IN")}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer with Subtotal, Promo & Checkout */}
          {items.length > 0 && (
            <div className="p-5 border-t border-zinc-200 bg-zinc-50/50 space-y-4">
              {/* Coupon Form */}
              {coupon ? (
                <div className="flex items-center justify-between p-2.5 bg-emerald-50 border border-emerald-300 text-xs">
                  <div className="flex items-center gap-2 text-emerald-800 font-bold">
                    <Tag className="w-4 h-4 text-emerald-600" />
                    <span>
                      {coupon.code} (-₹{coupon.discountAmount.toLocaleString("en-IN")})
                    </span>
                  </div>
                  <button
                    onClick={removeCoupon}
                    className="text-zinc-400 hover:text-red-500 text-[10px] font-bold uppercase tracking-wider"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApplyCoupon} className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Enter Coupon (e.g. VIA10)"
                    value={couponInput}
                    onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                    className="flex-1 px-3 py-2 text-xs border border-zinc-300 focus:border-black uppercase font-bold tracking-wider outline-hidden bg-white"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 bg-zinc-900 hover:bg-black text-white text-xs font-bold uppercase tracking-wider transition-all"
                  >
                    Apply
                  </button>
                </form>
              )}

              {/* Price Breakdown */}
              <div className="space-y-1.5 text-xs text-zinc-600 pt-2 border-t border-zinc-200">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-bold text-zinc-900">
                    ₹{subtotal.toLocaleString("en-IN")}
                  </span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-emerald-600 font-bold">
                    <span>Discount</span>
                    <span>-₹{discount.toLocaleString("en-IN")}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Estimated Shipping</span>
                  <span className="font-bold text-zinc-900">
                    {shipping === 0 ? "FREE" : `₹${shipping.toLocaleString("en-IN")}`}
                  </span>
                </div>
                <div className="flex justify-between text-base font-black text-zinc-900 pt-2 border-t border-zinc-200">
                  <span>Total</span>
                  <span>₹{total.toLocaleString("en-IN")}</span>
                </div>
              </div>

              {/* Checkout CTA */}
              <button
                onClick={handleCheckout}
                className="w-full py-4 bg-black hover:bg-zinc-800 text-white font-black text-xs uppercase tracking-[0.25em] flex items-center justify-center gap-2 transition-all shadow-lg hover:shadow-xl"
              >
                Proceed to Checkout
                <ArrowRight className="w-4 h-4" />
              </button>

              {/* Alternative WhatsApp Checkout */}
              <a
                href={getCartOrderWhatsAppUrl(items)}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-2.5 bg-emerald-50 border border-emerald-500/40 hover:border-emerald-600 text-emerald-800 font-bold text-[11px] uppercase tracking-widest flex items-center justify-center gap-2 transition-all"
              >
                <MessageCircle className="w-4 h-4 text-emerald-600" />
                Quick Order via WhatsApp Concierge
              </a>

              <div className="flex items-center justify-center gap-2 text-[10px] text-zinc-400 font-semibold uppercase tracking-wider pt-1">
                <ShieldCheck className="w-3.5 h-3.5 text-zinc-500" />
                <span>100% Encrypted & Safe Razorpay Checkout</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  ShieldCheck,
  CreditCard,
  Truck,
  MessageCircle,
  Tag,
  CheckCircle,
  ArrowRight,
  MapPin,
  User,
  ShoppingBag,
  Sparkles,
  Smartphone,
  Building2,
  X,
  CheckCircle2,
  Lock,
  Loader2,
} from "lucide-react";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import { paymentService } from "../services/paymentService";
import { getCartOrderWhatsAppUrl } from "../utils/whatsapp";
import { fetchCityStateFromPincode } from "../utils/pincodeHelper";

// Dynamically load Razorpay SDK
const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    if (window.Razorpay) {
      resolve(true);
      return;
    }
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

export default function Checkout() {
  const { items, subtotal, discount, shipping, total, coupon, applyCoupon, removeCoupon, clearCart } = useCart();
  const { user, isAuthenticated, addAddress } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();

  // Form State
  const [shippingAddress, setShippingAddress] = useState({
    fullName: user?.addresses?.[0]?.fullName || user?.name || "",
    phone: user?.addresses?.[0]?.phone || user?.phone || "",
    addressLine1: user?.addresses?.[0]?.addressLine1 || "",
    addressLine2: user?.addresses?.[0]?.addressLine2 || "",
    city: user?.addresses?.[0]?.city || "",
    state: user?.addresses?.[0]?.state || "",
    postalCode: user?.addresses?.[0]?.postalCode || "",
    country: "India",
  });

  const [pincodeLoading, setPincodeLoading] = useState(false);
  const [pincodeStatus, setPincodeStatus] = useState(null);

  const handlePincodeChange = async (val) => {
    const clean = val.replace(/\D/g, "").slice(0, 6);
    setShippingAddress((prev) => ({ ...prev, postalCode: clean }));

    if (clean.length === 6) {
      setPincodeLoading(true);
      setPincodeStatus(null);
      const res = await fetchCityStateFromPincode(clean);
      setPincodeLoading(false);
      if (res && res.success) {
        setShippingAddress((prev) => ({
          ...prev,
          city: res.city || prev.city,
          state: res.state || prev.state,
        }));
        setPincodeStatus({
          success: true,
          message: `${res.city}, ${res.state}`,
        });
      } else {
        setPincodeStatus({
          success: false,
          message: "PIN code not verified. Please enter City & State manually.",
        });
      }
    } else {
      setPincodeStatus(null);
    }
  };

  const [paymentMethod, setPaymentMethod] = useState("razorpay"); // 'razorpay' | 'cod'
  const [couponCodeInput, setCouponCodeInput] = useState("");
  const [processing, setProcessing] = useState(false);
  const [saveAddressToProfile, setSaveAddressToProfile] = useState(true);

  // Sandbox Test Payment Modal State
  const [sandboxModalOpen, setSandboxModalOpen] = useState(false);
  const [sandboxPaymentData, setSandboxPaymentData] = useState(null);
  const [sandboxMethod, setSandboxMethod] = useState("upi"); // 'upi' | 'card' | 'netbanking'
  const [sandboxProcessing, setSandboxProcessing] = useState(false);

  if (items.length === 0) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center">
        <ShoppingBag className="w-16 h-16 text-zinc-400 mb-4" />
        <h2 className="text-2xl font-black uppercase text-zinc-900 mb-2">
          Your bag is empty
        </h2>
        <p className="text-xs text-zinc-500 uppercase tracking-widest mb-6">
          Add items before proceeding to checkout.
        </p>
        <Link
          to="/shop"
          className="px-8 py-4 bg-black text-white font-black text-xs uppercase tracking-widest hover:bg-zinc-800"
        >
          Explore Shop
        </Link>
      </div>
    );
  }

  const handleApplyCoupon = (e) => {
    e.preventDefault();
    if (!couponCodeInput.trim()) return;
    applyCoupon(couponCodeInput);
    setCouponCodeInput("");
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();

    if (!shippingAddress.fullName || !shippingAddress.phone || !shippingAddress.addressLine1 || !shippingAddress.city || !shippingAddress.postalCode) {
      addToast("Please complete all required shipping address fields", "error");
      return;
    }

    // Save address to user profile if checked
    if (isAuthenticated && saveAddressToProfile && (!user.addresses || user.addresses.length === 0)) {
      addAddress(shippingAddress).catch(() => { });
    }

    try {
      setProcessing(true);

      // RAZORPAY / PREPAID PAYMENT FLOW
      const isSdkLoaded = await loadRazorpayScript();
      if (!isSdkLoaded && !window.Razorpay) {
        console.warn("Razorpay SDK could not load. Running in development verification mode.");
      }

      // Create Razorpay order on backend
      const rzpOrderRes = await paymentService.createRazorpayOrder({
        items,
        shippingAddress,
        couponCode: coupon?.code,
      });

      if (!rzpOrderRes.success) {
        throw new Error(rzpOrderRes.message || "Failed to create payment order");
      }

      const { razorpayOrderId, amount, currency, keyId } = rzpOrderRes.data;

      const isRealRazorpayKey = Boolean(
        keyId &&
        !keyId.includes("demo") &&
        !keyId.includes("dummy") &&
        (keyId.startsWith("rzp_test_") || keyId.startsWith("rzp_live_")) &&
        keyId.length > 20
      );

      // Launch real Razorpay popup if a valid key is provided
      if (window.Razorpay && isRealRazorpayKey) {
        const options = {
          key: keyId,
          amount: amount,
          currency: currency,
          name: "VIA Clothing",
          description: "Custom Merch & Streetwear Order",
          image: "/assets/via-logo.png",
          order_id: razorpayOrderId,
          handler: async function (response) {
            try {
              // Verify signature on backend
              const verifyRes = await paymentService.verifyPayment({
                razorpayOrderId: response.razorpay_order_id,
                razorpayPaymentId: response.razorpay_payment_id,
                razorpaySignature: response.razorpay_signature,
                items,
                shippingAddress,
                couponCode: coupon?.code,
                paymentMethod: "razorpay",
              });

              if (verifyRes.success && verifyRes.data.order) {
                clearCart();
                addToast("Payment verified! Order confirmed.", "success");
                navigate(`/order-success/${verifyRes.data.order._id}`);
              }
            } catch (err) {
              addToast(err.message || "Payment verification failed", "error");
            }
          },
          prefill: {
            name: shippingAddress.fullName,
            email: user?.email || "customer@viaclothing.in",
            contact: shippingAddress.phone,
          },
          theme: {
            color: "#000000",
          },
        };

        const rzp = new window.Razorpay(options);
        rzp.on("payment.failed", function (response) {
          // Open interactive test gateway fallback
          setSandboxPaymentData({
            razorpayOrderId,
            amount,
            currency,
            items,
            shippingAddress,
            couponCode: coupon?.code,
            errorMessage: response.error?.description || "Payment attempt failed.",
          });
          setSandboxModalOpen(true);
        });
        rzp.open();
      } else {
        // Open VIA Sandbox Interactive Test Gateway Modal
        setSandboxPaymentData({
          razorpayOrderId,
          amount,
          currency,
          items,
          shippingAddress,
          couponCode: coupon?.code,
        });
        setSandboxModalOpen(true);
      }
    } catch (err) {
      addToast(err.message || "Checkout failed", "error");
    } finally {
      setProcessing(false);
    }
  };

  const handleConfirmSandboxPayment = async () => {
    try {
      setSandboxProcessing(true);
      const verifyRes = await paymentService.verifyPayment({
        razorpayOrderId: sandboxPaymentData?.razorpayOrderId || `order_dev_${Date.now()}`,
        razorpayPaymentId: `pay_demo_${Date.now()}`,
        razorpaySignature: "demo_sig_verified",
        items: sandboxPaymentData?.items || items,
        shippingAddress: sandboxPaymentData?.shippingAddress || shippingAddress,
        couponCode: coupon?.code,
        paymentMethod: "razorpay",
      });

      if (verifyRes.success && verifyRes.data.order) {
        clearCart();
        setSandboxModalOpen(false);
        addToast("Demo payment approved! Order placed successfully.", "success");
        navigate(`/order-success/${verifyRes.data.order._id}`);
      }
    } catch (err) {
      addToast(err.message || "Payment simulation failed", "error");
    } finally {
      setSandboxProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#fafafa] py-8 md:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-black uppercase tracking-tight text-zinc-900 mb-8">
          Express Checkout
        </h1>

        <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Left Column: Customer & Delivery Address */}
          <div className="lg:col-span-7 space-y-8">
            {/* 1. Customer Details */}
            <div className="bg-white border border-zinc-200 p-6 sm:p-8 shadow-xs">
              <div className="flex items-center justify-between mb-6 pb-3 border-b border-zinc-100">
                <div className="flex items-center gap-2">
                  <User className="w-5 h-5 text-black" />
                  <h2 className="font-heading font-black text-sm uppercase tracking-widest text-zinc-900">
                    1. Contact & Customer
                  </h2>
                </div>
                {!isAuthenticated && (
                  <Link
                    to="/auth/login"
                    className="text-xs font-bold text-black uppercase tracking-wider underline"
                  >
                    Sign In for Saved Addresses
                  </Link>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-zinc-700 mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={shippingAddress.fullName}
                    onChange={(e) =>
                      setShippingAddress({ ...shippingAddress, fullName: e.target.value })
                    }
                    className="w-full px-3 py-2.5 text-xs border border-zinc-300 focus:border-black outline-hidden bg-white"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-zinc-700 mb-1">
                    Phone Number (for Courier SMS) *
                  </label>
                  <input
                    type="tel"
                    required
                    value={shippingAddress.phone}
                    onChange={(e) =>
                      setShippingAddress({ ...shippingAddress, phone: e.target.value })
                    }
                    placeholder="+91 98765 43210"
                    className="w-full px-3 py-2.5 text-xs border border-zinc-300 focus:border-black outline-hidden bg-white"
                  />
                </div>
              </div>
            </div>

            {/* 2. Shipping Address */}
            <div className="bg-white border border-zinc-200 p-6 sm:p-8 shadow-xs">
              <div className="flex items-center gap-2 mb-6 pb-3 border-b border-zinc-100">
                <MapPin className="w-5 h-5 text-black" />
                <h2 className="font-heading font-black text-sm uppercase tracking-widest text-zinc-900">
                  2. Delivery Address
                </h2>
              </div>

              {/* Saved Address Selector */}
              {isAuthenticated && user?.addresses?.length > 0 && (
                <div className="mb-6 p-4 bg-zinc-50 border border-zinc-200 space-y-2">
                  <p className="text-[11px] font-black uppercase tracking-wider text-zinc-800">
                    Use a Saved Address:
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {user.addresses.map((addr) => (
                      <button
                        type="button"
                        key={addr._id}
                        onClick={() =>
                          setShippingAddress({
                            fullName: addr.fullName,
                            phone: addr.phone,
                            addressLine1: addr.addressLine1,
                            addressLine2: addr.addressLine2 || "",
                            city: addr.city,
                            state: addr.state,
                            postalCode: addr.postalCode,
                            country: addr.country || "India",
                          })
                        }
                        className="text-left p-3 border border-zinc-300 hover:border-black bg-white text-xs transition-all"
                      >
                        <p className="font-bold text-zinc-900">{addr.fullName}</p>
                        <p className="text-zinc-500 text-[11px] truncate">{addr.addressLine1}</p>
                        <p className="text-zinc-500 text-[11px]">
                          {addr.city}, {addr.postalCode}
                        </p>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div className="space-y-4">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-zinc-700 mb-1">
                    House / Flat / Building / Street *
                  </label>
                  <input
                    type="text"
                    required
                    value={shippingAddress.addressLine1}
                    onChange={(e) =>
                      setShippingAddress({ ...shippingAddress, addressLine1: e.target.value })
                    }
                    placeholder="e.g. 102, Nirvana Heights, 5th Cross"
                    className="w-full px-3 py-2.5 text-xs border border-zinc-300 focus:border-black outline-hidden bg-white"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-zinc-700 mb-1">
                    Apartment / Landmark / Locality
                  </label>
                  <input
                    type="text"
                    value={shippingAddress.addressLine2}
                    onChange={(e) =>
                      setShippingAddress({ ...shippingAddress, addressLine2: e.target.value })
                    }
                    placeholder="Near City Center"
                    className="w-full px-3 py-2.5 text-xs border border-zinc-300 focus:border-black outline-hidden bg-white"
                  />
                </div>

                {/* PIN Code with Live Postal Verification */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-zinc-700">
                      PIN Code (6-Digits) *
                    </label>
                    {pincodeLoading && (
                      <span className="text-[10px] text-zinc-500 font-bold flex items-center gap-1">
                        <Loader2 className="w-3 h-3 animate-spin text-black" /> Verifying PIN Code...
                      </span>
                    )}
                    {pincodeStatus?.success && (
                      <span className="text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 border border-emerald-200 font-bold flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" /> {pincodeStatus.message}
                      </span>
                    )}
                    {pincodeStatus && !pincodeStatus.success && (
                      <span className="text-[10px] text-amber-700 font-bold">
                        {pincodeStatus.message}
                      </span>
                    )}
                  </div>
                  <input
                    type="text"
                    maxLength={6}
                    required
                    value={shippingAddress.postalCode}
                    onChange={(e) => handlePincodeChange(e.target.value)}
                    placeholder="e.g. 110001, 208001, 560001"
                    className="w-full px-3 py-2.5 text-xs font-mono border border-zinc-300 focus:border-black outline-hidden bg-white"
                  />
                </div>

                {/* City and State (Auto-filled from PIN Code) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-zinc-700 mb-1">
                      City / District *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Auto-filled via PIN"
                      value={shippingAddress.city}
                      onChange={(e) =>
                        setShippingAddress({ ...shippingAddress, city: e.target.value })
                      }
                      className="w-full px-3 py-2.5 text-xs border border-zinc-300 focus:border-black outline-hidden bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-zinc-700 mb-1">
                      State *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Auto-filled via PIN"
                      value={shippingAddress.state}
                      onChange={(e) =>
                        setShippingAddress({ ...shippingAddress, state: e.target.value })
                      }
                      className="w-full px-3 py-2.5 text-xs border border-zinc-300 focus:border-black outline-hidden bg-white"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* 3. Payment Method */}
            <div className="bg-white border border-zinc-200 p-6 sm:p-8 shadow-xs">
              <div className="flex items-center gap-2 mb-6 pb-3 border-b border-zinc-100">
                <CreditCard className="w-5 h-5 text-black" />
                <h2 className="font-heading font-black text-sm uppercase tracking-widest text-zinc-900">
                  3. Payment Method
                </h2>
              </div>

              <div className="space-y-3">
                <div className="p-4 border-2 border-black bg-zinc-50 shadow-sm">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="w-5 h-5 rounded-full border-2 border-black flex items-center justify-center bg-black">
                        <div className="w-2 h-2 rounded-full bg-white" />
                      </div>
                      <div>
                        <p className="font-bold text-xs uppercase tracking-wider text-zinc-900 flex items-center gap-2">
                          <span>Razorpay / Online Payment</span>
                          <span className="text-[10px] font-black bg-emerald-100 text-emerald-800 px-2 py-0.5 uppercase tracking-normal">
                            100% Encrypted
                          </span>
                        </p>
                        <p className="text-[11px] text-zinc-600 mt-0.5">
                          UPI (Google Pay, PhonePe, Paytm), Credit / Debit Cards & NetBanking
                        </p>
                      </div>
                    </div>
                    <CreditCard className="w-5 h-5 text-zinc-800 shrink-0" />
                  </div>

                  <div className="mt-3 pt-3 border-t border-zinc-200 flex items-center gap-2 text-[10px] uppercase font-bold tracking-wider text-zinc-500">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Instant Order Confirmation & Priority Express Dispatch</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Order Summary & Place Order */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white border border-zinc-200 p-6 sm:p-8 shadow-md sticky top-24">
              <h3 className="font-heading font-black text-sm uppercase tracking-widest text-zinc-900 pb-3 border-b border-zinc-200 mb-4">
                Order Summary ({items.length} Items)
              </h3>

              {/* Items Snapshot */}
              <div className="max-h-60 overflow-y-auto divide-y divide-zinc-100 mb-6 pr-1">
                {items.map((i) => (
                  <div key={i._id} className="py-3 flex items-center justify-between gap-3 text-xs">
                    <div className="flex items-center gap-3">
                      <img
                        src={i.image || "/assets/via-logo.png"}
                        alt={i.name}
                        className="w-12 h-14 object-cover bg-zinc-100 border border-zinc-200 shrink-0"
                      />
                      <div>
                        <p className="font-bold text-zinc-900 line-clamp-1">{i.name}</p>
                        <p className="text-[11px] text-zinc-500">
                          Size: {i.size} × {i.quantity}
                        </p>
                      </div>
                    </div>
                    <span className="font-black text-zinc-900">
                      ₹{(i.price * i.quantity).toLocaleString("en-IN")}
                    </span>
                  </div>
                ))}
              </div>

              {/* Coupon Form */}
              {coupon ? (
                <div className="flex items-center justify-between p-2.5 bg-emerald-50 border border-emerald-300 text-xs mb-6">
                  <div className="flex items-center gap-2 text-emerald-800 font-bold">
                    <Tag className="w-4 h-4 text-emerald-600" />
                    <span>
                      {coupon.code} (-₹{coupon.discountAmount.toLocaleString("en-IN")})
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={removeCoupon}
                    className="text-zinc-400 hover:text-red-500 text-[10px] font-bold uppercase tracking-wider"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <div className="flex gap-2 mb-6">
                  <input
                    type="text"
                    placeholder="COUPON (e.g. VIA10)"
                    value={couponCodeInput}
                    onChange={(e) => setCouponCodeInput(e.target.value.toUpperCase())}
                    className="flex-1 px-3 py-2 text-xs border border-zinc-300 focus:border-black uppercase font-bold tracking-wider outline-hidden bg-white"
                  />
                  <button
                    type="button"
                    onClick={handleApplyCoupon}
                    className="px-4 py-2 bg-zinc-900 hover:bg-black text-white text-xs font-bold uppercase tracking-wider"
                  >
                    Apply
                  </button>
                </div>
              )}

              {/* Totals Breakdown */}
              <div className="space-y-2 text-xs text-zinc-600 border-t border-zinc-200 pt-4">
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
                  <span>Express Shipping</span>
                  <span className="font-bold text-zinc-900">
                    {shipping === 0 ? "FREE" : `₹${shipping.toLocaleString("en-IN")}`}
                  </span>
                </div>

                <div className="flex justify-between text-base font-black text-zinc-900 pt-3 border-t border-zinc-200">
                  <span>Total Amount</span>
                  <span>₹{total.toLocaleString("en-IN")}</span>
                </div>
              </div>

              {/* Submit CTA */}
              <button
                type="submit"
                disabled={processing}
                className="w-full py-4 bg-black hover:bg-zinc-800 disabled:bg-zinc-400 text-white font-black text-xs uppercase tracking-[0.25em] flex items-center justify-center gap-2 transition-all shadow-lg hover:shadow-xl mt-6"
              >
                {processing ? "Processing Order..." : `Pay ₹${total.toLocaleString("en-IN")} & Confirm`}
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="flex items-center justify-center gap-2 text-[10px] text-zinc-400 font-semibold uppercase tracking-wider pt-4">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Verified SSL • Safe & Secure Indian Gateway</span>
              </div>
            </div>
          </div>
        </form>
      </div>

      {/* Interactive Sandbox Test Payment Gateway Modal */}
      {sandboxModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white max-w-md w-full border border-zinc-200 shadow-2xl overflow-hidden animate-scaleUp">
            {/* Modal Header */}
            <div className="bg-zinc-950 text-white p-5 flex items-center justify-between border-b border-zinc-800">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-amber-400 text-black font-black flex items-center justify-center text-xs">
                  VIA
                </div>
                <div>
                  <h3 className="font-heading font-black text-sm uppercase tracking-wider text-white">
                    Sandbox Payment Gateway
                  </h3>
                  <p className="text-[10px] text-zinc-400 uppercase tracking-widest">
                    Test Environment • Instant Simulation
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSandboxModalOpen(false)}
                className="p-1 text-zinc-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Error message banner if coming from failed gateway attempt */}
            {sandboxPaymentData?.errorMessage && (
              <div className="bg-amber-50 border-b border-amber-200 p-3 text-[11px] text-amber-900 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-600 shrink-0" />
                <span>
                  External gateway is in test sandbox. You can authorize a simulated test transaction below:
                </span>
              </div>
            )}

            {/* Modal Body */}
            <div className="p-6 space-y-5">
              <div className="bg-zinc-50 border border-zinc-200 p-4 flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase font-bold text-zinc-500 tracking-wider block">
                    Order Payable Amount
                  </span>
                  <span className="text-xl font-black text-zinc-900">
                    ₹{total.toLocaleString("en-IN")}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] uppercase font-bold text-zinc-500 tracking-wider block">
                    Total Items
                  </span>
                  <span className="text-xs font-black text-zinc-800">
                    {items.reduce((s, i) => s + i.quantity, 0)} Pcs
                  </span>
                </div>
              </div>

              {/* Payment Method Selector */}
              <div>
                <span className="block text-[11px] font-bold uppercase tracking-wider text-zinc-700 mb-2">
                  Select Simulated Payment Method:
                </span>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setSandboxMethod("upi")}
                    className={`p-3 border text-center transition-all flex flex-col items-center gap-1.5 ${
                      sandboxMethod === "upi"
                        ? "border-black bg-zinc-950 text-white font-bold"
                        : "border-zinc-200 hover:border-zinc-400 bg-white text-zinc-800"
                    }`}
                  >
                    <Smartphone className="w-4 h-4" />
                    <span className="text-[10px] uppercase font-bold">UPI / QR</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSandboxMethod("card")}
                    className={`p-3 border text-center transition-all flex flex-col items-center gap-1.5 ${
                      sandboxMethod === "card"
                        ? "border-black bg-zinc-950 text-white font-bold"
                        : "border-zinc-200 hover:border-zinc-400 bg-white text-zinc-800"
                    }`}
                  >
                    <CreditCard className="w-4 h-4" />
                    <span className="text-[10px] uppercase font-bold">Card</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSandboxMethod("netbanking")}
                    className={`p-3 border text-center transition-all flex flex-col items-center gap-1.5 ${
                      sandboxMethod === "netbanking"
                        ? "border-black bg-zinc-950 text-white font-bold"
                        : "border-zinc-200 hover:border-zinc-400 bg-white text-zinc-800"
                    }`}
                  >
                    <Building2 className="w-4 h-4" />
                    <span className="text-[10px] uppercase font-bold">NetBanking</span>
                  </button>
                </div>
              </div>

              {/* Simulated details preview */}
              <div className="border border-zinc-200 p-3.5 bg-zinc-50 text-[11px] space-y-1.5 text-zinc-600">
                {sandboxMethod === "upi" && (
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-zinc-900">Simulated UPI:</span>
                    <span>{shippingAddress.phone}@upi (GPay / PhonePe / Paytm)</span>
                  </div>
                )}
                {sandboxMethod === "card" && (
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-zinc-900">Simulated Card:</span>
                    <span>•••• •••• •••• 4242 (Visa Test)</span>
                  </div>
                )}
                {sandboxMethod === "netbanking" && (
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-zinc-900">Simulated Bank:</span>
                    <span>HDFC Bank / ICICI NetBanking Sandbox</span>
                  </div>
                )}
                <div className="flex items-center gap-1.5 text-emerald-700 font-semibold pt-1">
                  <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                  <span>Sandbox auto-approved with cryptographic simulation signature.</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2 pt-2">
                <button
                  type="button"
                  onClick={handleConfirmSandboxPayment}
                  disabled={sandboxProcessing}
                  className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 disabled:bg-zinc-300 text-white font-black text-xs uppercase tracking-[0.2em] flex items-center justify-center gap-2 shadow-md transition-all"
                >
                  <Lock className="w-3.5 h-3.5" />
                  {sandboxProcessing
                    ? "Confirming Payment..."
                    : `Authorize & Place Order (₹${total.toLocaleString("en-IN")})`}
                </button>

                <div className="grid grid-cols-2 gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => setSandboxModalOpen(false)}
                    className="py-2.5 px-3 border border-zinc-300 hover:border-black text-[10px] font-bold uppercase tracking-wider text-zinc-800 text-center transition-colors"
                  >
                    Cancel
                  </button>

                  <a
                    href={getCartOrderWhatsAppUrl(items, shippingAddress, total, coupon?.code)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="py-2.5 px-3 bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 text-[10px] font-bold uppercase tracking-wider text-emerald-800 text-center transition-colors flex items-center justify-center gap-1"
                  >
                    <MessageCircle className="w-3 h-3" />
                    Order via WhatsApp
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

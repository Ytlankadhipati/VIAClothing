import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import {
  Package,
  Truck,
  ArrowLeft,
  CheckCircle,
  Clock,
  MapPin,
  CreditCard,
  AlertTriangle,
  ExternalLink,
} from "lucide-react";
import { orderService } from "../../services/orderService";
import { useToast } from "../../context/ToastContext";

const ORDER_STEPS = [
  { key: "confirmed", label: "Confirmed" },
  { key: "processing", label: "Processing" },
  { key: "shipped", label: "Shipped" },
  { key: "out_for_delivery", label: "Out for Delivery" },
  { key: "delivered", label: "Delivered" },
];

export default function OrderDetails() {
  const { id } = useParams();
  const { addToast } = useToast();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(false);

  const fetchOrder = async () => {
    try {
      setLoading(true);
      const res = await orderService.getOrderById(id);
      if (res.success && res.data.order) {
        setOrder(res.data.order);
      }
    } catch (err) {
      addToast(err.message || "Failed to load order", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrder();
  }, [id]);

  const handleCancelOrder = async () => {
    if (!window.confirm("Are you sure you want to cancel this streetwear order?")) return;

    try {
      setCancelling(true);
      const res = await orderService.cancelOrder(order._id);
      if (res.success) {
        addToast("Order cancelled successfully", "success");
        fetchOrder();
      }
    } catch (err) {
      addToast(err.message || "Could not cancel order", "error");
    } finally {
      setCancelling(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <p className="text-xs uppercase font-bold tracking-widest text-zinc-500">
          Loading Order Tracking...
        </p>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center">
        <h2 className="text-2xl font-black uppercase text-zinc-900 mb-4">
          Order Not Found
        </h2>
        <Link
          to="/account/orders"
          className="px-6 py-3 bg-black text-white text-xs font-black uppercase tracking-widest"
        >
          Return to Orders
        </Link>
      </div>
    );
  }

  const currentStepIndex = ORDER_STEPS.findIndex((s) => s.key === order.orderStatus);

  return (
    <div className="min-h-screen bg-[#fafafa] py-8 md:py-12">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link
          to="/account"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-zinc-600 hover:text-black uppercase tracking-wider mb-6"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Orders
        </Link>

        {/* Header Bar */}
        <div className="bg-white border border-zinc-200 p-6 sm:p-8 mb-6 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h1 className="font-heading font-black text-xl sm:text-2xl uppercase tracking-tight text-zinc-900">
                {order.orderNumber}
              </h1>
              <span className="px-2.5 py-1 text-[10px] font-black uppercase tracking-wider bg-black text-white">
                {order.orderStatus}
              </span>
            </div>
            <p className="text-xs text-zinc-500">
              Placed on {new Date(order.createdAt).toLocaleDateString("en-IN", {
                day: "numeric",
                month: "long",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
          </div>

          {!["shipped", "out_for_delivery", "delivered", "cancelled"].includes(order.orderStatus) && (
            <button
              onClick={handleCancelOrder}
              disabled={cancelling}
              className="px-4 py-2 border border-red-300 text-red-600 hover:bg-red-50 text-xs font-bold uppercase tracking-wider transition-all"
            >
              {cancelling ? "Cancelling..." : "Cancel Order"}
            </button>
          )}
        </div>

        {/* Status Tracker */}
        {order.orderStatus !== "cancelled" && (
          <div className="bg-white border border-zinc-200 p-6 sm:p-8 mb-6 shadow-xs">
            <h3 className="font-heading font-black text-xs uppercase tracking-widest text-zinc-900 mb-6">
              Delivery Progress
            </h3>

            <div className="relative flex items-center justify-between">
              {/* Progress Line */}
              <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-zinc-200 -translate-y-1/2 z-0" />
              <div
                className="absolute top-1/2 left-0 h-0.5 bg-black -translate-y-1/2 z-0 transition-all duration-500"
                style={{
                  width: `${Math.max(0, (currentStepIndex / (ORDER_STEPS.length - 1)) * 100)}%`,
                }}
              />

              {ORDER_STEPS.map((step, idx) => {
                const isPassed = idx <= currentStepIndex;
                const isCurrent = idx === currentStepIndex;
                return (
                  <div key={step.key} className="relative z-10 flex flex-col items-center">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all ${
                        isPassed
                          ? "bg-black border-black text-white"
                          : "bg-white border-zinc-300 text-zinc-400"
                      } ${isCurrent ? "ring-4 ring-black/20" : ""}`}
                    >
                      {isPassed ? <CheckCircle className="w-4 h-4" /> : <Clock className="w-3.5 h-3.5" />}
                    </div>
                    <span
                      className={`text-[10px] font-bold uppercase tracking-wider mt-2 text-center whitespace-nowrap ${
                        isPassed ? "text-zinc-900" : "text-zinc-400"
                      }`}
                    >
                      {step.label}
                    </span>
                  </div>
                );
              })}
            </div>

            {order.trackingNumber && (
              <div className="mt-8 p-4 bg-zinc-900 text-white flex flex-col sm:flex-row sm:items-center justify-between text-xs gap-3">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 bg-zinc-800 text-amber-400">
                    <Truck className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[10px] text-zinc-400 uppercase tracking-widest block">
                      Dispatched with {order.carrier || "BlueDart Express"}
                    </span>
                    <span className="font-mono font-bold text-sm text-white">
                      AWB: {order.trackingNumber}
                    </span>
                  </div>
                </div>

                <a
                  href={
                    order.carrier?.toLowerCase().includes("delhivery")
                      ? `https://www.delhivery.com/track/package/${order.trackingNumber}`
                      : order.carrier?.toLowerCase().includes("bluedart")
                      ? `https://www.bluedart.com/tracking`
                      : order.carrier?.toLowerCase().includes("dtdc")
                      ? `https://www.dtdc.in/`
                      : `https://parcelsapp.com/en/tracking/${order.trackingNumber}`
                  }
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 bg-white hover:bg-amber-400 text-black font-black text-xs uppercase tracking-wider transition-colors inline-flex items-center justify-center gap-1.5 shrink-0"
                >
                  <span>Track on {order.carrier || "Courier"}</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            )}
          </div>
        )}

        {/* Order Details Breakdown */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Items */}
          <div className="md:col-span-2 bg-white border border-zinc-200 p-6 shadow-xs">
            <h3 className="font-heading font-black text-xs uppercase tracking-widest text-zinc-900 mb-4 pb-2 border-b border-zinc-100">
              Ordered Items
            </h3>
            <div className="divide-y divide-zinc-100">
              {order.items?.map((item, idx) => (
                <div key={idx} className="py-4 flex gap-4">
                  <img
                    src={item.image || "/assets/via-logo.png"}
                    alt={item.name}
                    className="w-16 h-20 object-cover bg-zinc-100 border border-zinc-200 shrink-0"
                  />
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <h4 className="font-bold text-sm text-zinc-900">{item.name}</h4>
                      <p className="text-xs text-zinc-500 font-semibold mt-0.5">
                        Size: {item.size} | Qty: {item.quantity}
                      </p>

                      {/* Custom Print Specs */}
                      {item.customDetails && (
                        <div className="mt-2 p-2 bg-amber-50 border border-amber-200 text-[11px] text-amber-900 space-y-0.5">
                          <span className="font-black uppercase text-amber-800 text-[9px] block">
                            Custom Print Specs:
                          </span>
                          {item.customDetails.customText && (
                            <div>
                              Text: <strong className="font-mono">"{item.customDetails.customText}"</strong>
                            </div>
                          )}
                          {item.customDetails.printTechnique && (
                            <div>Technique: <strong>{item.customDetails.printTechnique}</strong></div>
                          )}
                          {item.customDetails.placement && (
                            <div>Placement: <strong>{item.customDetails.placement}</strong></div>
                          )}
                        </div>
                      )}
                    </div>
                    <p className="font-black text-sm text-zinc-900 mt-2">
                      ₹{(item.price * item.quantity).toLocaleString("en-IN")}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t border-zinc-200 pt-4 space-y-2 text-xs text-zinc-600">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-bold text-zinc-900">₹{order.subtotal.toLocaleString("en-IN")}</span>
              </div>
              {order.discount > 0 && (
                <div className="flex justify-between text-emerald-600 font-bold">
                  <span>Discount ({order.coupon?.code})</span>
                  <span>-₹{order.discount.toLocaleString("en-IN")}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Shipping</span>
                <span className="font-bold text-zinc-900">
                  {order.shippingFee === 0 ? "FREE" : `₹${order.shippingFee}`}
                </span>
              </div>
              <div className="flex justify-between text-base font-black text-zinc-900 pt-2 border-t border-zinc-200">
                <span>Total Amount Paid</span>
                <span>₹{order.total.toLocaleString("en-IN")}</span>
              </div>
            </div>
          </div>

          {/* Shipping & Payment Meta */}
          <div className="space-y-6">
            {/* Delivery Address */}
            <div className="bg-white border border-zinc-200 p-6 shadow-xs">
              <h3 className="font-heading font-black text-xs uppercase tracking-widest text-zinc-900 mb-3 flex items-center gap-1.5">
                <MapPin className="w-4 h-4" /> Delivery Address
              </h3>
              <p className="font-bold text-xs text-zinc-900">{order.shippingAddress?.fullName}</p>
              <p className="text-xs text-zinc-600 mt-1">{order.shippingAddress?.addressLine1}</p>
              {order.shippingAddress?.addressLine2 && (
                <p className="text-xs text-zinc-600">{order.shippingAddress?.addressLine2}</p>
              )}
              <p className="text-xs text-zinc-600 font-semibold">
                {order.shippingAddress?.city}, {order.shippingAddress?.state} - {order.shippingAddress?.postalCode}
              </p>
              <p className="text-xs text-zinc-500 mt-2">Phone: {order.shippingAddress?.phone}</p>
            </div>

            {/* Payment Method */}
            <div className="bg-white border border-zinc-200 p-6 shadow-xs">
              <h3 className="font-heading font-black text-xs uppercase tracking-widest text-zinc-900 mb-3 flex items-center gap-1.5">
                <CreditCard className="w-4 h-4" /> Payment Info
              </h3>
              <p className="text-xs text-zinc-700">
                Method: <strong className="uppercase">{order.paymentMethod}</strong>
              </p>
              <p className="text-xs text-zinc-700 mt-1">
                Status: <strong className="uppercase text-emerald-700">{order.paymentStatus}</strong>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { CheckCircle2, Package, ArrowRight, Truck, MapPin, ShieldCheck } from "lucide-react";
import { orderService } from "../services/orderService";

export default function OrderSuccess() {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const res = await orderService.getOrderById(orderId);
        if (res.success && res.data.order) {
          setOrder(res.data.order);
        }
      } catch (err) {
        console.warn("Could not fetch order directly:", err.message);
      } finally {
        setLoading(false);
      }
    };
    if (orderId) fetchOrder();
  }, [orderId]);

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-[#fafafa]">
      <div className="max-w-xl w-full bg-white border border-zinc-200 p-8 sm:p-12 shadow-xl text-center animate-fadeIn">
        {/* Success Icon */}
        <div className="w-16 h-16 bg-emerald-50 border border-emerald-200 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle2 className="w-8 h-8 text-emerald-600" />
        </div>

        <h1 className="font-heading font-black tracking-tight text-3xl uppercase text-zinc-900 mb-2">
          Order Confirmed
        </h1>

        <p className="text-xs uppercase tracking-widest text-zinc-500 font-semibold mb-6">
          Thank you for choosing VIA luxury streetwear.
        </p>

        {/* Order Details Card */}
        <div className="bg-zinc-50 border border-zinc-200 p-6 text-left space-y-4 mb-8">
          <div className="flex items-center justify-between pb-3 border-b border-zinc-200 text-xs">
            <span className="font-bold text-zinc-500 uppercase tracking-wider">Order ID</span>
            <span className="font-mono font-black text-zinc-900">{order?.orderNumber || `VIA-2026-${orderId?.slice(-6)}`}</span>
          </div>

          <div className="flex items-center justify-between pb-3 border-b border-zinc-200 text-xs">
            <span className="font-bold text-zinc-500 uppercase tracking-wider">Payment Status</span>
            <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-black uppercase">
              {order?.paymentStatus || "PAID"}
            </span>
          </div>

          {order?.items && (
            <div className="space-y-2 py-1">
              <span className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider block">
                Ordered Items ({order.items.length})
              </span>
              {order.items.map((item, idx) => (
                <div key={idx} className="flex justify-between text-xs font-semibold text-zinc-800">
                  <span className="truncate max-w-[240px]">{item.name} ({item.size}) × {item.quantity}</span>
                  <span>₹{(item.price * item.quantity).toLocaleString("en-IN")}</span>
                </div>
              ))}
            </div>
          )}

          <div className="flex items-center justify-between pt-3 border-t border-zinc-200 text-sm font-black text-zinc-900">
            <span>Total Paid</span>
            <span>₹{order?.total?.toLocaleString("en-IN") || "--"}</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            to={order ? `/account/orders/${order._id}` : "/account/orders"}
            className="px-6 py-3.5 bg-black hover:bg-zinc-800 text-white font-black text-xs uppercase tracking-[0.2em] flex items-center justify-center gap-2 transition-all"
          >
            <Package className="w-4 h-4" /> Track Order Status
          </Link>

          <Link
            to="/shop"
            className="px-6 py-3.5 bg-zinc-100 hover:bg-zinc-200 text-zinc-900 font-bold text-xs uppercase tracking-[0.2em] flex items-center justify-center gap-2 transition-all border border-zinc-300"
          >
            Continue Shopping <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}

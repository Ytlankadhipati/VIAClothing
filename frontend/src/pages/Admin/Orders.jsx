import React, { useState, useEffect } from "react";
import {
  Search,
  Package,
  Truck,
  CheckCircle2,
  ChevronRight,
  X,
  User,
  MapPin,
  MessageCircle,
  Phone,
  Sparkles,
  CreditCard,
  Calendar,
  ExternalLink,
} from "lucide-react";
import { adminService } from "../../services/adminService";
import { useToast } from "../../context/ToastContext";

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [updating, setUpdating] = useState(false);

  const { addToast } = useToast();

  const [editStatus, setEditStatus] = useState("confirmed");
  const [trackingNumber, setTrackingNumber] = useState("");
  const [carrier, setCarrier] = useState("BlueDart Express");

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const params = {};
      if (statusFilter !== "all") params.status = statusFilter;
      if (search) params.search = search;

      const res = await adminService.getOrders(params);
      if (res.success && res.data.orders) {
        setOrders(res.data.orders);
      }
    } catch (err) {
      addToast(err.message || "Failed to load orders", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [statusFilter, search]);

  const handleOpenDrawer = (order) => {
    setSelectedOrder(order);
    setEditStatus(order.orderStatus);
    setTrackingNumber(order.trackingNumber || "");
    setCarrier(order.carrier || "BlueDart Express");
  };

  const handleUpdateStatus = async (e) => {
    e.preventDefault();
    if (!selectedOrder) return;

    try {
      setUpdating(true);
      await adminService.updateOrderStatus(selectedOrder._id, {
        orderStatus: editStatus,
        trackingNumber,
        carrier,
      });
      addToast("Order status & tracking updated successfully", "success");
      setSelectedOrder(null);
      fetchOrders();
    } catch (err) {
      addToast(err.message || "Failed to update status", "error");
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <span className="text-[10px] uppercase font-black tracking-[0.3em] text-zinc-500">
          Fulfillment Operations
        </span>
        <h1 className="text-2xl font-black uppercase tracking-tight text-white mt-1">
          Orders Management ({orders.length})
        </h1>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto">
          {["all", "confirmed", "processing", "shipped", "delivered", "cancelled"].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 text-xs font-bold uppercase tracking-wider whitespace-nowrap transition-all ${
                statusFilter === st
                  ? "bg-white text-black font-black"
                  : "bg-zinc-900 hover:bg-zinc-800 text-zinc-400"
              }`}
            >
              {st}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search order #, customer, phone..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-zinc-900 border border-zinc-800 text-xs text-white placeholder:text-zinc-600 outline-hidden focus:border-zinc-500"
          />
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-zinc-900 border border-zinc-800 shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-zinc-800 text-zinc-400 uppercase font-black tracking-wider text-[10px] bg-zinc-950/60">
                <th className="p-4">Order #</th>
                <th className="p-4">Date</th>
                <th className="p-4">Customer</th>
                <th className="p-4">Ordered Items</th>
                <th className="p-4">Total</th>
                <th className="p-4">Payment</th>
                <th className="p-4">Fulfillment</th>
                <th className="p-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800">
              {loading ? (
                <tr>
                  <td colSpan="8" className="p-8 text-center text-zinc-500">
                    Loading orders...
                  </td>
                </tr>
              ) : orders.length === 0 ? (
                <tr>
                  <td colSpan="8" className="p-8 text-center text-zinc-500">
                    No orders matching criteria.
                  </td>
                </tr>
              ) : (
                orders.map((o) => (
                  <tr key={o._id} className="hover:bg-zinc-800/40 transition-colors">
                    <td className="p-4 font-mono font-bold text-white whitespace-nowrap">
                      {o.orderNumber}
                    </td>
                    <td className="p-4 text-zinc-400 whitespace-nowrap">
                      {new Date(o.createdAt).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                      })}
                    </td>
                    <td className="p-4">
                      <p className="font-bold text-white">
                        {o.shippingAddress?.fullName || o.user?.name || "Customer"}
                      </p>
                      <p className="text-[11px] text-zinc-500 font-mono">
                        {o.shippingAddress?.phone || o.user?.phone || "—"}
                      </p>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        {/* Thumbnail previews */}
                        <div className="flex -space-x-2 overflow-hidden shrink-0">
                          {(o.items || []).slice(0, 3).map((it, idx) => (
                            <img
                              key={idx}
                              src={it.image || "/assets/via-logo.png"}
                              alt={it.name}
                              className="inline-block h-8 w-8 object-cover border border-zinc-700 bg-zinc-950"
                            />
                          ))}
                        </div>
                        <div className="text-[11px] leading-tight">
                          <span className="font-bold text-zinc-200 block">
                            {o.items?.[0]?.name || "Item"}
                            {o.items?.length > 1 && ` +${o.items.length - 1} more`}
                          </span>
                          <span className="text-[10px] text-zinc-500">
                            {o.items?.reduce((acc, curr) => acc + (curr.quantity || 1), 0)} pcs total
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 font-black text-white whitespace-nowrap">
                      ₹{o.total?.toLocaleString("en-IN")}
                    </td>
                    <td className="p-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-0.5 text-[9px] font-black uppercase border ${
                          o.paymentStatus === "paid"
                            ? "bg-emerald-950 text-emerald-400 border-emerald-800"
                            : "bg-amber-950 text-amber-400 border-amber-800"
                        }`}
                      >
                        {o.paymentStatus} ({o.paymentMethod || "online"})
                      </span>
                    </td>
                    <td className="p-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-0.5 text-[9px] font-black uppercase ${
                          o.orderStatus === "delivered"
                            ? "bg-emerald-900 text-emerald-300"
                            : o.orderStatus === "shipped"
                            ? "bg-blue-900 text-blue-300"
                            : o.orderStatus === "cancelled"
                            ? "bg-red-900 text-red-300"
                            : "bg-zinc-800 text-zinc-300"
                        }`}
                      >
                        {o.orderStatus}
                      </span>
                    </td>
                    <td className="p-4 text-right whitespace-nowrap">
                      <button
                        onClick={() => handleOpenDrawer(o)}
                        className="px-3 py-1.5 bg-white text-black font-black text-[10px] uppercase tracking-wider hover:bg-zinc-200 transition-colors shadow-sm"
                      >
                        Manage & View
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Complete Order Details & Fulfillment Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-zinc-900 border border-zinc-800 max-w-3xl w-full my-8 p-6 sm:p-8 shadow-2xl text-zinc-100 max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 border-b border-zinc-800 mb-6">
              <div>
                <span className="text-[10px] uppercase font-black tracking-[0.25em] text-amber-400 block">
                  Order Details & Fulfillment
                </span>
                <h3 className="font-heading font-black text-xl uppercase tracking-wider text-white mt-0.5 flex items-center gap-3">
                  <span>{selectedOrder.orderNumber}</span>
                  <span
                    className={`px-2.5 py-0.5 text-[10px] font-black uppercase rounded-xs ${
                      selectedOrder.orderStatus === "delivered"
                        ? "bg-emerald-900 text-emerald-300"
                        : selectedOrder.orderStatus === "shipped"
                        ? "bg-blue-900 text-blue-300"
                        : "bg-zinc-800 text-zinc-300"
                    }`}
                  >
                    {selectedOrder.orderStatus}
                  </span>
                </h3>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="p-1 text-zinc-400 hover:text-white transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-6">
              {/* Left Column: Ordered Items List */}
              <div className="lg:col-span-7 space-y-4">
                <h4 className="font-heading font-black text-xs uppercase tracking-widest text-zinc-400 flex items-center gap-2 border-b border-zinc-800 pb-2">
                  <Package className="w-4 h-4 text-white" />
                  Ordered Items ({selectedOrder.items?.length || 0})
                </h4>

                <div className="space-y-3">
                  {(selectedOrder.items || []).map((item, idx) => (
                    <div
                      key={idx}
                      className="bg-zinc-950 border border-zinc-800 p-3.5 flex gap-3.5 items-start"
                    >
                      {/* Product Thumbnail */}
                      <img
                        src={item.image || "/assets/via-logo.png"}
                        alt={item.name}
                        className="w-16 h-20 object-cover bg-black shrink-0 border border-zinc-800"
                      />

                      <div className="flex-1 min-w-0">
                        <h5 className="font-bold text-xs text-white leading-tight truncate">
                          {item.name}
                        </h5>

                        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-zinc-400 mt-1">
                          <span>
                            Size: <strong className="text-white">{item.size}</strong>
                          </span>
                          <span>
                            Color: <strong className="text-white">{item.color || "Standard"}</strong>
                          </span>
                          <span>
                            Qty: <strong className="text-white">{item.quantity}</strong>
                          </span>
                        </div>

                        <div className="text-xs font-black text-white mt-1.5">
                          ₹{item.price?.toLocaleString("en-IN")}{" "}
                          <span className="text-[10px] text-zinc-500 font-normal">
                            (Total: ₹{((item.price || 0) * (item.quantity || 1)).toLocaleString("en-IN")})
                          </span>
                        </div>

                        {/* Custom Print Specifications Box (If customized) */}
                        {item.customDetails && (
                          <div className="mt-2.5 p-2.5 bg-amber-950/40 border border-amber-500/40 text-[10px] text-amber-200 space-y-1">
                            <div className="flex items-center gap-1.5 font-black uppercase text-amber-400 tracking-wider">
                              <Sparkles className="w-3 h-3" />
                              <span>Custom Print Specs:</span>
                            </div>
                            {item.customDetails.customText && (
                              <div>
                                Custom Text:{" "}
                                <strong className="text-white font-mono bg-black/60 px-1 py-0.5">
                                  "{item.customDetails.customText}"
                                </strong>
                              </div>
                            )}
                            {item.customDetails.placement && (
                              <div>
                                Placement: <strong>{item.customDetails.placement}</strong>
                              </div>
                            )}
                            {item.customDetails.printTechnique && (
                              <div>
                                Technique: <strong>{item.customDetails.printTechnique}</strong>
                              </div>
                            )}
                            {item.customDetails.font && (
                              <div>
                                Typography Font: <strong>{item.customDetails.font}</strong>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Price Breakdown */}
                <div className="bg-zinc-950 border border-zinc-800 p-4 text-xs space-y-2">
                  <div className="flex justify-between text-zinc-400">
                    <span>Subtotal</span>
                    <span className="font-bold text-white">
                      ₹{selectedOrder.subtotal?.toLocaleString("en-IN")}
                    </span>
                  </div>
                  {selectedOrder.discount > 0 && (
                    <div className="flex justify-between text-emerald-400">
                      <span>Discount ({selectedOrder.coupon?.code || "Promo"})</span>
                      <span>-₹{selectedOrder.discount?.toLocaleString("en-IN")}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-zinc-400">
                    <span>Shipping</span>
                    <span className="font-bold text-white">
                      {selectedOrder.shippingFee === 0
                        ? "FREE"
                        : `₹${selectedOrder.shippingFee?.toLocaleString("en-IN")}`}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm font-black text-white pt-2 border-t border-zinc-800">
                    <span>Grand Total</span>
                    <span>₹{selectedOrder.total?.toLocaleString("en-IN")}</span>
                  </div>
                </div>
              </div>

              {/* Right Column: Customer Details & Shipping */}
              <div className="lg:col-span-5 space-y-4">
                {/* Customer Information */}
                <div className="bg-zinc-950 border border-zinc-800 p-4 space-y-3">
                  <h4 className="font-heading font-black text-xs uppercase tracking-widest text-zinc-400 flex items-center gap-2 border-b border-zinc-800 pb-2">
                    <User className="w-4 h-4 text-white" />
                    Customer Details
                  </h4>

                  <div className="text-xs space-y-1.5">
                    <p className="font-bold text-sm text-white">
                      {selectedOrder.shippingAddress?.fullName || selectedOrder.user?.name}
                    </p>
                    <p className="text-zinc-400">
                      Email:{" "}
                      <span className="text-white">
                        {selectedOrder.user?.email || "customer@viaclothing.in"}
                      </span>
                    </p>
                    <p className="text-zinc-400">
                      Phone:{" "}
                      <span className="text-white font-mono">
                        {selectedOrder.shippingAddress?.phone || selectedOrder.user?.phone || "—"}
                      </span>
                    </p>

                    {/* WhatsApp Customer Action */}
                    {selectedOrder.shippingAddress?.phone && (
                      <div className="pt-2">
                        <a
                          href={`https://wa.me/${selectedOrder.shippingAddress.phone.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(
                            `Hi ${selectedOrder.shippingAddress.fullName}, this is from VIA Clothing regarding your Order #${selectedOrder.orderNumber}.`
                          )}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-[11px] font-bold uppercase tracking-wider rounded-xs transition-colors"
                        >
                          <MessageCircle className="w-3.5 h-3.5" />
                          Chat on WhatsApp
                        </a>
                      </div>
                    )}
                  </div>
                </div>

                {/* Delivery Address */}
                <div className="bg-zinc-950 border border-zinc-800 p-4 space-y-2">
                  <h4 className="font-heading font-black text-xs uppercase tracking-widest text-zinc-400 flex items-center gap-2 border-b border-zinc-800 pb-2">
                    <MapPin className="w-4 h-4 text-white" />
                    Delivery Address
                  </h4>

                  <div className="text-xs text-zinc-300 leading-relaxed">
                    <p>{selectedOrder.shippingAddress?.addressLine1}</p>
                    {selectedOrder.shippingAddress?.addressLine2 && (
                      <p>{selectedOrder.shippingAddress?.addressLine2}</p>
                    )}
                    {selectedOrder.shippingAddress?.landmark && (
                      <p className="text-zinc-500">
                        Landmark: {selectedOrder.shippingAddress?.landmark}
                      </p>
                    )}
                    <p className="font-bold text-white mt-1">
                      {selectedOrder.shippingAddress?.city},{" "}
                      {selectedOrder.shippingAddress?.state} —{" "}
                      {selectedOrder.shippingAddress?.postalCode}
                    </p>
                    <p className="text-zinc-500 uppercase">{selectedOrder.shippingAddress?.country || "India"}</p>
                  </div>
                </div>

                {/* Payment Snapshot */}
                <div className="bg-zinc-950 border border-zinc-800 p-4 space-y-2">
                  <h4 className="font-heading font-black text-xs uppercase tracking-widest text-zinc-400 flex items-center gap-2 border-b border-zinc-800 pb-2">
                    <CreditCard className="w-4 h-4 text-white" />
                    Payment Information
                  </h4>

                  <div className="text-xs space-y-1">
                    <p className="text-zinc-400">
                      Method:{" "}
                      <strong className="text-white uppercase font-bold">
                        {selectedOrder.paymentMethod === "whatsapp" ? "WhatsApp Order (Prepaid)" : "Online / Razorpay"}
                      </strong>
                    </p>
                    <p className="text-zinc-400">
                      Payment Status:{" "}
                      <span
                        className={`font-black uppercase ${
                          selectedOrder.paymentStatus === "paid" ? "text-emerald-400" : "text-amber-400"
                        }`}
                      >
                        {selectedOrder.paymentStatus}
                      </span>
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Status & Fulfillment Form */}
            <form
              onSubmit={handleUpdateStatus}
              className="bg-zinc-950 border border-zinc-800 p-5 space-y-4"
            >
              <h4 className="font-heading font-black text-xs uppercase tracking-widest text-amber-400 flex items-center gap-2">
                <Truck className="w-4 h-4 text-amber-400" />
                Update Dispatch & Tracking
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                <div>
                  <label className="block font-bold uppercase tracking-wider text-zinc-400 mb-1">
                    Order Status
                  </label>
                  <select
                    value={editStatus}
                    onChange={(e) => setEditStatus(e.target.value)}
                    className="w-full px-3 py-2 bg-zinc-900 border border-zinc-700 text-white font-bold uppercase outline-hidden focus:border-white"
                  >
                    <option value="confirmed">Confirmed</option>
                    <option value="processing">Processing (In Production / Packing)</option>
                    <option value="shipped">Shipped (In Transit)</option>
                    <option value="out_for_delivery">Out for Delivery</option>
                    <option value="delivered">Delivered</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold uppercase tracking-wider text-zinc-400 mb-1">
                    Courier Carrier
                  </label>
                  <input
                    type="text"
                    value={carrier}
                    onChange={(e) => setCarrier(e.target.value)}
                    placeholder="BlueDart / Delhivery / DTDC"
                    className="w-full px-3 py-2 bg-zinc-900 border border-zinc-700 text-white outline-hidden focus:border-white"
                  />
                </div>

                <div>
                  <label className="block font-bold uppercase tracking-wider text-zinc-400 mb-1">
                    Tracking Number / AWB
                  </label>
                  <input
                    type="text"
                    value={trackingNumber}
                    onChange={(e) => setTrackingNumber(e.target.value)}
                    placeholder="e.g. BD98492048IN"
                    className="w-full px-3 py-2 bg-zinc-900 border border-zinc-700 text-white font-mono outline-hidden focus:border-white"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-zinc-800">
                <button
                  type="button"
                  onClick={() => setSelectedOrder(null)}
                  className="px-4 py-2 border border-zinc-700 text-zinc-300 font-bold uppercase tracking-wider hover:bg-zinc-900"
                >
                  Close
                </button>
                <button
                  type="submit"
                  disabled={updating}
                  className="px-6 py-2 bg-white text-black font-black uppercase tracking-wider hover:bg-zinc-200 transition-colors"
                >
                  {updating ? "Updating..." : "Save Status & Tracking"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

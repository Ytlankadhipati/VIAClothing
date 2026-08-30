import React, { useState, useEffect } from "react";
import { Plus, Trash2, Tag, Percent } from "lucide-react";
import { adminService } from "../../services/adminService";
import { useToast } from "../../context/ToastContext";

export default function AdminCoupons() {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const { addToast } = useToast();

  const [formData, setFormData] = useState({
    code: "",
    type: "percentage",
    value: 10,
    minimumOrderValue: 999,
    maximumDiscount: 500,
    usageLimit: 500,
    expiryDate: new Date(Date.now() + 60 * 86400000).toISOString().split("T")[0],
  });

  const fetchCoupons = async () => {
    try {
      setLoading(true);
      const res = await adminService.getCoupons();
      if (res.success && res.data.coupons) {
        setCoupons(res.data.coupons);
      }
    } catch (err) {
      addToast(err.message || "Failed to load coupons", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCoupons();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await adminService.createCoupon(formData);
      addToast(`Coupon '${formData.code.toUpperCase()}' created!`, "success");
      setShowModal(false);
      setFormData({
        code: "",
        type: "percentage",
        value: 10,
        minimumOrderValue: 999,
        maximumDiscount: 500,
        usageLimit: 500,
        expiryDate: new Date(Date.now() + 60 * 86400000).toISOString().split("T")[0],
      });
      fetchCoupons();
    } catch (err) {
      addToast(err.message || "Failed to create coupon", "error");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this coupon?")) return;
    try {
      await adminService.deleteCoupon(id);
      addToast("Coupon deleted", "info");
      fetchCoupons();
    } catch (err) {
      addToast(err.message || "Failed to delete coupon", "error");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <span className="text-[10px] uppercase font-black tracking-[0.3em] text-zinc-500">
            Promotions & Campaigns
          </span>
          <h1 className="text-2xl font-black uppercase tracking-tight text-white mt-1">
            Discount Coupons ({coupons.length})
          </h1>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="px-5 py-2.5 bg-white hover:bg-zinc-200 text-black text-xs font-black uppercase tracking-wider flex items-center gap-2 transition-all shadow-md"
        >
          <Plus className="w-4 h-4" /> Create Coupon
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {loading ? (
          <div className="col-span-3 py-12 text-center text-xs text-zinc-500">
            Loading Coupons...
          </div>
        ) : coupons.length === 0 ? (
          <div className="col-span-3 bg-zinc-900 border border-zinc-800 p-8 text-center text-xs text-zinc-500">
            No active promotional coupons. Click "Create Coupon" to add one.
          </div>
        ) : (
          coupons.map((c) => (
            <div
              key={c._id}
              className="bg-zinc-900 border border-zinc-800 p-6 flex flex-col justify-between shadow-md relative"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-mono font-black text-lg text-white tracking-wider">
                    {c.code}
                  </span>
                  <span className="px-2 py-0.5 bg-emerald-950 text-emerald-400 border border-emerald-800 text-[10px] font-black uppercase">
                    {c.type === "percentage" ? `${c.value}% OFF` : `₹${c.value} FLAT`}
                  </span>
                </div>

                <div className="text-xs text-zinc-400 space-y-1 mt-3">
                  <p>Min Order Value: <strong>₹{c.minimumOrderValue || 0}</strong></p>
                  {c.maximumDiscount && <p>Max Discount: <strong>₹{c.maximumDiscount}</strong></p>}
                  <p>Used: <strong>{c.usedCount || 0}</strong> / {c.usageLimit}</p>
                  <p className="text-[11px] text-zinc-500 pt-1">
                    Expires: {new Date(c.expiryDate).toLocaleDateString("en-IN")}
                  </p>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-zinc-800 flex justify-end">
                <button
                  onClick={() => handleDelete(c._id)}
                  className="text-xs font-bold text-red-400 hover:text-red-300 flex items-center gap-1 uppercase tracking-wider"
                >
                  <Trash2 className="w-3.5 h-3.5" /> Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Create Coupon Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-zinc-900 border border-zinc-800 max-w-md w-full p-6 text-zinc-100 shadow-2xl">
            <h3 className="font-heading font-black text-base uppercase tracking-wider text-white mb-4 pb-2 border-b border-zinc-800">
              Create Promotional Coupon
            </h3>

            <form onSubmit={handleCreate} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold uppercase tracking-wider text-zinc-400 mb-1">
                  Coupon Code *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. VIP20"
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                  className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 text-white font-mono uppercase outline-hidden"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold uppercase tracking-wider text-zinc-400 mb-1">
                    Type
                  </label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 text-white outline-hidden"
                  >
                    <option value="percentage">Percentage (%)</option>
                    <option value="fixed">Flat Amount (₹)</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold uppercase tracking-wider text-zinc-400 mb-1">
                    Discount Value *
                  </label>
                  <input
                    type="number"
                    required
                    value={formData.value}
                    onChange={(e) => setFormData({ ...formData, value: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 text-white outline-hidden"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold uppercase tracking-wider text-zinc-400 mb-1">
                    Min Order Value (₹)
                  </label>
                  <input
                    type="number"
                    value={formData.minimumOrderValue}
                    onChange={(e) =>
                      setFormData({ ...formData, minimumOrderValue: Number(e.target.value) })
                    }
                    className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 text-white outline-hidden"
                  />
                </div>
                <div>
                  <label className="block font-bold uppercase tracking-wider text-zinc-400 mb-1">
                    Max Discount (₹)
                  </label>
                  <input
                    type="number"
                    value={formData.maximumDiscount}
                    onChange={(e) =>
                      setFormData({ ...formData, maximumDiscount: Number(e.target.value) })
                    }
                    className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 text-white outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold uppercase tracking-wider text-zinc-400 mb-1">
                  Expiry Date
                </label>
                <input
                  type="date"
                  required
                  value={formData.expiryDate}
                  onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
                  className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 text-white outline-hidden"
                />
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-zinc-800">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 border border-zinc-700 text-zinc-300 font-bold uppercase tracking-wider"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-white text-black font-black uppercase tracking-wider"
                >
                  Create Coupon
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

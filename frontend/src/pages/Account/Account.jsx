import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  User,
  Package,
  MapPin,
  Lock,
  LogOut,
  ChevronRight,
  ShieldCheck,
  Plus,
  Trash2,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";
import { orderService } from "../../services/orderService";
import { authService } from "../../services/authService";

export default function Account() {
  const { user, isAuthenticated, logout, updateProfile, addAddress, deleteAddress } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("orders"); // 'orders' | 'addresses' | 'profile'
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(true);

  // Profile Form
  const [name, setName] = useState(user?.name || "");
  const [phone, setPhone] = useState(user?.phone || "");
  const [savingProfile, setSavingProfile] = useState(false);

  // Password Form
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [savingPassword, setSavingPassword] = useState(false);

  // Add Address Form
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [newAddress, setNewAddress] = useState({
    fullName: "",
    phone: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    postalCode: "",
    country: "India",
  });

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/auth/login");
      return;
    }

    if (user) {
      setName(user.name);
      setPhone(user.phone || "");
    }

    const fetchOrders = async () => {
      try {
        setLoadingOrders(true);
        const res = await orderService.getMyOrders();
        if (res.success && res.data.orders) {
          setOrders(res.data.orders);
        }
      } catch (err) {
        console.warn("Could not load customer orders:", err.message);
      } finally {
        setLoadingOrders(false);
      }
    };

    fetchOrders();
  }, [isAuthenticated, user, navigate]);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    try {
      setSavingProfile(true);
      await updateProfile({ name, phone });
      addToast("Profile details updated", "success");
    } catch (err) {
      addToast(err.message || "Failed to update profile", "error");
    } finally {
      setSavingProfile(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (!currentPassword || !newPassword) return;

    try {
      setSavingPassword(true);
      await authService.changePassword({ currentPassword, newPassword });
      addToast("Password changed successfully", "success");
      setCurrentPassword("");
      setNewPassword("");
    } catch (err) {
      addToast(err.message || "Failed to change password", "error");
    } finally {
      setSavingPassword(false);
    }
  };

  const handleAddAddress = async (e) => {
    e.preventDefault();
    try {
      await addAddress(newAddress);
      addToast("Address added successfully", "success");
      setShowAddressModal(false);
      setNewAddress({
        fullName: "",
        phone: "",
        addressLine1: "",
        addressLine2: "",
        city: "",
        state: "",
        postalCode: "",
        country: "India",
      });
    } catch (err) {
      addToast(err.message || "Failed to add address", "error");
    }
  };

  const getStatusBadge = (status) => {
    const map = {
      confirmed: "bg-blue-50 text-blue-800 border-blue-200",
      processing: "bg-amber-50 text-amber-800 border-amber-200",
      shipped: "bg-purple-50 text-purple-800 border-purple-200",
      delivered: "bg-emerald-50 text-emerald-800 border-emerald-200",
      cancelled: "bg-red-50 text-red-800 border-red-200",
    };
    return (
      <span
        className={`px-2.5 py-1 text-[10px] font-black uppercase tracking-wider border ${
          map[status] || "bg-zinc-100 text-zinc-800 border-zinc-200"
        }`}
      >
        {status}
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-[#fafafa] py-8 md:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* User Header */}
        <div className="bg-white border border-zinc-200 p-6 sm:p-8 mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xs">
          <div>
            <span className="text-[10px] font-black uppercase tracking-[0.25em] text-zinc-500">
              VIA Streetwear Member
            </span>
            <h1 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-zinc-900 mt-1">
              {user?.name}
            </h1>
            <p className="text-xs text-zinc-500 font-semibold">{user?.email}</p>
          </div>

          <button
            onClick={logout}
            className="flex items-center gap-1.5 px-4 py-2 border border-zinc-300 hover:border-black text-xs font-bold uppercase tracking-wider text-zinc-700 hover:text-black transition-all"
          >
            <LogOut className="w-3.5 h-3.5" /> Sign Out
          </button>
        </div>

        {/* Admin Quick Action Banner */}
        {user?.role === "admin" && (
          <div className="mb-8 p-5 bg-zinc-900 border border-zinc-800 text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-lg">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <p className="font-bold text-sm uppercase tracking-wider">
                  Administrator Portal Active
                </p>
                <p className="text-xs text-zinc-400 mt-0.5">
                  Looking for all store customer orders & fulfillment? Open the dedicated Admin Portal.
                </p>
              </div>
            </div>

            <Link
              to="/admin/orders"
              className="px-5 py-2.5 bg-white hover:bg-zinc-200 text-black font-black text-xs uppercase tracking-widest flex items-center gap-1.5 whitespace-nowrap transition-all shadow-md"
            >
              View All Store Orders ({">"})
            </Link>
          </div>
        )}

        {/* Navigation Tabs */}
        <div className="flex border-b border-zinc-200 mb-8 overflow-x-auto">
          <button
            onClick={() => setActiveTab("orders")}
            className={`py-3 px-6 text-xs font-black uppercase tracking-widest border-b-2 whitespace-nowrap transition-all flex items-center gap-2 ${
              activeTab === "orders"
                ? "border-black text-black"
                : "border-transparent text-zinc-400 hover:text-black"
            }`}
          >
            <Package className="w-4 h-4" /> My Orders ({orders.length})
          </button>

          <button
            onClick={() => setActiveTab("addresses")}
            className={`py-3 px-6 text-xs font-black uppercase tracking-widest border-b-2 whitespace-nowrap transition-all flex items-center gap-2 ${
              activeTab === "addresses"
                ? "border-black text-black"
                : "border-transparent text-zinc-400 hover:text-black"
            }`}
          >
            <MapPin className="w-4 h-4" /> Saved Addresses ({user?.addresses?.length || 0})
          </button>

          <button
            onClick={() => setActiveTab("profile")}
            className={`py-3 px-6 text-xs font-black uppercase tracking-widest border-b-2 whitespace-nowrap transition-all flex items-center gap-2 ${
              activeTab === "profile"
                ? "border-black text-black"
                : "border-transparent text-zinc-400 hover:text-black"
            }`}
          >
            <User className="w-4 h-4" /> Profile & Security
          </button>
        </div>

        {/* Tab 1: Orders */}
        {activeTab === "orders" && (
          <div className="space-y-4">
            {loadingOrders ? (
              <div className="p-12 text-center text-xs font-bold uppercase text-zinc-500 tracking-wider">
                Loading Orders...
              </div>
            ) : orders.length === 0 ? (
              <div className="bg-white border border-zinc-200 p-12 text-center space-y-4">
                <Package className="w-12 h-12 text-zinc-400 mx-auto" />
                <h3 className="text-lg font-black uppercase text-zinc-900">
                  No orders yet
                </h3>
                <p className="text-xs text-zinc-500 uppercase tracking-widest">
                  When you purchase streetwear drops, they will appear here with live tracking.
                </p>
                <Link
                  to="/shop"
                  className="inline-block px-6 py-3 bg-black text-white text-xs font-black uppercase tracking-widest hover:bg-zinc-800"
                >
                  Explore Drops
                </Link>
              </div>
            ) : (
              orders.map((order) => (
                <div
                  key={order._id}
                  className="bg-white border border-zinc-200 p-6 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-6"
                >
                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      <span className="font-mono font-black text-sm text-zinc-900">
                        {order.orderNumber}
                      </span>
                      {getStatusBadge(order.orderStatus)}
                    </div>

                    <p className="text-xs text-zinc-500">
                      Placed on {new Date(order.createdAt).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </p>

                    <div className="flex items-center gap-3 pt-2">
                      {order.items?.slice(0, 3).map((item, idx) => (
                        <img
                          key={idx}
                          src={item.image || "/assets/via-logo.png"}
                          alt={item.name}
                          className="w-12 h-14 object-cover bg-zinc-100 border border-zinc-200"
                          title={item.name}
                        />
                      ))}
                      {order.items?.length > 3 && (
                        <span className="text-xs font-bold text-zinc-500">
                          +{order.items.length - 3} more
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row md:flex-col items-end justify-between gap-3 w-full md:w-auto border-t md:border-t-0 pt-4 md:pt-0 border-zinc-100">
                    <span className="text-base font-black text-zinc-900">
                      ₹{order.total.toLocaleString("en-IN")}
                    </span>

                    <Link
                      to={`/account/orders/${order._id}`}
                      className="px-5 py-2.5 bg-black hover:bg-zinc-800 text-white font-black text-[11px] uppercase tracking-widest flex items-center gap-1.5 transition-all shadow-xs"
                    >
                      View Details & Tracking <ChevronRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Tab 2: Addresses */}
        {activeTab === "addresses" && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-sm font-black uppercase tracking-wider text-zinc-900">
                Delivery Addresses
              </h3>
              <button
                onClick={() => setShowAddressModal(true)}
                className="px-4 py-2 bg-black hover:bg-zinc-800 text-white text-xs font-bold uppercase tracking-wider flex items-center gap-1.5"
              >
                <Plus className="w-3.5 h-3.5" /> Add New Address
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {user?.addresses?.length === 0 ? (
                <div className="col-span-2 bg-white border border-zinc-200 p-8 text-center text-xs text-zinc-500">
                  No saved addresses found. Add an address for 1-click checkout.
                </div>
              ) : (
                user?.addresses?.map((addr) => (
                  <div
                    key={addr._id}
                    className="bg-white border border-zinc-200 p-6 shadow-xs relative flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-bold text-sm text-zinc-900">{addr.fullName}</span>
                        {addr.isDefault && (
                          <span className="text-[9px] font-black bg-zinc-100 text-zinc-800 px-2 py-0.5 uppercase border border-zinc-300">
                            Default
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-zinc-600 leading-relaxed">{addr.addressLine1}</p>
                      {addr.addressLine2 && (
                        <p className="text-xs text-zinc-600 leading-relaxed">{addr.addressLine2}</p>
                      )}
                      <p className="text-xs text-zinc-600 font-semibold mt-1">
                        {addr.city}, {addr.state} - {addr.postalCode}
                      </p>
                      <p className="text-xs text-zinc-500 mt-2">Phone: {addr.phone}</p>
                    </div>

                    <div className="mt-4 pt-3 border-t border-zinc-100 flex justify-end">
                      <button
                        onClick={() => deleteAddress(addr._id)}
                        className="text-xs font-bold text-red-600 hover:text-red-800 flex items-center gap-1 uppercase tracking-wider"
                      >
                        <Trash2 className="w-3.5 h-3.5" /> Remove
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Address Modal */}
            {showAddressModal && (
              <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
                <div className="bg-white max-w-lg w-full p-6 sm:p-8 border border-zinc-200 shadow-2xl">
                  <h3 className="font-black text-base uppercase tracking-widest text-zinc-900 mb-4 pb-2 border-b border-zinc-200">
                    Add Delivery Address
                  </h3>
                  <form onSubmit={handleAddAddress} className="space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                      <input
                        type="text"
                        placeholder="Full Name *"
                        required
                        value={newAddress.fullName}
                        onChange={(e) =>
                          setNewAddress({ ...newAddress, fullName: e.target.value })
                        }
                        className="px-3 py-2 text-xs border border-zinc-300 outline-hidden"
                      />
                      <input
                        type="tel"
                        placeholder="Phone Number *"
                        required
                        value={newAddress.phone}
                        onChange={(e) =>
                          setNewAddress({ ...newAddress, phone: e.target.value })
                        }
                        className="px-3 py-2 text-xs border border-zinc-300 outline-hidden"
                      />
                    </div>
                    <input
                      type="text"
                      placeholder="Address Line 1 (Flat, House No, Street) *"
                      required
                      value={newAddress.addressLine1}
                      onChange={(e) =>
                        setNewAddress({ ...newAddress, addressLine1: e.target.value })
                      }
                      className="w-full px-3 py-2 text-xs border border-zinc-300 outline-hidden"
                    />
                    <input
                      type="text"
                      placeholder="Address Line 2 (Area, Landmark)"
                      value={newAddress.addressLine2}
                      onChange={(e) =>
                        setNewAddress({ ...newAddress, addressLine2: e.target.value })
                      }
                      className="w-full px-3 py-2 text-xs border border-zinc-300 outline-hidden"
                    />
                    <div className="grid grid-cols-3 gap-3">
                      <input
                        type="text"
                        placeholder="City *"
                        required
                        value={newAddress.city}
                        onChange={(e) =>
                          setNewAddress({ ...newAddress, city: e.target.value })
                        }
                        className="px-3 py-2 text-xs border border-zinc-300 outline-hidden"
                      />
                      <input
                        type="text"
                        placeholder="State *"
                        required
                        value={newAddress.state}
                        onChange={(e) =>
                          setNewAddress({ ...newAddress, state: e.target.value })
                        }
                        className="px-3 py-2 text-xs border border-zinc-300 outline-hidden"
                      />
                      <input
                        type="text"
                        placeholder="PIN Code *"
                        required
                        value={newAddress.postalCode}
                        onChange={(e) =>
                          setNewAddress({ ...newAddress, postalCode: e.target.value })
                        }
                        className="px-3 py-2 text-xs border border-zinc-300 outline-hidden"
                      />
                    </div>

                    <div className="flex justify-end gap-2 pt-4">
                      <button
                        type="button"
                        onClick={() => setShowAddressModal(false)}
                        className="px-4 py-2 border border-zinc-300 text-xs font-bold uppercase tracking-wider"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-6 py-2 bg-black text-white text-xs font-black uppercase tracking-wider"
                      >
                        Save Address
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Tab 3: Profile & Security */}
        {activeTab === "profile" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Profile Information */}
            <div className="bg-white border border-zinc-200 p-6 sm:p-8 shadow-xs">
              <h3 className="font-heading font-black text-sm uppercase tracking-widest text-zinc-900 mb-6 pb-2 border-b border-zinc-100">
                Personal Information
              </h3>
              <form onSubmit={handleUpdateProfile} className="space-y-4">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-zinc-700 mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-zinc-300 outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-zinc-700 mb-1">
                    Email Address (Read-only)
                  </label>
                  <input
                    type="email"
                    disabled
                    value={user?.email || ""}
                    className="w-full px-3 py-2 text-xs border border-zinc-200 bg-zinc-50 text-zinc-500 cursor-not-allowed"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-zinc-700 mb-1">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-zinc-300 outline-hidden"
                  />
                </div>

                <button
                  type="submit"
                  disabled={savingProfile}
                  className="px-6 py-3 bg-black hover:bg-zinc-800 text-white text-xs font-black uppercase tracking-widest"
                >
                  {savingProfile ? "Saving..." : "Save Changes"}
                </button>
              </form>
            </div>

            {/* Change Password */}
            <div className="bg-white border border-zinc-200 p-6 sm:p-8 shadow-xs">
              <h3 className="font-heading font-black text-sm uppercase tracking-widest text-zinc-900 mb-6 pb-2 border-b border-zinc-100">
                Change Password
              </h3>
              <form onSubmit={handleChangePassword} className="space-y-4">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-zinc-700 mb-1">
                    Current Password
                  </label>
                  <input
                    type="password"
                    required
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-zinc-300 outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-zinc-700 mb-1">
                    New Password (Min. 6 chars)
                  </label>
                  <input
                    type="password"
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-zinc-300 outline-hidden"
                  />
                </div>

                <button
                  type="submit"
                  disabled={savingPassword}
                  className="px-6 py-3 bg-black hover:bg-zinc-800 text-white text-xs font-black uppercase tracking-widest"
                >
                  {savingPassword ? "Updating..." : "Update Password"}
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

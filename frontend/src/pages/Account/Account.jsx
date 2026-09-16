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
  Eye,
  EyeOff,
  CheckCircle2,
  CreditCard,
  Gift,
  Heart,
  Bell,
  FileText,
  HelpCircle,
  AlertTriangle,
  Sparkles,
  Camera,
  Check,
  Tag,
  Star,
  Loader2,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";
import { orderService } from "../../services/orderService";
import { authService } from "../../services/authService";
import { fetchCityStateFromPincode } from "../../utils/pincodeHelper";
import OtpVerificationModal from "../../components/OtpVerificationModal";

export default function Account() {
  const { user, isAuthenticated, logout, updateProfile, addAddress, deleteAddress } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();

  // Active Tab: 'profile' | 'orders' | 'addresses' | 'pan' | 'wallet' | 'coupons' | 'reviews' | 'notifications'
  const [activeTab, setActiveTab] = useState("profile");
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(true);

  // Profile Form (Flipkart Style: First Name, Last Name, Gender, Phone)
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [gender, setGender] = useState("male");
  const [phone, setPhone] = useState("");
  const [isEditingPersonal, setIsEditingPersonal] = useState(false);
  const [savingProfile, setSavingProfile] = useState(false);

  // Password Form
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
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
  const [pincodeLoading, setPincodeLoading] = useState(false);
  const [pincodeStatus, setPincodeStatus] = useState(null);

  const handlePincodeChange = async (val) => {
    const clean = val.replace(/\D/g, "").slice(0, 6);
    setNewAddress((prev) => ({ ...prev, postalCode: clean }));

    if (clean.length === 6) {
      setPincodeLoading(true);
      setPincodeStatus(null);
      const res = await fetchCityStateFromPincode(clean);
      setPincodeLoading(false);
      if (res && res.success) {
        setNewAddress((prev) => ({
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

  // PAN Card Form (Flipkart Regulatory section)
  const [panNumber, setPanNumber] = useState("");
  const [panName, setPanName] = useState("");
  const [panAccepted, setPanAccepted] = useState(false);

  // Gift Card Form (Flipkart Wallet)
  const [giftCardCode, setGiftCardCode] = useState("");
  const [giftCardPin, setGiftCardPin] = useState("");
  const [walletBalance, setWalletBalance] = useState(250); // Default VIA SuperCoins / Wallet

  // Deactivate Modal
  const [showDeactivateModal, setShowDeactivateModal] = useState(false);
  // Email OTP Modal
  const [showOtpModal, setShowOtpModal] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/auth/login");
      return;
    }

    if (user) {
      const parts = (user.name || "").trim().split(" ");
      setFirstName(parts[0] || "");
      setLastName(parts.slice(1).join(" ") || "");
      setPhone(user.phone || "");
      if (user.gender) setGender(user.gender);
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
    if (e) e.preventDefault();
    if (!firstName.trim()) {
      addToast("First name is required", "error");
      return;
    }

    try {
      setSavingProfile(true);
      const fullName = `${firstName.trim()} ${lastName.trim()}`.trim();
      await updateProfile({ name: fullName, phone, gender });
      addToast("Personal details updated successfully", "success");
      setIsEditingPersonal(false);
    } catch (err) {
      addToast(err.message || "Failed to update profile", "error");
    } finally {
      setSavingProfile(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (!currentPassword || !newPassword) {
      addToast("Please fill both password fields", "error");
      return;
    }
    if (newPassword.length < 6) {
      addToast("New password must be at least 6 characters", "error");
      return;
    }

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
      addToast("Delivery address added successfully", "success");
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

  const handleRedeemGiftCard = (e) => {
    e.preventDefault();
    if (!giftCardCode || !giftCardPin) {
      addToast("Please enter 16-digit Card Number and PIN", "error");
      return;
    }
    addToast("Gift card successfully added! ₹500 added to your VIA Balance.", "success");
    setWalletBalance((prev) => prev + 500);
    setGiftCardCode("");
    setGiftCardPin("");
  };

  const handleSavePan = (e) => {
    e.preventDefault();
    if (!panNumber || !panName) {
      addToast("Please enter valid PAN details", "error");
      return;
    }
    if (!panAccepted) {
      addToast("Please accept the declaration", "error");
      return;
    }
    addToast("PAN details submitted for verification", "success");
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
        className={`px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider border ${
          map[status] || "bg-zinc-100 text-zinc-800 border-zinc-200"
        }`}
      >
        {status}
      </span>
    );
  };

  // User Initials
  const initials = (user?.name || "VIA")
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="min-h-screen bg-[#f1f3f6] py-6 sm:py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Admin Quick Action Banner */}
        {user?.role === "admin" && (
          <div className="mb-6 p-4 sm:p-5 bg-zinc-900 border border-zinc-800 text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-md">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <p className="font-bold text-sm uppercase tracking-wider flex items-center gap-2">
                  Administrator Portal Active
                  <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-300 text-[10px] border border-emerald-500/30">
                    MASTER
                  </span>
                </p>
                <p className="text-xs text-zinc-400 mt-0.5">
                  Full control over inventory, orders, discount coupons, and customer accounts.
                </p>
              </div>
            </div>

            <Link
              to="/admin/orders"
              className="px-5 py-2.5 bg-white hover:bg-zinc-200 text-black font-black text-xs uppercase tracking-widest flex items-center gap-1.5 whitespace-nowrap transition-all shadow-sm"
            >
              Open Admin Portal ({">"})
            </Link>
          </div>
        )}

        {/* Flipkart 2-Column Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* ================= LEFT SIDEBAR (FLIPKART STYLE) ================= */}
          <div className="lg:col-span-4 space-y-4">
            {/* 1. Profile Header Card */}
            <div className="bg-white border border-zinc-200 p-4 shadow-xs flex items-center gap-4">
              <div className="relative">
                <div className="w-13 h-13 rounded-full bg-gradient-to-tr from-black to-zinc-700 text-white flex items-center justify-center font-black text-lg shadow-inner">
                  {initials}
                </div>
                <button
                  onClick={() => addToast("Profile photo upload coming soon", "info")}
                  title="Upload profile picture"
                  className="absolute -bottom-1 -right-1 w-5 h-5 bg-white border border-zinc-300 rounded-full flex items-center justify-center text-zinc-600 hover:text-black hover:border-black shadow-xs transition-colors"
                >
                  <Camera className="w-3 h-3" />
                </button>
              </div>

              <div className="flex-1 min-w-0">
                <span className="text-[11px] text-zinc-500 font-medium">Hello,</span>
                <h2 className="text-base font-black text-zinc-900 truncate uppercase tracking-tight">
                  {user?.name || "Customer"}
                </h2>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700">
                    VIA VIP Member
                  </span>
                </div>
              </div>
            </div>

            {/* 2. Navigation Menu Box (Flipkart Grouped Links) */}
            <div className="bg-white border border-zinc-200 shadow-xs divide-y divide-zinc-100 text-xs">
              {/* MY ORDERS */}
              <button
                onClick={() => setActiveTab("orders")}
                className={`w-full px-5 py-4 flex items-center justify-between text-left transition-colors font-bold uppercase tracking-wider ${
                  activeTab === "orders"
                    ? "bg-zinc-50 text-black border-l-4 border-black"
                    : "text-zinc-700 hover:bg-zinc-50 hover:text-black"
                }`}
              >
                <div className="flex items-center gap-3">
                  <Package className={`w-4 h-4 ${activeTab === "orders" ? "text-black" : "text-zinc-400"}`} />
                  <span>My Orders</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 bg-zinc-100 text-zinc-600 font-bold text-[10px]">
                    {orders.length}
                  </span>
                  <ChevronRight className="w-4 h-4 text-zinc-400" />
                </div>
              </button>

              {/* ACCOUNT SETTINGS */}
              <div className="pt-3 pb-2">
                <div className="px-5 pb-2 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 flex items-center gap-2">
                  <User className="w-3.5 h-3.5 text-zinc-400" />
                  Account Settings
                </div>

                <div className="space-y-0.5">
                  <button
                    onClick={() => setActiveTab("profile")}
                    className={`w-full px-5 py-2.5 text-left flex items-center justify-between font-semibold transition-colors ${
                      activeTab === "profile"
                        ? "bg-zinc-100 text-black font-black border-l-4 border-black"
                        : "text-zinc-600 hover:bg-zinc-50 hover:text-black"
                    }`}
                  >
                    <span>Profile Information</span>
                    {activeTab === "profile" && <ChevronRight className="w-3.5 h-3.5" />}
                  </button>

                  <button
                    onClick={() => setActiveTab("addresses")}
                    className={`w-full px-5 py-2.5 text-left flex items-center justify-between font-semibold transition-colors ${
                      activeTab === "addresses"
                        ? "bg-zinc-100 text-black font-black border-l-4 border-black"
                        : "text-zinc-600 hover:bg-zinc-50 hover:text-black"
                    }`}
                  >
                    <span>Manage Addresses</span>
                    <span className="text-[10px] bg-zinc-100 px-1.5 py-0.5 text-zinc-500 font-bold">
                      {user?.addresses?.length || 0}
                    </span>
                  </button>

                  <button
                    onClick={() => setActiveTab("pan")}
                    className={`w-full px-5 py-2.5 text-left flex items-center justify-between font-semibold transition-colors ${
                      activeTab === "pan"
                        ? "bg-zinc-100 text-black font-black border-l-4 border-black"
                        : "text-zinc-600 hover:bg-zinc-50 hover:text-black"
                    }`}
                  >
                    <span>PAN Card Information</span>
                    {activeTab === "pan" && <ChevronRight className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              {/* PAYMENTS */}
              <div className="pt-3 pb-2">
                <div className="px-5 pb-2 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 flex items-center gap-2">
                  <CreditCard className="w-3.5 h-3.5 text-zinc-400" />
                  Payments
                </div>

                <div className="space-y-0.5">
                  <button
                    onClick={() => setActiveTab("wallet")}
                    className={`w-full px-5 py-2.5 text-left flex items-center justify-between font-semibold transition-colors ${
                      activeTab === "wallet"
                        ? "bg-zinc-100 text-black font-black border-l-4 border-black"
                        : "text-zinc-600 hover:bg-zinc-50 hover:text-black"
                    }`}
                  >
                    <span>Gift Cards & VIA Coins</span>
                    <span className="text-[10px] bg-emerald-50 text-emerald-700 px-1.5 py-0.5 border border-emerald-200 font-black">
                      ₹{walletBalance}
                    </span>
                  </button>

                  <button
                    onClick={() => addToast("Saved Cards / UPI are securely managed via Razorpay Checkout", "info")}
                    className="w-full px-5 py-2.5 text-left flex items-center justify-between font-semibold text-zinc-600 hover:bg-zinc-50 hover:text-black transition-colors"
                  >
                    <span>Saved UPI / Cards</span>
                    <span className="text-[9px] uppercase font-bold text-zinc-400">Razorpay</span>
                  </button>
                </div>
              </div>

              {/* MY STUFF */}
              <div className="pt-3 pb-2">
                <div className="px-5 pb-2 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 flex items-center gap-2">
                  <Heart className="w-3.5 h-3.5 text-zinc-400" />
                  My Stuff
                </div>

                <div className="space-y-0.5">
                  <button
                    onClick={() => setActiveTab("coupons")}
                    className={`w-full px-5 py-2.5 text-left flex items-center justify-between font-semibold transition-colors ${
                      activeTab === "coupons"
                        ? "bg-zinc-100 text-black font-black border-l-4 border-black"
                        : "text-zinc-600 hover:bg-zinc-50 hover:text-black"
                    }`}
                  >
                    <span>My Coupons & Drops</span>
                    <span className="text-[10px] bg-amber-50 text-amber-800 px-1.5 py-0.5 border border-amber-200 font-bold">
                      2 Active
                    </span>
                  </button>

                  <Link
                    to="/wishlist"
                    className="w-full px-5 py-2.5 text-left flex items-center justify-between font-semibold text-zinc-600 hover:bg-zinc-50 hover:text-black transition-colors"
                  >
                    <span>My Wishlist</span>
                    <ChevronRight className="w-3.5 h-3.5 text-zinc-400" />
                  </Link>

                  <button
                    onClick={() => setActiveTab("reviews")}
                    className={`w-full px-5 py-2.5 text-left flex items-center justify-between font-semibold transition-colors ${
                      activeTab === "reviews"
                        ? "bg-zinc-100 text-black font-black border-l-4 border-black"
                        : "text-zinc-600 hover:bg-zinc-50 hover:text-black"
                    }`}
                  >
                    <span>My Reviews & Ratings</span>
                    {activeTab === "reviews" && <ChevronRight className="w-3.5 h-3.5" />}
                  </button>

                  <button
                    onClick={() => setActiveTab("notifications")}
                    className={`w-full px-5 py-2.5 text-left flex items-center justify-between font-semibold transition-colors ${
                      activeTab === "notifications"
                        ? "bg-zinc-100 text-black font-black border-l-4 border-black"
                        : "text-zinc-600 hover:bg-zinc-50 hover:text-black"
                    }`}
                  >
                    <span>All Notifications</span>
                    {activeTab === "notifications" && <ChevronRight className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              {/* LOGOUT BUTTON */}
              <div className="p-3">
                <button
                  onClick={logout}
                  className="w-full flex items-center gap-3 px-4 py-3 text-zinc-700 hover:text-red-600 hover:bg-red-50/50 font-bold uppercase tracking-wider text-xs transition-colors"
                >
                  <LogOut className="w-4 h-4 text-zinc-400 group-hover:text-red-600" />
                  <span>Log Out</span>
                </button>
              </div>
            </div>

            {/* Quick Stats / Trust Mark */}
            <div className="bg-white border border-zinc-200 p-4 shadow-xs text-[11px] text-zinc-500 flex items-center justify-between">
              <span className="flex items-center gap-1.5 font-bold uppercase tracking-wider text-zinc-600">
                <ShieldCheck className="w-4 h-4 text-emerald-600" /> 100% Authentic Drop Guarantee
              </span>
              <span className="font-mono text-zinc-400">v2.4</span>
            </div>
          </div>

          {/* ================= RIGHT MAIN PANEL ================= */}
          <div className="lg:col-span-8">
            {/* ----------------- TAB: PROFILE INFORMATION ----------------- */}
            {activeTab === "profile" && (
              <div className="space-y-6">
                {/* VIP Privilege Header Banner */}
                <div className="bg-gradient-to-r from-zinc-950 via-zinc-900 to-zinc-950 border border-zinc-800 p-6 text-white shadow-md relative overflow-hidden">
                  <div className="absolute right-0 top-0 translate-x-4 -translate-y-4 opacity-10 pointer-events-none">
                    <Sparkles className="w-40 h-40 text-white" />
                  </div>

                  <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div>
                      <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-white/10 border border-white/20 text-[9px] font-black uppercase tracking-[0.25em] text-zinc-300 mb-2">
                        <Sparkles className="w-3 h-3 text-amber-300" /> VIA BLACK CARD PRIVILEGE
                      </div>
                      <h3 className="text-lg font-black uppercase tracking-tight text-white">
                        Tier 1 Elite Member
                      </h3>
                      <p className="text-xs text-zinc-400 mt-1 max-w-md">
                        Free Express Shipping • 2-Hour Early Access to All Drops • 5% VIA Coins Cashback
                      </p>
                    </div>

                    <div className="bg-zinc-800/80 border border-zinc-700/60 p-3 text-center min-w-[120px]">
                      <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400 block">
                        VIA COINS
                      </span>
                      <span className="text-xl font-black text-amber-400">₹{walletBalance}</span>
                    </div>
                  </div>
                </div>

                {/* 1. Personal Information Section (Flipkart Exact Design) */}
                <div className="bg-white border border-zinc-200 p-6 sm:p-8 shadow-xs">
                  <div className="flex items-center justify-between mb-6 pb-3 border-b border-zinc-100">
                    <div className="flex items-center gap-2">
                      <h3 className="font-heading font-black text-sm uppercase tracking-wider text-zinc-900">
                        Personal Information
                      </h3>
                      <span className="text-[11px] text-zinc-400">
                        {isEditingPersonal ? "(Editing)" : ""}
                      </span>
                    </div>

                    {!isEditingPersonal ? (
                      <button
                        type="button"
                        onClick={() => setIsEditingPersonal(true)}
                        className="text-xs font-black uppercase tracking-wider text-blue-600 hover:text-black transition-colors"
                      >
                        Edit
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => setIsEditingPersonal(false)}
                        className="text-xs font-bold uppercase tracking-wider text-zinc-500 hover:text-black transition-colors"
                      >
                        Cancel
                      </button>
                    )}
                  </div>

                  <form onSubmit={handleUpdateProfile} className="space-y-6">
                    {/* First & Last Name Inputs */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[11px] font-bold uppercase tracking-wider text-zinc-600 mb-1.5">
                          First Name
                        </label>
                        <input
                          type="text"
                          required
                          disabled={!isEditingPersonal}
                          value={firstName}
                          onChange={(e) => setFirstName(e.target.value)}
                          className={`w-full px-3.5 py-2.5 text-xs border transition-all ${
                            isEditingPersonal
                              ? "border-zinc-400 bg-white text-black focus:border-black outline-hidden"
                              : "border-zinc-200 bg-zinc-50 text-zinc-700 cursor-not-allowed"
                          }`}
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold uppercase tracking-wider text-zinc-600 mb-1.5">
                          Last Name
                        </label>
                        <input
                          type="text"
                          disabled={!isEditingPersonal}
                          value={lastName}
                          onChange={(e) => setLastName(e.target.value)}
                          className={`w-full px-3.5 py-2.5 text-xs border transition-all ${
                            isEditingPersonal
                              ? "border-zinc-400 bg-white text-black focus:border-black outline-hidden"
                              : "border-zinc-200 bg-zinc-50 text-zinc-700 cursor-not-allowed"
                          }`}
                        />
                      </div>
                    </div>

                    {/* Your Gender (Exact Flipkart Feature) */}
                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-zinc-600 mb-2">
                        Your Gender
                      </label>
                      <div className="flex items-center gap-6">
                        <label
                          className={`flex items-center gap-2 text-xs font-bold cursor-pointer ${
                            !isEditingPersonal ? "opacity-75 cursor-not-allowed" : ""
                          }`}
                        >
                          <input
                            type="radio"
                            name="gender"
                            value="male"
                            disabled={!isEditingPersonal}
                            checked={gender === "male"}
                            onChange={(e) => setGender(e.target.value)}
                            className="w-4 h-4 accent-black cursor-pointer"
                          />
                          <span className="text-zinc-800">Male</span>
                        </label>

                        <label
                          className={`flex items-center gap-2 text-xs font-bold cursor-pointer ${
                            !isEditingPersonal ? "opacity-75 cursor-not-allowed" : ""
                          }`}
                        >
                          <input
                            type="radio"
                            name="gender"
                            value="female"
                            disabled={!isEditingPersonal}
                            checked={gender === "female"}
                            onChange={(e) => setGender(e.target.value)}
                            className="w-4 h-4 accent-black cursor-pointer"
                          />
                          <span className="text-zinc-800">Female</span>
                        </label>

                        <label
                          className={`flex items-center gap-2 text-xs font-bold cursor-pointer ${
                            !isEditingPersonal ? "opacity-75 cursor-not-allowed" : ""
                          }`}
                        >
                          <input
                            type="radio"
                            name="gender"
                            value="other"
                            disabled={!isEditingPersonal}
                            checked={gender === "other"}
                            onChange={(e) => setGender(e.target.value)}
                            className="w-4 h-4 accent-black cursor-pointer"
                          />
                          <span className="text-zinc-800">Other</span>
                        </label>
                      </div>
                    </div>

                    {isEditingPersonal && (
                      <div className="pt-2">
                        <button
                          type="submit"
                          disabled={savingProfile}
                          className="px-6 py-2.5 bg-black hover:bg-zinc-800 text-white text-xs font-black uppercase tracking-widest transition-all shadow-sm flex items-center gap-2"
                        >
                          <Check className="w-3.5 h-3.5" />
                          {savingProfile ? "Saving Details..." : "Save Changes"}
                        </button>
                      </div>
                    )}
                  </form>
                </div>

                {/* 2. Email Address Section */}
                <div className="bg-white border border-zinc-200 p-6 sm:p-8 shadow-xs">
                  <div className="flex items-center justify-between mb-4 pb-3 border-b border-zinc-100">
                    <h3 className="font-heading font-black text-sm uppercase tracking-wider text-zinc-900">
                      Email Address
                    </h3>
                    {user?.emailVerified ? (
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 border border-emerald-200">
                        <CheckCircle2 className="w-3 h-3" /> Verified
                      </span>
                    ) : (
                      <div className="flex items-center gap-2">
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 border border-amber-200">
                          <AlertTriangle className="w-3 h-3" /> Unverified
                        </span>
                        <button
                          type="button"
                          onClick={() => setShowOtpModal(true)}
                          className="text-xs font-black text-black underline uppercase tracking-wider hover:text-blue-600 transition-colors cursor-pointer"
                        >
                          Verify Now
                        </button>
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
                    <div>
                      <input
                        type="email"
                        disabled
                        value={user?.email || ""}
                        className="w-full px-3.5 py-2.5 text-xs border border-zinc-200 bg-zinc-50 text-zinc-700 font-mono cursor-not-allowed"
                      />
                    </div>
                    <p className="text-[11px] text-zinc-500 leading-relaxed">
                      Your registered email is your primary login ID and receives all order tracking & digital invoices.
                    </p>
                  </div>
                </div>

                {/* 3. Mobile Number Section */}
                <div className="bg-white border border-zinc-200 p-6 sm:p-8 shadow-xs">
                  <div className="flex items-center justify-between mb-4 pb-3 border-b border-zinc-100">
                    <h3 className="font-heading font-black text-sm uppercase tracking-wider text-zinc-900">
                      Mobile Number
                    </h3>
                    {user?.phone ? (
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 border border-emerald-200">
                        <CheckCircle2 className="w-3 h-3" /> Added
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-zinc-500 bg-zinc-50 px-2 py-0.5 border border-zinc-200">
                        Not Added
                      </span>
                    )}
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3">
                    <div className="flex-1 flex">
                      <span className="inline-flex items-center px-3 text-xs font-bold bg-zinc-100 border border-r-0 border-zinc-300 text-zinc-600">
                        +91
                      </span>
                      <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="Enter 10-digit mobile number"
                        className="w-full px-3.5 py-2.5 text-xs border border-zinc-300 focus:border-black outline-hidden"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={handleUpdateProfile}
                      disabled={savingProfile}
                      className="px-6 py-2.5 bg-black hover:bg-zinc-800 text-white text-xs font-black uppercase tracking-widest transition-all whitespace-nowrap"
                    >
                      Update Number
                    </button>
                  </div>
                </div>

                {/* 4. Security & Password Section with Eye Show/Hide */}
                <div className="bg-white border border-zinc-200 p-6 sm:p-8 shadow-xs">
                  <div className="mb-4 pb-3 border-b border-zinc-100">
                    <h3 className="font-heading font-black text-sm uppercase tracking-wider text-zinc-900 flex items-center gap-2">
                      <Lock className="w-4 h-4 text-zinc-500" /> Change Account Password
                    </h3>
                    <p className="text-[11px] text-zinc-500 mt-1">
                      Choose a strong alphanumeric password with at least 6 characters.
                    </p>
                  </div>

                  <form onSubmit={handleChangePassword} className="space-y-4 max-w-xl">
                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-zinc-600 mb-1.5">
                        Current Password
                      </label>
                      <div className="relative">
                        <input
                          type={showCurrentPassword ? "text" : "password"}
                          required
                          value={currentPassword}
                          onChange={(e) => setCurrentPassword(e.target.value)}
                          placeholder="••••••••"
                          className="w-full px-3.5 py-2.5 pr-10 text-xs border border-zinc-300 focus:border-black outline-hidden"
                        />
                        <button
                          type="button"
                          onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-black transition-colors"
                        >
                          {showCurrentPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-zinc-600 mb-1.5">
                        New Password (Min. 6 characters)
                      </label>
                      <div className="relative">
                        <input
                          type={showNewPassword ? "text" : "password"}
                          required
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          placeholder="••••••••"
                          className="w-full px-3.5 py-2.5 pr-10 text-xs border border-zinc-300 focus:border-black outline-hidden"
                        />
                        <button
                          type="button"
                          onClick={() => setShowNewPassword(!showNewPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-black transition-colors"
                        >
                          {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    <div className="pt-2">
                      <button
                        type="submit"
                        disabled={savingPassword}
                        className="px-6 py-2.5 bg-black hover:bg-zinc-800 text-white text-xs font-black uppercase tracking-widest transition-all shadow-sm"
                      >
                        {savingPassword ? "Updating Password..." : "Update Password"}
                      </button>
                    </div>
                  </form>
                </div>

                {/* 5. FAQs Section (Exact Flipkart Style) */}
                <div className="bg-white border border-zinc-200 p-6 sm:p-8 shadow-xs">
                  <h4 className="font-heading font-black text-xs uppercase tracking-widest text-zinc-900 mb-4 flex items-center gap-2">
                    <HelpCircle className="w-4 h-4 text-zinc-500" /> Frequently Asked Questions
                  </h4>

                  <div className="space-y-4 text-xs text-zinc-600 divide-y divide-zinc-100">
                    <div className="pt-2">
                      <p className="font-bold text-zinc-900">
                        What happens when I update my email address (or mobile number)?
                      </p>
                      <p className="mt-1 text-zinc-500 leading-relaxed text-[11px]">
                        Your login email ID (or mobile number) changes, likewise. You'll receive all your order invoices, shipment tracking, and OTP notices on your updated address.
                      </p>
                    </div>

                    <div className="pt-3">
                      <p className="font-bold text-zinc-900">
                        When will my VIA account be updated with the new email address?
                      </p>
                      <p className="mt-1 text-zinc-500 leading-relaxed text-[11px]">
                        It happens immediately as soon as you confirm the changes.
                      </p>
                    </div>

                    <div className="pt-3">
                      <p className="font-bold text-zinc-900">
                        What happens to my existing VIA account, orders, and saved addresses?
                      </p>
                      <p className="mt-1 text-zinc-500 leading-relaxed text-[11px]">
                        Updating your profile does not invalidate your account. All your past orders, delivery addresses, wishlist items, and VIA Coins remain 100% safe.
                      </p>
                    </div>
                  </div>
                </div>

                {/* 6. Deactivate Account (Classic Flipkart Element) */}
                <div className="bg-white border border-zinc-200 p-5 shadow-xs flex items-center justify-between">
                  <div>
                    <p className="text-xs font-black uppercase tracking-wider text-red-600">
                      Deactivate Account
                    </p>
                    <p className="text-[11px] text-zinc-400 mt-0.5">
                      Temporarily disable your profile. You can reactivate anytime by logging back in.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => setShowDeactivateModal(true)}
                    className="px-4 py-2 border border-red-200 hover:border-red-600 text-red-600 text-xs font-bold uppercase tracking-wider transition-colors"
                  >
                    Deactivate
                  </button>
                </div>
              </div>
            )}

            {/* ----------------- TAB: MY ORDERS ----------------- */}
            {activeTab === "orders" && (
              <div className="space-y-4">
                <div className="bg-white border border-zinc-200 p-5 shadow-xs flex items-center justify-between">
                  <h3 className="text-sm font-black uppercase tracking-wider text-zinc-900 flex items-center gap-2">
                    <Package className="w-4 h-4" /> All Orders ({orders.length})
                  </h3>
                  <Link
                    to="/shop"
                    className="text-xs font-black uppercase tracking-wider text-black hover:underline"
                  >
                    Explore Drops &gt;
                  </Link>
                </div>

                {loadingOrders ? (
                  <div className="bg-white border border-zinc-200 p-12 text-center text-xs font-bold uppercase text-zinc-500 tracking-wider">
                    Loading Your Streetwear Orders...
                  </div>
                ) : orders.length === 0 ? (
                  <div className="bg-white border border-zinc-200 p-12 text-center space-y-4 shadow-xs">
                    <Package className="w-12 h-12 text-zinc-300 mx-auto" />
                    <h3 className="text-base font-black uppercase text-zinc-900">
                      No orders placed yet
                    </h3>
                    <p className="text-xs text-zinc-500 uppercase tracking-widest max-w-sm mx-auto">
                      Explore our heavyweight oversized tees and limited capsules with instant dispatch.
                    </p>
                    <Link
                      to="/shop"
                      className="inline-block px-6 py-3 bg-black text-white text-xs font-black uppercase tracking-widest hover:bg-zinc-800 transition-colors shadow-sm"
                    >
                      Explore Drops
                    </Link>
                  </div>
                ) : (
                  orders.map((order) => (
                    <div
                      key={order._id}
                      className="bg-white border border-zinc-200 p-5 sm:p-6 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-6 hover:border-zinc-300 transition-colors"
                    >
                      <div className="space-y-2">
                        <div className="flex items-center gap-3">
                          <span className="font-mono font-black text-sm text-zinc-900">
                            #{order.orderNumber}
                          </span>
                          {getStatusBadge(order.orderStatus)}
                        </div>

                        <p className="text-xs text-zinc-500">
                          Placed on{" "}
                          {new Date(order.createdAt).toLocaleDateString("en-IN", {
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

            {/* ----------------- TAB: MANAGE ADDRESSES ----------------- */}
            {activeTab === "addresses" && (
              <div className="space-y-6">
                <div className="bg-white border border-zinc-200 p-5 shadow-xs flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-black uppercase tracking-wider text-zinc-900 flex items-center gap-2">
                      <MapPin className="w-4 h-4" /> Manage Delivery Addresses
                    </h3>
                    <p className="text-[11px] text-zinc-500 mt-0.5">
                      Save multiple delivery locations for seamless 1-click checkout.
                    </p>
                  </div>

                  <button
                    onClick={() => setShowAddressModal(true)}
                    className="px-4 py-2.5 bg-black hover:bg-zinc-800 text-white text-xs font-black uppercase tracking-wider flex items-center gap-1.5 shadow-xs"
                  >
                    <Plus className="w-3.5 h-3.5" /> Add A New Address
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {user?.addresses?.length === 0 ? (
                    <div className="col-span-2 bg-white border border-zinc-200 p-12 text-center text-xs text-zinc-500 shadow-xs">
                      <MapPin className="w-8 h-8 text-zinc-300 mx-auto mb-2" />
                      No saved addresses found. Add an address to speed up checkout.
                    </div>
                  ) : (
                    user?.addresses?.map((addr) => (
                      <div
                        key={addr._id}
                        className="bg-white border border-zinc-200 p-5 shadow-xs relative flex flex-col justify-between hover:border-zinc-300 transition-colors"
                      >
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-black text-sm text-zinc-900">{addr.fullName}</span>
                            <div className="flex items-center gap-1.5">
                              <span className="text-[9px] font-black bg-zinc-100 text-zinc-800 px-2 py-0.5 uppercase border border-zinc-200">
                                HOME
                              </span>
                              {addr.isDefault && (
                                <span className="text-[9px] font-black bg-black text-white px-2 py-0.5 uppercase">
                                  Default
                                </span>
                              )}
                            </div>
                          </div>
                          <p className="text-xs text-zinc-600 leading-relaxed">{addr.addressLine1}</p>
                          {addr.addressLine2 && (
                            <p className="text-xs text-zinc-600 leading-relaxed">{addr.addressLine2}</p>
                          )}
                          <p className="text-xs text-zinc-700 font-bold mt-1">
                            {addr.city}, {addr.state} - {addr.postalCode}
                          </p>
                          <p className="text-xs text-zinc-500 mt-2 font-medium">
                            Phone: <span className="text-zinc-900 font-mono">{addr.phone}</span>
                          </p>
                        </div>

                        <div className="mt-4 pt-3 border-t border-zinc-100 flex justify-end">
                          <button
                            onClick={() => deleteAddress(addr._id)}
                            className="text-xs font-bold text-red-600 hover:text-red-800 flex items-center gap-1 uppercase tracking-wider transition-colors"
                          >
                            <Trash2 className="w-3.5 h-3.5" /> Remove
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

            {/* ----------------- TAB: PAN CARD (FLIPKART REGULATORY) ----------------- */}
            {activeTab === "pan" && (
              <div className="bg-white border border-zinc-200 p-6 sm:p-8 shadow-xs space-y-6">
                <div className="pb-3 border-b border-zinc-100">
                  <h3 className="font-heading font-black text-sm uppercase tracking-wider text-zinc-900 flex items-center gap-2">
                    <FileText className="w-4 h-4 text-zinc-500" /> PAN Card Information
                  </h3>
                  <p className="text-[11px] text-zinc-500 mt-1 leading-relaxed">
                    As per Indian Government regulations, PAN details are required for transactions above ₹2,00,000 or high-volume wholesale orders.
                  </p>
                </div>

                <form onSubmit={handleSavePan} className="space-y-4 max-w-lg">
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-zinc-600 mb-1.5">
                      PAN Card Number
                    </label>
                    <input
                      type="text"
                      maxLength={10}
                      required
                      placeholder="ABCDE1234F"
                      value={panNumber}
                      onChange={(e) => setPanNumber(e.target.value.toUpperCase())}
                      className="w-full px-3.5 py-2.5 text-xs font-mono border border-zinc-300 focus:border-black outline-hidden uppercase"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-zinc-600 mb-1.5">
                      Full Name On PAN Card
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. VIVEK AWASTHI"
                      value={panName}
                      onChange={(e) => setPanName(e.target.value)}
                      className="w-full px-3.5 py-2.5 text-xs border border-zinc-300 focus:border-black outline-hidden uppercase"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-zinc-600 mb-1.5">
                      Upload PAN Card Image / Document
                    </label>
                    <div className="border-2 border-dashed border-zinc-300 p-6 text-center hover:border-black transition-colors cursor-pointer">
                      <Camera className="w-6 h-6 text-zinc-400 mx-auto mb-2" />
                      <p className="text-xs font-bold text-zinc-700">Choose file or drag here</p>
                      <p className="text-[10px] text-zinc-400 mt-0.5">JPEG, PNG or PDF up to 5MB</p>
                    </div>
                  </div>

                  <label className="flex items-start gap-2 text-xs text-zinc-600 cursor-pointer pt-1">
                    <input
                      type="checkbox"
                      checked={panAccepted}
                      onChange={(e) => setPanAccepted(e.target.checked)}
                      className="mt-0.5 w-4 h-4 accent-black"
                    />
                    <span className="text-[11px] leading-relaxed">
                      I hereby declare that the PAN details provided above are true, accurate, and belong to me.
                    </span>
                  </label>

                  <div className="pt-2">
                    <button
                      type="submit"
                      className="px-6 py-2.5 bg-black hover:bg-zinc-800 text-white text-xs font-black uppercase tracking-widest transition-all shadow-sm"
                    >
                      Upload & Save PAN
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* ----------------- TAB: GIFT CARDS & VIA COINS ----------------- */}
            {activeTab === "wallet" && (
              <div className="space-y-6">
                {/* Balance Card */}
                <div className="bg-gradient-to-tr from-zinc-900 to-black p-6 sm:p-8 text-white shadow-md border border-zinc-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-[0.25em] text-zinc-400">
                      AVAILABLE BALANCE
                    </span>
                    <h3 className="text-3xl font-black text-amber-400 mt-1">₹{walletBalance}.00</h3>
                    <p className="text-xs text-zinc-400 mt-1">
                      Includes VIA SuperCoins & Promotional Wallet Credits.
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="px-3 py-1 bg-white/10 text-zinc-200 text-xs font-bold border border-white/20">
                      1 Coin = ₹1.00
                    </span>
                  </div>
                </div>

                {/* Add Gift Card Card */}
                <div className="bg-white border border-zinc-200 p-6 sm:p-8 shadow-xs">
                  <div className="pb-3 border-b border-zinc-100 mb-6">
                    <h3 className="font-heading font-black text-sm uppercase tracking-wider text-zinc-900 flex items-center gap-2">
                      <Gift className="w-4 h-4 text-zinc-500" /> Add A VIA Gift Card
                    </h3>
                    <p className="text-[11px] text-zinc-500 mt-1">
                      Redeem a 16-digit gift voucher or promotional drop scratch card.
                    </p>
                  </div>

                  <form onSubmit={handleRedeemGiftCard} className="space-y-4 max-w-lg">
                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-zinc-600 mb-1.5">
                        16-Digit Card Number
                      </label>
                      <input
                        type="text"
                        maxLength={19}
                        required
                        placeholder="XXXX - XXXX - XXXX - XXXX"
                        value={giftCardCode}
                        onChange={(e) => setGiftCardCode(e.target.value)}
                        className="w-full px-3.5 py-2.5 text-xs font-mono border border-zinc-300 focus:border-black outline-hidden"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-zinc-600 mb-1.5">
                        6-Digit Security PIN
                      </label>
                      <input
                        type="password"
                        maxLength={6}
                        required
                        placeholder="••••••"
                        value={giftCardPin}
                        onChange={(e) => setGiftCardPin(e.target.value)}
                        className="w-full px-3.5 py-2.5 text-xs font-mono border border-zinc-300 focus:border-black outline-hidden"
                      />
                    </div>

                    <div className="pt-2">
                      <button
                        type="submit"
                        className="px-6 py-2.5 bg-black hover:bg-zinc-800 text-white text-xs font-black uppercase tracking-widest transition-all shadow-sm"
                      >
                        Apply To VIA Balance
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}

            {/* ----------------- TAB: COUPONS & REWARDS ----------------- */}
            {activeTab === "coupons" && (
              <div className="space-y-4">
                <div className="bg-white border border-zinc-200 p-5 shadow-xs flex items-center justify-between">
                  <h3 className="text-sm font-black uppercase tracking-wider text-zinc-900 flex items-center gap-2">
                    <Tag className="w-4 h-4" /> Available Exclusive Coupons (2)
                  </h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="bg-white border-2 border-dashed border-emerald-300 p-5 shadow-xs relative">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-mono font-black text-base text-emerald-800 tracking-wider">
                        VIAFIRST10
                      </span>
                      <span className="text-[10px] font-black uppercase bg-emerald-100 text-emerald-900 px-2 py-0.5">
                        10% OFF
                      </span>
                    </div>
                    <p className="text-xs text-zinc-600 leading-relaxed">
                      Get flat 10% discount on your first premium oversized streetwear purchase.
                    </p>
                    <p className="text-[10px] text-zinc-400 mt-3 font-semibold">Valid till 31 Dec 2026</p>
                  </div>

                  <div className="bg-white border-2 border-dashed border-zinc-300 p-5 shadow-xs relative">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-mono font-black text-base text-zinc-900 tracking-wider">
                        FLAT200
                      </span>
                      <span className="text-[10px] font-black uppercase bg-zinc-100 text-zinc-900 px-2 py-0.5">
                        ₹200 OFF
                      </span>
                    </div>
                    <p className="text-xs text-zinc-600 leading-relaxed">
                      Instant ₹200 off on any streetwear cart total above ₹1,499.
                    </p>
                    <p className="text-[10px] text-zinc-400 mt-3 font-semibold">Valid till 31 Dec 2026</p>
                  </div>
                </div>
              </div>
            )}

            {/* ----------------- TAB: REVIEWS ----------------- */}
            {activeTab === "reviews" && (
              <div className="bg-white border border-zinc-200 p-8 text-center space-y-4 shadow-xs">
                <Star className="w-12 h-12 text-zinc-300 mx-auto" />
                <h3 className="text-base font-black uppercase text-zinc-900">
                  No Product Reviews Yet
                </h3>
                <p className="text-xs text-zinc-500 uppercase tracking-widest max-w-sm mx-auto">
                  When you review your delivered streetwear drops, your verified feedback will show here.
                </p>
              </div>
            )}

            {/* ----------------- TAB: NOTIFICATIONS ----------------- */}
            {activeTab === "notifications" && (
              <div className="bg-white border border-zinc-200 divide-y divide-zinc-100 shadow-xs">
                <div className="p-4 sm:p-5 flex items-start gap-3">
                  <div className="p-2 bg-emerald-50 text-emerald-700 border border-emerald-200">
                    <Bell className="w-4 h-4" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs font-bold text-zinc-900">
                      Welcome to VIA Streetwear Club!
                    </p>
                    <p className="text-[11px] text-zinc-500 mt-0.5">
                      Your account has been upgraded to VIP Tier 1 status. Enjoy free shipping & early capsule drops.
                    </p>
                    <span className="text-[10px] text-zinc-400 font-mono mt-1 block">Just now</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ================= ADD ADDRESS MODAL ================= */}
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
              {/* PIN Code (Auto-Verifies & Fills City/State) */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-zinc-700">
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
                  placeholder="e.g. 110001, 208001, 560001"
                  required
                  value={newAddress.postalCode}
                  onChange={(e) => handlePincodeChange(e.target.value)}
                  className="w-full px-3 py-2 text-xs font-mono border border-zinc-300 focus:border-black outline-hidden"
                />
              </div>

              {/* City and State (Auto-filled from PIN Code) */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-bold uppercase tracking-wider text-zinc-700 block mb-1">
                    City / District *
                  </label>
                  <input
                    type="text"
                    placeholder="Auto-filled via PIN"
                    required
                    value={newAddress.city}
                    onChange={(e) =>
                      setNewAddress({ ...newAddress, city: e.target.value })
                    }
                    className="w-full px-3 py-2 text-xs border border-zinc-300 focus:border-black outline-hidden bg-white"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold uppercase tracking-wider text-zinc-700 block mb-1">
                    State *
                  </label>
                  <input
                    type="text"
                    placeholder="Auto-filled via PIN"
                    required
                    value={newAddress.state}
                    onChange={(e) =>
                      setNewAddress({ ...newAddress, state: e.target.value })
                    }
                    className="w-full px-3 py-2 text-xs border border-zinc-300 focus:border-black outline-hidden bg-white"
                  />
                </div>
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

      {/* ================= DEACTIVATE CONFIRMATION MODAL ================= */}
      {showDeactivateModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white max-w-md w-full p-6 sm:p-7 border border-zinc-300 shadow-2xl space-y-4">
            <div className="flex items-center gap-3 text-red-600">
              <AlertTriangle className="w-6 h-6" />
              <h4 className="font-black text-sm uppercase tracking-wider">
                Deactivate Your Account?
              </h4>
            </div>

            <p className="text-xs text-zinc-600 leading-relaxed">
              When you deactivate your account, your profile and saved wishlist will become inaccessible until you log back in. Any active or in-transit orders will still be delivered normally.
            </p>

            <div className="p-3 bg-zinc-50 border border-zinc-200 text-[11px] text-zinc-500">
              <strong>Tip:</strong> You can reactivate anytime simply by entering your email and password on the login page.
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setShowDeactivateModal(false)}
                className="px-4 py-2 border border-zinc-300 text-xs font-bold uppercase tracking-wider hover:bg-zinc-100"
              >
                Keep Account Active
              </button>
              <button
                onClick={() => {
                  setShowDeactivateModal(false);
                  logout();
                  addToast("Your account has been deactivated. Log in anytime to reactivate.", "info");
                }}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-bold uppercase tracking-wider"
              >
                Confirm Deactivation
              </button>
            </div>
          </div>
        </div>
      )}

      {/* OTP Verification Modal */}
      <OtpVerificationModal
        isOpen={showOtpModal}
        onClose={() => setShowOtpModal(false)}
        onVerified={() => setShowOtpModal(false)}
      />
    </div>
  );
}

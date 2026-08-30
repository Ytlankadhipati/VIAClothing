import React, { useState, useEffect } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import {
  Search,
  MessageCircle,
  Menu,
  X,
  ShoppingBag,
  Heart,
  User,
  ShieldCheck,
  LogOut,
  Package,
} from "lucide-react";
import InstagramIcon from "./InstagramIcon";
import { WHATSAPP_NUMBER, getGeneralWhatsAppUrl } from "../utils/whatsapp";
import SearchModal from "./SearchModal";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const { itemCount, openCartDrawer } = useCart();
  const { wishlistCount } = useWishlist();
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 30) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close menus on page change
  useEffect(() => {
    setMobileMenuOpen(false);
    setUserDropdownOpen(false);
  }, [location]);

  const navLinks = [
    { name: "SHOP", path: "/shop" },
    { name: "COLLECTIONS", path: "/collections" },
    { name: "ABOUT", path: "/about" },
    { name: "CONTACT", path: "/contact" },
  ];

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  return (
    <>
      <header
        className={`sticky top-0 z-40 w-full transition-all duration-300 ${isScrolled
            ? "glass-nav py-3 shadow-sm bg-white/90 backdrop-blur-md border-b border-zinc-200"
            : "bg-white/80 backdrop-blur-md py-3.5 border-b border-zinc-200/80"
          }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          {/* Left: Brand Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <img
              src="/assets/via-logo.png"
              alt="VIA - Vibe Identity Authenticity"
              className="h-9 md:h-11 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
            />
            <div className="hidden sm:flex flex-col">
              <span className="font-heading font-black tracking-[0.3em] text-lg text-zinc-900 leading-none">
                VIA
              </span>
              <span className="text-[8px] uppercase tracking-[0.25em] text-zinc-500 mt-0.5 font-semibold">
                VIBE • IDENTITY • AUTHENTICITY
              </span>
            </div>
          </Link>

          {/* Center: Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8 lg:gap-10">
            {navLinks.map((link) => (
              <NavLink
                key={link.name}
                to={link.path}
                className={({ isActive }) =>
                  `text-xs font-bold tracking-[0.2em] uppercase transition-all relative py-1 ${isActive
                    ? "text-black after:absolute after:bottom-0 after:left-0 after:w-full after:h-[2px] after:bg-black font-black"
                    : "text-zinc-500 hover:text-black"
                  }`
                }
              >
                {link.name}
              </NavLink>
            ))}
          </nav>

          {/* Right Action Icons */}
          <div className="flex items-center gap-2 sm:gap-3.5">
            {/* Search Trigger */}
            <button
              onClick={() => setSearchOpen(true)}
              className="p-2 text-zinc-700 hover:text-black hover:bg-zinc-100 rounded-full transition-all"
              aria-label="Search catalog"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* Wishlist Link */}
            <Link
              to={isAuthenticated ? "/account/wishlist" : "/auth/login"}
              className="p-2 text-zinc-700 hover:text-black hover:bg-zinc-100 rounded-full transition-all relative"
              aria-label="Wishlist"
            >
              <Heart className="w-5 h-5" />
              {wishlistCount > 0 && (
                <span className="absolute top-0 right-0 w-4 h-4 bg-zinc-900 text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                  {wishlistCount}
                </span>
              )}
            </Link>

            {/* Admin Portal Fast Shortcut */}
            {isAdmin && (
              <Link
                to="/admin"
                className="hidden sm:flex items-center gap-1.5 px-3 py-1 bg-black text-white text-[10px] font-black uppercase tracking-wider hover:bg-zinc-800 shadow-xs"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                Admin
              </Link>
            )}

            {/* User Account / Auth Dropdown */}
            <div className="relative">
              {isAuthenticated ? (
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="p-2 text-zinc-700 hover:text-black hover:bg-zinc-100 rounded-full transition-all flex items-center gap-1.5"
                  aria-label="User Account"
                >
                  <User className="w-5 h-5" />
                  <span className="hidden lg:inline text-xs font-bold uppercase tracking-wider text-zinc-800">
                    {user?.name?.split(" ")[0]}
                  </span>
                </button>
              ) : (
                <Link
                  to="/auth/login"
                  className="p-2 text-zinc-700 hover:text-black hover:bg-zinc-100 rounded-full transition-all"
                  aria-label="Login"
                >
                  <User className="w-5 h-5" />
                </Link>
              )}

              {/* User Dropdown Menu */}
              {userDropdownOpen && isAuthenticated && (
                <div className="absolute right-0 mt-2 w-56 bg-white border border-zinc-200 shadow-xl py-2 z-50 animate-fadeIn text-xs">
                  <div className="px-4 py-2 border-b border-zinc-100">
                    <p className="font-bold text-zinc-900 truncate">{user?.name}</p>
                    <p className="text-zinc-400 text-[10px] truncate">{user?.email}</p>
                  </div>

                  <Link
                    to="/account"
                    className="flex items-center gap-2 px-4 py-2 text-zinc-700 hover:bg-zinc-50 hover:text-black font-semibold"
                  >
                    <User className="w-4 h-4" />
                    Account & Profile
                  </Link>

                  <Link
                    to="/account/orders"
                    className="flex items-center gap-2 px-4 py-2 text-zinc-700 hover:bg-zinc-50 hover:text-black font-semibold"
                  >
                    <Package className="w-4 h-4" />
                    My Orders
                  </Link>

                  {isAdmin && (
                    <Link
                      to="/admin"
                      className="flex items-center gap-2 px-4 py-2 text-emerald-700 bg-emerald-50 hover:bg-emerald-100 font-bold uppercase tracking-wider border-y border-emerald-200 my-1"
                    >
                      <ShieldCheck className="w-4 h-4 text-emerald-600" />
                      Admin Dashboard
                    </Link>
                  )}

                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 font-semibold text-left"
                  >
                    <LogOut className="w-4 h-4" />
                    Sign Out
                  </button>
                </div>
              )}
            </div>

            {/* Shopping Bag Trigger with Live Counter */}
            <button
              onClick={openCartDrawer}
              className="p-2 text-zinc-900 hover:bg-zinc-100 rounded-full transition-all relative flex items-center gap-1.5 group"
              aria-label="Open Shopping Bag"
            >
              <ShoppingBag className="w-5 h-5" />
              {itemCount > 0 && (
                <span className="absolute top-0 right-0 w-4 h-4 bg-black text-white text-[9px] font-black rounded-full flex items-center justify-center animate-scaleUp">
                  {itemCount}
                </span>
              )}
            </button>

            {/* WhatsApp Direct Concierge */}
            <a
              href={getGeneralWhatsAppUrl("Hi VIA, I want to explore your latest collection.")}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 border border-emerald-500/30 hover:border-emerald-600 text-emerald-800 rounded-none transition-all text-xs font-bold tracking-wider uppercase shadow-2xs"
              aria-label="WhatsApp Concierge"
            >
              <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
              <span className="hidden xl:inline text-[10px]">WhatsApp</span>
            </a>

            {/* Mobile Hamburger Menu Trigger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 md:hidden text-zinc-700 hover:text-black rounded-md"
              aria-label="Toggle mobile menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 top-[60px] z-30 bg-white/98 backdrop-blur-2xl md:hidden flex flex-col justify-between p-6 border-t border-zinc-200 animate-fadeIn">
          <div className="flex flex-col gap-6 mt-4">
            {navLinks.map((link) => (
              <NavLink
                key={link.name}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className={({ isActive }) =>
                  `text-2xl font-bold tracking-[0.15em] uppercase font-heading transition-all ${isActive ? "text-black pl-3 border-l-2 border-black font-black" : "text-zinc-500 hover:text-black"
                  }`
                }
              >
                {link.name}
              </NavLink>
            ))}

            <div className="border-t border-zinc-200 pt-4 flex flex-col gap-3">
              {isAuthenticated ? (
                <>
                  <Link
                    to="/account"
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-base font-bold text-zinc-900 flex items-center gap-2"
                  >
                    <User className="w-4 h-4" /> My Account ({user?.name})
                  </Link>
                  <Link
                    to="/account/orders"
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-base font-bold text-zinc-900 flex items-center gap-2"
                  >
                    <Package className="w-4 h-4" /> My Orders
                  </Link>
                  {isAdmin && (
                    <Link
                      to="/admin"
                      onClick={() => setMobileMenuOpen(false)}
                      className="text-base font-bold text-emerald-700 flex items-center gap-2"
                    >
                      <ShieldCheck className="w-4 h-4" /> Admin Portal
                    </Link>
                  )}
                  <button
                    onClick={handleLogout}
                    className="text-left text-sm font-bold text-red-600 flex items-center gap-2 mt-2"
                  >
                    <LogOut className="w-4 h-4" /> Sign Out
                  </button>
                </>
              ) : (
                <Link
                  to="/auth/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="py-3 bg-black text-white text-center text-xs font-black uppercase tracking-widest"
                >
                  Sign In / Register
                </Link>
              )}
            </div>
          </div>

          <div className="border-t border-zinc-200 pt-6 flex flex-col gap-4">
            <a
              href={getGeneralWhatsAppUrl("Hi VIA, I'm reaching out through your mobile website.")}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold uppercase tracking-widest text-xs flex items-center justify-center gap-2 transition-colors shadow-sm"
            >
              <MessageCircle className="w-4 h-4 text-white" />
              Order on WhatsApp ({WHATSAPP_NUMBER})
            </a>
          </div>
        </div>
      )}

      {/* Search Modal */}
      <SearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}

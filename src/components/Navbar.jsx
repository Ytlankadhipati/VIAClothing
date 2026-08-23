import React, { useState, useEffect } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { Search, MessageCircle, Menu, X } from "lucide-react";
import InstagramIcon from "./InstagramIcon";
import { WHATSAPP_NUMBER, getGeneralWhatsAppUrl } from "../utils/whatsapp";
import SearchModal from "./SearchModal";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const location = useLocation();

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

  // Close mobile menu on page change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location]);

  const navLinks = [
    { name: "SHOP", path: "/shop" },
    { name: "COLLECTIONS", path: "/collections" },
    { name: "ABOUT", path: "/about" },
    { name: "CONTACT", path: "/contact" },
  ];

  return (
    <>
      <header
        className={`sticky top-0 z-40 w-full transition-all duration-300 ${
          isScrolled
            ? "glass-nav py-3.5 shadow-sm"
            : "bg-white/80 backdrop-blur-md py-4 border-b border-zinc-200/80"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          {/* Brand Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <img
              src="/assets/via-logo.png"
              alt="VIA - Vibe Identity Authenticity"
              className="h-10 md:h-12 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
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

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8 lg:gap-10">
            {navLinks.map((link) => (
              <NavLink
                key={link.name}
                to={link.path}
                className={({ isActive }) =>
                  `text-xs font-bold tracking-[0.2em] uppercase transition-all relative py-1 ${
                    isActive
                      ? "text-black after:absolute after:bottom-0 after:left-0 after:w-full after:h-[2px] after:bg-black"
                      : "text-zinc-500 hover:text-black"
                  }`
                }
              >
                {link.name}
              </NavLink>
            ))}
          </nav>

          {/* Right Action Icons */}
          <div className="flex items-center gap-3 sm:gap-4">
            {/* Search Trigger */}
            <button
              onClick={() => setSearchOpen(true)}
              className="p-2 text-zinc-700 hover:text-black hover:bg-zinc-100 rounded-full transition-all"
              aria-label="Search catalog"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* Instagram Link */}
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 text-zinc-700 hover:text-black hover:bg-zinc-100 rounded-full transition-all"
              aria-label="Instagram profile"
            >
              <InstagramIcon className="w-5 h-5" />
            </a>

            {/* WhatsApp Concierge */}
            <a
              href={getGeneralWhatsAppUrl("Hi VIA, I want to explore your latest collection.")}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-3 py-1.5 bg-emerald-50 border border-emerald-500/30 hover:border-emerald-600 text-emerald-700 hover:text-emerald-800 rounded-none transition-all text-xs font-bold tracking-wider uppercase shadow-xs"
              aria-label="WhatsApp Concierge"
            >
              <MessageCircle className="w-4 h-4 text-emerald-600" />
              <span className="hidden lg:inline text-[11px]">Chat on WhatsApp</span>
            </a>

            {/* Mobile Hamburger Menu Button */}
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
        <div className="fixed inset-0 top-[65px] z-30 bg-white/98 backdrop-blur-2xl md:hidden flex flex-col justify-between p-6 border-t border-zinc-200 animate-fadeIn">
          <div className="flex flex-col gap-6 mt-4">
            {navLinks.map((link) => (
              <NavLink
                key={link.name}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className={({ isActive }) =>
                  `text-2xl font-bold tracking-[0.15em] uppercase font-heading transition-all ${
                    isActive ? "text-black pl-3 border-l-2 border-black font-black" : "text-zinc-500 hover:text-black"
                  }`
                }
              >
                {link.name}
              </NavLink>
            ))}
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

            <div className="flex items-center justify-between text-xs text-zinc-500 tracking-wider uppercase pt-2">
              <span>VIBE • IDENTITY • AUTHENTICITY</span>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-zinc-700 hover:text-black font-semibold"
              >
                @VIA.CLOTHING
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Search Modal */}
      <SearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}

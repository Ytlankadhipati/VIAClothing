import React, { useState } from "react";
import { Link } from "react-router-dom";
import { MessageCircle, ArrowRight, ShieldCheck, Truck, RefreshCw } from "lucide-react";
import InstagramIcon from "./InstagramIcon";
import { WHATSAPP_NUMBER, getGeneralWhatsAppUrl } from "../utils/whatsapp";
import { useToast } from "../context/ToastContext";

export default function Footer() {
  const [email, setEmail] = useState("");
  const { addToast } = useToast();

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!email.trim() || !email.includes("@")) {
      addToast("Please enter a valid email address", "error");
      return;
    }
    addToast("You have been subscribed to exclusive VIA drops!", "success");
    setEmail("");
  };

  return (
    <footer className="bg-[#f4f4f5] text-zinc-600 border-t border-zinc-200 pt-16 pb-12">
      {/* Guarantees Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-14 border-b border-zinc-200 grid grid-cols-1 sm:grid-cols-3 gap-6 text-center sm:text-left">
        <div className="flex items-center justify-center sm:justify-start gap-3.5">
          <Truck className="w-5 h-5 text-zinc-900 shrink-0" />
          <div>
            <h5 className="text-xs font-bold uppercase tracking-widest text-zinc-900">
              Pan-India Express Shipping
            </h5>
            <p className="text-[11px] text-zinc-500 mt-0.5">Free shipping on all prepaid orders</p>
          </div>
        </div>

        <div className="flex items-center justify-center sm:justify-start gap-3.5">
          <ShieldCheck className="w-5 h-5 text-zinc-900 shrink-0" />
          <div>
            <h5 className="text-xs font-bold uppercase tracking-widest text-zinc-900">
              240+ GSM Heavyweight
            </h5>
            <p className="text-[11px] text-zinc-500 mt-0.5">100% Super Combed Bio-Washed Cotton</p>
          </div>
        </div>

        <div className="flex items-center justify-center sm:justify-start gap-3.5">
          <RefreshCw className="w-5 h-5 text-zinc-900 shrink-0" />
          <div>
            <h5 className="text-xs font-bold uppercase tracking-widest text-zinc-900">
              7-Day Size Exchange
            </h5>
            <p className="text-[11px] text-zinc-500 mt-0.5">Hassle-free direct WhatsApp assistance</p>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
        {/* Brand Column */}
        <div className="lg:col-span-2 flex flex-col gap-4">
          <Link to="/" className="flex items-center gap-3">
            <img
              src="/assets/via-logo.png"
              alt="VIA"
              className="h-12 w-auto object-contain"
            />
            <div className="flex flex-col">
              <span className="font-heading font-black tracking-[0.25em] text-xl text-zinc-900">
                VIA
              </span>
              <span className="text-[9px] uppercase tracking-[0.2em] text-zinc-500 font-semibold">
                VIBE • IDENTITY • AUTHENTICITY
              </span>
            </div>
          </Link>
          <p className="text-xs text-zinc-500 leading-relaxed max-w-sm">
            VIA is an independent luxury streetwear brand designed for those who carve their own path. Uncompromising fabric weight, architectural silhouettes, and authentic craftsmanship.
          </p>

          <div className="flex items-center gap-3 pt-2">
            <a
              href="https://www.instagram.com/via.clothing.brand/"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2.5 bg-white border border-zinc-300 hover:border-black text-zinc-800 hover:text-black transition-colors shadow-2xs flex items-center gap-2"
              aria-label="VIA Instagram @via.clothing.brand"
            >
              <InstagramIcon className="w-4 h-4" />
              <span className="text-[11px] font-bold">@via.clothing.brand</span>
            </a>
            <a
              href={getGeneralWhatsAppUrl("Hi VIA, I want to connect with support.")}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2.5 bg-white border border-zinc-300 hover:border-emerald-600 text-zinc-800 hover:text-emerald-600 transition-colors shadow-2xs"
              aria-label="VIA WhatsApp"
            >
              <MessageCircle className="w-4 h-4" />
            </a>
          </div>
        </div>

        {/* Navigation */}
        <div>
          <h4 className="text-xs font-bold uppercase tracking-widest text-zinc-900 mb-4">
            Navigation
          </h4>
          <ul className="space-y-2.5 text-xs">
            <li>
              <Link to="/shop" className="hover:text-black transition-colors">
                Shop All
              </Link>
            </li>
            <li>
              <Link to="/collections" className="hover:text-black transition-colors">
                Collections
              </Link>
            </li>
            <li>
              <Link to="/shop?category=Oversized+Tees" className="hover:text-black transition-colors">
                Oversized Tees
              </Link>
            </li>
            <li>
              <Link to="/shop?category=Hoodies" className="hover:text-black transition-colors">
                Heavy Hoodies
              </Link>
            </li>
            <li>
              <Link to="/shop?collection=New+Drop" className="hover:text-black transition-colors">
                New Arrivals
              </Link>
            </li>
          </ul>
        </div>

        {/* Company & Support */}
        <div>
          <h4 className="text-xs font-bold uppercase tracking-widest text-zinc-900 mb-4">
            Customer Care
          </h4>
          <ul className="space-y-2.5 text-xs">
            <li>
              <Link to="/about" className="hover:text-black transition-colors">
                About The Brand
              </Link>
            </li>
            <li>
              <Link to="/contact" className="hover:text-black transition-colors">
                Contact & Orders
              </Link>
            </li>
            <li>
              <a
                href={getGeneralWhatsAppUrl("Hi VIA, I need help with size recommendations.")}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-black transition-colors"
              >
                Size Recommendation
              </a>
            </li>
            <li>
              <Link to="/contact#faq" className="hover:text-black transition-colors">
                Shipping & Returns FAQ
              </Link>
            </li>
          </ul>
        </div>

        {/* VIP Drops Newsletter */}
        <div>
          <h4 className="text-xs font-bold uppercase tracking-widest text-zinc-900 mb-3">
            VIP Drop Access
          </h4>
          <p className="text-xs text-zinc-500 mb-3 leading-relaxed">
            Get private access to limited capsule releases before public launch.
          </p>
          <form onSubmit={handleSubscribe} className="space-y-2">
            <div className="relative">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="w-full bg-white border border-zinc-300 px-3.5 py-2.5 text-xs text-zinc-900 placeholder-zinc-400 focus:outline-none focus:border-black shadow-2xs"
              />
              <button
                type="submit"
                className="absolute right-1 top-1 bottom-1 px-3 bg-black hover:bg-zinc-800 text-white text-xs font-bold transition-colors flex items-center justify-center"
                aria-label="Subscribe"
              >
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 border-t border-zinc-200 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-zinc-500">
        <p>© 2026 VIA Clothing. All rights reserved.</p>
        <div className="flex items-center gap-6 uppercase tracking-wider text-[10px]">
          <span>WhatsApp Orders: +{WHATSAPP_NUMBER}</span>
          <span>•</span>
          <span>Pan India Delivery</span>
        </div>
      </div>
    </footer>
  );
}

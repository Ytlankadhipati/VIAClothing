import React, { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, ArrowUpRight, Sparkles, Shield, Flame, Compass, MessageCircle } from "lucide-react";
import { PRODUCTS } from "../data/products";
import { COLLECTIONS_DATA } from "../data/collections";
import ProductGrid from "../components/ProductGrid";
import MarqueeBanner from "../components/MarqueeBanner";
import Hero3DCanvas from "../components/Hero3DCanvas";
import Rotating3DBadge from "../components/Rotating3DBadge";
import { useToast } from "../context/ToastContext";
import { getGeneralWhatsAppUrl } from "../utils/whatsapp";

export default function Home() {
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const { addToast } = useToast();

  const featuredProducts = PRODUCTS.filter((p) => p.featured).slice(0, 4);
  const newArrivals = PRODUCTS.filter((p) => p.newArrival).slice(0, 4);

  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    if (!newsletterEmail.trim() || !newsletterEmail.includes("@")) {
      addToast("Please enter a valid email address", "error");
      return;
    }
    addToast("Welcome to VIA. You will receive private drop notices.", "success");
    setNewsletterEmail("");
  };

  const instagramPosts = [
    {
      img: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=800&q=80",
      tag: "#VIAESSENTIALS",
    },
    {
      img: "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=800&q=80",
      tag: "#VIACREED",
    },
    {
      img: "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=800&q=80",
      tag: "#DEFINEYOUROWN",
    },
    {
      img: "https://images.unsplash.com/photo-1552902865-b72c031ac5ea?auto=format&fit=crop&w=800&q=80",
      tag: "#VIACARGO",
    },
    {
      img: "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&w=800&q=80",
      tag: "#NEWDROP",
    },
    {
      img: "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?auto=format&fit=crop&w=800&q=80",
      tag: "#VIALUXURY",
    },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      {/* 1. HERO SECTION WITH INTERACTIVE 3D WEBGL ENGINE */}
      <section className="relative min-h-[92vh] lg:min-h-[96vh] flex items-center justify-center overflow-hidden bg-black">
        {/* Background Image with Dark Vignette & Gradient Overlays */}
        <div className="absolute inset-0 z-0 pointer-events-none">
          <img
            src="https://images.unsplash.com/photo-1509967419530-da38b4704bc6?auto=format&fit=crop&w=2000&q=90"
            alt="VIA Streetwear Campaign"
            className="w-full h-full object-cover object-center filter brightness-35 scale-105 transition-transform duration-1000 ease-out"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-black/40 to-black/70" />
        </div>

        {/* Interactive 3D Canvas Layer */}
        <div className="absolute inset-0 z-5 flex items-center justify-center opacity-85">
          <Hero3DCanvas />
        </div>

        {/* Hero Content Overlay */}
        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 text-center flex flex-col items-center pt-8 pb-12 pointer-events-none">
          {/* Official Logo Brand Mark */}
          <div className="mb-4 flex flex-col items-center animate-fadeIn pointer-events-auto">
            <img
              src="/assets/via-logo.png"
              alt="VIA Brand Emblem"
              className="h-20 sm:h-28 md:h-36 w-auto object-contain filter brightness-125 drop-shadow-[0_0_35px_rgba(255,255,255,0.3)] hover:scale-105 transition-transform duration-500"
            />
          </div>

          <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 border border-white/20 backdrop-blur-md mb-6 pointer-events-auto">
            <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping"></span>
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-200">
              AUTUMN / WINTER 2026 CAPSULE • INTERACTIVE 3D
            </span>
          </div>

          <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black uppercase tracking-tight text-white mb-6 leading-none pointer-events-auto">
            DEFINE YOUR OWN
          </h1>

          <p className="max-w-xl text-xs sm:text-sm md:text-base text-zinc-300 tracking-widest uppercase font-medium mb-8 leading-relaxed pointer-events-auto">
            Vibe • Identity • Authenticity. Heavyweight 240+ GSM silhouettes engineered for those who move beyond conventions.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center gap-4 w-full max-w-md justify-center pointer-events-auto mb-6">
            <Link
              to="/shop"
              className="w-full sm:w-auto px-8 py-4 bg-white hover:bg-zinc-200 text-black font-black text-xs uppercase tracking-[0.25em] transition-all transform hover:-translate-y-0.5 shadow-2xl flex items-center justify-center gap-2 text-center"
            >
              Shop Now
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              to="/collections"
              className="w-full sm:w-auto px-8 py-4 bg-black/60 hover:bg-zinc-900/90 border border-zinc-700 hover:border-zinc-400 text-white font-bold text-xs uppercase tracking-[0.25em] transition-all backdrop-blur-md flex items-center justify-center text-center"
            >
              Explore Collections
            </Link>
          </div>

          {/* 3D Floating Interactive Badge */}
          <div className="pointer-events-auto">
            <Rotating3DBadge />
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-10 text-zinc-500 pointer-events-none">
          <span className="text-[9px] uppercase tracking-[0.3em]">Drag to rotate 3D • Scroll</span>
          <div className="w-[1px] h-8 bg-gradient-to-b from-white/60 to-transparent"></div>
        </div>
      </section>

      {/* Marquee Banner */}
      <MarqueeBanner />

      {/* 2. FEATURED PRODUCTS */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 border-b border-zinc-200 pb-6 gap-4">
          <div>
            <span className="text-[10px] uppercase font-black tracking-[0.3em] text-zinc-500">
              Curated Essentials
            </span>
            <h2 className="text-3xl sm:text-4xl font-black uppercase tracking-tight text-zinc-900 mt-1">
              Featured Drops
            </h2>
          </div>
          <Link
            to="/shop"
            className="text-xs font-bold uppercase tracking-widest text-zinc-600 hover:text-black flex items-center gap-2 group"
          >
            Explore All Products
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        <ProductGrid products={featuredProducts} />
      </section>

      {/* 3. EDITORIAL COLLECTIONS SHOWCASE */}
      <section className="py-16 bg-zinc-100/70 border-y border-zinc-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-[10px] uppercase font-black tracking-[0.3em] text-zinc-500">
              The Architecture
            </span>
            <h2 className="text-3xl sm:text-4xl font-black uppercase tracking-tight text-zinc-900 mt-1 mb-3">
              Seasonal Collections
            </h2>
            <p className="text-xs text-zinc-600 uppercase tracking-wider font-medium">
              Distinctive design languages rooted in substance and silhouette.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {COLLECTIONS_DATA.map((col) => (
              <Link
                key={col.id}
                to={col.link}
                className="group relative aspect-4/5 overflow-hidden bg-zinc-900 border border-zinc-200 shadow-sm flex flex-col justify-end p-6 transition-all duration-500"
              >
                <img
                  src={col.image}
                  alt={col.name}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 filter brightness-60 group-hover:brightness-50"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />

                <div className="relative z-10">
                  <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-zinc-300">
                    {col.itemCount}
                  </span>
                  <h3 className="text-xl font-black uppercase tracking-wider text-white mt-1 mb-2">
                    {col.name}
                  </h3>
                  <p className="text-[11px] text-zinc-200 line-clamp-2 leading-relaxed mb-4 opacity-90 group-hover:opacity-100 transition-opacity">
                    {col.tagline}
                  </p>
                  <span className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-widest text-white group-hover:underline">
                    Explore <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 4. NEW ARRIVALS */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 border-b border-zinc-200 pb-6 gap-4">
          <div>
            <span className="text-[10px] uppercase font-black tracking-[0.3em] text-zinc-500">
              Fresh Off The Line
            </span>
            <h2 className="text-3xl sm:text-4xl font-black uppercase tracking-tight text-zinc-900 mt-1">
              New Arrivals
            </h2>
          </div>
          <Link
            to="/shop?collection=New+Drop"
            className="px-5 py-2.5 bg-black hover:bg-zinc-800 text-xs font-bold uppercase tracking-widest text-white transition-colors shadow-xs"
          >
            View All New Drops
          </Link>
        </div>

        <ProductGrid products={newArrivals} />
      </section>

      {/* 5. BRAND STORY EDITORIAL SPLIT */}
      <section className="py-20 bg-white border-t border-zinc-200 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Visual Column */}
            <div className="lg:col-span-6 relative aspect-4/5 bg-zinc-100 overflow-hidden border border-zinc-200 shadow-sm">
              <img
                src="https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&w=1200&q=85"
                alt="VIA Craftsmanship & Ethos"
                className="w-full h-full object-cover filter contrast-105"
              />
              <div className="absolute bottom-6 left-6 right-6 p-4 bg-white/95 backdrop-blur-md border border-zinc-200 shadow-lg">
                <p className="text-[10px] uppercase tracking-[0.25em] text-zinc-500 font-mono">
                  ARCHIVAL SPEC NO. 2026-VIA
                </p>
                <p className="text-xs font-black uppercase tracking-wider text-zinc-900 mt-1">
                  100% Super Combed Bio-Washed Cotton • Heavyweight 240-420 GSM
                </p>
              </div>
            </div>

            {/* Editorial Content */}
            <div className="lg:col-span-6 flex flex-col justify-center">
              <div className="inline-flex items-center gap-2 text-zinc-500 mb-3">
                <span className="text-[10px] uppercase font-black tracking-[0.3em]">
                  The VIA Ethos
                </span>
              </div>

              <h2 className="text-3xl sm:text-5xl font-black uppercase tracking-tight text-zinc-900 mb-6 leading-tight">
                Built For Those Who Don't Follow The Ordinary.
              </h2>

              <div className="space-y-4 text-xs sm:text-sm text-zinc-600 leading-relaxed mb-8 font-normal">
                <p>
                  VIA was founded on an unapologetic premise: streetwear should not be fast fashion. It should have weight, architectural balance, and a commanding presence.
                </p>
                <p>
                  Every garment represents our core trinity — <strong className="text-zinc-900 font-bold">Vibe</strong> that sets the tone, an unmistakable <strong className="text-zinc-900 font-bold">Identity</strong>, and unyielding <strong className="text-zinc-900 font-bold">Authenticity</strong>.
                </p>
                <p>
                  From custom pre-shrunk heavyweight cotton to drop-shoulder boxy cuts engineered for Indian streetwear enthusiasts, we construct pieces that last for years.
                </p>
              </div>

              <div className="flex items-center gap-6">
                <Link
                  to="/about"
                  className="px-6 py-3.5 bg-black hover:bg-zinc-800 text-white font-black uppercase tracking-widest text-xs transition-colors flex items-center gap-2 shadow-sm"
                >
                  Read Our Story <ArrowRight className="w-4 h-4" />
                </Link>
                <a
                  href={getGeneralWhatsAppUrl("Hi VIA, I want to learn more about the brand and custom bulk orders.")}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-bold uppercase tracking-wider text-zinc-700 hover:text-emerald-600 transition-colors flex items-center gap-1.5"
                >
                  <MessageCircle className="w-4 h-4 text-emerald-600" /> WhatsApp Us
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. WHY VIA / CRAFTSMANSHIP PILLARS */}
      <section className="py-20 bg-zinc-50 border-t border-zinc-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-xl mx-auto mb-16">
            <span className="text-[10px] uppercase font-black tracking-[0.3em] text-zinc-500">
              The Standard
            </span>
            <h2 className="text-3xl font-black uppercase tracking-tight text-zinc-900 mt-1">
              Why VIA
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="p-6 bg-white border border-zinc-200 shadow-2xs flex flex-col items-start">
              <div className="p-3 bg-zinc-900 text-white mb-4 shadow-xs">
                <Shield className="w-6 h-6" />
              </div>
              <h3 className="text-sm font-bold uppercase tracking-widest text-zinc-900 mb-2">
                240+ GSM Heavyweight
              </h3>
              <p className="text-xs text-zinc-600 leading-relaxed">
                Super combed 100% bio-washed cotton that gives structural rigidity, flawless drape, and zero transparency.
              </p>
            </div>

            <div className="p-6 bg-white border border-zinc-200 shadow-2xs flex flex-col items-start">
              <div className="p-3 bg-zinc-900 text-white mb-4 shadow-xs">
                <Compass className="w-6 h-6" />
              </div>
              <h3 className="text-sm font-bold uppercase tracking-widest text-zinc-900 mb-2">
                Original Boxy Cuts
              </h3>
              <p className="text-xs text-zinc-600 leading-relaxed">
                Tailored drop-shoulders and widened sleeves precisely balanced for an authentic oversized streetwear profile.
              </p>
            </div>

            <div className="p-6 bg-white border border-zinc-200 shadow-2xs flex flex-col items-start">
              <div className="p-3 bg-zinc-900 text-white mb-4 shadow-xs">
                <Flame className="w-6 h-6" />
              </div>
              <h3 className="text-sm font-bold uppercase tracking-widest text-zinc-900 mb-2">
                Archival Prints
              </h3>
              <p className="text-xs text-zinc-600 leading-relaxed">
                High-density screen and puff print inks cured at high temperatures to prevent cracking after repeated washes.
              </p>
            </div>

            <div className="p-6 bg-white border border-zinc-200 shadow-2xs flex flex-col items-start">
              <div className="p-3 bg-zinc-900 text-white mb-4 shadow-xs">
                <Sparkles className="w-6 h-6" />
              </div>
              <h3 className="text-sm font-bold uppercase tracking-widest text-zinc-900 mb-2">
                Direct WhatsApp VIP
              </h3>
              <p className="text-xs text-zinc-600 leading-relaxed">
                No slow ticketing systems. Order, exchange sizes, and consult directly with our dedicated concierge on WhatsApp.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 7. INSTAGRAM SOCIAL FEED */}
      <section className="py-20 bg-white border-t border-zinc-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
            <div>
              <span className="text-[10px] uppercase font-black tracking-[0.3em] text-zinc-500">
                Community
              </span>
              <h2 className="text-3xl font-black uppercase tracking-tight text-zinc-900 mt-1">
                FOLLOW @VIA.CLOTHING
              </h2>
            </div>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-bold uppercase tracking-widest text-zinc-900 hover:underline flex items-center gap-1.5"
            >
              Tag us to be featured <ArrowUpRight className="w-4 h-4" />
            </a>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {instagramPosts.map((post, i) => (
              <a
                key={i}
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="group relative aspect-square overflow-hidden bg-zinc-100 border border-zinc-200 block shadow-2xs"
              >
                <img
                  src={post.img}
                  alt={`VIA community ${i + 1}`}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 filter brightness-95 group-hover:brightness-85"
                />
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/40">
                  <span className="text-[10px] font-black uppercase tracking-widest text-white px-2 py-1 bg-black/85 border border-zinc-600">
                    {post.tag}
                  </span>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* 8. VIP DROPS NEWSLETTER */}
      <section className="py-20 bg-zinc-100 border-t border-zinc-200 text-center">
        <div className="max-w-2xl mx-auto px-4 sm:px-6">
          <span className="text-[10px] uppercase font-black tracking-[0.3em] text-zinc-500">
            Exclusive Access
          </span>
          <h2 className="text-3xl sm:text-4xl font-black uppercase tracking-tight text-zinc-900 mt-1 mb-4">
            JOIN THE VIA COMMUNITY
          </h2>
          <p className="text-xs sm:text-sm text-zinc-600 uppercase tracking-wider mb-8 leading-relaxed font-medium">
            Be the first to access limited capsule drops, private lookbooks, and VIP discount links.
          </p>

          <form onSubmit={handleNewsletterSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input
              type="email"
              value={newsletterEmail}
              onChange={(e) => setNewsletterEmail(e.target.value)}
              placeholder="Enter your email"
              className="flex-1 bg-white border border-zinc-300 px-4 py-3.5 text-xs text-zinc-900 placeholder-zinc-400 focus:outline-none focus:border-black transition-colors shadow-2xs"
            />
            <button
              type="submit"
              className="px-8 py-3.5 bg-black hover:bg-zinc-800 text-white text-xs font-black uppercase tracking-widest transition-colors shrink-0 shadow-sm"
            >
              SUBSCRIBE
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}

import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, ArrowUpRight, Sparkles, Shield, Flame, Compass, MessageCircle } from "lucide-react";
import { productService } from "../services/productService";
import { COLLECTIONS_DATA } from "../data/collections";
import ProductGrid from "../components/ProductGrid";
import MarqueeBanner from "../components/MarqueeBanner";
import HeroSlideshow, { DEFAULT_HERO_SLIDES } from "../components/HeroSlideshow";
import Rotating3DBadge from "../components/Rotating3DBadge";
import { useToast } from "../context/ToastContext";
import { getGeneralWhatsAppUrl } from "../utils/whatsapp";

export default function Home() {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [newArrivals, setNewArrivals] = useState([]);
  const [tshirtProducts, setTshirtProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const { addToast } = useToast();

  useEffect(() => {
    const fetchHomeProducts = async () => {
      try {
        setLoading(true);
        const [featRes, newRes, tshirtRes] = await Promise.all([
          productService.getProducts({ featured: "true", limit: 4 }),
          productService.getProducts({ newArrival: "true", limit: 4 }),
          productService.getProducts({ category: "tshirt", limit: 12 }),
        ]);

        if (featRes.success && featRes.data.products) {
          setFeaturedProducts(featRes.data.products);
        }
        if (newRes.success && newRes.data.products) {
          setNewArrivals(newRes.data.products);
        }
        if (tshirtRes.success && tshirtRes.data.products) {
          setTshirtProducts(tshirtRes.data.products);
        }
      } catch (err) {
        console.warn("Home products fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchHomeProducts();
  }, []);

  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    if (!newsletterEmail.trim() || !newsletterEmail.includes("@")) {
      addToast("Please enter a valid email address", "error");
      return;
    }
    addToast("Welcome to VIA. You will receive private drop notices.", "success");
    setNewsletterEmail("");
  };

  // Drop feed: dynamically built from live T-shirt catalog (auto-syncs with admin)

  return (
    <div className="flex flex-col min-h-screen w-full max-w-full overflow-x-hidden">
      {/* 1. HERO SECTION WITH AUTO-ROTATING IMAGE SLIDESHOW */}
      <section className="relative overflow-hidden bg-black">
        <HeroSlideshow images={DEFAULT_HERO_SLIDES}>
          {/* Hero Content Overlay */}
          <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 text-center flex flex-col items-center pt-6 sm:pt-8 pb-14 sm:pb-16 pointer-events-none">
            {/* Official Logo Brand Mark */}
            <div className="mb-3 sm:mb-4 flex flex-col items-center animate-fadeIn pointer-events-auto">
              <img
                src="/assets/via-logo.png"
                alt="VIA Brand Emblem"
                className="h-16 sm:h-28 md:h-36 w-auto object-contain filter brightness-125 drop-shadow-[0_0_35px_rgba(255,255,255,0.3)] hover:scale-105 transition-transform duration-500"
              />
            </div>

            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 border border-white/20 backdrop-blur-md mb-4 sm:mb-6 pointer-events-auto">
              <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping"></span>
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-200">
                <span className="sm:hidden">AW26 CAPSULE</span>
                <span className="hidden sm:inline">AUTUMN / WINTER 2026 CAPSULE</span>
              </span>
            </div>

            <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black uppercase tracking-tight text-white mb-4 sm:mb-6 leading-none pointer-events-auto [text-shadow:0_2px_14px_rgba(0,0,0,0.6)]">
              DEFINE YOUR OWN
            </h1>

            <p className="max-w-xl text-xs sm:text-sm md:text-base text-zinc-100 tracking-widest uppercase font-medium mb-6 sm:mb-8 leading-relaxed pointer-events-auto [text-shadow:0_1px_10px_rgba(0,0,0,0.7)]">
              Heavyweight 240+ GSM streetwear for those who move differently.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4 w-full max-w-md justify-center pointer-events-auto mb-4 sm:mb-6">
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

            {/* 3D Floating Interactive Badge — hidden on small phones to keep
                the hero from feeling crowded; the GSM/fabric detail is also
                covered on the product pages. */}
            <div className="hidden sm:block pointer-events-auto">
              <Rotating3DBadge />
            </div>
          </div>
        </HeroSlideshow>
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
            <span>View All Pieces</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        <ProductGrid products={featuredProducts} />
      </section>

      {/* 3. BRAND PILLARS */}
      <section className="bg-black text-white py-24 border-y border-zinc-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-[10px] uppercase font-black tracking-[0.3em] text-zinc-400">
              The Code
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black uppercase tracking-tight text-white mt-2">
              Engineered For Immortality
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="border border-zinc-800 bg-zinc-950/60 p-8 flex flex-col items-start hover:border-zinc-600 transition-colors">
              <div className="p-3 bg-zinc-900 border border-zinc-800 text-white mb-6">
                <Flame className="w-6 h-6" />
              </div>
              <h3 className="font-heading font-black text-xl uppercase tracking-wider mb-3 text-white">
                Heavyweight 240+ GSM
              </h3>
              <p className="text-xs text-zinc-400 leading-relaxed uppercase tracking-wider">
                100% super combed bio-washed cotton engineered with substantial structural drape and zero shrinkage guarantee.
              </p>
            </div>

            <div className="border border-zinc-800 bg-zinc-950/60 p-8 flex flex-col items-start hover:border-zinc-600 transition-colors">
              <div className="p-3 bg-zinc-900 border border-zinc-800 text-white mb-6">
                <Compass className="w-6 h-6" />
              </div>
              <h3 className="font-heading font-black text-xl uppercase tracking-wider mb-3 text-white">
                Archival Silhouette
              </h3>
              <p className="text-xs text-zinc-400 leading-relaxed uppercase tracking-wider">
                Exaggerated boxy drop-shoulders and widened sleeves designed to hang effortlessly on every frame.
              </p>
            </div>

            <div className="border border-zinc-800 bg-zinc-950/60 p-8 flex flex-col items-start hover:border-zinc-600 transition-colors">
              <div className="p-3 bg-zinc-900 border border-zinc-800 text-white mb-6">
                <Shield className="w-6 h-6" />
              </div>
              <h3 className="font-heading font-black text-xl uppercase tracking-wider mb-3 text-white">
                Made in India
              </h3>
              <p className="text-xs text-zinc-400 leading-relaxed uppercase tracking-wider">
                Crafted in limited small-batch numbers to ensure uncompromising quality, ethical production, and exclusivity.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. NEW ARRIVALS */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 border-b border-zinc-200 pb-6 gap-4">
          <div>
            <span className="text-[10px] uppercase font-black tracking-[0.3em] text-zinc-500">
              Limited Edition
            </span>
            <h2 className="text-3xl sm:text-4xl font-black uppercase tracking-tight text-zinc-900 mt-1">
              New Arrivals
            </h2>
          </div>
          <Link
            to="/shop?filter=new"
            className="text-xs font-bold uppercase tracking-widest text-zinc-600 hover:text-black flex items-center gap-2 group"
          >
            <span>Explore Drops</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        <ProductGrid products={newArrivals} />
      </section>

      {/* 5. EDITORIAL CAMPAIGN BANNER */}
      <section className="relative py-28 bg-black overflow-hidden border-y border-zinc-800">
        <div className="absolute inset-0 opacity-50">
          <img
            src="/assets/hero-man-streetwear.jpg"
            alt="VIA Editorial"
            className="w-full h-full object-cover object-top"
          />
        </div>
        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 text-center text-white space-y-6">
          <span className="text-[11px] font-black uppercase tracking-[0.4em] text-zinc-300">
            VIA CAPSULE ARCHIVE
          </span>
          <h2 className="text-3xl sm:text-5xl md:text-6xl font-black uppercase tracking-tight leading-none">
            REJECT THE ORDINARY
          </h2>
          <p className="max-w-xl mx-auto text-xs sm:text-sm uppercase tracking-widest text-zinc-300 leading-relaxed">
            Streetwear crafted as modern armor. Built for the creators, night-crawlers, and visionaries.
          </p>
          <div className="pt-4 flex justify-center">
            <Link
              to="/shop"
              className="px-10 py-4 bg-white hover:bg-zinc-200 text-black font-black text-xs uppercase tracking-[0.25em] transition-all shadow-2xl"
            >
              Shop All Drops
            </Link>
          </div>
        </div>
      </section>

      {/* 6. INSTAGRAM UGC GRID */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-10 border-b border-zinc-200 pb-4 gap-4">
            <div className="min-w-0 max-w-full">
              <span className="text-[10px] uppercase font-black tracking-[0.3em] text-zinc-500">
                Official Instagram Channel
              </span>
              <h3 className="text-base sm:text-xl md:text-2xl font-black uppercase text-zinc-900 mt-1 break-all sm:break-normal">
                @via.clothing.brand Drop Feed
              </h3>
            </div>
            <a
              href="https://www.instagram.com/via.clothing.brand/"
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 bg-black text-white hover:bg-zinc-800 text-xs font-black uppercase tracking-wider flex items-center gap-2 mt-2 sm:mt-0 transition-colors shadow-sm"
            >
              <span>Follow @via.clothing.brand</span>
              <ArrowUpRight className="w-4 h-4 text-amber-400" />
            </a>
          </div>

          {/* Dynamic T-shirt drop feed — auto-synced with product catalog */}
          {tshirtProducts.length === 0 ? (
            // Skeleton placeholders while loading
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="aspect-square bg-zinc-100 border border-zinc-200 animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
              {tshirtProducts.slice(0, 6).map((product) => {
                // Prefer Cloudinary images[] first, then thumbnail only if it's a real CDN URL (not local logo fallback)
                const cloudinaryImg = product.images?.find((u) => u && u.startsWith("http"));
                const thumbImg = product.thumbnail?.startsWith("http") ? product.thumbnail : null;
                const img = cloudinaryImg || thumbImg || "/assets/via-logo.png";
                const tag = `#VIA.${product.name.split(" ")[0].toUpperCase()}`;
                const slug = product.slug || product._id;
                return (
                  <Link
                    key={product._id}
                    to={`/product/${slug}`}
                    className="group relative aspect-square overflow-hidden bg-zinc-100 border border-zinc-200 block"
                    title={product.name}
                  >
                    <img
                      src={img}
                      alt={product.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-black/75 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center p-3 text-center">
                      <span className="text-[11px] font-black uppercase tracking-wider text-amber-400">
                        {tag}
                      </span>
                      <span className="text-[9px] text-zinc-300 font-semibold mt-1 line-clamp-2">
                        {product.name}
                      </span>
                      <span className="text-[9px] text-white/60 font-bold mt-1 uppercase tracking-wider">
                        ₹{product.price?.toLocaleString("en-IN")}
                      </span>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* 7. PRIVATE DROP NEWSLETTER */}
      <section className="py-20 bg-zinc-950 text-white border-t border-zinc-800">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center space-y-6">
          <span className="text-[10px] uppercase font-black tracking-[0.4em] text-zinc-500">
            Exclusive Access
          </span>
          <h2 className="text-3xl sm:text-4xl font-black uppercase tracking-tight text-white">
            Join The Inner Circle
          </h2>
          <p className="text-xs sm:text-sm text-zinc-400 uppercase tracking-widest max-w-md mx-auto leading-relaxed">
            Subscribe for secret drops, password-protected releases, and private discount codes.
          </p>

          <form onSubmit={handleNewsletterSubmit} className="flex flex-col sm:flex-row gap-2 max-w-md mx-auto pt-2">
            <input
              type="email"
              placeholder="YOUR.EMAIL@EXAMPLE.COM"
              value={newsletterEmail}
              onChange={(e) => setNewsletterEmail(e.target.value)}
              className="flex-1 px-4 py-3.5 bg-zinc-900 border border-zinc-800 text-xs text-white placeholder-zinc-500 uppercase font-bold tracking-wider outline-hidden focus:border-white"
            />
            <button
              type="submit"
              className="px-8 py-3.5 bg-white hover:bg-zinc-200 text-black text-xs font-black uppercase tracking-widest transition-all whitespace-nowrap"
            >
              Subscribe
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}
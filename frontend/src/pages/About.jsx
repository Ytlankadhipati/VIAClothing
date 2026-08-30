import React from "react";
import { Link } from "react-router-dom";
import { Shield, Sparkles, Feather, Compass, ArrowRight, MessageCircle } from "lucide-react";
import { getGeneralWhatsAppUrl } from "../utils/whatsapp";

export default function About() {
  return (
    <div className="min-h-screen bg-[#fafafa] text-zinc-700 py-12 md:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Editorial Header */}
        <div className="border-b border-zinc-200 pb-12 mb-16 max-w-4xl mx-auto text-center">
          <div className="flex justify-center mb-6">
            <img
              src="/assets/via-logo.png"
              alt="VIA Crest"
              className="h-24 md:h-32 w-auto object-contain"
            />
          </div>

          <span className="text-[10px] uppercase font-black tracking-[0.35em] text-zinc-500 mb-3 block">
            MANIFIESTO & ORIGINS
          </span>

          <h1 className="text-4xl sm:text-6xl md:text-7xl font-black uppercase tracking-tight text-zinc-900 mb-6 leading-none">
            VIBE • IDENTITY • AUTHENTICITY
          </h1>

          <p className="text-xs sm:text-sm md:text-base text-zinc-600 uppercase tracking-widest leading-relaxed max-w-2xl mx-auto font-medium">
            VIA is not built for trends. It is engineered for those who demand substance, weight, and uncompromising presence in their everyday uniform.
          </p>
        </div>

        {/* Section 1: The Story & Split View */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center mb-24">
          <div className="lg:col-span-6 space-y-6">
            <span className="text-xs font-mono uppercase tracking-widest text-zinc-500">
              01 // THE ORIGIN
            </span>
            <h2 className="text-3xl sm:text-4xl font-black uppercase tracking-tight text-zinc-900">
              Redefining Modern Indian Streetwear
            </h2>
            <p className="text-xs sm:text-sm text-zinc-600 leading-relaxed">
              In a market saturated with lightweight, flimsy graphic tees, VIA emerged from a singular desire: to craft heavy, durable, luxury-standard streetwear right here in India.
            </p>
            <p className="text-xs sm:text-sm text-zinc-600 leading-relaxed">
              We spent over 18 months refining our custom textile knits, testing bio-washing treatments, and precision-tailoring our drop-shoulder patterns. The result is a silhouette that hangs with natural authority, resists repeated washing, and feels genuinely expensive from the first touch.
            </p>
          </div>

          <div className="lg:col-span-6 relative aspect-4/3 bg-zinc-100 border border-zinc-200 shadow-sm overflow-hidden">
            <img
              src="https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=1200&q=85"
              alt="VIA Studio Process"
              className="w-full h-full object-cover filter contrast-105"
            />
          </div>
        </div>

        {/* Section 2: The Three Pillars (VIA Trinity) */}
        <div className="mb-24 bg-white border border-zinc-200 shadow-sm p-8 sm:p-12">
          <div className="text-center max-w-xl mx-auto mb-12">
            <span className="text-xs font-mono uppercase tracking-widest text-zinc-500">
              02 // THE FOUNDATION
            </span>
            <h2 className="text-3xl font-black uppercase tracking-tight text-zinc-900 mt-1">
              What VIA Represents
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 bg-zinc-50 border border-zinc-200 shadow-2xs flex flex-col items-start">
              <span className="text-2xl font-black text-zinc-900 font-mono mb-2">01</span>
              <h3 className="text-lg font-black uppercase tracking-wider text-zinc-900 mb-2">
                VIBE
              </h3>
              <p className="text-xs text-zinc-600 leading-relaxed">
                The unspoken aura carried by modern creators. Minimalist dark palettes, raw textures, and effortless confidence that speaks before words do.
              </p>
            </div>

            <div className="p-6 bg-zinc-50 border border-zinc-200 shadow-2xs flex flex-col items-start">
              <span className="text-2xl font-black text-zinc-900 font-mono mb-2">02</span>
              <h3 className="text-lg font-black uppercase tracking-wider text-zinc-900 mb-2">
                IDENTITY
              </h3>
              <p className="text-xs text-zinc-600 leading-relaxed">
                Streetwear is a canvas of self-expression. Our pieces are unencumbered by loud, temporary gimmicks, serving as a clean architectural foundation for your unique character.
              </p>
            </div>

            <div className="p-6 bg-zinc-50 border border-zinc-200 shadow-2xs flex flex-col items-start">
              <span className="text-2xl font-black text-zinc-900 font-mono mb-2">03</span>
              <h3 className="text-lg font-black uppercase tracking-wider text-zinc-900 mb-2">
                AUTHENTICITY
              </h3>
              <p className="text-xs text-zinc-600 leading-relaxed">
                No shortcuts. 240+ GSM pure combed cotton, real French terry loops, high-density screen inks, and direct personal customer care with no corporate runaround.
              </p>
            </div>
          </div>
        </div>

        {/* Section 3: The Craft & Material Standard */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center mb-20">
          <div className="lg:col-span-6 order-2 lg:order-1 relative aspect-4/3 bg-zinc-100 border border-zinc-200 shadow-sm overflow-hidden">
            <img
              src="https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=1200&q=85"
              alt="VIA Heavy French Terry"
              className="w-full h-full object-cover filter contrast-105"
            />
          </div>

          <div className="lg:col-span-6 order-1 lg:order-2 space-y-6">
            <span className="text-xs font-mono uppercase tracking-widest text-zinc-500">
              03 // THE CRAFT
            </span>
            <h2 className="text-3xl sm:text-4xl font-black uppercase tracking-tight text-zinc-900">
              Quality & Architectural Silhouette
            </h2>
            <div className="space-y-4 text-xs sm:text-sm text-zinc-600 leading-relaxed">
              <div className="border-l-2 border-black pl-4">
                <h4 className="font-black text-zinc-900 uppercase text-xs tracking-wider">
                  240 to 420 GSM Dense Weaves
                </h4>
                <p className="text-xs text-zinc-600 mt-1">
                  We use heavyweight single jersey and unbrushed looped cotton for substantial tactile hand-feel and cold-weather durability.
                </p>
              </div>

              <div className="border-l-2 border-black pl-4">
                <h4 className="font-black text-zinc-900 uppercase text-xs tracking-wider">
                  Engineered Drop-Shoulders
                </h4>
                <p className="text-xs text-zinc-600 mt-1">
                  Our patterns are drafted from scratch with wide necklines, dropped shoulder seams, and relaxed armholes for an organic boxy drape.
                </p>
              </div>

              <div className="border-l-2 border-black pl-4">
                <h4 className="font-black text-zinc-900 uppercase text-xs tracking-wider">
                  Anti-Shrink Pre-Washing
                </h4>
                <p className="text-xs text-zinc-600 mt-1">
                  Every batch undergoes enzymatic pre-treatment to ensure the size you buy stays the exact size you keep after multiple laundry cycles.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="border border-zinc-200 shadow-sm p-8 flex flex-col sm:flex-row items-center justify-between gap-6 bg-white">
          <div>
            <h3 className="text-2xl font-black uppercase text-zinc-900">
              Experience The Difference
            </h3>
            <p className="text-xs text-zinc-600 uppercase tracking-wider mt-1 font-medium">
              Explore our current catalog or talk to our concierge on WhatsApp.
            </p>
          </div>

          <div className="flex items-center gap-4">
            <Link
              to="/shop"
              className="px-8 py-3.5 bg-black hover:bg-zinc-800 text-white font-black uppercase tracking-widest text-xs transition-colors shadow-sm"
            >
              Shop All Products
            </Link>
            <a
              href={getGeneralWhatsAppUrl("Hi VIA, I want to inquire about custom drops.")}
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3.5 bg-zinc-100 hover:bg-zinc-200 border border-zinc-300 text-zinc-900 font-bold uppercase tracking-widest text-xs flex items-center gap-2"
            >
              <MessageCircle className="w-4 h-4 text-emerald-600" />
              Chat on WhatsApp
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

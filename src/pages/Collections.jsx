import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Layers, Sparkles } from "lucide-react";
import { COLLECTIONS_DATA } from "../data/collections";
import { PRODUCTS } from "../data/products";

export default function Collections() {
  return (
    <div className="min-h-screen bg-[#fafafa] py-12 md:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="border-b border-zinc-200 pb-8 mb-12 text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-black/5 border border-black/10 mb-4">
            <Layers className="w-3.5 h-3.5 text-zinc-900" />
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-800">
              ARCHIVAL LINEUP
            </span>
          </div>
          <h1 className="text-4xl sm:text-6xl font-black uppercase tracking-tight text-zinc-900 mb-4">
            COLLECTIONS
          </h1>
          <p className="text-xs sm:text-sm text-zinc-600 uppercase tracking-widest leading-relaxed font-medium">
            Each VIA capsule is designed as a standalone architectural system of heavyweight silhouettes, engineered drapes, and timeless minimalism.
          </p>
        </div>

        {/* Collections Stack / Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
          {COLLECTIONS_DATA.map((col, idx) => {
            const matchingProducts = PRODUCTS.filter(
              (p) => p.collection.toLowerCase() === col.name.toLowerCase()
            );

            return (
              <div
                key={col.id}
                className="group relative bg-white border border-zinc-200 shadow-sm hover:shadow-md overflow-hidden flex flex-col justify-between transition-all"
              >
                {/* Visual Banner */}
                <div className="relative aspect-16/10 sm:aspect-21/9 overflow-hidden bg-zinc-100">
                  <img
                    src={col.image}
                    alt={col.name}
                    className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105 filter brightness-75 group-hover:brightness-65"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

                  <div className="absolute top-4 left-4">
                    <span className="text-[10px] font-mono font-bold uppercase tracking-[0.25em] text-zinc-200 bg-black/80 px-2.5 py-1 border border-zinc-700">
                      CAPSULE 0{idx + 1}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 md:p-8 flex flex-col justify-between flex-1">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-zinc-900">
                        {col.name}
                      </h2>
                      <span className="text-xs font-bold uppercase tracking-widest text-zinc-500">
                        {col.itemCount}
                      </span>
                    </div>

                    <p className="text-xs font-bold uppercase tracking-wider text-zinc-800 mb-2">
                      {col.tagline}
                    </p>

                    <p className="text-xs text-zinc-600 leading-relaxed mb-6">
                      {col.description}
                    </p>

                    {/* Preview product mini chips */}
                    <div className="flex flex-wrap gap-2 mb-6">
                      {matchingProducts.slice(0, 3).map((p) => (
                        <span
                          key={p.id}
                          className="text-[10px] uppercase font-bold text-zinc-700 bg-zinc-100 px-2.5 py-1 border border-zinc-200"
                        >
                          {p.name}
                        </span>
                      ))}
                    </div>
                  </div>

                  <Link
                    to={col.link}
                    className="w-full py-3.5 bg-black hover:bg-zinc-800 text-white font-black uppercase tracking-widest text-xs transition-all flex items-center justify-center gap-2 shadow-sm"
                  >
                    Explore {col.name} Collection
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Search, X, ArrowRight } from "lucide-react";
import { PRODUCTS } from "../data/products";

export default function SearchModal({ isOpen, onClose }) {
  const [query, setQuery] = useState("");
  const inputRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
      setQuery("");
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const filteredProducts = query.trim()
    ? PRODUCTS.filter(
        (p) =>
          p.name.toLowerCase().includes(query.toLowerCase()) ||
          p.category.toLowerCase().includes(query.toLowerCase()) ||
          p.collection.toLowerCase().includes(query.toLowerCase())
      )
    : [];

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      onClose();
      navigate(`/shop?search=${encodeURIComponent(query.trim())}`);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-black/60 backdrop-blur-md animate-fadeIn">
      {/* Top Bar */}
      <div className="bg-white border-b border-zinc-200 px-6 py-5 max-w-5xl mx-auto w-full shadow-lg mt-0 sm:mt-8">
        <div className="flex items-center justify-between gap-4">
          <form onSubmit={handleSearchSubmit} className="flex-1 flex items-center gap-3">
            <Search className="w-6 h-6 text-zinc-500 shrink-0" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search products, hoodies, oversized tees, cargos..."
              className="w-full bg-transparent text-lg md:text-2xl text-zinc-900 placeholder-zinc-400 focus:outline-none tracking-wide font-medium"
            />
          </form>
          <button
            onClick={onClose}
            className="p-2 text-zinc-500 hover:text-black hover:bg-zinc-100 transition-colors rounded-full"
            aria-label="Close search"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* Results Container */}
      <div className="flex-1 overflow-y-auto px-6 py-8 max-w-5xl mx-auto w-full bg-white/95 backdrop-blur-xl border-x border-b border-zinc-200 mb-0 sm:mb-8 shadow-2xl">
        {query.trim() === "" ? (
          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest text-zinc-500 mb-4">
              Trending Searches
            </h4>
            <div className="flex flex-wrap gap-2 mb-8">
              {["Oversized Tees", "Heavyweight Hoodies", "Cargos", "Essentials", "New Drop"].map(
                (term) => (
                  <button
                    key={term}
                    onClick={() => {
                      setQuery(term);
                    }}
                    className="px-4 py-2 bg-zinc-100 border border-zinc-200 hover:border-black text-xs uppercase tracking-wider text-zinc-800 hover:text-black transition-colors"
                  >
                    {term}
                  </button>
                )
              )}
            </div>

            <h4 className="text-xs font-bold uppercase tracking-widest text-zinc-500 mb-4">
              Popular Items
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {PRODUCTS.slice(0, 4).map((product) => (
                <Link
                  key={product.id}
                  to={`/product/${product.id}`}
                  onClick={onClose}
                  className="group block bg-white border border-zinc-200 hover:border-black transition-all p-3 shadow-2xs hover:shadow-xs"
                >
                  <div className="aspect-3/4 overflow-hidden bg-zinc-100 mb-2.5">
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <p className="text-xs font-bold text-zinc-900 truncate tracking-wide">
                    {product.name}
                  </p>
                  <p className="text-xs font-semibold text-zinc-600 mt-1">₹{product.price.toLocaleString("en-IN")}</p>
                </Link>
              ))}
            </div>
          </div>
        ) : filteredProducts.length > 0 ? (
          <div>
            <div className="flex items-center justify-between mb-6">
              <span className="text-xs font-semibold uppercase tracking-widest text-zinc-600">
                Found {filteredProducts.length} results
              </span>
              <button
                onClick={handleSearchSubmit}
                className="text-xs font-bold uppercase tracking-wider text-black hover:underline flex items-center gap-1"
              >
                View all in Shop <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {filteredProducts.map((product) => (
                <Link
                  key={product.id}
                  to={`/product/${product.id}`}
                  onClick={onClose}
                  className="group flex gap-4 p-3 bg-white border border-zinc-200 hover:border-black transition-all shadow-2xs"
                >
                  <div className="w-20 h-24 overflow-hidden bg-zinc-100 shrink-0">
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                  </div>
                  <div className="flex flex-col justify-center">
                    <span className="text-[10px] uppercase font-bold tracking-widest text-zinc-500">
                      {product.category}
                    </span>
                    <h5 className="text-sm font-bold text-zinc-900 tracking-tight group-hover:text-black mt-0.5">
                      {product.name}
                    </h5>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-sm font-black text-zinc-900">
                        ₹{product.price.toLocaleString("en-IN")}
                      </span>
                      {product.oldPrice && (
                        <span className="text-xs text-zinc-400 line-through">
                          ₹{product.oldPrice.toLocaleString("en-IN")}
                        </span>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center py-16">
            <p className="text-lg font-medium text-zinc-700">
              No products found matching "{query}"
            </p>
            <p className="text-xs text-zinc-500 uppercase tracking-widest mt-2">
              Try searching for "tee", "hoodie", "cargo", or "essentials"
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

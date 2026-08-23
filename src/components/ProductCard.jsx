import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Eye, ArrowUpRight } from "lucide-react";
import QuickViewModal from "./QuickViewModal";

export default function ProductCard({ product }) {
  const [isHovered, setIsHovered] = useState(false);
  const [quickViewOpen, setQuickViewOpen] = useState(false);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  const mainImage = product.images[0];
  const hoverImage = product.images[1] || product.images[0];

  const handleMouseMove = (e) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    setTilt({
      x: -(y / rect.height) * 10,
      y: (x / rect.width) * 10,
    });
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setTilt({ x: 0, y: 0 });
  };

  return (
    <>
      <div
        className="group relative flex flex-col bg-white border border-zinc-200 hover:border-zinc-900 shadow-xs hover:shadow-xl transition-all duration-300 transform-gpu"
        style={{
          transform: `perspective(1000px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
          transition: isHovered ? "transform 0.1s ease-out" : "transform 0.5s ease-out",
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        {/* Product Image Area */}
        <div className="relative aspect-3/4 overflow-hidden bg-zinc-100">
          <Link to={`/product/${product.id}`} className="block w-full h-full">
            <img
              src={isHovered ? hoverImage : mainImage}
              alt={product.name}
              className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              loading="lazy"
            />
          </Link>

          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-1.5 pointer-events-none">
            {product.discount && (
              <span className="bg-black text-white text-[9px] font-black uppercase tracking-widest px-2 py-0.5 shadow-sm">
                {product.discount}
              </span>
            )}
            {product.newArrival && (
              <span className="bg-white/90 border border-zinc-300 text-zinc-900 text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 shadow-xs">
                New Drop
              </span>
            )}
          </div>

          {/* Quick View Button on Hover */}
          <button
            onClick={(e) => {
              e.preventDefault();
              setQuickViewOpen(true);
            }}
            className="absolute bottom-3 left-1/2 -translate-x-1/2 opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 bg-white/95 hover:bg-black text-black hover:text-white border border-zinc-300 hover:border-black px-4 py-2 text-[10px] font-bold uppercase tracking-widest flex items-center gap-1.5 shadow-md backdrop-blur-xs z-10 whitespace-nowrap"
          >
            <Eye className="w-3.5 h-3.5" />
            Quick View
          </button>
        </div>

        {/* Product Information */}
        <div className="p-4 flex flex-col justify-between flex-1">
          <div>
            <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-1">
              <span>{product.category}</span>
              <span className="text-zinc-400">{product.collection}</span>
            </div>

            <Link
              to={`/product/${product.id}`}
              className="group-hover:text-black transition-colors"
            >
              <h3 className="text-sm font-bold text-zinc-900 tracking-tight line-clamp-1">
                {product.name}
              </h3>
            </Link>
          </div>

          <div className="mt-3 pt-3 border-t border-zinc-100 flex items-center justify-between">
            <div className="flex items-baseline gap-2">
              <span className="text-sm font-black text-zinc-900">
                ₹{product.price.toLocaleString("en-IN")}
              </span>
              {product.oldPrice && (
                <span className="text-xs text-zinc-400 line-through">
                  ₹{product.oldPrice.toLocaleString("en-IN")}
                </span>
              )}
            </div>

            <Link
              to={`/product/${product.id}`}
              className="text-zinc-400 group-hover:text-black transition-colors"
              aria-label={`View ${product.name}`}
            >
              <ArrowUpRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>

      {/* Quick View Modal */}
      <QuickViewModal
        product={product}
        isOpen={quickViewOpen}
        onClose={() => setQuickViewOpen(false)}
      />
    </>
  );
}

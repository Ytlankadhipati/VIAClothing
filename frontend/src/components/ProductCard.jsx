import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Eye, ArrowUpRight, Heart, Check } from "lucide-react";
import QuickViewModal from "./QuickViewModal";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";

export default function ProductCard({ product }) {
  const [isHovered, setIsHovered] = useState(false);
  const [quickViewOpen, setQuickViewOpen] = useState(false);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [addingSize, setAddingSize] = useState(null);

  const { addToCart } = useCart();
  const { isWishlisted, toggleWishlist } = useWishlist();

  const mainImage = product.images?.[0] || "/assets/via-logo.png";
  const hoverImage = product.images?.[1] || mainImage;
  const wishlisted = isWishlisted(product._id || product.id);

  const handleMouseMove = (e) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    setTilt({
      x: -(y / rect.height) * 8,
      y: (x / rect.width) * 8,
    });
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setTilt({ x: 0, y: 0 });
  };

  const handleQuickAdd = async (e, size) => {
    e.preventDefault();
    e.stopPropagation();
    setAddingSize(size);
    await addToCart(product, size);
    setTimeout(() => setAddingSize(null), 1000);
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
          <Link to={`/product/${product.slug || product.id || product._id}`} className="block w-full h-full">
            <img
              src={isHovered ? hoverImage : mainImage}
              alt={product.name}
              className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              loading="lazy"
            />
          </Link>

          {/* Badges (Discount / New Drop / GSM) */}
          <div className="absolute top-3 left-3 flex flex-col gap-1.5 pointer-events-none z-10">
            {product.discount && (
              <span className="bg-black text-white text-[9px] font-black uppercase tracking-widest px-2 py-0.5 shadow-sm">
                {product.discount}
              </span>
            )}
            {product.newArrival && (
              <span className="bg-white/90 border border-zinc-300 text-zinc-900 text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 shadow-2xs backdrop-blur-xs">
                New Drop
              </span>
            )}
          </div>

          {/* Wishlist Toggle Button */}
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              toggleWishlist(product);
            }}
            className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-md transition-all z-20 ${
              wishlisted
                ? "bg-red-50 text-red-500 shadow-sm"
                : "bg-white/80 text-zinc-600 hover:text-black hover:bg-white"
            }`}
            aria-label="Toggle Wishlist"
          >
            <Heart className={`w-4 h-4 ${wishlisted ? "fill-red-500" : ""}`} />
          </button>

          {/* Quick View Button */}
          <button
            onClick={(e) => {
              e.preventDefault();
              setQuickViewOpen(true);
            }}
            className="absolute top-12 right-3 p-2 bg-white/80 hover:bg-white text-zinc-700 hover:text-black rounded-full backdrop-blur-md opacity-0 group-hover:opacity-100 transition-all z-20"
            title="Quick View"
            aria-label="Quick View"
          >
            <Eye className="w-4 h-4" />
          </button>

          {/* Quick-Add Size Picker Overlay on Hover */}
          <div className="absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 translate-y-3 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 z-20">
            <p className="text-[9px] font-black uppercase tracking-widest text-white/90 text-center mb-1.5">
              Quick Add Size
            </p>
            <div className="flex items-center justify-center gap-1.5 flex-wrap">
              {(product.sizes || ["S", "M", "L", "XL", "XXL"]).map((sz) => (
                <button
                  key={sz}
                  onClick={(e) => handleQuickAdd(e, sz)}
                  disabled={addingSize === sz}
                  className="px-2.5 py-1 bg-white/90 hover:bg-white text-black text-[10px] font-bold tracking-wider uppercase transition-transform transform active:scale-95 shadow-sm disabled:bg-emerald-500 disabled:text-white"
                >
                  {addingSize === sz ? <Check className="w-3 h-3" /> : sz}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Product Information */}
        <div className="p-4 flex flex-col justify-between flex-1">
          <div>
            <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-1">
              <span>{product.category}</span>
              <span className="text-zinc-400">{product.collection}</span>
            </div>

            <Link
              to={`/product/${product.slug || product.id || product._id}`}
              className="group-hover:text-black transition-colors"
            >
              <h3 className="text-sm font-bold text-zinc-900 tracking-tight line-clamp-1">
                {product.name}
              </h3>
            </Link>

            {product.gsm && (
              <p className="text-[10px] text-zinc-500 font-medium tracking-wide mt-0.5 line-clamp-1">
                {product.gsm}
              </p>
            )}
          </div>

          <div className="mt-3 pt-3 border-t border-zinc-100 flex items-center justify-between">
            <div className="flex items-baseline gap-2">
              <span className="text-sm font-black text-zinc-900">
                ₹{product.price?.toLocaleString("en-IN")}
              </span>
              {(product.compareAtPrice || product.oldPrice) && (
                <span className="text-xs text-zinc-400 line-through">
                  ₹{(product.compareAtPrice || product.oldPrice).toLocaleString("en-IN")}
                </span>
              )}
            </div>

            <Link
              to={`/product/${product.slug || product.id || product._id}`}
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

import React, { useState } from "react";
import { Link } from "react-router-dom";
import { X, MessageCircle, ArrowRight, Check } from "lucide-react";
import { getProductOrderWhatsAppUrl } from "../utils/whatsapp";
import { useToast } from "../context/ToastContext";

export default function QuickViewModal({ product, isOpen, onClose }) {
  const [selectedSize, setSelectedSize] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [activeImgIndex, setActiveImgIndex] = useState(0);
  const { addToast } = useToast();

  if (!isOpen || !product) return null;

  const handleWhatsAppOrder = () => {
    if (!selectedSize) {
      addToast("Please select a size first before ordering", "error");
      return;
    }
    const url = getProductOrderWhatsAppUrl(product, selectedSize, quantity);
    window.open(url, "_blank");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white border border-zinc-200 w-full max-w-3xl overflow-hidden shadow-2xl relative flex flex-col md:flex-row max-h-[90vh]">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 bg-white/80 text-zinc-500 hover:text-black rounded-full transition-colors shadow-xs"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Product Image Gallery */}
        <div className="w-full md:w-1/2 bg-zinc-100 flex flex-col">
          <div className="aspect-3/4 overflow-hidden relative">
            <img
              src={product.images[activeImgIndex] || product.images[0]}
              alt={product.name}
              className="w-full h-full object-cover"
            />
            {product.discount && (
              <span className="absolute top-3 left-3 bg-black text-white text-[10px] font-black uppercase tracking-widest px-2.5 py-1 shadow-sm">
                {product.discount}
              </span>
            )}
          </div>
          {product.images.length > 1 && (
            <div className="flex gap-2 p-3 bg-zinc-50 border-t border-zinc-200 overflow-x-auto">
              {product.images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImgIndex(i)}
                  className={`w-14 h-16 shrink-0 border overflow-hidden transition-all ${
                    activeImgIndex === i ? "border-black" : "border-zinc-300 opacity-60 hover:opacity-100"
                  }`}
                >
                  <img src={img} alt="thumbnail" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Details & Actions */}
        <div className="w-full md:w-1/2 p-6 md:p-8 flex flex-col justify-between overflow-y-auto bg-white">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-[10px] uppercase font-bold tracking-widest text-zinc-500">
                {product.collection}
              </span>
              <span className="text-zinc-300">•</span>
              <span className="text-[10px] uppercase font-bold tracking-widest text-zinc-500">
                {product.category}
              </span>
            </div>

            <h3 className="text-xl font-black uppercase tracking-tight text-zinc-900 mb-3">
              {product.name}
            </h3>

            <div className="flex items-baseline gap-3 mb-4">
              <span className="text-2xl font-black text-zinc-900">
                ₹{product.price.toLocaleString("en-IN")}
              </span>
              {product.oldPrice && (
                <span className="text-sm text-zinc-400 line-through">
                  ₹{product.oldPrice.toLocaleString("en-IN")}
                </span>
              )}
            </div>

            <p className="text-xs text-zinc-600 leading-relaxed mb-6">
              {product.description}
            </p>

            {/* Size Selector */}
            <div className="mb-6">
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-zinc-800">
                  Select Size {selectedSize && `(${selectedSize})`}
                </span>
                <span className="text-[11px] text-zinc-500">{product.fit}</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map((sz) => (
                  <button
                    key={sz}
                    onClick={() => setSelectedSize(sz)}
                    className={`px-4 py-2 text-xs font-bold uppercase tracking-wider border transition-all ${
                      selectedSize === sz
                        ? "bg-black text-white border-black shadow-xs"
                        : "bg-zinc-50 text-zinc-800 border-zinc-300 hover:border-black hover:text-black"
                    }`}
                  >
                    {sz}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity */}
            <div className="flex items-center gap-4 mb-6">
              <span className="text-xs font-bold uppercase tracking-wider text-zinc-600">
                Quantity:
              </span>
              <div className="flex items-center border border-zinc-300 bg-zinc-50">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-3 py-1.5 text-zinc-600 hover:text-black transition-colors"
                >
                  -
                </button>
                <span className="px-4 text-xs font-bold text-zinc-900">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="px-3 py-1.5 text-zinc-600 hover:text-black transition-colors"
                >
                  +
                </button>
              </div>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-col gap-3 pt-4 border-t border-zinc-200">
            <button
              onClick={handleWhatsAppOrder}
              className="w-full py-3.5 bg-black hover:bg-zinc-800 text-white font-black uppercase tracking-widest text-xs flex items-center justify-center gap-2.5 transition-all shadow-md"
            >
              <MessageCircle className="w-4 h-4 text-emerald-400 fill-emerald-400" />
              Order on WhatsApp
            </button>

            <Link
              to={`/product/${product.id}`}
              onClick={onClose}
              className="text-center py-2 text-xs font-bold uppercase tracking-wider text-zinc-600 hover:text-black transition-colors flex items-center justify-center gap-1.5"
            >
              View Full Product Details <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

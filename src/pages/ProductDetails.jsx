import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  MessageCircle,
  Ruler,
  ShieldCheck,
  Truck,
  RefreshCw,
  ChevronRight,
  Sparkles,
  Share2,
  Check,
} from "lucide-react";
import { PRODUCTS } from "../data/products";
import { getProductOrderWhatsAppUrl } from "../utils/whatsapp";
import SizeGuideModal from "../components/SizeGuideModal";
import ProductCard from "../components/ProductCard";
import { useToast } from "../context/ToastContext";

export default function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToast } = useToast();

  const product = PRODUCTS.find((p) => p.id === id);

  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [selectedSize, setSelectedSize] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [sizeGuideOpen, setSizeGuideOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("details"); // 'details', 'shipping', 'exchange'

  // Scroll to top on id change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    setSelectedImageIndex(0);
    setSelectedSize("");
    setQuantity(1);
  }, [id]);

  if (!product) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center">
        <h2 className="text-3xl font-black uppercase text-white mb-4">
          Product Not Found
        </h2>
        <p className="text-xs text-zinc-400 uppercase tracking-widest mb-8">
          The requested streetwear piece does not exist or has been archived.
        </p>
        <Link
          to="/shop"
          className="px-8 py-4 bg-white text-black font-black text-xs uppercase tracking-widest hover:bg-zinc-200"
        >
          Return to Shop
        </Link>
      </div>
    );
  }

  const handleWhatsAppOrder = () => {
    if (!selectedSize) {
      addToast("Please select your size before ordering via WhatsApp", "error");
      return;
    }

    const url = getProductOrderWhatsAppUrl(product, selectedSize, quantity);
    window.open(url, "_blank");
    addToast("Opening WhatsApp order concierge...", "success");
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: product.name,
        text: `Check out ${product.name} on VIA`,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      addToast("Product link copied to clipboard!", "success");
    }
  };

  // Related products from the same category or collection
  const relatedProducts = PRODUCTS.filter(
    (p) => p.id !== product.id && (p.category === product.category || p.collection === product.collection)
  ).slice(0, 4);

  return (
    <div className="min-h-screen bg-[#fafafa] py-8 md:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest text-zinc-500 mb-8">
          <Link to="/" className="hover:text-black transition-colors">
            Home
          </Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <Link to="/shop" className="hover:text-black transition-colors">
            Shop
          </Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-zinc-900 font-black truncate">{product.name}</span>
        </nav>

        {/* Main Product Display */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14">
          {/* Left Column: Multi-Image Gallery */}
          <div className="lg:col-span-7 flex flex-col-reverse md:flex-row gap-4">
            {/* Thumbnails */}
            {product.images.length > 1 && (
              <div className="flex md:flex-col gap-3 overflow-x-auto md:overflow-y-auto shrink-0 pb-2 md:pb-0">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImageIndex(idx)}
                    className={`w-16 h-20 md:w-20 md:h-24 overflow-hidden border transition-all ${
                      selectedImageIndex === idx
                        ? "border-black opacity-100"
                        : "border-zinc-300 opacity-60 hover:opacity-100"
                    }`}
                  >
                    <img
                      src={img}
                      alt={`${product.name} thumbnail ${idx + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}

            {/* Featured Main Image */}
            <div className="flex-1 relative aspect-3/4 bg-zinc-100 border border-zinc-200 shadow-sm overflow-hidden group">
              <img
                src={product.images[selectedImageIndex] || product.images[0]}
                alt={product.name}
                className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              />

              {product.discount && (
                <span className="absolute top-4 left-4 bg-black text-white text-[10px] font-black uppercase tracking-widest px-3 py-1 shadow-md">
                  {product.discount}
                </span>
              )}

              <button
                onClick={handleShare}
                className="absolute top-4 right-4 p-2.5 bg-white/90 hover:bg-white text-zinc-700 hover:text-black border border-zinc-300 shadow-sm transition-colors"
                aria-label="Share product"
              >
                <Share2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Right Column: Product Meta & WhatsApp Order */}
          <div className="lg:col-span-5 flex flex-col justify-start">
            {/* Header info */}
            <div className="border-b border-zinc-200 pb-6 mb-6">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-[10px] uppercase font-black tracking-[0.25em] text-zinc-500">
                  {product.collection}
                </span>
                <span className="text-zinc-300">•</span>
                <span className="text-[10px] uppercase font-black tracking-[0.25em] text-zinc-500">
                  {product.category}
                </span>
              </div>

              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black uppercase tracking-tight text-zinc-900 mb-3">
                {product.name}
              </h1>

              <div className="flex items-baseline gap-3">
                <span className="text-3xl font-black text-zinc-900">
                  ₹{product.price.toLocaleString("en-IN")}
                </span>
                {product.oldPrice && (
                  <span className="text-base text-zinc-400 line-through">
                    ₹{product.oldPrice.toLocaleString("en-IN")}
                  </span>
                )}
                <span className="text-xs text-emerald-700 font-bold uppercase tracking-wider bg-emerald-50 px-2 py-0.5 border border-emerald-200">
                  Inclusive of all taxes
                </span>
              </div>
            </div>

            {/* Short description */}
            <p className="text-xs sm:text-sm text-zinc-600 leading-relaxed mb-6 font-normal">
              {product.description}
            </p>

            {/* Size Selector */}
            <div className="mb-6">
              <div className="flex justify-between items-center mb-2.5">
                <span className="text-xs font-bold uppercase tracking-wider text-zinc-800">
                  Select Size:{" "}
                  {selectedSize ? (
                    <span className="text-black font-black">({selectedSize})</span>
                  ) : (
                    <span className="text-amber-600 font-bold text-[11px]">(Required)</span>
                  )}
                </span>

                <button
                  onClick={() => setSizeGuideOpen(true)}
                  className="text-xs font-bold uppercase tracking-wider text-zinc-500 hover:text-black flex items-center gap-1.5 transition-colors underline underline-offset-4"
                >
                  <Ruler className="w-3.5 h-3.5" />
                  Size Guide
                </button>
              </div>

              <div className="grid grid-cols-5 gap-2">
                {product.sizes.map((sz) => (
                  <button
                    key={sz}
                    onClick={() => setSelectedSize(sz)}
                    className={`py-3 text-xs font-black uppercase tracking-wider border transition-all ${
                      selectedSize === sz
                        ? "bg-black text-white border-black shadow-md"
                        : "bg-zinc-100 text-zinc-800 border-zinc-300 hover:border-black hover:text-black"
                    }`}
                  >
                    {sz}
                  </button>
                ))}
              </div>
              <p className="text-[11px] text-zinc-500 mt-2 font-medium">
                Fit profile: <span className="text-zinc-800 font-bold">{product.fit}</span>
              </p>
            </div>

            {/* Quantity Selector */}
            <div className="flex items-center gap-4 mb-8">
              <span className="text-xs font-bold uppercase tracking-wider text-zinc-600">
                Quantity:
              </span>
              <div className="flex items-center border border-zinc-300 bg-zinc-50">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-3.5 py-2 text-zinc-600 hover:text-black text-sm font-bold transition-colors"
                >
                  -
                </button>
                <span className="px-5 text-xs font-bold text-zinc-900">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="px-3.5 py-2 text-zinc-600 hover:text-black text-sm font-bold transition-colors"
                >
                  +
                </button>
              </div>
            </div>

            {/* PRIMARY CTA: ORDER ON WHATSAPP */}
            <div className="space-y-3 mb-8">
              <button
                onClick={handleWhatsAppOrder}
                className="w-full py-4 bg-black hover:bg-zinc-800 text-white font-black uppercase tracking-[0.2em] text-xs sm:text-sm flex items-center justify-center gap-3 transition-all duration-300 transform hover:-translate-y-0.5 shadow-xl group"
              >
                <MessageCircle className="w-5 h-5 text-emerald-400 fill-emerald-400 transition-transform group-hover:scale-110" />
                <span>ORDER ON WHATSAPP</span>
              </button>

              <p className="text-center text-[11px] text-zinc-500 tracking-wider uppercase font-medium">
                Direct instant ordering with VIA concierge • Safe & verified checkout
              </p>
            </div>

            {/* Tech Specs & Policy Tabs */}
            <div className="border-t border-zinc-200 pt-6">
              <div className="flex border-b border-zinc-200 mb-4">
                <button
                  onClick={() => setActiveTab("details")}
                  className={`pb-2.5 px-3 text-xs font-bold uppercase tracking-wider border-b-2 transition-all ${
                    activeTab === "details"
                      ? "text-black border-black"
                      : "text-zinc-400 border-transparent hover:text-zinc-700"
                  }`}
                >
                  Specs & Details
                </button>
                <button
                  onClick={() => setActiveTab("shipping")}
                  className={`pb-2.5 px-3 text-xs font-bold uppercase tracking-wider border-b-2 transition-all ${
                    activeTab === "shipping"
                      ? "text-black border-black"
                      : "text-zinc-400 border-transparent hover:text-zinc-700"
                  }`}
                >
                  Shipping & Delivery
                </button>
                <button
                  onClick={() => setActiveTab("exchange")}
                  className={`pb-2.5 px-3 text-xs font-bold uppercase tracking-wider border-b-2 transition-all ${
                    activeTab === "exchange"
                      ? "text-black border-black"
                      : "text-zinc-400 border-transparent hover:text-zinc-700"
                  }`}
                >
                  Size Exchange
                </button>
              </div>

              {activeTab === "details" && (
                <div className="text-xs text-zinc-600 space-y-2.5 animate-fadeIn">
                  <p>
                    <strong className="text-zinc-900">Fabric Weight:</strong> {product.gsm}
                  </p>
                  <p>
                    <strong className="text-zinc-900">Silhouette:</strong> {product.fit}
                  </p>
                  <p>
                    <strong className="text-zinc-900">Colorway:</strong> {product.color}
                  </p>
                  <ul className="list-disc pl-4 space-y-1 pt-1 text-zinc-600">
                    {product.specs?.map((spec, i) => (
                      <li key={i}>{spec}</li>
                    ))}
                  </ul>
                </div>
              )}

              {activeTab === "shipping" && (
                <div className="text-xs text-zinc-600 space-y-2 animate-fadeIn leading-relaxed">
                  <p>
                    • Dispatches within 24 to 48 hours from our production facility.
                  </p>
                  <p>
                    • Delivered in 3–5 business days across all major Indian metro cities and 5–7 days for rest of India.
                  </p>
                  <p>
                    • Free express shipping on all prepaid WhatsApp orders.
                  </p>
                </div>
              )}

              {activeTab === "exchange" && (
                <div className="text-xs text-zinc-600 space-y-2 animate-fadeIn leading-relaxed">
                  <p>
                    • 7-Day Hassle-Free Size Exchange.
                  </p>
                  <p>
                    • If the fit isn't perfect, message our WhatsApp support with your order details for a seamless doorstep exchange.
                  </p>
                  <p>
                    • Garments must be unworn with original tags attached.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Related Products Section */}
        {relatedProducts.length > 0 && (
          <div className="mt-24 pt-12 border-t border-zinc-200">
            <div className="flex items-center justify-between mb-8">
              <div>
                <span className="text-[10px] uppercase font-black tracking-[0.3em] text-zinc-500">
                  Style With
                </span>
                <h3 className="text-2xl font-black uppercase tracking-tight text-zinc-900 mt-1">
                  You May Also Like
                </h3>
              </div>
              <Link
                to="/shop"
                className="text-xs font-bold uppercase tracking-widest text-zinc-600 hover:text-black"
              >
                View Collection
              </Link>
            </div>

            <ProductGrid products={relatedProducts} />
          </div>
        )}
      </div>

      {/* Size Guide Modal */}
      <SizeGuideModal
        isOpen={sizeGuideOpen}
        onClose={() => setSizeGuideOpen(false)}
        category={product.category}
      />
    </div>
  );
}

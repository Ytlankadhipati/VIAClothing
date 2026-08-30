import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import {
  ShoppingBag,
  Heart,
  ChevronRight,
  Share2,
  ShieldCheck,
  Truck,
  RotateCcw,
  Star,
  CheckCircle,
  Clock,
  Sparkles,
} from "lucide-react";
import { productService } from "../services/productService";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import SizeGuideModal from "../components/SizeGuideModal";
import ProductGrid from "../components/ProductGrid";
import { getProductOrderWhatsAppUrl } from "../utils/whatsapp";

export default function ProductDetails() {
  const { id } = useParams();
  const { addToast } = useToast();
  const { addToCart } = useCart();
  const { isWishlisted, toggleWishlist } = useWishlist();
  const { isAuthenticated } = useAuth();

  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [selectedSize, setSelectedSize] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [sizeGuideOpen, setSizeGuideOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("specs");

  // Review submission form state
  const [newRating, setNewRating] = useState(5);
  const [reviewTitle, setReviewTitle] = useState("");
  const [reviewComment, setReviewComment] = useState("");
  const [submittingReview, setSubmittingReview] = useState(false);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    setSelectedImageIndex(0);
    setSelectedSize("");
    setQuantity(1);

    const loadProductDetails = async () => {
      try {
        setLoading(true);
        const res = await productService.getProductByIdOrSlug(id);
        if (res.success && res.data.product) {
          const prod = res.data.product;
          setProduct(prod);
          if (prod.sizes && prod.sizes.length > 0) {
            setSelectedSize(prod.sizes[0]);
          }

          // Fetch reviews
          const reviewRes = await productService.getProductReviews(prod._id);
          if (reviewRes.success && reviewRes.data.reviews) {
            setReviews(reviewRes.data.reviews);
          }

          // Fetch related products
          const relRes = await productService.getProducts({
            category: prod.category,
            limit: 4,
          });
          if (relRes.success && relRes.data.products) {
            setRelatedProducts(
              relRes.data.products.filter((p) => p._id !== prod._id)
            );
          }
        }
      } catch (err) {
        console.error("Error loading product:", err);
      } finally {
        setLoading(false);
      }
    };

    loadProductDetails();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
          <span className="text-xs uppercase tracking-widest font-bold text-zinc-500">
            Loading Streetwear Piece...
          </span>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center">
        <h2 className="text-3xl font-black uppercase text-zinc-900 mb-4">
          Product Not Found
        </h2>
        <p className="text-xs text-zinc-500 uppercase tracking-widest mb-8">
          The requested streetwear piece does not exist or has been archived.
        </p>
        <Link
          to="/shop"
          className="px-8 py-4 bg-black text-white font-black text-xs uppercase tracking-widest hover:bg-zinc-800"
        >
          Return to Shop
        </Link>
      </div>
    );
  }

  // Determine variant specific stock
  let currentStock = product.stock;
  let currentPrice = product.price;
  if (selectedSize && product.variants && product.variants.length > 0) {
    const v = product.variants.find((item) => item.size === selectedSize);
    if (v) {
      currentStock = v.stock;
      if (v.price) currentPrice = v.price;
    }
  }

  const isSoldOut = currentStock <= 0;
  const isLowStock = currentStock > 0 && currentStock <= 5;
  const wishlisted = isWishlisted(product._id || product.id);

  const handleAddToCart = () => {
    if (!selectedSize) {
      addToast("Please select your size first", "error");
      return;
    }
    addToCart(product, selectedSize, "Standard", quantity);
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

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      addToast("Please log in to submit a verified review", "error");
      return;
    }

    if (!reviewTitle.trim() || !reviewComment.trim()) {
      addToast("Please provide both a title and review comment", "error");
      return;
    }

    try {
      setSubmittingReview(true);
      const res = await productService.submitReview(product._id, {
        rating: newRating,
        title: reviewTitle,
        comment: reviewComment,
      });
      if (res.success) {
        addToast("Review submitted successfully!", "success");
        setReviewTitle("");
        setReviewComment("");
        // Reload reviews
        const reviewRes = await productService.getProductReviews(product._id);
        if (reviewRes.success) setReviews(reviewRes.data.reviews);
      }
    } catch (err) {
      addToast(err.message || "Failed to submit review", "error");
    } finally {
      setSubmittingReview(false);
    }
  };

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

        {/* Product Hero Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14">
          {/* Left Column: Image Gallery */}
          <div className="lg:col-span-7 flex flex-col-reverse md:flex-row gap-4">
            {/* Thumbnails */}
            {product.images?.length > 1 && (
              <div className="flex md:flex-col gap-3 overflow-x-auto md:overflow-y-auto shrink-0 pb-2 md:pb-0">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImageIndex(idx)}
                    className={`w-16 h-20 md:w-20 md:h-24 overflow-hidden border transition-all ${selectedImageIndex === idx
                        ? "border-black opacity-100 ring-1 ring-black"
                        : "border-zinc-300 opacity-60 hover:opacity-100"
                      }`}
                  >
                    <img
                      src={img}
                      alt={`${product.name} angle ${idx + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}

            {/* Featured Image */}
            <div className="flex-1 relative aspect-3/4 bg-zinc-100 border border-zinc-200 shadow-sm overflow-hidden group">
              <img
                src={product.images?.[selectedImageIndex] || product.images?.[0]}
                alt={product.name}
                className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              />

              {product.discount && (
                <span className="absolute top-4 left-4 bg-black text-white text-[10px] font-black uppercase tracking-widest px-3 py-1 shadow-md">
                  {product.discount}
                </span>
              )}

              {/* Wishlist & Share buttons */}
              <div className="absolute top-4 right-4 flex flex-col gap-2">
                <button
                  onClick={() => toggleWishlist(product)}
                  className={`p-2.5 rounded-full backdrop-blur-md transition-all shadow-md ${wishlisted
                      ? "bg-red-50 text-red-500"
                      : "bg-white/85 text-zinc-700 hover:text-black hover:bg-white"
                    }`}
                  aria-label="Wishlist"
                >
                  <Heart className={`w-4 h-4 ${wishlisted ? "fill-red-500" : ""}`} />
                </button>
                <button
                  onClick={handleShare}
                  className="p-2.5 bg-white/85 hover:bg-white text-zinc-700 hover:text-black rounded-full backdrop-blur-md shadow-md transition-all"
                  aria-label="Share"
                >
                  <Share2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Right Column: Buy Box & Details */}
          <div className="lg:col-span-5 flex flex-col justify-between">
            <div>
              {/* Category & Collection */}
              <div className="flex items-center gap-3 text-xs font-bold uppercase tracking-[0.25em] text-zinc-500 mb-2">
                <span>{product.category}</span>
                <span>•</span>
                <span className="text-zinc-900">{product.collection}</span>
              </div>

              {/* Product Title */}
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-black uppercase tracking-tight text-zinc-900 mb-3">
                {product.name}
              </h1>

              {/* Price & Rating */}
              <div className="flex items-center justify-between py-3 border-y border-zinc-200 mb-6">
                <div className="flex items-baseline gap-3">
                  <span className="text-2xl font-black text-zinc-900">
                    ₹{currentPrice?.toLocaleString("en-IN")}
                  </span>
                  {product.compareAtPrice && (
                    <span className="text-sm text-zinc-400 line-through">
                      ₹{product.compareAtPrice.toLocaleString("en-IN")}
                    </span>
                  )}
                  {product.discount && (
                    <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 border border-emerald-300">
                      SAVE {product.discount}
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-1.5 text-xs font-bold">
                  <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                  <span>{product.ratings || 5.0}</span>
                  <span className="text-zinc-400">({reviews.length || product.numReviews || 12})</span>
                </div>
              </div>

              {/* Stock Status Badge */}
              <div className="mb-6">
                {isSoldOut ? (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-red-50 border border-red-300 text-red-700 text-xs font-bold uppercase tracking-wider">
                    Sold Out in this size
                  </span>
                ) : isLowStock ? (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-50 border border-amber-300 text-amber-800 text-xs font-bold uppercase tracking-wider animate-pulse">
                    <Clock className="w-3.5 h-3.5" />
                    Only {currentStock} pieces left in stock — Selling fast
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs font-bold uppercase tracking-wider">
                    <CheckCircle className="w-3.5 h-3.5" />
                    In Stock — Ready for Same-Day Dispatch
                  </span>
                )}
              </div>

              {/* Size Selector */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-2.5">
                  <span className="text-xs font-bold uppercase tracking-widest text-zinc-900">
                    Select Size
                  </span>
                  <button
                    onClick={() => setSizeGuideOpen(true)}
                    className="text-xs font-bold uppercase tracking-wider text-zinc-600 hover:text-black underline underline-offset-4"
                  >
                    Size Guide
                  </button>
                </div>

                <div className="grid grid-cols-5 gap-2">
                  {(product.sizes || ["S", "M", "L", "XL", "XXL"]).map((sz) => (
                    <button
                      key={sz}
                      onClick={() => setSelectedSize(sz)}
                      className={`py-3 text-xs font-black uppercase tracking-wider border transition-all ${selectedSize === sz
                          ? "bg-black text-white border-black shadow-sm"
                          : "bg-white text-zinc-800 border-zinc-300 hover:border-black"
                        }`}
                    >
                      {sz}
                    </button>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3 mb-8">
                <button
                  onClick={handleAddToCart}
                  disabled={isSoldOut}
                  className="w-full py-4 bg-black hover:bg-zinc-800 disabled:bg-zinc-300 text-white font-black text-xs uppercase tracking-[0.25em] flex items-center justify-center gap-2 transition-all shadow-lg hover:shadow-xl disabled:cursor-not-allowed"
                >
                  <ShoppingBag className="w-4 h-4" />
                  {isSoldOut ? "Out of Stock" : "Add to Bag"}
                </button>

                <a
                  href={getProductOrderWhatsAppUrl(product, selectedSize || "M", quantity)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3.5 bg-emerald-50 border border-emerald-500/40 hover:border-emerald-600 text-emerald-800 font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-2 transition-all text-center"
                >
                  Order on WhatsApp
                </a>
              </div>

              {/* Trust Badges */}
              <div className="grid grid-cols-3 gap-2 py-4 border-y border-zinc-200 text-center text-[10px] uppercase font-bold tracking-wider text-zinc-600 mb-8">
                <div className="flex flex-col items-center gap-1.5 p-2 bg-zinc-50 border border-zinc-100">
                  <Truck className="w-4 h-4 text-zinc-900" />
                  <span>Free Express Shipping</span>
                </div>
                <div className="flex flex-col items-center gap-1.5 p-2 bg-zinc-50 border border-zinc-100">
                  <RotateCcw className="w-4 h-4 text-zinc-900" />
                  <span>7-Day Easy Exchange</span>
                </div>
                <div className="flex flex-col items-center gap-1.5 p-2 bg-zinc-50 border border-zinc-100">
                  <ShieldCheck className="w-4 h-4 text-zinc-900" />
                  <span>Cash on Delivery</span>
                </div>
              </div>
            </div>

            {/* Collapsible Tabs for Specs, Fabric, Shipping */}
            <div>
              <div className="flex border-b border-zinc-200">
                <button
                  onClick={() => setActiveTab("specs")}
                  className={`py-3 px-4 text-xs font-black uppercase tracking-wider border-b-2 transition-all ${activeTab === "specs"
                      ? "border-black text-black"
                      : "border-transparent text-zinc-400 hover:text-black"
                    }`}
                >
                  Specifications
                </button>
                <button
                  onClick={() => setActiveTab("shipping")}
                  className={`py-3 px-4 text-xs font-black uppercase tracking-wider border-b-2 transition-all ${activeTab === "shipping"
                      ? "border-black text-black"
                      : "border-transparent text-zinc-400 hover:text-black"
                    }`}
                >
                  Shipping & Returns
                </button>
                <button
                  onClick={() => setActiveTab("reviews")}
                  className={`py-3 px-4 text-xs font-black uppercase tracking-wider border-b-2 transition-all ${activeTab === "reviews"
                      ? "border-black text-black"
                      : "border-transparent text-zinc-400 hover:text-black"
                    }`}
                >
                  Reviews ({reviews.length})
                </button>
              </div>

              <div className="py-4 text-xs leading-relaxed text-zinc-700">
                {activeTab === "specs" && (
                  <div className="space-y-3">
                    <p>{product.description}</p>
                    {product.specs && (
                      <ul className="list-disc pl-4 space-y-1 text-zinc-600">
                        {product.specs.map((s, idx) => (
                          <li key={idx}>{s}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                )}

                {activeTab === "shipping" && (
                  <div className="space-y-2 text-zinc-600">
                    <p>• <strong>Free Domestic Shipping:</strong> Orders over ₹1999 qualify for free express delivery.</p>
                    <p>• <strong>Delivery Timeline:</strong> 3-5 business days across major Indian metros.</p>
                    <p>• <strong>Hassle-Free Exchange:</strong> 7 days exchange window for sizing adjustments.</p>
                  </div>
                )}

                {activeTab === "reviews" && (
                  <div className="space-y-6">
                    {/* Review Form */}
                    <form onSubmit={handleReviewSubmit} className="p-4 bg-zinc-50 border border-zinc-200 space-y-3">
                      <h4 className="font-bold text-xs uppercase tracking-wider text-zinc-900">
                        Write a Customer Review
                      </h4>
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] font-semibold">Your Rating:</span>
                        <select
                          value={newRating}
                          onChange={(e) => setNewRating(Number(e.target.value))}
                          className="px-2 py-1 border border-zinc-300 text-xs font-bold"
                        >
                          <option value="5">★★★★★ (5 Stars)</option>
                          <option value="4">★★★★☆ (4 Stars)</option>
                          <option value="3">★★★☆☆ (3 Stars)</option>
                        </select>
                      </div>
                      <input
                        type="text"
                        placeholder="Review Headline (e.g. Perfect heavyweight drape)"
                        value={reviewTitle}
                        onChange={(e) => setReviewTitle(e.target.value)}
                        className="w-full px-3 py-2 border border-zinc-300 text-xs font-semibold outline-hidden bg-white"
                      />
                      <textarea
                        rows="3"
                        placeholder="Share your thoughts on fit, fabric feel, and quality..."
                        value={reviewComment}
                        onChange={(e) => setReviewComment(e.target.value)}
                        className="w-full px-3 py-2 border border-zinc-300 text-xs outline-hidden bg-white"
                      />
                      <button
                        type="submit"
                        disabled={submittingReview}
                        className="px-4 py-2 bg-black hover:bg-zinc-800 text-white text-xs font-bold uppercase tracking-wider"
                      >
                        {submittingReview ? "Submitting..." : "Submit Review"}
                      </button>
                    </form>

                    {/* Reviews List */}
                    <div className="space-y-4">
                      {reviews.length === 0 ? (
                        <p className="text-zinc-500 italic">No reviews yet. Be the first to review this piece.</p>
                      ) : (
                        reviews.map((r, idx) => (
                          <div key={r._id || idx} className="border-b border-zinc-100 pb-3">
                            <div className="flex items-center justify-between mb-1">
                              <div className="flex items-center gap-2">
                                <span className="font-bold text-zinc-900">{r.userName}</span>
                                {r.verifiedPurchase && (
                                  <span className="text-[9px] font-bold bg-emerald-50 text-emerald-700 px-1.5 py-0.5 border border-emerald-300">
                                    Verified Buyer
                                  </span>
                                )}
                              </div>
                              <div className="flex text-amber-400">
                                {"★".repeat(r.rating)}
                              </div>
                            </div>
                            <h5 className="font-bold text-xs text-zinc-900">{r.title}</h5>
                            <p className="text-zinc-600 mt-1">{r.comment}</p>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Related Products Grid */}
        {relatedProducts.length > 0 && (
          <div className="mt-20 border-t border-zinc-200 pt-12">
            <h3 className="text-2xl font-black uppercase tracking-tight text-zinc-900 mb-8">
              Complete The Look
            </h3>
            <ProductGrid products={relatedProducts} />
          </div>
        )}
      </div>

      {/* Floating Sticky Buy Bar on Mobile */}
      <div className="fixed bottom-0 inset-x-0 bg-white/95 backdrop-blur-md border-t border-zinc-200 p-3 lg:hidden z-30 flex items-center justify-between shadow-2xl">
        <div>
          <p className="text-xs font-black text-zinc-900">₹{currentPrice?.toLocaleString("en-IN")}</p>
          <p className="text-[10px] text-zinc-500 uppercase font-bold">Size: {selectedSize || "Select"}</p>
        </div>
        <button
          onClick={handleAddToCart}
          disabled={isSoldOut}
          className="px-6 py-3 bg-black hover:bg-zinc-800 disabled:bg-zinc-300 text-white font-black text-xs uppercase tracking-widest flex items-center gap-2"
        >
          <ShoppingBag className="w-3.5 h-3.5" />
          {isSoldOut ? "Sold Out" : "Add to Bag"}
        </button>
      </div>

      {/* Size Guide Modal */}
      <SizeGuideModal isOpen={sizeGuideOpen} onClose={() => setSizeGuideOpen(false)} />
    </div>
  );
}

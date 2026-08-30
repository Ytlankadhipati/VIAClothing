import React from "react";
import { Link } from "react-router-dom";
import { Heart, ShoppingBag, ArrowRight } from "lucide-react";
import { useWishlist } from "../context/WishlistContext";
import ProductCard from "../components/ProductCard";

export default function Wishlist() {
  const { wishlist } = useWishlist();

  return (
    <div className="min-h-screen bg-[#fafafa] py-8 md:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-xl mx-auto mb-10">
          <span className="text-[10px] uppercase font-black tracking-[0.3em] text-zinc-500">
            Saved Streetwear Pieces
          </span>
          <h1 className="text-3xl sm:text-4xl font-black uppercase tracking-tight text-zinc-900 mt-2">
            Your Wishlist ({wishlist.length})
          </h1>
        </div>

        {wishlist.length === 0 ? (
          <div className="bg-white border border-zinc-200 p-12 text-center max-w-lg mx-auto space-y-4 shadow-xs">
            <div className="w-16 h-16 rounded-full bg-zinc-100 flex items-center justify-center mx-auto">
              <Heart className="w-8 h-8 text-zinc-400" />
            </div>
            <h3 className="font-black text-lg uppercase text-zinc-900">
              Your wishlist is empty
            </h3>
            <p className="text-xs text-zinc-500 uppercase tracking-widest leading-relaxed">
              Explore heavyweight silhouettes and tap the heart icon to save your favorites.
            </p>
            <Link
              to="/shop"
              className="inline-flex items-center gap-2 px-8 py-3.5 bg-black hover:bg-zinc-800 text-white text-xs font-black uppercase tracking-widest transition-all shadow-md"
            >
              Explore Drops <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {wishlist.map((prod) => (
              <ProductCard key={prod._id || prod.id} product={prod} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

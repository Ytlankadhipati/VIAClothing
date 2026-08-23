import React from "react";
import ProductCard from "./ProductCard";

export default function ProductGrid({ products = [], emptyMessage = "No products found" }) {
  if (!products.length) {
    return (
      <div className="text-center py-20 bg-zinc-950/40 border border-zinc-900 my-8">
        <p className="text-sm font-bold uppercase tracking-widest text-zinc-400">
          {emptyMessage}
        </p>
        <p className="text-xs text-zinc-600 mt-2">
          Try resetting your filters or search terms
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}

import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Filter, SlidersHorizontal, ArrowUpDown } from "lucide-react";
import ProductGrid from "../components/ProductGrid";
import { productService } from "../services/productService";

export default function Shop() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [collections, setCollections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });

  // Filters from query params or state
  const selectedCategory = searchParams.get("category") || "All";
  const selectedCollection = searchParams.get("collection") || "All";
  const selectedSort = searchParams.get("sort") || "featured";
  const searchQuery = searchParams.get("search") || "";

  useEffect(() => {
    const fetchMetadata = async () => {
      try {
        const [catRes, colRes] = await Promise.all([
          productService.getCategories(),
          productService.getCollections(),
        ]);
        if (catRes.success) setCategories(["All", ...catRes.data.categories.map((c) => c.name)]);
        if (colRes.success) setCollections(["All", ...colRes.data.collections.map((c) => c.name)]);
      } catch (err) {
        setCategories(["All", "Oversized Tees", "Hoodies", "Sweatshirts", "Bottoms"]);
        setCollections(["All", "Essentials", "Street", "Oversized", "New Drop"]);
      }
    };
    fetchMetadata();
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const params = {
          sort: selectedSort,
          page: searchParams.get("page") || 1,
          limit: 12,
        };

        if (selectedCategory !== "All") params.category = selectedCategory;
        if (selectedCollection !== "All") params.collection = selectedCollection;
        if (searchQuery) params.search = searchQuery;

        const res = await productService.getProducts(params);
        if (res.success && res.data.products) {
          setProducts(res.data.products);
          setPagination(res.data.pagination || { page: 1, pages: 1, total: res.data.products.length });
        }
      } catch (err) {
        console.error("Failed to load products:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [searchParams]);

  const updateParam = (key, value) => {
    const nextParams = new URLSearchParams(searchParams);
    if (value === "All" || !value) {
      nextParams.delete(key);
    } else {
      nextParams.set(key, value);
    }
    nextParams.delete("page");
    setSearchParams(nextParams);
  };

  return (
    <div className="min-h-screen bg-[#fafafa] py-8 md:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Title */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-[10px] uppercase font-black tracking-[0.3em] text-zinc-500">
            VIA Streetwear Archive
          </span>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black uppercase tracking-tight text-zinc-900 mt-2">
            The Complete Collection
          </h1>
          <p className="text-xs sm:text-sm text-zinc-600 uppercase tracking-widest mt-3">
            Heavyweight 240–420 GSM silhouettes crafted without compromise.
          </p>
        </div>

        {/* Filter & Sort Bar */}
        <div className="bg-white border border-zinc-200 p-4 mb-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-xs">
          {/* Category Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => updateParam("category", cat)}
                className={`px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider whitespace-nowrap transition-all ${selectedCategory === cat
                    ? "bg-black text-white"
                    : "bg-zinc-100 hover:bg-zinc-200 text-zinc-700"
                  }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Sort Dropdown & Product Count */}
          <div className="flex items-center justify-between w-full md:w-auto gap-4 border-t md:border-t-0 pt-3 md:pt-0 border-zinc-100">
            <span className="text-[11px] font-semibold text-zinc-500 uppercase tracking-wider">
              {pagination.total} Products
            </span>

            <div className="flex items-center gap-2">
              <ArrowUpDown className="w-3.5 h-3.5 text-zinc-500" />
              <select
                value={selectedSort}
                onChange={(e) => updateParam("sort", e.target.value)}
                className="text-xs font-bold uppercase tracking-wider bg-transparent border-b border-zinc-300 focus:border-black py-1 outline-hidden"
              >
                <option value="featured">Featured</option>
                <option value="newest">Newest Drops</option>
                <option value="bestseller">Best Sellers</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="rating">Top Rated</option>
              </select>
            </div>
          </div>
        </div>

        {/* Products Grid */}
        {loading ? (
          <div className="min-h-[40vh] flex flex-col items-center justify-center gap-3">
            <div className="w-8 h-8 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
            <p className="text-xs uppercase tracking-widest font-bold text-zinc-500">
              Loading Products...
            </p>
          </div>
        ) : products.length === 0 ? (
          <div className="min-h-[40vh] flex flex-col items-center justify-center text-center p-8 bg-white border border-zinc-200">
            <h3 className="text-lg font-black uppercase text-zinc-900">No products found</h3>
            <p className="text-xs text-zinc-500 tracking-wider uppercase mt-1 mb-6">
              Try adjusting your category or filter selection.
            </p>
            <button
              onClick={() => setSearchParams({})}
              className="px-6 py-3 bg-black text-white text-xs font-black uppercase tracking-widest hover:bg-zinc-800"
            >
              Clear All Filters
            </button>
          </div>
        ) : (
          <ProductGrid products={products} />
        )}
      </div>
    </div>
  );
}

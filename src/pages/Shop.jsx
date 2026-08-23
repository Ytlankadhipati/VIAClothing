import React, { useState, useMemo, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Search, SlidersHorizontal, ArrowUpDown, X, Filter } from "lucide-react";
import { PRODUCTS, CATEGORIES, COLLECTIONS_LIST } from "../data/products";
import ProductGrid from "../components/ProductGrid";

export default function Shop() {
  const [searchParams, setSearchParams] = useSearchParams();

  // State initialized from URL query params
  const [selectedCategory, setSelectedCategory] = useState(
    searchParams.get("category") || "All"
  );
  const [selectedCollection, setSelectedCollection] = useState(
    searchParams.get("collection") || "All"
  );
  const [searchQuery, setSearchQuery] = useState(
    searchParams.get("search") || ""
  );
  const [sortBy, setSortBy] = useState("featured");
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Sync state when URL params change
  useEffect(() => {
    const cat = searchParams.get("category");
    const col = searchParams.get("collection");
    const q = searchParams.get("search");

    if (cat && CATEGORIES.includes(cat)) setSelectedCategory(cat);
    if (col && COLLECTIONS_LIST.includes(col)) setSelectedCollection(col);
    if (q !== null) setSearchQuery(q);
  }, [searchParams]);

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    let result = [...PRODUCTS];

    // Filter by Category
    if (selectedCategory !== "All") {
      result = result.filter(
        (p) => p.category.toLowerCase() === selectedCategory.toLowerCase()
      );
    }

    // Filter by Collection
    if (selectedCollection !== "All") {
      result = result.filter(
        (p) => p.collection.toLowerCase() === selectedCollection.toLowerCase()
      );
    }

    // Filter by Search Query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          p.collection.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q)
      );
    }

    // Sorting
    switch (sortBy) {
      case "price-low":
        result.sort((a, b) => a.price - b.price);
        break;
      case "price-high":
        result.sort((a, b) => b.price - a.price);
        break;
      case "newest":
        result.sort((a, b) => (b.newArrival ? 1 : 0) - (a.newArrival ? 1 : 0));
        break;
      case "featured":
      default:
        result.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
        break;
    }

    return result;
  }, [selectedCategory, selectedCollection, searchQuery, sortBy]);

  const handleCategoryChange = (cat) => {
    setSelectedCategory(cat);
    const newParams = new URLSearchParams(searchParams);
    if (cat === "All") {
      newParams.delete("category");
    } else {
      newParams.set("category", cat);
    }
    setSearchParams(newParams);
  };

  const handleCollectionChange = (col) => {
    setSelectedCollection(col);
    const newParams = new URLSearchParams(searchParams);
    if (col === "All") {
      newParams.delete("collection");
    } else {
      newParams.set("collection", col);
    }
    setSearchParams(newParams);
  };

  const resetAllFilters = () => {
    setSelectedCategory("All");
    setSelectedCollection("All");
    setSearchQuery("");
    setSortBy("featured");
    setSearchParams({});
  };

  const hasActiveFilters =
    selectedCategory !== "All" ||
    selectedCollection !== "All" ||
    searchQuery.trim() !== "";

  return (
    <div className="min-h-screen bg-[#fafafa] py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="border-b border-zinc-200 pb-8 mb-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <span className="text-[10px] uppercase font-black tracking-[0.3em] text-zinc-500">
                Official Catalog
              </span>
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-black uppercase tracking-tight text-zinc-900 mt-1">
                SHOP
              </h1>
              <p className="text-xs sm:text-sm text-zinc-600 uppercase tracking-widest mt-2 font-medium">
                Explore the latest VIA collection. Heavyweight cuts & minimalist luxury.
              </p>
            </div>

            {/* Product Count Pill */}
            <div className="text-xs font-bold uppercase tracking-widest text-zinc-700 bg-white border border-zinc-200 px-4 py-2 self-start md:self-auto shadow-2xs">
              Showing {filteredProducts.length} {filteredProducts.length === 1 ? "Product" : "Products"}
            </div>
          </div>
        </div>

        {/* Filter & Controls Toolbar */}
        <div className="flex flex-col lg:flex-row gap-4 justify-between items-stretch lg:items-center bg-white p-4 border border-zinc-200 shadow-2xs mb-8">
          {/* Search Bar */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search products..."
              className="w-full bg-zinc-50 border border-zinc-300 pl-10 pr-4 py-2.5 text-xs text-zinc-900 placeholder-zinc-500 focus:outline-none focus:border-black"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-black"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Desktop Filter Pills */}
          <div className="hidden lg:flex items-center gap-2 overflow-x-auto">
            <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 mr-1">
              Category:
            </span>
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => handleCategoryChange(cat)}
                className={`px-3 py-1.5 text-xs font-bold uppercase tracking-wider transition-all whitespace-nowrap ${
                  selectedCategory === cat
                    ? "bg-black text-white border border-black shadow-xs"
                    : "bg-zinc-50 text-zinc-700 border border-zinc-300 hover:text-black hover:border-black"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Sort Dropdown */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 bg-zinc-50 border border-zinc-300 px-3 py-1.5">
              <ArrowUpDown className="w-3.5 h-3.5 text-zinc-600" />
              <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-600">
                Sort:
              </span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-transparent text-xs font-bold uppercase tracking-wider text-zinc-900 focus:outline-none cursor-pointer"
              >
                <option value="featured" className="bg-white text-zinc-900">
                  Featured
                </option>
                <option value="newest" className="bg-white text-zinc-900">
                  Newest
                </option>
                <option value="price-low" className="bg-white text-zinc-900">
                  Price: Low to High
                </option>
                <option value="price-high" className="bg-white text-zinc-900">
                  Price: High to Low
                </option>
              </select>
            </div>

            {/* Mobile Filter Toggle */}
            <button
              onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
              className="lg:hidden px-3 py-2 bg-zinc-100 border border-zinc-300 text-xs font-bold uppercase tracking-wider text-zinc-800 flex items-center gap-1.5"
            >
              <Filter className="w-3.5 h-3.5" />
              Filters
            </button>
          </div>
        </div>

        {/* Collection Filter Row (Desktop & Tablet) */}
        <div className="hidden sm:flex items-center gap-2 mb-6 pb-2 overflow-x-auto">
          <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 mr-2">
            Collections:
          </span>
          {COLLECTIONS_LIST.map((col) => (
            <button
              key={col}
              onClick={() => handleCollectionChange(col)}
              className={`px-3 py-1 text-[11px] font-bold uppercase tracking-wider transition-all ${
                selectedCollection === col
                  ? "bg-zinc-900 text-white border border-zinc-900"
                  : "text-zinc-600 hover:text-black border border-transparent hover:border-zinc-300"
              }`}
            >
              {col}
            </button>
          ))}
        </div>

        {/* Mobile Filters Drawer / Accordion */}
        {mobileFilterOpen && (
          <div className="lg:hidden bg-white p-4 border border-zinc-200 shadow-lg mb-6 space-y-4 animate-fadeIn">
            <div>
              <h4 className="text-xs font-bold uppercase tracking-widest text-zinc-600 mb-2">
                Categories
              </h4>
              <div className="flex flex-wrap gap-2">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => handleCategoryChange(cat)}
                    className={`px-3 py-1.5 text-xs font-bold uppercase tracking-wider ${
                      selectedCategory === cat
                        ? "bg-black text-white"
                        : "bg-zinc-100 text-zinc-700 border border-zinc-300"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <h4 className="text-xs font-bold uppercase tracking-widest text-zinc-600 mb-2">
                Collections
              </h4>
              <div className="flex flex-wrap gap-2">
                {COLLECTIONS_LIST.map((col) => (
                  <button
                    key={col}
                    onClick={() => handleCollectionChange(col)}
                    className={`px-3 py-1.5 text-xs font-bold uppercase tracking-wider ${
                      selectedCollection === col
                        ? "bg-black text-white"
                        : "bg-zinc-100 text-zinc-700 border border-zinc-300"
                    }`}
                  >
                    {col}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Active Filters Display */}
        {hasActiveFilters && (
          <div className="flex items-center flex-wrap gap-2 mb-8 bg-zinc-100 p-3 border border-zinc-200">
            <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-600">
              Active Filters:
            </span>

            {selectedCategory !== "All" && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-white border border-zinc-300 text-zinc-900 text-xs font-bold shadow-2xs">
                Category: {selectedCategory}
                <button
                  onClick={() => handleCategoryChange("All")}
                  className="hover:text-rose-600 ml-1"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}

            {selectedCollection !== "All" && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-white border border-zinc-300 text-zinc-900 text-xs font-bold shadow-2xs">
                Collection: {selectedCollection}
                <button
                  onClick={() => handleCollectionChange("All")}
                  className="hover:text-rose-600 ml-1"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}

            {searchQuery && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-white border border-zinc-300 text-zinc-900 text-xs font-bold shadow-2xs">
                Query: "{searchQuery}"
                <button
                  onClick={() => setSearchQuery("")}
                  className="hover:text-rose-600 ml-1"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}

            <button
              onClick={resetAllFilters}
              className="text-[10px] font-bold uppercase tracking-widest text-zinc-600 hover:text-black underline ml-auto"
            >
              Reset All
            </button>
          </div>
        )}

        {/* Product Grid */}
        <ProductGrid
          products={filteredProducts}
          emptyMessage="No products match your current filters."
        />
      </div>
    </div>
  );
}

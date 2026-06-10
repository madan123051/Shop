"use client";

import { useState, useMemo, Suspense, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useProducts } from "@/context/ProductsContext";
import ProductCard from "@/components/ProductCard";
import { Search, SlidersHorizontal, X } from "lucide-react";

function ShopContent() {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get("category") || "All";
  const initialSearch = searchParams.get("search") || "";
  const { products, categories } = useProducts();

  const [search, setSearch] = useState(initialSearch);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [sortBy, setSortBy] = useState("default");
  const [selectedSubCategory, setSelectedSubCategory] = useState("All");

  useEffect(() => {
    setSelectedSubCategory("All");
  }, [selectedCategory]);

  useEffect(() => {
    const s = searchParams.get("search");
    if (s) setSearch(s);
  }, [searchParams]);

  const allCategories = ["All", ...categories];

  const CATEGORY_MAP: Record<string, string[]> = {
    "Blinds": ["Roller Blinds", "Zebra Blinds", "Wooden Blinds", "Printed Blinds"],
    "Pleated Mesh": ["Polyster Pleated Mesh", "SS 304 Pleated Mesh"],
    "Honeycomb": ["Honeycomb Blackout", "Honeycomb 2in1"],
    "Partitions & Doors": ["PVC Doors", "Security Mesh", "Crystal Doors"],
  };

  const subCategories = selectedCategory !== "All" ? ["All", ...(CATEGORY_MAP[selectedCategory] || [])] : [];

  const filtered = useMemo(() => {
    let result = [...products];
    if (selectedCategory !== "All") {
      result = result.filter((p) => p.category === selectedCategory);
      if (selectedSubCategory !== "All") {
        result = result.filter((p) => p.name === selectedSubCategory || p.subCategory === selectedSubCategory);
      }
    }
    if (search.trim()) {
      result = result.filter((p) =>
        p.name.toLowerCase().includes(search.toLowerCase())
      );
    }
    if (sortBy === "price-asc") result.sort((a, b) => a.price - b.price);
    if (sortBy === "price-desc") result.sort((a, b) => b.price - a.price);
    if (sortBy === "rating") result.sort((a, b) => b.rating - a.rating);
    return result;
  }, [products, search, selectedCategory, sortBy]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-1">All Products</h1>
        <p className="text-gray-500 text-sm">
          {filtered.length} product{filtered.length !== 1 ? "s" : ""} found
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Sort */}
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="w-4 h-4 text-gray-400" />
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="bg-white border border-gray-200 rounded-xl text-sm px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="default">Sort: Default</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="rating">Top Rated</option>
          </select>
        </div>
      </div>

      {/* Category Tabs */}
      {allCategories.length > 1 && (
        <div className="space-y-4 mb-8">
          <div className="flex gap-2 flex-wrap">
            {allCategories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                  selectedCategory === cat
                    ? "bg-[#1a3a6b] text-white shadow-md"
                    : "bg-white text-gray-600 border border-gray-200 hover:border-[#1a3a6b] hover:text-[#1a3a6b]"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {subCategories.length > 1 && (
            <div className="flex gap-2 flex-wrap p-3 bg-gray-50 rounded-2xl border border-gray-100">
              <span className="text-xs font-bold text-gray-400 uppercase tracking-widest w-full mb-1 ml-1">Sub Categories</span>
              {subCategories.map((sub) => (
                <button
                  key={sub}
                  onClick={() => setSelectedSubCategory(sub)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    selectedSubCategory === sub
                      ? "bg-[#f97316] text-white shadow-sm"
                      : "bg-white text-gray-500 border border-gray-200 hover:border-[#f97316] hover:text-[#f97316]"
                  }`}
                >
                  {sub}
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Products Grid */}
      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filtered.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="text-center py-24 bg-white rounded-2xl border border-dashed border-gray-200">
          <div className="text-5xl mb-4">🔍</div>
          <h3 className="text-xl font-semibold text-gray-700 mb-2">
            {products.length === 0 ? "Products Coming Soon!" : "No products found"}
          </h3>
          <p className="text-gray-400 text-sm">
            {products.length === 0
              ? "Admin se products add hone ke baad yahan dikh jayenge."
              : "Try a different search or category."}
          </p>
          {search && (
            <button
              onClick={() => setSearch("")}
              className="mt-4 text-indigo-600 font-medium hover:underline text-sm"
            >
              Clear search
            </button>
          )}
        </div>
      )}
    </div>
  );
}

export default function ShopPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center py-32 text-gray-400">Loading...</div>}>
      <ShopContent />
    </Suspense>
  );
}

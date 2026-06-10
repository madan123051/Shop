"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Star, ShoppingCart, Heart, Check } from "lucide-react";
import { Product } from "@/data/products";
import { useCart } from "@/context/CartContext";

const badgeColors: Record<string, string> = {
  Sale: "bg-red-500",
  New: "bg-emerald-500",
  Hot: "bg-orange-500",
  "Best Seller": "bg-indigo-500",
};

export default function ProductCard({ product }: { product: Product }) {
  const { addToCart } = useCart();
  const [isAdded, setIsAdded] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);

  const handleAddToCart = () => {
    addToCart(product);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  const handleFavorite = () => {
    setIsFavorite(!isFavorite);
  };

  return (
    <div className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 flex flex-col">
      {/* Image */}
      <Link href={`/product/${product.id}`} className="relative block aspect-square overflow-hidden bg-gray-50">
        <Image
          src={product.image}
          alt={product.name}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
        />
        {product.badge && (
          <span className={`absolute top-3 left-3 ${badgeColors[product.badge]} text-white text-xs font-semibold px-2.5 py-1 rounded-full`}>
            {product.badge}
          </span>
        )}
        {/* Festival Offer Badge */}
        {product.festivalOffer && (
          <span className="absolute bottom-3 left-3 bg-gradient-to-r from-orange-500 to-red-500 text-white text-xs font-bold px-2.5 py-1 rounded-full shadow-lg animate-pulse">
            {product.festivalOffer}
          </span>
        )}
        <button
          onClick={handleFavorite}
          className="absolute top-3 right-3 w-8 h-8 bg-white rounded-full shadow flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-50"
        >
          <Heart
            className={`w-4 h-4 transition-colors ${
              isFavorite ? "text-red-500 fill-red-500" : "text-gray-400 hover:text-red-500"
            }`}
          />
        </button>
      </Link>

      {/* Content */}
      <div className="p-4 flex flex-col flex-1">
        <p className="text-xs text-[#f97316] font-medium uppercase tracking-wide mb-1">
          {product.category}
        </p>
        <Link href={`/product/${product.id}`}>
          <h3 className="font-semibold text-gray-800 hover:text-[#f97316] transition-colors line-clamp-2 mb-2">
            {product.name}
          </h3>
        </Link>

        {/* Rating */}
        <div className="flex items-center gap-1.5 mb-3">
          <div className="flex">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className={`w-3.5 h-3.5 ${
                  star <= Math.round(product.rating)
                    ? "text-amber-400 fill-amber-400"
                    : "text-gray-200 fill-gray-200"
                }`}
              />
            ))}
          </div>
          <span className="text-xs text-gray-500">({product.reviews})</span>
        </div>

        {/* Offer Label */}
        {product.offerLabel && (
          <p className="text-xs text-orange-600 font-semibold bg-orange-50 px-2 py-1 rounded-lg mb-2 border border-orange-100">
            🎁 {product.offerLabel}
            {product.offerValidTill && (
              <span className="text-gray-400 font-normal ml-1">· till {new Date(product.offerValidTill).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}</span>
            )}
          </p>
        )}

        {/* Stock Status */}
        {!product.inStock && (
          <p className="text-xs text-red-600 font-semibold mb-2">Out of Stock</p>
        )}

        {/* Price + Cart */}
        <div className="mt-auto flex items-center justify-between gap-2">
          <div>
            <div className="flex items-center gap-1 flex-wrap">
              <span className="text-lg font-bold text-gray-900">
                ₹{product.price.toLocaleString("en-IN")}
              </span>
              {product.discountPercent && (
                <span className="text-xs font-bold text-green-600 bg-green-50 px-1.5 py-0.5 rounded-full">
                  {product.discountPercent}% OFF
                </span>
              )}
            </div>
            {product.originalPrice && (
              <span className="text-sm text-gray-400 line-through">
                ₹{product.originalPrice.toLocaleString("en-IN")}
              </span>
            )}
          </div>
          <button
            onClick={handleAddToCart}
            disabled={!product.inStock}
            className={`flex items-center gap-1.5 font-medium px-3 py-2 rounded-xl transition-all duration-300 text-sm ${
              isAdded
                ? "bg-emerald-100 text-emerald-700"
                : "bg-[#f97316] hover:bg-[#ea580c] disabled:bg-gray-200 text-white"
            }`}
          >
            {isAdded ? (
              <>
                <Check className="w-4 h-4" />
                Added
              </>
            ) : (
              <>
                <ShoppingCart className="w-4 h-4" />
                Add
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

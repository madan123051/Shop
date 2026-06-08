"use client";

import Image from "next/image";
import Link from "next/link";
import { Star, ShoppingCart, Heart } from "lucide-react";
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
        <button className="absolute top-3 right-3 w-8 h-8 bg-white rounded-full shadow flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-50">
          <Heart className="w-4 h-4 text-gray-400 hover:text-red-500" />
        </button>
      </Link>

      {/* Content */}
      <div className="p-4 flex flex-col flex-1">
        <p className="text-xs text-indigo-600 font-medium uppercase tracking-wide mb-1">
          {product.category}
        </p>
        <Link href={`/product/${product.id}`}>
          <h3 className="font-semibold text-gray-800 hover:text-indigo-600 transition-colors line-clamp-2 mb-2">
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

        {/* Price + Cart */}
        <div className="mt-auto flex items-center justify-between">
          <div>
            <span className="text-lg font-bold text-gray-900">
              ${product.price.toFixed(2)}
            </span>
            {product.originalPrice && (
              <span className="text-sm text-gray-400 line-through ml-1.5">
                ${product.originalPrice.toFixed(2)}
              </span>
            )}
          </div>
          <button
            onClick={() => addToCart(product)}
            disabled={!product.inStock}
            className="flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-200 text-white text-sm font-medium px-3 py-2 rounded-xl transition-colors"
          >
            <ShoppingCart className="w-4 h-4" />
            Add
          </button>
        </div>
      </div>
    </div>
  );
}

"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { Star, ShoppingCart, Heart, Check, Share2, Eye, ChevronLeft, ChevronRight } from "lucide-react";
import { Product } from "@/data/products";
import { useCart } from "@/context/CartContext";
import { useProducts } from "@/context/ProductsContext";
import { useRouter } from "next/navigation";

const badgeColors: Record<string, string> = {
  Sale: "bg-red-500",
  New: "bg-emerald-500",
  Hot: "bg-orange-500",
  "Best Seller": "bg-indigo-500",
};

export default function ProductCard({ product }: { product: Product }) {
  const { addToCart } = useCart();
  const { toggleLike, incrementView } = useProducts();
  const router = useRouter();
  const [isAdded, setIsAdded] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [autoResetKey, setAutoResetKey] = useState(0);
  const touchStartX = useRef<number>(0);
  const isSwiping = useRef<boolean>(false);

  const allImages = [product.image, ...(product.images || [])];
  const hasMultiple = allImages.length > 1;

  // Auto-slide — restarts whenever autoResetKey changes (manual nav)
  useEffect(() => {
    if (!hasMultiple) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % allImages.length);
    }, 3000);
    return () => clearInterval(timer);
  }, [hasMultiple, allImages.length, autoResetKey]);

  const resetSlide = () => setAutoResetKey((k) => k + 1);

  const goPrev = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentIndex((prev) => (prev - 1 + allImages.length) % allImages.length);
    resetSlide();
  };

  const goNext = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentIndex((prev) => (prev + 1) % allImages.length);
    resetSlide();
  };

  const goDot = (i: number, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentIndex(i);
    resetSlide();
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    isSwiping.current = false;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (Math.abs(e.touches[0].clientX - touchStartX.current) > 10) {
      isSwiping.current = true;
    }
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 40) {
      if (diff > 0) {
        setCurrentIndex((prev) => (prev + 1) % allImages.length);
      } else {
        setCurrentIndex((prev) => (prev - 1 + allImages.length) % allImages.length);
      }
      resetSlide();
    }
  };

  const handleImageClick = () => {
    if (!isSwiping.current) {
      incrementView(product.id);
      router.push(`/product/${product.id}`);
    }
  };

  const handleAddToCart = () => {
    addToCart(product);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  const handleFavorite = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isFavorite) {
      await toggleLike(product.id, product.likes || 0);
      setIsFavorite(true);
    }
  };

  const handleShare = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (navigator.share) {
      navigator.share({
        title: product.name,
        text: product.description,
        url: `${window.location.origin}/product/${product.id}`,
      });
    } else {
      navigator.clipboard.writeText(`${window.location.origin}/product/${product.id}`);
      alert("Link copied to clipboard!");
    }
  };

  const handleView = () => {
    incrementView(product.id);
  };

  return (
    <div className="group bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 border border-gray-100 flex flex-col relative">
      {/* Quick Actions Floating Bar */}
      <div className="absolute top-4 right-4 z-10 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-4 group-hover:translate-x-0">
        <button
          onClick={handleFavorite}
          className={`w-10 h-10 rounded-full shadow-lg flex items-center justify-center transition-all ${
            isFavorite ? "bg-red-500 text-white" : "bg-white text-gray-400 hover:text-red-500"
          }`}
        >
          <Heart className={`w-5 h-5 ${isFavorite ? "fill-current" : ""}`} />
        </button>
        <button
          onClick={handleShare}
          className="w-10 h-10 bg-white text-gray-400 hover:text-[#f97316] rounded-full shadow-lg flex items-center justify-center transition-all"
        >
          <Share2 className="w-5 h-5" />
        </button>
        <Link
          href={`/product/${product.id}`}
          onClick={handleView}
          className="w-10 h-10 bg-white text-gray-400 hover:text-blue-500 rounded-full shadow-lg flex items-center justify-center transition-all"
        >
          <Eye className="w-5 h-5" />
        </Link>
      </div>

      {/* ── Image Carousel ── */}
      <div
        className="relative aspect-[4/5] overflow-hidden bg-gray-50 cursor-pointer select-none"
        onClick={handleImageClick}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* Slides Track */}
        <div
          className="flex h-full transition-transform duration-500 ease-in-out"
          style={{
            width: `${allImages.length * 100}%`,
            transform: `translateX(-${currentIndex * (100 / allImages.length)}%)`,
          }}
        >
          {allImages.map((img, i) => (
            <div
              key={i}
              className="relative h-full flex-shrink-0"
              style={{ width: `${100 / allImages.length}%` }}
            >
              <Image
                src={img}
                alt={`${product.name} ${i + 1}`}
                fill
                className="object-cover group-hover:scale-110 transition-transform duration-700"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
              />
            </div>
          ))}
        </div>

        {/* Badges Overlay */}
        <div className="absolute top-4 left-4 flex flex-col gap-2 z-10">
          {product.badge && (
            <span
              className={`${badgeColors[product.badge]} text-white text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full shadow-sm`}
            >
              {product.badge}
            </span>
          )}
          {product.festivalOffer && (
            <span className="bg-gradient-to-r from-orange-500 to-red-500 text-white text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full shadow-lg animate-pulse">
              {product.festivalOffer}
            </span>
          )}
        </div>

        {/* Prev / Next Arrows (visible on hover) */}
        {hasMultiple && (
          <>
            <button
              onClick={goPrev}
              className="absolute left-2 top-1/2 -translate-y-1/2 z-10 w-8 h-8 bg-black/40 hover:bg-black/70 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={goNext}
              className="absolute right-2 top-1/2 -translate-y-1/2 z-10 w-8 h-8 bg-black/40 hover:bg-black/70 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </>
        )}

        {/* Dot Indicators */}
        {hasMultiple && (
          <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-1.5 z-10">
            {allImages.map((_, i) => (
              <button
                key={i}
                onClick={(e) => goDot(i, e)}
                className={`rounded-full transition-all duration-300 ${
                  i === currentIndex ? "bg-white w-4 h-1.5" : "bg-white/50 w-1.5 h-1.5"
                }`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Content Section */}
      <div className="p-5 flex flex-col flex-1">
        <div className="flex items-center justify-between mb-2">
          <p className="text-[10px] text-[#f97316] font-bold uppercase tracking-widest">
            {product.category}
          </p>
          <div className="flex items-center gap-1">
            <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
            <span className="text-xs font-bold text-gray-700">{product.rating}</span>
          </div>
        </div>

        <Link href={`/product/${product.id}`}>
          <h3 className="font-bold text-gray-900 hover:text-[#f97316] transition-colors line-clamp-1 text-lg mb-1">
            {product.name}
          </h3>
        </Link>

        {/* Social Stats */}
        <div className="flex items-center gap-4 mb-4 text-gray-400">
          <button
            onClick={handleFavorite}
            className="flex items-center gap-1 hover:text-red-500 transition-colors"
          >
            <Heart className={`w-3.5 h-3.5 ${isFavorite ? "text-red-500 fill-red-500" : ""}`} />
            <span className="text-[11px] font-medium">{product.likes || 0}</span>
          </button>
          <div className="flex items-center gap-1">
            <Eye className="w-3.5 h-3.5" />
            <span className="text-[11px] font-medium">{product.views || 0}</span>
          </div>
          <button
            onClick={handleShare}
            className="flex items-center gap-1 hover:text-[#f97316] transition-colors"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span className="text-[11px] font-medium">{product.shares || 0}</span>
          </button>
        </div>

        {/* Offer Tag */}
        {product.offerLabel && (
          <div className="bg-orange-50 border border-orange-100 rounded-xl px-3 py-2 mb-4">
            <p className="text-[11px] text-orange-700 font-bold flex items-center gap-1.5">
              <span className="text-sm">🎁</span> {product.offerLabel}
            </p>
          </div>
        )}

        {/* Price & Cart */}
        <div className="mt-auto pt-4 border-t border-gray-50 flex items-center justify-between">
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="text-xl font-black text-gray-900">
                ₹{product.price.toLocaleString("en-IN")}
              </span>
              {product.discountPercent && (
                <span className="text-[10px] font-bold text-white bg-green-500 px-2 py-0.5 rounded-full">
                  -{product.discountPercent}%
                </span>
              )}
            </div>
            {product.originalPrice && (
              <span className="text-xs text-gray-400 line-through font-medium">
                ₹{product.originalPrice.toLocaleString("en-IN")}
              </span>
            )}
          </div>

          <button
            onClick={handleAddToCart}
            disabled={!product.inStock}
            className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-300 ${
              isAdded
                ? "bg-emerald-500 text-white shadow-lg shadow-emerald-200"
                : "bg-[#1a3a6b] hover:bg-[#f97316] text-white shadow-lg shadow-blue-100 hover:shadow-orange-100 disabled:bg-gray-200 disabled:shadow-none"
            }`}
          >
            {isAdded ? <Check className="w-6 h-6" /> : <ShoppingCart className="w-6 h-6" />}
          </button>
        </div>
      </div>
    </div>
  );
}

"use client";

import Image from "next/image";
import Link from "next/link";
import { useProducts } from "@/context/ProductsContext";
import { useCart } from "@/context/CartContext";
import { Star, ShoppingCart, ArrowLeft, Check, Package, Heart, Share2, Eye, MessageCircle, ChevronLeft, ChevronRight } from "lucide-react";
import { useState, useEffect, useRef } from "react";

export default function ProductPage({ params }: { params: { id: string } }) {
  const { id } = params;
  const { products, isLoading, toggleLike, incrementView, addComment } = useProducts();
  const { addToCart } = useCart();
  const product = products.find((p) => p.id === id);
  const [isFavorite, setIsFavorite] = useState(false);
  const [isAdded, setIsAdded] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [userRating, setUserRating] = useState(5);
  const [userName, setUserName] = useState("");

  // ── Image Carousel State ──
  const [imageIndex, setImageIndex] = useState(0);
  const [imgAutoResetKey, setImgAutoResetKey] = useState(0);
  const imgTouchStartX = useRef<number>(0);
  const imgIsSwiping = useRef<boolean>(false);

  // Configurator State
  const [width, setWidth] = useState(1);
  const [height, setHeight] = useState(1);
  const [unit, setUnit] = useState(product?.unit || "ft");
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>({});
  const [calculatedPrice, setCalculatedPrice] = useState(product?.price || 0);
  const [area, setArea] = useState(0);

  const allImages = product ? [product.image, ...(product.images || [])] : [];
  const hasMultipleImages = allImages.length > 1;

  // Auto-slide for product image
  useEffect(() => {
    if (!hasMultipleImages) return;
    const timer = setInterval(() => {
      setImageIndex((prev) => (prev + 1) % allImages.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [hasMultipleImages, allImages.length, imgAutoResetKey]);

  const resetImgSlide = () => setImgAutoResetKey((k) => k + 1);

  const imgGoPrev = (e: React.MouseEvent) => {
    e.preventDefault();
    setImageIndex((prev) => (prev - 1 + allImages.length) % allImages.length);
    resetImgSlide();
  };

  const imgGoNext = (e: React.MouseEvent) => {
    e.preventDefault();
    setImageIndex((prev) => (prev + 1) % allImages.length);
    resetImgSlide();
  };

  const imgGoDot = (i: number) => {
    setImageIndex(i);
    resetImgSlide();
  };

  const handleImgTouchStart = (e: React.TouchEvent) => {
    imgTouchStartX.current = e.touches[0].clientX;
    imgIsSwiping.current = false;
  };

  const handleImgTouchMove = (e: React.TouchEvent) => {
    if (Math.abs(e.touches[0].clientX - imgTouchStartX.current) > 10) {
      imgIsSwiping.current = true;
    }
  };

  const handleImgTouchEnd = (e: React.TouchEvent) => {
    const diff = imgTouchStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 40) {
      if (diff > 0) {
        setImageIndex((prev) => (prev + 1) % allImages.length);
      } else {
        setImageIndex((prev) => (prev - 1 + allImages.length) % allImages.length);
      }
      resetImgSlide();
    }
  };

  useEffect(() => {
    if (!product || !product.isCustomizable) {
      setCalculatedPrice(product?.price || 0);
      return;
    }

    const currentArea = width * height;
    const minArea = product.minimumArea || 0;
    const effectiveArea = Math.max(currentArea, minArea);
    setArea(currentArea);

    let total = (product.baseRate || 0) * effectiveArea;

    if (product.customOptions) {
      product.customOptions.forEach(group => {
        const selectedId = selectedOptions[group.id];
        if (selectedId) {
          const option = group.options.find(o => o.id === selectedId);
          if (option) {
            const val = Number(option.value);
            if (option.type === "fixed") total += val;
            else if (option.type === "percentage") total += (total * val) / 100;
            else if (option.type === "area-based") total += val * effectiveArea;
          }
        }
      });
    }

    if (selectedOptions["installation"] === "yes") {
      total += Number(product.installationCost || 0);
    }

    setCalculatedPrice(Math.round(total));
  }, [product, width, height, unit, selectedOptions]);

  useEffect(() => {
    if (product) {
      incrementView(product.id);
    }
  }, [product?.id]);

  const handleFavorite = async () => {
    if (!product || isFavorite) return;
    await toggleLike(product.id, product.likes || 0);
    setIsFavorite(true);
  };

  const handleShare = () => {
    if (!product) return;
    if (navigator.share) {
      navigator.share({ title: product.name, text: product.description, url: window.location.href });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert("Link copied to clipboard!");
    }
  };

  const handleAddToCart = () => {
    if (!product) return;
    if (product.isCustomizable) {
      const customization = {
        width, height, unit, area,
        selectedOptions: Object.entries(selectedOptions).map(([groupId, optionId]) => {
          const group = product.customOptions?.find(g => g.id === groupId);
          const option = group?.options.find(o => o.id === optionId);
          return { groupId, groupTitle: group?.title || groupId, optionId, optionLabel: option?.label || optionId, price: option?.value || 0 };
        }),
        calculatedPrice
      };
      addToCart(product, customization);
    } else {
      addToCart(product);
    }
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!product || !commentText.trim() || !userName.trim()) return;
    await addComment(product.id, { user: userName, text: commentText, rating: userRating });
    setCommentText(""); setUserName(""); setUserRating(5);
  };

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
        <div className="text-6xl mb-4">📦</div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Product Not Found</h2>
        <p className="text-gray-500 mb-6">This product doesn&apos;t exist or has been removed.</p>
        <Link href="/shop" className="inline-flex items-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-indigo-700 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to Shop
        </Link>
      </div>
    );
  }

  const badgeColors: Record<string, string> = {
    Sale: "bg-red-500", New: "bg-emerald-500", Hot: "bg-orange-500", "Best Seller": "bg-indigo-500",
  };

  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : null;

  const features = Array.isArray(product.features) ? product.features : [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-gray-500 mb-8">
        <Link href="/" className="hover:text-indigo-600">Home</Link>
        <span>/</span>
        <Link href="/shop" className="hover:text-indigo-600">Shop</Link>
        <span>/</span>
        <Link href={`/shop?category=${product.category}`} className="hover:text-indigo-600">{product.category}</Link>
        <span>/</span>
        <span className="text-gray-800 font-medium line-clamp-1">{product.name}</span>
      </nav>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* ── Image Carousel ── */}
        <div className="flex flex-col gap-3">
          {/* Main Carousel */}
          <div
            className="relative aspect-square rounded-3xl overflow-hidden bg-gray-100 select-none"
            onTouchStart={handleImgTouchStart}
            onTouchMove={handleImgTouchMove}
            onTouchEnd={handleImgTouchEnd}
          >
            {/* Slides Track */}
            <div
              className="flex h-full transition-transform duration-500 ease-in-out"
              style={{
                width: `${allImages.length * 100}%`,
                transform: `translateX(-${imageIndex * (100 / allImages.length)}%)`,
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
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 50vw"
                    priority={i === 0}
                  />
                </div>
              ))}
            </div>

            {/* Badge */}
            {product.badge && (
              <span className={`absolute top-4 left-4 z-10 ${badgeColors[product.badge]} text-white text-sm font-semibold px-3 py-1.5 rounded-full`}>
                {product.badge}
              </span>
            )}

            {/* Prev / Next Arrows */}
            {hasMultipleImages && (
              <>
                <button
                  onClick={imgGoPrev}
                  className="absolute left-3 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-black/40 hover:bg-black/70 text-white rounded-full flex items-center justify-center transition-all"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={imgGoNext}
                  className="absolute right-3 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-black/40 hover:bg-black/70 text-white rounded-full flex items-center justify-center transition-all"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </>
            )}

            {/* Dot Indicators */}
            {hasMultipleImages && (
              <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2 z-10">
                {allImages.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => imgGoDot(i)}
                    className={`rounded-full transition-all duration-300 ${
                      i === imageIndex ? "bg-white w-5 h-2" : "bg-white/50 w-2 h-2"
                    }`}
                  />
                ))}
              </div>
            )}

            {/* Image counter */}
            {hasMultipleImages && (
              <div className="absolute top-4 right-4 z-10 bg-black/50 backdrop-blur-sm text-white text-xs font-bold px-2.5 py-1 rounded-lg">
                {imageIndex + 1} / {allImages.length}
              </div>
            )}
          </div>

          {/* Thumbnail Strip */}
          {hasMultipleImages && (
            <div className="flex gap-2 overflow-x-auto pb-1">
              {allImages.map((img, i) => (
                <button
                  key={i}
                  onClick={() => imgGoDot(i)}
                  className={`relative flex-shrink-0 w-16 h-16 rounded-xl overflow-hidden border-2 transition-all ${
                    i === imageIndex ? "border-[#f97316] opacity-100" : "border-transparent opacity-50 hover:opacity-75"
                  }`}
                >
                  <Image src={img} alt={`Thumbnail ${i + 1}`} fill className="object-cover" sizes="64px" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Details */}
        <div className="flex flex-col">
          <span className="text-sm font-semibold text-indigo-600 uppercase tracking-wide mb-2">
            {product.category}
          </span>
          <h1 className="text-3xl font-extrabold text-gray-900 mb-4">{product.name}</h1>

          {/* Rating */}
          <div className="flex items-center gap-2 mb-5">
            <div className="flex">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star key={star} className={`w-4 h-4 ${star <= Math.round(product.rating) ? "text-amber-400 fill-amber-400" : "text-gray-200 fill-gray-200"}`} />
              ))}
            </div>
            <span className="text-sm font-semibold text-gray-700">{product.rating}</span>
            <span className="text-sm text-gray-400">({product.reviews} reviews)</span>
          </div>

          {/* Price */}
          <div className="flex items-end gap-3 mb-6">
            <span className="text-4xl font-extrabold text-gray-900">
              {product.isCustomizable ? `₹${product.baseRate}/sq ${product.unit}` : `₹${product.price.toLocaleString('en-IN')}`}
            </span>
            {product.originalPrice && (
              <>
                <span className="text-xl text-gray-400 line-through mb-1">₹{product.originalPrice.toLocaleString('en-IN')}</span>
                <span className="bg-red-100 text-red-600 text-sm font-bold px-2.5 py-1 rounded-lg mb-1">-{discount}% OFF</span>
              </>
            )}
          </div>

          <p className="text-gray-600 leading-relaxed mb-6">{product.description}</p>

          {/* Configurator */}
          {product.isCustomizable && (
            <div className="bg-gray-50 rounded-3xl p-6 mb-8 border border-gray-100">
              <h3 className="text-lg font-bold text-[#1a3a6b] mb-4 flex items-center gap-2">
                <Package className="w-5 h-5" /> Customize Your Product
              </h3>
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Width ({unit})</label>
                  <input type="number" min="1" value={width} onChange={(e) => setWidth(Number(e.target.value))} className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#f97316] outline-none" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Height ({unit})</label>
                  <input type="number" min="1" value={height} onChange={(e) => setHeight(Number(e.target.value))} className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#f97316] outline-none" />
                </div>
              </div>
              <div className="flex items-center justify-between mb-6 p-3 bg-white rounded-xl border border-gray-100">
                <span className="text-sm font-bold text-gray-600">Total Area:</span>
                <span className="text-sm font-black text-[#f97316]">{area.toFixed(2)} sq {unit}</span>
              </div>
              <div className="space-y-4">
                {product.customOptions?.map(group => (
                  <div key={group.id}>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-2">{group.title}</label>
                    <div className="grid grid-cols-2 gap-2">
                      {group.options.map(option => (
                        <button key={option.id} onClick={() => setSelectedOptions(prev => ({ ...prev, [group.id]: option.id }))}
                          className={`px-4 py-2.5 text-sm font-bold rounded-xl border-2 transition-all ${selectedOptions[group.id] === option.id ? "border-[#f97316] bg-orange-50 text-[#f97316]" : "border-gray-100 bg-white text-gray-500 hover:border-gray-200"}`}>
                          {option.label}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Installation Required?</label>
                  <div className="grid grid-cols-2 gap-2">
                    {["yes", "no"].map(opt => (
                      <button key={opt} onClick={() => setSelectedOptions(prev => ({ ...prev, "installation": opt }))}
                        className={`px-4 py-2.5 text-sm font-bold rounded-xl border-2 transition-all ${selectedOptions["installation"] === opt ? "border-[#f97316] bg-orange-50 text-[#f97316]" : "border-gray-100 bg-white text-gray-500 hover:border-gray-200"}`}>
                        {opt.toUpperCase()}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              <div className="mt-8 pt-6 border-t border-gray-200">
                <div className="flex items-center justify-between">
                  <span className="text-gray-500 font-bold">Estimated Total:</span>
                  <span className="text-3xl font-black text-gray-900">₹{calculatedPrice.toLocaleString("en-IN")}</span>
                </div>
                <p className="text-[10px] text-gray-400 mt-2 italic">*Final price may vary based on actual measurements during site visit.</p>
              </div>
            </div>
          )}

          {/* Features */}
          {features.length > 0 && (
            <div className="mb-6">
              <h3 className="font-semibold text-gray-800 mb-3">Key Features</h3>
              <ul className="space-y-2">
                {features.map((f, i) => (
                  <li key={i} className="flex items-center gap-2 text-sm text-gray-600">
                    <Check className="w-4 h-4 text-emerald-500 shrink-0" />{f}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Social Stats */}
          <div className="flex items-center gap-6 mb-8 pb-6 border-b border-gray-100">
            <div className="flex items-center gap-4 text-gray-500">
              <div className="flex items-center gap-1.5"><Heart className="w-4 h-4" /><span className="text-sm font-bold">{product.likes || 0}</span></div>
              <div className="flex items-center gap-1.5"><Eye className="w-4 h-4" /><span className="text-sm font-bold">{product.views || 0}</span></div>
              <div className="flex items-center gap-1.5"><Share2 className="w-4 h-4" /><span className="text-sm font-bold">{product.shares || 0}</span></div>
            </div>
            <div className="flex items-center gap-2 ml-auto">
              <button onClick={handleFavorite} className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${isFavorite ? "bg-red-500 text-white" : "bg-gray-50 text-gray-400 hover:text-red-500"}`}>
                <Heart className={`w-5 h-5 ${isFavorite ? "fill-current" : ""}`} />
              </button>
              <button onClick={handleShare} className="w-10 h-10 bg-gray-50 text-gray-400 hover:text-[#f97316] rounded-full flex items-center justify-center transition-all">
                <Share2 className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Stock */}
          <div className="flex items-center gap-2 mb-6">
            <Package className="w-4 h-4 text-emerald-500" />
            <span className={`text-sm font-medium ${product.inStock ? "text-emerald-600" : "text-red-500"}`}>
              {product.inStock ? "In Stock — Ready to ship" : "Out of Stock"}
            </span>
          </div>

          {/* Buttons */}
          <div className="flex gap-3">
            <button onClick={handleAddToCart} disabled={!product.inStock}
              className={`flex-1 flex items-center justify-center gap-2 font-bold py-4 rounded-2xl transition-all text-base shadow-lg ${isAdded ? "bg-emerald-500 text-white shadow-emerald-200" : "bg-[#1a3a6b] hover:bg-[#f97316] text-white shadow-blue-100"}`}>
              {isAdded ? <Check className="w-5 h-5" /> : <ShoppingCart className="w-5 h-5" />}
              {isAdded ? "Added to Cart" : "Add to Cart"}
            </button>
            <Link href="/cart" className="flex items-center justify-center gap-2 border-2 border-[#1a3a6b] text-[#1a3a6b] hover:bg-gray-50 font-bold px-6 py-4 rounded-2xl transition-colors">
              View Cart
            </Link>
          </div>
        </div>
      </div>

      {/* Comments & Reviews Section */}
      <div className="mt-16 pt-16 border-t border-gray-100">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-1">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Customer Reviews</h2>
            <div className="bg-gray-50 rounded-3xl p-8 text-center">
              <p className="text-5xl font-black text-gray-900 mb-2">{product.rating}</p>
              <div className="flex justify-center mb-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star key={star} className={`w-5 h-5 ${star <= Math.round(product.rating) ? "text-amber-400 fill-amber-400" : "text-gray-200 fill-gray-200"}`} />
                ))}
              </div>
              <p className="text-sm text-gray-500 font-medium">Based on {product.reviews} reviews</p>
            </div>
            <form onSubmit={handleSubmitComment} className="mt-8 space-y-4">
              <h3 className="font-bold text-gray-800">Write a Review</h3>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Your Rating</label>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button key={star} type="button" onClick={() => setUserRating(star)} className="focus:outline-none">
                      <Star className={`w-6 h-6 ${star <= userRating ? "text-amber-400 fill-amber-400" : "text-gray-200"}`} />
                    </button>
                  ))}
                </div>
              </div>
              <input type="text" placeholder="Your Name" value={userName} onChange={(e) => setUserName(e.target.value)} required className="w-full px-4 py-3 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-[#f97316] text-sm" />
              <textarea placeholder="Share your experience..." rows={4} value={commentText} onChange={(e) => setCommentText(e.target.value)} required className="w-full px-4 py-3 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-[#f97316] text-sm" />
              <button type="submit" className="w-full bg-[#1a3a6b] text-white font-bold py-3 rounded-2xl hover:bg-[#f97316] transition-all shadow-lg">Submit Review</button>
            </form>
          </div>
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-xl font-bold text-gray-900">Latest Comments</h3>
              <span className="text-sm text-gray-500 font-medium">{product.commentsList?.length || 0} Comments</span>
            </div>
            <div className="space-y-8">
              {product.commentsList && product.commentsList.length > 0 ? (
                product.commentsList.map((comment, i) => (
                  <div key={i} className="flex gap-4">
                    <div className="w-12 h-12 bg-orange-100 rounded-2xl flex items-center justify-center text-[#f97316] font-bold shrink-0">
                      {comment.user.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="font-bold text-gray-900">{comment.user}</h4>
                        <span className="text-xs text-gray-400">{new Date(comment.date).toLocaleDateString()}</span>
                      </div>
                      <div className="flex mb-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star key={star} className={`w-3 h-3 ${star <= comment.rating ? "text-amber-400 fill-amber-400" : "text-gray-200 fill-gray-200"}`} />
                        ))}
                      </div>
                      <p className="text-gray-600 text-sm leading-relaxed">{comment.text}</p>
                    </div>
                  </div>
                )).reverse()
              ) : (
                <div className="text-center py-12 bg-gray-50 rounded-3xl">
                  <MessageCircle className="w-12 h-12 text-gray-200 mx-auto mb-3" />
                  <p className="text-gray-400 text-sm">No reviews yet. Be the first to share your thoughts!</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

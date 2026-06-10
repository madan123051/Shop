"use client";

import Image from "next/image";
import Link from "next/link";
import { useProducts } from "@/context/ProductsContext";
import { useCart } from "@/context/CartContext";
import { Star, ShoppingCart, ArrowLeft, Check, Package, Heart, Share2, Eye, MessageCircle } from "lucide-react";
import { useState, useEffect } from "react";

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
      navigator.share({
        title: product.name,
        text: product.description,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert("Link copied to clipboard!");
    }
  };

  const handleAddToCart = () => {
    if (!product) return;
    addToCart(product);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!product || !commentText.trim() || !userName.trim()) return;
    
    await addComment(product.id, {
      user: userName,
      text: commentText,
      rating: userRating
    });
    
    setCommentText("");
    setUserName("");
    setUserRating(5);
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
    Sale: "bg-red-500",
    New: "bg-emerald-500",
    Hot: "bg-orange-500",
    "Best Seller": "bg-indigo-500",
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
        {/* Image */}
        <div className="relative aspect-square rounded-3xl overflow-hidden bg-gray-100">
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 50vw"
            priority
          />
          {product.badge && (
            <span className={`absolute top-4 left-4 ${badgeColors[product.badge]} text-white text-sm font-semibold px-3 py-1.5 rounded-full`}>
              {product.badge}
            </span>
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
                <Star
                  key={star}
                  className={`w-4 h-4 ${
                    star <= Math.round(product.rating)
                      ? "text-amber-400 fill-amber-400"
                      : "text-gray-200 fill-gray-200"
                  }`}
                />
              ))}
            </div>
            <span className="text-sm font-semibold text-gray-700">{product.rating}</span>
            <span className="text-sm text-gray-400">({product.reviews} reviews)</span>
          </div>

          {/* Price */}
          <div className="flex items-end gap-3 mb-6">
            <span className="text-4xl font-extrabold text-gray-900">₹{product.price.toLocaleString('en-IN')}</span>
            {product.originalPrice && (
              <>
                <span className="text-xl text-gray-400 line-through mb-1">₹{product.originalPrice.toLocaleString('en-IN')}</span>
                <span className="bg-red-100 text-red-600 text-sm font-bold px-2.5 py-1 rounded-lg mb-1">
                  -{discount}% OFF
                </span>
              </>
            )}
          </div>

          <p className="text-gray-600 leading-relaxed mb-6">{product.description}</p>

          {/* Features */}
          {features.length > 0 && (
            <div className="mb-6">
              <h3 className="font-semibold text-gray-800 mb-3">Key Features</h3>
              <ul className="space-y-2">
                {features.map((f, i) => (
                  <li key={i} className="flex items-center gap-2 text-sm text-gray-600">
                    <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Social Stats & Interaction */}
          <div className="flex items-center gap-6 mb-8 pb-6 border-b border-gray-100">
            <div className="flex items-center gap-4 text-gray-500">
              <div className="flex items-center gap-1.5">
                <Heart className="w-4 h-4" />
                <span className="text-sm font-bold">{product.likes || 0}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Eye className="w-4 h-4" />
                <span className="text-sm font-bold">{product.views || 0}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Share2 className="w-4 h-4" />
                <span className="text-sm font-bold">{product.shares || 0}</span>
              </div>
            </div>
            
            <div className="flex items-center gap-2 ml-auto">
              <button 
                onClick={handleFavorite}
                className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${isFavorite ? "bg-red-500 text-white" : "bg-gray-50 text-gray-400 hover:text-red-500"}`}
              >
                <Heart className={`w-5 h-5 ${isFavorite ? "fill-current" : ""}`} />
              </button>
              <button 
                onClick={handleShare}
                className="w-10 h-10 bg-gray-50 text-gray-400 hover:text-[#f97316] rounded-full flex items-center justify-center transition-all"
              >
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
            <button
              onClick={handleAddToCart}
              disabled={!product.inStock}
              className={`flex-1 flex items-center justify-center gap-2 font-bold py-4 rounded-2xl transition-all text-base shadow-lg ${
                isAdded 
                  ? "bg-emerald-500 text-white shadow-emerald-200" 
                  : "bg-[#1a3a6b] hover:bg-[#f97316] text-white shadow-blue-100"
              }`}
            >
              {isAdded ? <Check className="w-5 h-5" /> : <ShoppingCart className="w-5 h-5" />}
              {isAdded ? "Added to Cart" : "Add to Cart"}
            </button>
            <Link
              href="/cart"
              className="flex items-center justify-center gap-2 border-2 border-[#1a3a6b] text-[#1a3a6b] hover:bg-gray-50 font-bold px-6 py-4 rounded-2xl transition-colors"
            >
              View Cart
            </Link>
          </div>
        </div>
      </div>

      {/* Comments & Reviews Section */}
      <div className="mt-16 pt-16 border-t border-gray-100">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Review Summary */}
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

            {/* Add Review Form */}
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
              <input 
                type="text" 
                placeholder="Your Name" 
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                required
                className="w-full px-4 py-3 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-[#f97316] text-sm"
              />
              <textarea 
                placeholder="Share your experience..." 
                rows={4}
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                required
                className="w-full px-4 py-3 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-[#f97316] text-sm"
              />
              <button type="submit" className="w-full bg-[#1a3a6b] text-white font-bold py-3 rounded-2xl hover:bg-[#f97316] transition-all shadow-lg">
                Submit Review
              </button>
            </form>
          </div>

          {/* Comments List */}
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

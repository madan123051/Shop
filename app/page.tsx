import Link from "next/link";
import { ArrowRight, ShieldCheck, Truck, RefreshCw, Headphones } from "lucide-react";
import { products, categories } from "@/data/products";
import ProductCard from "@/components/ProductCard";

const features = [
  { icon: Truck, title: "Free Shipping", desc: "On all orders over $50" },
  { icon: ShieldCheck, title: "Secure Payment", desc: "100% secure transactions" },
  { icon: RefreshCw, title: "Easy Returns", desc: "30-day return policy" },
  { icon: Headphones, title: "24/7 Support", desc: "Always here to help" },
];

export default function HomePage() {
  const featured = products.slice(0, 4);
  const hasProducts = products.length > 0;

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-indigo-600 via-indigo-700 to-purple-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28">
          <div className="max-w-2xl">
            <span className="inline-block bg-white/20 text-white text-sm font-semibold px-4 py-1.5 rounded-full mb-5 backdrop-blur-sm">
              🎉 New Arrivals Every Week
            </span>
            <h1 className="text-4xl md:text-6xl font-extrabold leading-tight mb-6">
              Shop The Best
              <span className="block text-indigo-200">Products Online</span>
            </h1>
            <p className="text-indigo-100 text-lg md:text-xl mb-8 leading-relaxed">
              Discover amazing deals on electronics, fashion, home decor, sports gear, and more — all in one place.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                href="/shop"
                className="inline-flex items-center gap-2 bg-white text-indigo-700 font-bold px-7 py-3.5 rounded-2xl hover:bg-indigo-50 transition-colors shadow-lg"
              >
                Shop Now <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/shop"
                className="inline-flex items-center gap-2 border-2 border-white/50 text-white font-semibold px-7 py-3.5 rounded-2xl hover:bg-white/10 transition-colors"
              >
                Browse Categories
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Strip */}
      <section className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {features.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="flex items-center gap-3">
                <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center shrink-0">
                  <Icon className="w-5 h-5 text-indigo-600" />
                </div>
                <div>
                  <p className="font-semibold text-gray-800 text-sm">{title}</p>
                  <p className="text-gray-500 text-xs">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      {categories.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Shop by Category</h2>
            <Link href="/shop" className="text-indigo-600 hover:text-indigo-700 font-semibold flex items-center gap-1 text-sm">
              View All <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="flex flex-wrap gap-3">
            {categories.map((cat) => (
              <Link
                key={cat}
                href={`/shop?category=${cat}`}
                className="px-5 py-2.5 bg-white border border-gray-200 rounded-2xl text-sm font-medium text-gray-700 hover:border-indigo-400 hover:text-indigo-600 hover:bg-indigo-50 transition-all shadow-sm"
              >
                {cat}
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Featured Products */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Featured Products</h2>
          {hasProducts && (
            <Link href="/shop" className="text-indigo-600 hover:text-indigo-700 font-semibold flex items-center gap-1 text-sm">
              View All <ArrowRight className="w-4 h-4" />
            </Link>
          )}
        </div>

        {hasProducts ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featured.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-gray-200">
            <div className="text-5xl mb-4">🛍️</div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">Products Coming Soon!</h3>
            <p className="text-gray-400 text-sm">Firebase se products connect hone ke baad yahan dikh jayenge.</p>
          </div>
        )}
      </section>

      {/* CTA Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-14">
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-3xl p-10 md:p-14 text-center text-white">
          <h2 className="text-3xl md:text-4xl font-extrabold mb-3">Ready to Start Shopping?</h2>
          <p className="text-indigo-200 mb-7 text-lg">Exclusive deals and new arrivals added regularly.</p>
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 bg-white text-indigo-700 font-bold px-8 py-3.5 rounded-2xl hover:bg-indigo-50 transition-colors shadow-lg"
          >
            Explore Shop <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}

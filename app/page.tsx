"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowRight, ShieldCheck, Star, Clock, Headphones } from "lucide-react";
import { useProducts } from "@/context/ProductsContext";
import ProductCard from "@/components/ProductCard";

const stats = [
  { value: "10+", label: "Years Experience" },
  { value: "2k+", label: "Happy Clients" },
  { value: "100%", label: "Quality Guarantee" },
  { value: "24/7", label: "Customer Support" },
];

const features = [
  { icon: ShieldCheck, title: "Premium Quality", desc: "316-grade stainless steel & certified materials" },
  { icon: Star,        title: "Expert Installation", desc: "Trained professionals across Delhi NCR" },
  { icon: Clock,       title: "Fast Delivery", desc: "On-time delivery & hassle-free setup" },
  { icon: Headphones,  title: "After-Sales Support", desc: "Dedicated support after every order" },
];

const categoryCards = [
  {
    name: "Blinds",
    emoji: "🪟",
    desc: "Roller, Zebra, Wooden & Printed Blinds",
    href: "/shop?category=Blinds",
    bg: "from-[#1a3a6b] to-[#1e4d8c]",
  },
  {
    name: "Pleated Mesh",
    emoji: "🔲",
    desc: "Polyster & SS 304 Pleated Mesh Screens",
    href: "/shop?category=Pleated+Mesh",
    bg: "from-[#f97316] to-[#ea580c]",
  },
  {
    name: "Honeycomb",
    emoji: "🍯",
    desc: "Blackout & 2in1 Honeycomb Blinds",
    href: "/shop?category=Honeycomb",
    bg: "from-[#1a3a6b] to-[#1e4d8c]",
  },
  {
    name: "Partitions & Doors",
    emoji: "🚪",
    desc: "PVC, Security Mesh & Crystal Doors",
    href: "/shop?category=Partitions+%26+Doors",
    bg: "from-[#f97316] to-[#ea580c]",
  },
];

export default function HomePage() {
  const { products, categories } = useProducts();
  const featured = products.slice(0, 4);

  return (
    <div>
      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section className="bg-gradient-to-br from-[#fdf6ee] via-[#fef9f4] to-[#fff3e8] overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="inline-block border border-[#f97316]/40 text-[#f97316] text-xs font-bold px-4 py-1.5 rounded-full mb-5 bg-orange-50 tracking-wide uppercase">
                Premium Home Solutions
              </span>
              <h1 className="text-4xl md:text-6xl font-extrabold text-[#1a3a6b] leading-tight mb-6">
                Protect Your Home{" "}
                <span className="text-[#f97316]">
                  With Modern Technology
                </span>
              </h1>
              <p className="text-gray-600 text-lg mb-4 leading-relaxed">
                Serving premium home protection &amp; interior solutions across Delhi NCR. Specialising in Blinds, Pleated Mosquito Nets, Honeycomb Partitions &amp; more.
              </p>
              <div className="flex flex-wrap gap-4 mt-8">
                <Link
                  href="/shop"
                  className="inline-flex items-center gap-2 bg-[#f97316] hover:bg-[#ea580c] text-white font-bold px-7 py-3.5 rounded-full transition-colors shadow-lg"
                >
                  Shop Now <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  href="/shop"
                  className="inline-flex items-center gap-2 border-2 border-[#1a3a6b] text-[#1a3a6b] font-semibold px-7 py-3.5 rounded-full hover:bg-[#1a3a6b] hover:text-white transition-colors"
                >
                  Browse Categories
                </Link>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 mt-12">
                {stats.map(({ value, label }) => (
                  <div key={label}>
                    <p className="text-3xl font-extrabold text-[#f97316]">{value}</p>
                    <p className="text-sm text-gray-500 mt-0.5">{label}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Hero Image */}
            <div className="relative hidden lg:block">
              <div className="absolute -inset-4 bg-gradient-to-r from-[#f97316]/20 to-[#1a3a6b]/20 rounded-3xl blur-2xl opacity-30 animate-pulse" />
              <div className="relative bg-white p-4 rounded-3xl shadow-2xl border border-gray-100 transform hover:scale-[1.02] transition-transform duration-500">
                <Image
                  src="/hero-image.png?v=1"
                  alt="NewTech Premium Home Solutions"
                  width={800}
                  height={600}
                  className="rounded-2xl w-full h-auto object-cover"
                  priority
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Features Strip ───────────────────────────────────────────────── */}
      <section className="bg-[#1a3a6b]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {features.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[#f97316]/20 rounded-xl flex items-center justify-center shrink-0">
                  <Icon className="w-5 h-5 text-[#f97316]" />
                </div>
                <div>
                  <p className="font-semibold text-white text-sm">{title}</p>
                  <p className="text-blue-200 text-xs mt-0.5">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Category Cards ───────────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex items-center justify-between mb-8">
          <div>
            <p className="text-xs font-bold text-[#f97316] uppercase tracking-widest mb-1">Our Expertise</p>
            <h2 className="text-2xl md:text-3xl font-bold text-[#1a3a6b]">Solutions We Provide</h2>
          </div>
          <Link href="/shop" className="text-[#f97316] hover:text-[#ea580c] font-semibold flex items-center gap-1 text-sm">
            View All <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {categoryCards.map((cat) => (
            <Link
              key={cat.name}
              href={cat.href}
              className={`bg-gradient-to-br ${cat.bg} rounded-2xl p-6 text-white hover:opacity-90 transition-opacity shadow-md group`}
            >
              <div className="text-4xl mb-3">{cat.emoji}</div>
              <h3 className="font-bold text-lg mb-1">{cat.name}</h3>
              <p className="text-white/80 text-sm mb-4">{cat.desc}</p>
              <span className="inline-flex items-center gap-1 text-sm font-semibold group-hover:gap-2 transition-all">
                Explore <ArrowRight className="w-4 h-4" />
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* ── Category Pills ───────────────────────────────────────────────── */}
      {categories.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-6">
          <div className="flex flex-wrap gap-3">
            {categories.map((cat) => (
              <Link
                key={cat}
                href={`/shop?category=${encodeURIComponent(cat)}`}
                className="px-5 py-2.5 bg-white border border-[#1a3a6b]/20 rounded-full text-sm font-medium text-[#1a3a6b] hover:border-[#f97316] hover:text-[#f97316] hover:bg-orange-50 transition-all shadow-sm"
              >
                {cat}
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* ── Featured Products ────────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="flex items-center justify-between mb-8">
          <div>
            <p className="text-xs font-bold text-[#f97316] uppercase tracking-widest mb-1">Top Picks</p>
            <h2 className="text-2xl md:text-3xl font-bold text-[#1a3a6b]">Featured Products</h2>
          </div>
          <Link href="/shop" className="text-[#f97316] hover:text-[#ea580c] font-semibold flex items-center gap-1 text-sm">
            View All <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featured.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* ── CTA Banner ───────────────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="bg-gradient-to-r from-[#1a3a6b] to-[#1e4d8c] rounded-3xl p-10 md:p-14 text-center text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#f97316]/10 rounded-full -translate-y-1/2 translate-x-1/4 blur-3xl" />
          <div className="relative">
            <p className="text-xs font-bold text-[#f97316] uppercase tracking-widest mb-3">Ready to Upgrade?</p>
            <h2 className="text-3xl md:text-4xl font-extrabold mb-3">Get a Free Quote Today</h2>
            <p className="text-blue-200 mb-7 text-lg">Expert installation across Delhi NCR. Customised solutions for every home &amp; office.</p>
            <Link
              href="/shop"
              className="inline-flex items-center gap-2 bg-[#f97316] hover:bg-[#ea580c] text-white font-bold px-8 py-3.5 rounded-full transition-colors shadow-lg"
            >
              Explore Shop <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

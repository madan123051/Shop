"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ChevronDown,
  ChevronUp,
  Star,
  ArrowRight,
  CheckCircle2,
  Phone,
  Mail,
  MapPin,
  Tag,
} from "lucide-react";
import { products, categories } from "@/data/products";

// ─── Types ────────────────────────────────────────────────────────────────────

interface FormState {
  name: string;
  phone: string;
  email: string;
  category: string;
  product: string;
  width: string;
  height: string;
  quantity: string;
  address: string;
  notes: string;
}

// ─── Badge colours ────────────────────────────────────────────────────────────

const badgeStyle: Record<string, string> = {
  "Best Seller": "bg-green-100 text-green-700",
  Hot: "bg-red-100 text-red-600",
  New: "bg-blue-100 text-blue-600",
  Sale: "bg-orange-100 text-orange-600",
};

// ─── Component ────────────────────────────────────────────────────────────────

export default function QuotePage() {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>("All");
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [form, setForm] = useState<FormState>({
    name: "",
    phone: "",
    email: "",
    category: "",
    product: "",
    width: "",
    height: "",
    quantity: "1",
    address: "",
    notes: "",
  });

  const filteredProducts =
    activeCategory === "All"
      ? products
      : products.filter((p) => p.category === activeCategory);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await fetch("/api/quotes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error("Failed");
      setSubmitted(true);
    } catch {
      alert("Something went wrong. Please try again or contact us directly.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ── Hero ───────────────────────────────────────────────────────────── */}
      <section className="bg-gradient-to-br from-[#1a3a6b] via-[#1e4d8c] to-[#1a3a6b] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 md:py-20 text-center">
          <span className="inline-block bg-[#f97316]/20 border border-[#f97316]/40 text-[#f97316] text-xs font-bold px-4 py-1.5 rounded-full mb-4 uppercase tracking-wide">
            Free Consultation
          </span>
          <h1 className="text-3xl md:text-5xl font-extrabold mb-4 leading-tight">
            Get a Free Quote &amp; Product Details
          </h1>
          <p className="text-blue-200 text-lg max-w-2xl mx-auto">
            Browse our complete product range, explore specifications, and
            request a personalised quote. Expert installation across Delhi NCR.
          </p>
          <div className="flex flex-wrap justify-center gap-6 mt-10 text-sm">
            {[
              { icon: Phone, text: "+91 98765 43210" },
              { icon: Mail, text: "info@newtechshop.in" },
              { icon: MapPin, text: "Delhi NCR, India" },
            ].map(({ icon: Icon, text }) => (
              <div key={text} className="flex items-center gap-2 text-blue-200">
                <Icon className="w-4 h-4 text-[#f97316]" />
                <span>{text}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
        {/* ── Products Section ─────────────────────────────────────────────── */}
        <section>
          <div className="mb-8">
            <p className="text-xs font-bold text-[#f97316] uppercase tracking-widest mb-1">
              Our Range
            </p>
            <h2 className="text-2xl md:text-3xl font-bold text-[#1a3a6b]">
              Products &amp; Details
            </h2>
            <p className="text-gray-500 mt-1">
              Click any product to view full specifications and pricing.
            </p>
          </div>

          {/* Category filter */}
          <div className="flex flex-wrap gap-2 mb-6">
            {["All", ...categories].map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  activeCategory === cat
                    ? "bg-[#f97316] text-white shadow-sm"
                    : "bg-white border border-gray-200 text-gray-600 hover:border-[#f97316] hover:text-[#f97316]"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Product cards */}
          <div className="space-y-4">
            {filteredProducts.map((product) => {
              const isOpen = expandedId === product.id;
              const discount = product.originalPrice
                ? Math.round(
                    ((product.originalPrice - product.price) /
                      product.originalPrice) *
                      100
                  )
                : 0;

              return (
                <div
                  key={product.id}
                  className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden"
                >
                  {/* Card header — always visible */}
                  <button
                    onClick={() =>
                      setExpandedId(isOpen ? null : product.id)
                    }
                    className="w-full text-left px-5 py-4 flex items-center gap-4 hover:bg-gray-50 transition-colors"
                  >
                    {/* Emoji placeholder */}
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#1a3a6b] to-[#1e4d8c] flex items-center justify-center text-xl shrink-0">
                      {product.category === "Blinds"
                        ? "🪟"
                        : product.category === "Pleated Mesh"
                        ? "🔲"
                        : product.category === "Honeycomb"
                        ? "🍯"
                        : "🚪"}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-0.5">
                        <span className="font-semibold text-[#1a3a6b] text-base">
                          {product.name}
                        </span>
                        {product.badge && (
                          <span
                            className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                              badgeStyle[product.badge] ??
                              "bg-gray-100 text-gray-600"
                            }`}
                          >
                            {product.badge}
                          </span>
                        )}
                      </div>
                      <div className="flex flex-wrap items-center gap-3 text-sm">
                        <span className="text-gray-500">{product.category}</span>
                        <span className="flex items-center gap-0.5 text-yellow-500">
                          <Star className="w-3.5 h-3.5 fill-current" />
                          <span className="text-gray-600 font-medium">
                            {product.rating}
                          </span>
                          <span className="text-gray-400">
                            ({product.reviews})
                          </span>
                        </span>
                      </div>
                    </div>

                    <div className="text-right shrink-0 mr-3">
                      <p className="text-lg font-bold text-[#1a3a6b]">
                        ₹{product.price.toLocaleString("en-IN")}
                      </p>
                      {product.originalPrice && (
                        <div className="flex items-center gap-1 justify-end">
                          <span className="text-xs text-gray-400 line-through">
                            ₹{product.originalPrice.toLocaleString("en-IN")}
                          </span>
                          <span className="text-xs text-green-600 font-semibold flex items-center gap-0.5">
                            <Tag className="w-3 h-3" />
                            {discount}% off
                          </span>
                        </div>
                      )}
                    </div>

                    {isOpen ? (
                      <ChevronUp className="w-5 h-5 text-gray-400 shrink-0" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-gray-400 shrink-0" />
                    )}
                  </button>

                  {/* Expanded details */}
                  {isOpen && (
                    <div className="px-5 pb-5 border-t border-gray-50">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-5">
                        <div>
                          <h4 className="font-semibold text-[#1a3a6b] mb-2">
                            About this product
                          </h4>
                          <p className="text-gray-600 text-sm leading-relaxed">
                            {product.description}
                          </p>
                        </div>
                        <div>
                          <h4 className="font-semibold text-[#1a3a6b] mb-2">
                            Key Features
                          </h4>
                          <ul className="space-y-1.5">
                            {product.features.map((f) => (
                              <li
                                key={f}
                                className="flex items-start gap-2 text-sm text-gray-600"
                              >
                                <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0 mt-0.5" />
                                {f}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-3 mt-5">
                        <button
                          onClick={() => {
                            setForm((f) => ({
                              ...f,
                              category: product.category,
                              product: product.name,
                            }));
                            document
                              .getElementById("quote-form")
                              ?.scrollIntoView({ behavior: "smooth" });
                          }}
                          className="inline-flex items-center gap-2 bg-[#f97316] hover:bg-[#ea580c] text-white font-semibold text-sm px-5 py-2.5 rounded-full transition-colors"
                        >
                          Request Quote for This Product{" "}
                          <ArrowRight className="w-4 h-4" />
                        </button>
                        <Link
                          href={`/shop?category=${encodeURIComponent(
                            product.category
                          )}`}
                          className="inline-flex items-center gap-2 border border-[#1a3a6b] text-[#1a3a6b] font-semibold text-sm px-5 py-2.5 rounded-full hover:bg-[#1a3a6b] hover:text-white transition-colors"
                        >
                          View in Shop
                        </Link>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        {/* ── Quote Form ───────────────────────────────────────────────────── */}
        <section id="quote-form">
          <div className="mb-8">
            <p className="text-xs font-bold text-[#f97316] uppercase tracking-widest mb-1">
              Free Estimate
            </p>
            <h2 className="text-2xl md:text-3xl font-bold text-[#1a3a6b]">
              Request a Quote
            </h2>
            <p className="text-gray-500 mt-1">
              Fill in your details and we'll get back to you within 24 hours
              with a personalised estimate.
            </p>
          </div>

          {submitted ? (
            <div className="bg-white rounded-2xl border border-green-100 shadow-sm p-10 text-center">
              <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="w-8 h-8 text-green-500" />
              </div>
              <h3 className="text-xl font-bold text-[#1a3a6b] mb-2">
                Quote Request Received! 🎉
              </h3>
              <p className="text-gray-500 max-w-md mx-auto">
                Thank you, <strong>{form.name}</strong>! Our team will review
                your request and contact you at <strong>{form.phone}</strong>{" "}
                within 24 hours with a personalised quote.
              </p>
              <button
                onClick={() => {
                  setSubmitted(false);
                  setForm({
                    name: "",
                    phone: "",
                    email: "",
                    category: "",
                    product: "",
                    width: "",
                    height: "",
                    quantity: "1",
                    address: "",
                    notes: "",
                  });
                }}
                className="mt-6 inline-flex items-center gap-2 bg-[#f97316] hover:bg-[#ea580c] text-white font-semibold px-6 py-2.5 rounded-full transition-colors"
              >
                Submit Another Quote
              </button>
            </div>
          ) : (
            <form
              onSubmit={handleSubmit}
              className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 md:p-8"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {/* Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    required
                    placeholder="Your full name"
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#f97316] focus:ring-1 focus:ring-[#f97316]/20 transition-all"
                  />
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Phone Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    required
                    type="tel"
                    placeholder="+91 98765 43210"
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#f97316] focus:ring-1 focus:ring-[#f97316]/20 transition-all"
                  />
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Email Address
                  </label>
                  <input
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    type="email"
                    placeholder="you@example.com"
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#f97316] focus:ring-1 focus:ring-[#f97316]/20 transition-all"
                  />
                </div>

                {/* Category */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Product Category
                  </label>
                  <select
                    name="category"
                    value={form.category}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#f97316] focus:ring-1 focus:ring-[#f97316]/20 transition-all bg-white"
                  >
                    <option value="">Select category…</option>
                    {categories.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Product */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Specific Product
                  </label>
                  <select
                    name="product"
                    value={form.product}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#f97316] focus:ring-1 focus:ring-[#f97316]/20 transition-all bg-white"
                  >
                    <option value="">Select product…</option>
                    {(form.category
                      ? products.filter((p) => p.category === form.category)
                      : products
                    ).map((p) => (
                      <option key={p.id} value={p.name}>
                        {p.name} — ₹{p.price.toLocaleString("en-IN")}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Quantity */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Quantity (units)
                  </label>
                  <input
                    name="quantity"
                    value={form.quantity}
                    onChange={handleChange}
                    type="number"
                    min="1"
                    placeholder="1"
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#f97316] focus:ring-1 focus:ring-[#f97316]/20 transition-all"
                  />
                </div>

                {/* Width */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Window / Door Width
                  </label>
                  <input
                    name="width"
                    value={form.width}
                    onChange={handleChange}
                    placeholder='e.g. 48" or 4 ft'
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#f97316] focus:ring-1 focus:ring-[#f97316]/20 transition-all"
                  />
                </div>

                {/* Height */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Window / Door Height
                  </label>
                  <input
                    name="height"
                    value={form.height}
                    onChange={handleChange}
                    placeholder='e.g. 60" or 5 ft'
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#f97316] focus:ring-1 focus:ring-[#f97316]/20 transition-all"
                  />
                </div>

                {/* Address */}
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Installation Address
                  </label>
                  <input
                    name="address"
                    value={form.address}
                    onChange={handleChange}
                    placeholder="Delhi NCR area / full address"
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#f97316] focus:ring-1 focus:ring-[#f97316]/20 transition-all"
                  />
                </div>

                {/* Notes */}
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Additional Notes
                  </label>
                  <textarea
                    name="notes"
                    value={form.notes}
                    onChange={handleChange}
                    rows={3}
                    placeholder="Any specific requirements, colour preferences, or questions…"
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#f97316] focus:ring-1 focus:ring-[#f97316]/20 transition-all resize-none"
                  />
                </div>
              </div>

              <div className="mt-6 flex flex-col sm:flex-row items-center gap-4">
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#f97316] hover:bg-[#ea580c] disabled:opacity-60 text-white font-bold px-8 py-3 rounded-full transition-colors shadow-md"
                >
                  {submitting ? "Submitting…" : "Get My Free Quote"}
                  {!submitting && <ArrowRight className="w-4 h-4" />}
                </button>
                <p className="text-xs text-gray-400 text-center sm:text-left">
                  We'll respond within 24 hours · No spam · Free consultation
                </p>
              </div>
            </form>
          )}
        </section>
      </div>
    </div>
  );
}

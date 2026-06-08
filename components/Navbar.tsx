"use client";

import Link from "next/link";
import { useState } from "react";
import { useCart } from "@/context/CartContext";
import { ShoppingCart, Menu, X, ShoppingBag, Search } from "lucide-react";

export default function Navbar() {
  const { totalItems } = useCart();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="bg-indigo-600 text-white rounded-xl p-2 group-hover:bg-indigo-700 transition-colors">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <span className="text-xl font-bold text-gray-900">ShopZone</span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            <Link href="/" className="text-gray-600 hover:text-indigo-600 font-medium transition-colors">
              Home
            </Link>
            <Link href="/shop" className="text-gray-600 hover:text-indigo-600 font-medium transition-colors">
              Shop
            </Link>
            <Link href="/shop?category=Electronics" className="text-gray-600 hover:text-indigo-600 font-medium transition-colors">
              Electronics
            </Link>
            <Link href="/shop?category=Fashion" className="text-gray-600 hover:text-indigo-600 font-medium transition-colors">
              Fashion
            </Link>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-3">
            <Link
              href="/shop"
              className="hidden md:flex items-center justify-center w-10 h-10 rounded-full text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 transition-colors"
            >
              <Search className="w-5 h-5" />
            </Link>

            <Link href="/cart" className="relative flex items-center justify-center w-10 h-10 rounded-full text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 transition-colors">
              <ShoppingCart className="w-5 h-5" />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-indigo-600 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {totalItems > 9 ? "9+" : totalItems}
                </span>
              )}
            </Link>

            {/* Mobile menu toggle */}
            <button
              className="md:hidden flex items-center justify-center w-10 h-10 rounded-full text-gray-500 hover:bg-gray-100"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden border-t border-gray-100 bg-white px-4 py-4 space-y-3">
          {["Home", "Shop", "Electronics", "Fashion"].map((item) => (
            <Link
              key={item}
              href={item === "Home" ? "/" : `/shop${item !== "Shop" ? `?category=${item}` : ""}`}
              className="block text-gray-700 hover:text-indigo-600 font-medium py-2"
              onClick={() => setMenuOpen(false)}
            >
              {item}
            </Link>
          ))}
        </div>
      )}
    </nav>
  );
}

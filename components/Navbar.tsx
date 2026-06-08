"use client";

import Link from "next/link";
import { useState } from "react";
import { useCart } from "@/context/CartContext";
import { ShoppingCart, Menu, X, Shield } from "lucide-react";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "Blinds", href: "/shop?category=Blinds" },
  { label: "Pleated Mesh", href: "/shop?category=Pleated+Mesh" },
  { label: "Honeycomb", href: "/shop?category=Honeycomb" },
  { label: "Partitions", href: "/shop?category=Partition+%26+Security" },
  { label: "All Products", href: "/shop" },
];

export default function Navbar() {
  const { totalItems } = useCart();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 bg-white shadow-sm border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="bg-[#1a3a6b] text-white rounded-xl p-2 group-hover:bg-[#152f58] transition-colors">
              <Shield className="w-5 h-5" />
            </div>
            <div className="leading-tight">
              <span className="text-lg font-extrabold text-[#1a3a6b] leading-none">
                NewTech{" "}
              </span>
              <span className="text-lg font-extrabold text-[#f97316] leading-none">
                Shop
              </span>
              <p className="text-[9px] font-semibold text-gray-400 uppercase tracking-widest leading-none">
                Complete Protection
              </p>
            </div>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="text-sm font-medium text-[#1a3a6b] hover:text-[#f97316] transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-3">
            <Link
              href="/cart"
              className="relative flex items-center justify-center w-10 h-10 rounded-full text-[#1a3a6b] hover:bg-orange-50 transition-colors"
            >
              <ShoppingCart className="w-5 h-5" />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#f97316] text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {totalItems > 9 ? "9+" : totalItems}
                </span>
              )}
            </Link>

            <Link
              href="/shop"
              className="hidden sm:inline-flex items-center bg-[#f97316] hover:bg-[#ea580c] text-white font-semibold text-sm px-5 py-2 rounded-full transition-colors shadow-sm"
            >
              Get Quote
            </Link>

            {/* Mobile toggle */}
            <button
              className="lg:hidden flex items-center justify-center w-10 h-10 rounded-full text-[#1a3a6b] hover:bg-gray-100"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="lg:hidden border-t border-gray-100 bg-white px-4 py-4 space-y-1">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="block text-[#1a3a6b] hover:text-[#f97316] font-medium py-2.5 border-b border-gray-50 last:border-0"
              onClick={() => setMenuOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          <div className="pt-2">
            <Link
              href="/shop"
              className="block text-center bg-[#f97316] text-white font-semibold py-2.5 rounded-full"
              onClick={() => setMenuOpen(false)}
            >
              Get Quote
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}

"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { ShoppingCart, Menu, X, User, LogOut } from "lucide-react";

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
  const { user, isLoggedIn, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 bg-white shadow-sm border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="relative h-10 w-40">
              <Image
                src="/logo-navbar.png" // Using the optimized navbar logo
                alt="NewTech Shop Logo"
                fill
                className="object-contain"
                priority
              />
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

            {/* User Menu */}
            {isLoggedIn ? (
              <div className="relative hidden sm:block">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2 px-3 py-2 rounded-full text-[#1a3a6b] hover:bg-gray-100 transition-colors"
                >
                  <User className="w-5 h-5" />
                  <span className="text-sm font-medium hidden md:inline">{user?.firstName}</span>
                </button>
                {userMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-50">
                    <Link
                      href="/profile"
                      className="flex items-center gap-2 px-4 py-2.5 text-gray-700 hover:bg-gray-50 text-sm font-medium"
                      onClick={() => setUserMenuOpen(false)}
                    >
                      <User className="w-4 h-4" />
                      My Profile
                    </Link>
                    <button
                      onClick={() => {
                        logout();
                        setUserMenuOpen(false);
                      }}
                      className="w-full flex items-center gap-2 px-4 py-2.5 text-red-600 hover:bg-red-50 text-sm font-medium"
                    >
                      <LogOut className="w-4 h-4" />
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link
                href="/login"
                className="hidden sm:inline-flex items-center gap-2 text-[#1a3a6b] hover:text-[#f97316] font-semibold text-sm transition-colors"
              >
                <User className="w-4 h-4" />
                Sign In
              </Link>
            )}

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
          <div className="pt-2 space-y-2">
            <Link
              href="/shop"
              className="block text-center bg-[#f97316] text-white font-semibold py-2.5 rounded-full"
              onClick={() => setMenuOpen(false)}
            >
              Get Quote
            </Link>
            {isLoggedIn ? (
              <>
                <Link
                  href="/profile"
                  className="block text-center bg-gray-100 text-[#1a3a6b] font-semibold py-2.5 rounded-full"
                  onClick={() => setMenuOpen(false)}
                >
                  My Profile
                </Link>
                <button
                  onClick={() => {
                    logout();
                    setMenuOpen(false);
                  }}
                  className="w-full text-center bg-red-50 text-red-600 font-semibold py-2.5 rounded-full"
                >
                  Logout
                </button>
              </>
            ) : (
              <Link
                href="/login"
                className="block text-center bg-gray-100 text-[#1a3a6b] font-semibold py-2.5 rounded-full"
                onClick={() => setMenuOpen(false)}
              >
                Sign In
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}

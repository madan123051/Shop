"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { Product } from "@/data/products";

export interface CartItem extends Product {
  quantity: number;
  customization?: {
    width: number;
    height: number;
    unit: string;
    area: number;
    selectedOptions: {
      groupId: string;
      groupTitle: string;
      optionId: string;
      optionLabel: string;
      price: number;
    }[];
    calculatedPrice: number;
  };
}

interface CartContextType {
  cart: CartItem[];
  addToCart: (product: Product, customization?: CartItem["customization"]) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem("cart");
    if (stored) setCart(JSON.parse(stored));
  }, []);

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  const addToCart = (product: Product, customization?: CartItem["customization"]) => {
    setCart((prev) => {
      // For customizable products, we always add as a new item if customization differs
      // but for simplicity, let's just use a unique ID for custom items or allow multiple entries
      if (customization) {
        return [...prev, { ...product, quantity: 1, customization, id: `${product.id}-${Date.now()}` }];
      }

      const existing = prev.find((item) => item.id === product.id && !item.customization);
      if (existing) {
        return prev.map((item) =>
          item.id === product.id && !item.customization
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const removeFromCart = (id: string) =>
    setCart((prev) => prev.filter((item) => item.id !== id));

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) return removeFromCart(id);
    setCart((prev) =>
      prev.map((item) => (item.id === id ? { ...item, quantity } : item))
    );
  };

  const clearCart = () => setCart([]);

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cart.reduce(
    (sum, item) => {
      const price = item.customization ? item.customization.calculatedPrice : item.price;
      return sum + price * item.quantity;
    },
    0
  );

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalItems,
        totalPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside CartProvider");
  return ctx;
}

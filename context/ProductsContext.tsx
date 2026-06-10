"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import {
  collection, doc, getDocs, addDoc, updateDoc, deleteDoc,
  onSnapshot, query, orderBy, serverTimestamp,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { products as defaultProducts, Product } from "@/data/products";

interface ProductsContextType {
  products: Product[];
  categories: string[];
  isLoading: boolean;
  addProduct: (product: Omit<Product, "id">) => Promise<void>;
  updateProduct: (id: string, updates: Partial<Product>) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
}

const ProductsContext = createContext<ProductsContextType | undefined>(undefined);
const COLLECTION = "products";

export function ProductsProvider({ children }: { children: React.ReactNode }) {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Real-time listener from Firestore
    const q = query(collection(db, COLLECTION));
    const unsub = onSnapshot(q, async (snapshot) => {
      const fetched: Product[] = snapshot.docs.map((d) => ({
        ...(d.data() as Omit<Product, "id">),
        id: d.id,
      }));
      setProducts(fetched);
      setIsLoading(false);
    }, (err) => {
      console.error("Firestore products error:", err);
      // Fall back to static data on error
      setProducts(defaultProducts);
      setIsLoading(false);
    });

    return () => unsub();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const categories = Array.from(new Set(products.map((p) => p.category)));

  const addProduct = async (p: Omit<Product, "id">) => {
    await addDoc(collection(db, COLLECTION), { ...p, createdAt: serverTimestamp() });
  };

  const updateProduct = async (id: string, updates: Partial<Product>) => {
    await updateDoc(doc(db, COLLECTION, id), { ...updates, updatedAt: serverTimestamp() });
  };

  const deleteProduct = async (id: string) => {
    await deleteDoc(doc(db, COLLECTION, id));
  };

  return (
    <ProductsContext.Provider
      value={{ products, categories, isLoading, addProduct, updateProduct, deleteProduct }}
    >
      {children}
    </ProductsContext.Provider>
  );
}

export function useProducts() {
  const ctx = useContext(ProductsContext);
  if (!ctx) throw new Error("useProducts must be used inside ProductsProvider");
  return ctx;
}

"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import {
  collection, doc, getDocs, addDoc, updateDoc, deleteDoc,
  onSnapshot, query, orderBy, serverTimestamp,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Product, CATEGORY_HIERARCHY } from "@/data/products";

interface ProductsContextType {
  products: Product[];
  categories: string[];
  isLoading: boolean;
  addProduct: (product: Omit<Product, "id">) => Promise<void>;
  updateProduct: (id: string, updates: Partial<Product>) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
  incrementView: (id: string) => Promise<void>;
  toggleLike: (id: string, currentLikes: number) => Promise<void>;
  addComment: (productId: string, comment: { user: string; text: string; rating: number }) => Promise<void>;
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
      setProducts([]); // No fallback to demo data
      setIsLoading(false);
    });

    return () => unsub();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const categories = Object.keys(CATEGORY_HIERARCHY);

  const addProduct = async (p: Omit<Product, "id">) => {
    await addDoc(collection(db, COLLECTION), { ...p, createdAt: serverTimestamp() });
  };

  const updateProduct = async (id: string, updates: Partial<Product>) => {
    await updateDoc(doc(db, COLLECTION, id), { ...updates, updatedAt: serverTimestamp() });
  };

  const deleteProduct = async (id: string) => {
    const productRef = doc(db, COLLECTION, id);
    await deleteDoc(productRef);
  };

  const incrementView = async (id: string) => {
    const productRef = doc(db, COLLECTION, id);
    await updateDoc(productRef, {
      views: (products.find(p => p.id === id)?.views || 0) + 1
    });
  };

  const toggleLike = async (id: string, currentLikes: number) => {
    const productRef = doc(db, COLLECTION, id);
    await updateDoc(productRef, {
      likes: currentLikes + 1
    });
  };

  const addComment = async (productId: string, comment: { user: string; text: string; rating: number }) => {
    const productRef = doc(db, COLLECTION, productId);
    const product = products.find(p => p.id === productId);
    if (!product) return;

    const newCommentsList = [...(product.commentsList || []), { ...comment, date: new Date().toISOString() }];
    const newRating = ((product.rating * (product.reviews || 0)) + comment.rating) / ((product.reviews || 0) + 1);

    await updateDoc(productRef, {
      commentsList: newCommentsList,
      comments: newCommentsList.length,
      reviews: (product.reviews || 0) + 1,
      rating: Number(newRating.toFixed(1))
    });
  };

  return (
    <ProductsContext.Provider
      value={{ products, categories, isLoading, addProduct, updateProduct, deleteProduct, incrementView, toggleLike, addComment }}
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

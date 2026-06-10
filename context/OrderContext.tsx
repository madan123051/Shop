"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import {
  collection, doc, addDoc, updateDoc, onSnapshot,
  query, orderBy, serverTimestamp, Timestamp,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { CartItem } from "@/context/CartContext";

export interface Order {
  id: string;
  userId: string;
  items: CartItem[];
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
  status: "pending" | "confirmed" | "shipped" | "delivered" | "cancelled";
  shippingAddress: {
    firstName: string;
    lastName: string;
    address: string;
    city: string;
    state: string;
    zip: string;
    country: string;
    phone: string;
  };
  email: string;
  createdAt: string;
  updatedAt: string;
  estimatedDelivery?: string;
  trackingNumber?: string;
}

interface OrderContextType {
  orders: Order[];
  isLoading: boolean;
  createOrder: (order: Omit<Order, "id" | "createdAt" | "updatedAt">) => Promise<Order>;
  getOrderById: (id: string) => Order | undefined;
  getUserOrders: (userId: string) => Order[];
  updateOrderStatus: (id: string, status: Order["status"]) => Promise<void>;
  cancelOrder: (id: string) => Promise<void>;
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);
const COLLECTION = "orders";

function toISO(val: unknown): string {
  if (!val) return new Date().toISOString();
  if (val instanceof Timestamp) return val.toDate().toISOString();
  return String(val);
}

export function OrderProvider({ children }: { children: React.ReactNode }) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, COLLECTION), orderBy("createdAt", "desc"));
    const unsub = onSnapshot(q, (snapshot) => {
      const fetched: Order[] = snapshot.docs.map((d) => {
        const data = d.data();
        return {
          ...(data as Omit<Order, "id" | "createdAt" | "updatedAt">),
          id: d.id,
          createdAt: toISO(data.createdAt),
          updatedAt: toISO(data.updatedAt),
        } as Order;
      });
      setOrders(fetched);
      setIsLoading(false);
    }, (err) => {
      console.error("Firestore orders error:", err);
      setIsLoading(false);
    });
    return () => unsub();
  }, []);

  const createOrder = async (orderData: Omit<Order, "id" | "createdAt" | "updatedAt">): Promise<Order> => {
    const now = new Date().toISOString();
    const payload = {
      ...orderData,
      status: "confirmed" as const,
      trackingNumber: `TRK${Date.now()}`,
      estimatedDelivery: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };
    const ref = await addDoc(collection(db, COLLECTION), payload);
    return { ...orderData, id: ref.id, createdAt: now, updatedAt: now, status: "confirmed" };
  };

  const getOrderById = (id: string) => orders.find((o) => o.id === id);

  const getUserOrders = (userId: string) => orders.filter((o) => o.userId === userId);

  const updateOrderStatus = async (id: string, status: Order["status"]) => {
    await updateDoc(doc(db, COLLECTION, id), { status, updatedAt: serverTimestamp() });
  };

  const cancelOrder = async (id: string) => {
    const order = orders.find((o) => o.id === id);
    if (order && (order.status === "pending" || order.status === "confirmed")) {
      await updateOrderStatus(id, "cancelled");
    } else {
      throw new Error("Cannot cancel this order");
    }
  };

  return (
    <OrderContext.Provider
      value={{ orders, isLoading, createOrder, getOrderById, getUserOrders, updateOrderStatus, cancelOrder }}
    >
      {children}
    </OrderContext.Provider>
  );
}

export function useOrder() {
  const ctx = useContext(OrderContext);
  if (!ctx) throw new Error("useOrder must be used inside OrderProvider");
  return ctx;
}

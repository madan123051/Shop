"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
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

export function OrderProvider({ children }: { children: React.ReactNode }) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load orders from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem("orders");
    if (stored) {
      try {
        setOrders(JSON.parse(stored));
      } catch (e) {
        console.error("Failed to parse orders data", e);
      }
    }
    setIsLoading(false);
  }, []);

  // Save orders to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("orders", JSON.stringify(orders));
  }, [orders]);

  const createOrder = async (orderData: Omit<Order, "id" | "createdAt" | "updatedAt">) => {
    const newOrder: Order = {
      ...orderData,
      id: `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      status: "confirmed",
      estimatedDelivery: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      trackingNumber: `TRK${Date.now()}`,
    };

    setOrders((prev) => [newOrder, ...prev]);
    return newOrder;
  };

  const getOrderById = (id: string): Order | undefined => {
    return orders.find((order) => order.id === id);
  };

  const getUserOrders = (userId: string): Order[] => {
    return orders.filter((order) => order.userId === userId);
  };

  const updateOrderStatus = async (id: string, status: Order["status"]) => {
    setOrders((prev) =>
      prev.map((order) =>
        order.id === id
          ? { ...order, status, updatedAt: new Date().toISOString() }
          : order
      )
    );
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
      value={{
        orders,
        isLoading,
        createOrder,
        getOrderById,
        getUserOrders,
        updateOrderStatus,
        cancelOrder,
      }}
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

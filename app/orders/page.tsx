"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useOrder, Order } from "@/context/OrderContext";
import { Package, ArrowRight, Loader, MapPin, Calendar, DollarSign, Truck, CheckCircle, Clock, X } from "lucide-react";

const statusConfig: Record<Order["status"], { color: string; icon: React.ElementType; label: string }> = {
  pending: { color: "bg-yellow-100 text-yellow-800", icon: Clock, label: "Pending" },
  confirmed: { color: "bg-blue-100 text-blue-800", icon: CheckCircle, label: "Confirmed" },
  shipped: { color: "bg-purple-100 text-purple-800", icon: Truck, label: "Shipped" },
  delivered: { color: "bg-emerald-100 text-emerald-800", icon: CheckCircle, label: "Delivered" },
  cancelled: { color: "bg-red-100 text-red-800", icon: X, label: "Cancelled" },
};

export default function OrdersPage() {
  const router = useRouter();
  const { user, isLoggedIn } = useAuth();
  const { getUserOrders } = useOrder();
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  useEffect(() => {
    if (!isLoggedIn) {
      router.push("/login");
      return;
    }

    if (user) {
      const userOrders = getUserOrders(user.id);
      setOrders(userOrders);
    }
    setIsLoading(false);
  }, [isLoggedIn, user, router, getUserOrders]);

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader className="w-8 h-8 text-[#f97316] animate-spin" />
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader className="w-8 h-8 text-[#f97316] animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-extrabold text-[#1a3a6b]">My Orders</h1>
            <p className="text-gray-600 mt-1">Track and manage your orders</p>
          </div>
          <Link
            href="/profile"
            className="text-[#f97316] hover:text-[#ea580c] font-semibold flex items-center gap-1 text-sm"
          >
            Back to Profile <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {orders.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center">
            <div className="w-20 h-20 bg-orange-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <Package className="w-10 h-10 text-[#f97316]" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">No Orders Yet</h2>
            <p className="text-gray-600 mb-6">Start shopping to place your first order</p>
            <Link
              href="/shop"
              className="inline-flex items-center gap-2 bg-[#f97316] hover:bg-[#ea580c] text-white font-semibold px-6 py-3 rounded-xl transition-colors"
            >
              Shop Now <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Orders List */}
            <div className="lg:col-span-2 space-y-4">
              {orders.map((order) => {
                const StatusIcon = statusConfig[order.status].icon;
                return (
                  <div
                    key={order.id}
                    onClick={() => setSelectedOrder(order)}
                    className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md cursor-pointer transition-all"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-lg font-bold text-gray-900">{order.id}</h3>
                        <p className="text-sm text-gray-500 mt-1">
                          {new Date(order.createdAt).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })}
                        </p>
                      </div>
                      <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-semibold ${statusConfig[order.status].color}`}>
                        <StatusIcon className="w-4 h-4" />
                        {statusConfig[order.status].label}
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4 mb-4 pb-4 border-b border-gray-100">
                      <div>
                        <p className="text-xs text-gray-500 mb-1">Items</p>
                        <p className="text-lg font-bold text-gray-900">{order.items.length}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 mb-1">Total</p>
                        <p className="text-lg font-bold text-[#f97316]">${order.total.toFixed(2)}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 mb-1">Delivery</p>
                        <p className="text-lg font-bold text-gray-900">
                          {order.estimatedDelivery
                            ? new Date(order.estimatedDelivery).toLocaleDateString("en-US", {
                                month: "short",
                                day: "numeric",
                              })
                            : "—"}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <MapPin className="w-4 h-4 text-[#f97316]" />
                        <span>
                          {order.shippingAddress.city}, {order.shippingAddress.state}
                        </span>
                      </div>
                      <button className="text-[#f97316] hover:text-[#ea580c] font-semibold text-sm flex items-center gap-1">
                        View Details <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Order Details */}
            <div className="lg:col-span-1">
              {selectedOrder ? (
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sticky top-24">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">Order Details</h3>

                  {/* Status Timeline */}
                  <div className="mb-6 pb-6 border-b border-gray-100">
                    <div className="space-y-3">
                      {(["confirmed", "shipped", "delivered"] as const).map((status, idx) => {
                        const isCompleted = ["confirmed", "shipped", "delivered"].indexOf(selectedOrder.status) >= idx;
                        return (
                          <div key={status} className="flex items-start gap-3">
                            <div
                              className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-sm font-bold ${
                                isCompleted ? "bg-emerald-100 text-emerald-700" : "bg-gray-100 text-gray-400"
                              }`}
                            >
                              {idx + 1}
                            </div>
                            <div>
                              <p className={`font-semibold ${isCompleted ? "text-gray-900" : "text-gray-500"}`}>
                                {status.charAt(0).toUpperCase() + status.slice(1)}
                              </p>
                              <p className="text-xs text-gray-500 mt-0.5">
                                {isCompleted ? "Completed" : "Pending"}
                              </p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Shipping Address */}
                  <div className="mb-6 pb-6 border-b border-gray-100">
                    <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-[#f97316]" />
                      Shipping Address
                    </h4>
                    <div className="text-sm text-gray-600 space-y-1">
                      <p className="font-medium text-gray-900">
                        {selectedOrder.shippingAddress.firstName} {selectedOrder.shippingAddress.lastName}
                      </p>
                      <p>{selectedOrder.shippingAddress.address}</p>
                      <p>
                        {selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.state}{" "}
                        {selectedOrder.shippingAddress.zip}
                      </p>
                      <p>{selectedOrder.shippingAddress.country}</p>
                      <p className="pt-1">{selectedOrder.shippingAddress.phone}</p>
                    </div>
                  </div>

                  {/* Items */}
                  <div className="mb-6 pb-6 border-b border-gray-100">
                    <h4 className="font-semibold text-gray-900 mb-3">Items ({selectedOrder.items.length})</h4>
                    <div className="space-y-2 max-h-48 overflow-y-auto">
                      {selectedOrder.items.map((item) => (
                        <div key={item.id} className="flex justify-between items-start text-sm">
                          <div>
                            <p className="font-medium text-gray-900">{item.name}</p>
                            <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                          </div>
                          <span className="font-semibold text-gray-900">
                            ${(item.price * item.quantity).toFixed(2)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Pricing */}
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between text-gray-600">
                      <span>Subtotal</span>
                      <span className="font-medium">${selectedOrder.subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-gray-600">
                      <span>Shipping</span>
                      <span className={`font-medium ${selectedOrder.shipping === 0 ? "text-emerald-600" : ""}`}>
                        {selectedOrder.shipping === 0 ? "FREE" : `$${selectedOrder.shipping.toFixed(2)}`}
                      </span>
                    </div>
                    <div className="flex justify-between text-gray-600">
                      <span>Tax</span>
                      <span className="font-medium">${selectedOrder.tax.toFixed(2)}</span>
                    </div>
                    <div className="border-t border-gray-100 pt-2 flex justify-between text-base font-bold">
                      <span>Total</span>
                      <span className="text-[#f97316]">${selectedOrder.total.toFixed(2)}</span>
                    </div>
                  </div>

                  {/* Tracking */}
                  {selectedOrder.trackingNumber && (
                    <div className="mt-6 pt-6 border-t border-gray-100">
                      <p className="text-xs text-gray-500 mb-1">Tracking Number</p>
                      <p className="font-mono text-sm font-semibold text-gray-900 break-all">
                        {selectedOrder.trackingNumber}
                      </p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 text-center sticky top-24">
                  <Package className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500">Select an order to view details</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useOrder, Order } from "@/context/OrderContext";
import {
  Package,
  ArrowRight,
  Loader,
  MapPin,
  Truck,
  CheckCircle,
  Clock,
  X,
  ShoppingBag,
  ChevronLeft,
  Calendar,
  Tag,
  AlertCircle,
  Banknote,
  BadgeCheck,
} from "lucide-react";

const STATUS_CONFIG: Record<
  Order["status"],
  { color: string; bg: string; icon: React.ElementType; label: string }
> = {
  pending: {
    color: "text-yellow-700",
    bg: "bg-yellow-100",
    icon: Clock,
    label: "Pending",
  },
  confirmed: {
    color: "text-blue-700",
    bg: "bg-blue-100",
    icon: BadgeCheck,
    label: "Confirmed",
  },
  shipped: {
    color: "text-purple-700",
    bg: "bg-purple-100",
    icon: Truck,
    label: "Shipped",
  },
  delivered: {
    color: "text-emerald-700",
    bg: "bg-emerald-100",
    icon: CheckCircle,
    label: "Delivered",
  },
  cancelled: {
    color: "text-red-700",
    bg: "bg-red-100",
    icon: X,
    label: "Cancelled",
  },
};

const DELIVERY_STEPS: {
  id: Order["status"] | "placed";
  label: string;
  sub: string;
  icon: React.ElementType;
}[] = [
  {
    id: "placed",
    label: "Order Placed",
    sub: "We've received your order",
    icon: ShoppingBag,
  },
  {
    id: "confirmed",
    label: "Confirmed",
    sub: "Order is being prepared",
    icon: BadgeCheck,
  },
  {
    id: "shipped",
    label: "Shipped",
    sub: "On the way to you",
    icon: Truck,
  },
  {
    id: "delivered",
    label: "Delivered",
    sub: "Enjoy your purchase!",
    icon: CheckCircle,
  },
];

const STATUS_ORDER: (Order["status"] | "placed")[] = [
  "placed",
  "confirmed",
  "shipped",
  "delivered",
];

function getStepIndex(status: Order["status"]): number {
  if (status === "pending") return 0;
  if (status === "confirmed") return 1;
  if (status === "shipped") return 2;
  if (status === "delivered") return 3;
  return -1;
}

function DeliveryTracker({ order }: { order: Order }) {
  if (order.status === "cancelled") {
    return (
      <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-100 rounded-xl">
        <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center shrink-0">
          <X className="w-5 h-5 text-red-600" />
        </div>
        <div>
          <p className="font-semibold text-red-700 text-sm">Order Cancelled</p>
          <p className="text-xs text-red-400 mt-0.5">
            This order has been cancelled.
          </p>
        </div>
      </div>
    );
  }

  const activeStep = getStepIndex(order.status);

  return (
    <div className="space-y-1">
      {DELIVERY_STEPS.map((step, idx) => {
        const Icon = step.icon;
        const isCompleted = idx <= activeStep;
        const isActive = idx === activeStep;
        const isLast = idx === DELIVERY_STEPS.length - 1;

        return (
          <div key={step.id} className="flex gap-3">
            <div className="flex flex-col items-center">
              <div
                className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 transition-all ${
                  isCompleted
                    ? isActive
                      ? "bg-[#f97316] shadow-lg shadow-orange-200"
                      : "bg-emerald-100"
                    : "bg-gray-100"
                }`}
              >
                <Icon
                  className={`w-4 h-4 ${
                    isCompleted
                      ? isActive
                        ? "text-white"
                        : "text-emerald-600"
                      : "text-gray-400"
                  }`}
                />
              </div>
              {!isLast && (
                <div
                  className={`w-0.5 flex-1 min-h-[20px] mt-1 rounded-full transition-colors ${
                    idx < activeStep ? "bg-emerald-300" : "bg-gray-200"
                  }`}
                />
              )}
            </div>

            <div className={`pb-4 ${isLast ? "" : ""}`}>
              <p
                className={`text-sm font-semibold ${
                  isCompleted ? "text-gray-900" : "text-gray-400"
                }`}
              >
                {step.label}
              </p>
              <p
                className={`text-xs mt-0.5 ${
                  isActive
                    ? "text-[#f97316]"
                    : isCompleted
                    ? "text-emerald-600"
                    : "text-gray-400"
                }`}
              >
                {isActive ? "In progress" : isCompleted ? step.sub : "Pending"}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default function OrdersPage() {
  const router = useRouter();
  const { user, isLoggedIn } = useAuth();
  const { getUserOrders, cancelOrder } = useOrder();
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [cancellingId, setCancellingId] = useState<string | null>(null);

  useEffect(() => {
    if (!isLoggedIn) {
      router.push("/login");
      return;
    }
    if (user) {
      const userOrders = getUserOrders(user.id);
      setOrders(userOrders);
      if (userOrders.length > 0 && !selectedOrder) {
        setSelectedOrder(userOrders[0]);
      }
    }
    setIsLoading(false);
  }, [isLoggedIn, user, router, getUserOrders]);

  useEffect(() => {
    if (selectedOrder) {
      const updated = orders.find((o) => o.id === selectedOrder.id);
      if (updated) setSelectedOrder(updated);
    }
  }, [orders]);

  const handleCancel = async (order: Order) => {
    if (!confirm(`Cancel order ${order.id}?`)) return;
    setCancellingId(order.id);
    try {
      await cancelOrder(order.id);
      const updated = getUserOrders(user!.id);
      setOrders(updated);
    } catch {
      alert("Cannot cancel this order.");
    } finally {
      setCancellingId(null);
    }
  };

  if (!isLoggedIn || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader className="w-8 h-8 text-[#f97316] animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-extrabold text-[#1a3a6b]">
              My Orders
            </h1>
            <p className="text-gray-500 mt-1 text-sm">
              {orders.length} order{orders.length !== 1 ? "s" : ""} placed
            </p>
          </div>
          <Link
            href="/profile"
            className="flex items-center gap-1.5 text-[#f97316] hover:text-[#ea580c] font-semibold text-sm"
          >
            <ChevronLeft className="w-4 h-4" />
            Profile
          </Link>
        </div>

        {orders.length === 0 ? (
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-14 text-center">
            <div className="w-20 h-20 bg-orange-50 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Package className="w-10 h-10 text-[#f97316]" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              No Orders Yet
            </h2>
            <p className="text-gray-500 mb-6">
              Start shopping to place your first order
            </p>
            <Link
              href="/shop"
              className="inline-flex items-center gap-2 bg-[#f97316] hover:bg-[#ea580c] text-white font-semibold px-6 py-3 rounded-xl transition-colors"
            >
              Shop Now <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
            <div className="lg:col-span-3 space-y-3">
              {orders.map((order) => {
                const cfg = STATUS_CONFIG[order.status];
                const StatusIcon = cfg.icon;
                const isSelected = selectedOrder?.id === order.id;

                return (
                  <div
                    key={order.id}
                    onClick={() => setSelectedOrder(order)}
                    className={`bg-white rounded-2xl border-2 p-5 cursor-pointer transition-all hover:shadow-md ${
                      isSelected
                        ? "border-[#f97316] shadow-md shadow-orange-100"
                        : "border-gray-100 hover:border-orange-200"
                    }`}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <p className="font-bold text-gray-900 text-sm">
                          {order.id}
                        </p>
                        <p className="text-xs text-gray-400 mt-0.5 flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {new Date(order.createdAt).toLocaleDateString(
                            "en-US",
                            { year: "numeric", month: "long", day: "numeric" }
                          )}
                        </p>
                      </div>
                      <span
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold ${cfg.bg} ${cfg.color}`}
                      >
                        <StatusIcon className="w-3.5 h-3.5" />
                        {cfg.label}
                      </span>
                    </div>

                    <div className="grid grid-cols-3 gap-3 mb-4 pb-4 border-b border-gray-100">
                      <div className="bg-gray-50 rounded-xl p-3 text-center">
                        <p className="text-xs text-gray-400 mb-1">Items</p>
                        <p className="text-base font-extrabold text-gray-900">
                          {order.items.length}
                        </p>
                      </div>
                      <div className="bg-orange-50 rounded-xl p-3 text-center">
                        <p className="text-xs text-gray-400 mb-1">Total</p>
                        <p className="text-base font-extrabold text-[#f97316]">
                          ${order.total.toFixed(2)}
                        </p>
                      </div>
                      <div className="bg-gray-50 rounded-xl p-3 text-center">
                        <p className="text-xs text-gray-400 mb-1">ETA</p>
                        <p className="text-base font-extrabold text-gray-900">
                          {order.estimatedDelivery
                            ? new Date(
                                order.estimatedDelivery
                              ).toLocaleDateString("en-US", {
                                month: "short",
                                day: "numeric",
                              })
                            : "—"}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <p className="flex items-center gap-1.5 text-sm text-gray-500">
                        <MapPin className="w-3.5 h-3.5 text-[#f97316]" />
                        {order.shippingAddress.city},{" "}
                        {order.shippingAddress.state}
                      </p>
                      <div className="flex items-center gap-2">
                        {(order.status === "pending" ||
                          order.status === "confirmed") && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleCancel(order);
                            }}
                            disabled={cancellingId === order.id}
                            className="flex items-center gap-1 text-xs text-red-500 hover:text-red-700 font-semibold px-2.5 py-1.5 rounded-lg hover:bg-red-50 transition-colors"
                          >
                            {cancellingId === order.id ? (
                              <Loader className="w-3 h-3 animate-spin" />
                            ) : (
                              <X className="w-3 h-3" />
                            )}
                            Cancel
                          </button>
                        )}
                        <button className="flex items-center gap-1 text-[#f97316] font-semibold text-xs">
                          Details <ArrowRight className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="lg:col-span-2">
              {selectedOrder ? (
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm sticky top-24 overflow-hidden">
                  <div className="bg-gradient-to-r from-[#1a3a6b] to-[#1e4080] px-6 py-5">
                    <p className="text-xs text-blue-200 font-medium">
                      Order ID
                    </p>
                    <p className="text-white font-bold text-sm mt-0.5 break-all">
                      {selectedOrder.id}
                    </p>
                    {selectedOrder.estimatedDelivery &&
                      selectedOrder.status !== "cancelled" &&
                      selectedOrder.status !== "delivered" && (
                        <div className="mt-3 bg-white/10 border border-white/10 rounded-xl px-4 py-2.5 flex items-center gap-2">
                          <Truck className="w-4 h-4 text-[#f97316] shrink-0" />
                          <div>
                            <p className="text-[10px] text-blue-200">
                              Estimated Delivery
                            </p>
                            <p className="text-sm font-bold text-white">
                              {new Date(
                                selectedOrder.estimatedDelivery
                              ).toLocaleDateString("en-US", {
                                weekday: "long",
                                month: "short",
                                day: "numeric",
                              })}
                            </p>
                          </div>
                        </div>
                      )}
                  </div>

                  <div className="p-6 space-y-6">
                    <div>
                      <h4 className="text-sm font-bold text-gray-900 mb-4">
                        Delivery Status
                      </h4>
                      <DeliveryTracker order={selectedOrder} />
                    </div>

                    {selectedOrder.trackingNumber && (
                      <div className="p-3 bg-gray-50 rounded-xl border border-gray-100">
                        <p className="text-xs text-gray-500 font-medium mb-1">
                          Tracking Number
                        </p>
                        <p className="font-mono text-sm font-semibold text-gray-900 break-all">
                          {selectedOrder.trackingNumber}
                        </p>
                      </div>
                    )}

                    <div className="pb-5 border-b border-gray-100">
                      <h4 className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-[#f97316]" />
                        Shipping Address
                      </h4>
                      <div className="text-sm text-gray-600 space-y-0.5 leading-relaxed">
                        <p className="font-semibold text-gray-900">
                          {selectedOrder.shippingAddress.firstName}{" "}
                          {selectedOrder.shippingAddress.lastName}
                        </p>
                        <p>{selectedOrder.shippingAddress.address}</p>
                        <p>
                          {selectedOrder.shippingAddress.city},{" "}
                          {selectedOrder.shippingAddress.state}{" "}
                          {selectedOrder.shippingAddress.zip}
                        </p>
                        <p>{selectedOrder.shippingAddress.country}</p>
                        <p className="flex items-center gap-1.5 pt-1">
                          <span className="text-[#f97316]">📞</span>
                          {selectedOrder.shippingAddress.phone}
                        </p>
                      </div>
                    </div>

                    <div className="pb-5 border-b border-gray-100">
                      <h4 className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-2">
                        <Tag className="w-4 h-4 text-[#f97316]" />
                        Items ({selectedOrder.items.length})
                      </h4>
                      <div className="space-y-2.5 max-h-44 overflow-y-auto pr-1">
                        {selectedOrder.items.map((item) => (
                          <div
                            key={item.id}
                            className="flex justify-between items-start gap-2"
                          >
                            <div className="min-w-0">
                              <p className="text-sm font-medium text-gray-900 truncate">
                                {item.name}
                              </p>
                              <p className="text-xs text-gray-400 mt-0.5">
                                Qty: {item.quantity} × ${item.price.toFixed(2)}
                              </p>
                            </div>
                            <span className="text-sm font-bold text-gray-900 shrink-0">
                              ${(item.price * item.quantity).toFixed(2)}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between text-gray-500">
                        <span>Subtotal</span>
                        <span className="font-medium text-gray-700">
                          ${selectedOrder.subtotal.toFixed(2)}
                        </span>
                      </div>
                      <div className="flex justify-between text-gray-500">
                        <span>Shipping</span>
                        <span
                          className={`font-medium ${
                            selectedOrder.shipping === 0
                              ? "text-emerald-600"
                              : "text-gray-700"
                          }`}
                        >
                          {selectedOrder.shipping === 0
                            ? "FREE"
                            : `$${selectedOrder.shipping.toFixed(2)}`}
                        </span>
                      </div>
                      <div className="flex justify-between text-gray-500">
                        <span>Tax</span>
                        <span className="font-medium text-gray-700">
                          ${selectedOrder.tax.toFixed(2)}
                        </span>
                      </div>
                      <div className="flex justify-between pt-3 border-t border-gray-100">
                        <span className="font-bold text-gray-900">Total</span>
                        <span className="text-lg font-extrabold text-[#f97316]">
                          ${selectedOrder.total.toFixed(2)}
                        </span>
                      </div>
                    </div>

                    {(selectedOrder.status === "pending" ||
                      selectedOrder.status === "confirmed") && (
                      <button
                        onClick={() => handleCancel(selectedOrder)}
                        disabled={cancellingId === selectedOrder.id}
                        className="w-full flex items-center justify-center gap-2 border-2 border-red-200 hover:border-red-400 hover:bg-red-50 text-red-600 font-semibold py-2.5 rounded-xl transition-colors text-sm"
                      >
                        {cancellingId === selectedOrder.id ? (
                          <Loader className="w-4 h-4 animate-spin" />
                        ) : (
                          <AlertCircle className="w-4 h-4" />
                        )}
                        Cancel This Order
                      </button>
                    )}
                  </div>
                </div>
              ) : (
                <div className="bg-white rounded-2xl border border-gray-100 p-8 text-center sticky top-24">
                  <Package className="w-12 h-12 text-gray-200 mx-auto mb-3" />
                  <p className="text-gray-400 text-sm">
                    Select an order to see details
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

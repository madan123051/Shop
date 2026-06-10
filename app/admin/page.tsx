"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useOrder, Order as ContextOrder } from "@/context/OrderContext";
import { useProducts } from "@/context/ProductsContext";
import {
  LayoutDashboard, ShoppingCart, Package, Users, Settings,
  DollarSign, TrendingUp, Clock, CheckCircle, Truck, XCircle,
  AlertCircle, Search, LogOut, Menu, BarChart2, ArrowUpRight,
  Star, Bell, Edit2, Trash2, Plus, Eye, X,
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

interface Customer {
  id: string;
  name: string;
  email: string;
  orders: number;
  spent: number;
  joined: string;
  location: string;
}

type Tab = "overview" | "orders" | "products" | "customers" | "settings";
type ContextOrderStatus = "pending" | "confirmed" | "shipped" | "delivered" | "cancelled";
type AdminOrderStatus = "Pending" | "Processing" | "Shipped" | "Delivered" | "Cancelled";

// ─── Display Mappings ─────────────────────────────────────────────────────────

const STATUS_DISPLAY: Record<ContextOrderStatus, AdminOrderStatus> = {
  pending: "Pending",
  confirmed: "Processing",
  shipped: "Shipped",
  delivered: "Delivered",
  cancelled: "Cancelled",
};

const DISPLAY_TO_STATUS: Record<AdminOrderStatus, ContextOrderStatus> = {
  Pending: "pending",
  Processing: "confirmed",
  Shipped: "shipped",
  Delivered: "delivered",
  Cancelled: "cancelled",
};

const ALL_STATUSES: AdminOrderStatus[] = ["Pending", "Processing", "Shipped", "Delivered", "Cancelled"];

const STATUS_COLOR: Record<AdminOrderStatus, string> = {
  Pending: "bg-yellow-100 text-yellow-800 border-yellow-200",
  Processing: "bg-blue-100 text-blue-800 border-blue-200",
  Shipped: "bg-purple-100 text-purple-800 border-purple-200",
  Delivered: "bg-green-100 text-green-800 border-green-200",
  Cancelled: "bg-red-100 text-red-800 border-red-200",
};

const STATUS_ICON: Record<AdminOrderStatus, React.ReactNode> = {
  Pending: <Clock className="w-3.5 h-3.5" />,
  Processing: <AlertCircle className="w-3.5 h-3.5" />,
  Shipped: <Truck className="w-3.5 h-3.5" />,
  Delivered: <CheckCircle className="w-3.5 h-3.5" />,
  Cancelled: <XCircle className="w-3.5 h-3.5" />,
};

function fmt(n: number) { return "₹" + n.toLocaleString("en-IN"); }

function StatusBadge({ status }: { status: AdminOrderStatus }) {
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold border ${STATUS_COLOR[status]}`}>
      {STATUS_ICON[status]}{status}
    </span>
  );
}

function StatCard({ label, value, sub, icon, color, trend }: {
  label: string; value: string; sub: string; icon: React.ReactNode; color: string; trend?: number;
}) {
  return (
    <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-3">
        <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${color}`}>{icon}</div>
        {trend !== undefined && (
          <span className={`flex items-center gap-0.5 text-xs font-semibold ${trend >= 0 ? "text-green-600" : "text-red-500"}`}>
            <ArrowUpRight className={`w-3.5 h-3.5 ${trend < 0 ? "rotate-180" : ""}`} />{Math.abs(trend)}%
          </span>
        )}
      </div>
      <p className="text-2xl font-extrabold text-gray-900">{value}</p>
      <p className="text-sm font-semibold text-gray-600 mt-0.5">{label}</p>
      <p className="text-xs text-gray-400 mt-0.5">{sub}</p>
    </div>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────

export default function AdminDashboard() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const { orders, updateOrderStatus } = useOrder();
  const { products, addProduct, updateProduct, deleteProduct, categories } = useProducts();

  const [activeTab, setActiveTab] = useState<Tab>("overview");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [orderSearch, setOrderSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"All" | AdminOrderStatus>("All");
  const [customerSearch, setCustomerSearch] = useState("");
  const [productSearch, setProductSearch] = useState("");
  const [stockFilter, setStockFilter] = useState("All");
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);
  
  // Product Modal State
  const [productModal, setProductModal] = useState<{ open: boolean; mode: "add" | "edit"; product?: any }>({ open: false, mode: "add" });
  const [formData, setFormData] = useState<any>({});

  // Compute derived data from real orders
  const totalRevenue = orders.filter(o => o.status !== "cancelled").reduce((s, o) => s + o.total, 0);
  const pendingCount = orders.filter(o => o.status === "pending" || o.status === "confirmed").length;

  // Derive customers from orders
  const customers = useMemo(() => {
    const map = new Map<string, Customer>();
    orders.forEach(o => {
      const name = `${o.shippingAddress.firstName} ${o.shippingAddress.lastName}`.trim();
      const existing = map.get(o.email);
      if (existing) {
        existing.orders++;
        existing.spent += o.total;
      } else {
        map.set(o.email, {
          id: o.userId,
          name: name || o.email,
          email: o.email,
          orders: 1,
          spent: o.total,
          joined: o.createdAt.split('T')[0],
          location: o.shippingAddress.city || '-',
        });
      }
    });
    return Array.from(map.values());
  }, [orders]);

  // Weekly chart from real order data
  const WEEKLY = useMemo(() => {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const now = new Date();
    return Array.from({ length: 7 }).map((_, i) => {
      const d = new Date(now);
      d.setDate(d.getDate() - (6 - i));
      const dayLabel = days[d.getDay()];
      const dateStr = d.toISOString().split('T')[0];
      const amount = orders
        .filter(o => o.createdAt.startsWith(dateStr) && o.status !== 'cancelled')
        .reduce((s, o) => s + o.total, 0);
      return { day: dayLabel, amount };
    });
  }, [orders]);

  const maxWeekly = Math.max(...WEEKLY.map(d => d.amount), 1);

  const filteredOrders = useMemo(() => orders.filter(o => {
    const q = orderSearch.toLowerCase();
    const displayStatus = STATUS_DISPLAY[o.status];
    const name = `${o.shippingAddress.firstName} ${o.shippingAddress.lastName}`.trim();
    return (o.id.toLowerCase().includes(q) || name.toLowerCase().includes(q)) &&
      (statusFilter === "All" || displayStatus === statusFilter);
  }), [orders, orderSearch, statusFilter]);

  const filteredCustomers = useMemo(() => customers.filter(c => {
    const q = customerSearch.toLowerCase();
    return c.name.toLowerCase().includes(q) || c.email.toLowerCase().includes(q);
  }), [customers, customerSearch]);

  const filteredProducts = useMemo(() => products.filter(p => {
    const q = productSearch.toLowerCase();
    return (p.name.toLowerCase().includes(q) || p.category.toLowerCase().includes(q)) &&
      (stockFilter === "All" || (stockFilter === "In Stock" ? p.inStock : !p.inStock));
  }), [products, productSearch, stockFilter]);

  const handleLogout = async () => { await logout(); router.push("/"); };

  // Product Modal Handlers
  const openAddModal = () => {
    setProductModal({ open: true, mode: "add" });
    setFormData({
      name: "",
      price: 0,
      originalPrice: undefined,
      category: "",
      image: "",
      rating: 4.5,
      reviews: 0,
      description: "",
      features: [],
      badge: undefined,
      inStock: true,
    });
  };

  const openEditModal = (p: any) => {
    setProductModal({ open: true, mode: "edit", product: p });
    setFormData(p);
  };

  const handleSaveProduct = () => {
    if (!formData.name || !formData.category || !formData.price) {
      alert("Please fill in required fields");
      return;
    }
    
    const features = Array.isArray(formData.features) ? formData.features : (formData.features || "").split('\n').filter((f: string) => f.trim());
    const payload = { ...formData, features };

    if (productModal.mode === "add") {
      addProduct(payload);
    } else if (productModal.mode === "edit") {
      updateProduct(formData.id, payload);
    }

    setProductModal({ open: false, mode: "add" });
  };

  const adminInitial = (user?.displayName ?? user?.email ?? "A").charAt(0).toUpperCase();

  const NAV: { id: Tab; label: string; icon: React.ReactNode; badge?: number }[] = [
    { id: "overview", label: "Overview", icon: <LayoutDashboard className="w-5 h-5" /> },
    { id: "orders", label: "Orders", icon: <ShoppingCart className="w-5 h-5" />, badge: pendingCount },
    { id: "products", label: "Products", icon: <Package className="w-5 h-5" />, badge: products.length },
    { id: "customers", label: "Customers", icon: <Users className="w-5 h-5" /> },
    { id: "settings", label: "Settings", icon: <Settings className="w-5 h-5" /> },
  ];

  // ── Sidebar ───────────────────────────────────────────────────────────────
  const SidebarEl = (
    <aside className="w-60 shrink-0 bg-[#1a3a6b] text-white flex flex-col h-screen sticky top-0">
      <div className="px-5 py-5 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-[#f97316] rounded-lg flex items-center justify-center font-extrabold text-white text-base">NT</div>
          <div>
            <p className="font-bold text-sm leading-tight">NewTech Admin</p>
            <p className="text-xs text-white/50 leading-tight">Business Panel</p>
          </div>
        </div>
      </div>
      <nav className="flex-1 py-4 px-3 space-y-0.5 overflow-y-auto">
        {NAV.map(item => (
          <button key={item.id} onClick={() => { setActiveTab(item.id); setSidebarOpen(false); }}
            className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${activeTab === item.id ? "bg-[#f97316] text-white shadow-lg shadow-orange-900/30" : "text-white/70 hover:bg-white/10 hover:text-white"}`}>
            <span className="flex items-center gap-3">{item.icon}{item.label}</span>
            {item.badge !== undefined && (
              <span className={`text-xs px-1.5 py-0.5 rounded-full font-bold ${activeTab === item.id ? "bg-white/25 text-white" : "bg-white/15 text-white/80"}`}>{item.badge}</span>
            )}
          </button>
        ))}
      </nav>
      <div className="px-4 py-4 border-t border-white/10">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-8 h-8 bg-[#f97316] rounded-full flex items-center justify-center text-sm font-bold">{adminInitial}</div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold truncate">{user?.displayName ?? "Admin"}</p>
            <p className="text-xs text-white/50 truncate">{user?.email}</p>
          </div>
        </div>
        <button onClick={handleLogout} className="w-full flex items-center gap-2 text-sm text-white/60 hover:text-red-400 transition-colors px-2 py-1.5 rounded-lg hover:bg-white/5">
          <LogOut className="w-4 h-4" />Logout
        </button>
      </div>
    </aside>
  );

  // ── Overview ──────────────────────────────────────────────────────────────
  const Overview = (
    <div className="space-y-6">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total Revenue" value={fmt(totalRevenue)} sub="Delivered orders" icon={<DollarSign className="w-5 h-5 text-green-600" />} color="bg-green-50" trend={12} />
        <StatCard label="Total Orders" value={String(orders.length)} sub={`${pendingCount} need action`} icon={<ShoppingCart className="w-5 h-5 text-blue-600" />} color="bg-blue-50" trend={8} />
        <StatCard label="Products" value={String(products.length)} sub={`${products.filter(p => p.inStock).length} in stock`} icon={<Package className="w-5 h-5 text-purple-600" />} color="bg-purple-50" />
        <StatCard label="Customers" value={String(customers.length)} sub={`${fmt(customers.reduce((s, c) => s + c.spent, 0))} lifetime`} icon={<Users className="w-5 h-5 text-orange-600" />} color="bg-orange-50" trend={5} />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Weekly chart */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div><h3 className="font-bold text-gray-800">Weekly Sales</h3><p className="text-xs text-gray-400">This week</p></div>
            <BarChart2 className="w-5 h-5 text-gray-300" />
          </div>
          <div className="flex items-end gap-2 h-36">
            {WEEKLY.map(d => (
              <div key={d.day} className="flex-1 flex flex-col items-center gap-1">
                <span className="text-xs text-gray-400 font-medium leading-none">{(d.amount / 1000).toFixed(1)}k</span>
                <div className="w-full bg-[#1a3a6b] rounded-t-md hover:bg-[#f97316] transition-colors" style={{ height: `${(d.amount / maxWeekly) * 100}px` }} />
                <span className="text-xs text-gray-500">{d.day}</span>
              </div>
            ))}
          </div>
          <div className="mt-3 pt-3 border-t border-gray-100 flex items-center justify-between text-sm">
            <span className="text-gray-500">Week Total</span>
            <span className="font-bold text-[#1a3a6b]">{fmt(WEEKLY.reduce((s, d) => s + d.amount, 0))}</span>
          </div>
        </div>
        {/* Status breakdown */}
        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
          <h3 className="font-bold text-gray-800 mb-1">Order Status</h3>
          <p className="text-xs text-gray-400 mb-4">Current breakdown</p>
          <div className="space-y-3">
            {ALL_STATUSES.map(s => {
              const ctx = DISPLAY_TO_STATUS[s];
              const count = orders.filter(o => o.status === ctx).length;
              const pct = Math.round((count / orders.length) * 100) || 0;
              return (
                <div key={s}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="font-medium text-gray-700">{s}</span>
                    <span className="text-gray-400 font-semibold">{count}</span>
                  </div>
                  <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div className={`h-full rounded-full ${s === "Delivered" ? "bg-green-500" : s === "Shipped" ? "bg-purple-500" : s === "Processing" ? "bg-blue-500" : s === "Pending" ? "bg-yellow-500" : "bg-red-400"}`} style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
      {/* Recent orders */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <h3 className="font-bold text-gray-800">Recent Orders</h3>
          <button onClick={() => setActiveTab("orders")} className="text-[#f97316] text-sm font-semibold hover:underline">View all →</button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead><tr className="bg-gray-50 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">
              <th className="px-5 py-3">Order</th><th className="px-5 py-3">Customer</th><th className="px-5 py-3">Amount</th><th className="px-5 py-3">Status</th><th className="px-5 py-3">Date</th>
            </tr></thead>
            <tbody className="divide-y divide-gray-50">
              {orders.slice(0, 5).map(o => (
                <tr key={o.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-5 py-3 font-mono font-semibold text-[#1a3a6b]">{o.id}</td>
                  <td className="px-5 py-3"><p className="font-medium text-gray-800">{o.shippingAddress.firstName} {o.shippingAddress.lastName}</p><p className="text-gray-400 text-xs">{o.email}</p></td>
                  <td className="px-5 py-3 font-bold text-gray-900">{fmt(o.total)}</td>
                  <td className="px-5 py-3"><StatusBadge status={STATUS_DISPLAY[o.status]} /></td>
                  <td className="px-5 py-3 text-gray-500">{o.createdAt.split('T')[0]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {/* Top products */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <h3 className="font-bold text-gray-800">Top Products</h3>
          <button onClick={() => setActiveTab("products")} className="text-[#f97316] text-sm font-semibold hover:underline">View all →</button>
        </div>
        <div className="divide-y divide-gray-50">
          {products.slice(0, 5).map(p => (
            <div key={p.id} className="flex items-center gap-4 px-5 py-3 hover:bg-gray-50/50 transition-colors">
              <div className="w-10 h-10 bg-[#1a3a6b]/5 rounded-xl flex items-center justify-center shrink-0">
                <Package className="w-5 h-5 text-[#1a3a6b]/30" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-gray-800 text-sm truncate">{p.name}</p>
                <p className="text-xs text-gray-400">{p.category}</p>
              </div>
              <div className="text-right">
                <p className="font-bold text-gray-900 text-sm">{fmt(p.price)}</p>
                <div className="flex items-center gap-0.5 justify-end">
                  <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                  <span className="text-xs text-gray-500">{p.rating}</span>
                </div>
              </div>
              {p.badge && <span className="px-2 py-0.5 bg-[#f97316] text-white text-xs font-bold rounded-full">{p.badge}</span>}
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  // ── Orders ────────────────────────────────────────────────────────────────
  const Orders = (
    <div className="space-y-4">
      <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm flex flex-wrap gap-3 items-center">
        <div className="relative flex-1 min-w-48">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
          <input type="text" placeholder="Search orders…" value={orderSearch} onChange={e => setOrderSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:border-[#f97316] focus:ring-2 focus:ring-[#f97316]/20" />
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          {(["All"] as const).concat(ALL_STATUSES).map(s => (
            <button key={s} onClick={() => setStatusFilter(s)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${statusFilter === s ? "bg-[#1a3a6b] text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}>
              {s}
            </button>
          ))}
        </div>
      </div>
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead><tr className="bg-gray-50 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">
              <th className="px-5 py-3">Order ID</th><th className="px-5 py-3">Customer</th><th className="px-5 py-3">Items</th>
              <th className="px-5 py-3">Total</th><th className="px-5 py-3">Status</th><th className="px-5 py-3">Date</th><th className="px-5 py-3">Update</th>
            </tr></thead>
            <tbody className="divide-y divide-gray-50">
              {filteredOrders.map(o => (
                <>
                  <tr key={o.id} className="hover:bg-gray-50/50 transition-colors cursor-pointer" onClick={() => setExpandedOrder(expandedOrder === o.id ? null : o.id)}>
                    <td className="px-5 py-3 font-mono font-semibold text-[#1a3a6b]">{o.id}</td>
                    <td className="px-5 py-3"><p className="font-medium text-gray-800">{o.shippingAddress.firstName} {o.shippingAddress.lastName}</p><p className="text-gray-400 text-xs">{o.shippingAddress.address}</p></td>
                    <td className="px-5 py-3 text-gray-500">{o.items.length} item{o.items.length > 1 ? "s" : ""}</td>
                    <td className="px-5 py-3 font-bold text-gray-900">{fmt(o.total)}</td>
                    <td className="px-5 py-3"><StatusBadge status={STATUS_DISPLAY[o.status]} /></td>
                    <td className="px-5 py-3 text-gray-500">{o.createdAt.split('T')[0]}</td>
                    <td className="px-5 py-3">
                      <select value={STATUS_DISPLAY[o.status]} onClick={e => e.stopPropagation()} onChange={e => updateOrderStatus(o.id, DISPLAY_TO_STATUS[e.target.value as AdminOrderStatus])}
                        className="text-xs border border-gray-200 rounded-lg px-2 py-1.5 focus:outline-none focus:border-[#f97316] bg-white text-gray-700">
                        {ALL_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </td>
                  </tr>
                  {expandedOrder === o.id && (
                    <tr key={`${o.id}-exp`} className="bg-orange-50/30">
                      <td colSpan={7} className="px-5 py-3">
                        <p className="text-xs font-semibold text-gray-600 mb-2">Order Items:</p>
                        {o.items.map((item, i) => (
                          <div key={i} className="flex justify-between text-xs py-1 border-b border-orange-100 last:border-0">
                            <span className="text-gray-700">{item.name} × {item.quantity}</span>
                            <span className="font-semibold">{fmt(item.price * item.quantity)}</span>
                          </div>
                        ))}
                        <div className="flex justify-between pt-1 font-bold text-sm text-[#1a3a6b]">
                          <span>Total</span><span>{fmt(o.total)}</span>
                        </div>
                      </td>
                    </tr>
                  )}
                </>
              ))}
              {filteredOrders.length === 0 && (
                <tr><td colSpan={7} className="px-5 py-10 text-center text-gray-400">No orders found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="px-5 py-3 border-t border-gray-100 text-xs text-gray-400">Showing {filteredOrders.length} of {orders.length} orders</div>
      </div>
    </div>
  );

  // ── Products ──────────────────────────────────────────────────────────────
  const Products = (
    <div className="space-y-4">
      <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm flex flex-wrap gap-3 items-center justify-between">
        <div className="flex items-center gap-3 flex-1">
          <div className="relative flex-1 min-w-48">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
            <input type="text" placeholder="Search products…" value={productSearch} onChange={e => setProductSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:border-[#f97316] focus:ring-2 focus:ring-[#f97316]/20" />
          </div>
          {[("All" as const), "In Stock", "Out of Stock"].map(f => (
            <button key={f} onClick={() => setStockFilter(f)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all whitespace-nowrap ${stockFilter === f ? "bg-[#1a3a6b] text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}>
              {f}
            </button>
          ))}
        </div>
        <button onClick={openAddModal} className="flex items-center gap-2 px-4 py-2 bg-[#f97316] hover:bg-[#ea580c] text-white text-sm font-semibold rounded-xl transition-colors shadow-lg shadow-orange-200">
          <Plus className="w-4 h-4" />Add Product
        </button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filteredProducts.map(p => (
          <div key={p.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition-shadow group">
            <div className="relative h-36 bg-gradient-to-br from-[#1a3a6b]/5 to-[#1a3a6b]/10 flex items-center justify-center">
              <Package className="w-12 h-12 text-[#1a3a6b]/20" />
              {p.badge && <span className="absolute top-2 left-2 bg-[#f97316] text-white text-xs font-bold px-2 py-0.5 rounded-full">{p.badge}</span>}
              <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={() => openEditModal(p)} className="w-7 h-7 bg-white rounded-lg shadow flex items-center justify-center hover:bg-[#1a3a6b] hover:text-white transition-colors"><Edit2 className="w-3.5 h-3.5" /></button>
                <button onClick={() => deleteProduct(p.id)} className="w-7 h-7 bg-white rounded-lg shadow flex items-center justify-center hover:bg-red-500 hover:text-white transition-colors"><Trash2 className="w-3.5 h-3.5" /></button>
              </div>
            </div>
            <div className="p-4">
              <p className="font-bold text-gray-800 text-sm leading-tight mb-0.5">{p.name}</p>
              <p className="text-xs text-gray-400 mb-2">{p.category}</p>
              <div className="flex items-center gap-1 mb-3">
                <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
                <span className="text-xs font-semibold text-gray-600">{p.rating}</span>
                <span className="text-xs text-gray-400">({p.reviews})</span>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <span className="font-bold text-[#1a3a6b]">{fmt(p.price)}</span>
                  {p.originalPrice && <span className="text-xs text-gray-400 line-through ml-1">{fmt(p.originalPrice)}</span>}
                </div>
                <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${p.inStock ? "bg-green-100 text-green-700" : "bg-red-100 text-red-600"}`}>
                  {p.inStock ? "In Stock" : "Out"}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
      <p className="text-xs text-gray-400 text-center">Showing {filteredProducts.length} of {products.length} products</p>

      {/* Product Modal */}
      {productModal.open && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900">{productModal.mode === "add" ? "Add Product" : "Edit Product"}</h2>
              <button onClick={() => setProductModal({ open: false, mode: "add" })} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Name *</label>
                  <input type="text" value={formData.name || ""} onChange={e => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-[#f97316]" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Category *</label>
                  <input type="text" value={formData.category || ""} onChange={e => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-[#f97316]" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Price (₹) *</label>
                  <input type="number" value={formData.price || 0} onChange={e => setFormData({ ...formData, price: parseFloat(e.target.value) })}
                    className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-[#f97316]" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Original Price (₹)</label>
                  <input type="number" value={formData.originalPrice || ""} onChange={e => setFormData({ ...formData, originalPrice: e.target.value ? parseFloat(e.target.value) : undefined })}
                    className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-[#f97316]" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Rating</label>
                  <input type="number" step="0.1" value={formData.rating || 4.5} onChange={e => setFormData({ ...formData, rating: parseFloat(e.target.value) })}
                    className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-[#f97316]" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Reviews</label>
                  <input type="number" value={formData.reviews || 0} onChange={e => setFormData({ ...formData, reviews: parseInt(e.target.value) })}
                    className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-[#f97316]" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Image URL</label>
                <input type="text" value={formData.image || ""} onChange={e => setFormData({ ...formData, image: e.target.value })}
                  className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-[#f97316]" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Description</label>
                <textarea value={formData.description || ""} onChange={e => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-[#f97316]" rows={3} />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Features (one per line)</label>
                <textarea value={(Array.isArray(formData.features) ? formData.features : formData.features || "").split('\n').join('\n') || ""} onChange={e => setFormData({ ...formData, features: e.target.value.split('\n').filter(f => f.trim()) })}
                  className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-[#f97316]" rows={3} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Badge</label>
                  <select value={formData.badge || ""} onChange={e => setFormData({ ...formData, badge: e.target.value || undefined })}
                    className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-[#f97316]">
                    <option value="">None</option>
                    <option value="Sale">Sale</option>
                    <option value="New">New</option>
                    <option value="Hot">Hot</option>
                    <option value="Best Seller">Best Seller</option>
                  </select>
                </div>
                <div className="flex items-end">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={formData.inStock ?? true} onChange={e => setFormData({ ...formData, inStock: e.target.checked })}
                      className="w-4 h-4 border border-gray-300 rounded focus:outline-none accent-[#f97316]" />
                    <span className="text-sm font-semibold text-gray-700">In Stock</span>
                  </label>
                </div>
              </div>
            </div>
            <div className="border-t border-gray-100 px-6 py-4 flex gap-3 justify-end">
              <button onClick={() => setProductModal({ open: false, mode: "add" })} className="px-4 py-2 text-sm font-semibold text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">Cancel</button>
              <button onClick={handleSaveProduct} className="px-4 py-2 text-sm font-semibold text-white bg-[#f97316] hover:bg-[#ea580c] rounded-lg transition-colors">Save Product</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  // ── Customers ─────────────────────────────────────────────────────────────
  const Customers = (
    <div className="space-y-4">
      <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm">
        <div className="relative max-w-xs">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
          <input type="text" placeholder="Search customers…" value={customerSearch} onChange={e => setCustomerSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:border-[#f97316] focus:ring-2 focus:ring-[#f97316]/20" />
        </div>
      </div>
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead><tr className="bg-gray-50 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">
              <th className="px-5 py-3">Customer</th><th className="px-5 py-3">Location</th><th className="px-5 py-3">Orders</th>
              <th className="px-5 py-3">Total Spent</th><th className="px-5 py-3">Joined</th>
            </tr></thead>
            <tbody className="divide-y divide-gray-50">
              {filteredCustomers.map(c => (
                <tr key={c.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-[#1a3a6b] rounded-full flex items-center justify-center text-white text-xs font-bold">{c.name.charAt(0)}</div>
                      <div><p className="font-semibold text-gray-800">{c.name}</p><p className="text-xs text-gray-400">{c.email}</p></div>
                    </div>
                  </td>
                  <td className="px-5 py-3 text-gray-600">{c.location}</td>
                  <td className="px-5 py-3"><span className="inline-flex items-center justify-center w-7 h-7 bg-blue-50 text-blue-700 rounded-full font-bold text-xs">{c.orders}</span></td>
                  <td className="px-5 py-3 font-bold text-gray-900">{fmt(c.spent)}</td>
                  <td className="px-5 py-3 text-gray-500">{c.joined}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="px-5 py-3 border-t border-gray-100 text-xs text-gray-400">{filteredCustomers.length} customers found</div>
      </div>
    </div>
  );

  // ── Settings ──────────────────────────────────────────────────────────────
  const SettingsEl = (
    <div className="max-w-2xl space-y-6">
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2"><Settings className="w-5 h-5 text-[#1a3a6b]" />Store Information</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[{ label: "Store Name", value: "NewTech Home Solutions" }, { label: "Phone", value: "+91 98765 43210" }, { label: "Email", value: "info@newtechhome.in" }, { label: "City", value: "Delhi NCR" }, { label: "GST Number", value: "07AAACN1234A1Z1" }, { label: "Pincode", value: "110001" }].map(f => (
            <div key={f.label}>
              <label className="block text-xs font-semibold text-gray-600 mb-1">{f.label}</label>
              <input type="text" defaultValue={f.value} className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:border-[#f97316] focus:ring-2 focus:ring-[#f97316]/20" />
            </div>
          ))}
        </div>
        <button className="mt-4 px-5 py-2.5 bg-[#1a3a6b] hover:bg-[#15306b] text-white text-sm font-bold rounded-xl transition-colors">Save Changes</button>
      </div>
    </div>
  );

  // ── Render ────────────────────────────────────────────────────────────────
  const TITLES: Record<Tab, string> = {
    overview: "Dashboard Overview", orders: "Orders Management",
    products: "Products Catalogue", customers: "Customer Directory", settings: "Store Settings",
  };
  const CONTENT: Record<Tab, React.ReactNode> = {
    overview: Overview, orders: Orders, products: Products, customers: Customers, settings: SettingsEl,
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Desktop sidebar */}
      <div className="hidden lg:block">{SidebarEl}</div>
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div className="w-60">{SidebarEl}</div>
          <div className="flex-1 bg-black/50" onClick={() => setSidebarOpen(false)} />
        </div>
      )}
      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="sticky top-0 z-30 bg-white border-b border-gray-100 px-5 py-3.5 flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-3">
            <button className="lg:hidden p-1.5 rounded-lg hover:bg-gray-100 transition-colors" onClick={() => setSidebarOpen(true)}>
              <Menu className="w-5 h-5 text-gray-600" />
            </button>
            <div>
              <h1 className="font-extrabold text-gray-900 text-base">{TITLES[activeTab]}</h1>
              <p className="text-xs text-gray-400 hidden sm:block">NewTech Home Solutions · Admin Panel</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button className="relative p-2 rounded-xl hover:bg-gray-100 transition-colors">
              <Bell className="w-5 h-5 text-gray-500" />
              {pendingCount > 0 && <span className="absolute top-1 right-1 w-2 h-2 bg-[#f97316] rounded-full" />}
            </button>
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-[#1a3a6b]/5 rounded-xl">
              <div className="w-6 h-6 bg-[#f97316] rounded-full flex items-center justify-center text-white text-xs font-bold">{adminInitial}</div>
              <span className="text-sm font-semibold text-[#1a3a6b]">{user?.displayName ?? "Admin"}</span>
            </div>
          </div>
        </header>
        <main className="flex-1 p-5 lg:p-6 overflow-y-auto">{CONTENT[activeTab]}</main>
      </div>
    </div>
  );
}

"use client";

import { useState, useMemo, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useOrder, Order as ContextOrder } from "@/context/OrderContext";
import { useProducts } from "@/context/ProductsContext";
import {
  LayoutDashboard, ShoppingCart, Package, Users, Settings,
  DollarSign, TrendingUp, Clock, CheckCircle, Truck, XCircle,
  AlertCircle, Search, LogOut, Menu, BarChart2, ArrowUpRight,
  Star, Bell, Edit2, Trash2, Plus, Eye, X, Upload,
  FileText, MessageSquare, Reply, Send, RefreshCw, ExternalLink, ShieldAlert,
} from "lucide-react";
import { ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";
import { storage } from "@/lib/firebase";

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

interface QuoteRequest {
  id: string;
  name: string;
  phone: string;
  email: string;
  category: string;
  product: string;
  width: string;
  height: string;
  quantity: string;
  address: string;
  notes: string;
  status: "pending" | "replied" | "closed";
  reply: string;
  createdAt: string;
}

type Tab = "overview" | "orders" | "products" | "customers" | "quotes" | "chatbot" | "settings" | "diagnostics";
type ContextOrderStatus = "pending" | "confirmed" | "shipped" | "delivered" | "cancelled";
type AdminOrderStatus = "Pending" | "Processing" | "Shipped" | "Delivered" | "Cancelled";

// ─── Display Mappings ─────────────────────────────────────────────────────────

const CATEGORY_MAP: Record<string, string[]> = {
  "Blinds": ["Roller Blinds", "Zebra Blinds", "Wooden Blinds", "Printed Blinds"],
  "Pleated Mesh": ["Pleated Mesh", "SS 304 Pleated Mesh"],
  "Honeycomb": ["Honeycomb"],
  "Partitions & Doors": ["Partition & Security", "Security Mesh"],
};
const MAIN_CATEGORIES = Object.keys(CATEGORY_MAP);

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
  const [imageUploading, setImageUploading] = useState(false);

  // Quote Requests State
  const [quotes, setQuotes] = useState<QuoteRequest[]>([]);
  const [quotesLoading, setQuotesLoading] = useState(false);
  const [quoteSearch, setQuoteSearch] = useState("");
  const [replyModal, setReplyModal] = useState<{ open: boolean; quote: QuoteRequest | null }>({ open: false, quote: null });
  const [replyText, setReplyText] = useState("");
  const [replying, setReplying] = useState(false);

  const fetchQuotes = useCallback(async () => {
    setQuotesLoading(true);
    try {
      const res = await fetch("/api/quotes");
      const data = await res.json();
      setQuotes(data.quotes || []);
    } catch {
      setQuotes([]);
    } finally {
      setQuotesLoading(false);
    }
  }, []);

  useEffect(() => {
    if (activeTab === "quotes") fetchQuotes();
  }, [activeTab, fetchQuotes]);

  const deleteQuote = async (id: string) => {
    if (!confirm("Delete this quote request?")) return;
    await fetch(`/api/quotes/${id}`, { method: "DELETE" });
    setQuotes(prev => prev.filter(q => q.id !== id));
  };



  const sendReply = async () => {
    if (!replyModal.quote || !replyText.trim()) return;
    setReplying(true);
    try {
      await fetch(`/api/quotes/${replyModal.quote.id}/reply`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reply: replyText }),
      });
      setQuotes(prev => prev.map(q =>
        q.id === replyModal.quote!.id ? { ...q, reply: replyText, status: "replied" } : q
      ));
      setReplyModal({ open: false, quote: null });
      setReplyText("");
    } finally {
      setReplying(false);
    }
  };

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
      festivalOffer: "",
      discountPercent: undefined,
      offerLabel: "",
      offerValidTill: "",
      subCategory: "",
      images: [],
      video: "",
      likes: 0,
      shares: 0,
      comments: 0,
    });
  };

  const openEditModal = (p: any) => {
    setProductModal({ open: true, mode: "edit", product: p });
    setFormData(p);
  };

  const handleSaveProduct = async () => {
    // Strict Validation
    if (!formData.name || !formData.category || !formData.subCategory || !formData.price || !formData.image) {
      alert("Required fields missing: Name, Main Category, Sub Category, Price, and Main Image.");
      return;
    }
    
    const features = Array.isArray(formData.features) ? formData.features : (formData.features || "").split('\n').filter((f: string) => f.trim());
    const payload = { 
      ...formData, 
      features,
      updatedAt: new Date().toISOString()
    };

    try {
      if (productModal.mode === "add") {
        await addProduct(payload);
      } else if (productModal.mode === "edit") {
        await updateProduct(formData.id, payload);
      }
      setProductModal({ open: false, mode: "add" });
    } catch (err) {
      console.error("Save product error:", err);
      alert("Failed to save product. Check console for details.");
    }
  };

  const handleDeleteProduct = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this product? All images and videos will also be deleted from storage.")) return;
    
    const product = products.find(p => p.id === id);
    if (!product) return;

    try {
      // 1. Delete Media from Storage
      const mediaUrls = [product.image, ...(product.images || []), product.video].filter(Boolean) as string[];
      for (const url of mediaUrls) {
        if (url && url.includes('firebasestorage.googleapis.com')) {
          try {
            const fileRef = ref(storage, url);
            await deleteObject(fileRef);
          } catch (e) {
            console.warn("Failed to delete media from storage:", url, e);
          }
        }
      }

      // 2. Delete Document from Firestore
      await deleteProduct(id);
    } catch (err) {
      console.error("Delete product error:", err);
      alert("Failed to delete product.");
    }
  };

  const handleDuplicateProduct = (p: any) => {
    const duplicated = { 
      ...p, 
      id: undefined, 
      name: `${p.name} (Copy)`,
      createdAt: undefined,
      updatedAt: undefined
    };
    setProductModal({ open: true, mode: "add" });
    setFormData(duplicated);
  };

  const handleImageUpload = async (file: File, isMain: boolean = true) => {
    if (!file) return;

    // Validation
    if (!file.type.startsWith('image/')) {
      alert("Invalid file type. Please upload an image.");
      return;
    }
    if (file.size > 5 * 1024 * 1024) { // 5MB limit
      alert("File too large. Maximum size is 5MB.");
      return;
    }

    setImageUploading(true);
    try {
      const storageRef = ref(storage, `products/${Date.now()}_${file.name}`);
      const snapshot = await uploadBytes(storageRef, file);
      const url = await getDownloadURL(snapshot.ref);
      
      if (isMain) {
        setFormData((prev: any) => ({ ...prev, image: url }));
      } else {
        setFormData((prev: any) => ({
          ...prev,
          images: [...(prev.images || []), url].slice(0, 10)
        }));
      }
    } catch (err: any) {
      console.error("Image upload error:", err);
      let msg = "Upload failed. Please try again.";
      if (err.code === 'storage/unauthorized') msg = "Permission denied. Please check storage rules.";
      if (err.code === 'storage/quota-exceeded') msg = "Storage quota exceeded.";
      if (err.code === 'storage/retry-limit-exceeded') msg = "Network failure. Please check your connection.";
      alert(msg);
    } finally {
      setImageUploading(false);
    }
  };

  const handleVideoUpload = async (file: File) => {
    if (!file) return;

    // Validation
    if (!file.type.startsWith('video/')) {
      alert("Invalid file type. Please upload a video.");
      return;
    }
    if (file.size > 50 * 1024 * 1024) { // 50MB limit
      alert("Video too large. Maximum size is 50MB.");
      return;
    }

    setImageUploading(true);
    try {
      const storageRef = ref(storage, `videos/${Date.now()}_${file.name}`);
      const snapshot = await uploadBytes(storageRef, file);
      const url = await getDownloadURL(snapshot.ref);
      setFormData((prev: any) => ({ ...prev, video: url }));
    } catch (err: any) {
      console.error("Video upload error:", err);
      let msg = "Video upload failed. Please try again.";
      if (err.code === 'storage/unauthorized') msg = "Permission denied. Please check storage rules.";
      if (err.code === 'storage/quota-exceeded') msg = "Storage quota exceeded.";
      alert(msg);
    } finally {
      setImageUploading(false);
    }
  };

  const adminInitial = (user?.displayName ?? user?.email ?? "A").charAt(0).toUpperCase();

  const NAV: { id: Tab; label: string; icon: React.ReactNode; badge?: number }[] = [
    { id: "overview", label: "Overview", icon: <LayoutDashboard className="w-5 h-5" /> },
    { id: "orders", label: "Orders", icon: <ShoppingCart className="w-5 h-5" />, badge: pendingCount },
    { id: "products", label: "Products", icon: <Package className="w-5 h-5" />, badge: products.length },
    { id: "customers", label: "Customers", icon: <Users className="w-5 h-5" /> },
    { id: "quotes", label: "Quote Requests", icon: <FileText className="w-5 h-5" />, badge: quotes.filter(q => q.status === "pending").length || undefined },
    { id: "chatbot", label: "Chatbot", icon: <MessageSquare className="w-5 h-5" /> },
    { id: "settings", label: "Settings", icon: <Settings className="w-5 h-5" /> },
  ];

  // ── Sidebar ───────────────────────────────────────────────────────────────
  const SidebarEl = (
    <aside className="w-60 shrink-0 bg-[#1a3a6b] text-white flex flex-col h-screen sticky top-0">
      <div className="px-5 py-5 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-[#f97316] rounded-lg flex items-center justify-center font-extrabold text-white text-base">
            <ShoppingCart className="w-5 h-5" />
          </div>
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
          <div className="w-8 h-8 bg-[#f97316] rounded-full flex items-center justify-center text-sm font-bold overflow-hidden">
            {user?.photoURL ? (
              <img src={user.photoURL} alt="Admin" className="w-full h-full object-cover" />
            ) : adminInitial}
          </div>
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
          {(["All" as const, ...ALL_STATUSES] as const).map(s => (
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
            <div className="relative h-40 bg-gray-50 flex items-center justify-center overflow-hidden">
              {p.image ? (
                <img src={p.image} alt={p.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
              ) : (
                <Package className="w-12 h-12 text-[#1a3a6b]/20" />
              )}
              {p.badge && <span className="absolute top-2 left-2 bg-[#f97316] text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide">{p.badge}</span>}
              <div className="absolute top-2 right-2 flex flex-col gap-1.5 opacity-0 group-hover:opacity-100 transition-all translate-x-2 group-hover:translate-x-0">
                <button onClick={() => handleDuplicateProduct(p)} title="Duplicate" className="w-8 h-8 bg-white rounded-lg shadow-lg flex items-center justify-center text-purple-600 hover:bg-purple-600 hover:text-white transition-colors"><RefreshCw className="w-4 h-4" /></button>
                <button onClick={() => openEditModal(p)} title="Edit" className="w-8 h-8 bg-white rounded-lg shadow-lg flex items-center justify-center text-blue-600 hover:bg-blue-600 hover:text-white transition-colors"><Edit2 className="w-4 h-4" /></button>
                <button onClick={() => handleDeleteProduct(p.id)} title="Delete" className="w-8 h-8 bg-white rounded-lg shadow-lg flex items-center justify-center text-red-600 hover:bg-red-600 hover:text-white transition-colors"><Trash2 className="w-4 h-4" /></button>
              </div>
              {p.video && <div className="absolute bottom-2 right-2 bg-black/60 text-white text-[9px] font-bold px-1.5 py-0.5 rounded uppercase">Video</div>}
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
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Main Category *</label>
                  <select 
                    value={formData.category || ""} 
                    onChange={e => {
                      const newCat = e.target.value;
                      setFormData({ 
                        ...formData, 
                        category: newCat,
                        subCategory: CATEGORY_MAP[newCat]?.[0] || "" // Auto-select first subcategory
                      });
                    }}
                    className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-[#f97316]"
                  >
                    <option value="">Select category…</option>
                    {MAIN_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
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
              {/* Sub-Category */}
              {formData.category && (
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Sub Category *</label>
                  <select 
                    value={formData.subCategory || ""} 
                    onChange={e => setFormData({ ...formData, subCategory: e.target.value })}
                    className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-[#f97316]"
                  >
                    <option value="">Select sub category…</option>
                    {(CATEGORY_MAP[formData.category] || []).map(s => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>
              )}
              <div className="space-y-4">
                {/* Main Image */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Main Product Image *</label>
                  <div className="space-y-2">
                    <label className={`flex items-center justify-center gap-2 w-full px-3 py-2.5 text-sm border-2 border-dashed rounded-lg cursor-pointer transition-colors ${imageUploading ? "border-gray-200 bg-gray-50 opacity-60" : "border-[#1a3a6b]/30 hover:border-[#f97316] hover:bg-orange-50"}`}>
                      <Upload className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-500">{imageUploading ? "Uploading…" : "Upload Main Image"}</span>
                      <input type="file" accept="image/*" className="hidden" disabled={imageUploading}
                        onChange={e => { const f = e.target.files?.[0]; if (f) handleImageUpload(f, true); }} />
                    </label>
                    {formData.image && (
                      <div className="flex items-center gap-2 bg-gray-50 rounded-lg px-3 py-2">
                        <img src={formData.image} alt="preview" className="w-10 h-10 object-cover rounded-lg border border-gray-200" />
                        <span className="text-xs text-gray-500 truncate flex-1">{formData.image}</span>
                        <button type="button" onClick={() => setFormData((prev: any) => ({ ...prev, image: "" }))} className="text-gray-400 hover:text-red-500"><X className="w-4 h-4" /></button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Multiple Images */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Additional Images (Up to 10)</label>
                  <div className="space-y-3">
                    <label className={`flex items-center justify-center gap-2 w-full px-3 py-2.5 text-sm border-2 border-dashed rounded-lg cursor-pointer transition-colors ${imageUploading || (formData.images?.length || 0) >= 10 ? "border-gray-200 bg-gray-50 opacity-60 cursor-not-allowed" : "border-[#1a3a6b]/30 hover:border-[#f97316] hover:bg-orange-50"}`}>
                      <Plus className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-500">{(formData.images?.length || 0) >= 10 ? "Limit Reached" : "Add More Images"}</span>
                      <input type="file" accept="image/*" className="hidden" disabled={imageUploading || (formData.images?.length || 0) >= 10}
                        onChange={e => { const f = e.target.files?.[0]; if (f) handleImageUpload(f, false); }} />
                    </label>
                    {formData.images && formData.images.length > 0 && (
                      <div className="grid grid-cols-5 gap-2">
                        {formData.images.map((url: string, idx: number) => (
                          <div key={idx} className="relative group aspect-square">
                            <img src={url} alt={`gallery-${idx}`} className="w-full h-full object-cover rounded-lg border border-gray-200" />
                            <button type="button" onClick={() => setFormData((prev: any) => ({ ...prev, images: prev.images.filter((_: any, i: number) => i !== idx) }))} 
                              className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-0.5 shadow-md opacity-0 group-hover:opacity-100 transition-opacity">
                              <X className="w-3 h-3" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Video Upload */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Product Video</label>
                  <div className="space-y-2">
                    <label className={`flex items-center justify-center gap-2 w-full px-3 py-2.5 text-sm border-2 border-dashed rounded-lg cursor-pointer transition-colors ${imageUploading ? "border-gray-200 bg-gray-50 opacity-60" : "border-[#1a3a6b]/30 hover:border-blue-500 hover:bg-blue-50"}`}>
                      <Package className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-500">{imageUploading ? "Uploading…" : "Upload Video (MP4/WebM)"}</span>
                      <input type="file" accept="video/*" className="hidden" disabled={imageUploading}
                        onChange={e => { const f = e.target.files?.[0]; if (f) handleVideoUpload(f); }} />
                    </label>
                    {formData.video && (
                      <div className="flex items-center gap-2 bg-blue-50 rounded-lg px-3 py-2">
                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600 font-bold text-[10px]">VIDEO</div>
                        <span className="text-xs text-blue-700 truncate flex-1">{formData.video}</span>
                        <button type="button" onClick={() => setFormData((prev: any) => ({ ...prev, video: "" }))} className="text-blue-400 hover:text-red-500"><X className="w-4 h-4" /></button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Description</label>
                <textarea value={formData.description || ""} onChange={e => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-[#f97316]" rows={3} />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Features (one per line)</label>
                <textarea value={Array.isArray(formData.features) ? formData.features.join('\n') : (formData.features || "")} onChange={e => setFormData({ ...formData, features: e.target.value.split('\n').filter(f => f.trim()) })}
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

              {/* ── Festival & Offers Section ── */}
              <div className="pt-4 border-t border-gray-100">
                <h4 className="text-sm font-bold text-[#1a3a6b] mb-3 flex items-center gap-2">
                  <Star className="w-4 h-4 text-orange-500 fill-orange-500" />
                  Festival Offers & Discounts
                </h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Festival Offer Badge</label>
                    <select value={formData.festivalOffer || ""} onChange={e => setFormData({ ...formData, festivalOffer: e.target.value })}
                      className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-[#f97316]">
                      <option value="">No Festival Offer</option>
                      <option value="Diwali Special">🪔 Diwali Special</option>
                      <option value="Holi Dhamaka">🎨 Holi Dhamaka</option>
                      <option value="Eid Mubarak">🌙 Eid Mubarak</option>
                      <option value="Christmas Sale">🎄 Christmas Sale</option>
                      <option value="New Year Deal">🎉 New Year Deal</option>
                      <option value="Independence Day">🇮🇳 Independence Day</option>
                      <option value="Limited Time">⏳ Limited Time Offer</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Discount (%)</label>
                    <input type="number" value={formData.discountPercent || ""} onChange={e => setFormData({ ...formData, discountPercent: e.target.value ? parseInt(e.target.value) : undefined })}
                      placeholder="e.g. 20"
                      className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-[#f97316]" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Offer Label</label>
                    <input type="text" value={formData.offerLabel || ""} onChange={e => setFormData({ ...formData, offerLabel: e.target.value })}
                      placeholder="e.g. Buy 1 Get 1 Free"
                      className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-[#f97316]" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Offer Valid Till</label>
                    <input type="date" value={formData.offerValidTill || ""} onChange={e => setFormData({ ...formData, offerValidTill: e.target.value })}
                      className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-[#f97316]" />
                  </div>
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
  const filteredQuotes = quotes.filter(q =>
    q.name.toLowerCase().includes(quoteSearch.toLowerCase()) ||
    q.phone.includes(quoteSearch) ||
    q.product.toLowerCase().includes(quoteSearch.toLowerCase())
  );

  const QuotesEl = (
    <div className="space-y-4">
      {/* Reply Modal */}
      {replyModal.open && replyModal.quote && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-gray-900 flex items-center gap-2"><Reply className="w-5 h-5 text-[#1a3a6b]" />Reply to {replyModal.quote.name}</h3>
              <button onClick={() => { setReplyModal({ open: false, quote: null }); setReplyText(""); }} className="p-1.5 hover:bg-gray-100 rounded-lg"><X className="w-4 h-4" /></button>
            </div>
            <div className="bg-gray-50 rounded-xl p-4 mb-4 text-sm space-y-1.5">
              <p><span className="font-semibold text-gray-600">Product:</span> {replyModal.quote.product || replyModal.quote.category || "—"}</p>
              <p><span className="font-semibold text-gray-600">Size:</span> {replyModal.quote.width && replyModal.quote.height ? `${replyModal.quote.width} × ${replyModal.quote.height}` : "—"}</p>
              <p><span className="font-semibold text-gray-600">Qty:</span> {replyModal.quote.quantity || "1"}</p>
              {replyModal.quote.notes && <p><span className="font-semibold text-gray-600">Notes:</span> {replyModal.quote.notes}</p>}
            </div>
            <textarea
              value={replyText}
              onChange={e => setReplyText(e.target.value)}
              placeholder="Type your reply / quote price here…"
              rows={4}
              className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:border-[#f97316] focus:ring-2 focus:ring-[#f97316]/20 resize-none"
            />
            <div className="flex justify-end gap-3 mt-4">
              <button onClick={() => { setReplyModal({ open: false, quote: null }); setReplyText(""); }} className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-xl transition-colors">Cancel</button>
              <button onClick={sendReply} disabled={replying || !replyText.trim()} className="px-5 py-2 bg-[#1a3a6b] hover:bg-[#15306b] disabled:opacity-50 text-white text-sm font-bold rounded-xl flex items-center gap-2 transition-colors">
                <Send className="w-4 h-4" />{replying ? "Sending…" : "Send Reply"}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
        <div className="relative flex-1 max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input value={quoteSearch} onChange={e => setQuoteSearch(e.target.value)} placeholder="Search by name, phone, product…" className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:border-[#f97316]" />
        </div>
        <button onClick={fetchQuotes} disabled={quotesLoading} className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-[#1a3a6b] bg-[#1a3a6b]/10 hover:bg-[#1a3a6b]/20 rounded-xl transition-colors">
          <RefreshCw className={`w-4 h-4 ${quotesLoading ? "animate-spin" : ""}`} />Refresh
        </button>
      </div>

      {quotesLoading ? (
        <div className="flex items-center justify-center h-40"><div className="w-8 h-8 border-4 border-[#1a3a6b] border-t-transparent rounded-full animate-spin" /></div>
      ) : filteredQuotes.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-12 text-center">
          <FileText className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500 font-medium">No quote requests yet</p>
          <p className="text-gray-400 text-sm mt-1">Requests from the website will appear here</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredQuotes.map(q => (
            <div key={q.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
              <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-2">
                    <h3 className="font-bold text-gray-900">{q.name}</h3>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${
                      q.status === "replied" ? "bg-green-100 text-green-700" :
                      q.status === "closed" ? "bg-gray-100 text-gray-600" :
                      "bg-orange-100 text-orange-700"
                    }`}>{q.status === "pending" ? "Pending" : q.status === "replied" ? "Replied" : "Closed"}</span>
                    <span className="text-xs text-gray-400">{new Date(q.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</span>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-6 gap-y-1 text-sm text-gray-600">
                    <span><span className="font-medium">📞</span> {q.phone}</span>
                    {q.email && <span><span className="font-medium">✉️</span> {q.email}</span>}
                    {q.product && <span><span className="font-medium">🪟</span> {q.product}</span>}
                    {q.category && <span><span className="font-medium">📂</span> {q.category}</span>}
                    {(q.width || q.height) && <span><span className="font-medium">📐</span> {q.width} × {q.height}</span>}
                    {q.quantity && <span><span className="font-medium">🔢</span> Qty: {q.quantity}</span>}
                    {q.address && <span className="col-span-2"><span className="font-medium">📍</span> {q.address}</span>}
                  </div>
                  {q.notes && <p className="mt-2 text-sm text-gray-500 italic">"{q.notes}"</p>}
                  {q.reply && (
                    <div className="mt-3 bg-blue-50 border border-blue-100 rounded-xl p-3 text-sm text-blue-800">
                      <span className="font-semibold">Your reply:</span> {q.reply}
                    </div>
                  )}
                </div>
                <div className="flex sm:flex-col gap-2">
                  <button onClick={() => { setReplyModal({ open: true, quote: q }); setReplyText(q.reply || ""); }}
                    className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold bg-[#1a3a6b] hover:bg-[#15306b] text-white rounded-xl transition-colors">
                    <Reply className="w-3.5 h-3.5" />Reply
                  </button>
                  <button onClick={() => deleteQuote(q.id)}
                    className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold bg-red-50 hover:bg-red-100 text-red-600 rounded-xl transition-colors">
                    <Trash2 className="w-3.5 h-3.5" />Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const ChatbotEl = (
    <div className="max-w-2xl space-y-6">
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <h3 className="font-bold text-gray-800 mb-1 flex items-center gap-2">
          <MessageSquare className="w-5 h-5 text-[#1a3a6b]" />Chatbot Status
        </h3>
        <p className="text-sm text-gray-500 mb-5">Your AI chatbot is live on the website, powered by Gemini AI.</p>
        <div className="flex items-center gap-3 mb-6">
          <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
          <span className="text-sm font-semibold text-green-700">Active — Responding to visitors</span>
        </div>
        <div className="space-y-3 text-sm">
          <div className="flex items-center justify-between py-2.5 border-b border-gray-100">
            <span className="text-gray-600">Model</span><span className="font-semibold text-gray-800">Gemini 1.5 Flash</span>
          </div>
          <div className="flex items-center justify-between py-2.5 border-b border-gray-100">
            <span className="text-gray-600">Endpoint</span><code className="text-xs bg-gray-50 px-2 py-1 rounded-lg font-mono text-[#1a3a6b]">/api/chat</code>
          </div>
          <div className="flex items-center justify-between py-2.5 border-b border-gray-100">
            <span className="text-gray-600">Quote Integration</span><code className="text-xs bg-gray-50 px-2 py-1 rounded-lg font-mono text-[#1a3a6b]">/quote → /api/quotes</code>
          </div>
          <div className="flex items-center justify-between py-2.5">
            <span className="text-gray-600">Visible on</span><span className="font-semibold text-gray-800">All public pages</span>
          </div>
        </div>
      </div>
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
          <ExternalLink className="w-4 h-4 text-[#1a3a6b]" />Quick Links
        </h3>
        <div className="space-y-3">
          <a href="/quote" target="_blank" className="flex items-center justify-between p-3 bg-[#1a3a6b]/5 hover:bg-[#1a3a6b]/10 rounded-xl transition-colors group">
            <span className="text-sm font-medium text-[#1a3a6b]">Quote Request Page</span>
            <ExternalLink className="w-4 h-4 text-[#1a3a6b] group-hover:scale-110 transition-transform" />
          </a>
          <div onClick={() => setActiveTab("quotes")} className="flex items-center justify-between p-3 bg-orange-50 hover:bg-orange-100 rounded-xl transition-colors group cursor-pointer">
            <span className="text-sm font-medium text-orange-700">View Quote Requests ({quotes.length})</span>
            <FileText className="w-4 h-4 text-orange-600 group-hover:scale-110 transition-transform" />
          </div>
        </div>
        <p className="mt-4 text-xs text-gray-400">Chatbot configuration and prompt updates coming soon.</p>
      </div>
    </div>
  );

  const DiagnosticsEl = (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { label: "Total Products", value: products.length, icon: <Package className="w-5 h-5" />, color: "text-blue-600" },
          { label: "No Images", value: products.filter(p => !p.image).length, icon: <Eye className="w-5 h-5" />, color: "text-red-600" },
          { label: "Missing Category", value: products.filter(p => !p.category || !p.subCategory).length, icon: <AlertCircle className="w-5 h-5" />, color: "text-orange-600" },
        ].map((stat, i) => (
          <div key={i} className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
            <div className="flex items-center gap-3 mb-2">
              <div className={`p-2 rounded-lg bg-gray-50 ${stat.color}`}>{stat.icon}</div>
              <span className="text-sm font-medium text-gray-500">{stat.label}</span>
            </div>
            <p className="text-2xl font-black text-gray-900">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 bg-gray-50">
          <h3 className="font-bold text-gray-800">Product Integrity Audit</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 text-gray-500 uppercase text-[10px] font-bold">
              <tr>
                <th className="px-6 py-3">Product</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3">Issues</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {products.map(p => {
                const issues = [];
                if (!p.image) issues.push("Missing main image");
                if (!p.category) issues.push("Missing category");
                if (!p.subCategory) issues.push("Missing sub-category");
                if (!p.price) issues.push("Price is 0 or missing");
                
                return (
                  <tr key={p.id} className="hover:bg-gray-50/50">
                    <td className="px-6 py-4 font-medium text-gray-900">{p.name}</td>
                    <td className="px-6 py-4">
                      {issues.length === 0 ? (
                        <span className="text-green-600 flex items-center gap-1"><CheckCircle className="w-3.5 h-3.5" /> Healthy</span>
                      ) : (
                        <span className="text-red-600 flex items-center gap-1"><XCircle className="w-3.5 h-3.5" /> Issues Found</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-gray-500">
                      {issues.length > 0 ? issues.join(", ") : "None"}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

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
    products: "Products Catalogue", customers: "Customer Directory",
    quotes: "Quote Requests", chatbot: "Chatbot Manager", 
    diagnostics: "System Diagnostics", settings: "Store Settings",
  };
  const CONTENT: Record<Tab, React.ReactNode> = {
    overview: Overview, orders: Orders, products: Products, customers: Customers,
    quotes: QuotesEl, chatbot: ChatbotEl, diagnostics: DiagnosticsEl, settings: SettingsEl,
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

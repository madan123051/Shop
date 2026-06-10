"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth, Address } from "@/context/AuthContext";
import { useOrder } from "@/context/OrderContext";
import {
  LogOut,
  Edit2,
  Plus,
  Trash2,
  MapPin,
  Phone,
  Mail,
  User,
  Check,
  X,
  Loader,
  Camera,
  Calendar,
  Globe,
  Package,
  ChevronRight,
  ChevronDown,
  ShoppingBag,
  Clock,
  CheckCircle,
  Truck,
  Star,
  UserCircle,
} from "lucide-react";

// ─── Helpers ─────────────────────────────────────────────────────────────────

function getInitials(firstName: string, lastName: string) {
  return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase() || "U";
}

function formatDate(iso: string) {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

const STATUS_STYLES: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-700",
  confirmed: "bg-blue-100 text-blue-700",
  shipped: "bg-purple-100 text-purple-700",
  delivered: "bg-emerald-100 text-emerald-700",
  cancelled: "bg-red-100 text-red-700",
};

const EMPTY_ADDRESS = {
  firstName: "",
  lastName: "",
  phone: "",
  address: "",
  city: "",
  state: "",
  zip: "",
  country: "India",
  isDefault: false,
};

type Tab = "info" | "addresses" | "orders";

export default function ProfilePage() {
  const router = useRouter();
  const {
    user,
    isLoggedIn,
    logout,
    updateProfile,
    addAddress,
    updateAddress,
    deleteAddress,
    setDefaultAddress,
  } = useAuth();
  const { getUserOrders } = useOrder();

  const fileInputRef = useRef<HTMLInputElement>(null);

  const [activeTab, setActiveTab] = useState<Tab>("info");
  const [isInfoCollapsed, setIsInfoCollapsed] = useState(true);
  const [isEditingInfo, setIsEditingInfo] = useState(false);
  const [isAddingAddress, setIsAddingAddress] = useState(false);
  const [editingAddressId, setEditingAddressId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const [profileForm, setProfileForm] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    dateOfBirth: "",
    gender: "",
    mainLocation: "",
  });

  const [addressForm, setAddressForm] = useState(EMPTY_ADDRESS);

  useEffect(() => {
    if (!isLoggedIn) router.push("/login");
  }, [isLoggedIn, router]);

  useEffect(() => {
    if (user) {
      setProfileForm({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        phone: user.phone || "",
        dateOfBirth: user.dateOfBirth || "",
        gender: user.gender || "",
        mainLocation: user.mainLocation || "",
      });
    }
  }, [user]);

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader className="w-8 h-8 text-[#f97316] animate-spin" />
      </div>
    );
  }

  const orders = getUserOrders(user.id);
  const initials = getInitials(user.firstName, user.lastName);
  const profilePhoto = user.profilePhoto || user.photoURL || "";
  const memberYear = new Date(user.createdAt).getFullYear();

  const handleLogout = async () => {
    await logout();
    router.push("/");
  };

  const handlePhotoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async (ev) => {
      const dataUrl = ev.target?.result as string;
      await updateProfile({ profilePhoto: dataUrl });
    };
    reader.readAsDataURL(file);
  };

  const handleSaveInfo = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await updateProfile(profileForm);
      setIsEditingInfo(false);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      console.error("Failed to update profile", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await addAddress(addressForm);
      setAddressForm(EMPTY_ADDRESS);
      setIsAddingAddress(false);
    } catch (err) {
      console.error("Failed to add address", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateAddress = async (e: React.FormEvent, id: string) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await updateAddress(id, addressForm);
      setEditingAddressId(null);
      setAddressForm(EMPTY_ADDRESS);
    } catch (err) {
      console.error("Failed to update address", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteAddress = async (id: string) => {
    if (confirm("Delete this address?")) {
      await deleteAddress(id);
    }
  };

  const AddressForm = ({
    onSubmit,
    onCancel,
    submitLabel,
  }: {
    onSubmit: (e: React.FormEvent) => void;
    onCancel: () => void;
    submitLabel: string;
  }) => (
    <form
      onSubmit={onSubmit}
      className="space-y-4 p-5 bg-orange-50 border border-orange-100 rounded-2xl"
    >
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-xs font-semibold text-gray-600 mb-1 block">
            First Name
          </label>
          <input
            type="text"
            value={addressForm.firstName}
            onChange={(e) =>
              setAddressForm({ ...addressForm, firstName: e.target.value })
            }
            required
            placeholder="First Name"
            className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#f97316] focus:ring-2 focus:ring-[#f97316]/20 bg-white"
          />
        </div>
        <div>
          <label className="text-xs font-semibold text-gray-600 mb-1 block">
            Last Name
          </label>
          <input
            type="text"
            value={addressForm.lastName}
            onChange={(e) =>
              setAddressForm({ ...addressForm, lastName: e.target.value })
            }
            required
            placeholder="Last Name"
            className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#f97316] focus:ring-2 focus:ring-[#f97316]/20 bg-white"
          />
        </div>
      </div>
      <div>
        <label className="text-xs font-semibold text-gray-600 mb-1 block">
          Phone Number
        </label>
        <input
          type="tel"
          value={addressForm.phone}
          onChange={(e) =>
            setAddressForm({ ...addressForm, phone: e.target.value })
          }
          required
          placeholder="+91 98765 43210"
          className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#f97316] focus:ring-2 focus:ring-[#f97316]/20 bg-white"
        />
      </div>
      <div>
        <label className="text-xs font-semibold text-gray-600 mb-1 block">
          Street Address
        </label>
        <input
          type="text"
          value={addressForm.address}
          onChange={(e) =>
            setAddressForm({ ...addressForm, address: e.target.value })
          }
          required
          placeholder="House no., Street, Area"
          className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#f97316] focus:ring-2 focus:ring-[#f97316]/20 bg-white"
        />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-xs font-semibold text-gray-600 mb-1 block">
            City
          </label>
          <input
            type="text"
            value={addressForm.city}
            onChange={(e) =>
              setAddressForm({ ...addressForm, city: e.target.value })
            }
            required
            placeholder="City"
            className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#f97316] focus:ring-2 focus:ring-[#f97316]/20 bg-white"
          />
        </div>
        <div>
          <label className="text-xs font-semibold text-gray-600 mb-1 block">
            State
          </label>
          <input
            type="text"
            value={addressForm.state}
            onChange={(e) =>
              setAddressForm({ ...addressForm, state: e.target.value })
            }
            required
            placeholder="State"
            className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#f97316] focus:ring-2 focus:ring-[#f97316]/20 bg-white"
          />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-xs font-semibold text-gray-600 mb-1 block">
            PIN Code
          </label>
          <input
            type="text"
            value={addressForm.zip}
            onChange={(e) =>
              setAddressForm({ ...addressForm, zip: e.target.value })
            }
            required
            placeholder="PIN Code"
            className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#f97316] focus:ring-2 focus:ring-[#f97316]/20 bg-white"
          />
        </div>
        <div>
          <label className="text-xs font-semibold text-gray-600 mb-1 block">
            Country
          </label>
          <select
            value={addressForm.country}
            onChange={(e) =>
              setAddressForm({ ...addressForm, country: e.target.value })
            }
            className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#f97316] focus:ring-2 focus:ring-[#f97316]/20 bg-white"
          >
            <option>India</option>
            <option>Nepal</option>
            <option>Bangladesh</option>
            <option>Sri Lanka</option>
            <option>Pakistan</option>
          </select>
        </div>
      </div>
      <label className="flex items-center gap-2 cursor-pointer">
        <input
          type="checkbox"
          checked={addressForm.isDefault}
          onChange={(e) =>
            setAddressForm({ ...addressForm, isDefault: e.target.checked })
          }
          className="w-4 h-4 rounded border-gray-300 text-[#f97316] accent-[#f97316]"
        />
        <span className="text-sm font-medium text-gray-700">
          Set as default address
        </span>
      </label>
      <div className="flex gap-3 pt-1">
        <button
          type="submit"
          disabled={isLoading}
          className="flex-1 bg-[#f97316] hover:bg-[#ea580c] disabled:bg-gray-300 text-white font-semibold py-2.5 rounded-xl transition-colors flex items-center justify-center gap-2 text-sm"
        >
          {isLoading ? (
            <Loader className="w-4 h-4 animate-spin" />
          ) : (
            <Check className="w-4 h-4" />
          )}
          {submitLabel}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 bg-white hover:bg-gray-100 text-gray-700 font-semibold py-2.5 rounded-xl border border-gray-200 transition-colors flex items-center justify-center gap-2 text-sm"
        >
          <X className="w-4 h-4" />
          Cancel
        </button>
      </div>
    </form>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* HERO CARD */}
        <div className="relative bg-gradient-to-br from-[#1a3a6b] via-[#1e4080] to-[#0f2447] rounded-3xl p-6 sm:p-8 mb-6 overflow-hidden shadow-xl">
          <div className="absolute -top-10 -right-10 w-48 h-48 bg-white/5 rounded-full pointer-events-none" />
          <div className="absolute -bottom-8 -left-8 w-36 h-36 bg-[#f97316]/10 rounded-full pointer-events-none" />

          <div className="relative flex flex-col sm:flex-row items-center sm:items-start gap-6">
            {/* Avatar */}
            <div className="relative group shrink-0">
              {profilePhoto ? (
                <img
                  src={profilePhoto}
                  alt="Profile"
                  className="w-24 h-24 rounded-2xl object-cover border-4 border-white/20 shadow-lg"
                />
              ) : (
                <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-[#f97316] to-[#fb923c] flex items-center justify-center border-4 border-white/20 shadow-lg">
                  <span className="text-3xl font-extrabold text-white">
                    {initials}
                  </span>
                </div>
              )}
              <button
                onClick={() => fileInputRef.current?.click()}
                className="absolute inset-0 bg-black/50 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-1"
                title="Change photo"
              >
                <Camera className="w-5 h-5 text-white" />
                <span className="text-[10px] text-white font-semibold">
                  Change
                </span>
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handlePhotoChange}
              />
            </div>

            {/* User info */}
            <div className="flex-1 text-center sm:text-left">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white leading-tight">
                {user.firstName} {user.lastName}
              </h1>
              <p className="text-blue-200 text-sm mt-1">{user.email}</p>
              {user.mainLocation && (
                <p className="flex items-center justify-center sm:justify-start gap-1.5 text-blue-200 text-sm mt-1.5">
                  <MapPin className="w-3.5 h-3.5 text-[#f97316]" />
                  {user.mainLocation}
                </p>
              )}
              {user.phone && (
                <p className="flex items-center justify-center sm:justify-start gap-1.5 text-blue-200 text-sm mt-1">
                  <Phone className="w-3.5 h-3.5 text-[#f97316]" />
                  {user.phone}
                </p>
              )}

              {/* Stats */}
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 mt-5">
                <div className="bg-white/10 backdrop-blur-sm border border-white/10 rounded-xl px-4 py-2.5 text-center min-w-[72px]">
                  <p className="text-xl font-extrabold text-white">
                    {orders.length}
                  </p>
                  <p className="text-[11px] text-blue-200 font-medium mt-0.5">
                    Orders
                  </p>
                </div>
                <div className="bg-white/10 backdrop-blur-sm border border-white/10 rounded-xl px-4 py-2.5 text-center min-w-[72px]">
                  <p className="text-xl font-extrabold text-white">
                    {user.addresses.length}
                  </p>
                  <p className="text-[11px] text-blue-200 font-medium mt-0.5">
                    Addresses
                  </p>
                </div>
                <div className="bg-white/10 backdrop-blur-sm border border-white/10 rounded-xl px-4 py-2.5 text-center min-w-[72px]">
                  <p className="text-xl font-extrabold text-white">
                    {memberYear}
                  </p>
                  <p className="text-[11px] text-blue-200 font-medium mt-0.5">
                    Joined
                  </p>
                </div>
              </div>
            </div>

            {/* Logout */}
            <button
              onClick={handleLogout}
              className="shrink-0 flex items-center gap-2 bg-white/10 hover:bg-white/20 border border-white/20 text-white font-semibold px-4 py-2.5 rounded-xl transition-colors text-sm"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </div>
        </div>

        {/* TAB BAR */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 flex overflow-hidden mb-6">
          {(
            [
              { id: "info", label: "Personal Info", icon: User },
              { id: "addresses", label: "My Addresses", icon: MapPin },
              { id: "orders", label: "My Orders", icon: Package },
            ] as { id: Tab; label: string; icon: any }[]
          ).map((tab) => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 flex items-center justify-center gap-2 py-4 text-sm font-semibold transition-all border-b-2 ${
                  active
                    ? "border-[#f97316] text-[#f97316] bg-orange-50"
                    : "border-transparent text-gray-500 hover:text-gray-800 hover:bg-gray-50"
                }`}
              >
                <Icon className="w-4 h-4" />
                <span className="hidden sm:inline">{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* PERSONAL INFO TAB */}
        {activeTab === "info" && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            {/* Accordion Header — always visible, tap to collapse/expand */}
            <button
              onClick={() => { if (!isEditingInfo) setIsInfoCollapsed(!isInfoCollapsed); }}
              className="w-full flex items-center gap-4 px-5 py-4 hover:bg-gray-50 transition-colors text-left"
            >
              <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center shrink-0">
                <User className="w-5 h-5 text-[#f97316]" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-gray-900 text-sm">Personal Information</p>
                <p className="text-xs text-gray-400 mt-0.5 truncate">
                  {`${user.firstName} ${user.lastName}`.trim() || user.email}
                  {user.mainLocation ? ` · ${user.mainLocation}` : ""}
                </p>
              </div>
              {!isEditingInfo && !isInfoCollapsed && (
                <button
                  onClick={(e) => { e.stopPropagation(); setIsEditingInfo(true); setIsInfoCollapsed(false); }}
                  className="flex items-center gap-1.5 bg-[#f97316] hover:bg-[#ea580c] text-white font-semibold px-3 py-2 rounded-xl transition-colors text-xs shrink-0"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                  Edit
                </button>
              )}
              <ChevronDown
                className={`w-5 h-5 text-gray-400 transition-transform duration-200 shrink-0 ${isInfoCollapsed ? "" : "rotate-180"}`}
              />
            </button>

            {/* Collapsible Body */}
            {!isInfoCollapsed && (
              <>
                {saveSuccess && (
                  <div className="mx-5 mb-0 mt-1 flex items-center gap-2 bg-emerald-50 border border-emerald-200 text-emerald-700 px-4 py-2.5 rounded-xl text-sm font-medium">
                    <CheckCircle className="w-4 h-4" />
                    Profile updated successfully!
                  </div>
                )}

                <div className="px-5 pb-5 pt-2">
                  {isEditingInfo ? (
                    <form onSubmit={handleSaveInfo} className="space-y-4">
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-semibold text-gray-600 mb-1.5">First Name</label>
                          <input
                            type="text"
                            value={profileForm.firstName}
                            onChange={(e) => setProfileForm({ ...profileForm, firstName: e.target.value })}
                            placeholder="First Name"
                            className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#f97316] focus:ring-2 focus:ring-[#f97316]/20"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-gray-600 mb-1.5">Last Name</label>
                          <input
                            type="text"
                            value={profileForm.lastName}
                            onChange={(e) => setProfileForm({ ...profileForm, lastName: e.target.value })}
                            placeholder="Last Name"
                            className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#f97316] focus:ring-2 focus:ring-[#f97316]/20"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-gray-600 mb-1.5">Phone Number</label>
                        <div className="relative">
                          <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                          <input
                            type="tel"
                            value={profileForm.phone}
                            onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                            placeholder="+91 98765 43210"
                            className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#f97316] focus:ring-2 focus:ring-[#f97316]/20"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-semibold text-gray-600 mb-1.5">Date of Birth</label>
                          <div className="relative">
                            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <input
                              type="date"
                              value={profileForm.dateOfBirth}
                              onChange={(e) => setProfileForm({ ...profileForm, dateOfBirth: e.target.value })}
                              className="w-full pl-9 pr-2 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#f97316] focus:ring-2 focus:ring-[#f97316]/20 text-gray-700"
                            />
                          </div>
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-gray-600 mb-1.5">Gender</label>
                          <select
                            value={profileForm.gender}
                            onChange={(e) => setProfileForm({ ...profileForm, gender: e.target.value })}
                            className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#f97316] focus:ring-2 focus:ring-[#f97316]/20 text-gray-700 bg-white"
                          >
                            <option value="">Prefer not to say</option>
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                            <option value="non-binary">Non-binary</option>
                            <option value="other">Other</option>
                          </select>
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-gray-600 mb-1.5">Main Location</label>
                        <div className="relative">
                          <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                          <input
                            type="text"
                            value={profileForm.mainLocation}
                            onChange={(e) => setProfileForm({ ...profileForm, mainLocation: e.target.value })}
                            placeholder="e.g. Mumbai, India"
                            className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#f97316] focus:ring-2 focus:ring-[#f97316]/20"
                          />
                        </div>
                      </div>

                      <div className="flex gap-3 pt-1">
                        <button
                          type="submit"
                          disabled={isLoading}
                          className="flex-1 bg-[#f97316] hover:bg-[#ea580c] disabled:bg-gray-300 text-white font-semibold py-2.5 rounded-xl transition-colors flex items-center justify-center gap-2 text-sm"
                        >
                          {isLoading ? <Loader className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                          Save Changes
                        </button>
                        <button
                          type="button"
                          onClick={() => setIsEditingInfo(false)}
                          className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-2.5 rounded-xl transition-colors flex items-center justify-center gap-2 text-sm"
                        >
                          <X className="w-4 h-4" />
                          Cancel
                        </button>
                      </div>
                    </form>
                  ) : (
                    /* Compact list — no big cards, just clean rows */
                    <div className="divide-y divide-gray-100 border border-gray-100 rounded-xl overflow-hidden">
                      {[
                        { icon: User, label: "Full Name", value: `${user.firstName} ${user.lastName}`.trim() || "—" },
                        { icon: Mail, label: "Email", value: user.email || "—" },
                        { icon: Phone, label: "Phone", value: user.phone || "Not set" },
                        { icon: Calendar, label: "Date of Birth", value: user.dateOfBirth ? formatDate(user.dateOfBirth) : "Not set" },
                        { icon: UserCircle, label: "Gender", value: user.gender ? user.gender.charAt(0).toUpperCase() + user.gender.slice(1) : "Not set" },
                        { icon: Globe, label: "Location", value: user.mainLocation || "Not set" },
                      ].map((item) => {
                        const Icon = item.icon;
                        const isNotSet = item.value === "Not set";
                        return (
                          <div key={item.label} className="flex items-center gap-3 px-4 py-3 bg-white hover:bg-gray-50 transition-colors">
                            <div className="w-7 h-7 bg-orange-50 rounded-lg flex items-center justify-center shrink-0">
                              <Icon className="w-3.5 h-3.5 text-[#f97316]" />
                            </div>
                            <span className="text-xs text-gray-500 w-24 shrink-0 font-medium">{item.label}</span>
                            <span className={`text-sm font-semibold flex-1 truncate ${isNotSet ? "text-gray-300 italic" : "text-gray-800"}`}>
                              {item.value}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        )}

        {/* ADDRESSES TAB */}
        {activeTab === "addresses" && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <div>
                <h2 className="text-lg font-bold text-gray-900">
                  Saved Addresses
                </h2>
                <p className="text-sm text-gray-500 mt-0.5">
                  Manage your delivery addresses
                </p>
              </div>
              {!isAddingAddress && (
                <button
                  onClick={() => {
                    setAddressForm(EMPTY_ADDRESS);
                    setEditingAddressId(null);
                    setIsAddingAddress(true);
                  }}
                  className="flex items-center gap-2 bg-[#f97316] hover:bg-[#ea580c] text-white font-semibold px-4 py-2.5 rounded-xl transition-colors text-sm"
                >
                  <Plus className="w-4 h-4" />
                  Add Address
                </button>
              )}
            </div>

            <div className="p-6 space-y-4">
              {isAddingAddress && (
                <AddressForm
                  onSubmit={handleAddAddress}
                  onCancel={() => setIsAddingAddress(false)}
                  submitLabel="Add Address"
                />
              )}

              {user.addresses.length === 0 && !isAddingAddress ? (
                <div className="text-center py-14">
                  <div className="w-16 h-16 bg-orange-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <MapPin className="w-8 h-8 text-[#f97316]" />
                  </div>
                  <p className="text-gray-500 font-medium">No saved addresses</p>
                  <p className="text-gray-400 text-sm mt-1">
                    Add a delivery address to get started
                  </p>
                </div>
              ) : (
                user.addresses.map((addr) => (
                  <div key={addr.id}>
                    {editingAddressId === addr.id ? (
                      <AddressForm
                        onSubmit={(e) => handleUpdateAddress(e, addr.id)}
                        onCancel={() => setEditingAddressId(null)}
                        submitLabel="Update Address"
                      />
                    ) : (
                      <div
                        className={`relative p-5 rounded-2xl border-2 transition-all ${
                          addr.isDefault
                            ? "border-[#f97316] bg-orange-50"
                            : "border-gray-200 bg-gray-50 hover:border-gray-300"
                        }`}
                      >
                        {addr.isDefault && (
                          <span className="absolute top-4 right-4 bg-[#f97316] text-white text-[10px] font-extrabold px-2.5 py-1 rounded-full tracking-wide uppercase">
                            Default
                          </span>
                        )}
                        <div className="flex items-start gap-3">
                          <div className="w-9 h-9 bg-white rounded-lg border border-gray-200 flex items-center justify-center shrink-0 shadow-sm">
                            <MapPin className="w-4 h-4 text-[#f97316]" />
                          </div>
                          <div className="flex-1 min-w-0 pr-16">
                            <p className="font-bold text-gray-900 text-sm">
                              {addr.firstName} {addr.lastName}
                            </p>
                            <p className="text-sm text-gray-600 mt-1 leading-relaxed">
                              {addr.address}
                              <br />
                              {addr.city}, {addr.state} — {addr.zip}
                              <br />
                              {addr.country}
                            </p>
                            <p className="flex items-center gap-1.5 text-sm text-gray-500 mt-2">
                              <Phone className="w-3.5 h-3.5" />
                              {addr.phone}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 mt-4 pt-4 border-t border-gray-200">
                          <button
                            onClick={() => {
                              setEditingAddressId(addr.id);
                              setAddressForm(addr);
                              setIsAddingAddress(false);
                            }}
                            className="flex items-center gap-1.5 text-sm text-[#f97316] hover:text-[#ea580c] font-semibold px-3 py-1.5 rounded-lg hover:bg-orange-100 transition-colors"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteAddress(addr.id)}
                            className="flex items-center gap-1.5 text-sm text-red-500 hover:text-red-700 font-semibold px-3 py-1.5 rounded-lg hover:bg-red-50 transition-colors"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            Delete
                          </button>
                          {!addr.isDefault && (
                            <button
                              onClick={() => setDefaultAddress(addr.id)}
                              className="ml-auto flex items-center gap-1.5 text-sm text-gray-500 hover:text-[#f97316] font-medium px-3 py-1.5 rounded-lg hover:bg-orange-50 transition-colors"
                            >
                              <Star className="w-3.5 h-3.5" />
                              Set as Default
                            </button>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* ORDERS TAB */}
        {activeTab === "orders" && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <div>
                <h2 className="text-lg font-bold text-gray-900">My Orders</h2>
                <p className="text-sm text-gray-500 mt-0.5">
                  {orders.length} order{orders.length !== 1 ? "s" : ""} placed
                </p>
              </div>
              {orders.length > 0 && (
                <Link
                  href="/orders"
                  className="flex items-center gap-1.5 text-[#f97316] hover:text-[#ea580c] font-semibold text-sm"
                >
                  View All
                  <ChevronRight className="w-4 h-4" />
                </Link>
              )}
            </div>

            <div className="p-6 space-y-3">
              {orders.length === 0 ? (
                <div className="text-center py-14">
                  <div className="w-16 h-16 bg-orange-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <ShoppingBag className="w-8 h-8 text-[#f97316]" />
                  </div>
                  <p className="text-gray-500 font-medium">No orders yet</p>
                  <p className="text-gray-400 text-sm mt-1">
                    Start shopping to place your first order!
                  </p>
                  <Link
                    href="/shop"
                    className="inline-flex items-center gap-2 mt-4 bg-[#f97316] hover:bg-[#ea580c] text-white font-semibold px-5 py-2.5 rounded-xl text-sm transition-colors"
                  >
                    <ShoppingBag className="w-4 h-4" />
                    Shop Now
                  </Link>
                </div>
              ) : (
                orders.slice(0, 5).map((order) => (
                  <Link
                    key={order.id}
                    href="/orders"
                    className="flex items-center gap-4 p-4 rounded-xl border border-gray-100 hover:border-[#f97316] hover:bg-orange-50 transition-all group"
                  >
                    <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center shrink-0">
                      <Package className="w-5 h-5 text-[#f97316]" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-gray-900 text-sm truncate">
                        {order.id}
                      </p>
                      <p className="text-xs text-gray-400 mt-0.5">
                        {new Date(order.createdAt).toLocaleDateString("en-US", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                        &nbsp;·&nbsp;{order.items.length} item
                        {order.items.length !== 1 ? "s" : ""}
                      </p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="font-bold text-[#f97316] text-sm">
                        ₹{order.total.toLocaleString('en-IN')}
                      </p>
                      <span
                        className={`inline-block mt-1 text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                          STATUS_STYLES[order.status] || "bg-gray-100 text-gray-600"
                        }`}
                      >
                        {order.status.charAt(0).toUpperCase() +
                          order.status.slice(1)}
                      </span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-[#f97316] transition-colors shrink-0" />
                  </Link>
                ))
              )}
            </div>
          </div>
        )}

        {/* QUICK LINKS */}
        <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { href: "/shop", icon: ShoppingBag, label: "Shop" },
            { href: "/cart", icon: Package, label: "My Cart" },
            { href: "/orders", icon: Truck, label: "Track Orders" },
            { href: "/", icon: Globe, label: "Home" },
          ].map((link) => {
            const Icon = link.icon;
            return (
              <Link
                key={link.href}
                href={link.href}
                className="flex flex-col items-center gap-2 p-4 bg-white rounded-2xl border border-gray-100 shadow-sm hover:border-[#f97316] hover:bg-orange-50 hover:shadow-md transition-all group"
              >
                <div className="w-10 h-10 bg-orange-50 group-hover:bg-orange-100 rounded-xl flex items-center justify-center transition-colors">
                  <Icon className="w-5 h-5 text-[#f97316]" />
                </div>
                <span className="text-xs font-semibold text-gray-600 group-hover:text-[#f97316] transition-colors">
                  {link.label}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}

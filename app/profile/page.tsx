"use client";

import { useState, useEffect } from "react";
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
} from "lucide-react";

function OrdersSection({ user }: { user: any }) {
  const { getUserOrders } = useOrder();
  const orders = user ? getUserOrders(user.id) : [];
  const recentOrders = orders.slice(0, 3);

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-gray-900">Recent Orders</h3>
        {orders.length > 0 && (
          <Link href="/orders" className="text-[#f97316] hover:text-[#ea580c] font-semibold text-sm">
            View All →
          </Link>
        )}
      </div>

      {recentOrders.length === 0 ? (
        <p className="text-gray-500 text-center py-8">No orders yet. Start shopping!</p>
      ) : (
        <div className="space-y-3">
          {recentOrders.map((order: any) => (
            <Link
              key={order.id}
              href="/orders"
              className="flex items-center justify-between p-3 bg-gray-50 hover:bg-orange-50 rounded-lg border border-gray-100 hover:border-[#f97316] transition-all"
            >
              <div>
                <p className="font-semibold text-gray-900 text-sm">{order.id}</p>
                <p className="text-xs text-gray-500 mt-0.5">
                  {new Date(order.createdAt).toLocaleDateString()}
                </p>
              </div>
              <div className="text-right">
                <p className="font-bold text-[#f97316]">${order.total.toFixed(2)}</p>
                <p className={`text-xs font-semibold mt-0.5 ${
                  order.status === "delivered"
                    ? "text-emerald-600"
                    : order.status === "cancelled"
                    ? "text-red-600"
                    : "text-blue-600"
                }`}>
                  {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

export default function ProfilePage() {
  const router = useRouter();
  const { user, isLoggedIn, logout, updateProfile, addAddress, updateAddress, deleteAddress, setDefaultAddress } = useAuth();
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [isAddingAddress, setIsAddingAddress] = useState(false);
  const [editingAddressId, setEditingAddressId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const [profileForm, setProfileForm] = useState({
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    phone: user?.phone || "",
  });

  const [addressForm, setAddressForm] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zip: "",
    country: "India",
    isDefault: false,
  });

  useEffect(() => {
    if (!isLoggedIn) {
      router.push("/login");
    }
  }, [isLoggedIn, router]);

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader className="w-8 h-8 text-[#f97316] animate-spin" />
      </div>
    );
  }

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await updateProfile(profileForm);
      setIsEditingProfile(false);
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
      setAddressForm({
        firstName: "",
        lastName: "",
        phone: "",
        address: "",
        city: "",
        state: "",
        zip: "",
        country: "India",
        isDefault: false,
      });
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
      const currentAddress = user.addresses.find((a) => a.id === id);
      if (currentAddress) {
        await updateAddress(id, addressForm);
        setEditingAddressId(null);
        setAddressForm({
          firstName: "",
          lastName: "",
          phone: "",
          address: "",
          city: "",
          state: "",
          zip: "",
          country: "India",
          isDefault: false,
        });
      }
    } catch (err) {
      console.error("Failed to update address", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteAddress = async (id: string) => {
    if (confirm("Are you sure you want to delete this address?")) {
      try {
        await deleteAddress(id);
      } catch (err) {
        console.error("Failed to delete address", err);
      }
    }
  };

  const handleSetDefault = async (id: string) => {
    try {
      await setDefaultAddress(id);
    } catch (err) {
      console.error("Failed to set default address", err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-extrabold text-[#1a3a6b]">My Account</h1>
            <p className="text-gray-600 mt-1">Manage your profile and addresses</p>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 bg-red-50 hover:bg-red-100 text-red-600 font-semibold px-5 py-2.5 rounded-xl transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Section */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              {/* Profile Avatar */}
              <div className="flex flex-col items-center mb-6">
                <div className="w-20 h-20 bg-gradient-to-br from-[#1a3a6b] to-[#f97316] rounded-full flex items-center justify-center mb-4">
                  <User className="w-10 h-10 text-white" />
                </div>
                <h2 className="text-xl font-bold text-gray-900">
                  {user.firstName} {user.lastName}
                </h2>
                <p className="text-sm text-gray-500 mt-1">{user.email}</p>
              </div>

              {/* Profile Info */}
              <div className="space-y-3 border-t border-gray-100 pt-6">
                <div className="flex items-center gap-3">
                  <Mail className="w-4 h-4 text-[#f97316]" />
                  <div>
                    <p className="text-xs text-gray-500">Email</p>
                    <p className="text-sm font-medium text-gray-900">{user.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="w-4 h-4 text-[#f97316]" />
                  <div>
                    <p className="text-xs text-gray-500">Phone</p>
                    <p className="text-sm font-medium text-gray-900">{user.phone || "Not set"}</p>
                  </div>
                </div>
              </div>

              {/* Edit Button */}
              <button
                onClick={() => setIsEditingProfile(!isEditingProfile)}
                className="w-full mt-6 flex items-center justify-center gap-2 bg-[#f97316] hover:bg-[#ea580c] text-white font-semibold py-2.5 rounded-xl transition-colors"
              >
                <Edit2 className="w-4 h-4" />
                Edit Profile
              </button>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Edit Profile Form */}
            {isEditingProfile && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Edit Profile</h3>
                <form onSubmit={handleUpdateProfile} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        First Name
                      </label>
                      <input
                        type="text"
                        value={profileForm.firstName}
                        onChange={(e) =>
                          setProfileForm({ ...profileForm, firstName: e.target.value })
                        }
                        className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:border-[#f97316] focus:ring-2 focus:ring-[#f97316]/20"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Last Name
                      </label>
                      <input
                        type="text"
                        value={profileForm.lastName}
                        onChange={(e) =>
                          setProfileForm({ ...profileForm, lastName: e.target.value })
                        }
                        className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:border-[#f97316] focus:ring-2 focus:ring-[#f97316]/20"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      value={profileForm.phone}
                      onChange={(e) =>
                        setProfileForm({ ...profileForm, phone: e.target.value })
                      }
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:border-[#f97316] focus:ring-2 focus:ring-[#f97316]/20"
                    />
                  </div>
                  <div className="flex gap-3 pt-2">
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="flex-1 bg-[#f97316] hover:bg-[#ea580c] disabled:bg-gray-300 text-white font-semibold py-2.5 rounded-xl transition-colors flex items-center justify-center gap-2"
                    >
                      {isLoading ? (
                        <>
                          <Loader className="w-4 h-4 animate-spin" />
                          Saving...
                        </>
                      ) : (
                        <>
                          <Check className="w-4 h-4" />
                          Save Changes
                        </>
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsEditingProfile(false)}
                      className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-2.5 rounded-xl transition-colors flex items-center justify-center gap-2"
                    >
                      <X className="w-4 h-4" />
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Addresses Section */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-gray-900">Saved Addresses</h3>
                {!isAddingAddress && (
                  <button
                    onClick={() => setIsAddingAddress(true)}
                    className="flex items-center gap-2 bg-[#f97316] hover:bg-[#ea580c] text-white font-semibold px-4 py-2 rounded-xl transition-colors text-sm"
                  >
                    <Plus className="w-4 h-4" />
                    Add Address
                  </button>
                )}
              </div>

              {/* Add Address Form */}
              {isAddingAddress && (
                <form onSubmit={handleAddAddress} className="mb-6 p-4 bg-gray-50 rounded-xl border border-gray-200 space-y-4">
                  <h4 className="font-semibold text-gray-900 mb-4">New Address</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <input
                      type="text"
                      placeholder="First Name"
                      value={addressForm.firstName}
                      onChange={(e) =>
                        setAddressForm({ ...addressForm, firstName: e.target.value })
                      }
                      required
                      className="px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#f97316]"
                    />
                    <input
                      type="text"
                      placeholder="Last Name"
                      value={addressForm.lastName}
                      onChange={(e) =>
                        setAddressForm({ ...addressForm, lastName: e.target.value })
                      }
                      required
                      className="px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#f97316]"
                    />
                  </div>
                  <input
                    type="tel"
                    placeholder="Phone Number"
                    value={addressForm.phone}
                    onChange={(e) =>
                      setAddressForm({ ...addressForm, phone: e.target.value })
                    }
                    required
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#f97316]"
                  />
                  <input
                    type="text"
                    placeholder="Street Address"
                    value={addressForm.address}
                    onChange={(e) =>
                      setAddressForm({ ...addressForm, address: e.target.value })
                    }
                    required
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#f97316]"
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <input
                      type="text"
                      placeholder="City"
                      value={addressForm.city}
                      onChange={(e) =>
                        setAddressForm({ ...addressForm, city: e.target.value })
                      }
                      required
                      className="px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#f97316]"
                    />
                    <input
                      type="text"
                      placeholder="State"
                      value={addressForm.state}
                      onChange={(e) =>
                        setAddressForm({ ...addressForm, state: e.target.value })
                      }
                      required
                      className="px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#f97316]"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <input
                      type="text"
                      placeholder="ZIP Code"
                      value={addressForm.zip}
                      onChange={(e) =>
                        setAddressForm({ ...addressForm, zip: e.target.value })
                      }
                      required
                      className="px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#f97316]"
                    />
                    <select
                      value={addressForm.country}
                      onChange={(e) =>
                        setAddressForm({ ...addressForm, country: e.target.value })
                      }
                      className="px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#f97316]"
                    >
                      <option>India</option>
                      <option>Nepal</option>
                      <option>Bangladesh</option>
                    </select>
                  </div>
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={addressForm.isDefault}
                      onChange={(e) =>
                        setAddressForm({ ...addressForm, isDefault: e.target.checked })
                      }
                      className="w-4 h-4 rounded border-gray-300 text-[#f97316]"
                    />
                    <span className="text-sm font-medium text-gray-700">Set as default address</span>
                  </label>
                  <div className="flex gap-3">
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="flex-1 bg-[#f97316] hover:bg-[#ea580c] disabled:bg-gray-300 text-white font-semibold py-2 rounded-lg transition-colors"
                    >
                      {isLoading ? "Adding..." : "Add Address"}
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsAddingAddress(false)}
                      className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold py-2 rounded-lg transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              )}

              {/* Address List */}
              {user.addresses.length === 0 ? (
                <p className="text-gray-500 text-center py-8">No addresses saved yet. Add one to get started!</p>
              ) : (
                <div className="space-y-4">
                  {user.addresses.map((address) => (
                    <div
                      key={address.id}
                      className={`p-4 rounded-xl border-2 transition-all ${
                        address.isDefault
                          ? "border-[#f97316] bg-orange-50"
                          : "border-gray-200 bg-gray-50 hover:border-gray-300"
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h4 className="font-semibold text-gray-900">
                              {address.firstName} {address.lastName}
                            </h4>
                            {address.isDefault && (
                              <span className="bg-[#f97316] text-white text-xs font-bold px-2 py-1 rounded-full">
                                Default
                              </span>
                            )}
                          </div>
                          <div className="space-y-1 text-sm text-gray-600">
                            <p className="flex items-center gap-2">
                              <MapPin className="w-4 h-4 text-[#f97316]" />
                              {address.address}, {address.city}, {address.state} {address.zip}
                            </p>
                            <p className="flex items-center gap-2">
                              <Phone className="w-4 h-4 text-[#f97316]" />
                              {address.phone}
                            </p>
                          </div>
                        </div>
                        <div className="flex gap-2 ml-4">
                          <button
                            onClick={() => {
                              setEditingAddressId(address.id);
                              setAddressForm(address);
                            }}
                            className="p-2 text-[#f97316] hover:bg-orange-100 rounded-lg transition-colors"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteAddress(address.id)}
                            className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                      {!address.isDefault && (
                        <button
                          onClick={() => handleSetDefault(address.id)}
                          className="mt-3 text-sm text-[#f97316] hover:text-[#ea580c] font-medium"
                        >
                          Set as default
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Orders Section */}
            <OrdersSection user={user} />

            {/* Quick Links */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Quick Links</h3>
              <div className="grid grid-cols-2 gap-3">
                <Link
                  href="/shop"
                  className="p-4 bg-gray-50 hover:bg-[#f97316]/10 border border-gray-200 hover:border-[#f97316] rounded-xl text-center font-medium text-gray-900 hover:text-[#f97316] transition-all"
                >
                  Continue Shopping
                </Link>
                <Link
                  href="/cart"
                  className="p-4 bg-gray-50 hover:bg-[#f97316]/10 border border-gray-200 hover:border-[#f97316] rounded-xl text-center font-medium text-gray-900 hover:text-[#f97316] transition-all"
                >
                  View Cart
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

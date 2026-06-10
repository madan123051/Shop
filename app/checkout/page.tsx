"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { useOrder } from "@/context/OrderContext";
import { CheckCircle, CreditCard, MapPin, User, ArrowLeft, Loader } from "lucide-react";

type Step = "info" | "shipping" | "payment" | "success";

export default function CheckoutPage() {
  const router = useRouter();
  const { cart, totalPrice, clearCart } = useCart();
  const { user } = useAuth();
  const { createOrder } = useOrder();
  const [step, setStep] = useState<Step>("info");
  const [orderId, setOrderId] = useState<string>("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [form, setForm] = useState({
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    email: user?.email || "",
    phone: user?.phone || "",
    address: "",
    city: "",
    state: "",
    zip: "",
    country: "India",
    cardName: "",
    cardNumber: "",
    expiry: "",
    cvv: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const shipping = totalPrice >= 50 ? 0 : 5.99;
  const tax = totalPrice * 0.08;
  const grandTotal = totalPrice + shipping + tax;

  const handlePlaceOrder = async () => {
    setIsProcessing(true);
    try {
      const newOrder = await createOrder({
        userId: user?.id || `guest-${Date.now()}`,
        items: cart,
        subtotal: totalPrice,
        shipping,
        tax,
        total: grandTotal,
        status: "confirmed",
        shippingAddress: {
          firstName: form.firstName,
          lastName: form.lastName,
          address: form.address,
          city: form.city,
          state: form.state,
          zip: form.zip,
          country: form.country,
          phone: form.phone,
        },
        email: form.email,
      });
      setOrderId(newOrder.id);
      clearCart();
      setStep("success");
    } catch (err) {
      console.error("Failed to create order", err);
      alert("Failed to place order. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  if (cart.length === 0 && step !== "success") {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
        <div className="text-5xl mb-4">🛒</div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Your cart is empty</h2>
        <Link
          href="/shop"
          className="mt-4 inline-flex items-center gap-2 bg-[#f97316] text-white px-6 py-3 rounded-xl font-semibold hover:bg-[#ea580c] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Go Shopping
        </Link>
      </div>
    );
  }

  if (step === "success") {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4">
        <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mb-6">
          <CheckCircle className="w-10 h-10 text-emerald-500" />
        </div>
        <h2 className="text-3xl font-extrabold text-gray-900 mb-3">Order Placed! 🎉</h2>
        <p className="text-gray-600 mb-2">
          Thank you for your order. Confirmation sent to <strong>{form.email}</strong>
        </p>
        <p className="text-sm text-gray-500 mb-8">
          Order ID: <strong className="text-[#1a3a6b]">{orderId}</strong>
        </p>
        <div className="flex gap-3 flex-wrap justify-center">
          {user && (
            <Link
              href="/profile"
              className="bg-[#f97316] text-white font-semibold px-6 py-3 rounded-xl hover:bg-[#ea580c] transition-colors"
            >
              View Orders
            </Link>
          )}
          <Link href="/" className="bg-[#1a3a6b] text-white font-semibold px-6 py-3 rounded-xl hover:bg-[#152f58] transition-colors">
            Back to Home
          </Link>
          <Link
            href="/shop"
            className="border-2 border-[#f97316] text-[#f97316] font-semibold px-6 py-3 rounded-xl hover:bg-orange-50 transition-colors"
          >
            Shop More
          </Link>
        </div>
      </div>
    );
  }

  const steps: { key: Step; label: string; icon: React.ElementType }[] = [
    { key: "info", label: "Info", icon: User },
    { key: "shipping", label: "Shipping", icon: MapPin },
    { key: "payment", label: "Payment", icon: CreditCard },
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <Link href="/cart" className="inline-flex items-center gap-1 text-sm text-[#f97316] hover:text-[#ea580c] mb-8 font-medium">
        <ArrowLeft className="w-4 h-4" /> Back to Cart
      </Link>

      <h1 className="text-3xl font-bold text-[#1a3a6b] mb-8">Checkout</h1>

      {/* Steps */}
      <div className="flex items-center gap-2 mb-10 overflow-x-auto pb-2">
        {steps.map((s, i) => {
          const Icon = s.icon;
          const isActive = s.key === step;
          const isDone = steps.findIndex((x) => x.key === step) > i;
          return (
            <div key={s.key} className="flex items-center gap-2 shrink-0">
              <div
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  isActive
                    ? "bg-[#f97316] text-white"
                    : isDone
                    ? "bg-emerald-100 text-emerald-700"
                    : "bg-gray-100 text-gray-400"
                }`}
              >
                <Icon className="w-4 h-4" />
                {s.label}
              </div>
              {i < steps.length - 1 && <div className={`h-0.5 w-8 ${isDone ? "bg-emerald-300" : "bg-gray-200"}`} />}
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Form */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          {step === "info" && (
            <div>
              <h2 className="text-lg font-bold text-[#1a3a6b] mb-5">Personal Information</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { name: "firstName", label: "First Name", type: "text", placeholder: "John" },
                  { name: "lastName", label: "Last Name", type: "text", placeholder: "Doe" },
                  { name: "email", label: "Email Address", type: "email", placeholder: "john@example.com" },
                  { name: "phone", label: "Phone Number", type: "tel", placeholder: "+91 98XXXXXXXX" },
                ].map((field) => (
                  <div key={field.name}>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">{field.label}</label>
                    <input
                      type={field.type}
                      name={field.name}
                      value={form[field.name as keyof typeof form]}
                      onChange={handleChange}
                      placeholder={field.placeholder}
                      required
                      className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#f97316] focus:border-transparent"
                    />
                  </div>
                ))}
              </div>
              <button
                onClick={() => setStep("shipping")}
                className="mt-6 w-full bg-[#f97316] hover:bg-[#ea580c] text-white font-bold py-3.5 rounded-2xl transition-colors"
              >
                Continue to Shipping
              </button>
            </div>
          )}

          {step === "shipping" && (
            <div>
              <h2 className="text-lg font-bold text-[#1a3a6b] mb-5">Shipping Address</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Street Address</label>
                  <input
                    type="text"
                    name="address"
                    value={form.address}
                    onChange={handleChange}
                    placeholder="123 Main Street"
                    required
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#f97316]"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">City</label>
                    <input
                      type="text"
                      name="city"
                      value={form.city}
                      onChange={handleChange}
                      placeholder="Delhi"
                      required
                      className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#f97316]"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">State</label>
                    <input
                      type="text"
                      name="state"
                      value={form.state}
                      onChange={handleChange}
                      placeholder="Delhi"
                      required
                      className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#f97316]"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">ZIP Code</label>
                    <input
                      type="text"
                      name="zip"
                      value={form.zip}
                      onChange={handleChange}
                      placeholder="110001"
                      required
                      className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#f97316]"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Country</label>
                    <select
                      name="country"
                      value={form.country}
                      onChange={handleChange}
                      className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#f97316]"
                    >
                      <option>India</option>
                      <option>Nepal</option>
                      <option>Bangladesh</option>
                    </select>
                  </div>
                </div>
              </div>
              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setStep("info")}
                  className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold py-3.5 rounded-2xl transition-colors"
                >
                  Back
                </button>
                <button
                  onClick={() => setStep("payment")}
                  className="flex-1 bg-[#f97316] hover:bg-[#ea580c] text-white font-bold py-3.5 rounded-2xl transition-colors"
                >
                  Continue to Payment
                </button>
              </div>
            </div>
          )}

          {step === "payment" && (
            <div>
              <h2 className="text-lg font-bold text-[#1a3a6b] mb-5">Payment Details</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Cardholder Name</label>
                  <input
                    type="text"
                    name="cardName"
                    value={form.cardName}
                    onChange={handleChange}
                    placeholder="John Doe"
                    required
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#f97316]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Card Number</label>
                  <input
                    type="text"
                    name="cardNumber"
                    value={form.cardNumber}
                    onChange={handleChange}
                    placeholder="1234 5678 9012 3456"
                    maxLength={19}
                    required
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#f97316]"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Expiry Date</label>
                    <input
                      type="text"
                      name="expiry"
                      value={form.expiry}
                      onChange={handleChange}
                      placeholder="MM/YY"
                      maxLength={5}
                      required
                      className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#f97316]"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">CVV</label>
                    <input
                      type="text"
                      name="cvv"
                      value={form.cvv}
                      onChange={handleChange}
                      placeholder="123"
                      maxLength={3}
                      required
                      className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#f97316]"
                    />
                  </div>
                </div>
              </div>
              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setStep("shipping")}
                  className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold py-3.5 rounded-2xl transition-colors"
                >
                  Back
                </button>
                <button
                  onClick={handlePlaceOrder}
                  disabled={isProcessing}
                  className="flex-1 bg-[#f97316] hover:bg-[#ea580c] disabled:bg-gray-300 text-white font-bold py-3.5 rounded-2xl transition-colors flex items-center justify-center gap-2"
                >
                  {isProcessing ? (
                    <>
                      <Loader className="w-4 h-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    "Place Order"
                  )}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 sticky top-24">
            <h2 className="text-lg font-bold text-gray-900 mb-5">Order Summary</h2>
            <div className="space-y-3 text-sm mb-5 max-h-64 overflow-y-auto">
              {cart.map((item) => (
                <div key={item.id} className="flex justify-between items-center pb-3 border-b border-gray-100">
                  <div>
                    <p className="font-medium text-gray-800">{item.name}</p>
                    <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                  </div>
                  <span className="font-semibold text-gray-900">₹{(item.price * item.quantity).toLocaleString('en-IN')}</span>
                </div>
              ))}
            </div>

            <div className="space-y-3 text-sm border-t border-gray-100 pt-4">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span className="font-medium text-gray-800">₹{totalPrice.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Shipping</span>
                <span className={`font-medium ${shipping === 0 ? "text-emerald-600" : "text-gray-800"}`}>
                  {shipping === 0 ? "FREE" : `₹${shipping.toLocaleString('en-IN')}`}
                </span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Tax (8%)</span>
                <span className="font-medium text-gray-800">₹{tax.toLocaleString('en-IN')}</span>
              </div>
              <div className="border-t border-gray-100 pt-3 flex justify-between text-base font-bold text-gray-900">
                <span>Total</span>
                <span className="text-[#f97316]">₹{grandTotal.toLocaleString('en-IN')}</span>
              </div>
            </div>

            {shipping > 0 && (
              <p className="text-xs text-amber-600 bg-amber-50 rounded-xl px-3 py-2 mt-4">
                Add ₹${(50 - totalPrice).toLocaleString('en-IN')} more for FREE shipping!
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

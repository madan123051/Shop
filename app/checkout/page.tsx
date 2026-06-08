"use client";

import { useState } from "react";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { CheckCircle, CreditCard, MapPin, User, ArrowLeft } from "lucide-react";

type Step = "info" | "shipping" | "payment" | "success";

export default function CheckoutPage() {
  const { cart, totalPrice, clearCart } = useCart();
  const [step, setStep] = useState<Step>("info");
  const [form, setForm] = useState({
    firstName: "", lastName: "", email: "", phone: "",
    address: "", city: "", state: "", zip: "", country: "Nepal",
    cardName: "", cardNumber: "", expiry: "", cvv: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const shipping = totalPrice >= 50 ? 0 : 5.99;
  const tax = totalPrice * 0.08;
  const grandTotal = totalPrice + shipping + tax;

  if (cart.length === 0 && step !== "success") {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
        <div className="text-5xl mb-4">🛒</div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Your cart is empty</h2>
        <Link href="/shop" className="mt-4 inline-flex items-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-indigo-700 transition-colors">
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
        <p className="text-gray-500 mb-8 max-w-sm">
          Thank you for your order. You'll receive a confirmation email at <strong>{form.email}</strong> shortly.
        </p>
        <div className="flex gap-3">
          <Link href="/" className="bg-indigo-600 text-white font-semibold px-6 py-3 rounded-xl hover:bg-indigo-700 transition-colors">
            Back to Home
          </Link>
          <Link href="/shop" className="border-2 border-indigo-600 text-indigo-600 font-semibold px-6 py-3 rounded-xl hover:bg-indigo-50 transition-colors">
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
      <Link href="/cart" className="inline-flex items-center gap-1 text-sm text-indigo-600 hover:text-indigo-700 mb-8 font-medium">
        <ArrowLeft className="w-4 h-4" /> Back to Cart
      </Link>

      <h1 className="text-3xl font-bold text-gray-900 mb-8">Checkout</h1>

      {/* Steps */}
      <div className="flex items-center gap-2 mb-10">
        {steps.map((s, i) => {
          const Icon = s.icon;
          const isActive = s.key === step;
          const isDone = steps.findIndex((x) => x.key === step) > i;
          return (
            <div key={s.key} className="flex items-center gap-2">
              <div className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                isActive ? "bg-indigo-600 text-white" :
                isDone ? "bg-emerald-100 text-emerald-700" :
                "bg-gray-100 text-gray-400"
              }`}>
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
              <h2 className="text-lg font-bold text-gray-800 mb-5">Personal Information</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { name: "firstName", label: "First Name", type: "text", placeholder: "John" },
                  { name: "lastName", label: "Last Name", type: "text", placeholder: "Doe" },
                  { name: "email", label: "Email Address", type: "email", placeholder: "john@example.com" },
                  { name: "phone", label: "Phone Number", type: "tel", placeholder: "+977 98XXXXXXXX" },
                ].map((field) => (
                  <div key={field.name}>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">{field.label}</label>
                    <input
                      type={field.type}
                      name={field.name}
                      value={form[field.name as keyof typeof form]}
                      onChange={handleChange}
                      placeholder={field.placeholder}
                      className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    />
                  </div>
                ))}
              </div>
              <button
                onClick={() => setStep("shipping")}
                className="mt-6 w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3.5 rounded-2xl transition-colors"
              >
                Continue to Shipping
              </button>
            </div>
          )}

          {step === "shipping" && (
            <div>
              <h2 className="text-lg font-bold text-gray-800 mb-5">Shipping Address</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Street Address</label>
                  <input
                    type="text" name="address" value={form.address} onChange={handleChange}
                    placeholder="123 Main Street"
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { name: "city", label: "City", placeholder: "Kathmandu" },
                    { name: "state", label: "State / Province", placeholder: "Bagmati" },
                    { name: "zip", label: "ZIP / Postal Code", placeholder: "44600" },
                  ].map((f) => (
                    <div key={f.name}>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">{f.label}</label>
                      <input
                        type="text" name={f.name} value={form[f.name as keyof typeof form]} onChange={handleChange}
                        placeholder={f.placeholder}
                        className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                  ))}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Country</label>
                    <select
                      name="country" value={form.country} onChange={handleChange}
                      className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                      {["Nepal", "India", "United States", "United Kingdom", "Australia", "Canada"].map((c) => (
                        <option key={c}>{c}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
              <div className="flex gap-3 mt-6">
                <button onClick={() => setStep("info")} className="flex-1 border-2 border-gray-200 text-gray-600 font-semibold py-3.5 rounded-2xl hover:bg-gray-50 transition-colors">
                  Back
                </button>
                <button onClick={() => setStep("payment")} className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3.5 rounded-2xl transition-colors">
                  Continue to Payment
                </button>
              </div>
            </div>
          )}

          {step === "payment" && (
            <div>
              <h2 className="text-lg font-bold text-gray-800 mb-5">Payment Details</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Name on Card</label>
                  <input
                    type="text" name="cardName" value={form.cardName} onChange={handleChange}
                    placeholder="John Doe"
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Card Number</label>
                  <input
                    type="text" name="cardNumber" value={form.cardNumber} onChange={handleChange}
                    placeholder="1234 5678 9012 3456" maxLength={19}
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Expiry Date</label>
                    <input
                      type="text" name="expiry" value={form.expiry} onChange={handleChange}
                      placeholder="MM / YY" maxLength={7}
                      className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">CVV</label>
                    <input
                      type="text" name="cvv" value={form.cvv} onChange={handleChange}
                      placeholder="123" maxLength={4}
                      className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                </div>
              </div>
              <div className="flex gap-3 mt-6">
                <button onClick={() => setStep("shipping")} className="flex-1 border-2 border-gray-200 text-gray-600 font-semibold py-3.5 rounded-2xl hover:bg-gray-50 transition-colors">
                  Back
                </button>
                <button
                  onClick={() => { clearCart(); setStep("success"); }}
                  className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3.5 rounded-2xl transition-colors"
                >
                  Place Order — ${grandTotal.toFixed(2)}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Summary */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 h-fit sticky top-24">
          <h3 className="font-bold text-gray-900 mb-4">Order Summary</h3>
          <div className="space-y-2 mb-4 max-h-48 overflow-y-auto">
            {cart.map((item) => (
              <div key={item.id} className="flex justify-between text-sm text-gray-600">
                <span className="truncate flex-1 mr-2">{item.name} ×{item.quantity}</span>
                <span className="font-medium text-gray-800 shrink-0">${(item.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
          </div>
          <div className="border-t border-gray-100 pt-3 space-y-1.5 text-sm">
            <div className="flex justify-between text-gray-500">
              <span>Subtotal</span><span>${totalPrice.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-gray-500">
              <span>Shipping</span>
              <span className={shipping === 0 ? "text-emerald-600" : ""}>{shipping === 0 ? "FREE" : `$${shipping.toFixed(2)}`}</span>
            </div>
            <div className="flex justify-between text-gray-500">
              <span>Tax</span><span>${tax.toFixed(2)}</span>
            </div>
            <div className="flex justify-between font-bold text-gray-900 text-base pt-1 border-t border-gray-100">
              <span>Total</span><span>${grandTotal.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

import Link from "next/link";
import { ArrowLeft, CheckCircle, AlertCircle } from "lucide-react";

export const metadata = {
  title: "Terms & Conditions | NewTech Home Solutions",
  description: "Terms and conditions for NewTech Shop services in Delhi NCR",
};

export default function TermsAndConditions() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <div className="bg-[#0f2245] text-white py-8 md:py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link href="/" className="inline-flex items-center gap-2 text-[#f97316] hover:text-white transition-colors mb-4">
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>
          <h1 className="text-3xl md:text-4xl font-bold mt-4">Terms & Conditions</h1>
          <p className="text-gray-300 mt-2">Effective from June 2026 | NewTech Home Solutions</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="bg-white rounded-lg shadow-lg p-8 md:p-12 space-y-10">
          {/* Introduction */}
          <section className="border-b pb-8">
            <h2 className="text-2xl font-bold text-[#0f2245] mb-4">Welcome to NewTech Home Solutions</h2>
            <p className="text-gray-700 leading-relaxed">
              NewTech Home Solutions ("we," "us," "our," or "Company") provides premium home protection and interior solutions across Delhi NCR. By accessing, browsing, or purchasing from our website, you agree to be bound by these Terms and Conditions. Please read them carefully before making any purchase.
            </p>
          </section>

          {/* Section 1: Pricing Information */}
          <section className="border-b pb-8">
            <div className="flex items-center gap-3 mb-4">
              <CheckCircle className="w-6 h-6 text-[#f97316]" />
              <h2 className="text-2xl font-bold text-[#0f2245]">1. Pricing Policy</h2>
            </div>
            <div className="bg-blue-50 border-l-4 border-[#f97316] p-4 rounded mb-4">
              <p className="text-gray-800 font-semibold">All prices displayed on our website are store prices.</p>
            </div>
            <ul className="space-y-3 text-gray-700">
              <li className="flex gap-3">
                <span className="text-[#f97316] font-bold mt-1">•</span>
                <span>Prices are subject to change without prior notice</span>
              </li>
              <li className="flex gap-3">
                <span className="text-[#f97316] font-bold mt-1">•</span>
                <span>Final pricing will be confirmed at checkout before payment</span>
              </li>
              <li className="flex gap-3">
                <span className="text-[#f97316] font-bold mt-1">•</span>
                <span>Our store maintains the right to correct any pricing errors</span>
              </li>
            </ul>
          </section>

          {/* Section 2: Delivery Charges */}
          <section className="border-b pb-8">
            <div className="flex items-center gap-3 mb-4">
              <CheckCircle className="w-6 h-6 text-[#f97316]" />
              <h2 className="text-2xl font-bold text-[#0f2245]">2. Delivery & Shipping Charges</h2>
            </div>
            <div className="space-y-4">
              <div className="bg-orange-50 border-l-4 border-[#f97316] p-4 rounded">
                <p className="text-gray-800 font-semibold mb-2">⚠️ Delivery charges are additional and calculated separately.</p>
                <p className="text-sm text-gray-700">These are NOT included in the product price displayed on our website.</p>
              </div>
              <ul className="space-y-3 text-gray-700">
                <li className="flex gap-3">
                  <span className="text-[#f97316] font-bold mt-1">•</span>
                  <span><strong>Delivery charges vary based on:</strong> Location, distance, and product dimensions</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-[#f97316] font-bold mt-1">•</span>
                  <span>Exact delivery charges will be calculated and shown during checkout</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-[#f97316] font-bold mt-1">•</span>
                  <span>Customers will be notified of delivery charges before confirming the order</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-[#f97316] font-bold mt-1">•</span>
                  <span>Free delivery may apply for orders above a certain value (to be specified per promotion)</span>
                </li>
              </ul>
            </div>
          </section>

          {/* Section 3: Taxes & GST */}
          <section className="border-b pb-8">
            <div className="flex items-center gap-3 mb-4">
              <CheckCircle className="w-6 h-6 text-[#f97316]" />
              <h2 className="text-2xl font-bold text-[#0f2245]">3. Goods and Services Tax (GST)</h2>
            </div>
            <div className="space-y-4">
              <div className="bg-blue-50 border-l-4 border-[#f97316] p-4 rounded">
                <p className="text-gray-800 font-semibold">All products and services are subject to applicable GST/TAX as per Indian Government regulations.</p>
              </div>
              <ul className="space-y-3 text-gray-700">
                <li className="flex gap-3">
                  <span className="text-[#f97316] font-bold mt-1">•</span>
                  <span><strong>GST will be added</strong> to the product price and delivery charges</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-[#f97316] font-bold mt-1">•</span>
                  <span>Tax rates are applied as per Government of India guidelines</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-[#f97316] font-bold mt-1">•</span>
                  <span>Tax breakdown will be clearly shown in your invoice</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-[#f97316] font-bold mt-1">•</span>
                  <span>GST registration details available upon request</span>
                </li>
              </ul>
            </div>
          </section>

          {/* Section 4: Delivery Timeline */}
          <section className="border-b pb-8">
            <div className="flex items-center gap-3 mb-4">
              <CheckCircle className="w-6 h-6 text-[#f97316]" />
              <h2 className="text-2xl font-bold text-[#0f2245]">4. Delivery Timeline & Location-Based Variations</h2>
            </div>
            <div className="space-y-4">
              <div className="bg-orange-50 border-l-4 border-[#f97316] p-4 rounded">
                <p className="text-gray-800 font-semibold">Delivery time may vary based on your location within Delhi NCR and surrounding areas.</p>
              </div>
              <ul className="space-y-3 text-gray-700">
                <li className="flex gap-3">
                  <span className="text-[#f97316] font-bold mt-1">•</span>
                  <span><strong>Delhi (Central & South Delhi):</strong> 2-3 business days</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-[#f97316] font-bold mt-1">•</span>
                  <span><strong>Gurgaon, Noida & nearby areas:</strong> 3-5 business days</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-[#f97316] font-bold mt-1">•</span>
                  <span><strong>Greater Noida, Ghaziabad & far areas:</strong> 5-7 business days</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-[#f97316] font-bold mt-1">•</span>
                  <span>Delivery timeline excludes weekends and public holidays</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-[#f97316] font-bold mt-1">•</span>
                  <span>Estimated delivery date will be provided at checkout</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-[#f97316] font-bold mt-1">•</span>
                  <span>Weather conditions and unforeseen circumstances may affect delivery schedules</span>
                </li>
              </ul>
            </div>
          </section>

          {/* Section 5: Installation & Maintenance Charges */}
          <section className="border-b pb-8">
            <div className="flex items-center gap-3 mb-4">
              <CheckCircle className="w-6 h-6 text-[#f97316]" />
              <h2 className="text-2xl font-bold text-[#0f2245]">5. Installation & Maintenance Charges</h2>
            </div>
            <div className="space-y-4">
              <div className="bg-blue-50 border-l-4 border-[#f97316] p-4 rounded">
                <p className="text-gray-800 font-semibold mb-2">⚠️ Installation and maintenance charges are separate from product costs.</p>
                <p className="text-sm text-gray-700">These charges vary significantly based on location and service requirements.</p>
              </div>
              <ul className="space-y-3 text-gray-700">
                <li className="flex gap-3">
                  <span className="text-[#f97316] font-bold mt-1">•</span>
                  <span><strong>Installation charges vary based on:</strong></span>
                </li>
              </ul>
              <div className="ml-6 space-y-2 text-gray-700">
                <p>— Location of property (Delhi, Gurgaon, Noida, etc.)</p>
                <p>— Accessibility and complexity of installation</p>
                <p>— Type and quantity of products being installed</p>
                <p>— Travel distance from our service center</p>
              </div>
              <ul className="space-y-3 text-gray-700 mt-4">
                <li className="flex gap-3">
                  <span className="text-[#f97316] font-bold mt-1">•</span>
                  <span><strong>Maintenance & Annual Service Charges:</strong> Quoted separately based on product type and frequency of service</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-[#f97316] font-bold mt-1">•</span>
                  <span>A site visit may be required to calculate accurate installation charges</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-[#f97316] font-bold mt-1">•</span>
                  <span>Installation quotes will be provided before service commencement</span>
                </li>
              </ul>
            </div>
          </section>

          {/* Section 6: Order & Cancellation Policy */}
          <section className="border-b pb-8">
            <div className="flex items-center gap-3 mb-4">
              <CheckCircle className="w-6 h-6 text-[#f97316]" />
              <h2 className="text-2xl font-bold text-[#0f2245]">6. Order & Cancellation Policy</h2>
            </div>
            <ul className="space-y-3 text-gray-700">
              <li className="flex gap-3">
                <span className="text-[#f97316] font-bold mt-1">•</span>
                <span>Orders placed are binding and cannot be cancelled without prior approval</span>
              </li>
              <li className="flex gap-3">
                <span className="text-[#f97316] font-bold mt-1">•</span>
                <span>Cancellation requests must be made within 24 hours of order placement</span>
              </li>
              <li className="flex gap-3">
                <span className="text-[#f97316] font-bold mt-1">•</span>
                <span>Partial refunds may apply depending on order status and location-based charges</span>
              </li>
              <li className="flex gap-3">
                <span className="text-[#f97316] font-bold mt-1">•</span>
                <span>Contact our team for cancellation requests and details</span>
              </li>
            </ul>
          </section>

          {/* Section 7: Quality Assurance */}
          <section className="border-b pb-8">
            <div className="flex items-center gap-3 mb-4">
              <CheckCircle className="w-6 h-6 text-[#f97316]" />
              <h2 className="text-2xl font-bold text-[#0f2245]">7. Quality & Warranty</h2>
            </div>
            <ul className="space-y-3 text-gray-700">
              <li className="flex gap-3">
                <span className="text-[#f97316] font-bold mt-1">•</span>
                <span>All products are manufactured to premium quality standards</span>
              </li>
              <li className="flex gap-3">
                <span className="text-[#f97316] font-bold mt-1">•</span>
                <span>Warranty details will be provided with each product invoice</span>
              </li>
              <li className="flex gap-3">
                <span className="text-[#f97316] font-bold mt-1">•</span>
                <span>Defective products must be reported within 7 days of delivery</span>
              </li>
              <li className="flex gap-3">
                <span className="text-[#f97316] font-bold mt-1">•</span>
                <span>Warranty claims are subject to inspection and verification</span>
              </li>
            </ul>
          </section>

          {/* Section 8: Liability */}
          <section className="border-b pb-8">
            <div className="flex items-center gap-3 mb-4">
              <AlertCircle className="w-6 h-6 text-red-500" />
              <h2 className="text-2xl font-bold text-[#0f2245]">8. Limitation of Liability</h2>
            </div>
            <ul className="space-y-3 text-gray-700">
              <li className="flex gap-3">
                <span className="text-[#f97316] font-bold mt-1">•</span>
                <span>NewTech Shop is not responsible for indirect, incidental, or consequential damages</span>
              </li>
              <li className="flex gap-3">
                <span className="text-[#f97316] font-bold mt-1">•</span>
                <span>Our liability is limited to the value of the product purchased</span>
              </li>
              <li className="flex gap-3">
                <span className="text-[#f97316] font-bold mt-1">•</span>
                <span>Customers are responsible for proper installation and maintenance instructions provided</span>
              </li>
            </ul>
          </section>

          {/* Contact Section */}
          <section className="bg-gradient-to-r from-[#0f2245] to-[#1a3a6b] text-white rounded-lg p-8">
            <h2 className="text-2xl font-bold mb-6">📞 For More Information, Contact Our Team</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <p className="text-gray-300 text-sm mb-2">Email</p>
                <a href="mailto:info@newtechhomesolutions.in" className="text-[#f97316] hover:text-white transition-colors font-semibold">
                  info@newtechhomesolutions.in
                </a>
              </div>
              <div>
                <p className="text-gray-300 text-sm mb-2">Phone</p>
                <a href="tel:+911234567890" className="text-[#f97316] hover:text-white transition-colors font-semibold">
                  +91 12345 67890
                </a>
              </div>
            </div>
            <p className="text-gray-300 text-sm mt-6">
              <strong>Hours:</strong> Monday - Friday, 9:00 AM - 6:00 PM IST | Saturday, 10:00 AM - 5:00 PM IST
            </p>
          </section>

          {/* Final Section */}
          <section>
            <h2 className="text-xl font-bold text-[#0f2245] mb-4">Last Updated</h2>
            <p className="text-gray-700">
              These Terms and Conditions are effective from June 2026 and may be updated from time to time. Users will be notified of significant changes via email or through our website.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}

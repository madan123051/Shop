import Link from 'next/link';

export const metadata = {
  title: 'Privacy Policy | Shop',
  description: 'Privacy Policy - Learn how we protect your personal information',
};

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold mb-2">Privacy Policy</h1>
          <p className="text-blue-100">Your privacy is important to us. Learn how we protect your data.</p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-lg shadow-md p-8 space-y-8">
          {/* Last Updated */}
          <div className="bg-blue-50 border-l-4 border-blue-600 p-4">
            <p className="text-sm text-gray-600">
              <strong>Last Updated:</strong> {new Date().toLocaleDateString('en-IN')}
            </p>
          </div>

          {/* Introduction */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
              <span className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center mr-3">1</span>
              Introduction
            </h2>
            <p className="text-gray-700 leading-relaxed">
              Welcome to Shop ("Company", "we", "our", or "us"). We are committed to protecting your privacy and ensuring you have a positive experience on our website. This Privacy Policy explains how we collect, use, disclose, and safeguard your information in accordance with the Information Technology Act, 2000 and other applicable Indian laws.
            </p>
          </section>

          {/* Data Collection */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
              <span className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center mr-3">2</span>
              Information We Collect
            </h2>
            <div className="space-y-4">
              <div className="bg-gray-50 p-4 rounded-lg border-l-4 border-blue-400">
                <h3 className="font-semibold text-gray-900 mb-2">Personal Information</h3>
                <ul className="list-disc list-inside space-y-1 text-gray-700">
                  <li>Name, email address, phone number</li>
                  <li>Billing and delivery addresses</li>
                  <li>Payment information (processed securely)</li>
                  <li>Account credentials</li>
                  <li>Customer service inquiries</li>
                </ul>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg border-l-4 border-green-400">
                <h3 className="font-semibold text-gray-900 mb-2">Automatic Information</h3>
                <ul className="list-disc list-inside space-y-1 text-gray-700">
                  <li>IP address and device information</li>
                  <li>Browser type and operating system</li>
                  <li>Pages visited and time spent</li>
                  <li>Cookies and tracking technologies</li>
                  <li>Location data (with permission)</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Data Usage */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
              <span className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center mr-3">3</span>
              How We Use Your Information
            </h2>
            <ul className="space-y-3 text-gray-700">
              <li className="flex items-start">
                <span className="text-blue-600 mr-3 font-bold">•</span>
                <span><strong>Order Processing:</strong> To process purchases, deliveries, and installations</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-600 mr-3 font-bold">•</span>
                <span><strong>Communication:</strong> To send order updates, delivery notifications, and customer support</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-600 mr-3 font-bold">•</span>
                <span><strong>Service Improvement:</strong> To enhance website functionality and user experience</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-600 mr-3 font-bold">•</span>
                <span><strong>Marketing:</strong> To send promotional offers (only with your consent)</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-600 mr-3 font-bold">•</span>
                <span><strong>Legal Compliance:</strong> To comply with Indian laws and regulations (GST, Income Tax, etc.)</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-600 mr-3 font-bold">•</span>
                <span><strong>Fraud Prevention:</strong> To detect and prevent fraudulent activities</span>
              </li>
            </ul>
          </section>

          {/* Data Sharing */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
              <span className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center mr-3">4</span>
              Data Sharing & Third Parties
            </h2>
            <p className="text-gray-700 mb-4">
              We may share your information with:
            </p>
            <ul className="space-y-2 text-gray-700 ml-4">
              <li><strong>Delivery Partners:</strong> Address and contact details for delivery</li>
              <li><strong>Installation Technicians:</strong> Necessary details for installation & maintenance services</li>
              <li><strong>Payment Gateways:</strong> Encrypted payment information (never stored by us)</li>
              <li><strong>Government Agencies:</strong> When required by law (GST, Income Tax authorities)</li>
              <li><strong>Analytics Providers:</strong> Aggregated, anonymized data only</li>
            </ul>
            <p className="text-gray-700 mt-4">
              <strong>We do NOT sell or rent your personal information to third parties for marketing purposes.</strong>
            </p>
          </section>

          {/* Data Security */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
              <span className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center mr-3">5</span>
              Data Security
            </h2>
            <div className="bg-green-50 border-l-4 border-green-600 p-4 mb-4">
              <p className="text-gray-700">
                We implement industry-standard security measures including:
              </p>
              <ul className="list-disc list-inside mt-2 space-y-1 text-gray-700">
                <li>SSL/TLS encryption for data transmission</li>
                <li>Secure payment gateway integration</li>
                <li>Regular security audits and updates</li>
                <li>Access controls and authentication protocols</li>
                <li>Compliance with Indian Information Technology Act, 2000</li>
              </ul>
            </div>
            <p className="text-gray-700 text-sm italic">
              <strong>Note:</strong> While we strive for security, no method is 100% secure. We are not liable for unauthorized access beyond our control.
            </p>
          </section>

          {/* Cookies */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
              <span className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center mr-3">6</span>
              Cookies & Tracking
            </h2>
            <p className="text-gray-700 mb-4">
              Our website uses cookies to:
            </p>
            <ul className="space-y-2 text-gray-700 ml-4">
              <li>Remember your login and preferences</li>
              <li>Track website usage and analytics</li>
              <li>Improve user experience and site performance</li>
              <li>Display personalized content</li>
            </ul>
            <p className="text-gray-700 mt-4">
              You can disable cookies in your browser settings, but some features may not work properly.
            </p>
          </section>

          {/* User Rights */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
              <span className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center mr-3">7</span>
              Your Rights
            </h2>
            <p className="text-gray-700 mb-4">Under Indian law, you have the right to:</p>
            <ul className="space-y-2 text-gray-700 ml-4">
              <li><strong>Access:</strong> Request a copy of your personal data</li>
              <li><strong>Correction:</strong> Update or correct inaccurate information</li>
              <li><strong>Deletion:</strong> Request deletion of your data (with exceptions for legal requirements)</li>
              <li><strong>Opt-out:</strong> Unsubscribe from marketing communications anytime</li>
              <li><strong>Withdraw Consent:</strong> Withdraw consent for data processing at any time</li>
            </ul>
            <p className="text-gray-700 mt-4">
              To exercise these rights, contact our team at the details provided below.
            </p>
          </section>

          {/* Retention */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
              <span className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center mr-3">8</span>
              Data Retention
            </h2>
            <p className="text-gray-700 mb-4">
              We retain your personal data for as long as necessary to provide services and comply with legal obligations:
            </p>
            <ul className="space-y-2 text-gray-700 ml-4">
              <li><strong>Order Data:</strong> 7 years (Income Tax Act compliance)</li>
              <li><strong>Account Data:</strong> Until account closure + 1 year</li>
              <li><strong>Support Records:</strong> 3 years</li>
              <li><strong>Analytics Data:</strong> Aggregated and anonymized</li>
            </ul>
          </section>

          {/* Minor's Data */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
              <span className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center mr-3">9</span>
              Information About Minors
            </h2>
            <p className="text-gray-700">
              Our service is not intended for individuals under 18 years of age. We do not knowingly collect information from minors. If we become aware that a minor has provided personal information, we will delete such information immediately.
            </p>
          </section>

          {/* Policy Updates */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
              <span className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center mr-3">10</span>
              Updates to This Policy
            </h2>
            <p className="text-gray-700">
              We may update this Privacy Policy to reflect changes in our practices, technology, or legal requirements. We will notify you of significant changes by email or prominent notice on our website. Your continued use of our website following changes constitutes your acceptance of the updated policy.
            </p>
          </section>

          {/* Contact Section */}
          <section className="bg-gradient-to-r from-blue-50 to-blue-100 p-6 rounded-lg border border-blue-200">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Questions? Contact Us</h2>
            <div className="space-y-3 text-gray-700">
              <p>
                <strong>Email:</strong>{' '}
                <a href="mailto:example@mail.com" className="text-blue-600 hover:underline">
                  example@mail.com
                </a>
              </p>
              <p>
                <strong>Phone:</strong>{' '}
                <a href="tel:+919999999999" className="text-blue-600 hover:underline">
                  +91 9999-999-999
                </a>
              </p>
              <p>
                <strong>Business Hours:</strong> Monday - Friday, 9:00 AM - 6:00 PM IST
              </p>
              <p className="text-sm text-gray-600 mt-4">
                Your privacy concerns matter to us. We will respond to all inquiries within 10 business days.
              </p>
            </div>
          </section>
        </div>

        {/* Back to Home */}
        <div className="mt-8 text-center">
          <Link
            href="/"
            className="inline-flex items-center text-blue-600 hover:text-blue-800 font-semibold"
          >
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
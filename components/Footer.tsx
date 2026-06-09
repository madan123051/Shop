import Link from "next/link";
import Image from "next/image";
import { Mail, Phone, MapPin, Instagram, Facebook, Youtube } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-[#0f2245] text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2">
              <div className="relative h-10 w-10">
                <Image
                  src="/bag-icon.png"
                  alt="NewTech Logo Icon"
                  fill
                  className="object-contain"
                />
              </div>
              <div className="leading-tight">
                <span className="text-lg font-extrabold text-white">NewTech </span>
                <span className="text-lg font-extrabold text-[#f97316]">Shop</span>
                <p className="text-[9px] font-semibold text-gray-500 uppercase tracking-widest">
                  Complete Protection
                </p>
              </div>
            </Link>
            <p className="text-sm leading-relaxed text-gray-400">
              Premium home protection & interior solutions across Delhi NCR. Invisible Grills, Blinds, Pleated Mesh, Honeycomb Partitions and more.
            </p>
            <div className="flex gap-3 pt-1">
              {[Facebook, Instagram, Youtube].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="w-9 h-9 rounded-full bg-[#1a3a6b] hover:bg-[#f97316] flex items-center justify-center transition-colors"
                >
                  <Icon className="w-4 h-4 text-white" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              {[
                { label: "Home", href: "/" },
                { label: "All Products", href: "/shop" },
                { label: "Cart", href: "/cart" },
                { label: "Checkout", href: "/checkout" },
              ].map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="hover:text-[#f97316] transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-white font-semibold mb-4">Categories</h3>
            <ul className="space-y-2 text-sm">
              {[
                { label: "Blinds", href: "/shop?category=Blinds" },
                { label: "Pleated Mesh", href: "/shop?category=Pleated+Mesh" },
                { label: "Honeycomb", href: "/shop?category=Honeycomb" },
                { label: "Partition & Security", href: "/shop?category=Partition+%26+Security" },
              ].map((cat) => (
                <li key={cat.label}>
                  <Link href={cat.href} className="hover:text-[#f97316] transition-colors">
                    {cat.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-semibold mb-4">Contact Us</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 mt-0.5 text-[#f97316] shrink-0" />
                <span>Delhi NCR, India</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-[#f97316] shrink-0" />
                <a href="tel:+911234567890" className="hover:text-[#f97316] transition-colors">+91 12345 67890</a>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-[#f97316] shrink-0" />
                <a href="mailto:info@newtechhomesolutions.in" className="hover:text-[#f97316] transition-colors">
                  info@newtechhomesolutions.in
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-[#1a3a6b] mt-10 pt-6 flex flex-col sm:flex-row justify-between items-center gap-2 text-sm text-gray-500">
          <p>© {new Date().getFullYear()} NewTech Home Solutions. All rights reserved.</p>
          <div className="flex gap-4">
            <Link href="/terms-and-conditions" className="hover:text-[#f97316] transition-colors">Terms & Conditions</Link>
            <a href="#" className="hover:text-[#f97316] transition-colors">Privacy Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

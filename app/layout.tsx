import type { Metadata } from "next";
import "./globals.css";
import { CartProvider } from "@/context/CartContext";
import { AuthProvider } from "@/context/AuthContext";
import { OrderProvider } from "@/context/OrderContext";
import { ProductsProvider } from "@/context/ProductsContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ChatBot from "@/components/ChatBot";

export const metadata: Metadata = {
  title: "NewTech Home Solutions — Complete Home Protection & Interior Solutions",
  description: "Premium Blinds, Pleated Mesh, Honeycomb Blinds, Partitions & Doors and more. Serving Delhi NCR.",
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
  manifest: "/site.webmanifest",
  openGraph: {
    title: "NewTech Home Solutions",
    description: "Complete Home Protection & Interior Solutions",
    type: "website",
    images: [
      {
        url: "/android-chrome-512x512.png",
        width: 512,
        height: 512,
        alt: "NewTech Shop Logo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "NewTech Home Solutions",
    description: "Complete Home Protection & Interior Solutions",
    images: ["/android-chrome-512x512.png"],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#1a3a6b" />
        <meta name="msapplication-TileColor" content="#1a3a6b" />
        <meta name="msapplication-config" content="/browserconfig.xml" />
      </head>
      <body className="min-h-screen flex flex-col bg-gray-50">
        <AuthProvider>
          <OrderProvider>
            <ProductsProvider>
              <CartProvider>
                <Navbar />
                <main className="flex-1">{children}</main>
                <Footer />
                <ChatBot />
              </CartProvider>
            </ProductsProvider>
          </OrderProvider>
        </AuthProvider>
      </body>
    </html>
  );
}

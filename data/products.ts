// 🔥 Firebase se products fetch kiye jayenge — abhi khali hai
// Baad mein Firebase integration add hogi

export interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  category: string;
  image: string;
  rating: number;
  reviews: number;
  description: string;
  features: string[];
  badge?: "Sale" | "New" | "Hot" | "Best Seller";
  inStock: boolean;
}

export const categories: string[] = [];

export const products: Product[] = [];

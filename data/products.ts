// Product data for NewTech Home Solutions shop

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
  subCategory?: string;
}

export const categories: string[] = [
  "Blinds",
  "Pleated Mesh",
  "Honeycomb",
  "Partitions & Doors",
];

export const CATEGORY_MAP: Record<string, string[]> = {
  "Blinds": ["Roller Blinds", "Zebra Blinds", "Wooden Blinds", "Printed Blinds"],
  "Pleated Mesh": ["Polyster Pleated Mesh", "SS 304 Pleated Mesh"],
  "Honeycomb": ["Honeycomb Blackout", "Honeycomb 2in1"],
  "Partitions & Doors": ["PVC Doors", "Security Mesh", "Crystal Doors"],
};

// Demo products removed for a clean store. 
// Products added via the Admin Dashboard will be stored in Firestore.
export const products: Product[] = [];

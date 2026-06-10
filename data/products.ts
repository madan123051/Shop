// Product data for NewTech Home Solutions shop

export interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  category: string; // This will now represent the PARENT category
  subCategory: string; // This will represent the CHILD category
  image: string;
  images?: string[];
  video?: string;
  rating: number;
  reviews: number;
  likes?: number;
  shares?: number;
  comments?: number;
  commentsList?: { user: string; text: string; rating: number; date: string }[];
  views?: number;
  description: string;
  features: string[];
  badge?: "Sale" | "New" | "Hot" | "Best Seller";
  inStock: boolean;
  festivalOffer?: string;
  discountPercent?: number;
  offerLabel?: string;
  offerValidTill?: string;
}

export const CATEGORY_HIERARCHY: Record<string, string[]> = {
  "Blinds": ["Roller Blinds", "Zebra Blinds", "Wooden Blinds", "Printed Blinds"],
  "Pleated Mesh": ["Pleated Mesh", "SS 304 Pleated Mesh"],
  "Honeycomb": ["Honeycomb"],
  "Partitions & Doors": ["Partition & Security", "Security Mesh"]
};

export const categories: string[] = Object.keys(CATEGORY_HIERARCHY);

export const products: Product[] = [];

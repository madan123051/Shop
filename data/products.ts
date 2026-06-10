// Product data for NewTech Home Solutions shop

export interface PriceModifier {
  id: string;
  label: string;
  type: "fixed" | "percentage" | "area-based";
  value: number;
}

export interface CustomOptionGroup {
  id: string;
  title: string;
  options: PriceModifier[];
}

export interface Product {
  id: string;
  name: string;
  price: number; // This will be the base price or base rate
  originalPrice?: number;
  category: string;
  subCategory: string;
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
  
  // Customization Fields
  isCustomizable?: boolean;
  baseRate?: number; // per sq ft
  unit?: "ft" | "inch" | "cm";
  minimumArea?: number;
  installationCost?: number;
  customOptions?: CustomOptionGroup[];
}

export const CATEGORY_HIERARCHY: Record<string, string[]> = {
  "Blinds": ["Roller Blinds", "Zebra Blinds", "Wooden Blinds", "Printed Blinds"],
  "Pleated Mesh": ["Pleated Mesh", "SS 304 Pleated Mesh"],
  "Honeycomb": ["Honeycomb"],
  "Partitions & Doors": ["Partition & Security", "Security Mesh"]
};

export const categories: string[] = Object.keys(CATEGORY_HIERARCHY);

export const products: Product[] = [];

export interface DeliveryLocation {
  id: string;
  name: string; // City or State name
  charge: number;
}

export interface DeliverySettings {
  locations: DeliveryLocation[];
  selfPickupAvailable: boolean;
  freeDeliveryThreshold?: number;
}

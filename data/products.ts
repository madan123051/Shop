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

export const products: Product[] = [
  // ─── BLINDS ───────────────────────────────────────────────────────────────
  {
    id: "roller-blinds",
    name: "Roller Blinds",
    price: 1499,
    originalPrice: 1999,
    category: "Blinds",
    subCategory: "Roller Blinds",
    image: "https://placehold.co/400x300/1a3a6b/ffffff?text=Roller+Blinds",
    rating: 4.7,
    reviews: 152,
    likes: 245,
    description: "Sleek and minimalist roller blinds.",
    features: ["Smooth mechanism", "UV protection"],
    badge: "Best Seller",
    inStock: true,
  },
  {
    id: "zebra-blinds",
    name: "Zebra Blinds",
    price: 1799,
    originalPrice: 2299,
    category: "Blinds",
    subCategory: "Zebra Blinds",
    image: "https://placehold.co/400x300/1a3a6b/ffffff?text=Zebra+Blinds",
    rating: 4.6,
    reviews: 98,
    likes: 180,
    description: "Dual-layered zebra blinds.",
    features: ["Day & night control"],
    badge: "Hot",
    inStock: true,
  },
  {
    id: "wooden-blinds",
    name: "Wooden Blinds",
    price: 2499,
    originalPrice: 3200,
    category: "Blinds",
    subCategory: "Wooden Blinds",
    image: "https://placehold.co/400x300/1a3a6b/ffffff?text=Wooden+Blinds",
    rating: 4.8,
    reviews: 74,
    likes: 310,
    description: "Elegant natural wood blinds.",
    features: ["Hardwood", "Tilt mechanism"],
    badge: "New",
    inStock: true,
  },
  {
    id: "printed-blinds",
    name: "Printed Blinds",
    price: 1699,
    originalPrice: 2199,
    category: "Blinds",
    subCategory: "Printed Blinds",
    image: "https://placehold.co/400x300/1a3a6b/ffffff?text=Printed+Blinds",
    rating: 4.5,
    reviews: 61,
    likes: 120,
    description: "Personalised printed blinds.",
    features: ["Digital printing"],
    inStock: true,
  },

  // ─── PLEATED MESH ─────────────────────────────────────────────────────────
  {
    id: "polyster-pleated-mesh",
    name: "Polyster Pleated Mesh",
    price: 999,
    originalPrice: 1299,
    category: "Pleated Mesh",
    subCategory: "Pleated Mesh",
    image: "https://placehold.co/400x300/1a3a6b/ffffff?text=Polyster+Pleated+Mesh",
    rating: 4.5,
    reviews: 203,
    likes: 450,
    description: "Durable polyester pleated mesh screens.",
    features: ["High-density weave"],
    badge: "Best Seller",
    inStock: true,
  },
  {
    id: "ss304-pleated-mesh",
    name: "SS 304 Pleated Mesh",
    price: 1599,
    originalPrice: 1999,
    category: "Pleated Mesh",
    subCategory: "SS 304 Pleated Mesh",
    image: "https://placehold.co/400x300/1a3a6b/ffffff?text=SS+304+Pleated+Mesh",
    rating: 4.8,
    reviews: 117,
    likes: 290,
    description: "Premium 304-grade stainless steel pleated mesh.",
    features: ["Anti-rust"],
    badge: "Hot",
    inStock: true,
  },

  // ─── HONEYCOMB ────────────────────────────────────────────────────────────
  {
    id: "honeycomb-blackout",
    name: "Honeycomb Blackout",
    price: 2199,
    originalPrice: 2799,
    category: "Honeycomb",
    subCategory: "Honeycomb",
    image: "https://placehold.co/400x300/1a3a6b/ffffff?text=Honeycomb+Blackout",
    rating: 4.9,
    reviews: 88,
    likes: 210,
    description: "Cellular honeycomb blackout blinds.",
    features: ["100% blackout"],
    badge: "New",
    inStock: true,
  },

  // ─── PARTITIONS & DOORS ─────────────────────────────────────────────────
  {
    id: "security-mesh",
    name: "Security Mesh",
    price: 2999,
    originalPrice: 3799,
    category: "Partitions & Doors",
    subCategory: "Security Mesh",
    image: "https://placehold.co/400x300/1a3a6b/ffffff?text=Security+Mesh",
    rating: 4.8,
    reviews: 92,
    likes: 185,
    description: "High-tensile stainless steel security mesh.",
    features: ["Anti-intrusion"],
    badge: "Hot",
    inStock: true,
  },
  {
    id: "pvc-partition",
    name: "PVC Partition",
    price: 3499,
    originalPrice: 4500,
    category: "Partitions & Doors",
    subCategory: "Partition & Security",
    image: "https://placehold.co/400x300/1a3a6b/ffffff?text=PVC+Partition",
    rating: 4.5,
    reviews: 56,
    likes: 95,
    description: "Lightweight and versatile PVC partitions.",
    features: ["Fire-retardant"],
    inStock: true,
  },
];

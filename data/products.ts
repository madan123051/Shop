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
}

export const categories: string[] = [
  "Blinds",
  "Pleated Mesh",
  "Honeycomb",
  "Partition & Security",
];

export const products: Product[] = [
  // ─── BLINDS ───────────────────────────────────────────────────────────────
  {
    id: "roller-blinds",
    name: "Roller Blinds",
    price: 1499,
    originalPrice: 1999,
    category: "Blinds",
    image: "https://placehold.co/400x300/1a3a6b/ffffff?text=Roller+Blinds",
    rating: 4.7,
    reviews: 152,
    description:
      "Sleek and minimalist roller blinds that glide effortlessly. Perfect for living rooms, offices, and bedrooms. Available in light-filtering and blackout variants.",
    features: [
      "Smooth chain-operated mechanism",
      "UV & glare protection",
      "Custom sizes available",
      "Wide range of fabric colours",
      "Easy DIY installation",
    ],
    badge: "Best Seller",
    inStock: true,
  },
  {
    id: "zebra-blinds",
    name: "Zebra Blinds",
    price: 1799,
    originalPrice: 2299,
    category: "Blinds",
    image: "https://placehold.co/400x300/1a3a6b/ffffff?text=Zebra+Blinds",
    rating: 4.6,
    reviews: 98,
    description:
      "Dual-layered zebra blinds with alternating sheer and opaque stripes for perfect light control at any time of day.",
    features: [
      "Day & night light control",
      "Dual-layer sheer + opaque fabric",
      "No-drill mounting option",
      "Motorisation compatible",
      "Dust-resistant coating",
    ],
    badge: "Hot",
    inStock: true,
  },
  {
    id: "wooden-blinds",
    name: "Wooden Blinds",
    price: 2499,
    originalPrice: 3200,
    category: "Blinds",
    image: "https://placehold.co/400x300/1a3a6b/ffffff?text=Wooden+Blinds",
    rating: 4.8,
    reviews: 74,
    description:
      "Elegant natural wood blinds that add warmth and sophistication to any interior. Crafted from premium hardwood with a smooth finish.",
    features: [
      "Premium seasoned hardwood",
      "Tilt & raise mechanism",
      "Multiple wood stain options",
      "Moisture-resistant finish",
      "Eco-friendly sourcing",
    ],
    badge: "New",
    inStock: true,
  },
  {
    id: "printed-blinds",
    name: "Printed Blinds",
    price: 1699,
    originalPrice: 2199,
    category: "Blinds",
    image: "https://placehold.co/400x300/1a3a6b/ffffff?text=Printed+Blinds",
    rating: 4.5,
    reviews: 61,
    description:
      "Personalised printed blinds featuring high-resolution digital prints. Turn your window into a work of art with custom photos or patterns.",
    features: [
      "High-resolution digital printing",
      "Custom photo/pattern upload",
      "Fade-resistant ink",
      "Blackout or semi-sheer options",
      "Wipe-clean surface",
    ],
    inStock: true,
  },

  // ─── PLEATED MESH ─────────────────────────────────────────────────────────
  {
    id: "polyster-pleated-mesh",
    name: "Polyster Pleated Mesh",
    price: 999,
    originalPrice: 1299,
    category: "Pleated Mesh",
    image: "https://placehold.co/400x300/1a3a6b/ffffff?text=Polyster+Pleated+Mesh",
    rating: 4.5,
    reviews: 203,
    description:
      "Durable and cost-effective polyester pleated mesh screens for windows and doors. Keeps insects out while allowing fresh air in.",
    features: [
      "High-density polyester weave",
      "Accordion fold mechanism",
      "No permanent drilling needed",
      "UV stabilised for outdoor use",
      "Multiple colour options",
    ],
    badge: "Best Seller",
    inStock: true,
  },
  {
    id: "ss304-pleated-mesh",
    name: "SS 304 Pleated Mesh",
    price: 1599,
    originalPrice: 1999,
    category: "Pleated Mesh",
    image: "https://placehold.co/400x300/1a3a6b/ffffff?text=SS+304+Pleated+Mesh",
    rating: 4.8,
    reviews: 117,
    description:
      "Premium 304-grade stainless steel pleated mesh — the strongest insect and security screen available. Rust-proof, pet-proof, and child-safe.",
    features: [
      "304-grade marine stainless steel",
      "Anti-rust & weatherproof",
      "10× stronger than polyester",
      "Pet & child safe",
      "Lifetime durability",
    ],
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
    image: "https://placehold.co/400x300/1a3a6b/ffffff?text=Honeycomb+Blackout",
    rating: 4.9,
    reviews: 88,
    description:
      "Cellular honeycomb blackout blinds with superior thermal insulation. Ideal for bedrooms — blocks 100% light and reduces outside noise.",
    features: [
      "100% blackout",
      "Honeycomb air-cell insulation",
      "Noise reduction",
      "Energy saving (keeps rooms cool/warm)",
      "Cordless lift option",
    ],
    badge: "New",
    inStock: true,
  },
  {
    id: "2in1-pleated-honeycomb",
    name: "2in1 Pleated Mesh + Honeycomb",
    price: 2799,
    originalPrice: 3499,
    category: "Honeycomb",
    image: "https://placehold.co/400x300/1a3a6b/ffffff?text=2in1+Pleated+%2B+Honeycomb",
    rating: 4.7,
    reviews: 45,
    description:
      "The best of both worlds — insect protection from the pleated mesh combined with thermal honeycomb insulation in a single elegant frame.",
    features: [
      "Dual-function: mesh + blackout",
      "Single frame, two screens",
      "Insect protection + light block",
      "Space-saving design",
      "Custom sizing available",
    ],
    badge: "New",
    inStock: true,
  },

  // ─── PARTITION & SECURITY ─────────────────────────────────────────────────
  {
    id: "pvc-partition",
    name: "PVC Partition",
    price: 3499,
    originalPrice: 4500,
    category: "Partition & Security",
    image: "https://placehold.co/400x300/1a3a6b/ffffff?text=PVC+Partition",
    rating: 4.5,
    reviews: 56,
    description:
      "Lightweight and versatile PVC partitions for dividing spaces without permanent construction. Easy to install and remove.",
    features: [
      "Fire-retardant PVC material",
      "Modular panel system",
      "No civil work required",
      "Soundproof options available",
      "Available in multiple finishes",
    ],
    inStock: true,
  },
  {
    id: "security-mesh",
    name: "Security Mesh",
    price: 2999,
    originalPrice: 3799,
    category: "Partition & Security",
    image: "https://placehold.co/400x300/1a3a6b/ffffff?text=Security+Mesh",
    rating: 4.8,
    reviews: 92,
    description:
      "High-tensile stainless steel security mesh screens that protect against intrusion while maintaining clear views and airflow.",
    features: [
      "316-grade stainless steel",
      "Anti-intrusion tested",
      "Transparent — no view obstruction",
      "Corrosion resistant",
      "Available for windows & doors",
    ],
    badge: "Hot",
    inStock: true,
  },
  {
    id: "crystal-partition-door",
    name: "Crystal Partition Door",
    price: 5999,
    originalPrice: 7500,
    category: "Partition & Security",
    image: "https://placehold.co/400x300/1a3a6b/ffffff?text=Crystal+Partition+Door",
    rating: 4.9,
    reviews: 33,
    description:
      "Stunning crystal-clear transparent partition doors that add a premium look to offices and homes while defining spaces beautifully.",
    features: [
      "Tempered crystal-clear panels",
      "Slim aluminium frame",
      "Sliding or hinged options",
      "Scratch-resistant glass",
      "Bespoke sizes available",
    ],
    badge: "New",
    inStock: true,
  },
];

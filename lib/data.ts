export type Product = {
  id: string
  name: string
  price: number
  description: string
  category: string
  images: string[]
  sizes: string[]
  inStock: boolean
  featured?: boolean
  newArrival?: boolean
  bestseller?: boolean
  fabric?: string
  care?: string
  customCategories?: string[]
}

export type Collection = {
  id: string
  name: string
  description: string
  image: string
}

export type Order = {
  id: string
  customerId: string
  customerName: string
  customerEmail: string
  date: string
  status: "pending" | "processing" | "shipped" | "delivered"
  paymentStatus: "pending" | "completed" | "failed" | "refunded"
  paymentMethod: string
  items: {
    productId: string
    productName: string
    size: string
    quantity: number
    price: number
  }[]
  subtotal: number
  shipping: number
  total: number
  shippingAddress: {
    street: string
    city: string
    state: string
    zip: string
    country: string
  }
}

// Mock Products Data
export const products: Product[] = [
  {
    id: "1",
    name: "Essential Cashmere Sweater",
    price: 295,
    description: "Luxuriously soft cashmere sweater with a relaxed fit. Perfect for layering or wearing alone.",
    category: "Knitwear",
    images: ["/minimal-beige-cashmere-sweater-on-model.jpg", "/beige-cashmere-sweater-detail-texture-close-up.jpg"],
    sizes: ["XS", "S", "M", "L", "XL"],
    inStock: true,
    featured: true,
    bestseller: true,
    fabric: "100% Cashmere",
    care: "Dry clean only",
  },
  {
    id: "2",
    name: "Tailored Wool Trousers",
    price: 245,
    description: "Classic tailored trousers crafted from premium wool. Timeless silhouette with a modern fit.",
    category: "Trousers",
    images: ["/charcoal-grey-wool-trousers-on-model-minimal.jpg", "/grey-tailored-trousers-detail-close-up.jpg"],
    sizes: ["28", "30", "32", "34", "36"],
    inStock: true,
    featured: true,
    bestseller: true,
  },
  {
    id: "3",
    name: "Organic Cotton Tee",
    price: 85,
    description: "Essential crew neck tee made from premium organic cotton. Soft, breathable, and perfectly fitted.",
    category: "Basics",
    images: ["/white-cotton-t-shirt-on-model-minimal-clean.jpg", "/white-tee-shirt-folded-detail.jpg"],
    sizes: ["XS", "S", "M", "L", "XL"],
    inStock: true,
    newArrival: true,
    fabric: "100% Organic Cotton",
    care: "Machine wash cold",
  },
  {
    id: "4",
    name: "Silk Button-Down Shirt",
    price: 325,
    description: "Elegant silk shirt with mother-of-pearl buttons. Effortlessly sophisticated.",
    category: "Shirts",
    images: ["/ivory-silk-shirt-on-model-minimal-elegant.jpg", "/silk-shirt-detail-buttons-close-up.jpg"],
    sizes: ["XS", "S", "M", "L"],
    inStock: true,
    newArrival: true,
  },
  {
    id: "5",
    name: "Merino Wool Cardigan",
    price: 275,
    description: "Lightweight merino wool cardigan. Versatile layering piece for any season.",
    category: "Knitwear",
    images: ["/navy-merino-wool-cardigan-on-model.jpg", "/navy-cardigan-detail-texture.jpg"],
    sizes: ["S", "M", "L", "XL"],
    inStock: true,
    featured: true,
  },
  {
    id: "6",
    name: "Linen Wide-Leg Pants",
    price: 195,
    description: "Flowing wide-leg pants in breathable linen. Relaxed yet refined.",
    category: "Trousers",
    images: ["/natural-linen-wide-leg-pants-on-model.jpg", "/linen-pants-texture-detail.jpg"],
    sizes: ["XS", "S", "M", "L"],
    inStock: false,
  },
  {
    id: "7",
    name: "Leather Minimal Tote",
    price: 425,
    description: "Handcrafted leather tote with clean lines. Spacious interior with magnetic closure.",
    category: "Accessories",
    images: ["/tan-leather-tote-bag-minimal.jpg", "/leather-bag-detail-stitching.jpg"],
    sizes: ["One Size"],
    inStock: true,
    featured: true,
    bestseller: true,
  },
  {
    id: "8",
    name: "Cashmere Scarf",
    price: 165,
    description: "Soft cashmere scarf in a versatile neutral tone. Essential cold-weather accessory.",
    category: "Accessories",
    images: ["/beige-cashmere-scarf-styled.jpg", "/placeholder.svg?height=800&width=600"],
    sizes: ["One Size"],
    inStock: true,
    newArrival: true,
  },
]

// Mock Collections Data
export const collections: Collection[] = [
  {
    id: "essentials",
    name: "Essentials",
    description: "Timeless pieces for everyday elegance",
    image: "/placeholder.svg?height=600&width=800",
  },
  {
    id: "knitwear",
    name: "Knitwear",
    description: "Luxurious knits for every season",
    image: "/placeholder.svg?height=600&width=800",
  },
  {
    id: "tailoring",
    name: "Tailoring",
    description: "Precision-crafted suiting and trousers",
    image: "/placeholder.svg?height=600&width=800",
  },
]

// Mock Orders Data
export const orders: Order[] = [
  {
    id: "ORD-2024-001",
    customerId: "CUST-001",
    customerName: "Emma Thompson",
    customerEmail: "emma.t@example.com",
    date: "2024-01-15",
    status: "delivered",
    paymentStatus: "completed",
    paymentMethod: "Credit Card",
    items: [
      {
        productId: "1",
        productName: "Essential Cashmere Sweater",
        size: "M",
        quantity: 1,
        price: 295,
      },
    ],
    subtotal: 295,
    shipping: 15,
    total: 310,
    shippingAddress: {
      street: "123 Main St",
      city: "New York",
      state: "NY",
      zip: "10001",
      country: "USA",
    },
  },
  {
    id: "ORD-2024-002",
    customerId: "CUST-002",
    customerName: "James Wilson",
    customerEmail: "james.w@example.com",
    date: "2024-01-18",
    status: "shipped",
    paymentStatus: "completed",
    paymentMethod: "PayPal",
    items: [
      {
        productId: "2",
        productName: "Tailored Wool Trousers",
        size: "32",
        quantity: 2,
        price: 245,
      },
      {
        productId: "3",
        productName: "Organic Cotton Tee",
        size: "L",
        quantity: 3,
        price: 85,
      },
    ],
    subtotal: 745,
    shipping: 15,
    total: 760,
    shippingAddress: {
      street: "456 Oak Ave",
      city: "Los Angeles",
      state: "CA",
      zip: "90001",
      country: "USA",
    },
  },
  {
    id: "ORD-2024-003",
    customerId: "CUST-003",
    customerName: "Sophia Martinez",
    customerEmail: "sophia.m@example.com",
    date: "2024-01-20",
    status: "pending",
    paymentStatus: "pending",
    paymentMethod: "Credit Card",
    items: [
      {
        productId: "4",
        productName: "Silk Button-Down Shirt",
        size: "S",
        quantity: 1,
        price: 325,
      },
    ],
    subtotal: 325,
    shipping: 15,
    total: 340,
    shippingAddress: {
      street: "789 Pine Rd",
      city: "Chicago",
      state: "IL",
      zip: "60601",
      country: "USA",
    },
  },
]

export let customCategories: string[] = [
  "Spring Collection",
  "Summer Collection",
  "Fall Collection",
  "Winter Collection",
]

export function addCustomCategory(category: string) {
  if (!customCategories.includes(category)) {
    customCategories.push(category)
  }
}

export function deleteCustomCategory(category: string) {
  customCategories = customCategories.filter((c) => c !== category)
}

export function addProduct(product: Product) {
  products.push(product)
}

export function updateProduct(id: string, updates: Partial<Product>) {
  const index = products.findIndex((p) => p.id === id)
  if (index !== -1) {
    products[index] = { ...products[index], ...updates }
  }
}

export function deleteProduct(id: string) {
  const index = products.findIndex((p) => p.id === id)
  if (index !== -1) {
    products.splice(index, 1)
  }
}

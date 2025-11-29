import { NextResponse } from 'next/server';

// Mock products data (in production, this would come from backend)
const PRODUCTS = [
  {
    id: "mug-001",
    name: "Cyberpunk Coffee Mug",
    description: "Neon-lit ceramic mug with LED base",
    price: 899,
    currency: "INR",
    category: "mug",
    color: "black",
    stock: 15,
    image: "☕"
  },
  {
    id: "mug-002",
    name: "Hacker's Energy Mug",
    description: "Extra large mug for long coding sessions",
    price: 1299,
    currency: "INR",
    category: "mug",
    color: "white",
    stock: 8,
    image: "☕"
  },
  {
    id: "tshirt-001",
    name: "Neural Network T-Shirt",
    description: "100% cotton with circuit board design",
    price: 799,
    currency: "INR",
    category: "tshirt",
    color: "black",
    size: ["S", "M", "L", "XL"],
    stock: 25,
    image: "👕"
  },
  {
    id: "tshirt-002",
    name: "AI Developer Tee",
    description: "Soft fabric with 'Powered by AI' print",
    price: 699,
    currency: "INR",
    category: "tshirt",
    color: "navy",
    size: ["S", "M", "L", "XL"],
    stock: 30,
    image: "👕"
  },
  {
    id: "hoodie-001",
    name: "Cyberpunk Hoodie",
    description: "Premium hoodie with neon accents",
    price: 1999,
    currency: "INR",
    category: "hoodie",
    color: "black",
    size: ["M", "L", "XL"],
    stock: 12,
    image: "🧥"
  },
  {
    id: "hoodie-002",
    name: "Code Warrior Hoodie",
    description: "Warm and comfortable for late-night coding",
    price: 2299,
    currency: "INR",
    category: "hoodie",
    color: "gray",
    size: ["M", "L", "XL"],
    stock: 10,
    image: "🧥"
  },
  {
    id: "cap-001",
    name: "Tech Geek Cap",
    description: "Adjustable cap with embroidered logo",
    price: 499,
    currency: "INR",
    category: "cap",
    color: "black",
    stock: 20,
    image: "🧢"
  },
  {
    id: "bag-001",
    name: "Developer Backpack",
    description: "Laptop compartment with USB charging port",
    price: 2499,
    currency: "INR",
    category: "bag",
    color: "black",
    stock: 8,
    image: "🎒"
  },
  {
    id: "mouse-001",
    name: "RGB Gaming Mouse",
    description: "Ergonomic design with customizable RGB",
    price: 1499,
    currency: "INR",
    category: "accessory",
    color: "black",
    stock: 15,
    image: "🖱️"
  },
  {
    id: "keyboard-001",
    name: "Mechanical Keyboard",
    description: "Cherry MX switches with RGB backlight",
    price: 3999,
    currency: "INR",
    category: "accessory",
    color: "black",
    stock: 6,
    image: "⌨️"
  }
];

export async function GET() {
  return NextResponse.json(PRODUCTS);
}

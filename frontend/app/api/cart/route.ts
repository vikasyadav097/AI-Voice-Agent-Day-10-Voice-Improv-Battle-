import { NextResponse } from 'next/server';
import { readFile, writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';

// Cart file path
const CART_FILE = join(process.cwd(), '..', 'shared-data', 'cart.json');

// Load cart from file
async function loadCart() {
  try {
    if (existsSync(CART_FILE)) {
      const data = await readFile(CART_FILE, 'utf-8');
      return JSON.parse(data);
    }
  } catch (error) {
    console.error('Failed to load cart:', error);
  }
  return { items: [], total: 0, currency: 'INR' };
}

// Save cart to file
async function saveCart(cartData: any) {
  try {
    const dir = join(process.cwd(), '..', 'shared-data');
    if (!existsSync(dir)) {
      await mkdir(dir, { recursive: true });
    }
    await writeFile(CART_FILE, JSON.stringify(cartData, null, 2));
  } catch (error) {
    console.error('Failed to save cart:', error);
  }
}

// For backward compatibility
export const cart = { items: [], total: 0, currency: 'INR' };

export async function GET() {
  const cart = await loadCart();
  console.log('GET /api/cart - Current cart:', JSON.stringify(cart));
  return NextResponse.json(cart);
}

export async function POST(request: Request) {
  const body = await request.json();
  const { product_id, quantity = 1, size } = body;
  
  console.log('POST /api/cart - Adding:', { product_id, quantity, size });
  
  // Import products directly
  const PRODUCTS = [
    { id: "mug-001", name: "Cyberpunk Coffee Mug", price: 899, currency: "INR" },
    { id: "mug-002", name: "Hacker's Energy Mug", price: 1299, currency: "INR" },
    { id: "tshirt-001", name: "Neural Network T-Shirt", price: 799, currency: "INR" },
    { id: "tshirt-002", name: "AI Developer Tee", price: 699, currency: "INR" },
    { id: "hoodie-001", name: "Cyberpunk Hoodie", price: 1999, currency: "INR" },
    { id: "hoodie-002", name: "Code Warrior Hoodie", price: 2299, currency: "INR" },
    { id: "cap-001", name: "Tech Geek Cap", price: 499, currency: "INR" },
    { id: "bag-001", name: "Developer Backpack", price: 2499, currency: "INR" },
    { id: "mouse-001", name: "RGB Gaming Mouse", price: 1499, currency: "INR" },
    { id: "keyboard-001", name: "Mechanical Keyboard", price: 3999, currency: "INR" }
  ];
  
  const product = PRODUCTS.find((p: any) => p.id === product_id);
  
  if (!product) {
    return NextResponse.json({ error: 'Product not found' }, { status: 404 });
  }
  
  // Load current cart
  const cart = await loadCart();
  
  // Check if item already in cart
  const existingItem = cart.items.find((item: any) => 
    item.product_id === product_id && item.size === size
  );
  
  if (existingItem) {
    existingItem.quantity += quantity;
    existingItem.item_total = existingItem.quantity * existingItem.price;
  } else {
    cart.items.push({
      product_id,
      name: product.name,
      price: product.price,
      currency: product.currency,
      quantity,
      size,
      item_total: product.price * quantity
    });
  }
  
  // Recalculate total
  cart.total = cart.items.reduce((sum: number, item: any) => sum + item.item_total, 0);
  
  // Save cart
  await saveCart(cart);
  
  console.log('POST /api/cart - Cart saved:', JSON.stringify(cart));
  
  return NextResponse.json(cart);
}

export async function DELETE() {
  // Clear cart
  const cart = { items: [], total: 0, currency: 'INR' };
  await saveCart(cart);
  return NextResponse.json(cart);
}

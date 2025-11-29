import { NextResponse } from 'next/server';
import { readFile, writeFile } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';

const CART_FILE = join(process.cwd(), '..', 'shared-data', 'cart.json');

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

async function saveCart(cartData: any) {
  try {
    await writeFile(CART_FILE, JSON.stringify(cartData, null, 2));
  } catch (error) {
    console.error('Failed to save cart:', error);
  }
}

export async function DELETE(
  request: Request,
  context: { params: Promise<{ productId: string }> }
) {
  const { productId } = await context.params;
  
  console.log('DELETE request for product:', productId);
  
  // Load cart
  const cart = await loadCart();
  console.log('Cart before:', JSON.stringify(cart));
  
  // Remove item
  const itemsBefore = cart.items.length;
  cart.items = cart.items.filter((item: any) => item.product_id !== productId);
  const itemsAfter = cart.items.length;
  
  console.log(`Removed ${itemsBefore - itemsAfter} items`);
  
  // Recalculate total
  cart.total = cart.items.reduce((sum: number, item: any) => sum + item.item_total, 0);
  
  // Save cart
  await saveCart(cart);
  
  console.log('Cart after:', JSON.stringify(cart));
  
  return NextResponse.json(cart);
}

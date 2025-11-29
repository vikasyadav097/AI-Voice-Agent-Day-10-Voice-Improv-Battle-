import { NextResponse } from 'next/server';
import { writeFile, readFile, mkdir } from 'fs/promises';
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

export async function POST() {
  const cart = await loadCart();
  
  if (cart.items.length === 0) {
    return NextResponse.json({ error: 'Cart is empty' }, { status: 400 });
  }

  // Generate order ID
  const orderId = Math.random().toString(36).substring(2, 10);
  
  // Create order object
  const order = {
    id: orderId,
    status: 'CONFIRMED',
    buyer: {
      name: 'Voice Customer'
    },
    line_items: cart.items.map((item: any) => ({
      product_id: item.product_id,
      product_name: item.name,
      quantity: item.quantity,
      unit_amount: item.price,
      currency: item.currency,
      size: item.size,
      total: item.item_total
    })),
    total: cart.total,
    currency: cart.currency,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };

  try {
    // Save order to file
    const ordersDir = join(process.cwd(), '..', 'shared-data', 'orders');
    if (!existsSync(ordersDir)) {
      await mkdir(ordersDir, { recursive: true });
    }
    const orderFile = join(ordersDir, `order_${orderId}.json`);
    
    await writeFile(orderFile, JSON.stringify(order, null, 2));
    console.log('Order saved:', orderFile);
    
    // Clear cart
    await saveCart({ items: [], total: 0, currency: 'INR' });
    
    return NextResponse.json({
      success: true,
      order_id: orderId,
      total: order.total,
      message: 'Order placed successfully!'
    });
  } catch (error) {
    console.error('Failed to save order:', error);
    return NextResponse.json({ error: 'Failed to create order' }, { status: 500 });
  }
}

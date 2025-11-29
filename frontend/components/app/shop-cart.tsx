'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ShoppingCart, Trash2, CreditCard } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CartItem {
  product_id: string;
  name: string;
  quantity: number;
  price: number;
  currency: string;
  item_total: number;
  size?: string;
}

interface ShopCartProps {
  className?: string;
}

export function ShopCart({ className }: ShopCartProps) {
  const [cart, setCart] = useState<{ items: CartItem[]; total: number; currency: string }>({
    items: [],
    total: 0,
    currency: 'INR',
  });
  const [showSuccess, setShowSuccess] = useState(false);
  const [orderSummary, setOrderSummary] = useState<{ items: CartItem[]; total: number } | null>(null);

  const fetchCart = async () => {
    try {
      const response = await fetch('/api/cart');
      if (response.ok) {
        const data = await response.json();
        setCart(data);
      }
    } catch (error) {
      console.error('Failed to fetch cart:', error);
    }
  };

  useEffect(() => {
    fetchCart();
    // Poll for updates every 2 seconds
    const interval = setInterval(fetchCart, 2000);
    return () => clearInterval(interval);
  }, []);

  const removeItem = async (productId: string) => {
    console.log('Attempting to remove product:', productId);
    try {
      const response = await fetch(`/api/cart/${productId}`, {
        method: 'DELETE',
      });
      console.log('Delete response status:', response.status);
      if (response.ok) {
        const data = await response.json();
        console.log('Updated cart:', data);
        // Update state immediately with the response
        setCart(data);
      } else {
        console.error('Delete failed with status:', response.status);
        const errorText = await response.text();
        console.error('Error response:', errorText);
      }
    } catch (error) {
      console.error('Failed to remove item:', error);
    }
  };

  const handleCheckout = async () => {
    if (cart.items.length === 0) return;
    
    // Save order summary before clearing cart
    const summary = {
      items: [...cart.items],
      total: cart.total
    };
    
    try {
      // Create order via checkout endpoint
      const response = await fetch('/api/checkout', {
        method: 'POST',
      });
      
      if (response.ok) {
        const result = await response.json();
        console.log('Order created:', result);
        
        // Save order summary for success message
        setOrderSummary(summary);
        
        // Clear cart state
        setCart({ items: [], total: 0, currency: 'INR' });
        
        // Show success message
        setShowSuccess(true);
        
        // Hide after 5 seconds (longer to read items)
        setTimeout(() => {
          setShowSuccess(false);
          setOrderSummary(null);
        }, 5000);
      } else {
        console.error('Checkout failed');
      }
    } catch (error) {
      console.error('Checkout failed:', error);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 100 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4 }}
      className={cn('cyber-panel rounded-lg shadow-2xl overflow-hidden w-80', className)}
    >
      {/* Header */}
      <div className="relative bg-black/60 border-b border-cyan-500/30 px-4 py-3">
        <div className="flex items-center gap-2">
          <ShoppingCart className="w-6 h-6 text-cyan-400" />
          <div className="flex-1">
            <h3 className="font-bold text-base text-cyan-400">SHOPPING CART</h3>
            <p className="text-xs text-gray-400">
              {cart.items.length} {cart.items.length === 1 ? 'item' : 'items'}
            </p>
          </div>
        </div>
      </div>

      {/* Cart Items */}
      <div className="p-4 space-y-3 max-h-[50vh] overflow-y-auto custom-scrollbar">
        <AnimatePresence>
          {cart.items.map((item, index) => (
            <motion.div
              key={`${item.product_id}-${index}`}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ delay: index * 0.05 }}
              className="bg-black/60 border border-cyan-500/30 rounded-lg p-3"
            >
              <div className="flex justify-between items-start mb-2">
                <div className="flex-1 min-w-0">
                  <h4 className="font-bold text-sm text-cyan-400 truncate">{item.name}</h4>
                  {item.size && (
                    <span className="text-xs text-purple-400">Size: {item.size}</span>
                  )}
                </div>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => removeItem(item.product_id)}
                  className="text-red-400 hover:text-red-300 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </motion.button>
              </div>

              <div className="flex justify-between items-center text-xs">
                <span className="text-gray-400">Qty: {item.quantity}</span>
                <span className="text-white font-bold">₹{item.item_total}</span>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {cart.items.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <ShoppingCart className="w-12 h-12 mx-auto mb-2 opacity-50" />
            <p className="text-sm">Your cart is empty</p>
            <p className="text-xs mt-1">Add products to start shopping!</p>
          </div>
        )}
      </div>

      {/* Cart Total */}
      {cart.items.length > 0 && (
        <div className="border-t border-cyan-500/30 p-4 bg-black/40">
          <div className="flex justify-between items-center mb-3">
            <span className="text-sm font-bold text-cyan-400 uppercase">Total</span>
            <span className="text-xl font-bold text-white">₹{cart.total}</span>
          </div>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleCheckout}
            className="w-full py-3 rounded font-bold text-sm uppercase tracking-wider bg-gradient-to-r from-cyan-500/20 to-purple-500/20 border-2 border-cyan-500/50 text-cyan-400 hover:border-cyan-500/80 transition-all"
          >
            <span className="flex items-center justify-center gap-2">
              <CreditCard className="w-4 h-4" />
              CHECKOUT
            </span>
          </motion.button>
        </div>
      )}

      {/* Success Message Overlay */}
      <AnimatePresence>
        {showSuccess && orderSummary && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="absolute inset-0 flex items-center justify-center bg-black/95 backdrop-blur-sm z-50 p-4"
          >
            <motion.div
              initial={{ y: 20 }}
              animate={{ y: 0 }}
              className="text-center max-w-sm w-full"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
                className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-green-500/20 to-cyan-500/20 border-2 border-green-500/50 flex items-center justify-center"
              >
                <motion.svg
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ delay: 0.3, duration: 0.5 }}
                  className="w-10 h-10 text-green-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={3}
                >
                  <motion.path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M5 13l4 4L19 7"
                  />
                </motion.svg>
              </motion.div>
              
              <motion.h3
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-2xl font-bold text-green-400 mb-2"
              >
                ORDER CONFIRMED!
              </motion.h3>
              
              {/* Order Items */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="mt-4 mb-4 max-h-40 overflow-y-auto custom-scrollbar"
              >
                <div className="text-left space-y-2">
                  {orderSummary.items.map((item, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.6 + index * 0.1 }}
                      className="flex justify-between items-center text-sm bg-black/40 border border-cyan-500/20 rounded p-2"
                    >
                      <div className="flex-1 min-w-0">
                        <div className="text-cyan-400 font-medium truncate">{item.name}</div>
                        {item.size && (
                          <div className="text-purple-400 text-xs">Size: {item.size}</div>
                        )}
                        <div className="text-gray-500 text-xs">Qty: {item.quantity}</div>
                      </div>
                      <div className="text-white font-bold ml-2">₹{item.item_total}</div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
              
              {/* Total */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7 }}
                className="border-t border-cyan-500/30 pt-3 mb-3"
              >
                <div className="flex justify-between items-center">
                  <span className="text-cyan-400 font-bold uppercase text-sm">Total</span>
                  <span className="text-white font-bold text-xl">₹{orderSummary.total}</span>
                </div>
              </motion.div>
              
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
                className="text-sm text-gray-400"
              >
                Thank you for shopping with us! 🎉
              </motion.p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

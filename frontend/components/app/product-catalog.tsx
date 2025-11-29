'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ShoppingCart, Package, Plus, Check } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  category: string;
  color?: string;
  size?: string[];
  stock: number;
  image: string;
}

interface ProductCatalogProps {
  className?: string;
}

export function ProductCatalog({ className }: ProductCatalogProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<any[]>([]);
  const [addedItems, setAddedItems] = useState<Set<string>>(new Set());

  useEffect(() => {
    // Load products from backend
    const loadProducts = async () => {
      try {
        const response = await fetch('/api/products');
        if (response.ok) {
          const data = await response.json();
          setProducts(data);
        }
      } catch (err) {
        console.error('Failed to load products:', err);
      }
    };
    loadProducts();
  }, []);

  const handleAddToCart = async (product: Product) => {
    try {
      const response = await fetch('/api/cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          product_id: product.id,
          quantity: 1,
        }),
      });

      if (response.ok) {
        const updatedCart = await response.json();
        setCart(updatedCart.items);
        
        // Show checkmark animation
        setAddedItems(prev => new Set(prev).add(product.id));
        setTimeout(() => {
          setAddedItems(prev => {
            const next = new Set(prev);
            next.delete(product.id);
            return next;
          });
        }, 2000);
      }
    } catch (error) {
      console.error('Failed to add to cart:', error);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -100 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4 }}
      className={cn('cyber-panel rounded-lg shadow-2xl overflow-hidden w-80', className)}
    >
      {/* Header */}
      <div className="relative bg-black/60 border-b border-cyan-500/30 px-4 py-3">
        <div className="flex items-center gap-2">
          <Package className="w-6 h-6 text-cyan-400" />
          <div className="flex-1">
            <h3 className="font-bold text-base text-cyan-400">PRODUCT CATALOG</h3>
            <p className="text-xs text-gray-400">{products.length} items available</p>
          </div>
          <div className="relative">
            <ShoppingCart className="w-5 h-5 text-purple-400" />
            {cart.length > 0 && (
              <span className="absolute -top-2 -right-2 bg-cyan-500 text-black text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                {cart.length}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Product List */}
      <div className="p-4 space-y-3 max-h-[70vh] overflow-y-auto custom-scrollbar">
        <AnimatePresence>
          {products.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="bg-black/60 border border-cyan-500/30 rounded-lg p-3 hover:border-cyan-500/60 transition-all"
            >
              <div className="flex gap-3">
                {/* Product Image/Icon */}
                <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-cyan-500/20 to-purple-500/20 rounded flex items-center justify-center text-2xl border border-cyan-500/30">
                  {product.image}
                </div>

                {/* Product Info */}
                <div className="flex-1 min-w-0">
                  <h4 className="font-bold text-sm text-cyan-400 truncate">{product.name}</h4>
                  <p className="text-xs text-gray-400 line-clamp-2 mb-1">{product.description}</p>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-base font-bold text-white">₹{product.price}</span>
                    <span className="text-xs text-gray-500">{product.stock} in stock</span>
                  </div>

                  {product.size && (
                    <div className="mt-1 flex gap-1">
                      {product.size.slice(0, 4).map(size => (
                        <span key={size} className="text-[10px] px-1.5 py-0.5 bg-purple-500/20 border border-purple-500/30 rounded text-purple-300">
                          {size}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Add to Cart Button */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleAddToCart(product)}
                disabled={addedItems.has(product.id)}
                className={cn(
                  'w-full mt-3 py-2 rounded font-bold text-xs uppercase tracking-wider transition-all',
                  addedItems.has(product.id)
                    ? 'bg-green-500/20 border border-green-500/50 text-green-400'
                    : 'bg-gradient-to-r from-cyan-500/20 to-purple-500/20 border border-cyan-500/50 text-cyan-400 hover:border-cyan-500/80'
                )}
              >
                {addedItems.has(product.id) ? (
                  <span className="flex items-center justify-center gap-2">
                    <Check className="w-4 h-4" />
                    ADDED
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    <Plus className="w-4 h-4" />
                    ADD TO CART
                  </span>
                )}
              </motion.button>
            </motion.div>
          ))}
        </AnimatePresence>

        {products.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <Package className="w-12 h-12 mx-auto mb-2 opacity-50" />
            <p className="text-sm">Loading products...</p>
          </div>
        )}
      </div>
    </motion.div>
  );
}

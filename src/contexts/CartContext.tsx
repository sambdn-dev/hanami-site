'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { productsData } from '@/data/products';

const CART_STORAGE_KEY = 'hanami-cart';

interface CartContextType {
  cart: Record<number, number>;
  addToCart: (productId: number, quantity?: number) => void;
  removeFromCart: (productId: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  getCartCount: () => number;
  getCartTotal: () => number;
  clearCart: () => void;
  showCartPanel: boolean;
  setShowCartPanel: (show: boolean) => void;
}

const CartContext = createContext<CartContextType | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<Record<number, number>>({});
  const [showCartPanel, setShowCartPanel] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);

  // Charger le panier depuis localStorage au montage
  useEffect(() => {
    const savedCart = localStorage.getItem(CART_STORAGE_KEY);
    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart));
      } catch (e) {
        console.error('Erreur lors du chargement du panier:', e);
      }
    }
    setIsHydrated(true);
  }, []);

  // Sauvegarder le panier dans localStorage à chaque modification
  useEffect(() => {
    if (isHydrated) {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
    }
  }, [cart, isHydrated]);

  const addToCart = (productId: number, quantity = 1) => {
    setCart(prev => ({
      ...prev,
      [productId]: (prev[productId] || 0) + quantity
    }));
  };

  const removeFromCart = (productId: number) => {
    setCart(prev => {
      const newCart = { ...prev };
      delete newCart[productId];
      return newCart;
    });
  };

  const updateQuantity = (productId: number, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
    } else {
      setCart(prev => ({ ...prev, [productId]: quantity }));
    }
  };

  const getCartCount = () => {
    return Object.values(cart).reduce((sum, qty) => sum + qty, 0);
  };

  const getCartTotal = () => {
    return Object.entries(cart).reduce((sum, [id, qty]) => {
      const product = productsData.find(p => p.id === parseInt(id));
      return sum + (product ? product.price * qty : 0);
    }, 0);
  };

  const clearCart = () => {
    setCart({});
  };

  return (
    <CartContext.Provider value={{
      cart,
      addToCart,
      removeFromCart,
      updateQuantity,
      getCartCount,
      getCartTotal,
      clearCart,
      showCartPanel,
      setShowCartPanel
    }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within CartProvider');
  }
  return context;
}

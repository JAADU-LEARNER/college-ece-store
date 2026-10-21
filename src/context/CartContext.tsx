'use client';

import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { Product, CartItem } from '@/types';
import { useStudent } from '@/context/StudentContext';

interface CartContextType {
  items: CartItem[];
  addToCart: (product: Product, quantity?: number) => { success: boolean; message: string };
  updateQuantity: (productId: string, quantity: number) => { success: boolean; message?: string };
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
  totalItems: number;
  totalAmount: number;
  isCartDrawerOpen: boolean;
  setIsCartDrawerOpen: (open: boolean) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_STORAGE_KEY = 'college_ece_cart_v1';

export function CartProvider({ children }: { children: React.ReactNode }) {
  const { student, token } = useStudent();
  const [items, setItems] = useState<CartItem[]>([]);
  const [isCartDrawerOpen, setIsCartDrawerOpen] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const prevStudentIdRef = useRef<string | null>(null);

  // Load cart from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(CART_STORAGE_KEY);
      if (saved) {
        setItems(JSON.parse(saved));
      }
    } catch (e) {
      console.error('Failed to load cart from storage:', e);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    if (!isLoaded) return;
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
    } catch (e) {
      console.error('Failed to save cart to storage:', e);
    }
  }, [items, isLoaded]);

  // Synchronize cart with Student Login / Logout
  useEffect(() => {
    if (!isLoaded) return;

    const currentStudentId = student?.id || null;

    // Case 1: Student Logged Out -> Reset cart to freshly empty
    if (prevStudentIdRef.current && !currentStudentId) {
      setItems([]);
      try {
        localStorage.removeItem(CART_STORAGE_KEY);
      } catch {}
      prevStudentIdRef.current = null;
      return;
    }

    // Case 2: Student Logged In -> Restore student's personal saved cart
    if (currentStudentId && currentStudentId !== prevStudentIdRef.current) {
      prevStudentIdRef.current = currentStudentId;

      if (student?.cart && Array.isArray(student.cart) && student.cart.length > 0) {
        setItems(student.cart);
        try {
          localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(student.cart));
        } catch {}
      } else if (items.length > 0 && token) {
        // If current session already had items, sync them to user's new account
        fetch('/api/student/sync-cart', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({ cart: items })
        }).catch(err => console.error('Initial cart sync error:', err));
      }
      return;
    }

    prevStudentIdRef.current = currentStudentId;
  }, [student, isLoaded, token]);

  // Auto-sync items to server whenever student adds/updates items
  useEffect(() => {
    if (!isLoaded || !student || !token) return;

    const timer = setTimeout(() => {
      fetch('/api/student/sync-cart', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ cart: items })
      }).catch(err => console.error('Cart auto-sync error:', err));
    }, 400);

    return () => clearTimeout(timer);
  }, [items, student, token, isLoaded]);

  const addToCart = (product: Product, quantity = 1): { success: boolean; message: string } => {
    if (product.stock <= 0) {
      return { success: false, message: `"${product.title}" is currently Out of Stock!` };
    }

    let result = { success: true, message: `Added ${product.title} to your cart.` };

    setItems(prev => {
      const existingIndex = prev.findIndex(item => item.product.id === product.id);

      if (existingIndex > -1) {
        const currentQty = prev[existingIndex].quantity;
        const newQty = currentQty + quantity;

        if (newQty > product.stock) {
          result = {
            success: false,
            message: `Only ${product.stock} unit(s) available in campus stock. You already have ${currentQty} in cart.`
          };
          return prev;
        }

        const updated = [...prev];
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: newQty
        };
        return updated;
      } else {
        if (quantity > product.stock) {
          result = {
            success: false,
            message: `Cannot add ${quantity} units. Only ${product.stock} available in stock.`
          };
          return prev;
        }
        return [...prev, { product, quantity }];
      }
    });

    if (result.success) {
      setIsCartDrawerOpen(true);
    }

    return result;
  };

  const updateQuantity = (productId: string, quantity: number): { success: boolean; message?: string } => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return { success: true };
    }

    let errorMsg: string | undefined;

    setItems(prev => {
      const index = prev.findIndex(item => item.product.id === productId);
      if (index === -1) return prev;

      const item = prev[index];
      if (quantity > item.product.stock) {
        errorMsg = `Cannot exceed available stock (${item.product.stock} units max).`;
        return prev;
      }

      const updated = [...prev];
      updated[index] = { ...item, quantity };
      return updated;
    });

    return { success: !errorMsg, message: errorMsg };
  };

  const removeFromCart = (productId: string) => {
    setItems(prev => prev.filter(item => item.product.id !== productId));
  };

  const clearCart = () => {
    setItems([]);
    try {
      localStorage.removeItem(CART_STORAGE_KEY);
    } catch {}
  };

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalAmount = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        totalItems,
        totalAmount,
        isCartDrawerOpen,
        setIsCartDrawerOpen
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}

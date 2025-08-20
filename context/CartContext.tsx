'use client';
import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';

export type CartItem = { id: string; name: string; price_cents: number; image?: string; qty: number; };
type Cart = { items: CartItem[]; add: (i: CartItem) => void; remove: (id: string) => void; clear: () => void; total: number; count: number; };

const Ctx = createContext<Cart | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem('cart');
      if (raw) setItems(JSON.parse(raw));
    } catch {}
  }, []);

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(items));
  }, [items]);

  const add = (i: CartItem) => {
    setItems(prev => {
      const idx = prev.findIndex(x => x.id === i.id);
      if (idx >= 0) {
        const copy = [...prev];
        copy[idx] = { ...copy[idx], qty: copy[idx].qty + i.qty };
        return copy;
      }
      return [...prev, i];
    });
  };
  const remove = (id: string) => setItems(prev => prev.filter(x => x.id !== id));
  const clear = () => setItems([]);
  const total = useMemo(() => items.reduce((s, i) => s + i.price_cents * i.qty, 0), [items]);
  const count = useMemo(() => items.reduce((s, i) => s + i.qty, 0), [items]);

  return <Ctx.Provider value={{ items, add, remove, clear, total, count }}>{children}</Ctx.Provider>;
}

export function useCart() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
}

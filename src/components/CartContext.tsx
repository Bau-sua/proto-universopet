"use client";

// Client cart state (context + localStorage). The cart survives reloads and
// is the single source of truth for the header badge, /carrito and /checkout.

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { CartLine } from "@/types/catalog";

const STORAGE_KEY = "universopet-cart";

interface CartContextValue {
  items: CartLine[];
  count: number;
  addItem: (line: CartLine) => void;
  updateQuantity: (key: string, quantity: number) => void;
  removeItem: (key: string) => void;
  clear: () => void;
}

const CartContext = createContext<CartContextValue | null>(null);

export function lineKey(line: Pick<CartLine, "productId" | "variantId">): string {
  return `${line.productId}:${line.variantId ?? ""}`;
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartLine[]>([]);

  // Hydrate from localStorage once.
  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as CartLine[];
        if (Array.isArray(parsed)) setItems(parsed);
      }
    } catch {
      // ignore corrupted storage
    }
  }, []);

  // Persist on every change.
  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      // storage may be unavailable (private mode); cart still works in memory
    }
  }, [items]);

  const value = useMemo<CartContextValue>(() => {
    const addItem = (line: CartLine) => {
      const key = lineKey(line);
      setItems((prev) => {
        const existing = prev.find((i) => lineKey(i) === key);
        if (existing) {
          return prev.map((i) =>
            lineKey(i) === key ? { ...i, quantity: i.quantity + line.quantity } : i
          );
        }
        return [...prev, line];
      });
    };

    const updateQuantity = (key: string, quantity: number) => {
      if (quantity <= 0) {
        setItems((prev) => prev.filter((i) => lineKey(i) !== key));
        return;
      }
      setItems((prev) =>
        prev.map((i) => (lineKey(i) === key ? { ...i, quantity } : i))
      );
    };

    const removeItem = (key: string) => {
      setItems((prev) => prev.filter((i) => lineKey(i) !== key));
    };

    const clear = () => setItems([]);

    const count = items.reduce((sum, i) => sum + i.quantity, 0);

    return { items, count, addItem, updateQuantity, removeItem, clear };
  }, [items]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) {
    throw new Error("useCart debe usarse dentro de <CartProvider>");
  }
  return ctx;
}
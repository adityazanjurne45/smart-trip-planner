import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { toast } from "sonner";

export interface WishlistItem {
  id: string;
  name: string;
  type: "hotel" | "place" | "food" | "transport";
  location: string;
  image?: string;
  price?: string;
  rating?: string;
  addedAt: string;
}

interface WishlistContextType {
  items: WishlistItem[];
  addItem: (item: Omit<WishlistItem, "id" | "addedAt">) => void;
  removeItem: (id: string) => void;
  isInWishlist: (name: string, type: string) => boolean;
  toggleItem: (item: Omit<WishlistItem, "id" | "addedAt">) => void;
  clearAll: () => void;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

const STORAGE_KEY = "travello_wishlist";

export const WishlistProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<WishlistItem[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch { return []; }
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  const isInWishlist = useCallback((name: string, type: string) => {
    return items.some(i => i.name === name && i.type === type);
  }, [items]);

  const addItem = useCallback((item: Omit<WishlistItem, "id" | "addedAt">) => {
    if (items.some(i => i.name === item.name && i.type === item.type)) return;
    const newItem: WishlistItem = {
      ...item,
      id: crypto.randomUUID(),
      addedAt: new Date().toISOString(),
    };
    setItems(prev => [newItem, ...prev]);
    toast.success("Added to Wishlist ❤️");
  }, [items]);

  const removeItem = useCallback((id: string) => {
    setItems(prev => prev.filter(i => i.id !== id));
    toast("Removed from Wishlist ❌");
  }, []);

  const toggleItem = useCallback((item: Omit<WishlistItem, "id" | "addedAt">) => {
    const existing = items.find(i => i.name === item.name && i.type === item.type);
    if (existing) {
      removeItem(existing.id);
    } else {
      addItem(item);
    }
  }, [items, addItem, removeItem]);

  const clearAll = useCallback(() => {
    setItems([]);
    toast("Wishlist cleared");
  }, []);

  return (
    <WishlistContext.Provider value={{ items, addItem, removeItem, isInWishlist, toggleItem, clearAll }}>
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const ctx = useContext(WishlistContext);
  if (!ctx) throw new Error("useWishlist must be used within WishlistProvider");
  return ctx;
};

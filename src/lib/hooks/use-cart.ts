import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { CartItem, Cart } from '@/types';

interface CartStore extends Cart {
  addItem: (item: Omit<CartItem, 'quantity'>) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  isOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
}

function calculateSubtotal(items: CartItem[]): number {
  return items.reduce((sum, item) => sum + item.price * item.quantity, 0);
}

function calculateItemCount(items: CartItem[]): number {
  return items.reduce((count, item) => count + item.quantity, 0);
}

export const useCartStore = create<CartStore>()(
  persist(
    (set) => ({
      items: [],
      subtotal: 0,
      itemCount: 0,
      isOpen: false,

      addItem: (newItem) => {
        set((state) => {
          const existingIndex = state.items.findIndex(
            (item) => item.productId === newItem.productId
          );

          let updatedItems: CartItem[];

          if (existingIndex >= 0) {
            updatedItems = state.items.map((item, index) =>
              index === existingIndex
                ? { ...item, quantity: item.quantity + 1 }
                : item
            );
          } else {
            updatedItems = [...state.items, { ...newItem, quantity: 1 }];
          }

          return {
            items: updatedItems,
            subtotal: calculateSubtotal(updatedItems),
            itemCount: calculateItemCount(updatedItems),
            isOpen: true,
          };
        });
      },

      removeItem: (productId) => {
        set((state) => {
          const updatedItems = state.items.filter(
            (item) => item.productId !== productId
          );
          return {
            items: updatedItems,
            subtotal: calculateSubtotal(updatedItems),
            itemCount: calculateItemCount(updatedItems),
          };
        });
      },

      updateQuantity: (productId, quantity) => {
        set((state) => {
          if (quantity <= 0) {
            const updatedItems = state.items.filter(
              (item) => item.productId !== productId
            );
            return {
              items: updatedItems,
              subtotal: calculateSubtotal(updatedItems),
              itemCount: calculateItemCount(updatedItems),
            };
          }

          const updatedItems = state.items.map((item) =>
            item.productId === productId ? { ...item, quantity } : item
          );
          return {
            items: updatedItems,
            subtotal: calculateSubtotal(updatedItems),
            itemCount: calculateItemCount(updatedItems),
          };
        });
      },

      clearCart: () => {
        set({ items: [], subtotal: 0, itemCount: 0 });
      },

      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),
      toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),
    }),
    {
      name: 'bhg-cart',
      partialize: (state) => ({
        items: state.items,
        subtotal: state.subtotal,
        itemCount: state.itemCount,
      }),
    }
  )
);

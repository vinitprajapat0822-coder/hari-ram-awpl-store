"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Product } from "@/data/products";
import {
  getCartItemCount,
  getCartSubtotal,
  generateWhatsAppMessage as buildWhatsAppMessage,
  getWhatsAppUrl as buildWhatsAppUrl,
  normalizeQuantity,
} from "@/lib/order";

export type CartItem = {
  product: Product;
  quantity: number;
};

export type UserDetails = {
  name: string;
  phone: string;
  address: string;
};

type StoreState = {
  cart: CartItem[];
  user: UserDetails;
  addToCart: (product: Product) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  setUser: (user: UserDetails) => void;
  getCartTotal: () => number;
  getCartCount: () => number;
};

const emptyUser: UserDetails = {
  name: "",
  phone: "",
  address: "",
};

export const useStore = create<StoreState>()(
  persist(
    (set, get) => ({
      cart: [],
      user: emptyUser,

      addToCart: (product) => {
        if (!product.id) return;

        set((state) => {
          const existing = state.cart.find(
            (item) => item.product.id === product.id
          );

          if (existing) {
            return {
              cart: state.cart.map((item) =>
                item.product.id === product.id
                  ? {
                      ...item,
                      product,
                      quantity: normalizeQuantity(item.quantity) + 1,
                    }
                  : item
              ),
            };
          }

          return {
            cart: [...state.cart, { product, quantity: 1 }],
          };
        });
      },

      removeFromCart: (productId) => {
        set((state) => ({
          cart: state.cart.filter((item) => item.product.id !== productId),
        }));
      },

      updateQuantity: (productId, quantity) => {
        const normalized = normalizeQuantity(quantity);

        if (normalized === 0) {
          get().removeFromCart(productId);
          return;
        }

        set((state) => ({
          cart: state.cart.map((item) =>
            item.product.id === productId
              ? { ...item, quantity: normalized }
              : item
          ),
        }));
      },

      clearCart: () => set({ cart: [] }),

      setUser: (user) =>
        set({
          user: {
            name: user.name.trim(),
            phone: user.phone.trim(),
            address: user.address.trim(),
          },
        }),

      getCartTotal: () => getCartSubtotal(get().cart),

      getCartCount: () => getCartItemCount(get().cart),
    }),
    {
      name: "hari-ram-awpl-store",
      partialize: (state) => ({
        cart: state.cart,
        user: state.user,
      }),
    }
  )
);

export function generateWhatsAppMessage(
  cart: CartItem[],
  user: UserDetails
): string {
  return buildWhatsAppMessage(cart, user);
}

export function getWhatsAppUrl(message: string): string {
  return buildWhatsAppUrl(message);
}

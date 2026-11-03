"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Product } from "@/data/products";

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

export const useStore = create<StoreState>()(
  persist(
    (set, get) => ({
      cart: [],
      user: { name: "", phone: "", address: "" },

      addToCart: (product) => {
        const existing = get().cart.find((i) => i.product.id === product.id);
        if (existing) {
          set({
            cart: get().cart.map((i) =>
              i.product.id === product.id
                ? { ...i, quantity: i.quantity + 1 }
                : i
            ),
          });
        } else {
          set({ cart: [...get().cart, { product, quantity: 1 }] });
        }
      },

      removeFromCart: (productId) => {
        set({ cart: get().cart.filter((i) => i.product.id !== productId) });
      },

      updateQuantity: (productId, quantity) => {
        if (quantity <= 0) {
          get().removeFromCart(productId);
          return;
        }
        set({
          cart: get().cart.map((i) =>
            i.product.id === productId ? { ...i, quantity } : i
          ),
        });
      },

      clearCart: () => set({ cart: [] }),

      setUser: (user) => set({ user }),

      getCartTotal: () =>
        get().cart.reduce((sum, i) => sum + i.product.mrp * i.quantity, 0),

      getCartCount: () =>
        get().cart.reduce((sum, i) => sum + i.quantity, 0),
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
  user: UserDetails,
  total: number
) {
  const lines: string[] = [];
  lines.push("*Hari Ram AWPL Store - New Order*");
  lines.push("");

  cart.forEach((item, idx) => {
    const lineTotal = item.product.mrp * item.quantity;
    lines.push(
      `${idx + 1}. ${item.product.name} × ${item.quantity} = ₹${lineTotal.toLocaleString("en-IN")}`
    );
  });

  lines.push("");
  lines.push(`*Subtotal:* ₹${total.toLocaleString("en-IN")}`);
  lines.push(`*Total:* ₹${total.toLocaleString("en-IN")}`);
  lines.push("");
  lines.push(`*Customer Details*`);
  lines.push(`Name: ${user.name || "Not provided"}`);
  lines.push(`Phone: ${user.phone || "Not provided"}`);
  lines.push(`Address: ${user.address || "Not provided"}`);
  lines.push("");
  lines.push("Please confirm stock & delivery.");

  return lines.join("\n");
}

export function getWhatsAppUrl(message: string) {
  const phone = "919799133838";
  const encoded = encodeURIComponent(message);
  return `https://wa.me/${phone}?text=${encoded}`;
}

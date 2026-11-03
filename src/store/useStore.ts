"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { products } from "@/data/products";
import type { Product } from "@/data/products";
import type { ProductVariant } from "@/data/catalogue";

export type CartItem = {
  product: Product;
  variant?: ProductVariant;
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
  addToCart: (product: Product, variant?: ProductVariant) => void;
  removeFromCart: (productId: string, variantId?: string) => void;
  updateQuantity: (productId: string, quantity: number, variantId?: string) => void;
  clearCart: () => void;
  setUser: (user: UserDetails) => void;
  getCartTotal: () => number;
  getCartCount: () => number;
};

const currentProducts = new Map(products.map((product) => [product.id, product]));

function isSameCartLine(item: CartItem, productId: string, variantId?: string) {
  return (
    item.product.id === productId &&
    (item.variant?.id ?? null) === (variantId ?? null)
  );
}

export const useStore = create<StoreState>()(
  persist(
    (set, get) => ({
      cart: [],
      user: { name: "", phone: "", address: "" },

      addToCart: (product, variant) => {
        if (product.status !== "VERIFIED") return;
        if (product.variants.length > 0 && !variant) return;
        if (variant && !product.variants.some((item) => item.id === variant.id)) return;

        const existing = get().cart.find((item) =>
          isSameCartLine(item, product.id, variant?.id)
        );

        if (existing) {
          set({
            cart: get().cart.map((item) =>
              isSameCartLine(item, product.id, variant?.id)
                ? { ...item, quantity: item.quantity + 1 }
                : item
            ),
          });
        } else {
          set({
            cart: [...get().cart, { product, variant, quantity: 1 }],
          });
        }
      },

      removeFromCart: (productId, variantId) => {
        set({
          cart: get().cart.filter(
            (item) => !isSameCartLine(item, productId, variantId)
          ),
        });
      },

      updateQuantity: (productId, quantity, variantId) => {
        if (quantity <= 0) {
          get().removeFromCart(productId, variantId);
          return;
        }
        set({
          cart: get().cart.map((item) =>
            isSameCartLine(item, productId, variantId)
              ? { ...item, quantity }
              : item
          ),
        });
      },

      clearCart: () => set({ cart: [] }),
      setUser: (user) => set({ user }),

      getCartTotal: () =>
        get().cart.reduce((sum, item) => sum + item.product.mrp * item.quantity, 0),

      getCartCount: () =>
        get().cart.reduce((sum, item) => sum + item.quantity, 0),
    }),
    {
      name: "hari-ram-awpl-store",
      version: 2,
      skipHydration: true,
      migrate: (persistedState) => {
        const saved = persistedState as {
          cart?: Array<{
            product?: { id?: string };
            quantity?: number;
            variant?: { id?: string };
          }>;
          user?: Partial<UserDetails>;
        };

        const cart: CartItem[] = (saved.cart ?? []).flatMap((savedItem) => {
          const productId = savedItem.product?.id;
          const product = productId ? currentProducts.get(productId) : undefined;
          if (!product || product.status !== "VERIFIED") return [];

          const variant = savedItem.variant?.id
            ? product.variants.find((item) => item.id === savedItem.variant?.id)
            : undefined;

          if (product.variants.length > 0 && !variant) return [];

          return [{
            product,
            ...(variant ? { variant } : {}),
            quantity:
              typeof savedItem.quantity === "number" && savedItem.quantity > 0
                ? Math.floor(savedItem.quantity)
                : 1,
          }];
        });

        return {
          cart,
          user: {
            name: typeof saved.user?.name === "string" ? saved.user.name : "",
            phone: typeof saved.user?.phone === "string" ? saved.user.phone : "",
            address:
              typeof saved.user?.address === "string" ? saved.user.address : "",
          },
        };
      },
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

  cart.forEach((item, index) => {
    const variantText = item.variant ? ` — ${item.variant.label}` : "";
    const lineTotal = item.product.mrp * item.quantity;
    lines.push(
      `${index + 1}. ${item.product.name}${variantText} × ${item.quantity} = ₹${lineTotal.toLocaleString("en-IN")}`
    );
  });

  lines.push("");
  lines.push(`*Total (MRP):* ₹${total.toLocaleString("en-IN")}`);
  lines.push("");
  lines.push("*Customer Details*");
  lines.push(`Name: ${user.name || "Not provided"}`);
  lines.push(`Phone: ${user.phone || "Not provided"}`);
  lines.push(`Address: ${user.address || "Not provided"}`);
  lines.push("");
  lines.push("Please confirm stock, current MRP and delivery before accepting the order.");

  return lines.join("\n");
}

export function getWhatsAppUrl(message: string) {
  const phone = "919799133838";
  const encoded = encodeURIComponent(message);
  return `https://wa.me/${phone}?text=${encoded}`;
}

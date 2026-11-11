"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Product } from "@/data/products";
import { storefrontConfig } from "@/data/storefront-config";

export type CartItem = { product: Product; quantity: number };
export type UserDetails = { name: string; phone: string; address: string };

type StoreState = {
  cart: CartItem[];
  user: UserDetails;
  wishlistIds: string[];
  addToCart: (product: Product) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  setUser: (user: UserDetails) => void;
  toggleWishlist: (productId: string) => void;
  removeFromWishlist: (productId: string) => void;
  getCartTotal: () => number;
  getCartCount: () => number;
};

const MAX_CART_QUANTITY = 99;
const emptyUser: UserDetails = { name: "", phone: "", address: "" };

function isOrderableProduct(product: Product | undefined): product is Product {
  return Boolean(product && product.status === "VERIFIED" && Number.isFinite(product.mrp) && product.mrp > 0);
}

function sanitizeUser(value: unknown): UserDetails {
  if (!value || typeof value !== "object") return { ...emptyUser };
  const candidate = value as Partial<Record<keyof UserDetails, unknown>>;
  const safeString = (entry: unknown, maxLength: number) => typeof entry === "string" ? entry.slice(0, maxLength) : "";
  return {
    name: safeString(candidate.name, 120),
    phone: safeString(candidate.phone, 32),
    address: safeString(candidate.address, 500),
  };
}

export const useStore = create<StoreState>()(
  persist(
    (set, get) => ({
      cart: [],
      user: { ...emptyUser },
      wishlistIds: [],

      addToCart: (product) => {
        if (!isOrderableProduct(product)) return;
        const existing = get().cart.find((item) => item.product.id === product.id);
        if (existing) {
          if (existing.quantity >= MAX_CART_QUANTITY) return;
          set({
            cart: get().cart.map((item) =>
              item.product.id === product.id
                ? { ...item, quantity: Math.min(MAX_CART_QUANTITY, item.quantity + 1) }
                : item
            ),
          });
        } else {
          set({ cart: [...get().cart, { product, quantity: 1 }] });
        }
      },

      removeFromCart: (productId) => set({ cart: get().cart.filter((item) => item.product.id !== productId) }),

      updateQuantity: (productId, quantity) => {
        if (!Number.isFinite(quantity)) return;
        const safeQuantity = Math.floor(quantity);
        if (safeQuantity <= 0) {
          get().removeFromCart(productId);
          return;
        }
        set({
          cart: get().cart.map((item) =>
            item.product.id === productId
              ? { ...item, quantity: Math.min(MAX_CART_QUANTITY, safeQuantity) }
              : item
          ),
        });
      },

      clearCart: () => set({ cart: [] }),
      setUser: (user) => set({ user: sanitizeUser(user) }),

      toggleWishlist: (productId) => {
        if (!productId) return;
        const current = get().wishlistIds;
        set({
          wishlistIds: current.includes(productId)
            ? current.filter((id) => id !== productId)
            : [...current, productId],
        });
      },

      removeFromWishlist: (productId) => set({ wishlistIds: get().wishlistIds.filter((id) => id !== productId) }),

      getCartTotal: () => get().cart.reduce((sum, item) => {
        const lineTotal = item.product.mrp * item.quantity;
        return Number.isFinite(lineTotal) && lineTotal > 0 ? sum + lineTotal : sum;
      }, 0),

      getCartCount: () => get().cart.reduce((sum, item) => sum + Math.min(MAX_CART_QUANTITY, item.quantity), 0),
    }),
    {
      name: "hari-ram-awpl-store",
      version: 4,
      skipHydration: true,
      // Resolve saved SKU identifiers against the current catalogue. Never trust
      // stale persisted prices, orderability flags or unbounded quantities.
      migrate: async (persistedState) => {
        const { products } = await import("@/data/products");
        const currentProducts = new Map(products.map((product) => [product.id, product]));
        const saved = persistedState as { cart?: unknown; user?: unknown; wishlistIds?: unknown };
        const cartById = new Map<string, CartItem>();
        const savedCart = Array.isArray(saved.cart) ? saved.cart : [];

        savedCart.forEach((candidate) => {
          if (!candidate || typeof candidate !== "object") return;
          const savedItem = candidate as {
            product?: { id?: unknown };
            quantity?: unknown;
            variant?: { id?: unknown };
          };
          const productId = typeof savedItem.product?.id === "string" ? savedItem.product.id : "";
          const variantId = typeof savedItem.variant?.id === "string" ? savedItem.variant.id : "";
          const matchedProduct =
            (variantId ? currentProducts.get(`${productId}-${variantId}`) : undefined) ??
            currentProducts.get(productId);
          if (!isOrderableProduct(matchedProduct)) return;

          const rawQuantity = typeof savedItem.quantity === "number" ? savedItem.quantity : 1;
          const quantity = Number.isFinite(rawQuantity)
            ? Math.max(1, Math.min(MAX_CART_QUANTITY, Math.floor(rawQuantity)))
            : 1;
          const existing = cartById.get(matchedProduct.id);
          cartById.set(matchedProduct.id, {
            product: matchedProduct,
            quantity: Math.min(MAX_CART_QUANTITY, quantity + (existing?.quantity ?? 0)),
          });
        });

        const wishlistIds = Array.isArray(saved.wishlistIds)
          ? Array.from(new Set(saved.wishlistIds.filter(
              (id): id is string => typeof id === "string" && currentProducts.has(id)
            )))
          : [];

        return { cart: Array.from(cartById.values()), user: sanitizeUser(saved.user), wishlistIds };
      },
      partialize: (state) => ({ cart: state.cart, user: state.user, wishlistIds: state.wishlistIds }),
    }
  )
);

export function generateWhatsAppMessage(cart: CartItem[], user: UserDetails, total: number) {
  const lines: string[] = [];
  lines.push("*Hari Ram AWPL Store - New Order*");
  lines.push("");
  cart.forEach((item, index) => {
    const lineTotal = item.product.mrp * item.quantity;
    lines.push(`${index + 1}. ${item.product.name} (${item.product.qty}) × ${item.quantity} = ₹${lineTotal.toLocaleString("en-IN")}`);
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
  const phone = storefrontConfig.whatsapp.number;
  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
}

"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { products } from "@/data/products";
import type { Product } from "@/data/products";
import { localizedProductName } from "@/i18n/product-labels";

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

const currentProducts = new Map(products.map((product) => [product.id, product]));

export const useStore = create<StoreState>()(
  persist(
    (set, get) => ({
      cart: [],
      user: { name: "", phone: "", address: "" },

      addToCart: (product) => {
        if (product.status !== "VERIFIED") return;
        const existing = get().cart.find((item) => item.product.id === product.id);
        if (existing) {
          set({
            cart: get().cart.map((item) =>
              item.product.id === product.id
                ? { ...item, quantity: item.quantity + 1 }
                : item
            ),
          });
        } else {
          set({ cart: [...get().cart, { product, quantity: 1 }] });
        }
      },

      removeFromCart: (productId) => {
        set({ cart: get().cart.filter((item) => item.product.id !== productId) });
      },

      updateQuantity: (productId, quantity) => {
        if (quantity <= 0) {
          get().removeFromCart(productId);
          return;
        }
        set({
          cart: get().cart.map((item) =>
            item.product.id === productId ? { ...item, quantity } : item
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
      version: 3,
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
          const variantId = savedItem.variant?.id;
          const standaloneProduct = productId
            ? (variantId
                ? currentProducts.get(`${productId}-${variantId}`)
                : undefined) ?? currentProducts.get(productId)
            : undefined;

          if (!standaloneProduct || standaloneProduct.status !== "VERIFIED") return [];

          return [{
            product: standaloneProduct,
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
  total: number,
  locale: "en" | "hi" = "en"
) {
  const lines: string[] = [];
  lines.push(locale === "hi" ? "*HARI RAM AWPL STORE - नया ऑर्डर*" : "*HARI RAM AWPL STORE - New Order*");
  lines.push(locale === "hi" ? "स्टोर संचालक: Hariram Prajapat" : "Store owner: Hariram Prajapat");
  lines.push("");

  cart.forEach((item, index) => {
    const lineTotal = item.product.mrp * item.quantity;
    lines.push(
      `${index + 1}. ${locale === "hi" ? localizedProductName(item.product.nameHi || item.product.name) : item.product.name} (${item.product.qty}) × ${item.quantity} = ₹${lineTotal.toLocaleString("en-IN")}`
    );
  });

  lines.push("");
  lines.push(locale === "hi" ? `*कुल सूची कीमत:* ₹${total.toLocaleString("en-IN")}` : `*Total (MRP):* ₹${total.toLocaleString("en-IN")}`);
  lines.push("");
  lines.push(locale === "hi" ? "*ग्राहक की जानकारी*" : "*Customer Details*");
  lines.push(`${locale === "hi" ? "नाम" : "Name"}: ${user.name || (locale === "hi" ? "नहीं दिया" : "Not provided")}`);
  lines.push(`${locale === "hi" ? "मोबाइल" : "Phone"}: ${user.phone || (locale === "hi" ? "नहीं दिया" : "Not provided")}`);
  lines.push(`${locale === "hi" ? "पता" : "Address"}: ${user.address || (locale === "hi" ? "नहीं दिया" : "Not provided")}`);
  lines.push("");
  lines.push(locale === "hi" ? "ऑर्डर स्वीकार करने से पहले अंतिम कीमत और डिलीवरी की पुष्टि करें।" : "Please confirm the final price and delivery details before accepting the order.");

  return lines.join("\n");
}

export function getWhatsAppUrl(message: string) {
  const phone = "919799133838";
  const encoded = encodeURIComponent(message);
  return `https://wa.me/${phone}?text=${encoded}`;
}

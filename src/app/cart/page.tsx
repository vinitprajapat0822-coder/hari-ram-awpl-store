"use client";

import {
  useStore,
  generateWhatsAppMessage,
  getWhatsAppUrl,
} from "@/store/useStore";
import { formatPrice } from "@/lib/utils";
import {
  DEFAULT_PRICE_BASIS,
  getUnitPrice,
  validateCustomerDetails,
} from "@/lib/order";
import Navbar from "@/components/Navbar";
import GlassCard from "@/components/GlassCard";
import ProductImage from "@/components/ProductImage";
import { Minus, Plus, Trash2, MessageCircle } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function CartPage() {
  const cart = useStore((state) => state.cart);
  const user = useStore((state) => state.user);
  const updateQuantity = useStore((state) => state.updateQuantity);
  const removeFromCart = useStore((state) => state.removeFromCart);
  const total = useStore((state) => state.getCartTotal());
  const router = useRouter();

  const handleCheckout = () => {
    if (cart.length === 0) return;

    const profileErrors = validateCustomerDetails(user);
    if (Object.keys(profileErrors).length > 0) {
      router.push("/profile?from=checkout");
      return;
    }

    const message = generateWhatsAppMessage(cart, user);
    const url = getWhatsAppUrl(message);
    window.location.assign(url);
  };

  return (
    <main className="min-h-screen pb-32">
      <Navbar />

      <div className="max-w-2xl mx-auto px-4 pt-6">
        <h1 className="text-2xl font-bold mb-6">Your Cart</h1>

        {cart.length === 0 ? (
          <GlassCard className="p-10 text-center">
            <p className="text-white/60 mb-4">Cart is empty</p>
            <Link
              href="/"
              className="inline-block px-6 py-3 rounded-xl bg-cyan-500 text-black font-medium"
            >
              Browse Products
            </Link>
          </GlassCard>
        ) : (
          <div className="space-y-4">
            {cart.map((item) => {
              const unitPrice = getUnitPrice(item.product, DEFAULT_PRICE_BASIS);
              const lineTotal = unitPrice * item.quantity;

              return (
                <GlassCard key={item.product.id} className="p-4">
                  <div className="flex gap-4">
                    <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-600/10 shrink-0 overflow-hidden">
                      <ProductImage
                        key={item.product.id}
                        src={item.product.image}
                        alt={item.product.name}
                        fallbackText={item.product.name.charAt(0).toUpperCase()}
                        className="h-full w-full"
                      />
                    </div>

                    <div className="flex-1 min-w-0">
                      <Link
                        href={"/products/" + encodeURIComponent(item.product.id)}
                        className="font-medium text-white truncate hover:text-cyan-200"
                      >
                        {item.product.name}
                      </Link>
                      <p className="text-sm text-white/50">{item.product.qty}</p>
                      <p className="text-cyan-400 font-semibold mt-1">
                        {formatPrice(lineTotal)}
                      </p>
                    </div>

                    <div className="flex flex-col items-end gap-2">
                      <button
                        type="button"
                        onClick={() => removeFromCart(item.product.id)}
                        aria-label={"Remove " + item.product.name + " from cart"}
                        className="p-1.5 text-white/40 hover:text-red-400 transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>

                      <div className="flex items-center gap-2 bg-white/5 rounded-lg px-1">
                        <button
                          type="button"
                          onClick={() =>
                            updateQuantity(item.product.id, item.quantity - 1)
                          }
                          aria-label={"Decrease quantity of " + item.product.name}
                          className="p-1.5 text-white/70 hover:text-white"
                        >
                          <Minus size={14} />
                        </button>
                        <span
                          className="w-6 text-center text-sm font-medium"
                          aria-live="polite"
                        >
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() =>
                            updateQuantity(item.product.id, item.quantity + 1)
                          }
                          aria-label={"Increase quantity of " + item.product.name}
                          className="p-1.5 text-white/70 hover:text-white"
                        >
                          <Plus size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                </GlassCard>
              );
            })}

            <GlassCard className="p-5 mt-6">
              <div className="flex justify-between text-lg font-semibold mb-4">
                <span>Total</span>
                <span className="text-cyan-400">{formatPrice(total)}</span>
              </div>

              <button
                type="button"
                onClick={handleCheckout}
                className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-500 text-black font-bold text-lg shadow-lg shadow-cyan-500/30 active:scale-[0.98] transition-transform"
              >
                <MessageCircle size={22} />
                Order on WhatsApp
              </button>

              <p className="text-center text-xs text-white/40 mt-3">
                WhatsApp will open with an order request. Review the details
                before sending.
              </p>
            </GlassCard>
          </div>
        )}
      </div>
    </main>
  );
}

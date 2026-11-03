"use client";

import { useStore, generateWhatsAppMessage, getWhatsAppUrl } from "@/store/useStore";
import { formatPrice } from "@/lib/utils";
import Navbar from "@/components/Navbar";
import GlassCard from "@/components/GlassCard";
import { Minus, Plus, Trash2, MessageCircle } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function CartPage() {
  const { cart, user, updateQuantity, removeFromCart, getCartTotal } = useStore();
  const total = getCartTotal();
  const router = useRouter();

  const handleCheckout = () => {
    if (cart.length === 0) return;

    if (!user.name || !user.phone || !user.address) {
      router.push("/profile?from=checkout");
      return;
    }

    const message = generateWhatsAppMessage(cart, user, total);
    const url = getWhatsAppUrl(message);
    window.open(url, "_blank");
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
            {cart.map((item) => (
              <GlassCard key={item.product.id} className="p-4">
                <div className="flex gap-4">
                  <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-600/10 flex items-center justify-center text-xl font-bold text-cyan-400/50 shrink-0">
                    {item.product.name.charAt(0)}
                  </div>

                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-white truncate">
                      {item.product.name}
                    </h3>
                    <p className="text-sm text-white/50">{item.product.qty}</p>
                    <p className="text-cyan-400 font-semibold mt-1">
                      {formatPrice(item.product.mrp * item.quantity)}
                    </p>
                  </div>

                  <div className="flex flex-col items-end gap-2">
                    <button
                      onClick={() => removeFromCart(item.product.id)}
                      className="p-1.5 text-white/40 hover:text-red-400 transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>

                    <div className="flex items-center gap-2 bg-white/5 rounded-lg px-1">
                      <button
                        onClick={() =>
                          updateQuantity(item.product.id, item.quantity - 1)
                        }
                        className="p-1.5 text-white/70 hover:text-white"
                      >
                        <Minus size={14} />
                      </button>
                      <span className="w-6 text-center text-sm font-medium">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() =>
                          updateQuantity(item.product.id, item.quantity + 1)
                        }
                        className="p-1.5 text-white/70 hover:text-white"
                      >
                        <Plus size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              </GlassCard>
            ))}

            <GlassCard className="p-5 mt-6">
              <div className="flex justify-between text-lg font-semibold mb-4">
                <span>Total</span>
                <span className="text-cyan-400">{formatPrice(total)}</span>
              </div>

              <button
                onClick={handleCheckout}
                className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-500 text-black font-bold text-lg shadow-lg shadow-cyan-500/30 active:scale-[0.98] transition-transform"
              >
                <MessageCircle size={22} />
                Order on WhatsApp
              </button>

              <p className="text-center text-xs text-white/40 mt-3">
                You will be redirected to WhatsApp with your order details
              </p>
            </GlassCard>
          </div>
        )}
      </div>
    </main>
  );
}

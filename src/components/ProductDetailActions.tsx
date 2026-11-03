"use client";

import { useState } from "react";
import type { Product } from "@/data/products";
import { Check, Plus } from "lucide-react";
import { useStore } from "@/store/useStore";

export default function ProductDetailActions({
  product,
}: {
  product: Product;
}) {
  const addToCart = useStore((state) => state.addToCart);
  const [added, setAdded] = useState(false);

  const handleAdd = () => {
    addToCart(product);
    setAdded(true);
    window.setTimeout(() => setAdded(false), 1200);
  };

  return (
    <button
      type="button"
      onClick={handleAdd}
      className="btn-cyan inline-flex items-center justify-center gap-2 rounded-2xl px-6 py-3"
    >
      {added ? <Check size={18} /> : <Plus size={18} />}
      {added ? "Added to cart" : "Add to cart"}
    </button>
  );
}

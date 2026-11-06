import type { CartItem, UserDetails } from "@/store/useStore";
import { getSupabaseClient } from "@/lib/supabase";

export type OrderStatus =
  | "ORDER_PLACED"
  | "ORDER_ACCEPTED"
  | "PACKED"
  | "SHIPPED"
  | "IN_TRANSIT"
  | "OUT_FOR_DELIVERY"
  | "DELIVERED";

export type OrderUpdateStatus =
  | OrderStatus
  | "DELIVERY_DELAYED"
  | "AVAILABILITY_CONFIRMED"
  | "DELIVERY_SCHEDULED";

export type OrderItemRecord = {
  id: string;
  order_id: string;
  product_id: string;
  product_name: string;
  pack_size: string;
  mrp: number;
  selling_price: number | null;
  quantity: number;
  line_mrp: number;
  reviews?: Array<{ id: string; status: "PENDING" | "APPROVED" | "REJECTED" }>;
};

export type OrderUpdateRecord = {
  id: string;
  status: OrderUpdateStatus;
  message: string | null;
  eta_date: string | null;
  eta_start: string | null;
  eta_end: string | null;
  created_at: string;
};

export type StoreOrder = {
  id: string;
  order_number: string;
  customer_id: string;
  customer_name: string;
  phone: string;
  delivery_address: string;
  status: OrderStatus;
  availability_confirmed: boolean;
  subtotal_mrp: number;
  final_total: number | null;
  expected_delivery_date: string | null;
  expected_delivery_start: string | null;
  expected_delivery_end: string | null;
  created_at: string;
  order_items: OrderItemRecord[];
  order_updates: OrderUpdateRecord[];
};

export type StoreReview = {
  id: string;
  product_id: string;
  order_id: string;
  order_item_id: string;
  rating: number;
  quality_note: string;
  packaging_note: string;
  delivery_note: string;
  created_at: string;
  review_images: Array<{ storage_path: string }>;
};

export type CreatedOrder = { id: string; order_number: string };

export async function createStoreOrder(
  cart: CartItem[],
  customer: UserDetails
): Promise<CreatedOrder> {
  const client = getSupabaseClient();
  if (!client) throw new Error("Online order tracking is not configured yet.");

  const { data: sessionData, error: sessionError } = await client.auth.getSession();
  if (sessionError) throw new Error(sessionError.message);
  if (!sessionData.session?.user?.id) {
    throw new Error("Sign in to your customer account before placing a tracked order.");
  }
  if (!Array.isArray(cart) || cart.length === 0 || cart.length > 30) {
    throw new Error("The cart must contain between 1 and 30 distinct products.");
  }

  const items = cart.map((item) => ({
    product_id: item.product.id,
    quantity: Math.min(99, Math.max(1, Math.floor(item.quantity))),
  }));

  const { data, error } = await client.rpc("create_store_order", {
    p_customer_name: customer.name.trim(),
    p_phone: customer.phone.trim(),
    p_address: customer.address.trim(),
    p_items: items,
  });
  if (error) throw new Error(error.message);

  const result = data as CreatedOrder | null;
  if (!result || typeof result.id !== "string" || typeof result.order_number !== "string") {
    throw new Error("The database did not return a valid order reference.");
  }
  return result;
}

export function formatOrderDate(value: string, locale: "en" | "hi" = "en"): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return locale === "hi" ? "तारीख उपलब्ध नहीं" : "Date unavailable";
  return date.toLocaleString(locale === "hi" ? "hi-IN" : "en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Asia/Kolkata",
  });
}

export function formatDeliveryDate(value: string | null, locale: "en" | "hi" = "en"): string {
  if (!value) return locale === "hi" ? "अभी तय नहीं" : "Not scheduled yet";
  const date = new Date(value + "T00:00:00+05:30");
  if (Number.isNaN(date.getTime())) return locale === "hi" ? "तारीख उपलब्ध नहीं" : "Not scheduled yet";
  return date.toLocaleDateString(locale === "hi" ? "hi-IN" : "en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    timeZone: "Asia/Kolkata",
  });
}

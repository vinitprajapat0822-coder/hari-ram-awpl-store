import type { Product } from "@/data/products";

export type PriceBasis = "mrp" | "dp";

export type CartLine = {
  product: Product;
  quantity: number;
};

export type CustomerDetails = {
  name: string;
  phone: string;
  address: string;
};

export type ProfileValidationErrors = Partial<
  Record<keyof CustomerDetails, string>
>;

// Preserve the existing MRP display until the store owner confirms the final price policy.
export const DEFAULT_PRICE_BASIS: PriceBasis = "mrp";

export function normalizeQuantity(value: number): number {
  if (!Number.isFinite(value)) return 0;
  return Math.max(0, Math.floor(value));
}

export function getUnitPrice(
  product: Product,
  basis: PriceBasis = DEFAULT_PRICE_BASIS
): number {
  const value = product[basis];
  return Number.isFinite(value) && value >= 0 ? value : 0;
}

export function getCartSubtotal(
  cart: CartLine[],
  basis: PriceBasis = DEFAULT_PRICE_BASIS
): number {
  return cart.reduce((total, item) => {
    const quantity = normalizeQuantity(item.quantity);
    return total + getUnitPrice(item.product, basis) * quantity;
  }, 0);
}

export function getCartItemCount(cart: CartLine[]): number {
  return cart.reduce(
    (total, item) => total + normalizeQuantity(item.quantity),
    0
  );
}

export function validateCustomerDetails(
  customer: CustomerDetails
): ProfileValidationErrors {
  const errors: ProfileValidationErrors = {};
  const name = customer.name.trim();
  const phone = customer.phone.trim();
  const address = customer.address.trim();

  if (name.length < 2) {
    errors.name = "Enter a name with at least 2 characters.";
  }

  if (!/^[6-9][0-9]{9}$/.test(phone)) {
    errors.phone = "Enter a valid 10-digit Indian mobile number.";
  }

  if (address.length < 8) {
    errors.address = "Enter a complete delivery address.";
  }

  return errors;
}

function safeMessageText(value: string): string {
  return value.replace(/[\r\n]+/g, " ").trim();
}

function formatAmount(value: number): string {
  return value.toLocaleString("en-IN", { maximumFractionDigits: 0 });
}

export function generateWhatsAppMessage(
  cart: CartLine[],
  customer: CustomerDetails,
  basis: PriceBasis = DEFAULT_PRICE_BASIS
): string {
  if (cart.length === 0) {
    throw new Error("Cannot create an order message for an empty cart.");
  }

  const lines = [
    "*Hari Ram AWPL Store — Order Request*",
    "",
    "*Products*",
  ];

  cart.forEach((item, index) => {
    const quantity = normalizeQuantity(item.quantity);
    if (quantity === 0) return;

    const lineTotal = getUnitPrice(item.product, basis) * quantity;
    const productLine =
      String(index + 1) +
      ". " +
      safeMessageText(item.product.name) +
      " × " +
      quantity +
      " = ₹" +
      formatAmount(lineTotal);
    lines.push(productLine);
  });

  const subtotal = getCartSubtotal(cart, basis);
  lines.push(
    "",
    "*Subtotal:* ₹" + formatAmount(subtotal),
    "*Total (before delivery charges):* ₹" + formatAmount(subtotal),
    "",
    "*Customer Details*",
    "Name: " + safeMessageText(customer.name),
    "Phone: " + safeMessageText(customer.phone),
    "Address: " + safeMessageText(customer.address),
    "",
    "Please confirm product availability, final price and delivery charges."
  );

  return lines.join("\n");
}

export function getWhatsAppUrl(
  message: string,
  configuredPhone = process.env.NEXT_PUBLIC_WHATSAPP_PHONE ?? "919799133838"
): string {
  const phone = configuredPhone.replace(/\D/g, "");

  if (!/^\d{10,15}$/.test(phone)) {
    throw new Error(
      "The WhatsApp store number must contain 10 to 15 digits, including country code."
    );
  }

  return "https://wa.me/" + phone + "?text=" + encodeURIComponent(message);
}

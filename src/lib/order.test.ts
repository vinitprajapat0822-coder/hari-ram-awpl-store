import assert from "node:assert/strict";
import test from "node:test";
import { products } from "@/data/products";
import {
  getCartItemCount,
  getCartSubtotal,
  getUnitPrice,
  generateWhatsAppMessage,
  getWhatsAppUrl,
  normalizeQuantity,
  validateCustomerDetails,
} from "@/lib/order";

const product = products[0];

test("price calculation uses the requested price field", () => {
  assert.equal(getUnitPrice(product, "mrp"), product.mrp);
  assert.equal(getUnitPrice(product, "dp"), product.dp);
});

test("cart totals use normalized positive integer quantities", () => {
  const cart = [
    { product, quantity: 2 },
    { product, quantity: 1.9 },
    { product, quantity: 0 },
    { product, quantity: Number.NaN },
  ];

  assert.equal(getCartSubtotal(cart), product.mrp * 3);
  assert.equal(getCartItemCount(cart), 3);
});

test("quantity normalization rejects non-finite and negative values", () => {
  assert.equal(normalizeQuantity(3.8), 3);
  assert.equal(normalizeQuantity(-2), 0);
  assert.equal(normalizeQuantity(Number.NaN), 0);
  assert.equal(normalizeQuantity(Number.POSITIVE_INFINITY), 0);
});

test("customer details validation accepts valid Indian details", () => {
  assert.deepEqual(
    validateCustomerDetails({
      name: "Hari Ram",
      phone: "9799133838",
      address: "Sikar, Rajasthan 332001",
    }),
    {}
  );
});

test("customer details validation reports invalid fields", () => {
  const errors = validateCustomerDetails({
    name: " ",
    phone: "12345",
    address: "Short",
  });

  assert.ok(errors.name);
  assert.ok(errors.phone);
  assert.ok(errors.address);
});

test("WhatsApp message includes a product line and an order-request label", () => {
  const message = generateWhatsAppMessage(
    [{ product, quantity: 2 }],
    {
      name: "Test Customer",
      phone: "9799133838",
      address: "Sikar, Rajasthan 332001",
    }
  );

  const formattedAmount = (product.mrp * 2).toLocaleString("en-IN", {
    maximumFractionDigits: 0,
  });

  assert.ok(message.includes("Order Request"));
  assert.ok(message.includes(product.name));
  assert.ok(message.includes(formattedAmount));
  assert.ok(message.includes("confirm product availability"));
});

test("WhatsApp URL encodes the message and validates the phone number", () => {
  const message = "Hello Store & thanks";
  const url = getWhatsAppUrl(message, "919799133838");

  assert.ok(url.startsWith("https://wa.me/919799133838?text="));
  assert.ok(url.includes(encodeURIComponent(message)));
  assert.throws(() => getWhatsAppUrl("Hello", "invalid"));
});

test("WhatsApp message refuses an empty cart", () => {
  assert.throws(
    () =>
      generateWhatsAppMessage(
        [],
        { name: "", phone: "", address: "" }
      ),
    /empty cart/
  );
});

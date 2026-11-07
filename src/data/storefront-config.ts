/**
 * Public-safe storefront configuration.
 * The WhatsApp number is the legacy destination already used by the live
 * storefront. Its ownership/authorisation is NOT confirmed. Keep it unchanged
 * to avoid silently breaking enquiries, but do not call it a verified seller
 * contact until the owner confirms it.
 */
export const storefrontConfig = {
  storeName: "Hari Ram AWPL Store",
  businessModel: "BOTH" as const,
  independentStoreDisclosure:
    "This is an independently operated product catalogue and order-enquiry storefront. It is not the official AWPL corporate website. No AWPL seller authorisation or affiliation is asserted by this notice.",
  orderAcceptanceDisclosure:
    "Sending an enquiry or WhatsApp message is not acceptance of an order. The seller must separately confirm the current MRP, product availability, delivery details and acceptance.",
  whatsapp: {
    number: "919799133838",
    verificationStatus: "OWNER_CONFIRMATION_REQUIRED" as const,
  },
} as const;

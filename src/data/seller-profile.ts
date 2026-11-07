/**
 * Internal seller/business verification record.
 * Unknown values intentionally remain null. This module is not imported by
 * client components. Do not populate it with guessed values or secrets.
 */

export type VerificationState =
  | "VERIFIED"
  | "OWNER_CONFIRMATION_REQUIRED"
  | "NOT_APPLICABLE"
  | "UNVERIFIED";

export type PendingOwnerField<T> = Readonly<{
  value: T | null;
  status: VerificationState;
  evidenceRequired: string;
}>;

const pending = <T>(evidenceRequired: string): PendingOwnerField<T> => ({
  value: null,
  status: "OWNER_CONFIRMATION_REQUIRED",
  evidenceRequired,
});

export const sellerProfile = {
  storeName: "Hari Ram AWPL Store",
  businessModel: "BOTH" as const,
  operationDescription:
    "Independent product catalogue and enquiry storefront with seller-reviewed order requests.",

  legalBusinessName: pending<string>("Confirm the exact legal name and supporting records."),
  sellerName: pending<string>("Confirm the person or legal entity acting as seller."),
  sellerAddress: pending<string>("Confirm the business/contact address and whether public display is required."),
  sellerEmail: pending<string>("Confirm a monitored customer-support email address."),
  sellerPhone: pending<string>("Confirm a monitored seller telephone number."),

  sellerAuthorisation: pending<string>("Obtain and review written authorisation or a legally enforceable direct-seller agreement before claiming authorised-seller status."),
  sellerRegistrationReference: pending<string>("Confirm the relevant registration/reference and whether public display is required."),

  gstin: pending<string>("Assess GST applicability for the actual seller and transaction model; do not assume."),
  pan: pending<string>("Confirm applicable tax identity and whether public display is legally required; do not publish private tax data by default."),
  fssaiRegistration: pending<string>("Identify the food business operator(s), role and applicable FSSAI licence/registration requirements before listing or transacting food products."),

  grievanceOfficerName: pending<string>("Confirm the responsible grievance contact after applicability and operating role are assessed."),
  grievanceEmail: pending<string>("Confirm a monitored grievance email address."),
  grievancePhone: pending<string>("Confirm a monitored grievance telephone number."),

  fulfilmentResponsibility: pending<string>("Identify who accepts, packs, dispatches and delivers each order."),
  returnsAndRefundsPolicy: pending<string>("Confirm the actual cancellation, return, replacement and refund process before publishing terms."),
  shippingPolicy: pending<string>("Confirm service areas, delivery method, charges and realistic timelines."),
  privacyPolicy: pending<string>("Confirm data controller, purposes, sharing, retention, rights/contact channel and applicable commencement requirements."),

  brandPermission: {
    status: "OWNER_CONFIRMATION_REQUIRED" as const,
    evidenceRequired: "Confirm permission or lawful basis for use of company names, logos and other brand assets.",
  },
  productImagePermission: {
    status: "OWNER_CONFIRMATION_REQUIRED" as const,
    evidenceRequired: "Confirm permission or lawful basis for hotlinking, copying and publicly displaying each product image.",
  },
  dpSpPermission: {
    status: "OWNER_CONFIRMATION_REQUIRED" as const,
    evidenceRequired: "Obtain an authorised, current source and public-display permission before displaying DP/SP or eligibility-based prices.",
  },
} as const;

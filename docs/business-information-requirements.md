# Business information and owner-verification register

**Project:** Hari Ram AWPL Store  
**Confirmed operating model:** C — both catalogue/enquiry and seller-reviewed order requests  
**Status:** Owner confirmations pending; this is an internal checklist, not a public legal disclosure.

## Confirmed operating model

The website is intended to support an independent catalogue, customer-initiated WhatsApp enquiries, cart preparation, and seller-reviewed order requests once a secure order backend exists. A submitted request must not be described as accepted until the seller confirms it.

## Required owner confirmations

| Item | Evidence / decision required | Status |
|---|---|---|
| Seller identity | Exact individual or legal-entity name acting as seller | OWNER CONFIRMATION REQUIRED |
| Business address | Actual address and decision on public display | OWNER CONFIRMATION REQUIRED |
| Customer support | Monitored email and phone contact | OWNER CONFIRMATION REQUIRED |
| WhatsApp destination | Confirm control/ownership and consent to use the existing destination | OWNER CONFIRMATION REQUIRED |
| Direct-seller authorisation | Written agreement/authorisation before claiming authorised-seller status | OWNER CONFIRMATION REQUIRED |
| Registration references | Determine which registrations apply to the actual seller and role | OWNER CONFIRMATION REQUIRED |
| GST | Determine registration and invoice obligations for the actual business model | OWNER CONFIRMATION REQUIRED |
| Food products | Identify food business operator(s), seller role and applicable FSSAI requirements | OWNER CONFIRMATION REQUIRED |
| Product classifications | Labels, licences, categories and claim evidence for regulated products | OWNER CONFIRMATION REQUIRED |
| Brand assets | Permission or lawful basis for company names, logos and visual assets | OWNER CONFIRMATION REQUIRED |
| Product imagery | Permission or lawful basis for each image source and use | OWNER CONFIRMATION REQUIRED |
| Fulfilment | Who holds stock, accepts orders, packs, dispatches and delivers | OWNER CONFIRMATION REQUIRED |
| Returns/refunds | Actual process, conditions, contact route and timelines | OWNER CONFIRMATION REQUIRED |
| Grievances | Applicable grievance process and responsible contact | OWNER CONFIRMATION REQUIRED |
| Customer data | Data controller, purpose, sharing, retention, deletion/contact route and WhatsApp hand-off | OWNER CONFIRMATION REQUIRED |
| DP/SP | Authorised source, eligibility rules and permission for public display | OWNER CONFIRMATION REQUIRED |

Do not enter fabricated values to clear this register. PAN, GSTIN, FSSAI and other registration fields must be assessed against the actual role and applicable rules; do not assume every number must be publicly displayed.

## Customer-data behaviour found in the current code

- The Zustand store persists cart items and the profile fields name, phone and address in browser local storage under the key hari-ram-awpl-store.
- The profile page states that details stay on the device and are included only when the customer chooses to prepare a WhatsApp message.
- The cart builds a prefilled WhatsApp message containing item details and saved customer details. The user still has to review and send that message.
- The current static site does not implement a site-operated order database or seller admin order-management service.
- The WhatsApp destination remains the legacy number +91 97991 33838; ownership is unverified. It is moved to central public configuration without changing it.

## Release gates

1. Do not claim official AWPL status or authorised-seller status without documentary evidence.
2. Do not publish legal identity, registration or grievance placeholders as real values.
3. Do not activate website order acceptance until a secure backend, seller identity and fulfilment process are confirmed.
4. Do not publish food products for online transaction until the relevant FSSAI role/licensing analysis is complete.
5. Do not publish DP/SP until the authorised source and public-display permission are confirmed.
6. Do not describe an enquiry or submitted request as an accepted order.

## Official references for legal review

These sources are starting points for a role-specific legal review. Check all amendments, notifications and the actual operating structure before reaching a conclusion.

- Consumer Protection Act, 2019 — India Code: https://www.indiacode.nic.in/indiacode/handle/123456789/18555?view_type=browse
- Consumer Protection (Direct Selling) Rules, 2021 — Department of Consumer Affairs: https://consumeraffairs.nic.in/sites/default/files/232214.pdf
- Consumer Protection (Direct Selling) (Amendment) Rules, 2023 — Department of Consumer Affairs: https://consumeraffairs.nic.in/sites/default/files/The%20Consumer%20Protection%20%28Direct%20Selling%29%28Amendment%29%20Rules%2C%202023.pdf
- Consumer Protection (E-Commerce) Rules, 2020 — Department of Consumer Affairs: https://consumeraffairs.nic.in/sites/default/files/E%20commerce%20rules_0.pdf
- CCPA Guidelines for Prevention of Misleading Advertisements and Endorsements, 2022: https://consumeraffairs.nic.in/sites/default/files/CCPA_Notification.pdf
- FSSAI licensing and registration: https://www.fssai.gov.in/business/licensing
- FSSAI e-commerce food-business advisory, 3 December 2024: https://www.fssai.gov.in/upload/advisories/2024/12/674efa161d756Adobe%20Scan%203%20Dec%202024.pdf
- Digital Personal Data Protection Rules, 2025 and related notifications/corrigendum — MeitY: https://www.meity.gov.in/documents/act-and-policies/digital-personal-data-protection-rules-2025-gDOxUjMtQWa
- DPDP Act commencement notification, 13 November 2025: https://www.meity.gov.in/static/uploads/2025/11/c56ceae6c383460ca69577428d36828b.pdf

**Important:** DPDP Act and Rules commencement is staggered. Check the latest MeitY commencement timeline and any subsequent 2026 notifications/corrigenda before stating which duties are in force on a particular date. Do not repeat an old blanket statement that all DPDP duties are already effective or that none are effective.

## Implementation status

- Internal typed seller-profile scaffold: implemented on the feature branch.
- Public-safe storefront disclosure and interim data-use information: implemented on the feature branch.
- Full terms, shipping, returns/refunds and grievance policies: not published; owner information and legal review remain required.
- Secure website order backend: not implemented.

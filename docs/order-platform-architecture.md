# Order platform architecture proposal

**Confirmed operating model:** C — independent catalogue + WhatsApp enquiries + seller-reviewed website order requests.  
**Implementation status:** DESIGN ONLY. No order API, database, payment gateway or admin dashboard has been enabled.

## 1. Current-state boundary

The production storefront is a Next.js static export hosted on GitHub Pages. It can render catalogue pages and prepare a customer-reviewed WhatsApp message. It does not run a trusted server process, securely store submitted orders, or provide seller-only order administration.

Do not implement a client-only success screen and call it an order. Do not store customer orders or admin secrets in public static JSON, browser local storage, or source-controlled files.

## 2. Recommended target architecture

Keep the GitHub Pages site as the public catalogue frontend until a migration is approved. Add a separate authenticated backend service and private relational database.

Logical components:

1. **Public storefront:** product browse, product detail, cart, consent and order review.
2. **Order API:** validates requests, normalises product IDs/quantities, rechecks current MRP/availability, creates an immutable order-request snapshot and returns a non-guessable reference.
3. **Private database:** orders, order lines, status events, seller/admin users, fulfilment data and a minimal audit trail.
4. **Seller administration:** authenticated seller-only view to review, accept, reject, update dispatch/delivery status and contact the customer.
5. **Notification adapter:** optional WhatsApp/email notification triggered only by explicit workflow events; no customer data should be sent to third parties without an appropriate notice and user action/valid basis.
6. **Operational controls:** rate limiting, input validation, abuse protection, backups, retention/deletion policy, error monitoring and incident response.

A suitable implementation can use a maintained Node.js serverless/container runtime with PostgreSQL. Choose the hosting/database provider only after cost, region, access-control, backup and data-processing terms are reviewed. The static GitHub Pages host itself cannot run the required private API or admin session.

## 3. API shape (proposal only)

- POST /api/order-requests — submit an order request; an idempotency key prevents duplicate submissions.
- GET /api/order-requests/{opaqueReference} — limited customer status lookup, protected by a separate access token or equivalent proof of possession.
- GET /api/admin/order-requests — seller/admin-only queue with pagination and filters.
- GET /api/admin/order-requests/{id} — seller/admin-only order detail.
- POST /api/admin/order-requests/{id}/accept — accept after seller review and final price/stock/fulfilment confirmation.
- POST /api/admin/order-requests/{id}/reject — reject with a recorded reason.
- POST /api/admin/order-requests/{id}/status — controlled dispatch/delivery/cancellation transitions.

Never use a sequential public database ID as a customer tracking secret. Do not place names, phone numbers or street addresses in URLs or analytics events.

## 4. Order state machine

DRAFT_CART → SUBMITTED → RECEIVED → UNDER_REVIEW → ACCEPTED or REJECTED

After acceptance:

ACCEPTED → DISPATCHED → DELIVERED

Cancellation is a separate controlled transition from the states where the actual seller policy and applicable law permit it.

Each transition must record:
- previous and new status;
- UTC timestamp;
- actor (customer/system/seller);
- reason or supporting note where relevant;
- order version to prevent conflicting updates.

SUBMITTED and RECEIVED mean a request was recorded, not that the seller accepted it. A seller acceptance event must be explicit and auditable.

## 5. Order data integrity

At submission, store a server-calculated snapshot of:
- product ID and catalogue version;
- product name and pack-size shown to the customer;
- requested quantity;
- listed MRP shown at submission;
- recalculated subtotal;
- customer-provided delivery/contact details, only as needed;
- acknowledgement of the current privacy/order notice.

The server must not trust totals or prices sent by the browser. Recheck current MRP, availability, fulfilment coverage and seller ability to supply before acceptance. Keep DP/SP out of the schema until an authorised source and display permission are verified.

## 6. Security and privacy controls

- Use HTTPS for all API and admin traffic.
- Store database credentials only in backend secret storage.
- Require strong seller authentication; use MFA where supported.
- Enforce role-based access and deny-by-default policies.
- Use parameterised database operations and server-side schema validation.
- Apply rate limits and abuse detection to public order submission and status lookup.
- Use secure, HttpOnly, SameSite cookies for browser admin sessions; protect state-changing requests against CSRF.
- Keep customer PII out of application logs, analytics and public error responses.
- Restrict database access to the backend service; no public write keys in the client.
- Define retention, deletion, backup encryption and restoration tests before going live.
- Log administrative status changes without copying full customer addresses into audit logs.

## 7. Release prerequisites

Before enabling this backend, obtain and verify:
1. actual seller identity and legal operating role;
2. authorisation/permission claims, if any;
3. who owns and fulfils each order;
4. customer support and grievance channels;
5. actual delivery, cancellation, return and refund process;
6. privacy/data-controller details and retention policy;
7. applicable registrations and product-category requirements;
8. approved domain, hosting, database, backups and operational owner.

## 8. Rollout plan

1. **Design approval:** approve provider, schema, retention, security model and responsibility matrix.
2. **Private backend prototype:** no public customer traffic; seeded test data only.
3. **Seller-only testing:** authenticate seller, test state transitions and audit history.
4. **Controlled customer pilot:** only after release prerequisites and legal review are complete.
5. **Production launch:** monitor, back up, test recovery and publish truthful order/privacy disclosures.

Current implementation remains enquiry-based. No live website order acceptance or seller admin dashboard is claimed.

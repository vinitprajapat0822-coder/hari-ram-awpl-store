# MRP / DP / SP pricing architecture proposal

**Current implementation:** MRP-only catalogue and cart.  
**DP/SP status:** NOT IMPLEMENTED — OWNER CONFIRMATION REQUIRED.

## 1. Current safe boundary

Keep current MRP values and evidence as they are. Do not derive DP or SP by applying a guessed discount or percentage. Do not expose distributor-only prices to public customers unless the seller has a documented right and clear eligibility rules to do so.

## 2. Evidence required before implementation

For each price type, obtain:
- current authorised price list or written company communication;
- effective-from/effective-to dates;
- exact product/SKU and pack-size mapping;
- seller/distributor eligibility rules;
- conditions, tax treatment and any applicable restrictions;
- permission for public display and use in a public calculator;
- process for updates, superseded lists and corrections.

A company website showing an MRP does not by itself establish public permission to publish DP/SP or how those prices should be calculated.

## 3. Proposed data model (not enabled)

A future price record should carry:

- productId
- priceType (MRP, DP, SP)
- amount
- currency
- effectiveFrom
- effectiveTo
- sourceDocumentReference
- sourceUrl (when public and stable)
- verifiedAt
- verifiedBy
- eligibility
- publicDisplayPermission
- status (VERIFIED, REVIEW_REQUIRED, EXPIRED, WITHDRAWN)

Retain a history rather than overwriting old values without an audit trail. A missing or expired price must not silently fall back to a guessed value.

## 4. Calculator behaviour (future)

- Show only price types that are verified, current and authorised for the viewing user.
- Clearly label MRP, DP and SP; do not imply that they are interchangeable.
- Show effective date and source/verification information where appropriate.
- Explain eligibility and applicable conditions in plain language.
- Never describe SP or the difference between price types as guaranteed profit, income or earnings.
- Revalidate the price server-side before any future order acceptance.
- Keep the public MRP-only view operational when DP/SP data is absent.

## 5. Release gate

No DP/SP fields, values, formulas, toggles or calculator UI should ship until the source, currentness, eligibility and display permission have been verified and approved by the owner.

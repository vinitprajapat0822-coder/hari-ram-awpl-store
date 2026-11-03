# QA findings

## Confirmed fixes in this branch

- **QAF-001 — Profile static-render boundary (S2, fixed):** The profile page used `useSearchParams()` without a surrounding Suspense boundary. Wrapped the client content in Suspense.
- **QAF-002 — Product image lint path (S3, fixed):** Replaced raw `img` with Next.js `Image`; image URLs remain null until authentic uploads are provided.
- **QAF-003 — Unassociated profile labels (S3, fixed):** Added stable input IDs and matching `htmlFor` labels.
- **QAF-004 — Cart variant identity (S2, fixed):** Cart line identity now includes the selected child variant; order text retains the variant label.
- **QAF-005 — MRP conflict orderability (S2, fixed):** Conflicting MRP records are visible for review but cannot be added to cart.

## Awaiting automated reproduction

No additional browser defects are marked confirmed until the Playwright workflow completes. Potential issues that have not reproduced are not labelled as bugs.

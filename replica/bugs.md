# Bug report: Hari Ram AWPL Store

Build reviewed: `2959a1110336d5230b996f3932febe3ae6b76638`
Browser: Chromium in GitHub Actions

## Confirmed defects and fixes

### BUG-001: Persisted cart caused React hydration mismatch

- Severity: S2
- Flow / case: F07-H1
- Screen: Home / Cart
- Build: Before fix `b1bf6e3181835f82002a57b127af0cbbc2e48914`
- Browser / device: Chromium, production build

Steps
1. Add an item to the persisted cart.
2. Reload or directly open a route where the server-rendered initial state has an empty cart.
3. Allow Zustand persist to restore browser storage during the initial render.

Expected: Server and first client render agree; saved cart restores after mount without hydration errors.

Actual: Browser logged React hydration errors `#418` and `#423`.

Evidence: Playwright console capture in workflow run `41580095729`; failure reproduced by the persisted cart test.

Suspected cause: Persist middleware restored browser localStorage before the initial client tree had safely hydrated.

Status: Fixed in `d3c9af65a36ccce7b08a870371560dea80d46745` and `278178993736b16b29b7bbfc42f3a492de65c059`. Persistence now uses `skipHydration` and a client mount bootstrap. Re-tested in latest successful CI run `41580351093`.

## Test-harness findings (not application bugs)

- The first variant-cart assertion used a strict text locator for a price shown twice (line amount and cart total). The product and cart flow were working; the locator was made deterministic.
- The first accessibility scan ran while animated product cards were entering. The scan now waits for the entrance transition to settle; the stable screens pass axe WCAG 2.1 A/AA.
- Neither harness issue is recorded as an open application defect.

## Current reproduced open defects

None in the automated suite.

## Manual verification still pending

The mobile physical-device pass, keyboard-only walkthrough, screen-reader walkthrough, two-tab behaviour and malformed local-storage recovery have not been run. These are outstanding checks, not confirmed defects.

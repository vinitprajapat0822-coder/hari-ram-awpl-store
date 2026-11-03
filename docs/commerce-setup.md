# Commerce backend setup

The storefront remains a static Next.js export on GitHub Pages. The account, shared order, owner dashboard, realtime tracking and verified review features use Supabase Auth, PostgreSQL and Storage from the browser. The site uses only the Supabase publishable key. Never put a service-role key in the repository, GitHub Pages bundle or browser environment.

## 1. Create the Supabase project

Create a Supabase project and open its SQL Editor. Run these files in this order:

1. \`supabase/migrations/202611030001_commerce.sql\`
2. \`supabase/migrations/202611030002_security_and_delivery_eta.sql\`
3. \`supabase/seed/catalogue.sql\`

The catalogue seed contains 135 distinct product IDs from \`src/data/awpl-products.ts\`. It preserves captured MRP, catalogue verification state, category, pack size and official image evidence. Distributor price (DP) and selling price (SP) are separate editable owner fields and are initially null because a verified price list has not been supplied. A rerun does not overwrite owner-maintained availability or selling-price values.

## 2. Configure authentication and the owner

In Supabase Authentication settings, enable email/password sign-in. Set the site URL and allow this redirect URL:

\`https://vinitprajapat0822-coder.github.io/hari-ram-awpl-store/account/\`

Also allow \`http://localhost:3000/account/\` for local development.

Create the owner user through the customer account screen or Supabase Auth. After the owner has confirmed the email, obtain the exact UUID from Authentication → Users. Run this SQL with that real UUID:

\`\`\`sql
insert into public.store_admins (user_id, display_name)
values ('REAL_AUTH_USER_UUID', 'Hariram Prajapat')
on conflict (user_id) do update
set display_name = excluded.display_name;
\`\`\`

Do not use the owner name as a login password or as an authorization check. The admin route verifies the authenticated UUID against \`store_admins\`; the database functions and RLS policies repeat the owner check.

## 3. Add public build variables to GitHub

In repository Settings → Secrets and variables → Actions → Variables, add:

- \`NEXT_PUBLIC_SUPABASE_URL\`: the Supabase project URL.
- \`NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY\`: the project's publishable key.

The Pages workflow exposes only these public values during build. Do not add a \`service_role\` key. Re-run the Pages workflow after setting them. The catalogue-only storefront still builds when these values are absent, but online accounts and shared order tracking remain unavailable.

For local development, export the same two variables in the shell before \`npm run dev\`.

## 4. Operational behaviour

- The tracked checkout requires a signed-in customer and creates one database order for the entire cart. The WhatsApp message carries that order reference.
- Orders initially store the captured MRP subtotal. The final selling price remains null until the owner updates the verified value; no discount is invented.
- Availability must be confirmed before the order can be accepted. Fulfilment actions are checked in sequence by \`owner_update_order\`.
- The owner can set a delivery slot and record a delay with a revised date/time and a customer-facing message.
- Reviews can be submitted only against delivered order items. New reviews stay pending until owner moderation.
- Review images are compressed to WebP, limited to three photos per submission and kept in a private Storage bucket. Public review images use short-lived signed URLs only after approval.
- Public stock photographs are illustrative only. Official AWPL images are shown only when the catalogue marks their URL verified.

## 5. Deployment

PR checks validate TypeScript, lint, static build, Playwright and axe. GitHub Pages deploys from \`main\` only. Merge the reviewed PR after all checks pass, then verify the Pages deployment workflow before treating online commerce as live.

# Supabase commerce setup

The storefront remains a static Next.js export on GitHub Pages. Supabase provides hosted authentication, PostgreSQL, RLS, Storage and Realtime. No service-role key is used by the browser.

## 1. Create the Supabase project

Create a project in Supabase and enable Email authentication. Keep email confirmation enabled for customer accounts.

## 2. Apply the schema and seed

Open the Supabase SQL Editor and run the complete migration:

`supabase/migrations/202611030001_commerce.sql`

It creates the commerce tables, security policies, RPC functions, private review-photo bucket, realtime publication entries and seeds the 135 existing SKU records from the repository catalogue. It does not invent missing products, selling prices, descriptions or images.

## 3. Provision the owner account

1. Open the deployed store and visit `/orders/`.
2. Create the owner's account using the exact display name `Hariram Prajapat`.
3. Confirm the email and sign in once so the profile trigger creates the profile row.
4. In the Supabase SQL Editor, find that account's auth UUID:

```sql
select id, email
from auth.users
where lower(email) = lower('OWNER_EMAIL_HERE');
```

5. Assign the owner role to that exact UUID:

```sql
update public.profiles
set display_name = 'Hariram Prajapat', role = 'owner', updated_at = now()
where id = 'OWNER_AUTH_USER_UUID_HERE';
```

Use the real UUID returned in step 4. Do not assign the role to any customer account. Customer-facing profile updates cannot change the role column.

## 4. Configure the frontend

Set these values in local `.env.local` and as GitHub repository Actions Variables:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

The anon/publishable key is designed for browser use and is constrained by RLS. Never put a Supabase service-role key in `NEXT_PUBLIC_*`, source files, GitHub Pages assets or chat messages.

For GitHub Pages, add the production origin and the store path to Supabase Auth's allowed redirect URLs:

`https://vinitprajapat0822-coder.github.io/hari-ram-awpl-store/**`

## 5. Operational behavior

- Customer orders are created through `create_store_order`; the database reads current MRP/SP values and ignores client-supplied prices.
- SP remains null until the owner enters a verified selling price. Until then the order shows MRP as the estimate and clearly says SP is subject to confirmation.
- Owner order transitions run through `owner_update_store_order`.
- Customers can read only their own orders and updates.
- Reviews can be submitted only for products in a delivered order.
- Review photos are compressed to WebP in the browser, limited to 5 MB after compression and stored in a private bucket. Public signed URLs are issued only for verified reviews after owner publication.
- The owner role is provisioned in the database, not by a client-side flag.

## 6. Deployment gate

The code can be built without Supabase credentials, but account, order, admin and review workflows remain unavailable until the project is configured and the migration is applied. Run the repository quality workflow before merging. GitHub Pages deployment occurs only from the approved main branch.

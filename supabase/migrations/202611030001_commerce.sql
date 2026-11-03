create extension if not exists pgcrypto;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null default '',
  phone text not null default '',
  delivery_address text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.store_admins (
  user_id uuid primary key references auth.users(id) on delete cascade,
  display_name text not null default 'Hariram Prajapat',
  created_at timestamptz not null default now()
);

create or replace function public.is_store_owner()
returns boolean
language sql
stable
security definer
set search_path = public, auth
as $$
  select exists (
    select 1 from public.store_admins
    where user_id = auth.uid()
  );
$$;

revoke all on function public.is_store_owner() from public;
grant execute on function public.is_store_owner() to authenticated;

create table if not exists public.store_products (
  id text primary key,
  name text not null,
  category text not null,
  pack_size text not null default '',
  mrp numeric(12,2),
  selling_price numeric(12,2),
  catalogue_status text not null check (catalogue_status in ('VERIFIED', 'PRICE_REVIEW_REQUIRED', 'MISSING_DATA')),
  availability text not null default 'UNKNOWN' check (availability in ('UNKNOWN', 'AVAILABLE', 'UNAVAILABLE', 'REVIEW_REQUIRED')),
  image_url text,
  image_status text not null default 'MISSING' check (image_status in ('MISSING', 'UPLOADED_UNVERIFIED', 'VERIFIED')),
  updated_at timestamptz not null default now(),
  check (mrp is null or mrp >= 0),
  check (selling_price is null or selling_price >= 0)
);

create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  order_number text not null unique,
  customer_id uuid not null references auth.users(id) on delete restrict,
  customer_name text not null,
  phone text not null,
  delivery_address text not null,
  status text not null default 'ORDER_PLACED'
    check (status in ('ORDER_PLACED', 'ORDER_ACCEPTED', 'PACKED', 'SHIPPED', 'IN_TRANSIT', 'OUT_FOR_DELIVERY', 'DELIVERED')),
  availability_confirmed boolean not null default false,
  subtotal_mrp numeric(12,2) not null check (subtotal_mrp >= 0),
  final_total numeric(12,2),
  expected_delivery_date date,
  expected_delivery_start time,
  expected_delivery_end time,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (final_total is null or final_total >= 0),
  check (expected_delivery_start is null or expected_delivery_end is null or expected_delivery_start < expected_delivery_end)
);

create index if not exists orders_customer_created_idx on public.orders(customer_id, created_at desc);
create index if not exists orders_status_created_idx on public.orders(status, created_at desc);

create table if not exists public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  product_id text not null references public.store_products(id) on delete restrict,
  product_name text not null,
  pack_size text not null default '',
  mrp numeric(12,2) not null check (mrp >= 0),
  selling_price numeric(12,2),
  quantity integer not null check (quantity between 1 and 99),
  line_mrp numeric(12,2) not null check (line_mrp >= 0),
  created_at timestamptz not null default now()
);

create index if not exists order_items_order_idx on public.order_items(order_id);

create table if not exists public.order_updates (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  customer_id uuid not null references auth.users(id) on delete cascade,
  status text not null check (status in ('ORDER_PLACED', 'ORDER_ACCEPTED', 'PACKED', 'SHIPPED', 'IN_TRANSIT', 'OUT_FOR_DELIVERY', 'DELIVERED', 'DELIVERY_DELAYED', 'AVAILABILITY_CONFIRMED')),
  message text,
  eta_date date,
  eta_start time,
  eta_end time,
  created_at timestamptz not null default now(),
  check (eta_start is null or eta_end is null or eta_start < eta_end)
);

create index if not exists order_updates_order_created_idx on public.order_updates(order_id, created_at);

create table if not exists public.reviews (
  id uuid primary key default gen_random_uuid(),
  customer_id uuid not null references auth.users(id) on delete cascade,
  order_id uuid not null references public.orders(id) on delete cascade,
  order_item_id uuid not null unique references public.order_items(id) on delete cascade,
  product_id text not null references public.store_products(id) on delete restrict,
  rating integer not null check (rating between 1 and 5),
  quality_note text not null,
  packaging_note text not null,
  delivery_note text not null,
  status text not null default 'PENDING' check (status in ('PENDING', 'APPROVED', 'REJECTED')),
  created_at timestamptz not null default now(),
  moderated_at timestamptz
);

create index if not exists reviews_product_status_created_idx on public.reviews(product_id, status, created_at desc);

create table if not exists public.review_images (
  id uuid primary key default gen_random_uuid(),
  review_id uuid not null references public.reviews(id) on delete cascade,
  customer_id uuid not null references auth.users(id) on delete cascade,
  storage_path text not null unique,
  created_at timestamptz not null default now()
);

create index if not exists review_images_review_idx on public.review_images(review_id);

create or replace function public.handle_new_store_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, full_name)
  values (new.id, coalesce(new.raw_user_meta_data ->> 'full_name', ''))
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created_store_profile on auth.users;
create trigger on_auth_user_created_store_profile
after insert on auth.users
for each row execute procedure public.handle_new_store_user();

alter table public.profiles enable row level security;
alter table public.store_admins enable row level security;
alter table public.store_products enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;
alter table public.order_updates enable row level security;
alter table public.reviews enable row level security;
alter table public.review_images enable row level security;

drop policy if exists "profiles_select_self" on public.profiles;
create policy "profiles_select_self" on public.profiles for select to authenticated
using (id = auth.uid() or public.is_store_owner());

drop policy if exists "profiles_update_self" on public.profiles;
create policy "profiles_update_self" on public.profiles for update to authenticated
using (id = auth.uid() or public.is_store_owner())
with check (id = auth.uid() or public.is_store_owner());

drop policy if exists "store_admins_owner_read" on public.store_admins;
create policy "store_admins_owner_read" on public.store_admins for select to authenticated
using (public.is_store_owner());

drop policy if exists "store_products_public_read" on public.store_products;
create policy "store_products_public_read" on public.store_products for select to anon, authenticated
using (true);

drop policy if exists "store_products_owner_write" on public.store_products;
create policy "store_products_owner_write" on public.store_products for all to authenticated
using (public.is_store_owner())
with check (public.is_store_owner());

drop policy if exists "orders_customer_or_owner_read" on public.orders;
create policy "orders_customer_or_owner_read" on public.orders for select to authenticated
using (customer_id = auth.uid() or public.is_store_owner());

drop policy if exists "orders_owner_update" on public.orders;
create policy "orders_owner_update" on public.orders for update to authenticated
using (public.is_store_owner())
with check (public.is_store_owner());

drop policy if exists "order_items_customer_or_owner_read" on public.order_items;
create policy "order_items_customer_or_owner_read" on public.order_items for select to authenticated
using (
  exists (
    select 1 from public.orders o
    where o.id = order_items.order_id
      and (o.customer_id = auth.uid() or public.is_store_owner())
  )
);

drop policy if exists "order_updates_customer_or_owner_read" on public.order_updates;
create policy "order_updates_customer_or_owner_read" on public.order_updates for select to authenticated
using (customer_id = auth.uid() or public.is_store_owner());

drop policy if exists "reviews_public_approved_or_private_owner" on public.reviews;
create policy "reviews_public_approved_or_private_owner" on public.reviews for select to anon, authenticated
using (status = 'APPROVED' or customer_id = auth.uid() or public.is_store_owner());

drop policy if exists "reviews_owner_moderate" on public.reviews;
create policy "reviews_owner_moderate" on public.reviews for update to authenticated
using (public.is_store_owner())
with check (public.is_store_owner());

drop policy if exists "review_images_approved_or_owner_read" on public.review_images;
create policy "review_images_approved_or_owner_read" on public.review_images for select to anon, authenticated
using (
  exists (
    select 1 from public.reviews r
    where r.id = review_images.review_id
      and (r.status = 'APPROVED' or r.customer_id = auth.uid() or public.is_store_owner())
  )
);

drop policy if exists "review_images_customer_insert" on public.review_images;
create policy "review_images_customer_insert" on public.review_images for insert to authenticated
with check (
  customer_id = auth.uid()
  and split_part(storage_path, '/', 1) = auth.uid()::text
  and exists (
    select 1 from public.reviews r
    where r.id = review_id
      and r.customer_id = auth.uid()
      and r.status = 'PENDING'
  )
);

create or replace function public.create_store_order(
  p_customer_name text,
  p_phone text,
  p_address text,
  p_items jsonb
)
returns jsonb
language plpgsql
security definer
set search_path = public, auth
as $$
declare
  v_customer_id uuid := auth.uid();
  v_order_id uuid;
  v_order_number text;
  v_total numeric(12,2) := 0;
  v_item jsonb;
  v_product public.store_products%rowtype;
  v_product_id text;
  v_quantity integer;
begin
  if v_customer_id is null then
    raise exception 'Authentication required';
  end if;
  if length(trim(coalesce(p_customer_name, ''))) < 2
     or length(trim(coalesce(p_phone, ''))) < 10
     or length(trim(coalesce(p_address, ''))) < 8 then
    raise exception 'Customer name, mobile and delivery address are required';
  end if;
  if jsonb_typeof(p_items) <> 'array'
     or jsonb_array_length(p_items) < 1
     or jsonb_array_length(p_items) > 30 then
    raise exception 'Order must contain between 1 and 30 distinct products';
  end if;

  for v_item in select value from jsonb_array_elements(p_items)
  loop
    v_product_id := v_item ->> 'product_id';
    v_quantity := (v_item ->> 'quantity')::integer;
    if v_product_id is null or v_quantity < 1 or v_quantity > 99 then
      raise exception 'Invalid product or quantity';
    end if;

    select * into v_product from public.store_products where id = v_product_id;
    if not found or v_product.catalogue_status <> 'VERIFIED' or v_product.mrp is null then
      raise exception 'A selected product is not orderable until its catalogue data is verified';
    end if;
    if v_product.availability = 'UNAVAILABLE' then
      raise exception 'A selected product is currently marked unavailable';
    end if;
    v_total := v_total + (v_product.mrp * v_quantity);
  end loop;

  v_order_number := 'HR-' || to_char(now() at time zone 'Asia/Kolkata', 'YYMMDD') || '-'
    || upper(substr(replace(gen_random_uuid()::text, '-', ''), 1, 6));

  insert into public.orders (
    order_number, customer_id, customer_name, phone, delivery_address, status, subtotal_mrp
  ) values (
    v_order_number, v_customer_id, trim(p_customer_name), trim(p_phone), trim(p_address),
    'ORDER_PLACED', v_total
  ) returning id into v_order_id;

  for v_item in select value from jsonb_array_elements(p_items)
  loop
    v_product_id := v_item ->> 'product_id';
    v_quantity := (v_item ->> 'quantity')::integer;
    select * into v_product from public.store_products where id = v_product_id;
    insert into public.order_items (
      order_id, product_id, product_name, pack_size, mrp, selling_price, quantity, line_mrp
    ) values (
      v_order_id, v_product.id, v_product.name, v_product.pack_size, v_product.mrp,
      v_product.selling_price, v_quantity, v_product.mrp * v_quantity
    );
  end loop;

  insert into public.order_updates (order_id, customer_id, status, message)
  values (v_order_id, v_customer_id, 'ORDER_PLACED', 'Your order enquiry has been recorded.');

  return jsonb_build_object('id', v_order_id, 'order_number', v_order_number);
end;
$$;

revoke all on function public.create_store_order(text, text, text, jsonb) from public;
grant execute on function public.create_store_order(text, text, text, jsonb) to authenticated;

create or replace function public.owner_update_order(
  p_order_id uuid,
  p_action text,
  p_message text default null,
  p_eta_date date default null,
  p_eta_start time default null,
  p_eta_end time default null
)
returns void
language plpgsql
security definer
set search_path = public, auth
as $$
declare
  v_order public.orders%rowtype;
  v_next_status text;
  v_event_status text;
  v_message text;
begin
  if not public.is_store_owner() then
    raise exception 'Owner access required';
  end if;
  select * into v_order from public.orders where id = p_order_id for update;
  if not found then
    raise exception 'Order not found';
  end if;
  v_message := nullif(trim(coalesce(p_message, '')), '');

  if p_action = 'CONFIRM_AVAILABILITY' then
    update public.orders set availability_confirmed = true, updated_at = now() where id = p_order_id;
    v_event_status := 'AVAILABILITY_CONFIRMED';
    v_message := coalesce(v_message, 'Requested product availability confirmed by the store.');
  elsif p_action = 'ACCEPT_ORDER' then
    if v_order.status <> 'ORDER_PLACED' or not v_order.availability_confirmed then
      raise exception 'Confirm product availability before accepting this order';
    end if;
    v_next_status := 'ORDER_ACCEPTED';
  elsif p_action = 'MARK_PACKED' then
    if v_order.status <> 'ORDER_ACCEPTED' then raise exception 'Accept the order before packing'; end if;
    v_next_status := 'PACKED';
  elsif p_action = 'MARK_SHIPPED' then
    if v_order.status <> 'PACKED' then raise exception 'Pack the order before shipping'; end if;
    v_next_status := 'SHIPPED';
  elsif p_action = 'IN_TRANSIT' then
    if v_order.status <> 'SHIPPED' then raise exception 'Ship the order before transit'; end if;
    v_next_status := 'IN_TRANSIT';
  elsif p_action = 'OUT_FOR_DELIVERY' then
    if v_order.status <> 'IN_TRANSIT' then raise exception 'Order must be in transit first'; end if;
    v_next_status := 'OUT_FOR_DELIVERY';
  elsif p_action = 'MARK_DELIVERED' then
    if v_order.status <> 'OUT_FOR_DELIVERY' then raise exception 'Order must be out for delivery first'; end if;
    v_next_status := 'DELIVERED';
  elsif p_action = 'DELIVERY_DELAYED' then
    if p_eta_date is null or v_message is null then
      raise exception 'A revised delivery date and owner message are required';
    end if;
    if p_eta_start is not null and p_eta_end is not null and p_eta_start >= p_eta_end then
      raise exception 'Delivery time window is invalid';
    end if;
    update public.orders
      set expected_delivery_date = p_eta_date,
          expected_delivery_start = p_eta_start,
          expected_delivery_end = p_eta_end,
          updated_at = now()
      where id = p_order_id;
    v_event_status := 'DELIVERY_DELAYED';
  else
    raise exception 'Unsupported owner action';
  end if;

  if v_next_status is not null then
    update public.orders set status = v_next_status, updated_at = now() where id = p_order_id;
    v_event_status := v_next_status;
  end if;

  insert into public.order_updates (
    order_id, customer_id, status, message, eta_date, eta_start, eta_end
  ) values (
    p_order_id, v_order.customer_id, v_event_status, v_message,
    case when p_action = 'DELIVERY_DELAYED' then p_eta_date else v_order.expected_delivery_date end,
    case when p_action = 'DELIVERY_DELAYED' then p_eta_start else v_order.expected_delivery_start end,
    case when p_action = 'DELIVERY_DELAYED' then p_eta_end else v_order.expected_delivery_end end
  );
end;
$$;

revoke all on function public.owner_update_order(uuid, text, text, date, time, time) from public;
grant execute on function public.owner_update_order(uuid, text, text, date, time, time) to authenticated;

create or replace function public.create_product_review(
  p_order_item_id uuid,
  p_rating integer,
  p_quality_note text,
  p_packaging_note text,
  p_delivery_note text
)
returns uuid
language plpgsql
security definer
set search_path = public, auth
as $$
declare
  v_customer_id uuid := auth.uid();
  v_order public.orders%rowtype;
  v_item public.order_items%rowtype;
  v_review_id uuid;
begin
  if v_customer_id is null then raise exception 'Authentication required'; end if;
  if p_rating < 1 or p_rating > 5 then raise exception 'Rating must be between 1 and 5'; end if;
  if length(trim(coalesce(p_quality_note, ''))) < 2
     or length(trim(coalesce(p_packaging_note, ''))) < 2
     or length(trim(coalesce(p_delivery_note, ''))) < 2 then
    raise exception 'Complete product quality, packaging and delivery feedback';
  end if;

  select * into v_item from public.order_items where id = p_order_item_id;
  if not found then raise exception 'Order item not found'; end if;
  select * into v_order from public.orders
    where id = v_item.order_id and customer_id = v_customer_id;
  if not found or v_order.status <> 'DELIVERED' then
    raise exception 'A review is available only after this purchase is delivered';
  end if;

  insert into public.reviews (
    customer_id, order_id, order_item_id, product_id, rating,
    quality_note, packaging_note, delivery_note, status
  ) values (
    v_customer_id, v_order.id, v_item.id, v_item.product_id, p_rating,
    left(trim(p_quality_note), 500), left(trim(p_packaging_note), 500),
    left(trim(p_delivery_note), 500), 'PENDING'
  ) returning id into v_review_id;

  return v_review_id;
end;
$$;

revoke all on function public.create_product_review(uuid, integer, text, text, text) from public;
grant execute on function public.create_product_review(uuid, integer, text, text, text) to authenticated;

create or replace function public.owner_moderate_review(
  p_review_id uuid,
  p_approve boolean
)
returns void
language plpgsql
security definer
set search_path = public, auth
as $$
begin
  if not public.is_store_owner() then raise exception 'Owner access required'; end if;
  update public.reviews
  set status = case when p_approve then 'APPROVED' else 'REJECTED' end,
      moderated_at = now()
  where id = p_review_id and status = 'PENDING';
  if not found then raise exception 'Pending review not found'; end if;
end;
$$;

revoke all on function public.owner_moderate_review(uuid, boolean) from public;
grant execute on function public.owner_moderate_review(uuid, boolean) to authenticated;

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('review-images', 'review-images', false, 3145728, array['image/webp'])
on conflict (id) do update
set public = false, file_size_limit = 3145728, allowed_mime_types = array['image/webp'];

drop policy if exists "review_image_objects_customer_upload" on storage.objects;
create policy "review_image_objects_customer_upload" on storage.objects for insert to authenticated
with check (
  bucket_id = 'review-images'
  and split_part(name, '/', 1) = auth.uid()::text
  and exists (
    select 1 from public.reviews r
    where r.id::text = split_part(name, '/', 2)
      and r.customer_id = auth.uid()
      and r.status = 'PENDING'
  )
);

drop policy if exists "review_image_objects_approved_read" on storage.objects;
create policy "review_image_objects_approved_read" on storage.objects for select to anon, authenticated
using (
  bucket_id = 'review-images'
  and exists (
    select 1 from public.review_images ri
    join public.reviews r on r.id = ri.review_id
    where ri.storage_path = storage.objects.name
      and (r.status = 'APPROVED' or r.customer_id = auth.uid() or public.is_store_owner())
  )
);

do $$
begin
  if exists (select 1 from pg_publication where pubname = 'supabase_realtime') then
    if not exists (
      select 1 from pg_publication_tables
      where pubname = 'supabase_realtime' and schemaname = 'public' and tablename = 'orders'
    ) then
      alter publication supabase_realtime add table public.orders;
    end if;
    if not exists (
      select 1 from pg_publication_tables
      where pubname = 'supabase_realtime' and schemaname = 'public' and tablename = 'order_updates'
    ) then
      alter publication supabase_realtime add table public.order_updates;
    end if;
  end if;
end;
$$;

grant usage on schema public to anon, authenticated;
grant select on public.store_products to anon, authenticated;
grant select, update on public.profiles to authenticated;
grant select on public.store_admins to authenticated;
grant select, update on public.orders to authenticated;
grant select on public.order_items to authenticated;
grant select on public.order_updates to authenticated;
grant select, update on public.reviews to authenticated;
grant select, insert on public.review_images to authenticated;
grant select on public.review_images to anon;

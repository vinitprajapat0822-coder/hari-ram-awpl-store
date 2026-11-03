grant execute on function public.is_store_owner() to anon, authenticated;

drop policy if exists "orders_owner_update" on public.orders;
revoke update on public.orders from authenticated;

drop policy if exists "reviews_owner_moderate" on public.reviews;
revoke update on public.reviews from authenticated;
grant select on public.reviews to anon, authenticated;

alter table public.order_updates drop constraint if exists order_updates_status_check;
alter table public.order_updates
  add constraint order_updates_status_check
  check (status in (
    'ORDER_PLACED', 'ORDER_ACCEPTED', 'PACKED', 'SHIPPED', 'IN_TRANSIT',
    'OUT_FOR_DELIVERY', 'DELIVERED', 'DELIVERY_DELAYED',
    'AVAILABILITY_CONFIRMED', 'DELIVERY_SCHEDULED'
  ));

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
  if p_items is null or jsonb_typeof(p_items) is distinct from 'array' then
    raise exception 'Order items must be a JSON array';
  end if;
  if jsonb_array_length(p_items) < 1 or jsonb_array_length(p_items) > 30 then
    raise exception 'Order must contain between 1 and 30 distinct products';
  end if;
  if exists (
    select 1 from jsonb_array_elements(p_items) as entry(value)
    where jsonb_typeof(entry.value) is distinct from 'object'
       or coalesce(entry.value ->> 'product_id', '') = ''
       or coalesce(entry.value ->> 'quantity', '') !~ '^[0-9]{1,2}$'
  ) then
    raise exception 'Order items contain an invalid product or quantity';
  end if;
  if exists (
    select 1 from jsonb_array_elements(p_items) as entry(value)
    group by entry.value ->> 'product_id'
    having count(*) > 1
  ) then
    raise exception 'Each product may appear only once in the cart payload';
  end if;

  for v_item in select value from jsonb_array_elements(p_items)
  loop
    v_product_id := v_item ->> 'product_id';
    v_quantity := (v_item ->> 'quantity')::integer;
    if v_quantity < 1 or v_quantity > 99 then
      raise exception 'Quantity must be between 1 and 99';
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

create or replace function public.owner_set_delivery_eta(
  p_order_id uuid,
  p_eta_date date,
  p_eta_start time,
  p_eta_end time,
  p_message text default null
)
returns void
language plpgsql
security definer
set search_path = public, auth
as $$
declare
  v_order public.orders%rowtype;
begin
  if not public.is_store_owner() then raise exception 'Owner access required'; end if;
  if p_eta_date is null then raise exception 'A delivery date is required'; end if;
  if p_eta_start is not null and p_eta_end is not null and p_eta_start >= p_eta_end then
    raise exception 'Delivery time window is invalid';
  end if;
  select * into v_order from public.orders where id = p_order_id for update;
  if not found then raise exception 'Order not found'; end if;
  if v_order.status = 'DELIVERED' then raise exception 'A delivered order cannot be rescheduled'; end if;

  update public.orders
  set expected_delivery_date = p_eta_date,
      expected_delivery_start = p_eta_start,
      expected_delivery_end = p_eta_end,
      updated_at = now()
  where id = p_order_id;

  insert into public.order_updates (
    order_id, customer_id, status, message, eta_date, eta_start, eta_end
  ) values (
    p_order_id, v_order.customer_id, 'DELIVERY_SCHEDULED',
    nullif(trim(coalesce(p_message, '')), ''), p_eta_date, p_eta_start, p_eta_end
  );
end;
$$;

revoke all on function public.owner_set_delivery_eta(uuid, date, time, time, text) from public;
grant execute on function public.owner_set_delivery_eta(uuid, date, time, time, text) to authenticated;

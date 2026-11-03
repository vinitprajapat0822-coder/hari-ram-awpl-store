alter table public.store_products
  add column if not exists dp numeric(12,2);
alter table public.order_items
  add column if not exists dp numeric(12,2);

alter table public.store_products
  drop constraint if exists store_products_dp_check;
alter table public.store_products
  add constraint store_products_dp_check check (dp is null or dp >= 0);
alter table public.order_items
  drop constraint if exists order_items_dp_check;
alter table public.order_items
  add constraint order_items_dp_check check (dp is null or dp >= 0);

drop policy if exists "profiles_insert_self" on public.profiles;
create policy "profiles_insert_self" on public.profiles for insert to authenticated
with check (id = auth.uid());
grant insert on public.profiles to authenticated;

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
  v_total_mrp numeric(12,2) := 0;
  v_total_sp numeric(12,2) := 0;
  v_has_full_sp boolean := true;
  v_item jsonb;
  v_product public.store_products%rowtype;
  v_product_id text;
  v_quantity integer;
begin
  if v_customer_id is null then raise exception 'Authentication required'; end if;
  if length(trim(coalesce(p_customer_name, ''))) < 2
     or length(trim(coalesce(p_phone, ''))) < 10
     or length(trim(coalesce(p_address, ''))) < 8 then
    raise exception 'Customer name, mobile and delivery address are required';
  end if;
  if p_items is null or jsonb_typeof(p_items) is distinct from 'array'
     or jsonb_array_length(p_items) < 1
     or jsonb_array_length(p_items) > 30 then
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
    if v_quantity < 1 or v_quantity > 99 then raise exception 'Quantity must be between 1 and 99'; end if;
    select * into v_product from public.store_products where id = v_product_id;
    if not found or v_product.catalogue_status <> 'VERIFIED' or v_product.mrp is null then
      raise exception 'A selected product is not orderable until its catalogue data is verified';
    end if;
    if v_product.availability = 'UNAVAILABLE' then
      raise exception 'A selected product is currently marked unavailable';
    end if;
    v_total_mrp := v_total_mrp + (v_product.mrp * v_quantity);
    if v_product.selling_price is null then
      v_has_full_sp := false;
    else
      v_total_sp := v_total_sp + (v_product.selling_price * v_quantity);
    end if;
  end loop;

  v_order_number := 'HR-' || to_char(now() at time zone 'Asia/Kolkata', 'YYMMDD') || '-'
    || upper(substr(replace(gen_random_uuid()::text, '-', ''), 1, 6));

  insert into public.orders (
    order_number, customer_id, customer_name, phone, delivery_address,
    status, subtotal_mrp, final_total
  ) values (
    v_order_number, v_customer_id, trim(p_customer_name), trim(p_phone),
    trim(p_address), 'ORDER_PLACED', v_total_mrp,
    case when v_has_full_sp then v_total_sp else null end
  ) returning id into v_order_id;

  for v_item in select value from jsonb_array_elements(p_items)
  loop
    v_product_id := v_item ->> 'product_id';
    v_quantity := (v_item ->> 'quantity')::integer;
    select * into v_product from public.store_products where id = v_product_id;
    insert into public.order_items (
      order_id, product_id, product_name, pack_size, mrp, dp,
      selling_price, quantity, line_mrp
    ) values (
      v_order_id, v_product.id, v_product.name, v_product.pack_size,
      v_product.mrp, v_product.dp, v_product.selling_price,
      v_quantity, v_product.mrp * v_quantity
    );
  end loop;

  insert into public.order_updates (order_id, customer_id, status, message)
  values (v_order_id, v_customer_id, 'ORDER_PLACED', 'Your order enquiry has been recorded.');

  return jsonb_build_object('id', v_order_id, 'order_number', v_order_number);
end;
$$;

revoke all on function public.create_store_order(text, text, text, jsonb) from public;
grant execute on function public.create_store_order(text, text, text, jsonb) to authenticated;

grant update on public.store_products to authenticated;

-- =========================
-- PRODUCTS
-- =========================
alter table public.products enable row level security;

drop policy if exists "products read" on public.products;
create policy "products read"
on public.products
for select
using (true);

drop policy if exists "products admin write" on public.products;
create policy "products admin write"
on public.products
for all
to authenticated
using (auth.email() = 'fashionnogs@gmail.com')
with check (auth.email() = 'fashionnogs@gmail.com');


-- =========================
-- CATEGORIES (remove this block if your table is named differently or doesn't exist)
-- =========================
alter table public.categories enable row level security;

drop policy if exists "categories read" on public.categories;
create policy "categories read"
on public.categories
for select
using (true);

drop policy if exists "categories admin write" on public.categories;
create policy "categories admin write"
on public.categories
for all
to authenticated
using (auth.email() = 'fashionnogs@gmail.com')
with check (auth.email() = 'fashionnogs@gmail.com');


-- =========================
-- ORDERS (usually not public; only admin can read/write)
-- =========================
alter table public.orders enable row level security;

drop policy if exists "orders admin read" on public.orders;
create policy "orders admin read"
on public.orders
for select
to authenticated
using (auth.email() = 'fashionnogs@gmail.com');

drop policy if exists "orders admin write" on public.orders;
create policy "orders admin write"
on public.orders
for all
to authenticated
using (auth.email() = 'fashionnogs@gmail.com')
with check (auth.email() = 'fashionnogs@gmail.com');


-- =========================
-- STORAGE (bucket for product images)
-- =========================
-- Create bucket if it doesn't exist (public)
do $$
begin
  if not exists (select 1 from storage.buckets where id = 'product-images') then
    insert into storage.buckets (id, name, public)
    values ('product-images', 'product-images', true);
  end if;
end
$$;

-- Policies for the 'product-images' bucket on storage.objects
-- Public read:
drop policy if exists "product-images read public" on storage.objects;
create policy "product-images read public"
on storage.objects
for select
using (bucket_id = 'product-images');

-- Admin write (create/update/delete) only:
drop policy if exists "product-images admin write" on storage.objects;
create policy "product-images admin write"
on storage.objects
for all
to authenticated
using (
  bucket_id = 'product-images'
  and auth.email() = 'fashionnogs@gmail.com'
)
with check (
  bucket_id = 'product-images'
  and auth.email() = 'fashionnogs@gmail.com'
);

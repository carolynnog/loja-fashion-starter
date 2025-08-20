-- Tabelas
create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text,
  price_cents integer not null check (price_cents >= 0),
  images text[] default '{}',
  created_at timestamptz default now()
);

create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  buyer_email text,
  total_cents integer not null,
  status text not null default 'paid',
  mp_payment_id text,
  created_at timestamptz default now()
);

-- Bucket de imagens
-- Crie manualmente no Supabase Storage: bucket "product-images" público

-- Segurança (RLS)
alter table public.products enable row level security;
alter table public.orders enable row level security;

-- Política: Products são públicos para leitura
create policy if not exists "products read" on public.products
for select using (true);

-- Política: somente admin pode inserir/alterar/excluir
create policy if not exists "products admin write" on public.products
for all
to authenticated
using (auth.email() = current_setting('app.admin_email', true))
with check (auth.email() = current_setting('app.admin_email', true));

-- Pedidos: somente admin lê/escreve
create policy if not exists "orders admin all" on public.orders
for all
to authenticated
using (auth.email() = current_setting('app.admin_email', true))
with check (auth.email() = current_setting('app.admin_email', true));

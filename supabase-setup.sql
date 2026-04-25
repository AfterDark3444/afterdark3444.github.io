-- =============================================
-- AFTER DARK BLOG — Supabase SQL Setup
-- Wklej to w Supabase → SQL Editor → Run
-- =============================================

-- Tabela artykułów
create table if not exists posts (
  id          bigint generated always as identity primary key,
  title       text not null,
  excerpt     text,
  content     text,
  image       text,
  category    text default 'zwiazki',
  read_time   int  default 5,
  published   boolean default true,
  created_at  timestamptz default now()
);

-- Tabela komentarzy
create table if not exists comments (
  id          bigint generated always as identity primary key,
  post_id     bigint references posts(id) on delete cascade,
  author_name text not null,
  email       text,
  content     text not null,
  approved    boolean default false,
  created_at  timestamptz default now()
);

-- Tabela newsletter
create table if not exists newsletter (
  id         bigint generated always as identity primary key,
  email      text unique not null,
  created_at timestamptz default now()
);

-- Publiczny odczyt opublikowanych postów
alter table posts    enable row level security;
alter table comments enable row level security;
alter table newsletter enable row level security;

create policy "Public read posts"
  on posts for select using (published = true);

create policy "Insert posts (admin)"
  on posts for insert with check (true);

create policy "Update posts (admin)"
  on posts for update using (true);

create policy "Delete posts (admin)"
  on posts for delete using (true);

create policy "Public read approved comments"
  on comments for select using (approved = true);

create policy "Anyone can submit comment"
  on comments for insert with check (true);

create policy "Admin manage comments"
  on comments for all using (true);

create policy "Anyone subscribe newsletter"
  on newsletter for insert with check (true);

create policy "Admin read newsletter"
  on newsletter for select using (true);

-- =============================================
-- LiveScore Database Schema
-- =============================================

-- Profiles (synced from Supabase Auth)
create table if not exists public.profiles (
  id uuid references auth.users on delete cascade primary key,
  email text,
  display_name text,
  avatar_url text,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

alter table public.profiles enable row level security;

create policy "Users can view own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = id);

create policy "Users can insert own profile"
  on public.profiles for insert
  with check (auth.uid() = id);

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = ''
as $$
begin
  insert into public.profiles (id, email)
  values (new.id, new.email);
  return new;
end;
$$;

create or replace trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Favorite Teams
create table if not exists public.favorite_teams (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  team_id integer not null,
  team_name text not null,
  team_logo text,
  created_at timestamptz default now() not null,
  unique(user_id, team_id)
);

alter table public.favorite_teams enable row level security;

create policy "Users can view own favorite teams"
  on public.favorite_teams for select
  using (auth.uid() = user_id);

create policy "Users can insert own favorite teams"
  on public.favorite_teams for insert
  with check (auth.uid() = user_id);

create policy "Users can delete own favorite teams"
  on public.favorite_teams for delete
  using (auth.uid() = user_id);

-- Favorite Leagues
create table if not exists public.favorite_leagues (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  league_id integer not null,
  league_name text not null,
  league_logo text,
  created_at timestamptz default now() not null,
  unique(user_id, league_id)
);

alter table public.favorite_leagues enable row level security;

create policy "Users can view own favorite leagues"
  on public.favorite_leagues for select
  using (auth.uid() = user_id);

create policy "Users can insert own favorite leagues"
  on public.favorite_leagues for insert
  with check (auth.uid() = user_id);

create policy "Users can delete own favorite leagues"
  on public.favorite_leagues for delete
  using (auth.uid() = user_id);

-- Indexes
create index if not exists idx_favorite_teams_user on public.favorite_teams(user_id);
create index if not exists idx_favorite_leagues_user on public.favorite_leagues(user_id);

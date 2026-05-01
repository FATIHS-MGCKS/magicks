-- ====================================================================
-- MAGICKS Portal — Supabase schema bootstrap
--
-- Run this once in the Supabase SQL Editor (Dashboard → SQL Editor →
-- New Query → paste → Run). It is idempotent: re-running is safe.
--
-- Strategy (matches the Frontend store):
--   * One row in `portal_state` holds the entire portal snapshot as
--     JSONB. The Frontend keeps an in-memory cache for synchronous
--     reads and pushes the full snapshot back on each mutation
--     (debounced ~600ms). One snapshot = one atomic update — no
--     partial writes.
--   * Optimistic concurrency via `version` so two tabs/devices can
--     detect when their snapshot is stale and reload.
--   * Row Level Security restricts access to a single owner email,
--     hard-coded to hello@magicks.de. To add more users later, extend
--     the policy with another `OR auth.jwt()->>'email' = '...'` line
--     or move the allowlist into a small `portal_owners` table.
-- ====================================================================

create extension if not exists "pgcrypto";

-- --------------------------------------------------------------------
-- Snapshot table
-- --------------------------------------------------------------------
create table if not exists portal_state (
  id          int primary key check (id = 1),
  snapshot    jsonb not null,
  version     int not null default 1,
  updated_at  timestamptz not null default now()
);

-- Seed the empty snapshot exactly once.
insert into portal_state (id, snapshot, version, updated_at)
values (
  1,
  jsonb_build_object(
    'schemaVersion', 1,
    'exportedAt',    to_char(now() at time zone 'utc', 'YYYY-MM-DD"T"HH24:MI:SS"Z"'),
    'leads',         '[]'::jsonb,
    'campaigns',     '[]'::jsonb,
    'customers',     '[]'::jsonb,
    'projects',      '[]'::jsonb,
    'tasks',         '[]'::jsonb,
    'settings', jsonb_build_object(
      'defaultRegion',  'Kassel & 50 km',
      'defaultSource',  'ChatGPT-Recherche',
      'schemaVersion',  1,
      'updatedAt',      to_char(now() at time zone 'utc', 'YYYY-MM-DD"T"HH24:MI:SS"Z"')
    )
  ),
  1,
  now()
)
on conflict (id) do nothing;

-- --------------------------------------------------------------------
-- RLS: single-owner allowlist
-- --------------------------------------------------------------------
alter table portal_state enable row level security;

-- Drop & recreate to make this script idempotent.
drop policy if exists "portal owner read"   on portal_state;
drop policy if exists "portal owner insert" on portal_state;
drop policy if exists "portal owner update" on portal_state;

create policy "portal owner read"
  on portal_state
  for select
  using (auth.jwt() ->> 'email' = 'hello@magicks.de');

create policy "portal owner insert"
  on portal_state
  for insert
  with check (auth.jwt() ->> 'email' = 'hello@magicks.de');

create policy "portal owner update"
  on portal_state
  for update
  using (auth.jwt() ->> 'email' = 'hello@magicks.de')
  with check (auth.jwt() ->> 'email' = 'hello@magicks.de');

-- --------------------------------------------------------------------
-- RPC: write_portal_state(snapshot, expected_version)
--
-- Wraps the snapshot replace in a single SQL function so the version
-- check + bump + write happen in one atomic statement. Returns the
-- new (version, updated_at) on success, or NULL when the supplied
-- expected_version no longer matches the stored row (conflict).
-- --------------------------------------------------------------------
create or replace function write_portal_state(
  new_snapshot     jsonb,
  expected_version int
)
returns table (version int, updated_at timestamptz)
language plpgsql
security invoker
as $$
declare
  current_version int;
  next_version    int;
  next_at         timestamptz := now();
begin
  select s.version into current_version
    from portal_state s
   where s.id = 1
   for update;

  if current_version is null then
    insert into portal_state (id, snapshot, version, updated_at)
    values (1, new_snapshot, 1, next_at);
    return query select 1, next_at;
    return;
  end if;

  if expected_version is not null and expected_version <> current_version then
    return; -- conflict: caller will reload
  end if;

  next_version := current_version + 1;

  update portal_state
     set snapshot   = new_snapshot,
         version    = next_version,
         updated_at = next_at
   where id = 1;

  return query select next_version, next_at;
end;
$$;

revoke all on function write_portal_state(jsonb, int) from public;
grant execute on function write_portal_state(jsonb, int) to authenticated;

-- ====================================================================
-- Done. Verify with:
--   select id, version, updated_at from portal_state;
-- ====================================================================

-- factory_leases — backend de SEMÁFOROS para cuando la fábrica corra en DOS máquinas a la vez.
-- Mismo contrato que factory/lib/lease.mjs (backend local por defecto). Aplicar en el proyecto de Bagasy
-- (Supabase) y setear FACTORY_LEASE_BACKEND=supabase. La adquisición es atómica dentro de la función.
create table if not exists public.factory_leases (
  recurso     text not null,
  holder      text not null,
  units       int  not null check (units > 0),
  expires_at  timestamptz not null,
  host        text,
  primary key (recurso, holder)
);
alter table public.factory_leases enable row level security;   -- sólo service_role

create or replace function public.factory_try_acquire(p_recurso text, p_holder text, p_units int, p_capacidad int, p_ttl_s int, p_host text)
returns boolean language plpgsql security definer set search_path = public as $$
declare usado int;
begin
  perform pg_advisory_xact_lock(hashtext('factory_leases:' || p_recurso));
  delete from factory_leases where recurso = p_recurso and expires_at < now();
  select coalesce(sum(units), 0) into usado from factory_leases where recurso = p_recurso and holder <> p_holder;
  if usado + p_units > p_capacidad then return false; end if;
  insert into factory_leases (recurso, holder, units, expires_at, host)
  values (p_recurso, p_holder, p_units, now() + make_interval(secs => p_ttl_s), p_host)
  on conflict (recurso, holder) do update set units = excluded.units, expires_at = excluded.expires_at, host = excluded.host;
  return true;
end $$;

create or replace function public.factory_release(p_recurso text, p_holder text)
returns void language sql security definer set search_path = public as $$
  delete from factory_leases where recurso = p_recurso and holder = p_holder;
$$;

revoke all on function public.factory_try_acquire(text, text, int, int, int, text) from public, anon, authenticated;
revoke all on function public.factory_release(text, text) from public, anon, authenticated;

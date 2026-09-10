create sequence if not exists public.student_id_seq minvalue 100000 maxvalue 999999 start 100000 increment 1 no cycle;
create sequence if not exists public.sub_admin_id_seq minvalue 1000 maxvalue 9999 start 1000 increment 1 no cycle;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null,
  mobile text,
  email text,
  role text not null default 'student' check (role in ('student','main_admin','sub_admin')),
  student_id integer unique,
  sub_admin_id integer unique,
  status text not null default 'active' check (status in ('active','blocked','suspended')),
  email_verified boolean not null default false,
  mobile_verified boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint profiles_identity_check check (
    (role = 'student' and student_id is not null and sub_admin_id is null)
    or (role = 'sub_admin' and sub_admin_id is not null and student_id is null)
    or (role = 'main_admin' and student_id is null and sub_admin_id is null)
  )
);

create unique index if not exists profiles_mobile_unique on public.profiles (mobile) where mobile is not null;
create unique index if not exists profiles_email_unique on public.profiles (lower(email)) where email is not null;

create or replace function public.set_profile_ids()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  if new.role = 'student' and new.student_id is null then new.student_id := nextval('public.student_id_seq');
  elsif new.role = 'sub_admin' and new.sub_admin_id is null then new.sub_admin_id := nextval('public.sub_admin_id_seq'); end if;
  new.updated_at := now(); return new;
end; $$;

drop trigger if exists profiles_set_ids on public.profiles;
create trigger profiles_set_ids before insert or update on public.profiles for each row execute function public.set_profile_ids();

create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, full_name, mobile, email, role)
  values (new.id, coalesce(new.raw_user_meta_data ->> 'full_name',''), coalesce(new.phone,new.raw_user_meta_data ->> 'mobile'), new.email, 'student')
  on conflict (id) do update set full_name=excluded.full_name, mobile=coalesce(excluded.mobile,profiles.mobile), email=coalesce(excluded.email,profiles.email), updated_at=now();
  return new;
end; $$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created after insert on auth.users for each row execute function public.handle_new_user();

alter table public.profiles enable row level security;
drop policy if exists profiles_select_own on public.profiles;
create policy profiles_select_own on public.profiles for select to authenticated using (auth.uid() = id);
drop policy if exists profiles_update_own on public.profiles;
create policy profiles_update_own on public.profiles for update to authenticated using (auth.uid() = id) with check (auth.uid() = id and role = (select p.role from public.profiles p where p.id = auth.uid()));

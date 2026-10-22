-- First create your login in Authentication > Users > Add user.
-- Replace YOUR_ADMIN_EMAIL below with that account's email. Never use a password here.
do $$
declare target_id uuid;
begin
 select id into target_id from auth.users where lower(email)=lower('YOUR_ADMIN_EMAIL');
 if target_id is null then raise exception 'Conta não encontrada: crie o usuário e preencha o e-mail correto antes de executar.'; end if;
 insert into public.cms_members(user_id,role) values(target_id,'admin') on conflict(user_id) do update set role='admin';
end $$;
select user_id,role from public.cms_members where role='admin';

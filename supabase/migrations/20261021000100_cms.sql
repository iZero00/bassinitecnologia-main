begin;
-- CMS: drafts and published snapshots are separate. Apply manually after backup.
create table public.cms_members (user_id uuid primary key references auth.users(id) on delete cascade, role text not null check(role in ('admin','editor','publisher')));
alter table public.cms_members enable row level security;
create policy "Read own membership" on public.cms_members for select to authenticated using(user_id=auth.uid());
create function public.cms_role() returns text language sql stable security definer set search_path=public as $$ select role from public.cms_members where user_id=auth.uid() $$;
revoke all on function public.cms_role() from public; grant execute on function public.cms_role() to authenticated;
create table public.cms_entries (
 id uuid primary key default gen_random_uuid(), resource text not null check(resource in ('projects','categories','areas','plans','faq','content','settings','media')),
 draft jsonb not null check(jsonb_typeof(draft)='object'), published jsonb,
 position integer not null default 0, archived boolean not null default false,
 updated_at timestamptz not null default now(), published_at timestamptz
);
create unique index cms_single_settings on public.cms_entries(resource) where resource='settings';
alter table public.cms_entries enable row level security;
create policy "Staff reads drafts" on public.cms_entries for select to authenticated using(public.cms_role() is not null);
revoke all on public.cms_entries from anon, authenticated;
grant select on public.cms_entries to authenticated;
grant select on public.cms_members to authenticated;
create table public.cms_history(id bigint generated always as identity primary key,entry_id uuid,actor uuid,action text not null,snapshot jsonb,created_at timestamptz not null default now());
alter table public.cms_history enable row level security;
create policy "Staff history" on public.cms_history for select to authenticated using(public.cms_role() is not null);
revoke all on public.cms_history from anon,authenticated; grant select on public.cms_history to authenticated;
create view public.cms_public as select id,resource,published as payload,position from public.cms_entries where published is not null and not archived;
revoke all on public.cms_public from public; grant select on public.cms_public to anon,authenticated;
create function public.cms_save(entry_id uuid,kind text,body jsonb,expected_updated timestamptz default null) returns uuid language plpgsql security definer set search_path=public as $$
declare result uuid; old public.cms_entries;
begin
 if public.cms_role() is null then raise exception 'Acesso negado'; end if;
 if kind='settings' and public.cms_role()<>'admin' then raise exception 'Somente administrador'; end if;
 if body is null or jsonb_typeof(body)<>'object' or length(trim(coalesce(body->>'title','')))=0 or octet_length(body::text)>100000 then raise exception 'Conteúdo inválido'; end if;
 if jsonb_typeof(body->'title')<>'string' or length(body->>'title')>200 then raise exception 'Título inválido'; end if;
 if kind='projects' and coalesce(body->>'url','') !~ '^https?://' then raise exception 'Informe uma URL pública'; end if;
 if kind='projects' and ((body ? 'categories' and jsonb_typeof(body->'categories')<>'array') or (body ? 'areas' and jsonb_typeof(body->'areas')<>'array')) then raise exception 'Categorias e áreas devem ser listas'; end if;
 if kind='plans' and ((body->>'price')::numeric<0 or coalesce((body->>'installments')::integer,1) not between 1 and 6) then raise exception 'Preço ou parcelamento inválido'; end if;
 if coalesce(body->>'url','')<>'' and (body->>'url') !~ '^https?://' then raise exception 'URL inválida'; end if;
 if coalesce(body->>'image_url','')<>'' and (body->>'image_url') !~ '^https?://' then raise exception 'Imagem inválida'; end if;
 if entry_id is null then
 insert into public.cms_entries(resource,draft) values(kind,body) returning id into result;
 else
 select * into old from public.cms_entries where id=entry_id for update;
 if not found or old.resource<>kind then raise exception 'Registro inválido'; end if;
 if expected_updated is null or old.updated_at<>expected_updated then raise exception 'Conteúdo alterado por outro usuário. Recarregue antes de salvar.'; end if;
 update public.cms_entries set draft=body,updated_at=clock_timestamp() where id=entry_id returning id into result;
 end if;
 insert into public.cms_history(entry_id,actor,action,snapshot) values(result,auth.uid(),'save',body);
 return result;
end $$;
create function public.cms_transition(ids uuid[],operation text) returns void language plpgsql security definer set search_path=public as $$
declare item public.cms_entries;
begin
 if public.cms_role() not in ('admin','publisher') or public.cms_role() is null then raise exception 'Sem permissão de publicação'; end if;
 if operation not in ('publish','unpublish','archive','restore','delete') then raise exception 'Operação inválida'; end if;
 if operation='delete' and public.cms_role()<>'admin' then raise exception 'Somente administrador pode excluir'; end if;
 if cardinality(ids)>200 or cardinality(ids)<1 then raise exception 'Selecione de 1 a 200 registros'; end if;
 for item in select * from public.cms_entries where id=any(ids) order by id for update loop
 if item.resource='settings' and public.cms_role()<>'admin' then raise exception 'Somente administrador'; end if;
 if operation='publish' and item.resource='projects' and exists (
 select 1 from (
 select value as ref,'categories' as kind from jsonb_array_elements_text(coalesce(item.draft->'categories','[]'::jsonb))
 union all select value as ref,'areas' as kind from jsonb_array_elements_text(coalesce(item.draft->'areas','[]'::jsonb))
 ) refs where not exists (select 1 from public.cms_entries e where e.id::text=refs.ref and e.resource=refs.kind and ((e.published is not null and not e.archived) or e.id=any(ids)))
 ) then raise exception 'Publique as categorias e áreas vinculadas antes do projeto ou no mesmo lote'; end if;

 insert into public.cms_history(entry_id,actor,action,snapshot) values(item.id,auth.uid(),operation,jsonb_build_object('draft',item.draft,'published',item.published));
 if operation='delete' then delete from public.cms_entries where id=item.id;
 else update public.cms_entries set published=case when operation='publish' then draft when operation='unpublish' then null else published end,
 archived=case when operation='archive' then true when operation in ('restore','publish') then false else archived end,
 published_at=case when operation='publish' then now() else published_at end,updated_at=clock_timestamp() where id=item.id;
 end if;
 end loop;
end $$;
revoke all on function public.cms_save(uuid,text,jsonb,timestamptz),public.cms_transition(uuid[],text) from public;
grant execute on function public.cms_save(uuid,text,jsonb,timestamptz),public.cms_transition(uuid[],text) to authenticated;
-- Preserve the existing portfolio as initially published snapshots.
insert into public.cms_entries(id,resource,draft,published,published_at)
select id,'projects',jsonb_build_object('title',title,'description',description,'url',url,'image_url',image_url,'categories','[]'::jsonb,'areas','[]'::jsonb),jsonb_build_object('title',title,'description',description,'url',url,'image_url',image_url,'categories','[]'::jsonb,'areas','[]'::jsonb),now() from public.portfolio_sites;
-- Legacy routes/functions must no longer bypass publication.
revoke all on public.portfolio_sites from anon,authenticated;
-- Screenshots are public assets; drafts must never contain confidential images.
drop policy if exists "Authenticated users can upload screenshots" on storage.objects;
drop policy if exists "Authenticated users can delete screenshots" on storage.objects;
create policy "CMS upload" on storage.objects for insert to authenticated with check(bucket_id='site-screenshots' and public.cms_role() is not null and (storage.foldername(name))[1]=auth.uid()::text);
create policy "CMS delete own images" on storage.objects for delete to authenticated using(bucket_id='site-screenshots' and (storage.foldername(name))[1]=auth.uid()::text and public.cms_role() is not null);
update storage.buckets set file_size_limit=5242880,allowed_mime_types=array['image/jpeg','image/png','image/webp'] where id='site-screenshots';

insert into public.cms_entries(resource,draft,published,position,published_at) values('categories','{"title": "Borracharias"}'::jsonb,'{"title": "Borracharias"}'::jsonb,0,now());

insert into public.cms_entries(resource,draft,published,position,published_at) values('categories','{"title": "Lojas de pneus"}'::jsonb,'{"title": "Lojas de pneus"}'::jsonb,1,now());

insert into public.cms_entries(resource,draft,published,position,published_at) values('areas','{"title": "Comércio"}'::jsonb,'{"title": "Comércio"}'::jsonb,2,now());

insert into public.cms_entries(resource,draft,published,position,published_at) values('areas','{"title": "Serviços"}'::jsonb,'{"title": "Serviços"}'::jsonb,3,now());

insert into public.cms_entries(resource,draft,published,position,published_at) values('settings','{"title": "Bassini Tecnologia", "whatsapp": "5567993073133", "cnpj": "", "payment_url": "", "pix": ""}'::jsonb,'{"title": "Bassini Tecnologia", "whatsapp": "5567993073133", "cnpj": "", "payment_url": "", "pix": ""}'::jsonb,4,now());

insert into public.cms_entries(resource,draft,published,position,published_at) values('plans','{"title": "Landing", "price": 497, "features": "1 página completa\nDesign responsivo\nWhatsApp", "installments": 1}'::jsonb,'{"title": "Landing", "price": 497, "features": "1 página completa\nDesign responsivo\nWhatsApp", "installments": 1}'::jsonb,5,now());

insert into public.cms_entries(resource,draft,published,position,published_at) values('plans','{"title": "Essencial", "price": 997, "features": "Até 3 páginas\nDesign responsivo\nFormulário de contato", "installments": 6}'::jsonb,'{"title": "Essencial", "price": 997, "features": "Até 3 páginas\nDesign responsivo\nFormulário de contato", "installments": 6}'::jsonb,6,now());

insert into public.cms_entries(resource,draft,published,position,published_at) values('plans','{"title": "Profissional", "price": 1497, "features": "Até 5 páginas\nSEO\nPainel administrativo", "installments": 6}'::jsonb,'{"title": "Profissional", "price": 1497, "features": "Até 5 páginas\nSEO\nPainel administrativo", "installments": 6}'::jsonb,7,now());

insert into public.cms_entries(resource,draft,published,position,published_at) values('plans','{"title": "Premium", "price": 1947, "features": "Até 7 páginas\nAnimações\nSuporte prioritário", "installments": 6}'::jsonb,'{"title": "Premium", "price": 1947, "features": "Até 7 páginas\nAnimações\nSuporte prioritário", "installments": 6}'::jsonb,8,now());

insert into public.cms_entries(resource,draft,published,position,published_at) values('content','{"title": "Manutenção opcional", "description": "R$99/mês: 2 solicitações simples. R$219/mês: 5 solicitações simples. Serviço avulso desde R$69. Solicitações simples incluem troca de textos, imagens e pequenos ajustes; funcionalidades novas exigem orçamento."}'::jsonb,'{"title": "Manutenção opcional", "description": "R$99/mês: 2 solicitações simples. R$219/mês: 5 solicitações simples. Serviço avulso desde R$69. Solicitações simples incluem troca de textos, imagens e pequenos ajustes; funcionalidades novas exigem orçamento."}'::jsonb,9,now());

insert into public.cms_entries(resource,draft,published,position,published_at) values('content','{"title": "Pagamento e hospedagem", "description": "Pagamento via Pix ou link InfinitePay; até 6x sem juros conforme o plano. Domínio pago pelo cliente. Hospedagem gratuita somente em serviços que permitam uso comercial e dentro dos limites contratados."}'::jsonb,'{"title": "Pagamento e hospedagem", "description": "Pagamento via Pix ou link InfinitePay; até 6x sem juros conforme o plano. Domínio pago pelo cliente. Hospedagem gratuita somente em serviços que permitam uso comercial e dentro dos limites contratados."}'::jsonb,10,now());

insert into public.cms_entries(resource,draft,published,position,published_at) values('faq','{"title": "Preciso contratar manutenção?", "description": "Não. A manutenção é opcional. Você pode contratar um plano mensal ou solicitar atendimento avulso desde R$69."}'::jsonb,'{"title": "Preciso contratar manutenção?", "description": "Não. A manutenção é opcional. Você pode contratar um plano mensal ou solicitar atendimento avulso desde R$69."}'::jsonb,11,now());

insert into public.cms_entries(resource,draft,published,position,published_at) values('faq','{"title": "Como funciona o pagamento?", "description": "Pix ou link InfinitePay, com até 6x sem juros conforme o plano. As condições são confirmadas no orçamento."}'::jsonb,'{"title": "Como funciona o pagamento?", "description": "Pix ou link InfinitePay, com até 6x sem juros conforme o plano. As condições são confirmadas no orçamento."}'::jsonb,12,now());

insert into public.cms_entries(resource,draft,published,position,published_at) values('faq','{"title": "Domínio e hospedagem estão inclusos?", "description": "O domínio é pago pelo cliente. A hospedagem pode ser gratuita quando o serviço permitir uso comercial e atender às necessidades e limites do projeto."}'::jsonb,'{"title": "Domínio e hospedagem estão inclusos?", "description": "O domínio é pago pelo cliente. A hospedagem pode ser gratuita quando o serviço permitir uso comercial e atender às necessidades e limites do projeto."}'::jsonb,13,now());

commit;

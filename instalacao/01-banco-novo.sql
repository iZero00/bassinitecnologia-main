-- ONLY for a NEW, EMPTY Supabase project. Run once. Do not run old migrations as well.
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
-- Public assets bucket in the NEW project only.
insert into storage.buckets(id,name,public,file_size_limit,allowed_mime_types)
values ('site-screenshots','site-screenshots',true,5242880,array['image/jpeg','image/png','image/webp']);
create policy "CMS public images" on storage.objects for select to anon,authenticated using(bucket_id='site-screenshots');
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


-- Import all 16 exported projects. Image URLs are preserved; image files remain backed up locally.
insert into public.cms_entries(id,resource,draft,published,position,published_at) values ('21629049-e044-4d44-9d65-2698d1fae95e','projects','{"title": "MP Guincho", "description": "Serviço de guincho e socorro veicular 24h em Três Lagoas. Transporte de carros, motos, implementos e máquinas agrícolas com rapidez e segurança.", "url": "https://mpguincho.lovable.app", "image_url": "https://kgkujxvumfgqnninxaxd.supabase.co/storage/v1/object/public/site-screenshots/auto%2Fmpguincho.png", "categories": [], "areas": []}'::jsonb,'{"title": "MP Guincho", "description": "Serviço de guincho e socorro veicular 24h em Três Lagoas. Transporte de carros, motos, implementos e máquinas agrícolas com rapidez e segurança.", "url": "https://mpguincho.lovable.app", "image_url": "https://kgkujxvumfgqnninxaxd.supabase.co/storage/v1/object/public/site-screenshots/auto%2Fmpguincho.png", "categories": [], "areas": []}'::jsonb,100,now());
insert into public.cms_entries(id,resource,draft,published,position,published_at) values ('89b797f5-8f78-4146-bf05-738a68975382','projects','{"title": "O Rei dos Colchões", "description": "Loja de colchões premium com catálogo completo de marcas como Simmons e linha própria. Atendimento personalizado para encontrar o colchão ideal.", "url": "https://reidoscolchoes.lovable.app", "image_url": "https://kgkujxvumfgqnninxaxd.supabase.co/storage/v1/object/public/site-screenshots/auto%2Freidoscolchoes.png", "categories": [], "areas": []}'::jsonb,'{"title": "O Rei dos Colchões", "description": "Loja de colchões premium com catálogo completo de marcas como Simmons e linha própria. Atendimento personalizado para encontrar o colchão ideal.", "url": "https://reidoscolchoes.lovable.app", "image_url": "https://kgkujxvumfgqnninxaxd.supabase.co/storage/v1/object/public/site-screenshots/auto%2Freidoscolchoes.png", "categories": [], "areas": []}'::jsonb,101,now());
insert into public.cms_entries(id,resource,draft,published,position,published_at) values ('8e66a90f-93cf-4e4a-99ef-28b94685346b','projects','{"title": "Nagate Bebidas", "description": "Distribuidora de bebidas com entrega rápida. Cervejas, destilados, vinhos, refrigerantes e combos com identidade japonesa-brasileira.", "url": "https://nagatebebidas.lovable.app", "image_url": "https://kgkujxvumfgqnninxaxd.supabase.co/storage/v1/object/public/site-screenshots/auto%2Fnagatebebidas.png", "categories": [], "areas": []}'::jsonb,'{"title": "Nagate Bebidas", "description": "Distribuidora de bebidas com entrega rápida. Cervejas, destilados, vinhos, refrigerantes e combos com identidade japonesa-brasileira.", "url": "https://nagatebebidas.lovable.app", "image_url": "https://kgkujxvumfgqnninxaxd.supabase.co/storage/v1/object/public/site-screenshots/auto%2Fnagatebebidas.png", "categories": [], "areas": []}'::jsonb,102,now());
insert into public.cms_entries(id,resource,draft,published,position,published_at) values ('ea336b7f-aea2-4611-8d52-fce54e53e001','projects','{"title": "Body Transform Academia", "description": "Site para academia com planos de treino, estrutura moderna, equipamentos profissionais e agendamento de aulas experimentais via WhatsApp.", "url": "https://bodytransform.lovable.app", "image_url": "https://image.thum.io/get/width/1280/crop/720/noanimate/https://bodytransform.lovable.app", "categories": [], "areas": []}'::jsonb,'{"title": "Body Transform Academia", "description": "Site para academia com planos de treino, estrutura moderna, equipamentos profissionais e agendamento de aulas experimentais via WhatsApp.", "url": "https://bodytransform.lovable.app", "image_url": "https://image.thum.io/get/width/1280/crop/720/noanimate/https://bodytransform.lovable.app", "categories": [], "areas": []}'::jsonb,103,now());
insert into public.cms_entries(id,resource,draft,published,position,published_at) values ('70462e5f-3d4c-4abe-96db-2d8f22ff5f0a','projects','{"title": "Joalheria Elegância", "description": "Site de joalheria com coleções de joias, alianças e óculos premium. Catálogo de produtos com preços, sistema de favoritos e atendimento via WhatsApp.", "url": "https://joalheriaelegancia.lovable.app/", "image_url": "https://image.thum.io/get/width/1280/crop/720/noanimate/https://joalheriaelegancia.lovable.app/", "categories": [], "areas": []}'::jsonb,'{"title": "Joalheria Elegância", "description": "Site de joalheria com coleções de joias, alianças e óculos premium. Catálogo de produtos com preços, sistema de favoritos e atendimento via WhatsApp.", "url": "https://joalheriaelegancia.lovable.app/", "image_url": "https://image.thum.io/get/width/1280/crop/720/noanimate/https://joalheriaelegancia.lovable.app/", "categories": [], "areas": []}'::jsonb,104,now());
insert into public.cms_entries(id,resource,draft,published,position,published_at) values ('26273270-3f25-4c0d-b69b-eae7d2aba6ec','projects','{"title": "Dra. Helena Moura - Veterinária", "description": "Site institucional para clínica veterinária com atendimento humanizado e serviços especializados.", "url": "https://drhelenavet.lovable.app/", "image_url": "https://kgkujxvumfgqnninxaxd.supabase.co/storage/v1/object/public/site-screenshots/examples%2Fdrhelena.png", "categories": [], "areas": []}'::jsonb,'{"title": "Dra. Helena Moura - Veterinária", "description": "Site institucional para clínica veterinária com atendimento humanizado e serviços especializados.", "url": "https://drhelenavet.lovable.app/", "image_url": "https://kgkujxvumfgqnninxaxd.supabase.co/storage/v1/object/public/site-screenshots/examples%2Fdrhelena.png", "categories": [], "areas": []}'::jsonb,105,now());
insert into public.cms_entries(id,resource,draft,published,position,published_at) values ('db92309b-ab3d-460c-9ff3-49023a9fb3c2','projects','{"title": "Fabiana Casagranda - Nutricionista", "description": "Site profissional para nutricionista especializada com agendamento de consultas e depoimentos.", "url": "https://fabinutri.vercel.app/", "image_url": "https://kgkujxvumfgqnninxaxd.supabase.co/storage/v1/object/public/site-screenshots/examples%2Ffabinutri.png", "categories": [], "areas": []}'::jsonb,'{"title": "Fabiana Casagranda - Nutricionista", "description": "Site profissional para nutricionista especializada com agendamento de consultas e depoimentos.", "url": "https://fabinutri.vercel.app/", "image_url": "https://kgkujxvumfgqnninxaxd.supabase.co/storage/v1/object/public/site-screenshots/examples%2Ffabinutri.png", "categories": [], "areas": []}'::jsonb,106,now());
insert into public.cms_entries(id,resource,draft,published,position,published_at) values ('c4e28dd6-0b41-4707-b6f1-3635c3d42d65','projects','{"title": "Foca no Cell", "description": "Site para assistência técnica de celulares com catálogo de serviços e integração WhatsApp.", "url": "https://focanocell.vercel.app/", "image_url": "https://kgkujxvumfgqnninxaxd.supabase.co/storage/v1/object/public/site-screenshots/examples%2Ffocanocell.png", "categories": [], "areas": []}'::jsonb,'{"title": "Foca no Cell", "description": "Site para assistência técnica de celulares com catálogo de serviços e integração WhatsApp.", "url": "https://focanocell.vercel.app/", "image_url": "https://kgkujxvumfgqnninxaxd.supabase.co/storage/v1/object/public/site-screenshots/examples%2Ffocanocell.png", "categories": [], "areas": []}'::jsonb,107,now());
insert into public.cms_entries(id,resource,draft,published,position,published_at) values ('8c3c7174-2e27-4c90-82a6-4c8729e57ea1','projects','{"title": "FORT Consultoria", "description": "Site institucional para consultoria em segurança do trabalho com mais de 17 anos de experiência.", "url": "https://www.fortsst.com.br/", "image_url": "https://kgkujxvumfgqnninxaxd.supabase.co/storage/v1/object/public/site-screenshots/examples%2Ffortsst.png", "categories": [], "areas": []}'::jsonb,'{"title": "FORT Consultoria", "description": "Site institucional para consultoria em segurança do trabalho com mais de 17 anos de experiência.", "url": "https://www.fortsst.com.br/", "image_url": "https://kgkujxvumfgqnninxaxd.supabase.co/storage/v1/object/public/site-screenshots/examples%2Ffortsst.png", "categories": [], "areas": []}'::jsonb,108,now());
insert into public.cms_entries(id,resource,draft,published,position,published_at) values ('279e4dcf-1a21-4b37-8937-eda7fa01ff0c','projects','{"title": "Offs Na Hora", "description": "Plataforma de locução profissional com demonstrativos de áudio e solicitação de orçamentos online.", "url": "https://www.offsnahora.com.br/", "image_url": "https://kgkujxvumfgqnninxaxd.supabase.co/storage/v1/object/public/site-screenshots/examples%2Foffsnahora.png", "categories": [], "areas": []}'::jsonb,'{"title": "Offs Na Hora", "description": "Plataforma de locução profissional com demonstrativos de áudio e solicitação de orçamentos online.", "url": "https://www.offsnahora.com.br/", "image_url": "https://kgkujxvumfgqnninxaxd.supabase.co/storage/v1/object/public/site-screenshots/examples%2Foffsnahora.png", "categories": [], "areas": []}'::jsonb,109,now());
insert into public.cms_entries(id,resource,draft,published,position,published_at) values ('32bda2e4-66e3-40d4-bb7c-b19573ca2e6c','projects','{"title": "O Meu Cofrinho", "description": "Plataforma de controle financeiro pessoal com planos gratuitos e premium para organizar suas finanças de forma simples.", "url": "https://www.omeucofrinho.com.br/", "image_url": null, "categories": [], "areas": []}'::jsonb,'{"title": "O Meu Cofrinho", "description": "Plataforma de controle financeiro pessoal com planos gratuitos e premium para organizar suas finanças de forma simples.", "url": "https://www.omeucofrinho.com.br/", "image_url": null, "categories": [], "areas": []}'::jsonb,110,now());
insert into public.cms_entries(id,resource,draft,published,position,published_at) values ('18641aa7-d3f4-4b00-a032-11ac7545e2e1','projects','{"title": "Dr Thor Suplementos", "description": "Loja de suplementos com entrega exclusiva em Três Lagoas - MS e atendimento direto pelo WhatsApp.", "url": "https://dr-thor-suplementos.vercel.app/", "image_url": null, "categories": [], "areas": []}'::jsonb,'{"title": "Dr Thor Suplementos", "description": "Loja de suplementos com entrega exclusiva em Três Lagoas - MS e atendimento direto pelo WhatsApp.", "url": "https://dr-thor-suplementos.vercel.app/", "image_url": null, "categories": [], "areas": []}'::jsonb,111,now());
insert into public.cms_entries(id,resource,draft,published,position,published_at) values ('4940efc9-d4f6-47c7-927d-e3284121843e','projects','{"title": "Burger Venezuelano Express", "description": "Cardápio digital de hamburgueria venezuelana com pedidos online e retirada na loja.", "url": "https://burger-venezuelano-express.vercel.app/", "image_url": null, "categories": [], "areas": []}'::jsonb,'{"title": "Burger Venezuelano Express", "description": "Cardápio digital de hamburgueria venezuelana com pedidos online e retirada na loja.", "url": "https://burger-venezuelano-express.vercel.app/", "image_url": null, "categories": [], "areas": []}'::jsonb,112,now());
insert into public.cms_entries(id,resource,draft,published,position,published_at) values ('7f64a535-a6cb-470b-9eda-1e3dc03a6e8f','projects','{"title": "Nutrigen", "description": "Gerador de planos alimentares personalizados com cálculo de calorias e macros em minutos.", "url": "https://nutrigen-fawn.vercel.app/", "image_url": null, "categories": [], "areas": []}'::jsonb,'{"title": "Nutrigen", "description": "Gerador de planos alimentares personalizados com cálculo de calorias e macros em minutos.", "url": "https://nutrigen-fawn.vercel.app/", "image_url": null, "categories": [], "areas": []}'::jsonb,113,now());
insert into public.cms_entries(id,resource,draft,published,position,published_at) values ('4fde6e9f-89fc-4e21-a7a3-a7ca52377bd8','projects','{"title": "GlobalMS Glow Up", "description": "Site institucional da Global Informática com soluções em redes, telefonia, monitoramento e automação desde 2007.", "url": "https://globalms-glow-up.vercel.app/", "image_url": null, "categories": [], "areas": []}'::jsonb,'{"title": "GlobalMS Glow Up", "description": "Site institucional da Global Informática com soluções em redes, telefonia, monitoramento e automação desde 2007.", "url": "https://globalms-glow-up.vercel.app/", "image_url": null, "categories": [], "areas": []}'::jsonb,114,now());
insert into public.cms_entries(id,resource,draft,published,position,published_at) values ('2271ee3b-49d3-4a8c-b126-1b8ea7d30033','projects','{"title": "CV Fácil", "description": "Ferramenta gratuita para criar currículos profissionais em PDF com preview em tempo real.", "url": "https://cvfacil-ten.vercel.app/", "image_url": null, "categories": [], "areas": []}'::jsonb,'{"title": "CV Fácil", "description": "Ferramenta gratuita para criar currículos profissionais em PDF com preview em tempo real.", "url": "https://cvfacil-ten.vercel.app/", "image_url": null, "categories": [], "areas": []}'::jsonb,115,now());
commit;

select resource,count(*) as quantidade from public.cms_entries group by resource order by resource;

# Bassini Tecnologia — implementação local

Esta cópia foi criada a partir da pasta atual fornecida em Downloads. O original não foi editado. Nenhum banco remoto, GitHub, Lovable ou serviço de hospedagem foi alterado.

## O que mudou

- Catálogo completo na página inicial e em `/cases`: pesquisa sem distinção de acentos, filtros por categoria e área, múltiplas categorias/áreas por projeto, imagens com alternativa e WhatsApp contextualizado.
- Prévia modal com largura de desktop/celular, navegação por teclado e alternativa explícita para imagem ou nova aba. O navegador não permite detectar com segurança todos os bloqueios de iframe de outros domínios; a alternativa permanece sempre acessível.
- `/admin` verifica sessão e vínculo em `cms_members`. Funções: `editor` salva rascunhos; `publisher` também publica, retira do ar e arquiva; `admin` também gerencia configurações e exclui definitivamente. A atribuição inicial de funções é feita pelo responsável pelo banco, fora do site.
- Projetos, categorias, áreas, planos, FAQ, textos comerciais, configurações e mídias. Upload JPG/PNG/WebP até 5 MB; captura opcional por thum.io. A captura não salva nem publica o projeto automaticamente.
- Rascunhos separados dos registros publicados. Salvar nunca publica. Publicação individual/em lote, retirada do ar, arquivamento/restauração e exclusão com confirmação. Histórico dos últimos 30 eventos por item, com versões salvas; sem restauração automática de versões.
- Concorrência: salvar rejeita uma versão desatualizada, evitando sobrescrever alterações de outro editor. Publicar usa a última versão salva; alterações ainda não salvas no formulário não entram na publicação.
- Planos iniciais: Landing R$497 (à vista), Essencial R$997, Profissional R$1.497 e Premium R$1.947 (até 6x). O administrador pode alterar preço e parcelamento por plano.
- Manutenção opcional: R$99/mês com 2 solicitações simples, R$219/mês com 5, avulso desde R$69. Textos editáveis no módulo Conteúdo comercial.
- Pix/link InfinitePay, domínio pago pelo cliente e hospedagem gratuita condicionada à permissão comercial e aos limites do serviço. Não há processamento de cartão ou geração de cobranças no site; links de pagamento são cadastrados pelo administrador.

## Preparação local

1. Use Node compatível com os requisitos em `node_modules/vite/package.json` (recomendado Node 22 atualizado) e npm.
2. Na pasta desta cópia, execute `npm ci`.
3. Copie `.env.example` para `.env.local` e preencha `VITE_SUPABASE_URL` e `VITE_SUPABASE_PUBLISHABLE_KEY` do projeto Supabase confirmado pelo proprietário. Nunca coloque a chave `service_role` no frontend.
4. Execute `npm run dev` e abra a URL local informada. Sem configuração de ambiente, o cliente usa apenas o endereço local `127.0.0.1:54321` e apresenta falha de carregamento; isso não substitui um banco configurado.

## Ativação do banco — etapa remota separada, ainda não executada

Faça backup e confirme qual projeto Supabase será usado. O identificador herdado de `supabase/config.toml` não deve ser tratado como autorização para conectar ou alterar esse projeto.

Em um banco novo, aplique as migrações de `supabase/migrations` na ordem dos nomes. Em um banco já existente, confira as migrações aplicadas antes de executar somente as pendentes. A nova migração é `20261021000100_cms.sql`; ela é transacional e deve ser executada inteira.

A migração importa os registros existentes de `portfolio_sites` para snapshots inicialmente publicados, sem excluir a tabela original. Depois, revoga seu acesso pelo frontend para impedir exposição de rascunhos por caminhos antigos. O novo site consulta somente a view `cms_public`, que expõe snapshots publicados e não arquivados.

O conteúdo comercial inicial também é publicado como parte dessa migração. Alterações posteriores feitas pelo painel exigem publicação manual. O WhatsApp inicial foi extraído do código fornecido; confirme-o antes da ativação. CNPJ, Pix e links de pagamento ficam vazios até serem informados.

Crie/confirme a conta administrativa no Supabase Authentication e atribua a função pelo editor SQL do responsável. Exemplo a adaptar com o UUID real, sem executar literalmente o marcador:

```sql
insert into public.cms_members(user_id, role)
values ('UUID_REAL_DA_CONTA', 'admin')
on conflict (user_id) do update set role = excluded.role;
```

Nunca permita que visitantes se atribuam funções. Um usuário autenticado sem vínculo não pode acessar os dados administrativos. As regras do banco e as funções validam as permissões independentemente da interface.

Publique as categorias e áreas antes dos projetos que as usam. A publicação em lote atua sobre os itens selecionados do módulo atual, até 200 por operação. Arquivar uma categoria deixa os projetos existentes visíveis, mas remove essa categoria dos filtros públicos.

## Funções e imagens — etapa remota separada, ainda não executada

Após autorização de ativação, o responsável deve publicar as versões fornecidas de `capture-screenshot` e `scrape-metadata`. A antiga captura tinha capacidade de alterar a tabela usando a chave de serviço; a nova só cria um arquivo e exige conta vinculada ao CMS. O antigo importador de metadados foi desativado, pois fazia requisições arbitrárias no servidor; os textos agora são cadastrados explicitamente.

As funções usam `SUPABASE_URL` e `SUPABASE_SERVICE_ROLE_KEY` somente no ambiente do servidor. A captura envia a URL ao serviço externo thum.io, depende da disponibilidade/condições dele e pode falhar. O upload manual permanece disponível.

O bucket `site-screenshots` é público: inclusive arquivos enviados para rascunhos podem ser acessados por quem conhece a URL. Não envie imagens confidenciais. Arquivar/excluir um item não apaga o arquivo compartilhado do bucket, evitando quebrar outros projetos; a limpeza de arquivos não utilizados é manual pelo responsável pelo armazenamento.

## Verificação

```text
npm run build
npx tsc --noEmit -p tsconfig.app.json
npm run lint
npm run test
npx playwright test --reporter=list --workers=1
```

Os testes de navegador usam dados simulados, não credenciais de produção. O Playwright usa Microsoft Edge neste computador; em outro ambiente, ajuste `channel` em `playwright.config.ts` para o navegador instalado. A compilação não confirma aplicação de migrações ou permissões no banco remoto.

Antes de ativar em produção, valide em um banco de homologação: visitante vê somente publicados; usuário sem função não vê rascunhos; editor não publica; publisher não exclui/configura; administrador executa as operações autorizadas; sessões expiradas são recusadas; uploads e captura funcionam; publicar altera o site e salvar rascunho não altera. Essas verificações reais dependem da ativação autorizada e não foram executadas nesta entrega local.

## Hospedagem

Vercel Hobby é limitado a uso pessoal/não comercial: https://vercel.com/docs/plans/hobby . Para um site comercial na Vercel, use plano comercial adequado, como Pro, e confirme os custos/limites antes da contratação. O frontend continua compatível com hospedagem estática; banco, autenticação, armazenamento e funções permanecem no Supabase.

O arquivo `vercel.json` mantém as rotas da SPA e permite iframes externos, sem permitir que terceiros incorporem este site. Em outra hospedagem, reproduza os redirecionamentos, o fallback para `index.html` e os cabeçalhos de segurança. Nenhuma publicação, compra, conexão de conta ou aplicação de SQL está autorizada automaticamente por este documento.

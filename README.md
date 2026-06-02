# Bassini Tecnologia — Site

Aplicação web (Vite + React + TypeScript) do site da Bassini Tecnologia, com páginas públicas e um painel administrativo para gerenciar os cases/portfólio via Supabase.

## Rotas

- `/` — Página inicial
- `/vendas` — Landing de vendas (planos)
- `/cases` — Lista de cases/portfólio
- `/auth` — Login (Supabase Auth)
- `/admin` — Painel para cadastrar/remover sites do portfólio (requer login)

## Stack

- Vite + React + TypeScript
- Tailwind CSS + shadcn/ui
- React Router
- TanStack Query
- Supabase (Auth + Postgres + Storage + Edge Functions)

## Como rodar localmente

### 1) Instalar dependências

```bash
npm install
```

No Windows/PowerShell, se o `npm` estiver bloqueado por ExecutionPolicy, use:

```bash
npm.cmd install
```

### 2) Variáveis de ambiente

Crie um arquivo `.env.local` na raiz do projeto com:

```bash
VITE_SUPABASE_URL=...
VITE_SUPABASE_PUBLISHABLE_KEY=...
```

### 3) Rodar o projeto

```bash
npm run dev
```

O servidor do Vite roda por padrão em `http://localhost:8080`.

## Scripts

- `npm run dev` — servidor de desenvolvimento
- `npm run build` — build de produção
- `npm run preview` — servir o build localmente
- `npm run lint` — ESLint
- `npm run test` — Vitest

## Supabase (referência rápida)

### Tabela `portfolio_sites`

Usada para alimentar a página inicial e a página de cases. Principais campos:

- `title`, `url`, `description`, `image_url`, `user_id`, `created_at`, `updated_at`

### Storage

- Bucket `site-screenshots` (usado para salvar as imagens geradas automaticamente)

### Edge Functions

- `scrape-metadata`: tenta extrair título/descrição/imagem de uma URL para ajudar no cadastro no painel
- `capture-screenshot`: gera uma imagem do site (via `image.thum.io`), salva no Storage e atualiza `portfolio_sites.image_url`

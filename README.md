# Bassini Tecnologia

Site e painel administrativo em React, TypeScript, Vite e Supabase.

## Desenvolvimento

Use Node 22.12 ou superior compatível com Vite e npm. Execute `npm ci`. Copie `.env.example` para `.env.local` e preencha a URL e a chave pública do seu Supabase. Nunca coloque chaves secretas ou service_role em variáveis VITE_.

```text
npm run dev
npm run build
npm run typecheck
npm run lint
npm test
npm run test:e2e
```

## Organização

- `src/` e `public/`: site e painel.
- `supabase/migrations/`: histórico técnico do banco; não é executado automaticamente pelo frontend ou pela Vercel. Não reaplique em um banco já instalado. O banco novo foi instalado por um script separado.
- `supabase/functions/`: funções do servidor para operações protegidas. Exigem publicação separada no projeto correto do Supabase.
- `tests/` e `src/test/`: verificações locais com dados simulados.
- `.env.example`: nomes das variáveis, sem credenciais.

## Publicação

A Vercel publica o código do GitHub. Configure VITE_SUPABASE_URL e VITE_SUPABASE_PUBLISHABLE_KEY no ambiente escolhido e faça uma nova publicação para aplicar os valores. Preserve as configurações existentes do projeto Vercel.

As instruções específicas de instalação, os SQLs com importação de cadastros, os backups e os relatórios de entrega são mantidos fora do repositório. Arquivos ignorados que já estavam no GitHub precisam ser retirados do repositório: o .gitignore não remove arquivos já enviados.

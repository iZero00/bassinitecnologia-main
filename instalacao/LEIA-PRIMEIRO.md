# Instalação em banco NOVO na sua conta

Este procedimento usa o código atual da pasta bassinitecnologia-atual. Não usa o código antigo do Lovable. Nenhum serviço remoto foi alterado na preparação.

1. No Supabase Dashboard, crie um projeto chamado Bassini Tecnologia. Guarde a senha do banco em local privado. Espere o provisionamento terminar.
2. Nesse projeto novo, abra SQL Editor > New query. Abra 01-banco-novo.sql no Bloco de Notas, copie TODO o conteúdo, cole no editor e execute uma vez. Use somente esse arquivo para o banco novo: não execute também as migrações antigas. Ele cria tabelas, regras, armazenamento e importa os 16 projetos e os planos. O resultado deve incluir projects = 16.
3. Em Authentication > Users, use Add user/Create new user para criar seu login administrativo com e-mail e senha escolhidos por você. Confirme a conta pelo painel quando a opção existir. Não envie a senha no chat.
4. Abra 02-liberar-administrador.sql no Bloco de Notas e substitua YOUR_ADMIN_EMAIL pelo e-mail dessa conta. Execute o conteúdo no SQL Editor do projeto novo. Isso concede a função admin apenas à conta identificada.
5. No diálogo Connect ou Settings > API Keys, localize Project URL e Publishable key (a chave anon legada também pode ser aceita). Não use Secret key nem service_role no frontend.
6. Na Vercel, abra o projeto do site > Settings > Environment Variables. Configure VITE_SUPABASE_URL com Project URL e VITE_SUPABASE_PUBLISHABLE_KEY com Publishable key. Comece no ambiente Preview para testar sem trocar o domínio público. Production usa valores próprios. Alterações de variáveis exigem nova compilação/deployment.
7. No Trae local, crie .env.local com essas mesmas duas variáveis se quiser testar no seu computador. Não envie .env.local ao GitHub. Este arquivo já está ignorado pelo Git.
8. Leve os arquivos da pasta bassinitecnologia-atual para o repositório correto que a Vercel utiliza, na raiz onde está package.json. Faça primeiro uma branch de teste; o push na branch de produção pode publicar automaticamente. Não envie node_modules, dist, backups, .cache ou test-results. Preserve os arquivos .git do seu repositório.
9. A captura automática ainda exige publicar a função supabase/functions/capture-screenshot no PROJETO NOVO e incluir _shared/security.ts. Essa função usa segredos do servidor Supabase; a chave de serviço jamais deve ir em variável VITE_. O config.toml herdado aponta para o banco antigo: confirme/substitua o project_id antes de qualquer comando de implantação. O upload manual usa o bucket criado pelo SQL.
10. Confira o preview: 16 projetos, preços, login em /auth e administração em /admin; edição salva como rascunho, publicação manual e upload de imagem. Revise WhatsApp, CNPJ, contatos e links de pagamento no painel. O número inicial veio do código fornecido e precisa ser confirmado pelo proprietário.
11. Só depois configure as variáveis de Production e publique a branch de produção. O domínio permanece no mesmo projeto Vercel; não é necessário mudá-lo.

Imagens: os links originais existentes são preservados no banco novo; por enquanto ainda podem depender do armazenamento antigo. Há backup local dos 16 arquivos em backups/2026-10-22/imagens, fora do repositório. A transferência automática dessas imagens e a atualização dos links serão feitas antes de desligar o serviço antigo. Os seis projetos sem image_url no CSV ficam sem imagem cadastrada até a transferência; o catálogo possui alternativa visual.

O SQL foi preparado e revisado localmente; ainda não foi executado nem validado em um banco Supabase real. Havendo erro, interrompa e envie a mensagem, sem apagar tabelas nem tentar recriar o projeto. O arquivo principal é transacional: uma falha antes do commit cancela as alterações daquela execução.

Vercel Hobby não é apropriado para uso comercial; confirme plano comercial permitido antes da publicação.

Referências: https://supabase.com/docs/guides/getting-started/api-keys e https://vercel.com/docs/environment-variables .

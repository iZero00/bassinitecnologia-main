# Ajustes do painel — 22/10/2026

## Aplicar os arquivos

Extraia ajustes-painel-2026-10-22.zip em uma pasta temporária. Na pasta do projeto atual que você abre no Trae (a mesma raiz que tem package.json), copie a pasta src do pacote e aceite substituir src/pages/Admin.tsx. O arquivo src/components/admin/ProjectThumbnail.tsx é novo. Preserve .git, .env.local, arquivos de configuração e demais arquivos do seu projeto. Este pacote não altera as variáveis de ambiente nem depende de novas bibliotecas.

A cópia de trabalho bassinitecnologia-atual já contém as alterações; se é ela que você usa, não precisa copiar novamente. As alterações só chegam ao site depois do envio ao repositório correto no GitHub e da publicação pela Vercel. Este trabalho não fez push nem publicação.

## Adicionar as opções no banco já instalado

No Supabase NOVO que o site está utilizando, abra SQL Editor > New query. Abra instalacao/03-categorias-e-areas.sql no Bloco de Notas, copie tudo, cole no editor e clique Run.

Execute somente 03-categorias-e-areas.sql nesta atualização. Não execute de novo 01-banco-novo.sql e não apague tabelas.

O SQL contém uma base de 32 áreas (setores de atuação) e 423 categorias (segmentos específicos). Pode ser executado novamente: ele compara nomes sem diferença de caixa e espaços excedentes para inserir apenas os ausentes. Não apaga, renomeia ou sobrescreve categorias, áreas ou projetos existentes. Registros existentes arquivados/rascunhos mantêm seu estado; novas opções são publicadas para aparecerem nos filtros. O total pode ser maior caso você tenha criado outras opções.

Não existe uma lista finita de todas as atividades possíveis. A base cobre negócios locais, comércio, saúde, automotivo, alimentação, tecnologia, educação, serviços, indústria, agronegócio e outros setores. Você pode continuar criando opções pelo painel.

Não é necessário cadastrar as centenas de opções manualmente. Depois do SQL, recarregue o painel e o site. Cada projeto mantém suas associações anteriores: escolha categorias e áreas adequadas no projeto, salve o rascunho e publique para que apareça nos respectivos filtros. O SQL não atribui categorias aos projetos por suposição.

## O que muda na interface

- Todos os módulos começam com a lista de itens, sem formulário aberto.
- Novo item abre o cadastro; Editar / conferir abre apenas o item escolhido.
- Fechar edição e Cancelar / fechar escondem o formulário. Trocar de módulo também fecha a edição.
- Arquivar, restaurar e excluir ficam dentro da edição. As ações em lote continuam na lista.
- Configurações existentes são abertas por Editar; não é oferecida a criação de uma segunda configuração.
- Projetos mostram a miniatura abaixo do título na lista e no formulário. Usa a imagem cadastrada; se não houver, tenta a prévia via thum.io a partir da URL do site. Isso não grava nem publica uma imagem automaticamente. Se o serviço falhar, aparece uma alternativa textual. Essa tentativa envia a URL ao serviço de captura; o upload manual e o botão de captura continuam disponíveis.
- Busca por nome na lista e busca nas opções de categorias/áreas, com rolagem para evitar listas enormes.
- Salvar rascunho continua separado de Publicar versão salva.

## Verificação

Compilação e TypeScript aprovados. ESLint sem erros (7 avisos herdados nos componentes de interface). Quatro testes unitários aprovados; dez testes de navegador aprovados com banco simulado, incluindo abrir/fechar formulários em todos os oito módulos, miniatura abaixo do título e permissões de edição/publicação. Prévia visual inspecionada.

SQL preparado e revisado; não executado nesta entrega nem testado em banco remoto. Nenhuma conexão com GitHub, aplicação de SQL ou publicação na Vercel foi feita nesta atualização.

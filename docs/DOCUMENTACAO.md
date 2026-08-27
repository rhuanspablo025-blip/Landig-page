# Documentacao do site

## 1. Visao geral

Este projeto e um portfolio pessoal de pagina unica. A camada visual e uma aplicacao React renderizada no navegador e publicada como build estatico na Vercel. As funcoes em `api/` rodam no servidor da Vercel e sao as unicas partes que acessam o banco.

O fluxo foi desenhado para funcionar em dois modos:

- **Local/fallback:** usa `src/data/portfolio.json` e permite desenvolver sem banco.
- **Producao integrada:** tenta carregar `/api/content` e usa dados do Postgres quando a variavel `POSTGRES_URL` esta configurada.

## 2. Fluxo de dados

### Carregamento da pagina

1. `src/App.tsx` inicia com o JSON local.
2. Depois da montagem, faz `GET /api/content`.
3. Se a resposta for valida, substitui o conteudo local pelos dados do banco.
4. Se a API falhar, o usuario continua vendo o conteudo local.

### Envio de contato

1. O formulario valida os campos no navegador.
2. Os dados sao enviados como JSON para `POST /api/contact`.
3. A funcao valida campos obrigatorios e insere em `contact_messages`.
4. O navegador abre o WhatsApp com a mesma mensagem preenchida.
5. Se a API estiver indisponivel localmente, o WhatsApp ainda pode ser aberto.

## 3. Modelo do banco

### `contact_messages`

Tabela de leads recebidos pelo formulario. O campo `created_at` registra o momento do recebimento no banco.

### `site_settings`

Armazena valores JSON para configuracoes que nao precisam de uma tabela propria:

- `nav`: itens do menu.
- `socials`: links de redes sociais.
- `business`: nome, tipo de registro e CNPJ.

### `services`

Cada linha representa um servico. `tags` e um array JSONB de tecnologias ou palavras-chave.

### `projects`

Cada linha representa um projeto. `stack` e um array JSONB, `url` e opcional, `featured` controla o destaque e `sort_order` controla a ordem.

### `stack`

Lista de tecnologias e ferramentas, com ordem de exibicao.

## 4. Edicao de conteudo

O arquivo `database/schema.sql` cria e inicializa o banco. Depois da instalacao, edite os registros diretamente no SQL Editor.

Exemplo para atualizar uma rede social:

```sql
UPDATE site_settings
SET value = jsonb_set(value, '{github}', '"https://github.com/seu-usuario"')
WHERE key = 'socials';
```

Exemplo para adicionar projeto:

```sql
INSERT INTO projects (title, category, description, stack, url, featured, sort_order)
VALUES (
  'Novo projeto',
  'Aplicacao web',
  'Descricao curta do projeto.',
  '["React", "TypeScript"]',
  'https://exemplo.com',
  FALSE,
  4
);
```

Nao existe CRUD administrativo no frontend. Essa decisao evita expor uma area de administracao sem autenticacao. Se for necessario gerenciar o site por uma interface, crie uma area protegida com autenticacao, autorizacao e validacao no servidor.

## 5. Seguranca

- A conexao usa `POSTGRES_URL` apenas em funcoes server-side.
- As consultas usam template SQL parametrizado pelo SDK Neon.
- O endpoint de contato aceita somente POST.
- O endpoint de conteudo aceita somente GET.
- Os campos de contato sao validados antes do INSERT.
- Nenhum segredo deve ser colocado em `src/`, `public/` ou no bundle do Vite.

Recomendacoes antes de uma divulgacao maior:

- Adicionar rate limit por IP no endpoint de contato.
- Adicionar CAPTCHA ou honeypot contra spam.
- Criar uma politica de retencao e exclusao de contatos.
- Restringir acesso ao SQL Editor e ao projeto Vercel.
- Monitorar erros das funcoes serverless.

As rotas tambem aplicam validacao de origem, limites de tamanho, formato de e-mail e rate limit basico de cinco tentativas por IP a cada dez minutos. A Vercel envia headers de seguranca por meio de `vercel.json`, incluindo CSP, bloqueio de iframe, `nosniff`, Permissions Policy e politica de referencia.

O rate limit em memoria e adequado como protecao inicial, mas pode ser contornado quando a Vercel distribui requisicoes em varias instancias. Para uma operacao maior, use Vercel WAF ou Redis/Upstash com contador compartilhado.

## 6. Cookies e armazenamento local

O site nao cria cookies de publicidade nem usa ferramentas de analytics. O banner registra a escolha em `localStorage` com a chave `rp-cookie-choice`. A escolha do tema tambem e aplicada no documento, mas nao e persistida no banco.

Como o armazenamento e essencial para preferencia local, o usuario pode aceitar ou recusar. O site continua funcionando em qualquer escolha.

## 7. Privacidade e comunidade

O modal de privacidade informa que o formulario trata nome, e-mail, telefone e mensagem para responder ao contato. O modal de diretrizes apresenta regras contra assedio, discriminacao, ameacas, fraude, spam e copia indevida de conteudo.

Os documentos nao substituem uma politica juridica formal. Caso sejam coletados mais dados, usados cookies de terceiros ou iniciadas campanhas de marketing, o texto deve ser atualizado e revisado profissionalmente.

## 8. Deploy

A Vercel deve detectar o Vite automaticamente. A configuracao esperada e:

- Build command: `npm run build`
- Output directory: `dist`
- Install command: `npm install` ou deteccao automatica
- Environment variable: `POSTGRES_URL`

O arquivo `vercel.json` envia rotas da SPA para `index.html`. Arquivos estaticos continuam sendo servidos normalmente pela Vercel.

## 9. Checklist de publicacao

- [ ] Executar `npm install`.
- [ ] Executar `npm run build`.
- [ ] Criar o banco Neon/Postgres.
- [ ] Executar `database/schema.sql`.
- [ ] Configurar `POSTGRES_URL` nos ambientes necessarios.
- [ ] Conferir links sociais, CNPJ, telefone e e-mail.
- [ ] Testar formulario em producao.
- [ ] Confirmar registro em `contact_messages`.
- [ ] Testar abertura direta da URL e comportamento mobile.
- [ ] Revisar textos legais e politica de retencao.

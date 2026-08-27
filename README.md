# Rhuan Pablo | Portfolio

Portfolio pessoal de Rhuan Pablo, desenvolvido com React, TypeScript e Vite. O site apresenta experiencia, servicos, projetos, stack tecnica e um canal de contato integrado ao WhatsApp.

## Stack

- React 19
- TypeScript
- Vite
- Lucide React
- Neon Serverless Postgres, integrado pela Vercel
- Vercel Functions

## Funcionalidades

- Layout responsivo para desktop e mobile
- Tema claro e escuro, com preferencia salva localmente
- Navegacao por secoes usando ancora
- Filtro de projetos por categoria
- FAQ expansivel
- Links para LinkedIn, GitHub, Instagram, e-mail e WhatsApp
- Download do curriculo em `public/Curriculo-Rhuan-Pablo.pdf`
- Consentimento para armazenamento essencial de preferencias
- Aviso de privacidade e diretrizes de uso responsavel
- Formulario que salva o contato no banco e abre uma conversa no WhatsApp
- Conteudo carregado do banco quando a API estiver configurada, com fallback para `src/data/portfolio.json`

## Requisitos

- Node.js 20 ou superior
- npm
- Uma conta Vercel para deploy
- Um banco Neon/Postgres para ativar a persistencia

## Desenvolvimento local

```bash
npm install
npm run dev
```

O Vite inicia o site em `http://localhost:5173`.

Sem `POSTGRES_URL`, o site continua exibindo o conteudo local. As funcoes `/api` precisam de uma conexao Postgres configurada para responder corretamente.

## Scripts

```bash
npm run dev       # servidor de desenvolvimento
npm run build     # typecheck e build de producao
npm run preview   # visualiza o build localmente
```

## Deploy na Vercel

1. Importe o repositorio na Vercel.
2. Selecione o framework Vite, caso a deteccao automatica nao aconteca.
3. Use `npm run build` como comando de build.
4. Use `dist` como diretorio de saida.
5. Crie um banco Neon/Postgres pela Vercel Marketplace.
6. Execute [`database/schema.sql`](database/schema.sql) no SQL Editor do banco.
7. Adicione `POSTGRES_URL` nas variaveis de ambiente de Production, Preview e Development conforme a necessidade.
8. Faca um novo deploy.

O arquivo [`vercel.json`](vercel.json) redireciona rotas desconhecidas para `index.html`, mantendo o comportamento de SPA.

## Estrutura

```text
api/
  contact.ts       # recebe e salva mensagens do formulario
  content.ts       # entrega projetos, servicos, stack e configuracoes

database/
  schema.sql       # tabelas e dados iniciais

public/
  images/          # imagem publica do portfolio
  Curriculo-*.pdf  # curriculo para download
  favicon.svg

src/
  App.tsx          # interface, estados e integracao com as APIs
  main.tsx         # ponto de entrada React
  styles.css       # estilos responsivos e temas
  data/
    portfolio.json # fallback local e tipagem inicial
```

## Banco de dados

O schema cria cinco tabelas:

- `contact_messages`: nome, e-mail, telefone, mensagem e data do contato.
- `site_settings`: navegacao, redes sociais e dados empresariais em JSONB.
- `services`: servicos apresentados na pagina.
- `projects`: projetos, categorias, tecnologias, links e ordem de exibicao.
- `stack`: tecnologias e ferramentas exibidas na secao de stack.

Nao existe painel administrativo neste momento. Para editar o conteudo em producao, altere as tabelas pelo SQL Editor do Neon. O script inicial usa `ON CONFLICT` para nao duplicar registros ao ser executado novamente.

## APIs

### `POST /api/contact`

Salva uma mensagem de contato. O corpo esperado e:

```json
{
  "name": "Nome da pessoa",
  "email": "pessoa@exemplo.com",
  "phone": "(38) 99999-9999",
  "message": "Descricao do projeto"
}
```

Respostas principais:

- `201`: contato salvo.
- `400`: algum campo obrigatorio esta vazio ou invalido.
- `405`: metodo diferente de POST.
- `500`: erro de conexao ou persistencia.

### `GET /api/content`

Retorna navegacao, redes sociais, dados empresariais, servicos, projetos e stack. Se a consulta falhar, o frontend usa `src/data/portfolio.json`.

## Privacidade e consentimento

O site nao usa analytics, publicidade ou rastreamento. O consentimento exibido no banner se refere ao armazenamento local da escolha de preferencias e do tema. Os dados do formulario sao enviados para `/api/contact` e, em seguida, uma conversa e aberta no WhatsApp.

Os documentos de privacidade e de diretrizes ficam acessiveis no rodape. Eles sao uma base informativa e devem ser revisados por profissional juridico antes de um uso comercial de maior escala.

## Validacao

Antes de publicar, rode:

```bash
npm run build
```

O build executa o TypeScript do frontend e a compilacao do Vite. As funcoes serverless podem ser verificadas separadamente com:

```bash
npx tsc --noEmit --ignoreConfig --skipLibCheck --esModuleInterop --module ESNext --moduleResolution Bundler --target ES2020 api/contact.ts api/content.ts
```

## Observacoes

- Nunca coloque `POSTGRES_URL` no frontend ou em arquivos versionados.
- O banco deve ser protegido pelas variaveis de ambiente da Vercel.
- O endpoint publico de contato deve receber validacao, rate limit ou CAPTCHA antes de uma campanha publica para reduzir spam.
- O WhatsApp continua sendo o canal de conversa principal; o banco funciona como registro do lead.

## Seguranca aplicada

- Headers de seguranca na Vercel: CSP, `X-Frame-Options`, `nosniff`, politica de referencia e Permissions Policy.
- Validacao de origem, metodo HTTP, formato de e-mail e limite de tamanho dos campos.
- Rate limit basico de cinco tentativas por IP a cada dez minutos.
- Respostas de conteudo sem cache.

Para trafego maior, configure Vercel WAF ou um rate limit compartilhado com Redis/Upstash. O rate limit em memoria protege a instancia atual, mas nao substitui uma camada distribuida.

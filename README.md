# PlanejAI

PlanejAI é uma aplicação web desenvolvida durante o bootcamp Santander 2026 - AI & React, realizado pela DIO em parceria com o Santander. O projeto ajuda o usuário a planejar metas financeiras de forma prática, utilizando inteligência artificial para gerar insights personalizados a partir de renda, despesas, dívidas e objetivos.

## Sobre o projeto

A aplicação permite:

- cadastrar uma simulação financeira com dados como renda mensal, despesas fixas, dívidas e meta desejada;
- gerar um diagnóstico e sugestões personalizadas com a ajuda do Gemini;
- visualizar o histórico das simulações realizadas;
- acompanhar de forma intuitiva o progresso do planejamento.

## Arquitetura atual

A integração com o Gemini foi atualizada para utilizar uma Serverless Function da Vercel em [api/gemini.ts](api/gemini.ts). O frontend chama o endpoint `/api/gemini`, e a função é responsável por se comunicar com a API do Gemini em nome da aplicação.

Essa abordagem mantém a chave de API protegida no ambiente da Vercel.

## Tecnologias utilizadas

- React
- TypeScript
- Vite
- React Router DOM
- Tailwind CSS
- Vercel Serverless Functions
- Gemini API

## Pré-requisitos

Antes de começar, certifique-se de ter instalado:

- Node.js 20+
- npm ou pnpm

## Instalação

1. Clone o repositório:

```bash
git clone https://github.com/camilafbc/react-planejai.git
cd planejai
```

2. Instale as dependências:

```bash
npm install
```

3. Inicie o projeto em modo de desenvolvimento:

```bash
npm run dev
```

A aplicação estará disponível em `http://localhost:5173`.

## Variáveis de ambiente

### Ambiente local

Para rodar a aplicação localmente, você pode configurar as variáveis abaixo em um arquivo `.env.local`:

```env
GEMINI_API_KEY=sua_chave_aqui
MODEL_NAME=gemini-flash-latest
```

### Ambiente Vercel

Ao fazer o deploy na Vercel, defina as seguintes variáveis de ambiente no painel da plataforma:

- `GEMINI_API_KEY`: chave da API do Google Gemini utilizada pela Serverless Function
- `MODEL_NAME`: modelo utilizado, por exemplo `gemini-flash-latest`

> Para obter a chave, acesse o Google AI Studio e crie uma chave de API para o Gemini.

## Scripts disponíveis

- `npm run dev` — inicia o servidor de desenvolvimento
- `npm run build` — cria a build de produção
- `npm run lint` — executa a análise estática do código
- `npm run preview` — visualiza a build localmente

## Estrutura do projeto

A estrutura principal é organizada em:

- `src/components` — componentes da interface
- `src/pages` — páginas da aplicação
- `src/services` — integração com o frontend para a função de API
- `src/hooks` — lógicas reutilizáveis
- `src/data` — dados e prompts utilizados pela simulação
- `api` — Serverless Function responsável pela comunicação com o Gemini

## Licença

Este projeto é de uso educacional e foi desenvolvido como parte de um desafio de formação.

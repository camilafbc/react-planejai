# PlanejAI

PlanejAI é uma aplicação web desenvolvida durante o bootcamp Santander 2026 - AI & React, realizado pela DIO em parceria com o Santander. O projeto tem como objetivo ajudar o usuário a planejar metas financeiras de forma prática, utilizando inteligência artificial para gerar insights personalizados com base em renda, despesas, dívidas e objetivos.

## Sobre o projeto

A aplicação permite:

- cadastrar uma simulação financeira com dados como renda mensal, despesas fixas, dívidas e meta desejada;
- gerar um diagnóstico e sugestões personalizadas com a ajuda do Gemini;
- visualizar o histórico das simulações realizadas;
- acompanhar de forma intuitiva o progresso do planejamento.

## Tecnologias utilizadas

- React
- TypeScript
- Vite
- React Router DOM
- Tailwind CSS
- Gemini API

## Pré-requisitos

Antes de começar, certifique-se de ter instalado:

- Node.js 20+
- npm ou pnpm

## Instalação

1. Clone o repositório:

```bash
git clone https://github.com/seu-usuario/planejai.git
cd planejai
```

2. Instale as dependências:

```bash
npm install
```

3. Crie um arquivo de ambiente com a chave da API do Gemini:

```bash
cp .env.example .env.local
```

4. Edite o arquivo `.env.local` e adicione sua chave:

```env
VITE_GEMINI_API_KEY=sua_chave_aqui
```

5. Inicie o projeto em modo de desenvolvimento:

```bash
npm run dev
```

A aplicação estará disponível em `http://localhost:5173`.

## Variáveis de ambiente

Este projeto utiliza a seguinte variável de ambiente:

- `VITE_GEMINI_API_KEY`: chave da API do Google Gemini utilizada para gerar os insights das simulações.

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
- `src/services` — integração com a API do Gemini
- `src/hooks` — lógicas reutilizáveis
- `src/data` — dados e prompts utilizados pela simulação

## Licença

Este projeto é de uso educacional e foi desenvolvido como parte de um desafio de formação.

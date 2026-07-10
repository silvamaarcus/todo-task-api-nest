<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg" alt="Donate us"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow" alt="Follow us on Twitter"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

---

# Todo Task API

## Sumário

- [Visão Geral](#visão-geral)
- [Tecnologias Utilizadas](#tecnologias-utilizadas)
- [Arquitetura](#arquitetura)
- [Pré-requisitos](#pré-requisitos)
- [Como Rodar Localmente](#como-rodar-localmente)
- [Variáveis de Ambiente](#variáveis-de-ambiente)
- [Endpoints da API](#endpoints-da-api)
  - [Usuários / Autenticação](#usuários--autenticação)
  - [Tarefas](#tarefas)
- [Testes](#testes)

---

## Visão Geral

O **Todo Task API** é uma API REST para gerenciamento de tarefas pessoais. Com ela, cada usuário pode se registrar, fazer login e gerenciar suas próprias tarefas — criando, listando, atualizando e excluindo itens de forma segura.

A API foi construída com foco em boas práticas de desenvolvimento: código limpo, separação de responsabilidades e testes automatizados.

---

## Tecnologias Utilizadas

| Tecnologia | Versão | Descrição |
|---|---|---|
| **Node.js** | v22 | Ambiente de execução do JavaScript no servidor |
| **NestJS** | v11 | Framework para construir aplicações Node.js organizadas e escaláveis |
| **TypeScript** | v5 | Superset do JavaScript que adiciona tipagem estática ao código |
| **PostgreSQL** | latest | Banco de dados relacional onde as informações são armazenadas |
| **Docker** | — | Ferramenta para rodar o banco de dados em um contêiner isolado |
| **Prisma** | v5.22 | ORM (mapeador objeto-relacional) que facilita a comunicação com o banco de dados |
| **JWT** | — | JSON Web Token — mecanismo de autenticação baseado em tokens |
| **class-validator** | v0.15 | Biblioteca para validar os dados recebidos nas requisições |
| **Swagger** | v11 | Gera documentação interativa da API, acessível em `/docs` |
| **Jest + Supertest** | — | Ferramentas para escrever e executar testes unitários e de integração |
| **GitHub Actions** | — | Serviço de CI/CD para rodar testes e automações no GitHub |
| **Vercel** | — | Plataforma de deploy onde a aplicação é publicada |

---

## Arquitetura

O projeto segue os princípios da **Clean Architecture** (Arquitetura Limpa), dividida em três camadas principais. Essa separação garante que cada parte do código tenha uma única responsabilidade, tornando o projeto mais fácil de testar e manter.

```
src/
├── modules/          # Controllers — camada de entrada HTTP
├── domain/
│   ├── use-cases/    # Use Cases — regras de negócio da aplicação
│   └── repositories/ # Interfaces dos repositórios
└── infra/            # Repositórios — comunicação com o banco de dados
```

### Como as camadas se comunicam

```
Requisição HTTP
      ↓
  Controller        ← recebe a requisição e chama o Use Case
      ↓
  Use Case          ← aplica a regra de negócio e chama o Repositório
      ↓
  Repository        ← acessa o banco de dados (via Prisma)
      ↓
  Banco de Dados (PostgreSQL)
```

- **Controller**: É a porta de entrada da API. Recebe a requisição HTTP, extrai os dados (body, parâmetros, token) e repassa para o Use Case correto.
- **Use Case** (Caso de Uso): Contém a lógica de negócio. Por exemplo: "Para criar uma tarefa, o usuário precisa estar autenticado e o título não pode estar vazio."
- **Repository** (Repositório): É responsável por se comunicar com o banco de dados. O Use Case não sabe como os dados são salvos — ele só pede ao repositório para salvar.

---

## Pré-requisitos

Antes de começar, certifique-se de ter instalado em sua máquina:

- [Node.js v22+](https://nodejs.org/)
- [npm](https://www.npmjs.com/) (vem junto com o Node.js)
- [Docker](https://www.docker.com/) e [Docker Compose](https://docs.docker.com/compose/) (para subir o banco de dados)
- [Git](https://git-scm.com/) (para clonar o repositório)

---

## Como Rodar Localmente

Siga os passos abaixo para ter a API funcionando na sua máquina:

### 1. Clone o repositório

```bash
git clone https://github.com/silvamaarcus/todo-task-api-nest.git
cd todo-task-api-nest
```

### 2. Instale as dependências

```bash
npm install
```

### 3. Configure as variáveis de ambiente

Copie o arquivo de exemplo e preencha os valores:

```bash
cp .env.example .env
```

Edite o arquivo `.env` com suas configurações (veja a seção [Variáveis de Ambiente](#variáveis-de-ambiente) para mais detalhes).

Exemplo de `.env` para rodar localmente com o Docker Compose:

```env
DATABASE_URL="postgresql://postgres:password@localhost:5433/todo_nest"
JWT_ACCESS_TOKEN_SECRET="sua-chave-secreta-de-acesso"
JWT_REFRESH_TOKEN_SECRET="sua-chave-secreta-de-refresh"
PORT=3000
```

### 4. Suba o banco de dados com Docker

```bash
docker compose up -d
```

Isso iniciará dois contêineres PostgreSQL:
- `todo_nest_db` na porta `5433` — banco de dados principal
- `todo_nest_db_test` na porta `5434` — banco de dados para testes

### 5. Execute as migrations do banco de dados

As migrations criam as tabelas necessárias no banco de dados.

```bash
npx prisma migrate dev
```

### 6. Inicie o servidor em modo de desenvolvimento

```bash
npm run start:dev
```

A API estará disponível em: `http://localhost:3000`

A documentação interativa (Swagger) estará em: `http://localhost:3000/docs`

---

## Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto com as seguintes variáveis:

| Variável | Obrigatória | Descrição |
|---|---|---|
| `DATABASE_URL` | ✅ Sim | URL de conexão com o banco de dados PostgreSQL. Formato: `postgresql://usuario:senha@host:porta/nome_do_banco` |
| `JWT_ACCESS_TOKEN_SECRET` | ✅ Sim | Chave secreta usada para assinar o token de acesso (access token). Use uma string longa e aleatória. |
| `JWT_REFRESH_TOKEN_SECRET` | ✅ Sim | Chave secreta usada para assinar o token de atualização (refresh token). Use uma string diferente da anterior. |
| `PORT` | ❌ Não | Porta em que o servidor irá escutar. Valor padrão: `3000` |

```env
DATABASE_URL="postgresql://postgres:password@localhost:5433/todo_nest"
JWT_ACCESS_TOKEN_SECRET="sua-chave-secreta-de-acesso"
JWT_REFRESH_TOKEN_SECRET="sua-chave-secreta-de-refresh"
PORT=3000
```

> **Atenção:** Nunca compartilhe ou comite o arquivo `.env` no repositório. Ele já está listado no `.gitignore`.

---

## Endpoints da API

Todas as rotas são prefixadas com `/api`. A base URL local é `http://localhost:3000`.

> **Autenticação:** As rotas marcadas com 🔒 exigem um token JWT válido no header da requisição, no formato:
> ```
> Authorization: Bearer <seu_token_aqui>
> ```

---

### Usuários / Autenticação

#### `POST /api/auth/register` — Registrar novo usuário

Cria uma nova conta de usuário na aplicação.

- **Autenticação:** Não necessária

**Body da requisição:**

```json
{
  "first_name": "Marcus",
  "last_name": "Silva",
  "email": "marcus@email.com",
  "password": "123456"
}
```

| Campo | Tipo | Obrigatório | Descrição |
|---|---|---|---|
| `first_name` | string | ✅ | Primeiro nome do usuário |
| `last_name` | string | ✅ | Sobrenome do usuário |
| `email` | string | ✅ | E-mail válido e único |
| `password` | string | ✅ | Senha com no mínimo 6 caracteres |

**Resposta de sucesso — `201 Created`:**

```json
{
  "id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  "first_name": "Marcus",
  "last_name": "Silva",
  "email": "marcus@email.com",
  "created_at": "2026-07-09"
}
```

**Possíveis erros:**

| Status | Descrição |
|---|---|
| `400 Bad Request` | Dados inválidos (campo ausente, e-mail inválido, senha muito curta) |
| `409 Conflict` | E-mail já cadastrado |

---

#### `POST /api/auth/login` — Fazer login

Autentica o usuário e retorna um token JWT para ser usado nas próximas requisições.

- **Autenticação:** Não necessária

**Body da requisição:**

```json
{
  "email": "marcus@email.com",
  "password": "123456"
}
```

| Campo | Tipo | Obrigatório | Descrição |
|---|---|---|---|
| `email` | string | ✅ | E-mail cadastrado |
| `password` | string | ✅ | Senha do usuário |

**Resposta de sucesso — `200 OK`:**

```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

> **Importante:** Guarde o valor de `access_token`. Você precisará enviá-lo no header `Authorization` de todas as rotas protegidas.

**Possíveis erros:**

| Status | Descrição |
|---|---|
| `400 Bad Request` | Dados inválidos (campo ausente ou e-mail inválido) |
| `401 Unauthorized` | E-mail ou senha incorretos |

---

### Tarefas

Todas as rotas de tarefas requerem autenticação 🔒. O token JWT identifica o usuário e garante que ele acesse apenas suas próprias tarefas.

---

#### `POST /api/tasks` — Criar tarefa 🔒

Cria uma nova tarefa para o usuário autenticado.

**Header obrigatório:**
```
Authorization: Bearer <seu_token_aqui>
```

**Body da requisição:**

```json
{
  "title": "Estudar NestJS",
  "description": "Ler a documentação oficial do NestJS",
  "status": "TODO"
}
```

| Campo | Tipo | Obrigatório | Descrição |
|---|---|---|---|
| `title` | string | ✅ | Título da tarefa (máximo 200 caracteres) |
| `description` | string | ❌ | Descrição da tarefa (máximo 500 caracteres) |
| `status` | string | ❌ | Status da tarefa. Valores possíveis: `TODO`, `IN_PROGRESS`, `DONE`. Padrão: `TODO` |

**Resposta de sucesso — `201 Created`:**

```json
{
  "id": "f1e2d3c4-b5a6-7890-cdef-012345678901",
  "title": "Estudar NestJS",
  "description": "Ler a documentação oficial do NestJS",
  "status": "TODO",
  "created_at": "2026-07-09",
  "user_id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890"
}
```

**Possíveis erros:**

| Status | Descrição |
|---|---|
| `400 Bad Request` | Dados inválidos (título ausente, status inválido) |
| `401 Unauthorized` | Token ausente ou inválido |

---

#### `GET /api/tasks` — Listar todas as tarefas 🔒

Retorna todas as tarefas do usuário autenticado.

**Header obrigatório:**
```
Authorization: Bearer <seu_token_aqui>
```

**Resposta de sucesso — `200 OK`:**

```json
[
  {
    "id": "f1e2d3c4-b5a6-7890-cdef-012345678901",
    "title": "Estudar NestJS",
    "description": "Ler a documentação oficial do NestJS",
    "status": "TODO",
    "created_at": "2026-07-09",
    "user_id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890"
  },
  {
    "id": "a9b8c7d6-e5f4-3210-abcd-fedcba987654",
    "title": "Revisar Pull Request",
    "description": null,
    "status": "IN_PROGRESS",
    "created_at": "2026-07-09",
    "user_id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890"
  }
]
```

**Possíveis erros:**

| Status | Descrição |
|---|---|
| `401 Unauthorized` | Token ausente ou inválido |

---

#### `GET /api/tasks/:id` — Buscar tarefa por ID 🔒

Retorna os detalhes de uma tarefa específica pelo seu ID.

**Header obrigatório:**
```
Authorization: Bearer <seu_token_aqui>
```

**Parâmetro de rota:**

| Parâmetro | Tipo | Descrição |
|---|---|---|
| `id` | string (UUID) | ID único da tarefa |

**Exemplo de requisição:**
```
GET /api/tasks/f1e2d3c4-b5a6-7890-cdef-012345678901
```

**Resposta de sucesso — `200 OK`:**

```json
{
  "id": "f1e2d3c4-b5a6-7890-cdef-012345678901",
  "title": "Estudar NestJS",
  "description": "Ler a documentação oficial do NestJS",
  "status": "TODO",
  "created_at": "2026-07-09",
  "user_id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890"
}
```

**Possíveis erros:**

| Status | Descrição |
|---|---|
| `401 Unauthorized` | Token ausente ou inválido |
| `404 Not Found` | Tarefa não encontrada ou não pertence ao usuário |

---

#### `PATCH /api/tasks/:id` — Atualizar tarefa 🔒

Atualiza os dados de uma tarefa existente. Todos os campos são opcionais — envie apenas o que deseja alterar.

**Header obrigatório:**
```
Authorization: Bearer <seu_token_aqui>
```

**Parâmetro de rota:**

| Parâmetro | Tipo | Descrição |
|---|---|---|
| `id` | string (UUID) | ID único da tarefa |

**Body da requisição:**

```json
{
  "title": "Estudar NestJS — Avançado",
  "status": "IN_PROGRESS"
}
```

| Campo | Tipo | Obrigatório | Descrição |
|---|---|---|---|
| `title` | string | ❌ | Novo título (máximo 200 caracteres) |
| `description` | string | ❌ | Nova descrição (máximo 500 caracteres) |
| `status` | string | ❌ | Novo status: `TODO`, `IN_PROGRESS` ou `DONE` |

**Resposta de sucesso — `200 OK`:**

```json
{
  "id": "f1e2d3c4-b5a6-7890-cdef-012345678901",
  "title": "Estudar NestJS — Avançado",
  "description": "Ler a documentação oficial do NestJS",
  "status": "IN_PROGRESS",
  "created_at": "2026-07-09",
  "user_id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890"
}
```

**Possíveis erros:**

| Status | Descrição |
|---|---|
| `400 Bad Request` | Dados inválidos (status inválido, campo com formato incorreto) |
| `401 Unauthorized` | Token ausente ou inválido |
| `404 Not Found` | Tarefa não encontrada ou não pertence ao usuário |

---

#### `DELETE /api/tasks/:id` — Deletar tarefa 🔒

Remove permanentemente uma tarefa pelo seu ID.

**Header obrigatório:**
```
Authorization: Bearer <seu_token_aqui>
```

**Parâmetro de rota:**

| Parâmetro | Tipo | Descrição |
|---|---|---|
| `id` | string (UUID) | ID único da tarefa a ser removida |

**Exemplo de requisição:**
```
DELETE /api/tasks/f1e2d3c4-b5a6-7890-cdef-012345678901
```

**Resposta de sucesso — `200 OK`:**

```json
{
  "message": "Tarefa deletada com sucesso."
}
```

**Possíveis erros:**

| Status | Descrição |
|---|---|
| `401 Unauthorized` | Token ausente ou inválido |
| `404 Not Found` | Tarefa não encontrada ou não pertence ao usuário |

---

## Testes

O projeto possui dois tipos de testes automatizados:

### Testes Unitários

Testam cada Use Case de forma isolada, verificando se as regras de negócio estão corretas sem depender do banco de dados real.

```bash
# Rodar todos os testes unitários
npm run test

# Rodar em modo watch (re-executa ao salvar arquivos)
npm run test:watch

# Gerar relatório de cobertura de testes
npm run test:cov
```

O relatório de cobertura será gerado na pasta `coverage/`. Abra `coverage/lcov-report/index.html` no navegador para visualizar.

### Testes End-to-End (E2E)

Testam a aplicação de ponta a ponta — fazem requisições HTTP reais e verificam as respostas, usando o banco de dados de teste (porta `5434`).

Antes de rodar os testes E2E, certifique-se de que o Docker está rodando e configure o arquivo `.env.test` com a URL do banco de dados de teste:

```env
DATABASE_URL="postgresql://postgres:password@localhost:5434/todo_nest"
JWT_ACCESS_TOKEN_SECRET="chave-secreta-para-testes"
JWT_REFRESH_TOKEN_SECRET="chave-refresh-para-testes"
```

```bash
# Rodar os testes E2E
npm run test:e2e
```

> Os testes E2E usam o arquivo de configuração `test/jest-e2e.json` e são executados em modo sequencial (`--runInBand`) para evitar conflitos no banco de dados.

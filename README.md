# ZettaD2 — Desafio II (To‑Do List API)

API REST para gerenciamento de tarefas com **autenticação**, **CRUD** e **isolamento de dados por usuário** via **RLS** no Supabase.

## Tecnologias

- **Next.js 14+** (App Router + Route Handlers em `app/api/...`)
- **TypeScript** (strict)
- **Supabase** (PostgreSQL + Auth + JWT)
- **Zod** (validação de entrada)
- **Dockerfile** (build de produção)

## Requisitos atendidos

- **Autenticação**: cadastro e login via Supabase Auth (JWT).
- **CRUD de tarefas**: criar, listar, atualizar e deletar.
- **Filtros**: listagem por status (`pending` | `done`).
- **Segurança**: acesso restrito ao dono do dado via **Row Level Security (RLS)** no banco.

## Modelagem e RLS (Supabase)

1. No Supabase, abra o **SQL Editor** e execute:
   - `supabase/sql/001_tasks_rls.sql`
2. O script cria:
   - Tabela `public.tasks`
   - Enum `task_status` (`pending`, `done`)
   - Índices para performance
   - Policies RLS garantindo `auth.uid() = user_id`

## Variáveis de ambiente

Crie `.env.local` conforme `docs/ENVIRONMENT.md`.

## Como rodar localmente

```bash
npm install
npm run dev
```

Healthcheck:

```bash
curl -s http://localhost:3000/api/health
```

## Autenticação (Auth)

### Signup

```bash
curl -s -X POST \
  -H "Content-Type: application/json" \
  -d '{"email":"voce@exemplo.com","password":"UmaSenhaForte123"}' \
  "http://localhost:3000/api/auth/signup"
```

### Login (obter `access_token`)

```bash
curl -s -X POST \
  -H "Content-Type: application/json" \
  -d '{"email":"voce@exemplo.com","password":"UmaSenhaForte123"}' \
  "http://localhost:3000/api/auth/login"
```

O token vem em `data.session.access_token`.

## Tarefas (Tasks)

> Para todas as rotas abaixo, envie `Authorization: Bearer <access_token>`.

### Listar tarefas

```bash
curl -s \
  -H "Authorization: Bearer <access_token>" \
  "http://localhost:3000/api/tasks"
```

#### Filtrar por status

```bash
curl -s \
  -H "Authorization: Bearer <access_token>" \
  "http://localhost:3000/api/tasks?status=pending"
```

### Criar tarefa

```bash
curl -s -X POST \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <access_token>" \
  -d '{"title":"Estudar RLS","description":"Revisar policies","status":"pending"}' \
  "http://localhost:3000/api/tasks"
```

### Atualizar tarefa

```bash
curl -s -X PUT \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <access_token>" \
  -d '{"status":"done"}' \
  "http://localhost:3000/api/tasks/<TASK_ID>"
```

### Deletar tarefa

```bash
curl -s -X DELETE \
  -H "Authorization: Bearer <access_token>" \
  "http://localhost:3000/api/tasks/<TASK_ID>"
```

## Docker (opcional)

```bash
docker build -t zettad2 .
docker run --rm -p 3000:3000 --env-file .env.local zettad2
```


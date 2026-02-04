# ZettaD2

Desafio II — **To-Do List API** com **Next.js 14 (App Router)** + **Supabase (PostgreSQL + Auth + RLS)**.

## Stack

- **Next.js 14+** (Route Handlers em `app/api/...`)
- **TypeScript** (strict)
- **Supabase** (Auth + PostgreSQL)
- **Zod** (validação)
- **Dockerfile** (build de produção desejável)

## Pré-requisitos

- Node.js 20+
- Uma instância no Supabase

## Configuração do Supabase (SQL + RLS)

1. No Supabase, abra o **SQL Editor** e rode:
   - `supabase/sql/001_tasks_rls.sql`
2. Confirme que a tabela `public.tasks` está com **RLS habilitado** e as policies criadas.

## Variáveis de ambiente

Crie `.env.local` na raiz do projeto conforme `docs/ENVIRONMENT.md`.

## Rodar localmente

```bash
npm install
npm run dev
```

Healthcheck:

```bash
curl -s http://localhost:3000/api/health
```

## API (Tasks)

> A API exige usuário autenticado no Supabase. A segurança de “somente meus dados” é garantida **no banco** via RLS.

## Auth (Supabase)

### Signup

```bash
curl -s -X POST \
  -H "Content-Type: application/json" \
  -d '{"email":"voce@exemplo.com","password":"UmaSenhaForte123"}' \
  "http://localhost:3000/api/auth/signup"
```

### Login (pegar JWT)

```bash
curl -s -X POST \
  -H "Content-Type: application/json" \
  -d '{"email":"voce@exemplo.com","password":"UmaSenhaForte123"}' \
  "http://localhost:3000/api/auth/login"
```

O `access_token` vem em `data.session.access_token`.

### Listar tarefas

```bash
curl -s \
  -H "Authorization: Bearer <SUPABASE_JWT>" \
  "http://localhost:3000/api/tasks"
```

Filtro por status:

```bash
curl -s \
  -H "Authorization: Bearer <SUPABASE_JWT>" \
  "http://localhost:3000/api/tasks?status=pending"
```

### Criar tarefa

```bash
curl -s -X POST \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <SUPABASE_JWT>" \
  -d '{"title":"Estudar RLS","description":"Revisar policies","status":"pending"}' \
  "http://localhost:3000/api/tasks"
```

### Atualizar tarefa

```bash
curl -s -X PUT \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <SUPABASE_JWT>" \
  -d '{"status":"done"}' \
  "http://localhost:3000/api/tasks/<TASK_ID>"
```

### Deletar tarefa

```bash
curl -s -X DELETE \
  -H "Authorization: Bearer <SUPABASE_JWT>" \
  "http://localhost:3000/api/tasks/<TASK_ID>"
```

## Docker (opcional)

```bash
docker build -t zettad2 .
docker run --rm -p 3000:3000 --env-file .env.local zettad2
```


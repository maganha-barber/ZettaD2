# ERD — To-Do List API

```mermaid
erDiagram
  AUTH_USERS ||--o{ TASKS : owns

  AUTH_USERS {
    uuid id PK
  }

  TASKS {
    uuid id PK
    timestamptz created_at
    text title
    text description
    task_status status
    uuid user_id FK
  }
```

## Notas

- A FK `tasks.user_id -> auth.users.id` garante integridade do dono da tarefa.
- O isolamento por usuário é garantido via **RLS** com `auth.uid() = user_id` (ver `supabase/sql/001_tasks_rls.sql`).


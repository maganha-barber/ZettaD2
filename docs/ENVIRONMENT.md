# Variáveis de ambiente

Crie um arquivo `.env.local` na raiz do projeto (não versionado) com:

```bash
NEXT_PUBLIC_SUPABASE_URL="https://SEU-PROJETO.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="SUA_ANON_KEY"
```

## Notas de segurança (Estilo Ragi)

- Nunca commite chaves; mantenha tudo no `.env.local` ou nas variáveis do ambiente da Vercel.
- A segurança de acesso aos dados é garantida no banco via RLS (ver `supabase/sql/001_tasks_rls.sql`).

